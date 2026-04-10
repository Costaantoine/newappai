import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { CreateZoneSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ zones })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching zones')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = CreateZoneSchema.safeParse({
      ...body,
      key: body.key?.toLowerCase().replace(/\s+/g, '_'),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const zone = await prisma.zone.create({ data: parsed.data })
    logger.info({ zoneId: zone.id }, 'Zone created')
    return NextResponse.json({ zone }, { status: 201 })
  } catch (error: unknown) {
    logger.error({ error }, 'Error creating zone')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
