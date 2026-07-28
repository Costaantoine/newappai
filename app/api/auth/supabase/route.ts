import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json()

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 })
    }

    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return NextResponse.json({ user: data.user, session: data.session })
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return NextResponse.json({ user: data.user, session: data.session })
    }

    if (action === 'signout') {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Action non valide' }, { status: 400 })
  } catch (error: any) {
    console.error('Erreur auth Supabase:', error)
    return NextResponse.json({ error: error.message || 'Erreur d\'authentification' }, { status: 500 })
  }
}
