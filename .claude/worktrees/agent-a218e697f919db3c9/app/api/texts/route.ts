import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateTextSchema } from '@/lib/validators'

export async function GET() {
  try {
    const texts = await prisma.text.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(texts)
  } catch (error) {
    console.error('GET /api/texts error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateTextSchema.parse(body)
    const text = await prisma.text.create({ data: parsed })
    return NextResponse.json(text, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('POST /api/texts error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
