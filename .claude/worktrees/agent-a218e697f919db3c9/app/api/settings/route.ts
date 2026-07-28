import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'main' } })
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'main', data: '{}' }
      })
    }
    return NextResponse.json(JSON.parse(settings.data))
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: { data: JSON.stringify(body) },
      create: { id: 'main', data: JSON.stringify(body) }
    })
    return NextResponse.json(JSON.parse(settings.data))
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
