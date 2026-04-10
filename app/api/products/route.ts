import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { CreateProductSchema, formatZodError } from '@/lib/validators'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import logger from '@/lib/logger'
import { serializeImages, normalizeProduct } from '@/lib/dbHelpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
    const activeOnly = searchParams.get('active') === 'true'

    const where = activeOnly ? { active: true } : {}
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products: products.map(normalizeProduct),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching products')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, { limit: 30, windowMs: 60_000, prefix: 'products:create' })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Trop de requêtes, veuillez patienter' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = CreateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
    }

    const { images, ...rest } = parsed.data
    const product = await prisma.product.create({
      data: { ...rest, images: serializeImages(images ?? []) as string },
    })
    logger.info({ productId: product.id }, 'Product created')
    return NextResponse.json({ product: normalizeProduct(product) }, { status: 201 })
  } catch (error: unknown) {
    logger.error({ error }, 'Error creating product')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
