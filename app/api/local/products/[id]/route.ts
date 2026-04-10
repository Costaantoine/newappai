import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return str }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const formattedProduct = {
      ...product,
      title: parseJson(product.title),
      description: parseJson(product.description),
      images: parseJson(product.images)
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
    const { title, description, price, images, category, active } = body

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: typeof title === 'object' ? JSON.stringify(title) : title,
        description: typeof description === 'object' ? JSON.stringify(description) : description,
        price: price !== undefined ? Number(price) : undefined,
        images: Array.isArray(images) ? JSON.stringify(images) : images,
        category,
        active: active !== undefined ? active : undefined,
      }
    })

    const formattedProduct = {
      ...updatedProduct,
      title: parseJson(updatedProduct.title),
      description: parseJson(updatedProduct.description),
      images: parseJson(updatedProduct.images)
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    await prisma.product.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
