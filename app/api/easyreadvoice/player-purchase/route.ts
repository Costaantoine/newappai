import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

const PLAYER_PRODUCT_TITLE = 'EasyReadVoice Player'
const PLAYER_PRODUCT_PRICE = 499 // centimes (4.99 EUR)

async function getOrCreatePlayerProduct() {
  const existing = await prisma.product.findFirst({ where: { title: PLAYER_PRODUCT_TITLE } })
  if (existing) return existing

  return prisma.product.create({
    data: {
      title: PLAYER_PRODUCT_TITLE,
      description: 'Lecteur audio EasyReadVoice telechargeable : multi-format, multi-voix, lecture continue.',
      price: PLAYER_PRODUCT_PRICE,
      category: 'easyreadvoice',
      status: "visible",
    },
  })
}

export async function GET() {
  try {
    const product = await getOrCreatePlayerProduct()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let purchased = false
    if (user?.email) {
      const order = await prisma.order.findFirst({
        where: {
          product_id: product.id,
          customer_email: user.email,
          status: 'completed',
        },
      })
      purchased = !!order
    }

    return NextResponse.json({ productId: product.id, price: product.price, purchased })
  } catch (error) {
    console.error('Erreur statut achat player:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
