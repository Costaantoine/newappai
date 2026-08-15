// ============================================================
// GET /api/vitrine/preview/<jobId>            → site/index.html
// GET /api/vitrine/preview/<jobId>/assets/x.png → sert le fichier statique
// Sert le site livré dans /home/newappai/vitrine-livraisons/<jobId>/site/.
// 404 si le job ou le fichier n'existe pas — jamais de succès simulé.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'

const DELIVERIES_DIR = '/home/newappai/vitrine-livraisons'

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

export async function GET(_request: NextRequest, { params }: { params: { jobId: string; path?: string[] } }) {
  const { jobId, path: segments } = params

  if (!jobId || !/^[a-zA-Z0-9_]+$/.test(jobId)) {
    return NextResponse.json({ error: 'jobId invalide' }, { status: 400 })
  }
  if (segments?.some((s) => s.includes('..'))) {
    return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 })
  }

  const siteDir = path.join(DELIVERIES_DIR, jobId, 'site')
  const relPath = segments && segments.length > 0 ? segments.join('/') : 'index.html'
  const resolved = path.normalize(path.join(siteDir, relPath))

  if (!resolved.startsWith(siteDir)) {
    return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 })
  }

  if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    return NextResponse.json({ error: 'Site introuvable — la génération est peut-être encore en cours.' }, { status: 404 })
  }

  const ext = path.extname(resolved).toLowerCase()
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'
  const body = readFileSync(resolved)

  return new NextResponse(body, { headers: { 'Content-Type': contentType } })
}
