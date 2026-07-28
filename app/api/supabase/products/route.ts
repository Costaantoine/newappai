import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return str }
}

// GET - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const id = searchParams.get('id')

    const where: Record<string, unknown> = {}
    if (id) where.id = id
    if (status) where.status = status

    const data = await prisma.product.findMany({
      where,
      orderBy: { created_at: 'desc' },
    })

    const formattedProducts = data.map(p => ({
      ...p,
      title: parseJson(p.title),
      description: parseJson(p.description),
      images: parseJson(p.images),
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, price, images, category, status } = body

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
    }

    const data = await prisma.product.create({
      data: {
        title: typeof title === 'object' ? JSON.stringify(title) : title,
        description: typeof description === 'object' ? JSON.stringify(description) : (description || ''),
        price: Number(price),
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
        category: category || '',
        status: status || "visible",
      },
    })

    const formattedProduct = {
      ...data,
      title: parseJson(data.title),
      description: parseJson(data.description),
      images: parseJson(data.images),
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title, description, price, images, category, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = typeof title === 'object' ? JSON.stringify(title) : title
    if (description !== undefined) updateData.description = typeof description === 'object' ? JSON.stringify(description) : description
    if (price !== undefined) updateData.price = Number(price)
    if (images !== undefined) updateData.images = Array.isArray(images) ? JSON.stringify(images) : images
    if (category !== undefined) updateData.category = category
    if (status !== undefined) updateData.status = status

    const data = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    const formattedProduct = {
      ...data,
      title: parseJson(data.title),
      description: parseJson(data.description),
      images: parseJson(data.images),
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
