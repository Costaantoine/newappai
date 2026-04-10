import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    const texts = await prisma.text.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    })
    return NextResponse.json({ texts })
  } catch (error: any) {
    console.error('Error fetching texts:', error)
    return NextResponse.json({ texts: [] })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, key, fr, en, pt, es, section } = body

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    // First, try to find by ID
    let existingText = id ? await prisma.text.findUnique({ where: { id } }) : null

    // If not found by ID, try to find by KEY
    if (!existingText) {
      existingText = await prisma.text.findFirst({ where: { key } })
    }

    const text = await prisma.text.upsert({
      where: { id: existingText?.id || id || 'new-text-' + key },
      update: { fr, en, pt, es, section },
      create: {
        key,
        fr, en, pt, es, section
      },
    })

    console.log('Text saved:', text.key)
    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('Error updating text:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
