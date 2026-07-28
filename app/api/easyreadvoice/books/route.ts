import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ books: [] }, { status: 401 })
  }

  const status = request.nextUrl.searchParams.get("status")

  let sql = "SELECT id, user_email, title, original_file, file_type, char_count, plan_id, status, audio_path, duration_sec, chapters, chapter_markers, created_at, updated_at, expires_at FROM \"AudioBook\" WHERE status != 'deleted' AND user_email = $1"
  const params: any[] = [user.email]
  let idx = 2
  if (status) { sql += ` AND status = $${idx++}`; params.push(status) }
  sql += " ORDER BY created_at DESC"

  const books = await prisma.$queryRawUnsafe(sql, ...params)
  return NextResponse.json({ books })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const email = formData.get("email") as string
    const title = formData.get("title") as string
    const planId = formData.get("planId") as string || "decouverte"

    if (!file || !email || !title) {
      return NextResponse.json({ error: "file, email et title requis" }, { status: 400 })
    }

    const uploadDir = "/tmp/easyreadvoice-uploads"
    await mkdir(uploadDir, { recursive: true })
    const ext = file.name.split(".").pop() || "txt"
    const fileName = `${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`
    const filePath = join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    let text = ""
    if (ext === "txt") {
      text = await file.text()
    }

    const book = await prisma.audioBook.create({
      data: {
        user_email: email,
        title,
        original_file: file.name,
        file_type: ext,
        char_count: text.length || 0,
        plan_id: planId,
        status: "pending",
        audio_path: filePath,
      }
    })

    return NextResponse.json({ success: true, book })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, audioPath, durationSec, chapters, status } = body
    if (!bookId) return NextResponse.json({ error: "bookId requis" }, { status: 400 })

    // Le worker local (pipeline audio) met a jour le livre via un secret partage,
    // sans session utilisateur. Les autres appelants doivent prouver la propriete du livre.
    const workerSecret = request.headers.get("x-worker-secret")
    const isWorker = !!process.env.EASYREADVOICE_WORKER_SECRET && workerSecret === process.env.EASYREADVOICE_WORKER_SECRET

    if (!isWorker) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
      }

      const existing = await prisma.audioBook.findUnique({ where: { id: bookId } })
      if (!existing) {
        return NextResponse.json({ error: "Livre introuvable" }, { status: 404 })
      }
      if (existing.user_email !== user.email) {
        return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
      }
    }

    const data: any = {}
    if (audioPath !== undefined) data.audio_path = audioPath
    if (durationSec !== undefined) data.duration_sec = durationSec
    if (chapters !== undefined) data.chapters = chapters
    if (status !== undefined) data.status = status
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "rien a mettre a jour" }, { status: 400 })

    await prisma.audioBook.update({ where: { id: bookId }, data })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
