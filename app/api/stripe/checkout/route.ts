import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.title,
              description: product.description?.replace(/<[^>]*>/g, '').substring(0, 500) || undefined,
              images: product.images || [],
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/`,
      metadata: { productId },
    })

    await prisma.order.create({
      data: {
        stripe_session_id: session.id,
        product_id: productId,
        amount: product.price,
        status: 'pending',
      },
    })

    return NextResponse.redirect(session.url!)
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}
