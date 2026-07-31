import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

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

    // Lire la commande en base locale (Prisma/PG local 127.0.0.1:5444)
    const order = await prisma.order.findUnique({
      where: { stripe_session_id: sessionId },
      include: { product: true },
    })

    if (order?.product?.title) {
      productName = parseText(order.product.title)
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
