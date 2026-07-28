import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer toutes les zones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where = active === 'true' ? { active: true } : {}

    const zones = await prisma.zone.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ zones })
  } catch (error: any) {
    console.error('Error fetching zones:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle zone
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, title_key, subtitle_key, badge, color, url, cta_key, newtab_key, icon_url, order, active } = body

    if (!key || !title_key) {
      return NextResponse.json({ error: 'Key and title_key are required' }, { status: 400 })
    }

    const zone = await prisma.zone.create({
      data: {
        key,
        title_key,
        subtitle_key: subtitle_key || '',
        badge: badge || '',
        color: color || 'sky',
        url: url || '',
        cta_key: cta_key || '',
        newtab_key: newtab_key || '',
        icon_url: icon_url || '',
        order: order ?? 0,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json({ zone })
  } catch (error: any) {
    console.error('Error creating zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour une zone
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, key, title_key, subtitle_key, badge, color, url, cta_key, newtab_key, icon_url, order, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data: any = {}
    if (key !== undefined) data.key = key
    if (title_key !== undefined) data.title_key = title_key
    if (subtitle_key !== undefined) data.subtitle_key = subtitle_key
    if (badge !== undefined) data.badge = badge
    if (color !== undefined) data.color = color
    if (url !== undefined) data.url = url
    if (cta_key !== undefined) data.cta_key = cta_key
    if (newtab_key !== undefined) data.newtab_key = newtab_key
    if (icon_url !== undefined) data.icon_url = icon_url
    if (order !== undefined) data.order = order
    if (active !== undefined) data.active = active

    const zone = await prisma.zone.update({
      where: { id },
      data,
    })

    return NextResponse.json({ zone })
  } catch (error: any) {
    console.error('Error updating zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer une zone
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

    await prisma.zone.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
