import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.zoneCard.findUnique({
      where: { id: params.id }
    })

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }
    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('Error fetching card:', error)
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
    const { zone_id, title_key, description_key, badge_key, image_url, order, active } = body

    const card = await prisma.zoneCard.update({
      where: { id: params.id },
      data: {
        zone_id,
        title_key,
        description_key,
        badge_key,
        image_url,
        order,
        active
      }
    })

    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('Error updating card:', error)
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
    await prisma.zoneCard.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
