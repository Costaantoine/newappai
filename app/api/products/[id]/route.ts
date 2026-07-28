import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateProductSchema } from '@/lib/validators'

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return str }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } })
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }
    return NextResponse.json({
      ...product,
      title: parseJson(product.title),
      description: parseJson(product.description),
      images: parseJson(product.images),
    })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = UpdateProductSchema.parse(body)
    const data: any = {}
    if (parsed.title !== undefined) data.title = parsed.title
    if (parsed.description !== undefined) data.description = parsed.description
    if (parsed.price !== undefined) data.price = parsed.price
    if (parsed.images !== undefined) data.images = JSON.stringify(parsed.images)
    if (parsed.category !== undefined) data.category = parsed.category
    if (parsed.active !== undefined) data.active = parsed.active

    const product = await prisma.product.update({
      where: { id: params.id },
      data
    })
    return NextResponse.json(product)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
