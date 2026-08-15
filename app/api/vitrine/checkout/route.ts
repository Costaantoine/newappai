import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { DECOUVERTE_PRICE_CENTS } from '@/lib/vitrine/pricing'

/**
 * Checkout du parcours "Site Vitrine" (offre Découverte 149€ TTC one-shot,
 * même offre que Web Design). Route isolée de /api/stripe/* : ce n'est pas un
 * produit de catalogue, le site est généré à la volée à partir du wizard.
 */

// Base d'URL fiable pour les redirections Stripe : jamais le header Origin
// (contrôlable par l'appelant), toujours une valeur serveur avec fallback sûr.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, { limit: 5, windowMs: 60_000, prefix: 'checkout:vitrine' })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
      { status: 429 },
    )
  }

  try {
    const { email, siteName, jobId } = await request.json()

    const metadata: Record<string, string> = {
      product: 'vitrine',
      email: String(email || ''),
      site_name: String(siteName || '').slice(0, 120),
    }
    if (jobId) metadata.job_id = String(jobId).slice(0, 120)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Site Vitrine — Site one-page',
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
      cancel_url: `${SITE_URL}/vitrine`,
      metadata,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Erreur création session Vitrine:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 },
    )
  }
}
