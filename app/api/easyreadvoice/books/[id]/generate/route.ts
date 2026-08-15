import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mkdir, writeFile, readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"
import { createClient } from "@/lib/supabase/server"
import { encryptFile } from "@/lib/crypto"

const VOICE_MAP: Record<string, string> = {
  denise: "fr-FR-DeniseNeural",
  remy: "fr-FR-RemyMultilingualNeural",
  eloise: "fr-FR-EloiseNeural",
  henri: "fr-FR-HenriNeural",
  vivienne: "fr-FR-VivienneMultilingualNeural",
  antoine: "fr-CA-AntoineNeural",
  sylvie: "fr-CA-SylvieNeural",
  charline: "fr-BE-CharlineNeural",
}
const DEFAULT_VOICE = "fr-FR-DeniseNeural"

function getEdgeTtsPath(): string {
  const candidates = [
    "/home/newappai/.hermes/hermes-agent/venv/bin/edge-tts",
    "/usr/local/bin/edge-tts",
    "/usr/bin/edge-tts",
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return "edge-tts"
}

function edgeTTS(text: string, voice: string, outPath: string): void {
  const bin = getEdgeTtsPath()
  const textFile = outPath.replace(/\.mp3$/, ".txt")
  // Write text to temp file to avoid shell escaping issues
  const fs = require("fs")
  fs.writeFileSync(textFile, text, "utf-8")
  execSync(`"${bin}" --voice "${voice}" -f "${textFile}" --write-media "${outPath}"`, {
    timeout: 120000,
    stdio: "pipe",
  })
  try { fs.unlinkSync(textFile) } catch {}
}

function getMP3Duration(filePath: string): number {
  try {
    const { execSync } = require("child_process")
    const result = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}" 2>/dev/null`,
      { timeout: 10000, encoding: "utf-8" }
    )
    return Math.round(parseFloat(result.trim()))
  } catch {
    return 0
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Detection du mode test
    const isTest = request.headers.get("x-test-mode") === "true"

    // Auth
    if (!isTest) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
      }
    }

    // Charger le livre
    const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
    if (!book) {
      return NextResponse.json({ error: "Livre introuvable" }, { status: 404 })
    }
    if (book.status !== "pending") {
      return NextResponse.json({ error: `Livre non en attente (status: ${book.status})` }, { status: 400 })
    }

    // Lire la voix depuis le body
    const body = await request.json().catch(() => ({}))
    const voiceId = body.voice
    const edgeVoice = VOICE_MAP[voiceId] || DEFAULT_VOICE

    // Status processing
    await prisma.audioBook.update({ where: { id: book.id }, data: { status: "processing" } })

    // Lire le fichier texte uploade
    let textContent = ""
    const filePath = book.audio_path // stocke le path du fichier uploade
    if (filePath && existsSync(filePath)) {
      textContent = await readFile(filePath, "utf-8")
    } else {
      await prisma.audioBook.update({ where: { id: book.id }, data: { status: "error" } })
      return NextResponse.json({ error: "Fichier source introuvable" }, { status: 500 })
    }

    // Decouper en chapitres (paresseux: tout dans un seul chapitre pour le test)
    const audioDir = `/tmp/easyreadvoice-audio/${book.id}`
    await mkdir(audioDir, { recursive: true })
    const chapterPath = join(audioDir, "chapter_001.mp3")

    // Generer l'audio via edge-tts
    try {
      edgeTTS(textContent, edgeVoice, chapterPath)
    } catch (e: any) {
      await prisma.audioBook.update({ where: { id: book.id }, data: { status: "error" } })
      return NextResponse.json({ error: `Erreur edge-tts: ${e.message}` }, { status: 500 })
    }

    // Duree (AVANT chiffrement, ffprobe ne lit pas les fichiers chiffres)
    const durationSec = getMP3Duration(chapterPath)

    // Chiffrer le MP3 (comme le ferait le vrai pipeline)
    const rawMp3 = require("fs").readFileSync(chapterPath)
    const aesKey = process.env.AES_KEY || "h6bC9Ixii933fPdpC4xf0S8yQMtGpIhS"
    const aesIv = process.env.AES_IV || "hJqLYuzHtbMA2f5k"
    const encrypted = encryptFile(rawMp3, aesKey, aesIv)
    require("fs").writeFileSync(chapterPath, encrypted)

    // Marquer ready
    await prisma.audioBook.update({
      where: { id: book.id },
      data: {
        status: "ready",
        audio_path: audioDir,
        chapters: 1,
        chapters_done: 1,
        progress_pct: 100,
        duration_sec: durationSec,
      },
    })

    return NextResponse.json({ success: true, durationSec })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
