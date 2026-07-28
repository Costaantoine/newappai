import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
  if (!book || !book.audio_path) {
    return NextResponse.json({ error: 'Livre introuvable' }, { status: 404 })
  }
  const manifestPath = join(book.audio_path, 'manifest.json')
  if (!existsSync(manifestPath)) {
    return NextResponse.json({ chapters: [] })
  }
  const data = await readFile(manifestPath, 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
