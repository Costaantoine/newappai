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

    // Cookie présent : vérifier la cohérence
    // Si le cookie dit 'fr' mais qu'on est sur /en, ne pas interférer
    // (l'utilisateur a changé manuellement via le sélecteur de langue)
    if (
      (pathname === '/' && cookieLang !== 'fr') ||
      (pathname.startsWith('/en') && cookieLang !== 'en') ||
      (pathname.startsWith('/es') && cookieLang !== 'es') ||
      (pathname.startsWith('/pt') && cookieLang !== 'pt')
    ) {
      // L'utilisateur est sur une page qui ne correspond pas à son cookie
      // → mettre à jour le cookie pour refléter son choix
      const detectedLang = pathname === '/' ? 'fr'
        : pathname === '/en' ? 'en'
        : pathname === '/es' ? 'es'
        : 'pt'

      const response = NextResponse.next()
      response.cookies.set('lang', detectedLang, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      return response
    }

    // Cookie présent et cohérent → continuer sans action
    return NextResponse.next()
  }

  // === RATE LIMITING (existant) ===
  if (pathname.startsWith('/api/supabase')) {
    const ip = getClientIp(request)
    const { allowed } = checkRateLimit(ip, { limit: 30, windowMs: 60_000, prefix: 'supabase' })

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
