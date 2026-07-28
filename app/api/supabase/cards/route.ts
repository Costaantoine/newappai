import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer toutes les cartes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zone_id = searchParams.get('zone_id')

    const where = zone_id ? { zone_id } : {}

    const cards = await prisma.zoneCard.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ cards })
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle carte
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { zone_id, title_key, description_key, badge_key, image_url, order, active } = body

    if (!zone_id || !title_key) {
      return NextResponse.json({ error: 'Zone ID and title_key are required' }, { status: 400 })
    }

    const card = await prisma.zoneCard.create({
      data: {
        zone_id,
        title_key,
        description_key: description_key || '',
        badge_key: badge_key || '',
        image_url: image_url || '',
        order: order ?? 0,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('Error creating card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour une carte
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, zone_id, title_key, description_key, badge_key, image_url, order, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data: any = {}
    if (zone_id !== undefined) data.zone_id = zone_id
    if (title_key !== undefined) data.title_key = title_key
    if (description_key !== undefined) data.description_key = description_key
    if (badge_key !== undefined) data.badge_key = badge_key
    if (image_url !== undefined) data.image_url = image_url
    if (order !== undefined) data.order = order
    if (active !== undefined) data.active = active

    const card = await prisma.zoneCard.update({
      where: { id },
      data,
    })

    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('Error updating card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer une carte
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

    await prisma.zoneCard.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
