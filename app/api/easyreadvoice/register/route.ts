import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    // Validation côté serveur (miroir des validations du formulaire)
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service indisponible pour le moment. Réessayez plus tard.' },
        { status: 500 }
      )
    }

    // Création immédiate, sans email de confirmation : email_confirm: true
    const { data: _createdUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Erreur inscription:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
