// Images de secours servies depuis public/images/produits/ pour les
// produits dont la fiche Supabase n'a pas (encore) d'image renseignée.
const STATIC_PRODUCT_IMAGES: Record<string, string> = {
  'redesign-site-vitrine': '/images/produits/redesign_site.webp',
  'creation-site-vitrine': '/images/produits/creation_site.webp',
  'chatbot-client-intelligent': '/images/produits/chatbot.webp',
  'click-and-collect': '/images/produits/clickandcollect.webp',
  'talkie-walkie-connecte': '/images/produits/talkiewalkie.webp',
  'serenite': '/images/produits/serenite.webp',
  'paperasse': '/images/produits/paperasse.webp',
  'gestion-production': '/images/produits/application_de_gestion_de_production.webp',
  'easyreadvoice': '/images/produits/easyreadvoice.webp',
  'qrcall-scan-call': '/images/produits/qrcall.webp',
}

export function getStaticProductImage(slug: string | undefined): string {
  if (!slug) return ''
  return STATIC_PRODUCT_IMAGES[slug] || ''
}
