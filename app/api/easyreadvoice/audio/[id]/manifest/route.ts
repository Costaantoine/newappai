import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const PLAYER_PRODUCT_TITLE = 'EasyReadVoice Player'

// Verrou d'acces audio : proprietaire du livre OU acheteur du player EasyReadVoice (4,99 €).
// Mode test (x-test-mode: true) : acces autorise, utilise par /test/easyreadvoice.
// Retourne null si l'acces est autorise, sinon la reponse d'erreur (401/403).
async function assertAudioAccess(
  request: NextRequest,
  ownerEmail: string
): Promise<NextResponse | null> {
  if (request.headers.get('x-test-mode') === 'true') {
    return null
  }

  let userEmail: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email || null
  } catch {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
  }
  if (!userEmail) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
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
        status: 'completed',
      },
    })
    if (order) return null
  }

  return NextResponse.json({ error: 'Player requis', user_email: ownerEmail }, { status: 403 })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
  if (!book || !book.audio_path) {
    return NextResponse.json({ error: 'Livre introuvable' }, { status: 404 })
  }

  const denied = await assertAudioAccess(request, book.user_email)
  if (denied) return denied

  const manifestPath = join(book.audio_path, 'manifest.json')
  if (!existsSync(manifestPath)) {
    return NextResponse.json({ chapters: [], user_email: book.user_email })
  }
  const data = await readFile(manifestPath, 'utf-8')
  const parsed = JSON.parse(data)
  // On renvoie le user_email du proprietaire pour que le player determine le statut d'acces
  return NextResponse.json({ ...parsed, user_email: book.user_email })
}
