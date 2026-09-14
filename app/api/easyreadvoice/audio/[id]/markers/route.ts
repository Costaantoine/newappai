import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

const PLAYER_PRODUCT_TITLE = "EasyReadVoice Player"

// Verrou d'acces audio : proprietaire du livre OU acheteur du player EasyReadVoice (4,99 €).
// Mode test (x-test-mode: true) : acces autorise, utilise par /test/easyreadvoice.
// Retourne null si l'acces est autorise, sinon la reponse d'erreur (401/403).
async function assertAudioAccess(
  request: NextRequest,
  ownerEmail: string
): Promise<NextResponse | null> {
  if (request.headers.get("x-test-mode") === "true") {
    return null
  }

  let userEmail: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email || null
  } catch {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  }
  if (!userEmail) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  }

  // Proprietaire du livre
  if (userEmail === ownerEmail) {
    return null
  }

  // Acheteur du player (ordre completed sur le produit EasyReadVoice Player)
  const product = await prisma.product.findFirst({ where: { title: PLAYER_PRODUCT_TITLE } })
  if (product) {
    const order = await prisma.order.findFirst({
      where: {
        product_id: product.id,
        customer_email: userEmail,
        status: "completed",
      },
    })
    if (order) return null
  }

  return NextResponse.json({ error: "Player requis", user_email: ownerEmail }, { status: 403 })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
  if (!book || !book.audio_path) {
    return NextResponse.json({ markers: [] })
  }

  const denied = await assertAudioAccess(request, book.user_email)
  if (denied) return denied

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
