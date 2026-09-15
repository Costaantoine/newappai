import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const SUPPORTED_LANGS = ['fr', 'en', 'pt', 'es']

function resolveLanguage(value: unknown): string {
  return typeof value === 'string' && SUPPORTED_LANGS.includes(value) ? value : 'fr'
}

export async function POST(request: NextRequest) {
  try {
    const { productId, successUrl, cancelUrl, waiver_accepted, waiver_timestamp, lang } = await request.json()

    // Langue du client (body prioritaire, sinon cookie `lang` posé par le middleware)
    const language = resolveLanguage(lang || request.cookies.get('lang')?.value)
    
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.title,
              description: product.description || undefined,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://newappai.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://newappai.com'}/checkout/cancel`,
      metadata: {
        product_id: product.id,
        lang: language,
        ...(waiver_accepted ? {
          waiver_accepted: 'true',
          waiver_timestamp: waiver_timestamp || new Date().toISOString(),
        } : {}),
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la session de paiement' }, { status: 500 })
  }
}
