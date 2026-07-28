import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateSolutionSchema } from '@/lib/validators'

export async function GET() {
  try {
    const solutions = await prisma.solution.findMany({ orderBy: { created_at: 'desc' } })
    return NextResponse.json(solutions)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateSolutionSchema.parse(body)
    const solution = await prisma.solution.create({ data: parsed })
    return NextResponse.json(solution, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
