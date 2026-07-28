import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password, lang = 'fr' } = await request.json()

    if (!email || !password || password.length < 4) {
      return NextResponse.json({ error: 'Email et mot de passe requis (min 4 car.)' }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.leaTestUser.findUnique({ where: { email } })
    if (existing) {
      // Créer une nouvelle session même si l'utilisateur existe déjà
      const session = await prisma.leaSession.create({
        data: { user_email: email, lang }
      })
      return NextResponse.json({
        message: 'Nouvelle session démarrée',
        email,
        session_id: session.id
      })
    }

    // Hash simple du mot de passe (SHA-256, suffisant pour un test)
    const password_hash = crypto.createHash('sha256').update(password).digest('hex')

    const user = await prisma.leaTestUser.create({
      data: { email, password_hash, lang }
    })

    const session = await prisma.leaSession.create({
      data: { user_email: email, lang }
    })

    return NextResponse.json({
      message: 'Compte de test créé',
      email,
      session_id: session.id
    })
  } catch (error: any) {
    console.error('Lea register error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 })
  }
}
