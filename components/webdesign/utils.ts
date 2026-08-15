/**
 * Helpers partagés entre le récapitulatif, l'aperçu live et la génération
 * du site final (liens WhatsApp, réseaux sociaux, carte Google Maps).
 */

/** Numéro WhatsApp normalisé : chiffres uniquement (retire espaces, +, -, parenthèses). */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

/** Lien wa.me vers un numéro, avec message optionnel pré-rempli. */
export function waLink(phone: string, text?: string): string {
  const digits = normalizePhone(phone)
  if (!digits) return '#'
  const base = `https://wa.me/${digits}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/** Lien Instagram à partir du pseudo (ex: "@moncompte" → https://instagram.com/moncompte). */
export function instagramUrl(handle: string): string {
  const clean = handle.replace(/^@/, '').trim()
  return clean ? `https://www.instagram.com/${clean}` : ''
}

/** Lien Facebook à partir du pseudo. */
export function facebookUrl(handle: string): string {
  const clean = handle.trim()
  return clean ? `https://www.facebook.com/${clean}` : ''
}

/** URL d'embed Google Maps à partir d'une adresse libre. */
export function mapsEmbedUrl(address: string): string {
  if (!address.trim()) return ''
  return `https://www.google.com/maps?q=${encodeURIComponent(address.trim())}&output=embed`
}

/** Nom court sans accent ni caractères spéciaux — utilisé pour le nom du fichier exporté. */
export function slugify(value: string): string {
  const s = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return s || 'mon-site'
}
