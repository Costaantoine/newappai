// Script to check existing texts in database and add missing translations
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function main() {
  // Check if Text table exists
  const tables = await p.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('Tables:', tables.map(t => t.table_name));

  // Try to query texts
  const texts = await p.text.findMany({ orderBy: { key: 'asc' } });
  console.log(`\nFound ${texts.length} texts:`);

  const missingTranslations = { en: 0, pt: 0, es: 0 };

  for (const t of texts) {
    const hasEn = t.en && t.en.trim() !== '';
    const hasPt = t.pt && t.pt.trim() !== '';
    const hasEs = t.es && t.es.trim() !== '';

    if (!hasEn) missingTranslations.en++;
    if (!hasPt) missingTranslations.pt++;
    if (!hasEs) missingTranslations.es++;

    console.log(`  ${t.key}: fr="${t.fr?.substring(0,40)}" en="${t.en?.substring(0,40)||'MISSING'}" pt="${t.pt?.substring(0,40)||'MISSING'}" es="${t.es?.substring(0,40)||'MISSING'}"`);
  }

  console.log(`\nMissing translations:`, missingTranslations);
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => p.$disconnect());
