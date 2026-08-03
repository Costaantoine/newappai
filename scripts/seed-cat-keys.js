// Seed des clés de texte manquantes : cat_* (catégories produits) + contact_response_time
// Idempotent : relançable sans doublons. Utilise Prisma Client.
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TEXTS = [
  { key: 'cat_industrie', fr: 'Industrie', en: 'Industry', pt: 'Indústria', es: 'Industria' },
  { key: 'cat_comptabilite', fr: 'Comptabilité', en: 'Accounting', pt: 'Contabilidade', es: 'Contabilidad' },
  { key: 'cat_outils_services', fr: 'Outils et services', en: 'Tools & Services', pt: 'Ferramentas e Serviços', es: 'Herramientas y Servicios' },
  { key: 'cat_commerce', fr: 'Commerce', en: 'Commerce', pt: 'Comércio', es: 'Comercio' },
  { key: 'cat_droit', fr: 'Droit', en: 'Legal', pt: 'Direito', es: 'Derecho' },
  { key: 'cat_webdesign', fr: 'Web design', en: 'Web Design', pt: 'Web Design', es: 'Diseño Web' },
  { key: 'cat_a_tester', fr: 'À tester', en: 'To test', pt: 'Para testar', es: 'Para probar' },
  { key: 'contact_response_time', fr: 'Nous répondons sous 24h', en: 'We respond within 24h', pt: 'Respondemos em 24h', es: 'Respondemos en 24h' },
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
  console.log(`Seed OK : ${created} créées, ${updated} mises à jour, ${total} présentes en DB (8 attendues)`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
