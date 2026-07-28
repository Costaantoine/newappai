import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin()

    if (isAdmin) {
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
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { customer_email: user.email },
      include: { product: true },
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
