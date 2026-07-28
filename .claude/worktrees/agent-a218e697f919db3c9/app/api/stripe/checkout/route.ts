import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseNewappaiAdmin } from '@/lib/supabaseNewappai'

function parseText(value: string): string {
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed.fr || parsed.en || Object.values(parsed)[0] as string || value
    }
    return value
  } catch {
    return value
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  try {
    const { data: product, error: productError } = await supabaseNewappaiAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const title = parseText(product.title)
    const description = parseText(product.description)
    const images: string[] = product.images ? JSON.parse(product.images) : []

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title,
              description: description?.replace(/<[^>]*>/g, '').substring(0, 500) || undefined,
              images,
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

    await supabaseNewappaiAdmin
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        product_id: productId,
        amount: product.price,
        status: 'pending',
      })

    return NextResponse.redirect(session.url!)
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}
