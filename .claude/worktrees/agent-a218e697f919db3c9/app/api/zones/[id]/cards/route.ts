import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateZoneCardSchema } from '@/lib/validators'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cards = await prisma.zoneCard.findMany({
      where: { zone_id: params.id },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(cards)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = CreateZoneCardSchema.parse({ ...body, zone_id: params.id })
    const card = await prisma.zoneCard.create({ data: parsed })
    return NextResponse.json(card, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
