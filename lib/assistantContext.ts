import { prisma } from './prisma'

export interface ProductInfo {
  title: string
  description: string
  price: number
  category: string
}

export async function getProductsContext(): Promise<string> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { title: true, description: true, price: true, category: true },
    })

    if (!products || products.length === 0) {
      return 'Aucun produit disponible actuellement.'
    }

    const productList = products.map((p) => {
      const priceEur = (p.price / 100).toFixed(2)
      return `- ${p.title} (${p.category || 'Non catégorisé'}): ${p.price ? priceEur + '€' : 'Prix sur demande'} - ${p.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'Pas de description'}`
    }).join('\n')

    return productList
  } catch (error) {
    console.error('Error fetching products:', error)
    return 'Produits non disponibles.'
  }
}

export function buildSystemPrompt(productsContext: string, lang: 'fr' | 'en'): string {
  const basePrompt = lang === 'fr'
    ? `Tu es l'assistant virtuel du site NewAppAI.
Tu réponds UNIQUEMENT en te basant sur les informations des produits et services présents sur ce site.
Si une information ne figure pas sur le site, tu réponds :
"Je n'ai pas cette information, je vous invite à nous contacter via le formulaire."
Tu es capable de répondre en français et en anglais selon la langue de l'utilisateur.
Tu ne parles jamais d'autres sites, concurrents, ou informations externes.
Tu peux aider l'utilisateur à remplir le formulaire de contact.

INFORMATIONS SUR LE SITE:
NewAppAI est une entreprise spécialisée dans les solutions logicielles intelligentes.

NOS SERVICES PRINCIPAUX:
- Pôle Commerce (DigiSmart Solutions): Solutions pour restaurants et commerces
  * Click & Collect: Gestion des commandes en ligne avec retrait en magasin
  * Réservations: Système de réservation pour professionnels
  * IA Téléphonique: Assistant vocal automatique (en développement)
  * Suivi Live GPS: Suivi des livraisons en temps réel (en développement)
  * Borne de Commande: Terminal interactif pour clients (en développement)
  * Paiement Intégré: Paiement en ligne sécurisé (en développement)

- Pôle Industrie (Smart Factory):
  * MB: Solution de gestion d'atelier et suivi de production
  * Talkie-Pro: Communication instantanée entre équipes

PRODUITS DISPONIBLES:
${productsContext}

RÈGLES:
1. Si l'utilisateur veut acheter ou a des questions sur un produit spécifique, propose-lui de remplir le formulaire de contact.
2. Si l'utilisateur demande un prix, donne-le si disponible.
3. Reste cordial et professionnel.
4. Si tu ne connais pas la réponse, dirige vers le formulaire de contact.`
    : `You are the virtual assistant for NewAppAI website.
You answer ONLY based on information about products and services on this site.
If information is not on the site, reply:
"I don't have this information, I invite you to contact us via the form."
You can respond in French and English based on the user's language.
You never talk about other sites, competitors, or external information.
You can help the user fill out the contact form.

SITE INFORMATION:
NewAppAI is a company specializing in intelligent software solutions.

OUR MAIN SERVICES:
- Commerce Hub (DigiSmart Solutions): Solutions for restaurants and retail
  * Click & Collect: Online order management with in-store pickup
  * Reservations: Reservation system for professionals
  * AI Phone Assistant: Automatic voice assistant (in development)
  * Live GPS Tracking: Real-time delivery tracking (in development)
  * Order Kiosk: Interactive terminal for customers (in development)
  * Integrated Payment: Secure online payment (in development)

- Industry Hub (Smart Factory):
  * MB: Workshop management and production tracking solution
  * Talkie-Pro: Instant communication between teams

AVAILABLE PRODUCTS:
${productsContext}

RULES:
1. If the user wants to buy or has questions about a specific product, suggest filling out the contact form.
2. If the user asks for a price, provide it if available.
3. Remain courteous and professional.
4. If you don't know the answer, direct to the contact form.`

  return basePrompt
}

export function detectContactIntent(message: string, lang: 'fr' | 'en'): {
  suggestContact: boolean
  subject?: string
  messageSummary?: string
} {
  const lowerMessage = message.toLowerCase()

  const contactKeywords = lang === 'fr'
    ? ['acheter', 'prix', 'commander', 'devis', 'contact', 'contacter', 'formulaire', 'partenariat', 'démo', 'demo', 'offre', 'tarif']
    : ['buy', 'price', 'order', 'quote', 'contact', 'form', 'partnership', 'demo', 'offer', 'rate']

  const hasContactIntent = contactKeywords.some(keyword => lowerMessage.includes(keyword))

  if (hasContactIntent) {
    return {
      suggestContact: true,
      subject: lang === 'fr' ? 'Demande d\'information' : 'Information request',
      messageSummary: message
    }
  }

  return { suggestContact: false }
}
