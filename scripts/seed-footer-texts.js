// Seed des textes footer (logo, tagline, copyright) — migration vers la table Text
// Idempotent : relançable sans doublons. Utilise Prisma Client.
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TEXTS = [
  {
    key: 'footer_logo_text',
    fr: 'Newappai by Premiumajusteprix',
    en: 'Newappai by Premiumajusteprix',
    pt: 'Newappai by Premiumajusteprix',
    es: 'Newappai by Premiumajusteprix',
  },
  {
    key: 'footer_tagline',
    fr: 'Solutions intelligentes pour simplifier votre quotidien.',
    en: 'Smart solutions to simplify your daily life.',
    pt: 'Soluções inteligentes para simplificar o seu dia a dia.',
    es: 'Soluciones inteligentes para simplificar su día a día.',
  },
  {
    key: 'footer_copyright',
    fr: '© 2025 NewAppAI.com — Édité par Premium à Juste Prix SAS',
    en: '© 2025 NewAppAI.com — Published by Premium à Juste Prix SAS',
    pt: '© 2025 NewAppAI.com — Editado por Premium à Juste Prix SAS',
    es: '© 2025 NewAppAI.com — Editado por Premium à Juste Prix SAS',
  },
]

async function main() {
  let created = 0
  let updated = 0
  for (const t of TEXTS) {
    const existing = await prisma.text.findFirst({ where: { key: t.key } })
    if (existing) {
      await prisma.text.update({
        where: { id: existing.id },
        data: { fr: t.fr, en: t.en, pt: t.pt, es: t.es },
      })
      updated++
    } else {
      await prisma.text.create({ data: t })
      created++
    }
  }
  const total = await prisma.text.count({ where: { key: { in: TEXTS.map(t => t.key) } } })
  console.log(`Seed OK : ${created} créées, ${updated} mises à jour, ${total} présentes en DB (3 attendues)`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
