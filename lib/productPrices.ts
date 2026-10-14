// Source unique des prix du panier (en centimes), partagée par la fiche
// produit, les cartes /produits, le panier et la validation Stripe côté
// serveur. Les prix de référence sont ceux des fiches produit.
//
// `productId` = id de la ligne Product en base quand elle existe : la fiche
// et la carte ajoutent alors le même article au panier (pas de doublon) et
// la commande garde son lien vers le produit.

interface CatalogPrice {
  productId?: string
  /** Montant facturé au panier, en centimes (1er mois pour un abonnement mensuel) */
  price: number
  /** Abonnement mensuel : le client ne paie que le premier mois au panier */
  billing?: 'monthly'
  /** Pas d'achat en ligne : bouton « Contactez-nous » à la place du panier */
  contactOnly?: boolean
}

export const CATALOG_PRICES: Record<string, CatalogPrice> = {
  'redesign-site-vitrine': { productId: '1ec3e118-bb19-4d97-998e-cf4736839910', price: 79900 },
  'creation-site-vitrine': { productId: 'd9072f7d-6f09-44af-8dec-a9443c75f865', price: 149900 },
  'chatbot-client-intelligent': { productId: '8a8677a3-c519-4f40-9464-940b2cfcdc09', price: 29900, contactOnly: true },
  'click-and-delivery': { productId: 'b1665121-e8c3-44a9-baa4-52126e9456c4', price: 149900 },
  'click-and-collect': { price: 99900 },
  'talkie-walkie-connecte': { productId: 'ae2ac1ef-1b73-4f86-bc9f-63a3977aa9d3', price: 249900 },
  'serenite': { productId: '256ecb1e-d92a-469c-91da-24a5215af2ca', price: 999, billing: 'monthly' },
  // Tarif sur devis (application seule / avec bracelet / avec bague)
  'easyphone': { productId: 'f82fb9db-6170-4fb7-9ff9-1be9b426dd65', price: 0, contactOnly: true },
  'paperasse': { productId: '58774735-9b1c-403e-86ff-053e7e092fa0', price: 0 },
  'gestion-production': { productId: '43b9b372-c137-454d-8033-acdbe9feb098', price: 99900, contactOnly: true },
  'webdesign-149': { price: 14900 },
  'easyreadvoice': { productId: '1020f90c-7355-4353-8e45-907777cdeffd', price: 199 },
}

// Offres de la page /produits/recherche-prospect-claude (id panier `${slug}-${contacts}`)
export const PROSPECT_TIER_PRICES: Record<string, number> = {
  'recherche-prospect-claude-10': 499,
  'recherche-prospect-claude-30': 990,
  'recherche-prospect-claude-50': 1490,
}

// Forfaits QRcall affichés dans la fiche /produits/qrcall-scan-call (id panier sans préfixe)
export const QRCALL_PLAN_PRICES: Record<string, number> = {
  'qrcall-1': 499,
  'qrcall-5': 1299,
  'qrcall-10': 1999,
}

export function getCartIdForSlug(slug: string): string {
  return CATALOG_PRICES[slug]?.productId || `slug-${slug}`
}

const ENTRY_BY_CART_ID: Record<string, CatalogPrice> = Object.fromEntries(
  Object.entries(CATALOG_PRICES).flatMap(([slug, entry]) => [
    [`slug-${slug}`, entry],
    ...(entry.productId ? [[entry.productId, entry]] : []),
  ])
)

// Prix de référence d'un article du panier, ou undefined si le catalogue ne
// le connaît pas (le prix vient alors de la base, ex. EasyReadVoice, QRcall).
export function getCatalogPrice(cartId: string): number | undefined {
  return PROSPECT_TIER_PRICES[cartId] ?? QRCALL_PLAN_PRICES[cartId] ?? ENTRY_BY_CART_ID[cartId]?.price
}

export function isMonthly(cartId: string): boolean {
  return ENTRY_BY_CART_ID[cartId]?.billing === 'monthly'
}

export function isContactOnly(cartId: string): boolean {
  return ENTRY_BY_CART_ID[cartId]?.contactOnly === true
}

const MONTHLY_LABEL: Record<string, { perMonth: string; firstMonth: string }> = {
  fr: { perMonth: '/mois', firstMonth: '1er mois' },
  en: { perMonth: '/month', firstMonth: 'first month' },
  pt: { perMonth: '/mês', firstMonth: '1.º mês' },
  es: { perMonth: '/mes', firstMonth: 'primer mes' },
}

export function getMonthlyLabel(lang: string): { perMonth: string; firstMonth: string } {
  return MONTHLY_LABEL[lang] || MONTHLY_LABEL.fr
}

const CONTACT_LABEL: Record<string, string> = {
  fr: 'Contactez-nous',
  en: 'Contact us',
  pt: 'Contacte-nos',
  es: 'Contáctenos',
}

export function getContactLabel(lang: string): string {
  return CONTACT_LABEL[lang] || CONTACT_LABEL.fr
}

const QUOTE_LABEL: Record<string, string> = {
  fr: 'Sur devis',
  en: 'On quote',
  pt: 'Sob orçamento',
  es: 'Bajo presupuesto',
}

/** Libellé affiché à la place d'un prix nul pour un produit sur devis */
export function getQuoteLabel(lang: string): string {
  return QUOTE_LABEL[lang] || QUOTE_LABEL.fr
}
