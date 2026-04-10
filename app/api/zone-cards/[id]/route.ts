import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { UpdateZoneCardSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.zoneCard.findUnique({ where: { id: params.id } })
    if (!card) {
      return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })
    }
    return NextResponse.json({ card })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching zone card')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
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
    const parsed = UpdateZoneCardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const card = await prisma.zoneCard.update({ where: { id: params.id }, data: parsed.data })
    logger.info({ cardId: params.id }, 'Zone card updated')
    return NextResponse.json({ card })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating zone card')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    await prisma.zoneCard.delete({ where: { id: params.id } })
    logger.info({ cardId: params.id }, 'Zone card deleted')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error({ error }, 'Error deleting zone card')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
