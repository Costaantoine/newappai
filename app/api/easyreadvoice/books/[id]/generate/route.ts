import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { createClient } from "@/lib/supabase/server"

const QUEUE_DIR = "/tmp/easyreadvoice-queue"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
    }

    const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
    if (!book) {
      return NextResponse.json({ error: "Livre introuvable" }, { status: 404 })
    }
    if (book.user_email !== user.email) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
    }
    if (book.status !== "pending") {
      return NextResponse.json({ error: `Livre non en attente (status: ${book.status})` }, { status: 400 })
    }

    await prisma.audioBook.update({ where: { id: book.id }, data: { status: "processing" } })

    await mkdir(QUEUE_DIR, { recursive: true })
    const queuePath = join(QUEUE_DIR, `${book.id}.json`)
    await writeFile(queuePath, JSON.stringify({
      id: book.id,
      user_email: book.user_email,
      title: book.title,
      original_file: book.original_file,
      file_type: book.file_type,
      plan_id: book.plan_id,
      audio_path: book.audio_path,
    }, null, 2))

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
