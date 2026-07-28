const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env manually with proper handling
const content = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
const env = {};
for (const line of content.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

// Use production Supabase URL from .env
const supabaseUrl = env.NEWAPPAI_SUPABASE_URL || 'https://supabaseolharosol.newappai.com';
const supabaseKey = env.NEWAPPAI_SUPABASE_SERVICE_KEY;
const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://newappai.com';

console.log('Supabase URL:', supabaseUrl);
console.log('Service key loaded:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'MISSING');

async function main() {
  // First test the connection
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // List all tables in public schema  
  const { data: tables, error: tablesError } = await supabase
    .from('pg_catalog.pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
    
  if (tablesError) {
    console.log('Tables query error:', tablesError.message);
    // Try to query Product table directly
    const { data: existingProducts, error: existingError } = await supabase
      .from('Product')
      .select('id, title, price, category')
      .limit(5);
    
    if (existingError) {
      console.log('Product query error:', existingError.message);
      
      // Try lowercase
      const { data: existingProducts2, error: existingError2 } = await supabase
        .from('product')
        .select('id, title, price, category')
        .limit(5);
      
      if (existingError2) {
        console.log('product query error:', existingError2.message);
      } else {
        console.log('Products found (lowercase):', existingProducts2?.length || 0);
      }
    } else {
      console.log('Products found:', existingProducts?.length || 0);
      existingProducts?.forEach(p => {
        try {
          const t = JSON.parse(typeof p.title === 'string' ? p.title : '{}');
          console.log(`  - ${t?.fr || p.title} — ${(p.price/100).toFixed(2)}€`);
        } catch(e) {
          console.log(`  - ${p.title} — ${(p.price/100).toFixed(2)}€`);
        }
      });
    }
  } else {
    console.log('Tables:', tables?.map(t => t.tablename).join(', '));
  }
}

main().catch(console.error);
