import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { CreateTextSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const texts = await prisma.text.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    })
    return NextResponse.json({ texts })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching texts')
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
    const parsed = CreateTextSchema.safeParse({
      ...body,
      key: body.key?.toLowerCase().replace(/\s+/g, '_'),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const text = await prisma.text.create({
      data: {
        key: parsed.data.key,
        fr: parsed.data.fr.trim(),
        en: parsed.data.en?.trim() || '',
        pt: parsed.data.pt?.trim() || '',
        es: parsed.data.es?.trim() || '',
        section: parsed.data.section?.trim() || '',
      },
    })

    logger.info({ textId: text.id, key: text.key }, 'Text created')
    return NextResponse.json({ text }, { status: 201 })
  } catch (error: unknown) {
    logger.error({ error }, 'Error creating text')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
