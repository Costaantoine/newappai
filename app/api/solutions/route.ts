import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { CreateSolutionSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const solutions = await prisma.solution.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })
    return NextResponse.json({ solutions })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching solutions')
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
    const parsed = CreateSolutionSchema.safeParse({
      ...body,
      key: body.key?.toLowerCase().replace(/\s+/g, '_'),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const solution = await prisma.solution.create({ data: parsed.data })
    logger.info({ solutionId: solution.id }, 'Solution created')
    return NextResponse.json({ solution }, { status: 201 })
  } catch (error: unknown) {
    logger.error({ error }, 'Error creating solution')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
