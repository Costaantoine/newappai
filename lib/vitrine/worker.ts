/**
 * Worker du chantier live : dépile la file (lib/vitrine/queue.ts), construit
 * la mission (buildMission.ts), l'envoie sur le VPS dev par SSH/SCP, lance
 * `claude -p` en streaming (spawn — jamais exec) et rapatrie le site généré.
 * Pattern adapté de app/api/paperasse/analyser/route.ts, avec log réel
 * streamé au lieu d'une sortie en bloc.
 *
 * Honnêteté : aucune étape n'est marquée franchie sans preuve réelle
 * (fichier trouvé, commande réussie). En cas d'échec, markError() avec le
 * vrai message — jamais de succès simulé.
 */

import { execFile, spawn } from 'child_process'
import { promisify } from 'util'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import type { SiteConfig } from '@/components/webdesign/types'
import {
  MAX_CONCURRENT_JOBS,
  type VitrineJob,
  appendLog,
  getJob,
  markDone,
  markError,
  markRunning,
  nextPendingJob,
  setJobStatus,
} from '@/lib/vitrine/queue'
import { buildMission } from '@/lib/vitrine/buildMission'
import { importSocialContent, importLogLine } from './importSocial'
import type { ImportSummary } from './importSocial'
import { parseProgress } from '@/lib/vitrine/progress'

const execFileAsync = promisify(execFile)

const VPS_TARGET = 'root@76.13.141.221'
const VPS_JOBS_DIR = '/root/vitrine-jobs'
const LOCAL_JOBS_DIR = '/home/newappai/vitrine-jobs'
const LOCAL_DELIVERIES_DIR = '/home/newappai/vitrine-livraisons'
const WEB_DESIGN_GUIDELINES = '/root/.claude/skills/web-design-guidelines/SKILL.md'

const SSH_FLAGS = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=20', '-o', 'StrictHostKeyChecking=accept-new']
const SCP_FLAGS = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=20', '-o', 'StrictHostKeyChecking=accept-new']

const JOB_TIMEOUT_MS = 25 * 60 * 1000
const BILLING_PATTERN = /billing|credit|rate.?limit|session.?limit|402|quota/i

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

// ─── Boucle globale du worker (survit au HMR via globalThis) ──────────────

interface WorkerState {
  activeRunners: number
}

const globalWorkerStore = globalThis as unknown as { __vitrineWorker?: WorkerState }

function getWorkerState(): WorkerState {
  if (!globalWorkerStore.__vitrineWorker) {
    globalWorkerStore.__vitrineWorker = { activeRunners: 0 }
  }
  return globalWorkerStore.__vitrineWorker
}

/** À appeler (fire-and-forget) après création d'un job pour garantir qu'un
 * runner traite la file. Sans effet si des runners tournent déjà. */
export function ensureWorkerRunning(): void {
  for (let i = 0; i < MAX_CONCURRENT_JOBS; i++) {
    runLoop().catch((err) => console.error('[vitrine worker] runLoop error', err))
  }
}

async function runLoop(): Promise<void> {
  const state = getWorkerState()
  if (state.activeRunners >= MAX_CONCURRENT_JOBS) return
  state.activeRunners++
  try {
    while (true) {
      const job = nextPendingJob()
      if (!job) break
      await processJob(job)
    }
  } finally {
    state.activeRunners--
  }
}

// ─── Traitement d'un job ────────────────────────────────────────────────

function pushLog(jobId: string, line: string) {
  const trimmed = line.trim()
  if (!trimmed) return
  appendLog(jobId, trimmed)
  const job = getJob(jobId)
  if (!job) return
  const { etape } = parseProgress(job.logTail, job.status)
  setJobStatus(jobId, { etape })
}

