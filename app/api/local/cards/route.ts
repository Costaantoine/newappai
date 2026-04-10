import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zone_id = searchParams.get('zone_id')

    const cards = await prisma.zoneCard.findMany({
      where: zone_id ? { zone_id } : {},
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ cards })
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { zone_id, title_key, description_key, badge_key, image_url, order, active } = body

    if (!zone_id || !title_key) {
      return NextResponse.json({ error: 'Zone ID and title are required' }, { status: 400 })
    }

    const card = await prisma.zoneCard.create({
      data: {
        zone_id,
        title_key: title_key.trim(),
        description_key: description_key?.trim() || '',
        badge_key: badge_key?.trim() || '',
        image_url: image_url?.trim() || '',
        order: order ?? 0,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('Error creating card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
