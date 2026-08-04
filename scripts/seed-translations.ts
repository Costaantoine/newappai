// Script Prisma pour ajouter les traductions manquantes EN/PT/ES
// Usage: npx tsx scripts/seed-translations.ts

import { prisma } from '../lib/prisma'

interface TextEntry {
  key: string
  fr: string
  en: string
  pt: string
  es: string
  section: string
}

const translations: TextEntry[] = [
  // Expertise / Home
  { key: 'expertise_title', fr: 'Notre savoir faire', en: 'Our Areas of Expertise', pt: 'Nossos Pólos de Especialização', es: 'Nuestros Polos de Especialización', section: 'home' },
  { key: 'products_title', fr: 'Nos Produits', en: 'Our Products', pt: 'Nossos Produtos', es: 'Nuestros Productos', section: 'home' },

  // Zones
  { key: 'commerce_title', fr: 'Pôle Commerce', en: 'Commerce Hub', pt: 'Pólo Comércio', es: 'Polo Comercio', section: 'zones' },
  { key: 'commerce_subtitle', fr: 'DigiSmart Solutions', en: 'DigiSmart Solutions', pt: 'DigiSmart Solutions', es: 'DigiSmart Solutions', section: 'zones' },
  { key: 'commerce_desc', fr: "Optimisez l'expérience client et digitalisez vos ventes avec nos solutions connectées.", en: 'Optimize customer experience and digitize your sales with our connected solutions.', pt: 'Otimize a experiência do cliente e digitalize suas vendas com nossas soluções conectadas.', es: 'Optimice la experiencia del cliente y digitalice sus ventas con nuestras soluciones conectadas.', section: 'zones' },
  { key: 'commerce_cta', fr: 'Voir les 6 modules', en: 'View all 6 modules', pt: 'Ver os 6 módulos', es: 'Ver los 6 módulos', section: 'zones' },

  { key: 'industrie_title', fr: 'Pôle Industrie', en: 'Industry Hub', pt: 'Pólo Indústria', es: 'Polo Industria', section: 'zones' },
  { key: 'industrie_subtitle', fr: 'Smart Factory', en: 'Smart Factory', pt: 'Smart Factory', es: 'Smart Factory', section: 'zones' },
  { key: 'industrie_desc', fr: "Connectez votre atelier et pilotez votre production en temps réel.", en: 'Connect your workshop and manage your production in real-time.', pt: 'Conecte sua oficina e pilote sua produção em tempo real.', es: 'Conecte su taller y gestione su producción en tiempo real.', section: 'zones' },
  { key: 'industrie_cta', fr: "Découvrir l'offre", en: 'Discover the offer', pt: 'Descobrir a oferta', es: 'Descubrir la oferta', section: 'zones' },

  { key: 'comptabilite_title', fr: 'Pôle Comptabilité', en: 'Accounting Hub', pt: 'Pólo Contabilidade', es: 'Polo Contabilidad', section: 'zones' },
  { key: 'comptabilite_subtitle', fr: 'Gestion Financière', en: 'Financial Management', pt: 'Gestão Financeira', es: 'Gestión Financiera', section: 'zones' },
  { key: 'comptabilite_desc', fr: 'Automatisez votre comptabilité et suivez vos finances en temps réel.', en: 'Automate your accounting and track your finances in real-time.', pt: 'Automatize sua contabilidade e acompanhe suas finanças em tempo real.', es: 'Automatice su contabilidad y controle sus finanzas en tiempo real.', section: 'zones' },
  { key: 'comptabilite_cta', fr: 'Découvrir', en: 'Discover', pt: 'Descobrir', es: 'Descubrir', section: 'zones' },

  { key: 'droit_title', fr: 'Pôle Droit', en: 'Legal Hub', pt: 'Pólo Direito', es: 'Polo Derecho', section: 'zones' },
  { key: 'droit_subtitle', fr: 'Solutions Juridiques', en: 'Legal Solutions', pt: 'Soluções Jurídicas', es: 'Soluciones Jurídicas', section: 'zones' },
  { key: 'droit_desc', fr: "Simplifiez la gestion juridique de votre entreprise avec nos outils numériques.", en: "Simplify your company's legal management with our digital tools.", pt: 'Simplifique a gestão jurídica da sua empresa com nossas ferramentas digitais.', es: 'Simplifique la gestión jurídica de su empresa con nuestras herramientas digitales.', section: 'zones' },
  { key: 'droit_cta', fr: 'Découvrir', en: 'Discover', pt: 'Descobrir', es: 'Descubrir', section: 'zones' },

  { key: 'webdesign_title', fr: 'Pôle Web Design', en: 'Web Design Hub', pt: 'Pólo Web Design', es: 'Polo Web Design', section: 'zones' },
  { key: 'webdesign_subtitle', fr: 'Création Digitale', en: 'Digital Creation', pt: 'Criação Digital', es: 'Creación Digital', section: 'zones' },
  { key: 'webdesign_desc', fr: 'Donnez vie à votre marque avec des designs modernes et percutants.', en: 'Bring your brand to life with modern and impactful designs.', pt: 'Dê vida à sua marca com designs modernos e impactantes.', es: 'Dé vida a su marca con diseños modernos e impactantes.', section: 'zones' },
  { key: 'webdesign_cta', fr: 'Voir nos créations', en: 'View our creations', pt: 'Ver nossas criações', es: 'Ver nuestras creaciones', section: 'zones' },

  { key: 'outils-services_title', fr: 'Outils & Services', en: 'Tools & Services', pt: 'Ferramentas & Serviços', es: 'Herramientas & Servicios', section: 'zones' },
  { key: 'outils-services_subtitle', fr: 'Boîte à Outils', en: 'Toolbox', pt: 'Caixa de Ferramentas', es: 'Caja de Herramientas', section: 'zones' },
  { key: 'outils-services_desc', fr: 'Découvrez nos outils complémentaires pour booster votre productivité.', en: 'Discover our complementary tools to boost your productivity.', pt: 'Descubra nossas ferramentas complementares para aumentar sua produtividade.', es: 'Descubra nuestras herramientas complementarias para aumentar su productividad.', section: 'zones' },
  { key: 'outils-services_cta', fr: 'Explorer', en: 'Explore', pt: 'Explorar', es: 'Explorar', section: 'zones' },

  { key: 'a-tester_title', fr: 'Tester les nouveautés', en: 'Try the latest', pt: 'Testar as novidades', es: 'Probar las novedades', section: 'zones' },
  { key: 'a-tester_subtitle', fr: 'Nouveautés en phase de test', en: 'New features in beta', pt: 'Novidades em fase de teste', es: 'Novedades en fase de prueba', section: 'zones' },
  { key: 'a-tester_desc', fr: "Testez nos fonctionnalités en avant-première et participez à leur amélioration.", en: 'Test our features early and help us improve them.', pt: 'Teste nossos recursos em primeira mão e participe de sua melhoria.', es: 'Pruebe nuestras funciones en primicia y participe en su mejora.', section: 'zones' },
  { key: 'a-tester_cta', fr: 'Tester maintenant', en: 'Try now', pt: 'Testar agora', es: 'Probar ahora', section: 'zones' },

  // Solutions & Contact
  { key: 'solutions_title', fr: "Des outils intelligents pour chaque étape de votre activité.", en: 'Smart tools for every stage of your business.', pt: 'Ferramentas inteligentes para cada etapa da sua atividade.', es: 'Herramientas inteligentes para cada etapa de su actividad.', section: 'solutions' },
  { key: 'solutions_subtitle', fr: "Choisissez l'innovation qui s'adapte à votre métier.", en: 'Choose the innovation that fits your business.', pt: 'Escolha a inovação que se adapta ao seu negócio.', es: 'Elija la innovación que se adapta a su negocio.', section: 'solutions' },
  { key: 'contact_title', fr: "Contactez l'avenir", en: 'Contact the Future', pt: 'Contate o Futuro', es: 'Contacte el Futuro', section: 'contact' },
  { key: 'contact_subtitle', fr: "Vous avez un projet innovant ? Notre équipe (et notre IA) est à votre écoute.", en: 'Have an innovative project? Our team (and our AI) is listening.', pt: 'Tem um projeto inovador? Nossa equipe (e nossa IA) está ouvindo.', es: '¿Tiene un proyecto innovador? Nuestro equipo (y nuestra IA) está escuchando.', section: 'contact' },
]

