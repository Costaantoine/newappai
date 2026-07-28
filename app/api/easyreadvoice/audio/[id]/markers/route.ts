import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
  if (!book || !book.audio_path) {
    return NextResponse.json({ markers: [] })
  }

  const markersPath = join(book.audio_path, "markers.json")
  if (!existsSync(markersPath)) {
    return NextResponse.json({ markers: [] })
  }

  const data = await readFile(markersPath, "utf-8")
  const raw = JSON.parse(data)

  const markers = Array.isArray(raw)
    ? raw
    : Object.entries(raw as Record<string, number>)
        .map(([chapterId, startSeconds], i) => ({
          start_seconds: startSeconds,
          title: `Chapitre ${Number(chapterId) + 1 || i + 1}`,
        }))
        .sort((a, b) => a.start_seconds - b.start_seconds)

  return NextResponse.json({ markers })
}
