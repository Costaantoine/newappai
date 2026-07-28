# codex.md — newappai

## Overview

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Setup

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run start
```

## Project Structure

- **Architecture:** monolith
- **Entry points:** `lib/supabase/server.ts`

**Modules:**
- `__tests__` (4 files)
- `app` (77 files)
- `components` (29 files)
- `evidence` (58 files)
- `lib` (39 files)
- `prisma` (3 files)
- `public` (47 files)
- `reports` (118 files)
- `scripts` (11 files)
- `supabase` (2 files)
- `types` (3 files)

## Conventions

- **Naming:** mixed
- **File Organization:** feature-based
- **Import Style:** absolute
- **Test Pattern:** `*.test.ts`
- **Patterns:** command, helper, middleware, provider, repository, router, service

**Examples from codebase:**
- Functions: `metadata`, `dynamic`, `stopAllAdminPlayers`, `cn`, `formatPrice`
- Classes: `HomePage`, `RootLayout`, `MarketplacePage`, `PrivacyPage`, `EasyReadVoicePage`

## Dependencies

@prisma/client (5.22.0), @supabase/ssr (^0.12.0), @supabase/supabase-js (^2.78.0), clsx (^2.1.1), iron-session (^8.0.4), next (^14.2.35), nodemailer (^8.0.2), openai (^6.45.0), prisma (5.22.0), react (^18.3.1), react-dom (^18.3.1), sharp (^0.33.5), stripe (^20.3.1), tailwind-merge (^3.6.0), zod (^4.3.6)

_...and 9 more._
