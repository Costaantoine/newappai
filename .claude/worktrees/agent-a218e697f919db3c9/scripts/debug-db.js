const { createClient } = require('@supabase/supabase-js');

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
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(__dirname, '..', '.env'));

const supabase = createClient(
  process.env.NEWAPPAI_SUPABASE_URL,
  process.env.NEWAPPAI_SUPABASE_SERVICE_KEY
);

async function main() {
  // Try different table names
  const tables = ['Product', 'product', 'products', 'public.Product', 'public.product'];
  
  for (const table of tables) {
    console.log(`Trying table: "${table}"`);
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`  -> Error: ${error.message}`);
    } else {
      console.log(`  -> OK! Found:`, JSON.stringify(data));
    }
  }
}

main().catch(console.error);
