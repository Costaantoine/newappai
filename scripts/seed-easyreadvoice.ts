import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// UUIDs fixes correspondant au mapping dans app/checkout/page.tsx
const PRODUCTS: { id: string; title: string; description: string; price: number }[] = [
  {
    id: '33c9d282-7154-4ae6-ae2e-87e8d7d02bd3',
    title: 'EasyReadVoice - Texte vers Audio (Essentiel)',
    description: "Jusqu'a 25 000 caracteres. Voix feminine + 1 voix secondaire.",
    price: 499,
  },
  {
    id: 'cd0ab50d-d479-4671-a723-841e7068a791',
    title: 'EasyReadVoice - Texte vers Audio (Standard)',
    description: "Jusqu'a 100 000 caracteres. Multi-voix completes (4-8 voix).",
    price: 999,
  },
  {
    id: 'd4f985d2-803b-4c28-93f7-79a8cf1ec5c0',
    title: 'EasyReadVoice - Texte vers Audio (Integral)',
    description: "Jusqu'a 500 000 caracteres. Multi-voix completes (8 voix max).",
    price: 1999,
  },
]

async function main() {
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { id: p.id } })
    if (existing) {
      console.log(`= deja present: ${p.title} (id: ${p.id})`)
      continue
    }
    const created = await prisma.product.create({
      data: { id: p.id, title: p.title, description: p.description, price: p.price, category: 'outils-services', images: '[]', active: true },
    })
    console.log(`+ cree: ${p.title} -- ${(p.price/100).toFixed(2)} EUR (id: ${created.id})`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
