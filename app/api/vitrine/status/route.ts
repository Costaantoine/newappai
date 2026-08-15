// ============================================================
// GET /api/vitrine/status?jobId=xxx
// État réel du chantier live, lu depuis le store lib/vitrine/queue.ts.
// AUCUNE fausse progression n'est simulée ici.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getJob, toStatusResponse } from '@/lib/vitrine/queue'

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: 'jobId requis' }, { status: 400 })
  }

  return NextResponse.json(toStatusResponse(jobId, getJob(jobId)))
}
