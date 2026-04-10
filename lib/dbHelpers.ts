/**
 * Helpers pour la compatibilité SQLite/PostgreSQL
 * SQLite ne supporte pas les tableaux natifs → on stocke en JSON string
 * PostgreSQL supporte nativement String[]
 *
 * En production (PostgreSQL), ces fonctions sont transparentes.
 * En dev local (SQLite), elles sérialisent/désérialisent les tableaux.
 */

const isSQLite = process.env.DATABASE_URL?.startsWith('file:')

/** Convertit un tableau pour le stockage (String[] → string si SQLite) */
export function serializeImages(images: string[]): string | string[] {
  if (isSQLite) return JSON.stringify(images)
  return images
}

/** Convertit une valeur de la DB vers un tableau JS */
export function deserializeImages(images: unknown): string[] {
  if (typeof images === 'string') {
    try { return JSON.parse(images) } catch { return [] }
  }
  if (Array.isArray(images)) return images
  return []
}

/** Normalise un produit en sortie d'API (images toujours en tableau) */
export function normalizeProduct<T extends { images: unknown }>(product: T): T & { images: string[] } {
  return { ...product, images: deserializeImages(product.images) }
}
