import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/produits`,
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ id: i.productId, qty: i.quantity })))
      },
    }

    if (customer) {
      sessionParams.customer_email = customer.email
      sessionParams.metadata = {
        ...sessionParams.metadata,
        customer_name: customer.name,
        customer_phone: customer.phone || ''
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Cart checkout error:', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
