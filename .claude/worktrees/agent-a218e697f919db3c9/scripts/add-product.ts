// Script pour ajouter un produit dans la base NewAppAI
// Usage: npx tsx scripts/add-product.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Le titre et la description sont stockés en JSON multilingue
  const title = JSON.stringify({
    fr: 'Application de Gestion de Production',
    en: 'Production Management Application',
    pt: 'Aplicação de Gestão de Produção',
    es: 'Aplicación de Gestión de Producción',
  })

  const description = JSON.stringify({
    fr: 'Optimisez vos temps de préparation et pilotez votre production en temps réel. Visualisez l\'intégralité de votre flux de travail, identifiez les goulots d\'étranglement et boostez votre productivité grâce à des indicateurs clairs et actionnables.',
    en: 'Optimize your preparation times and manage your production in real time. Visualize your entire workflow, identify bottlenecks and boost your productivity with clear, actionable KPIs.',
    pt: 'Otimize os seus tempos de preparação e controle a sua produção em tempo real. Visualize todo o seu fluxo de trabalho, identifique gargalos e aumente a sua produtividade com indicadores claros e acionáveis.',
    es: 'Optimice sus tiempos de preparación y gestione su producción en tiempo real. Visualice todo su flujo de trabajo, identifique cuellos de botella y aumente su productividad con indicadores claros y procesables.',
  })

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: 99900, // 999€ en centimes
      images: '[]',
      category: 'production',
      active: true,
    },
  })

  console.log('✅ Produit créé avec succès !')
  console.log(JSON.stringify(product, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
