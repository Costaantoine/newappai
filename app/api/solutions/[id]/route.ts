import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { UpdateSolutionSchema, formatZodError } from '@/lib/validators'
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
    const parsed = UpdateSolutionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const solution = await prisma.solution.update({ where: { id: params.id }, data: parsed.data })
    logger.info({ solutionId: params.id }, 'Solution updated')
    return NextResponse.json({ solution })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating solution')
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
    await prisma.solution.delete({ where: { id: params.id } })
    logger.info({ solutionId: params.id }, 'Solution deleted')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error({ error }, 'Error deleting solution')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
