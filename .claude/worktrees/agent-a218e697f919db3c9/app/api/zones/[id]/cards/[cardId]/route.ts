import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateZoneCardSchema } from '@/lib/validators'

export async function GET(request: NextRequest, { params }: { params: { id: string; cardId: string } }) {
  try {
    const card = await prisma.zoneCard.findFirst({
      where: { id: params.cardId, zone_id: params.id }
    })
    if (!card) return NextResponse.json({ error: 'Carte non trouvée' }, { status: 404 })
    return NextResponse.json(card)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; cardId: string } }) {
  try {
    const body = await request.json()
    const parsed = UpdateZoneCardSchema.parse(body)
    const card = await prisma.zoneCard.update({
      where: { id: params.cardId },
      data: parsed
    })
    return NextResponse.json(card)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; cardId: string } }) {
  try {
    await prisma.zoneCard.delete({ where: { id: params.cardId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
