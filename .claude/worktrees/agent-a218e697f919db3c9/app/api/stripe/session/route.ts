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
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    let productName = ''

    const { data: order } = await supabaseNewappaiAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single()

    if (order?.product_id) {
      const { data: product } = await supabaseNewappaiAdmin
        .from('products')
        .select('title')
        .eq('id', order.product_id)
        .single()

      if (product?.title) {
        productName = parseText(product.title)
      }
    }

    return NextResponse.json({
      productName,
      customerEmail: session.customer_details?.email || '',
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
