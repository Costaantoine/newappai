import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { UpdateZoneSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({ where: { id: params.id } })
    if (!zone) {
      return NextResponse.json({ error: 'Zone introuvable' }, { status: 404 })
    }
    return NextResponse.json({ zone })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching zone')
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
    const parsed = UpdateZoneSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const zone = await prisma.zone.update({ where: { id: params.id }, data: parsed.data })
    logger.info({ zoneId: params.id }, 'Zone updated')
    return NextResponse.json({ zone })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating zone')
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
    // ZoneCards supprimées automatiquement (onDelete: Cascade)
    await prisma.zone.delete({ where: { id: params.id } })
    logger.info({ zoneId: params.id }, 'Zone deleted')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error({ error }, 'Error deleting zone')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
