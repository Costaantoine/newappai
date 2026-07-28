// Simple CommonJS script to dump translations
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.text.findMany({ orderBy: { key: 'asc' } })
  .then(r => {
    for (const t of r) {
      console.log(JSON.stringify({
        key: t.key,
        fr: t.fr?.substring(0, 50) || '',
        en: t.en?.substring(0, 50) || '(MISSING)',
        pt: t.pt?.substring(0, 50) || '(MISSING)',
        es: t.es?.substring(0, 50) || '(MISSING)',
        section: t.section
      }));
    }
    console.log(`\nTotal: ${r.length} texts`);
  })
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); })
  .finally(() => p.$disconnect());
