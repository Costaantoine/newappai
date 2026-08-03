import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer tous les éléments "Tester les nouveautés"
export async function GET() {
  try {
    const tryItems = await prisma.tryItem.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ tryItems })
  } catch (error: any) {
    console.error('Error fetching try items:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer un élément
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title_key, description_key, badge, color, url, icon_key, icon_url, order, active } = body

    if (!title_key) {
      return NextResponse.json({ error: 'title_key is required' }, { status: 400 })
    }

    const tryItem = await prisma.tryItem.create({
      data: {
        title_key,
        description_key: description_key || '',
        badge: badge || '',
        color: color || 'violet',
        url: url || '',
        icon_key: icon_key || '',
        icon_url: icon_url || '',
        order: order ?? 0,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json({ tryItem })
  } catch (error: any) {
    console.error('Error creating try item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un élément
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title_key, description_key, badge, color, url, icon_key, icon_url, order, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data: any = {}
    if (title_key !== undefined) data.title_key = title_key
    if (description_key !== undefined) data.description_key = description_key
    if (badge !== undefined) data.badge = badge
    if (color !== undefined) data.color = color
    if (url !== undefined) data.url = url
    if (icon_key !== undefined) data.icon_key = icon_key
    if (icon_url !== undefined) data.icon_url = icon_url
    if (order !== undefined) data.order = order
    if (active !== undefined) data.active = active

    const tryItem = await prisma.tryItem.update({
      where: { id },
      data,
    })

    return NextResponse.json({ tryItem })
  } catch (error: any) {
    console.error('Error updating try item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un élément
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

    await prisma.tryItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting try item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
