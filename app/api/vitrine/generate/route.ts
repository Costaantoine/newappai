// ============================================================
// POST /api/vitrine/generate — lance une génération de site (chantier live)
// GET  /api/vitrine/generate?jobId=xxx — statut (alias de /api/vitrine/status)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { SiteConfig } from '@/components/webdesign/types'
import { createJob, getJob, toStatusResponse } from '@/lib/vitrine/queue'
import { ensureWorkerRunning } from '@/lib/vitrine/worker'

const EMAIL_COOLDOWN_MS = 30 * 60 * 1000

interface EmailMapState {
  map: Map<string, string>
}

const globalEmailStore = globalThis as unknown as { __vitrineEmails?: EmailMapState }

function getEmailState(): EmailMapState {
  if (!globalEmailStore.__vitrineEmails) {
    globalEmailStore.__vitrineEmails = { map: new Map() }
  }
  return globalEmailStore.__vitrineEmails
}

function validateConfig(config: SiteConfig | undefined | null): string | null {
  if (!config) return 'Configuration du site manquante.'
  if (!config.business?.name?.trim()) return "Le nom de l'entreprise est requis."
  const hasContact = Boolean(
    config.contact?.phone?.trim() ||
      config.contact?.email?.trim() ||
      config.contact?.instagram?.trim() ||
      config.contact?.facebook?.trim()
  )
  if (!hasContact) return 'Au moins un moyen de contact est requis (téléphone, email, Instagram ou Facebook).'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const config = body?.config as SiteConfig | undefined

    const validationError = validateConfig(config)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const email = config!.contact.email?.trim().toLowerCase() || ''
    const emailState = getEmailState()

    if (email) {
      const existingJobId = emailState.map.get(email)
      const existingJob = existingJobId ? getJob(existingJobId) : null
      if (existingJob && existingJob.status !== 'error' && Date.now() - existingJob.createdAt < EMAIL_COOLDOWN_MS) {
        return NextResponse.json({
          jobId: existingJob.id,
          status: existingJob.status,
          position: existingJob.position,
          note: 'Un aperçu a déjà été généré pour cet email — réutilisation du job en cours.',
        })
      }
    }

    const job = createJob(config as SiteConfig)
    if (email) emailState.map.set(email, job.id)

    ensureWorkerRunning()

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      position: job.position,
    })
  } catch (err: unknown) {
    console.error('Erreur génération vitrine:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: 'jobId requis' }, { status: 400 })
  }
  return NextResponse.json(toStatusResponse(jobId, getJob(jobId)))
}
