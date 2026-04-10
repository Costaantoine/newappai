import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { UpdateProductSchema, formatZodError } from '@/lib/validators'
import logger from '@/lib/logger'
import { serializeImages, normalizeProduct } from '@/lib/dbHelpers'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } })
    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }
    return NextResponse.json({ product: normalizeProduct(product) })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching product')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
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
    const parsed = UpdateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const { images, ...rest } = parsed.data
    const updateData = images !== undefined
      ? { ...rest, images: serializeImages(images) as string }
      : rest
    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    })
    logger.info({ productId: params.id }, 'Product updated')
    return NextResponse.json({ product: normalizeProduct(product) })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating product')
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
    await prisma.product.delete({ where: { id: params.id } })
    logger.info({ productId: params.id }, 'Product deleted')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error({ error }, 'Error deleting product')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
