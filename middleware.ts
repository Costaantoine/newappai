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

  // === RATE LIMITING + ANTI-CACHE (API contenu) ===
  // /api/supabase/* et /api/texts : rate limit 120 req/min/IP + Cache-Control no-store.
  // Exemption SSR SÉCURISÉE : les fetch internes (Server Components) envoient le header
  // x-internal-secret dont la valeur (INTERNAL_FETCH_SECRET, .env, jamais NEXT_PUBLIC)
  // est comparée STRICTEMENT. Sans le secret exact, la requête est rate-limitée
  // normalement — un attaquant qui devine le nom du header mais pas la valeur ne
  // contourne rien. (Comparaison simple : le middleware tourne en Edge runtime où
  // node:crypto.timingSafeEqual n'est pas disponible ; le risque de timing attack est
  // négligeable face à un secret de 64 hex.)
  // La réponse 429 porte AUSSI no-store : sans Cache-Control, le navigateur stockerait
  // les 429 par cache heuristique et réutiliserait l'erreur au F5 suivant (bug
  // « F5 casse / Ctrl+F5 marche »).
  if (pathname.startsWith('/api/supabase') || pathname === '/api/texts') {
    const internalSecret = process.env.INTERNAL_FETCH_SECRET
    const headerSecret = request.headers.get('x-internal-secret')
    const isInternal = !!internalSecret && !!headerSecret && headerSecret === internalSecret

    if (!isInternal) {
      const ip = getClientIp(request)
      const { allowed } = checkRateLimit(ip, { limit: 120, windowMs: 60_000, prefix: 'supabase' })

      if (!allowed) {
        return NextResponse.json(
          { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
          {
            status: 429,
            headers: { 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate' },
          }
        )
      }
    }

    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
    return response
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
    '/api/texts',
  ],
}
