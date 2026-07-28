import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/validators'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateProductSchema.parse(body)
    const product = await prisma.product.create({
      data: {
        title: parsed.title,
        description: parsed.description || '',
        price: parsed.price,
        images: JSON.stringify(parsed.images || []),
        category: parsed.category || '',
        status: parsed.status ?? "visible",
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
