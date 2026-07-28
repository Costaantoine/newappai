const { createClient } = require('@supabase/supabase-js');

// Load from .env manually
const fs = require('fs');
const path = require('path');

function loadEnv(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv(path.join(__dirname, '..', '.env'));

const supabaseUrl = process.env.NEWAPPAI_SUPABASE_URL;
const supabaseServiceKey = process.env.NEWAPPAI_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  console.error('NEWAPPAI_SUPABASE_URL:', supabaseUrl ? 'found' : 'missing');
  console.error('NEWAPPAI_SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'found' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      en: 'Up to 3 cascading numbers. Direct call (tel:) and WhatsApp. Perfect for a storefront, windshield, or doorbell.',
      pt: 'Até 3 números em cascata. Chamada direta (tel:) e WhatsApp. Ideal para montra, pára-brisas ou campainha.',
      es: 'Hasta 3 números en cascada. Llamada directa (tel:) y WhatsApp. Ideal para escaparate, parabrisas o timbre.'
    }),
    price: 499,
    images: '[]',
    category: 'qrcall',
    active: true
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
    images: '[]',
    category: 'qrcall',
    active: true
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
    images: '[]',
    category: 'qrcall',
    active: true
  }
];

async function main() {
  console.log('Adding QRcall products via Supabase admin...');
  console.log('Supabase URL:', supabaseUrl);
  
  for (const product of products) {
    // Try lowercase table name (Supabase convention)
    const { data, error } = await supabase
      .from('Product')
      .insert(product)
      .select();

    if (error) {
      console.error(`  ❌ Error for ${JSON.parse(product.title).fr}: ${error.message}`);
    } else {
      console.log(`  ✅ Created: ${JSON.parse(product.title).fr} — ${(product.price / 100).toFixed(2)}€ (id: ${data?.[0]?.id})`);
    }
  }
  
  console.log('Done!');
}

main().catch(console.error);
