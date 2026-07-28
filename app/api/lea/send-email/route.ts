import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeaDemoEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { session_id, email, history = [], lang = 'fr' } = await request.json()

    if (!session_id || !email) {
      return NextResponse.json({ error: 'session_id et email requis' }, { status: 400 })
    }

    const session = await prisma.leaSession.findUnique({ where: { id: session_id } })
    if (!session) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 404 })
    }

    // Sécurité : l'e-mail n'est envoyé qu'à l'adresse liée à la session, jamais à une autre
    if (session.user_email !== email) {
      return NextResponse.json({ error: 'Adresse e-mail non autorisée pour cette session' }, { status: 403 })
    }

    const sent = await sendLeaDemoEmail({
      recipientEmail: session.user_email,
      lang,
      history,
    })

    if (sent) {
      await prisma.leaSession.update({
        where: { id: session_id },
        data: { email_sent: true }
      })
    }

    return NextResponse.json({ sent })
  } catch (error: any) {
    console.error('Lea send-email error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'e-mail' }, { status: 500 })
  }
}
