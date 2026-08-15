// ============================================================
// GET /api/vitrine/status?jobId=xxx
// État minimal honnête du chantier live — MISSION 3 : le vrai worker
// (queue, SSH, claude --print, log streamé) arrive en mission 4.
// AUCUNE fausse progression n'est simulée ici.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId')

  return NextResponse.json({
    jobId,
    status: 'queued',
    position: null,
    etape: 'En attente de la file de génération...',
    logTail: [],
    urlPreview: null,
  })
}
