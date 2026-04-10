import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    let productName = ''

    const order = await prisma.order.findUnique({
      where: { stripe_session_id: sessionId },
      include: { product: true },
    })

    if (order?.product) {
      productName = order.product.title
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
