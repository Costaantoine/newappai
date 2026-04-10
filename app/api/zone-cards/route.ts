import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { CreateZoneCardSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zone_id = searchParams.get('zone_id')

    const cards = await prisma.zoneCard.findMany({
      where: zone_id ? { zone_id } : undefined,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ cards })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching zone cards')
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
    const parsed = CreateZoneCardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const card = await prisma.zoneCard.create({ data: parsed.data })
    logger.info({ cardId: card.id }, 'Zone card created')
    return NextResponse.json({ card }, { status: 201 })
  } catch (error: unknown) {
    logger.error({ error }, 'Error creating zone card')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
