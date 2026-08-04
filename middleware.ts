import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { detectCountryFromIP } from '@/lib/geoDetection'

// Pays → langue (code ISO 3166-1 alpha-2)
const COUNTRY_LANG: Record<string, string> = {
  PT: 'pt',   // Portugal
  ES: 'es',   // Spain
  FR: 'fr',   // France
}

// Langue → chemin racine
const LANG_PATH: Record<string, string> = {
  fr: '/',
  en: '/en',
  pt: '/pt',
  es: '/es',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // === GÉOLOCALISATION PAR IP (Phase 1) ===
  // Ne s'exécute que sur les pages de langue racine
  const isLangPage = pathname === '/' || pathname === '/en' || pathname === '/es' || pathname === '/pt'

  if (isLangPage) {
    const cookieLang = request.cookies.get('lang')?.value

    if (!cookieLang) {
      // Détecter le pays via l'IP du visiteur (api ip-api.com gratuite)
      const ip = getClientIp(request)
      const targetLang = await detectCountryFromIP(ip)
      const targetPath = LANG_PATH[targetLang] || '/en'

      // Ne rediriger que si on n'est pas déjà sur le bon chemin
      if (pathname !== targetPath) {
        const url = request.nextUrl.clone()
        url.pathname = targetPath
        url.search = request.nextUrl.search
        const redirectResponse = NextResponse.redirect(url)
        redirectResponse.cookies.set('lang', targetLang, {
          maxAge: 60 * 60 * 24 * 365, // 1 an
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
        return redirectResponse
      }

      // Déjà sur le bon chemin : sauvegarder le cookie pour éviter les prochaines vérifications
      const response = NextResponse.next()
      response.cookies.set('lang', targetLang, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      return response
    }

    // Cookie présent → le choix utilisateur prime TOUJOURS.
    // Ne jamais réécrire le cookie en fonction du path : le sélecteur de langue
    // (client) écrit cookie + localStorage, et les pages SSR lisent le cookie.
    // L'ancienne logique forçait le cookie selon le path (ex: / avec cookie lang=es
    // → lang forcé à fr) et détruisait le choix utilisateur à chaque navigation.
    return NextResponse.next()
  }

  // === RATE LIMITING (existant) ===
  if (pathname.startsWith('/api/supabase')) {
    const ip = getClientIp(request)
    // Quota 60 req/min/IP : une navigation normale multi-pages consomme ~18-20 requêtes
    // /api/supabase (texts + zones + settings + products par page) ; 30 était trop serré
    // et déclenchait des 429 pour un usage réel (F5 répétés, navigation complète).
    const { allowed } = checkRateLimit(ip, { limit: 60, windowMs: 60_000, prefix: 'supabase' })

    if (!allowed) {
      return NextResponse.json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }, { status: 429 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/en',
    '/es',
    '/pt',
    '/admin/:path*',
    '/api/supabase/:path*',
  ],
}
