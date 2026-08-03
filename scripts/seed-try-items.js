// Seed des 9 éléments "Tester les nouveautés" — table TryItem + textes try_*_title
// Idempotent : relançable sans créer de doublons.
// Utilise Prisma Client (déjà installé) — lancer `npx prisma generate` avant si le modèle TryItem est nouveau.
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const TITLES = [
  { key: 'try_erv_title', value: 'EasyReadVoice' },
  { key: 'try_qrcall_title', value: 'QRcall' },
  { key: 'try_chatbot_title', value: 'Chatbot' },
  { key: 'try_click_title', value: 'Click & Delivery' },
  { key: 'try_prod_title', value: 'Production' },
  { key: 'try_paperasse_title', value: 'Paperasse' },
  { key: 'try_site_title', value: 'Site Vitrine' },
  { key: 'try_talkie_title', value: 'Talkie Walkie' },
  { key: 'try_serenite_title', value: 'Sérénité' },
]

const ITEMS = [
  { title_key: 'try_erv_title', description_key: 'home_app_erv_desc', color: 'rose', url: '/test/easyreadvoice', icon_key: 'erv', order: 1 },
  { title_key: 'try_qrcall_title', description_key: 'home_app_qrcall_desc', color: 'emerald', url: '/test/qrcall', icon_key: 'qrcall', order: 2 },
  { title_key: 'try_chatbot_title', description_key: 'home_app_chatbot_desc', color: 'violet', url: '/test', icon_key: 'chatbot', order: 3 },
  { title_key: 'try_click_title', description_key: 'home_app_click_desc', color: 'blue', url: '/test', icon_key: 'click', order: 4 },
  { title_key: 'try_prod_title', description_key: 'home_app_prod_desc', color: 'amber', url: '/test', icon_key: 'prod', order: 5 },
  { title_key: 'try_paperasse_title', description_key: 'home_app_paperasse_desc', color: 'slate', url: '/test', icon_key: 'paperasse', order: 6 },
  { title_key: 'try_site_title', description_key: 'home_app_site_desc', color: 'cyan', url: '/test', icon_key: 'site', order: 7 },
  { title_key: 'try_talkie_title', description_key: 'home_app_talkie_desc', color: 'yellow', url: '/test', icon_key: 'talkie', order: 8 },
  { title_key: 'try_serenite_title', description_key: 'home_app_serenite_desc', color: 'teal', url: '/test', icon_key: 'serenite', order: 9 },
]

async function main() {
  let created = 0
  let updated = 0

  for (const t of TITLES) {
    const existing = await prisma.text.findFirst({ where: { key: t.key } })
    if (existing) {
      await prisma.text.update({
        where: { id: existing.id },
        data: { fr: t.value, en: t.value, pt: t.value, es: t.value },
      })
      updated++
    } else {
      await prisma.text.create({ data: { key: t.key, fr: t.value, en: t.value, pt: t.value, es: t.value } })
      created++
    }
  }

  let itemsCreated = 0
  let itemsUpdated = 0
  for (const it of ITEMS) {
    const existing = await prisma.tryItem.findFirst({ where: { title_key: it.title_key } })
    if (existing) {
      await prisma.tryItem.update({
        where: { id: existing.id },
        data: { description_key: it.description_key, color: it.color, url: it.url, icon_key: it.icon_key, order: it.order, active: true },
      })
      itemsUpdated++
    } else {
      await prisma.tryItem.create({
        data: { title_key: it.title_key, description_key: it.description_key, color: it.color, url: it.url, icon_key: it.icon_key, order: it.order, active: true },
      })
      itemsCreated++
    }
  }

  const total = await prisma.tryItem.count()
  console.log(`Textes : ${created} créés, ${updated} mis à jour`)
  console.log(`TryItems : ${itemsCreated} créés, ${itemsUpdated} mis à jour — total en base : ${total}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
