// Cree les produits EasyReadVoice manquants (essentiel/standard/integral).
// Le plan "decouverte" existe deja (id 1020f90c-7355-4353-8e45-907777cdeffd).
// Usage: npx tsx scripts/add-easyreadvoice-products.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PRODUCTS = [
  {
    title: 'EasyReadVoice - Texte vers Audio (Essentiel)',
    description: "Jusqu'a 25 000 caracteres. Voix feminine + 1 voix secondaire.",
    price: 499,
    category: 'outils-services',
  },
  {
    title: 'EasyReadVoice - Texte vers Audio (Standard)',
    description: "Jusqu'a 100 000 caracteres. Multi-voix completes (4-8 voix).",
    price: 999,
    category: 'outils-services',
  },
  {
    title: 'EasyReadVoice - Texte vers Audio (Integral)',
    description: "Jusqu'a 500 000 caracteres. Multi-voix completes (8 voix max).",
    price: 1999,
    category: 'outils-services',
  },
]

async function main() {
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { category: p.category, price: p.price, title: p.title },
    })
    if (existing) {
      console.log(`= deja present: ${p.title} (id: ${existing.id})`)
      continue
    }
    const created = await prisma.product.create({
      data: { ...p, images: '[]', status: 'visible' },
    })
    console.log(`+ cree: ${p.title} — ${(p.price / 100).toFixed(2)}€ (id: ${created.id})`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
