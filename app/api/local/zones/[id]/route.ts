import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
      include: { cards: true }
    })

    if (!zone) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
    }
    return NextResponse.json({ zone })
  } catch (error: any) {
    console.error('Error fetching zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, title_key, subtitle_key, badge, color, url, cta_key, newtab_key, order, active } = body

    const zone = await prisma.zone.update({
      where: { id: params.id },
      data: {
        key: key?.toLowerCase().replace(/\s+/g, '_'),
        title_key,
        subtitle_key,
        badge,
        color,
        url,
        cta_key,
        newtab_key,
        order,
        active
      }
    })

    return NextResponse.json({ zone })
  } catch (error: any) {
    console.error('Error updating zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    await prisma.zone.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting zone:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
