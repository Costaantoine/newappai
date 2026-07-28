import { NextRequest, NextResponse } from 'next/server'
import { ContactSchema } from '@/lib/validators'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = checkRateLimit(ip, { limit: 3, windowMs: 60_000, prefix: 'contact' })

  if (!allowed) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = ContactSchema.parse(body)

    const emailSent = await sendContactEmail({
      name: parsed.name,
      email: parsed.email,
      subject: parsed.subject,
      message: parsed.message,
    })

    if (!emailSent) {
      console.warn('Contact email not sent (SMTP not configured)')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' 
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    console.error('Erreur contact:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 })
  }
}
