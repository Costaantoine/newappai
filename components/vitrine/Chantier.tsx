'use client'

import { useEffect, useRef, useState } from 'react'
import Preview from '@/components/webdesign/Preview'
import type { SiteConfig } from '@/components/webdesign/types'
import { ESTIMATION, POLL_MS, STEPS, parseProgress } from '@/lib/vitrine/progress'

type JobStatus = 'queued' | 'running' | 'done' | 'error'

interface StatusResponse {
  status: JobStatus
  position: number | null
  etape: string
  logTail: string[]
  urlPreview: string | null
}

const DISPLAY_STEPS = [...STEPS.map((s) => s.label), 'Aperçu prêt !']

function formatElapsed(seconds: number): string {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const ss = (seconds % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

export default function Chantier({ config, jobId }: { config: SiteConfig; jobId?: string }) {
  const [elapsed, setElapsed] = useState(0)
  const [logTail, setLogTail] = useState<string[]>([])
  const [status, setStatus] = useState<JobStatus>('queued')
  const [urlPreview, setUrlPreview] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!jobId) return

    const poll = async () => {
      try {
        const res = await fetch(`/api/vitrine/status?jobId=${encodeURIComponent(jobId)}`)
        if (!res.ok) return
        const data: StatusResponse = await res.json()
        setStatus(data.status)
        setLogTail(data.logTail || [])
        setUrlPreview(data.urlPreview)
        if (data.status === 'error') {
          setErrorMessage(data.etape || 'Une erreur est survenue pendant la génération.')
        }
        if (data.status === 'done' && pollRef.current) {
          clearInterval(pollRef.current)
        }
      } catch {
        // panne réseau ponctuelle — le prochain poll réessaiera
      }
    }

    poll()
    pollRef.current = setInterval(poll, POLL_MS)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [jobId])

  const { etapeIndex } = parseProgress(logTail, status)

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Colonne gauche — squelette */}
      <div className="flex flex-col">
        <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-medium text-violet-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          APERÇU PROVISOIRE — votre site se construit...
        </div>

        <div className="h-[600px]">
          <Preview config={config} />
        </div>

        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Les textes et le design finaux sont générés par notre IA en ce moment ({ESTIMATION}).
        </p>
      </div>

      {/* Colonne droite — flux */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="text-xl font-bold text-white mb-1">Construction de votre site</h2>
        <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
          <span>Temps écoulé : {formatElapsed(elapsed)}</span>
          <span>Temps estimé : {ESTIMATION}</span>
        </div>

        <ol className="space-y-4 mb-6">
          {DISPLAY_STEPS.map((label, i) => {
            const isDone = i < etapeIndex
            const isActive = i === etapeIndex
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isActive
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
                        : 'bg-neutral-800 text-slate-600 border border-neutral-700'
                  }`}
                >
                  {isDone ? (
                    '✓'
                  ) : isActive ? (
                    <span className="w-3 h-3 border-2 border-violet-400/40 border-t-violet-300 rounded-full animate-spin" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`text-sm ${
                    isDone ? 'text-emerald-400' : isActive ? 'text-violet-200 font-medium' : 'text-slate-600'
                  }`}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>

        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Activité</p>
        <pre className="h-40 overflow-y-auto rounded-xl border border-neutral-800 bg-black/60 p-3 text-xs text-slate-400 font-mono whitespace-pre-wrap">
          {logTail.length > 0 ? logTail.join('\n') : 'La génération va démarrer...'}
        </pre>

        {status === 'error' && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {status === 'done' && urlPreview && (
          <a
            href={urlPreview}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-bold py-3 rounded-2xl transition"
          >
            Voir mon site
          </a>
        )}

        {!jobId && (
          <p className="text-xs text-slate-600 mt-4">
            Mode aperçu seul — aucune génération en cours.
          </p>
        )}
      </div>
    </div>
  )
}
