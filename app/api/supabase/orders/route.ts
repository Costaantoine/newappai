import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer les commandes (admin only)
export async function GET(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const stripe_session_id = searchParams.get('stripe_session_id')
    const status = searchParams.get('status')

    const where: Record<string, string> = {}
    if (stripe_session_id) where.stripe_session_id = stripe_session_id
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une commande (appelé par Stripe checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stripe_session_id, product_id, amount, status, customer_email } = body

    if (!stripe_session_id || amount === undefined) {
      return NextResponse.json({ error: 'stripe_session_id and amount are required' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        stripe_session_id,
        product_id: product_id || null,
        amount: Number(amount),
        status: status || 'pending',
        customer_email: customer_email || null,
      },
    })

    return NextResponse.json({ order })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour une commande (appelé par webhook Stripe)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { stripe_session_id, status, customer_email } = body

    if (!stripe_session_id) {
      return NextResponse.json({ error: 'stripe_session_id is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (customer_email !== undefined) updateData.customer_email = customer_email

    const order = await prisma.order.update({
      where: { stripe_session_id },
      data: updateData,
    })

    return NextResponse.json({ order })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
