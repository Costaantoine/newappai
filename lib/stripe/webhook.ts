import Stripe from 'stripe'
import { stripe } from './client'

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET manquant')
  }

  return stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  // Handle successful checkout
  const { prisma } = await import('@/lib/prisma')
  
  if (session.metadata?.orderId) {
    await prisma.order.update({
      where: { id: session.metadata.orderId },
      data: {
        status: 'paid',
        stripe_session_id: session.id,
        paid_at: new Date(),
      },
    })
  }
}

export async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session
): Promise<void> {
  const { prisma } = await import('@/lib/prisma')
  
  if (session.metadata?.orderId) {
    await prisma.order.update({
      where: { id: session.metadata.orderId },
      data: { status: 'expired' },
    })
  }
}
