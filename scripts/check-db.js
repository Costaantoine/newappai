const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env manually
const content = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
let dbUrl = '';
for (const line of content.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    dbUrl = trimmed.slice('DATABASE_URL='.length);
    break;
  }
}

if (!dbUrl) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

console.log('Connecting to DB...');

const client = new Client({ connectionString: dbUrl });

async function main() {
  await client.connect();
  
  // Check tables
  const { rows: tables } = await client.query(`
    SELECT table_name, table_schema 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('Tables:', tables.map(t => `${t.table_schema}.${t.table_name}`).join(', '));
  
  // Check Product table
  const { rows: products } = await client.query(`SELECT id, title, price, category FROM "Product" ORDER BY created_at DESC LIMIT 10;`);
  console.log('\nExisting products:', products.length);
  products.forEach(p => {
    const title = typeof p.title === 'string' ? JSON.parse(p.title) : p.title;
    console.log(`  - ${p.id.slice(0,8)}... ${title?.fr || p.title} — ${(p.price/100).toFixed(2)}€ [${p.category}]`);
  });

  await client.end();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