async function processJob(job: VitrineJob): Promise<void> {
  const jobId = job.id
  const jobStart = Date.now()
  markRunning(jobId)
  pushLog(jobId, 'Mission envoyée — préparation du dossier de travail...')

  const localJobDir = path.join(LOCAL_JOBS_DIR, jobId)

  try {
    mkdirSync(path.join(localJobDir, 'assets'), { recursive: true })

    // Import social optionnel : photos + textes réels du client depuis ses
    // réseaux (Instagram/TikTok/Facebook/Pinterest) -> dossier ./import du job.
    let importSummary: ImportSummary | null = null
    const socialUrl = job.config.contact?.socialImport?.trim()
    if (socialUrl) {
      pushLog(jobId, 'Récupération des photos et textes depuis les réseaux sociaux du client...')
      importSummary = await importSocialContent(localJobDir, socialUrl)
      pushLog(jobId, importLogLine(importSummary))
    }

    writeFileSync(path.join(localJobDir, 'mission.md'), buildMission(job.config, importSummary), 'utf-8')
    writeAssets(job.config, localJobDir)
    writeFileSync(path.join(localJobDir, 'run.sh'), buildRunScript(jobId, 'claude -p'), { mode: 0o755 })

    pushLog(jobId, 'Envoi de la mission vers le serveur de génération...')
    await execFileAsync('ssh', [...SSH_FLAGS, VPS_TARGET, `mkdir -p ${VPS_JOBS_DIR}`], { timeout: 15000 })
    await execFileAsync('scp', ['-r', ...SCP_FLAGS, localJobDir, `${VPS_TARGET}:${VPS_JOBS_DIR}/`], { timeout: 60000 })

    let remaining = JOB_TIMEOUT_MS - (Date.now() - jobStart)
    if (remaining <= 0) {
      markError(jobId, 'Délai maximum de 25 minutes dépassé avant le lancement de la génération.')
      return
    }

    pushLog(jobId, 'Lecture du design de référence et génération des sections...')
    let run = await runStreamed(
      'ssh',
      [...SSH_FLAGS, VPS_TARGET, `bash ${VPS_JOBS_DIR}/${jobId}/run.sh`],
      remaining,
      (line) => pushLog(jobId, line)
    )

    if (run.timedOut) {
      markError(jobId, 'Délai maximum de 25 minutes dépassé pendant la génération.')
      return
    }

    if (run.code !== 0) {
      const tail = job.logTail.join('\n')
      if (BILLING_PATTERN.test(tail)) {
        pushLog(jobId, "Échec probablement lié aux crédits/quota — recherche d'un wrapper fcc de secours sur le VPS...")
        const fccBin = await findFccBinary()

        if (!fccBin) {
          markError(
            jobId,
            `Génération échouée (crédits/quota probablement épuisés) et aucun wrapper fcc disponible sur le VPS. Fin de la sortie : ${tail.slice(-500)}`
          )
          return
        }

        pushLog(jobId, `Wrapper fcc trouvé (${fccBin}) — nouvelle tentative...`)
        writeFileSync(path.join(localJobDir, 'run.sh'), buildRunScript(jobId, `${fccBin} -p`), { mode: 0o755 })
        await execFileAsync('scp', [...SCP_FLAGS, path.join(localJobDir, 'run.sh'), `${VPS_TARGET}:${VPS_JOBS_DIR}/${jobId}/run.sh`], {
          timeout: 20000,
        })

        remaining = JOB_TIMEOUT_MS - (Date.now() - jobStart)
        if (remaining <= 0) {
          markError(jobId, 'Délai maximum de 25 minutes dépassé avant la tentative de secours (fcc).')
          return
        }

        run = await runStreamed(
          'ssh',
          [...SSH_FLAGS, VPS_TARGET, `bash ${VPS_JOBS_DIR}/${jobId}/run.sh`],
          remaining,
          (line) => pushLog(jobId, line)
        )

        if (run.timedOut) {
          markError(jobId, 'Délai maximum de 25 minutes dépassé pendant la tentative de secours (fcc).')
          return
        }
      }
    }

    pushLog(jobId, 'Vérification du site généré...')
    const found = await checkRemoteFileExists(`${VPS_JOBS_DIR}/${jobId}/site/index.html`)

    if (!found) {
      markError(
        jobId,
        `La génération s'est terminée (code de sortie ${run.code ?? 'inconnu'}) mais aucun fichier site/index.html n'a été trouvé sur le VPS.`
      )
      return
    }

    pushLog(jobId, 'Récupération du site généré...')
    const localDeliveryDir = path.join(LOCAL_DELIVERIES_DIR, jobId)
    mkdirSync(localDeliveryDir, { recursive: true })
    await execFileAsync('scp', ['-r', ...SCP_FLAGS, `${VPS_TARGET}:${VPS_JOBS_DIR}/${jobId}/site`, `${localDeliveryDir}/`], {
      timeout: 120000,
    })

    if (!existsSync(path.join(localDeliveryDir, 'site', 'index.html'))) {
      markError(jobId, "Le rapatriement du site depuis le VPS a échoué (index.html absent en local après scp).")
      return
    }

    pushLog(jobId, 'Aperçu prêt !')
    markDone(jobId, `/api/vitrine/preview/${jobId}`)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue pendant la génération.'
    pushLog(jobId, `[erreur] ${message}`)
    markError(jobId, message)
  }
}

