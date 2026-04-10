import { NextRequest, NextResponse } from 'next/server'
import { ContactSchema, formatZodError } from '@/lib/validators'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Rate limit: 3 messages per 10 minutes per IP
  const ip = getClientIp(request)
  const rl = checkRateLimit(ip, { limit: 3, windowMs: 10 * 60_000, prefix: 'contact' })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Veuillez patienter quelques minutes.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 })
  }

  const { name, email, subject, message } = parsed.data

  logger.info({ email, subject }, 'Contact form submission received')

  const sent = await sendContactEmail({ name, email, subject, message })

  return NextResponse.json({
    success: true,
    emailSent: sent,
    message: sent
      ? 'Votre message a été envoyé avec succès.'
      : 'Message enregistré. Nous vous contacterons bientôt.',
  })
}
