// ============================================================
// GET /api/vitrine/download/<jobId> → archive zip du site livré.
// Archive le contenu de /home/newappai/vitrine-livraisons/<jobId>/site/
// via la CLI « zip » (dépendance système légère, déjà présente), sans
// ajouter de lib JS. 404 si le job n'est pas livré — jamais de succès simulé.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import os from 'os'
import path from 'path'

const execFileAsync = promisify(execFile)

const DELIVERIES_DIR = '/home/newappai/vitrine-livraisons'

export async function GET(_request: NextRequest, { params }: { params: { jobId: string } }) {
  const { jobId } = params

  if (!jobId || !/^[a-zA-Z0-9_]+$/.test(jobId)) {
    return NextResponse.json({ error: 'jobId invalide' }, { status: 400 })
  }

  const siteDir = path.join(DELIVERIES_DIR, jobId, 'site')
  if (!existsSync(path.join(siteDir, 'index.html'))) {
    return NextResponse.json({ error: 'Site introuvable — la génération est peut-être encore en cours.' }, { status: 404 })
  }

  // Dossier temporaire isolé (créé par mkdtemp → jamais un chemin utilisateur).
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'vitrine-zip-'))
  const zipPath = path.join(tmpDir, `${jobId}.zip`)

  try {
    await execFileAsync('zip', ['-r', '-q', zipPath, '.'], { cwd: siteDir, timeout: 120000 })
    const body = readFileSync(zipPath)

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${jobId}.zip"`,
        'Content-Length': String(body.length),
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Échec de l'archivage du site : ${message}` }, { status: 500 })
  } finally {
    rmSync(tmpDir, { recursive: true, force: true })
  }
}