// ─── Assets (photos/vidéos uploadées) ──────────────────────────────────

function decodeDataUrl(dataUrl: string): { buffer: Buffer; ext: string } | null {
  const match = /^data:([^;,]+)(;[^,]*)?,([\s\S]+)$/.exec(dataUrl)
  if (!match) return null
  const mime = match[1]
  const isBase64 = (match[2] || '').includes('base64')
  const data = match[3]
  const buffer = isBase64 ? Buffer.from(data, 'base64') : Buffer.from(decodeURIComponent(data), 'utf-8')
  return { buffer, ext: MIME_EXT[mime] || 'bin' }
}

/** Écrit les uploads (logo + galerie) dans <localJobDir>/assets/. Continue
 * simplement sans rien écrire si le client n'a fourni aucun upload. */
function writeAssets(config: SiteConfig, localJobDir: string): void {
  const assetsDir = path.join(localJobDir, 'assets')

  if (config.business.logo?.dataUrl) {
    const decoded = decodeDataUrl(config.business.logo.dataUrl)
    if (decoded) writeFileSync(path.join(assetsDir, `logo.${decoded.ext}`), decoded.buffer)
  }

  config.gallery.forEach((media, index) => {
    if (!media.dataUrl) return
    const decoded = decodeDataUrl(media.dataUrl)
    if (decoded) writeFileSync(path.join(assetsDir, `gallery-${index + 1}.${decoded.ext}`), decoded.buffer)
  })
}

// ─── Script exécuté sur le VPS ─────────────────────────────────────────

function buildRunScript(jobId: string, binaryCmd: string): string {
  return `#!/bin/bash
set -o pipefail
cd ${VPS_JOBS_DIR}/${jobId} || { echo "ERREUR: dossier de job introuvable sur le VPS"; exit 1; }
mkdir -p site
GUIDELINES=${WEB_DESIGN_GUIDELINES}
if [ -f "$GUIDELINES" ]; then
  ${binaryCmd} "$(cat mission.md)" --append-system-prompt-file "$GUIDELINES" --max-turns 30 2>&1
else
  ${binaryCmd} "$(cat mission.md)" --max-turns 30 2>&1
fi
`
}

// ─── SSH streaming ──────────────────────────────────────────────────────

function runStreamed(
  command: string,
  args: string[],
  timeoutMs: number,
  onLine: (line: string) => void
): Promise<{ code: number | null; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let timedOut = false
    let stdoutBuf = ''
    let stderrBuf = ''

    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, Math.max(timeoutMs, 0))

    const handleChunk = (chunk: Buffer, isErr: boolean) => {
      const text = chunk.toString('utf-8')
      const combined = (isErr ? stderrBuf : stdoutBuf) + text
      const lines = combined.split('\n')
      const rest = lines.pop() ?? ''
      if (isErr) stderrBuf = rest
      else stdoutBuf = rest
      for (const line of lines) onLine(line)
    }

    child.stdout.on('data', (chunk: Buffer) => handleChunk(chunk, false))
    child.stderr.on('data', (chunk: Buffer) => handleChunk(chunk, true))

    child.on('close', (code) => {
      clearTimeout(timer)
      if (stdoutBuf) onLine(stdoutBuf)
      if (stderrBuf) onLine(stderrBuf)
      resolve({ code, timedOut })
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      onLine(`[erreur process] ${err.message}`)
      resolve({ code: null, timedOut })
    })
  })
}

// ─── Vérifications distantes / fallback FCC ────────────────────────────

async function checkRemoteFileExists(remotePath: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync(
      'ssh',
      [...SSH_FLAGS, VPS_TARGET, `test -f ${remotePath} && echo FOUND || echo MISSING`],
      { timeout: 15000 }
    )
    return stdout.trim() === 'FOUND'
  } catch {
    return false
  }
}

async function sshCheck(remoteCmd: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('ssh', [...SSH_FLAGS, VPS_TARGET, `${remoteCmd} 2>/dev/null`], { timeout: 15000 })
    const line = stdout.trim().split('\n')[0]
    return line || null
  } catch {
    return null
  }
}

/** Cherche un wrapper fcc (fallback billing) accessible en root ou via l'utilisateur ccuser. */
async function findFccBinary(): Promise<string | null> {
  if (await sshCheck('command -v fcc-claude')) return 'fcc-claude'
  if (await sshCheck('sudo -u ccuser command -v fcc-claude')) return 'sudo -u ccuser fcc-claude'
  return null
}
