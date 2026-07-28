import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

// GET - Récupérer les settings
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'main' },
    })

    if (!settings) {
      const defaultSettings = {
        site: {
          logo_text: 'NewAppAI',
          primary_color: '#0ea5e9',
          secondary_color: '#6366f1',
        },
        buttons: {
          primary_color: '#0ea5e9',
          secondary_color: '#6366f1',
        },
        audio: {
          enabled: false,
        },
      }
      return NextResponse.json({ settings: defaultSettings })
    }

    return NextResponse.json({ settings: JSON.parse(settings.data) })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour les settings
export async function PUT(request: NextRequest) {
  console.log('API /supabase/settings PUT called')
  const isAdmin = await requireAdmin()
  console.log('Admin check result:', isAdmin)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    // Lire les settings existants
    const existing = await prisma.settings.findUnique({
      where: { id: 'main' },
    })

    const currentSettings = existing ? JSON.parse(existing.data) : {}
    const updatedSettings = {
      ...currentSettings,
      ...body,
      // Merge profond pour les objets imbriqués
      site: { ...currentSettings.site, ...body.site },
      hero: { ...currentSettings.hero, ...body.hero },
      header: { ...currentSettings.header, ...body.header },
      footer: { ...currentSettings.footer, ...body.footer },
      buttons: { ...currentSettings.buttons, ...body.buttons },
      audio: { ...currentSettings.audio, ...body.audio },
      contact: { ...currentSettings.contact, ...body.contact },
      hero_texts: { ...currentSettings.hero_texts, ...body.hero_texts },
      contact_page: { ...currentSettings.contact_page, ...body.contact_page },
    }

    const result = await prisma.settings.upsert({
      where: { id: 'main' },
      update: { data: JSON.stringify(updatedSettings) },
      create: { id: 'main', data: JSON.stringify(updatedSettings) },
    })

    return NextResponse.json({ settings: JSON.parse(result.data) })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
