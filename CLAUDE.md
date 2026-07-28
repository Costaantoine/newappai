# CLAUDE.md — newappai

## What Is This Project?

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Quick Reference

- **Entry point**: `lib/supabase/server.ts`
- **Entry point**: `.claude/worktrees/agent-a218e697f919db3c9/lib/supabase/server.ts`
- **Languages**: typescript, javascript, python, shell
- **Architecture**: monolith
- **Modules**: 11
- **Dependencies**: 25
- **Last scanned**: 2026-07-23 08:48:54.665778+00:00

## Architecture

**Type:** monolith

**Entry Points:**
- `lib/supabase/server.ts`
- `.claude/worktrees/agent-a218e697f919db3c9/lib/supabase/server.ts`

**Infrastructure:** Frontend, Database, Docker

## Build & Run

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run start
```

## Conventions

- **Naming:** mixed
- **File Organization:** feature-based
- **Import Style:** absolute
- **Test Pattern:** `*.test.ts`
- **Patterns:** command, helper, middleware, provider, repository, router, service

**Examples from codebase:**
- Functions: `sitemap`, `cn`, `formatPrice`, `formatDate`, `slugify`
- Classes: `HomePageFR`, `RootLayout`, `BackToTop`, `MatrixRain`, `ChatInterface`

## Modules

### __tests__
- **Path:** `__tests__`
- **Language:** typescript
- **Files:** 4

**Key Files:**
- `__tests__/validators.test.ts` — tests
- `__tests__/dbHelpers.test.ts` — utilities
- `__tests__/auth.test.ts` — authentication
- `__tests__/rateLimit.test.ts` — tests

### app
- **Path:** `app`
- **Language:** typescript
- **Files:** 127

**Key Files:**
- `app/page.tsx` — UI components
  Exports: `HomePageFR`
- `app/sitemap.ts` — API routes
  Exports: `sitemap`
- `app/layout.tsx` — configuration
  Exports: `RootLayout`

### components
- **Path:** `components`
- **Language:** typescript
- **Files:** 36

**Key Files:**
- `components/BackToTop.tsx` — UI components
  Exports: `BackToTop`
- `components/MatrixRain.tsx` — tests
  Exports: `MatrixRain`
- `components/ChatInterface.tsx` — type definitions
  Exports: `ChatInterface`
- `components/ParticlesBackground.tsx` — UI components
  Exports: `ParticlesBackground`
- `components/Providers.tsx`
  Exports: `Providers`
- `components/CartWidget.tsx` — UI components
  Exports: `CartWidget`
- `components/TestimonialCarousel.tsx` — UI components
  Exports: `TestimonialCarousel`
- `components/AssistantWidget.tsx` — UI components
  Exports: `AssistantWidget`
- `components/AnimatedTitle.tsx` — type definitions
  Exports: `AnimatedTitle`
- `components/EvaAssistant.tsx` — UI components
  Exports: `EvaAssistant`

### evidence
- **Path:** `evidence`
- **Files:** 58

**Key Files:**
- `evidence/stack.json`
- `evidence/routes.json`
- `evidence/audit_analysis.json`
- `evidence/ultime_report.json`
- `evidence/api_live/settings_get.json`

### lib
- **Path:** `lib`
- **Language:** typescript
- **Files:** 40

**Key Files:**
- `lib/errors.ts` — error handling
  Exports: `ApiError`, `AuthError`, `ValidationError`, `NotFoundError`, `StripeError`, `RateLimitError`
- `lib/logger.ts` — configuration
- `lib/utils.ts` — utilities
  Exports: `cn`, `formatPrice`, `formatDate`, `slugify`, `truncate`, `randomId`
- `lib/crypto.ts`
  Exports: `encryptFile`, `decryptFile`
- `lib/rateLimit.ts` — tests
  Exports: `checkRateLimit`, `getClientIp`
- `lib/soundEffects.ts` — configuration
  Exports: `initSoundEffects`, `destroySoundEffects`, `getSoundEffectSettings`
- `lib/musicManager.ts` — configuration
  Exports: `musicManager`
- `lib/prisma.ts` — database models
  Exports: `prisma`
- `lib/email.ts` — configuration
- `lib/session.ts` — authentication
  Exports: `sessionOptions`

### prisma
- **Path:** `prisma`
- **Files:** 3

**Key Files:**
- `prisma/schema.prisma`
- `prisma/dev.db`
- `prisma/schema.postgresql.prisma`

### public
- **Path:** `public`
- **Language:** javascript
- **Files:** 112

**Key Files:**
- `public/sw.js` — API routes

### reports
- **Path:** `reports`
- **Files:** 118

**Key Files:**
- `reports/qa/screenshots_success.png`
- `reports/qa/screenshots_.png`
- `reports/qa/qa_report.json`
- `reports/qa/screenshots_messages.png`
- `reports/qa/screenshots_solutions.png`

### scripts
- **Path:** `scripts`
- **Language:** javascript
- **Files:** 24

**Key Files:**
- `scripts/add-product.ts` — database models
- `scripts/seed-texts.js` — configuration
- `scripts/add-qrcall-products.js` — database models
- `scripts/register-book.ts` — error handling
- `scripts/add-qrcall-products.ts` — database models
- `scripts/check-translations.mjs` — database models
- `scripts/fix-buttons.mjs` — UI components
- `scripts/test-supabase.js` — database models
- `scripts/dump-texts.cjs` — error handling
- `scripts/seed-easyreadvoice.ts` — utilities

### supabase
- **Path:** `supabase`
- **Files:** 2

**Key Files:**
- `supabase/seed.sql`
- `supabase/migrations/001_initial_schema.sql`

### types
- **Path:** `types`
- **Language:** typescript
- **Files:** 3

**Key Files:**
- `types/supabase.ts` — database models
- `types/stripe.ts` — type definitions
- `types/ai.ts` — type definitions

## Key Files

- `lib/validators.ts` — configuration
  Exports: `formatZodError`, `CreateProductSchema`, `UpdateProductSchema`, `CreateTextSchema`, `UpdateTextSchema`, `CreateZoneSchema` (+8 more)
  Imports: `zod`
- `lib/errors.ts` — error handling
  Exports: `ApiError`, `AuthError`, `ValidationError`, `NotFoundError`, `StripeError`, `RateLimitError`
- `lib/utils.ts` — utilities
  Exports: `cn`, `formatPrice`, `formatDate`, `slugify`, `truncate`, `randomId`
  Imports: `clsx`, `tailwind-merge`
- `lib/soundEffects.ts` — configuration
  Exports: `initSoundEffects`, `destroySoundEffects`, `getSoundEffectSettings`
- `lib/dynamicTranslations.tsx` — UI components
  Exports: `DynamicLanguageProvider`, `useDynamicLanguage`, `getNestedValue`
  Imports: `react`
- `lib/dbHelpers.ts` — utilities
  Exports: `serializeImages`, `deserializeImages`, `normalizeProduct`
- `lib/api-response.ts` — API routes
  Exports: `successResponse`, `errorResponse`, `paginatedResponse`
  Imports: `next/server`
- `lib/crypto.ts`
  Exports: `encryptFile`, `decryptFile`
  Imports: `crypto`
- `lib/rateLimit.ts` — tests
  Exports: `checkRateLimit`, `getClientIp`
- `lib/supabase.ts` — database models
  Exports: `supabase`, `supabaseAdmin`
  Imports: `@supabase/supabase-js`
- `lib/cartContext.tsx` — UI components
  Exports: `CartProvider`, `useCart`
  Imports: `react`
- `lib/assistantContext.ts` — database models
  Exports: `buildSystemPrompt`, `detectContactIntent`
  Imports: `./prisma`
- `lib/stripe.ts` — error handling
  Exports: `formatPrice`, `stripe`
  Imports: `stripe`
- `lib/SupabaseAuthContext.tsx` — authentication
  Exports: `SupabaseAuthProvider`, `useAuth`
  Imports: `react`, `./supabase`
- `lib/rate-limit.ts` — tests
  Exports: `checkRateLimit`, `getClientIp`

## Dependencies

### Runtime Dependencies

| Package | Version | Ecosystem |
|---------|---------|-----------|
| @prisma/client | 5.22.0 | npm |
| @supabase/ssr | ^0.12.0 | npm |
| @supabase/supabase-js | ^2.78.0 | npm |
| clsx | ^2.1.1 | npm |
| iron-session | ^8.0.4 | npm |
| next | ^14.2.35 | npm |
| nodemailer | ^8.0.2 | npm |
| openai | ^6.45.0 | npm |
| prisma | 5.22.0 | npm |
| react | ^18.3.1 | npm |
| react-dom | ^18.3.1 | npm |
| sharp | ^0.33.5 | npm |
| stripe | ^20.3.1 | npm |
| tailwind-merge | ^3.6.0 | npm |
| zod | ^4.3.6 | npm |

### Development Dependencies

| Package | Version | Ecosystem |
|---------|---------|-----------|
| @types/node | ^25.2.3 | npm |
| @types/nodemailer | ^7.0.11 | npm |
| @types/react | ^19.2.14 | npm |
| @vitejs/plugin-react | ^4.7.0 | npm |
| @vitest/coverage-v8 | ^1.6.1 | npm |
| autoprefixer | ^10.4.24 | npm |
| eslint | ^10.7.0 | npm |
| tailwindcss | ^3.4.1 | npm |
| typescript | ^5.9.3 | npm |
| vitest | ^1.6.1 | npm |

## Git Insights

- **Branch:** `master`
- **Total commits:** 90
- **Contributors:** NewAppAI Deploy, Alice Costa, NewAppAI Admin

**Most Changed Files (Hotspots):**
- `CLAUDE.md`
- `.codebase/project.json`
- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `app/page.tsx`
- `codex.md`
- `.cursorrules`
- `app/solutions/page.tsx`
- `app/contact/page.tsx`
- `app/easyreadvoice/_components/AdBannerTop.tsx`

**Recently Modified:**
- `.codebase/project.json`
- `.cursorrules`
- `.eslintrc.json`
- `.windsurfrules`
- `AGENTS.md`
- `CLAUDE.md`
- `PROJECT_CONTEXT.md`
- `codex.md`
- `lib/SettingsContext.tsx`
- `app/admin/about/page.tsx`
