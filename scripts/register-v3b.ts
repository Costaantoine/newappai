import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
async function main() {
  await p.audioBook.deleteMany({ where: { audio_path: '/root/easyreadvoice-audio/guillaume-v3' } })
  const book = await p.audioBook.create({
    data: {
      title: 'Guillaume Musso - Le crime du paradis (v3 multi-voix)',
      user_email: 'antonioaluwindow@gmail.com',
      status: 'ready',
      chapters: 32,
      chapters_done: 32,
      progress_pct: 100,
      duration_sec: 29066,
      audio_path: '/root/easyreadvoice-audio/guillaume-v3',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    }
  })
  console.log('CREE:', book.id)
  await p.$disconnect()
}
main().catch(console.error)
