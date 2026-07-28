/**
 * IP-based geolocation using ip-api.com (gratuit, sans clé)
 * 45 req/min, largement suffisant pour les premières visites
 */

// Cache en mémoire des IP → countryCode (durée de vie 24h)
const geoCache = new Map<string, { country: string; expiresAt: number }>()

// Pays → langue
const COUNTRY_LANG: Record<string, string> = {
  PT: 'pt',
  ES: 'es',
  FR: 'fr',
  BR: 'pt', // Brésil → portugais
  AO: 'pt', // Angola → portugais
  MZ: 'pt', // Mozambique → portugais
  AR: 'es', // Argentine → espagnol
  MX: 'es', // Mexique → espagnol
  CO: 'es', // Colombie → espagnol
  CL: 'es', // Chili → espagnol
  BE: 'fr', // Belgique → français
  CH: 'fr', // Suisse → français
  CA: 'fr', // Canada → français (majorité)
  LU: 'fr', // Luxembourg → français
}

// Langue par défaut pour les pays non listés
const DEFAULT_LANG = 'en'

export async function detectCountryFromIP(ip: string): Promise<string> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return DEFAULT_LANG
  }

  // Vérifier le cache
  const cached = geoCache.get(ip)
  if (cached && cached.expiresAt > Date.now()) {
    return COUNTRY_LANG[cached.country] || DEFAULT_LANG
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(3000), // timeout 3s
    })
    if (!res.ok) return DEFAULT_LANG
    const data = await res.json()
    const country = data.countryCode || ''

    // Mettre en cache (24h)
    geoCache.set(ip, { country, expiresAt: Date.now() + 24 * 60 * 60 * 1000 })

    return COUNTRY_LANG[country] || DEFAULT_LANG
  } catch {
    // Timeout ou erreur → fallback à l'anglais
    return DEFAULT_LANG
  }
}
