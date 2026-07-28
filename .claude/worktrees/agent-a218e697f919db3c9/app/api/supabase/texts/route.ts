import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer tous les textes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const where = section ? { section } : {}

    const data = await prisma.text.findMany({
      where,
      orderBy: { key: 'asc' }
    })

    return NextResponse.json({ texts: data || [] })
  } catch (error: any) {
    console.error('Error fetching texts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouveau texte
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, fr, en, pt, es, section } = body

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const data = await prisma.text.create({
      data: {
        key,
        fr: fr || '',
        en: en || '',
        pt: pt || '',
        es: es || '',
        section: section || 'general'
      }
    })

    return NextResponse.json({ text: data })
  } catch (error: any) {
    console.error('Error creating text:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un texte
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, key, fr, en, pt, es, section } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data = await prisma.text.update({
      where: { id },
      data: {
        ...(key !== undefined && { key }),
        ...(fr !== undefined && { fr }),
        ...(en !== undefined && { en }),
        ...(pt !== undefined && { pt }),
        ...(es !== undefined && { es }),
        ...(section !== undefined && { section }),
      }
    })

    return NextResponse.json({ text: data })
  } catch (error: any) {
    console.error('Error updating text:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un texte
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

    await prisma.text.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting text:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
