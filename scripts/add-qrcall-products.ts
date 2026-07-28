import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    title: JSON.stringify({
      fr: 'QRcall — 1 QR Code',
      en: 'QRcall — 1 QR Code',
      pt: 'QRcall — 1 Código QR',
      es: 'QRcall — 1 Código QR'
    }),
    description: JSON.stringify({
      fr: '1 QR code. Jusqu\'à 3 numéros en cascade. Appel direct (tel:) et WhatsApp. Idéal pour une vitrine, un pare-brise ou une sonnette.',
      en: '1 QR code. Up to 3 cascading numbers. Direct call (tel:) and WhatsApp. Perfect for a storefront, windshield, or doorbell.',
      pt: '1 código QR. Até 3 números em cascata. Chamada direta (tel:) e WhatsApp. Ideal para montra, pára-brisas ou campainha.',
      es: '1 código QR. Hasta 3 números en cascada. Llamada directa (tel:) y WhatsApp. Ideal para escaparate, parabrisas o timbre.'
    }),
    price: 499,
    images: JSON.stringify([]),
    category: 'qrcall',
    active: true,
  },
  {
    title: JSON.stringify({
      fr: 'QRcall — 5 QR Codes',
      en: 'QRcall — 5 QR Codes',
      pt: 'QRcall — 5 Códigos QR',
      es: 'QRcall — 5 Códigos QR'
    }),
    description: JSON.stringify({
      fr: '5 QR codes. Jusqu\'à 3 numéros en cascade chacun. Pour couvrir plusieurs emplacements ou véhicules.',
      en: '5 QR codes. Up to 3 cascading numbers each. Cover multiple locations or vehicles.',
      pt: '5 códigos QR. Até 3 números em cascata cada. Para cobrir vários locais ou veículos.',
      es: '5 códigos QR. Hasta 3 números en cascada cada uno. Para cubrir varios lugares o vehículos.'
    }),
    price: 1299,
    images: JSON.stringify([]),
    category: 'qrcall',
    active: true,
  },
  {
    title: JSON.stringify({
      fr: 'QRcall — 10 QR Codes',
      en: 'QRcall — 10 QR Codes',
      pt: 'QRcall — 10 Códigos QR',
      es: 'QRcall — 10 Códigos QR'
    }),
    description: JSON.stringify({
      fr: '10 QR codes. Jusqu\'à 3 numéros en cascade chacun. Le pack complet pour les pros et les flottes.',
      en: '10 QR codes. Up to 3 cascading numbers each. The complete pack for pros and fleets.',
      pt: '10 códigos QR. Até 3 números em cascata cada. O pacote completo para profissionais e frotas.',
      es: '10 códigos QR. Hasta 3 números en cascada cada uno. El paquete completo para profesionales y flotas.'
    }),
    price: 1999,
    images: JSON.stringify([]),
    category: 'qrcall',
    active: true,
  },
  {
    title: JSON.stringify({
      fr: 'QRcall Immeuble — Abonnement',
      en: 'QRcall Building — Subscription',
      pt: 'QRcall Edifício — Assinatura',
      es: 'QRcall Edificio — Suscripción'
    }),
    description: JSON.stringify({
      fr: 'QR code unique pour tout l\'immeuble. Visiteur scanne → choisit le résident → appel direct. Abonnement de base + 4.99€/mois par appartement. Inclut notification d\'appel et option ouverture de porte.',
      en: 'Single QR code for the whole building. Visitor scans → picks resident → direct call. Base subscription + 4.99€/month per apartment. Includes call notification and door opening option.',
      pt: 'Código QR único para todo o edifício. Visitante digitaliza → escolhe residente → chamada direta. Assinatura base + 4.99€/mês por apartamento. Inclui notificação de chamada e opção de abertura de porta.',
      es: 'Código QR único para todo el edificio. Visitante escanea → elige residente → llamada directa. Suscripción base + 4.99€/mes por apartamento. Incluye notificación de llamada y opción de apertura de puerta.'
    }),
    price: 0, // Prix de base à définir, l'abonnement est géré séparément
    images: JSON.stringify([]),
    category: 'qrcall-building',
    active: true,
  },
];

async function main() {
  console.log('Adding QRcall products...');
  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { category: product.category as any, title: product.title as any }
    });
    if (!existing) {
      const created = await prisma.product.create({ data: product as any });
      console.log(`  ✅ Created: ${JSON.parse(product.title).fr} — ${(product.price / 100).toFixed(2)}€ (${created.id})`);
    } else {
      console.log(`  ⏩ Already exists: ${JSON.parse(product.title).fr}`);
    }
  }
  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
