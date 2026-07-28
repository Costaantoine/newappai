import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateZoneSchema } from '@/lib/validators'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
      include: { cards: { orderBy: { order: 'asc' } } }
    })
    if (!zone) return NextResponse.json({ error: 'Zone non trouvée' }, { status: 404 })
    return NextResponse.json(zone)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = UpdateZoneSchema.parse(body)
    const zone = await prisma.zone.update({ where: { id: params.id }, data: parsed })
    return NextResponse.json(zone)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.zone.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
