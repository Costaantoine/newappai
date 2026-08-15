/**
 * File d'attente + store mémoire du chantier live vitrine.
 * Pattern adapté de app/api/paperasse/analyser/route.ts : store sur
 * globalThis (survit au HMR en dev), reset anti-blocage, nettoyage des
 * jobs trop vieux. MAX 2 jobs traités en parallèle (voir worker.ts).
 */

import type { SiteConfig } from '@/components/webdesign/types'

export type JobStatus = 'queued' | 'running' | 'done' | 'error'

export interface VitrineJob {
  id: string
  status: JobStatus
  position: number | null
  etape: string
  logTail: string[]
  urlPreview: string | null
  createdAt: number
  startedAt: number | null
  completedAt: number | null
  email: string
  config: SiteConfig
  error: string | null
}

interface VitrineQueueState {
  jobs: Map<string, VitrineJob>
  order: string[]
  nextId: number
}

export const MAX_CONCURRENT_JOBS = 2
const MAX_LOG_LINES = 50
const JOB_MAX_AGE_MS = 30 * 60 * 1000
const STALE_RUNNING_MS = 25 * 60 * 1000

const globalStore = globalThis as unknown as { __vitrineJobs?: VitrineQueueState }

function getState(): VitrineQueueState {
  if (!globalStore.__vitrineJobs) {
    globalStore.__vitrineJobs = { jobs: new Map(), order: [], nextId: 1 }
  }
  return globalStore.__vitrineJobs
}

function updatePositions() {
  const state = getState()
  let pos = 0
  for (const id of state.order) {
    const job = state.jobs.get(id)
    if (!job) continue
    job.position = job.status === 'queued' ? ++pos : null
  }
}

/** Nettoyage anti-blocage (pattern paperasse) : jobs "running" bloqués depuis
 * trop longtemps (ex. après un redémarrage/HMR) sont marqués en erreur ;
 * les jobs terminés depuis plus de 30 min sont purgés de la mémoire. */
function cleanup() {
  const state = getState()
  const now = Date.now()

  for (const job of Array.from(state.jobs.values())) {
    if (job.status === 'running' && job.startedAt && now - job.startedAt > STALE_RUNNING_MS) {
      job.status = 'error'
      job.error = 'Délai maximum dépassé (25 min) — le job a probablement été interrompu.'
      job.completedAt = now
    }
  }

  const keep: string[] = []
  for (const id of state.order) {
    const job = state.jobs.get(id)
    if (!job) continue
    const age = now - job.createdAt
    if (age > JOB_MAX_AGE_MS && job.status !== 'queued' && job.status !== 'running') {
      state.jobs.delete(id)
      continue
    }
    keep.push(id)
  }
  state.order = keep

  updatePositions()
}

export function createJob(config: SiteConfig): VitrineJob {
  cleanup()
  const state = getState()
  const id = `vit_${Date.now()}_${state.nextId++}`
  const job: VitrineJob = {
    id,
    status: 'queued',
    position: null,
    etape: 'En attente de la file de génération...',
    logTail: [],
    urlPreview: null,
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    email: config.contact?.email || '',
    config,
    error: null,
  }
  state.jobs.set(id, job)
  state.order.push(id)
  updatePositions()
  return job
}

export function getJob(jobId: string): VitrineJob | null {
  return getState().jobs.get(jobId) || null
}

export function appendLog(jobId: string, line: string) {
  const job = getJob(jobId)
  if (!job) return
  const trimmed = line.trimEnd()
  if (!trimmed) return
  job.logTail.push(trimmed)
  if (job.logTail.length > MAX_LOG_LINES) {
    job.logTail = job.logTail.slice(job.logTail.length - MAX_LOG_LINES)
  }
}

export function setJobStatus(jobId: string, patch: Partial<VitrineJob>) {
  const job = getJob(jobId)
  if (!job) return
  Object.assign(job, patch)
  updatePositions()
}

/** Renvoie le prochain job "queued" à traiter, ou null si la file est vide
 * ou si MAX_CONCURRENT_JOBS jobs sont déjà "running". */
export function nextPendingJob(): VitrineJob | null {
  cleanup()
  const state = getState()
  const runningCount = Array.from(state.jobs.values()).filter((j) => j.status === 'running').length
  if (runningCount >= MAX_CONCURRENT_JOBS) return null
  for (const id of state.order) {
    const job = state.jobs.get(id)
    if (job && job.status === 'queued') return job
  }
  return null
}

export function markRunning(jobId: string) {
  setJobStatus(jobId, { status: 'running', startedAt: Date.now(), etape: 'Mission envoyée' })
}

export function markDone(jobId: string, urlPreview: string) {
  setJobStatus(jobId, { status: 'done', urlPreview, completedAt: Date.now(), etape: 'Aperçu prêt !' })
}

export function markError(jobId: string, message: string) {
  setJobStatus(jobId, { status: 'error', error: message, completedAt: Date.now() })
}

export interface VitrineStatusResponse {
  jobId: string | null
  status: JobStatus
  position: number | null
  etape: string
  logTail: string[]
  urlPreview: string | null
}

/** Forme de réponse partagée entre GET /api/vitrine/status et
 * GET /api/vitrine/generate — job inconnu → état "queued" honnête par défaut. */
export function toStatusResponse(jobId: string | null, job: VitrineJob | null): VitrineStatusResponse {
  if (!job) {
    return {
      jobId,
      status: 'queued',
      position: null,
      etape: 'En attente de la file de génération...',
      logTail: [],
      urlPreview: null,
    }
  }
  return {
    jobId: job.id,
    status: job.status,
    position: job.position,
    etape: job.status === 'error' && job.error ? job.error : job.etape,
    logTail: job.logTail,
    urlPreview: job.urlPreview,
  }
}
