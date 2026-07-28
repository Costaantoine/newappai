import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (email) where.customer_email = email
    if (userId) where.user_id = userId

    const orders = await prisma.order.findMany({
      where,
      include: { product: true },
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
