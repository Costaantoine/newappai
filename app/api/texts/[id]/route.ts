import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateTextSchema } from '@/lib/validators'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const text = await prisma.text.findUnique({ where: { id: params.id } })
    if (!text) return NextResponse.json({ error: 'Texte non trouvé' }, { status: 404 })
    return NextResponse.json(text)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = UpdateTextSchema.parse(body)
    const text = await prisma.text.update({ where: { id: params.id }, data: parsed })
    return NextResponse.json(text)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.text.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
