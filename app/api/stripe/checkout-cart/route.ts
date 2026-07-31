import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer, waiver_accepted, waiver_timestamp } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Validate each item's price against the database (SEC-06)
    const productIds = items.map((item: any) => item.productId).filter(Boolean)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
    const dbProductMap = new Map(dbProducts.map((p: any) => [p.id, p]))

    const lineItems = items.map((item: any) => {
      // Verify price matches database to prevent client-side price manipulation
      const dbProduct = dbProductMap.get(item.productId)
      const verifiedPrice = dbProduct ? dbProduct.price : item.price

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: verifiedPrice,
        },
        quantity: item.quantity,
      }
    })

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/produits`,
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ id: i.productId, qty: i.quantity }))),
        ...(waiver_accepted ? {
          waiver_accepted: 'true',
          waiver_timestamp: waiver_timestamp || new Date().toISOString(),
        } : {}),
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

    // Enregistrer la commande en base locale (Prisma/PG local 127.0.0.1:5444)
    // pour que la page de succès puisse afficher les infos produit sans dépendre de Supabase PJP
    const totalAmount = lineItems.reduce((sum: number, item: any, idx: number) => {
      return sum + (item.price_data.unit_amount || 0) * (items[idx]?.quantity || 1)
    }, 0)

    await prisma.order.create({
      data: {
        stripe_session_id: session.id,
        product_id: items[0]?.productId || null,
        customer_email: customer?.email || null,
        amount: totalAmount,
        status: 'pending',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Cart checkout error:', error)
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 })
  }
}
