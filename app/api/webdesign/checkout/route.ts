import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { DECOUVERTE_PRICE_CENTS } from '@/lib/vitrine/pricing'

/**
 * Checkout dédié au produit "Web Design 149€" (offre Découverte 149€ TTC one-shot).
 * Route isolée de /api/stripe/* pour ne pas dépendre d'un produit en base :
 * le site est généré à partir des données du client, pas d'un catalogue.
 */

// Base d'URL fiable pour les redirections Stripe : jamais le header Origin
// (contrôlable par l'appelant), toujours une valeur serveur avec fallback sûr.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, { limit: 5, windowMs: 60_000, prefix: 'checkout:webdesign' })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
      { status: 429 },
    )
  }

  try {
    const { siteName, sector, serviceCount, photoCount, email } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Web Design — Site vitrine one-page',
              description: 'Site vitrine one-page complet, hébergement et mise en ligne inclus.',
            },
            unit_amount: DECOUVERTE_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      success_url: `${SITE_URL}/webdesign/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/webdesign`,
      metadata: {
        product: 'webdesign',
        site_name: String(siteName || '').slice(0, 120),
        sector: String(sector || ''),
        service_count: String(serviceCount || 0),
        photo_count: String(photoCount || 0),
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Erreur création session Web Design:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 },
    )
  }
}
