import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateZoneSchema } from '@/lib/validators'

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { order: 'asc' },
      include: { cards: { orderBy: { order: 'asc' } } }
    })
    return NextResponse.json(zones)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateZoneSchema.parse(body)
    const zone = await prisma.zone.create({ data: parsed })
    return NextResponse.json(zone, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
