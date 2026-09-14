import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, type OrderConfirmationItem } from '@/lib/email'
import logger from '@/lib/logger'

const SUPPORTED_LANGS = ['fr', 'en', 'pt', 'es']

function resolveLanguage(value: unknown): string {
  return typeof value === 'string' && SUPPORTED_LANGS.includes(value) ? value : 'fr'
}

/**
 * Reconstitue la liste des articles achetés à partir des métadonnées de la
 * session Stripe :
 * - métier panier : `metadata.items` = JSON [{ id, qty }] → titres/prix lus en base
 * - produit unique : `metadata.product_id` → produit du catalogue
 */
async function resolveOrderItems(session: any): Promise<OrderConfirmationItem[]> {
  const items: OrderConfirmationItem[] = []

  const rawItems = session.metadata?.items
  if (rawItems) {
    try {
      const parsed = JSON.parse(rawItems)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const ids = parsed.map((entry: any) => entry?.id).filter(Boolean)
        const products = ids.length
          ? await prisma.product.findMany({ where: { id: { in: ids } } })
          : []
        const productMap = new Map(products.map((p: any) => [p.id, p]))

        for (const entry of parsed) {
          const product = productMap.get(entry?.id)
          const quantity = Number(entry?.qty) || 1
          const fallbackPrice = Number(entry?.price)
          items.push({
            title: product?.title || entry?.title || 'Produit',
            quantity,
            price: product?.price ?? (Number.isFinite(fallbackPrice) ? fallbackPrice : 0),
          })
        }
      }
    } catch (error) {
      logger.warn({ error, session: session.id }, 'Impossible de parser session.metadata.items')
    }
  }

  if (items.length === 0 && session.metadata?.product_id) {
    const product = await prisma.product.findUnique({
      where: { id: session.metadata.product_id },
    })
    if (product) {
      items.push({ title: product.title, quantity: 1, price: product.price })
    } else {
      items.push({
        title: session.metadata?.product || 'Produit',
        quantity: 1,
        price: session.amount_total || 0,
      })
    }
  }

  return items
}

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

      // Ne jamais marquer une commande "completed" pour un événement dont le
      // paiement n'est pas effectivement passé (ex: mode async payment methods).
      if (session.payment_status === 'paid') {
        // `product_id` est une vraie clé étrangère vers la table Product (catalogue,
        // cf. /api/stripe/create-checkout). Les produits à prix fixe hors catalogue
        // (webdesign, vitrine) utilisent la clé metadata `product` comme simple tag —
        // ils n'ont pas de ligne Product correspondante, donc product_id reste null
        // pour eux (y insérer le tag casserait la contrainte FK).
        await prisma.order.create({
          data: {
            stripe_session_id: session.id,
            product_id: session.metadata?.product_id || null,
            customer_email: session.customer_details?.email || null,
            amount: session.amount_total || 0,
            status: 'completed',
          }
        })

        // Email de confirmation de commande (langue du client si connue).
        // Un échec d'envoi ne doit jamais faire échouer le webhook.
        const customerEmail = session.customer_details?.email || session.customer_email || null
        if (customerEmail) {
          try {
            const items = await resolveOrderItems(session)
            if (items.length === 0) {
              logger.warn({ session: session.id }, 'Aucun article à afficher dans l\'email de confirmation')
            } else {
              await sendOrderConfirmationEmail({
                customerEmail,
                customerName: session.customer_details?.name || session.metadata?.customer_name || '',
                items,
                totalAmount: session.amount_total || 0,
                language: resolveLanguage(session.metadata?.lang),
                orderId: session.id,
              })
            }
          } catch (emailError) {
            logger.error({ error: emailError, session: session.id }, 'Erreur envoi email de confirmation de commande')
          }
        } else {
          logger.warn({ session: session.id }, 'Aucun email client pour la confirmation de commande')
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook Stripe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
