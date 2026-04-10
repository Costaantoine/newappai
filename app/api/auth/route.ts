import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { LoginSchema, formatZodError } from '@/lib/validators'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, { limit: 5, windowMs: 15 * 60_000, prefix: 'auth:login' })
  if (!rl.allowed) {
    logger.warn({ ip }, 'Rate limit exceeded on login')
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || parsed.data.password !== adminPassword) {
    logger.warn({ ip }, 'Failed login attempt')
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const session = await getSession()
  session.isAdmin = true
  await session.save()

  logger.info({ ip }, 'Admin logged in')
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = await getSession()
  session.isAdmin = false
  await session.save()

  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await getSession()
  return NextResponse.json({ isAdmin: session.isAdmin || false })
}