async function main() {
  console.log(`Ajout de ${translations.length} traductions...`)

  let created = 0, updated = 0

  for (const t of translations) {
    const existing = await prisma.text.findFirst({ where: { key: t.key } })

    if (existing) {
      // Mettre à jour les traductions manquantes uniquement
      const updateData: any = {}
      if (!existing.en && t.en) updateData.en = t.en
      if (!existing.pt && t.pt) updateData.pt = t.pt
      if (!existing.es && t.es) updateData.es = t.es

      if (Object.keys(updateData).length > 0) {
        await prisma.text.update({
          where: { id: existing.id },
          data: updateData,
        })
        updated++
        console.log(`  ✓ Mis à jour: ${t.key} → ${Object.keys(updateData).join(', ')}`)
      } else {
        console.log(`  - Déjà complet: ${t.key}`)
      }
    } else {
      // Créer le texte avec toutes les langues
      await prisma.text.create({
        data: {
          key: t.key,
          fr: t.fr,
          en: t.en,
          pt: t.pt,
          es: t.es,
          section: t.section,
        },
      })
      created++
      console.log(`  ✓ Créé: ${t.key}`)
    }
  }

  console.log(`\nTerminé ! ${created} créés, ${updated} mis à jour.`)
}

main()
  .catch((e) => {
    console.error('Erreur:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
