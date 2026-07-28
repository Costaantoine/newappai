import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer toutes les solutions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const category = searchParams.get('category')

    const where: Record<string, string> = {}
    if (section) where.section = section
    if (category) where.category = category

    const solutions = await prisma.solution.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })

    return NextResponse.json({ solutions })
  } catch (error: any) {
    console.error('Error fetching solutions:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle solution
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, fr, en, pt, es, section, type, category } = body

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const solution = await prisma.solution.create({
      data: {
        key,
        fr: fr || '',
        en: en || '',
        pt: pt || '',
        es: es || '',
        section: section || 'solutions',
        type: type || 'description',
        category: category || 'general',
      },
    })

    return NextResponse.json({ solution })
  } catch (error: any) {
    console.error('Error creating solution:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour une solution
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, key, fr, en, pt, es, section, type, category } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const solution = await prisma.solution.update({
      where: { id },
      data: {
        key,
        fr: fr || '',
        en: en || '',
        pt: pt || '',
        es: es || '',
        section: section || 'solutions',
        type: type || 'description',
        category: category || 'general',
      },
    })

    return NextResponse.json({ solution })
  } catch (error: any) {
    console.error('Error updating solution:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer une solution
export async function DELETE(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.solution.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting solution:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
