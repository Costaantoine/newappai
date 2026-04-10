import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return str }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' }
    })

    const formattedProducts = products.map(p => ({
      ...p,
      title: parseJson(p.title),
      description: parseJson(p.description),
      images: parseJson(p.images)
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ products: [] })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, price, images, category, active } = body

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        title: typeof title === 'object' ? JSON.stringify(title) : title,
        description: typeof description === 'object' ? JSON.stringify(description) : (description || ''),
        price: Number(price),
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
        category: category || '',
        active: active !== undefined ? active : true,
      }
    })

    return NextResponse.json({
      product: {
        ...newProduct,
        title: parseJson(newProduct.title),
        description: parseJson(newProduct.description),
        images: parseJson(newProduct.images)
      }
    })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
