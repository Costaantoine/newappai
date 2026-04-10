import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      include: { cards: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ zones })
  } catch (error: any) {
    console.error('Error fetching zones:', error)
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
    const { key, title_key, subtitle_key, badge, color, url, cta_key, newtab_key, order, active } = body

    if (!key || !title_key) {
      return NextResponse.json({ error: 'Key and title are required' }, { status: 400 })
    }

    const zone = await prisma.zone.create({
      data: {
        key: key.toLowerCase().replace(/\s+/g, '_'),
        title_key: title_key.trim(),
        subtitle_key: subtitle_key?.trim() || '',
        badge: badge?.trim() || '',
        color: color || 'sky',
        url: url?.trim() || '',
        cta_key: cta_key?.trim() || '',
        newtab_key: newtab_key?.trim() || '',
        order: order ?? 0,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json({ zone })
  } catch (error: any) {
    console.error('Error creating zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
