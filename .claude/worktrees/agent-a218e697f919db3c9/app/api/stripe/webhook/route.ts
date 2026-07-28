import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
    } catch (err) {
      console.error('Erreur vérification webhook Stripe:', err)
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      
      await prisma.order.create({
        data: {
          stripe_session_id: session.id,
          product_id: session.metadata?.product_id || null,
          customer_email: session.customer_details?.email || null,
          amount: session.amount_total || 0,
          status: 'completed',
        }
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook Stripe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
