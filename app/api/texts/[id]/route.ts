import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { UpdateTextSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

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
    const parsed = UpdateTextSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const text = await prisma.text.update({
      where: { id: params.id },
      data: parsed.data,
    })
    logger.info({ textId: params.id }, 'Text updated')
    return NextResponse.json({ text })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating text')
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
    await prisma.text.delete({ where: { id: params.id } })
    logger.info({ textId: params.id }, 'Text deleted')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error({ error }, 'Error deleting text')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
