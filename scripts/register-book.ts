import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const existing = await p.audioBook.findFirst({ where: { audio_path: '/root/easyreadvoice-audio/guillaume-v2' } })
  if (existing) {
    console.log('EXISTE:', existing.id)
  } else {
    const book = await p.audioBook.create({
      data: {
        title: 'Guillaume Musso - Le crime du paradis (v2 multi-voix)',
        user_email: 'antonioaluwindow@gmail.com',
        status: 'ready',
        chapters: 36,
        chapters_done: 36,
        progress_pct: 100,
        duration_sec: 30215,
        audio_path: '/root/easyreadvoice-audio/guillaume-v2',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })
    console.log('CREE:', book.id)
  }
  await p.$disconnect()
}
main().catch(console.error)
