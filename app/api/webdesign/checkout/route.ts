import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * Checkout dédié au produit "Web Design 199€" (prix fixe 199€ TTC).
 * Route isolée de /api/stripe/* pour ne pas dépendre d'un produit en base :
 * le site est généré à partir des données du client, pas d'un catalogue.
 */

const PRICE_CENTS = 19900

export async function POST(request: NextRequest) {
  try {
    const { siteName, sector, serviceCount, photoCount, email } = await request.json()

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000'

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
            unit_amount: PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      success_url: `${origin}/webdesign/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/webdesign`,
      metadata: {
        product: 'webdesign-199',
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
