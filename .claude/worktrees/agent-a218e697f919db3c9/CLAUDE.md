# CLAUDE.md — newappai

## What Is This Project?

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Quick Reference

- **Entry point**: `lib/supabase/server.ts`
- **Languages**: typescript, javascript, python
- **Architecture**: monolith
- **Modules**: 11
- **Dependencies**: 24
- **Last scanned**: 2026-07-16 15:09:38.229268+00:00

## Architecture

**Type:** monolith

**Entry Points:**
- `lib/supabase/server.ts`

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
- Functions: `metadata`, `dynamic`, `stopAllAdminPlayers`, `cn`, `formatPrice`
- Classes: `HomePage`, `RootLayout`, `MarketplacePage`, `PrivacyPage`, `EasyReadVoicePage`

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
- **Files:** 77

**Key Files:**
- `app/page.tsx` — API routes
  Exports: `HomePage`
- `app/layout.tsx` — configuration
  Exports: `RootLayout`, `metadata`
- `app/marketplace/page.tsx` — UI components
  Exports: `MarketplacePage`
- `app/privacy/page.tsx` — database models
  Exports: `PrivacyPage`, `metadata`
- `app/easyreadvoice/page.tsx` — UI components
  Exports: `EasyReadVoicePage`
- `app/produits/page.tsx` — utilities
  Exports: `dynamic`
- `app/admin/page.tsx` — authentication
  Exports: `AdminPage`
- `app/qrcall/page.tsx` — UI components
  Exports: `QRcallPage`
- `app/cgv/page.tsx` — CLI commands
  Exports: `CGVPage`, `metadata`
- `app/about/page.tsx` — UI components
  Exports: `AboutPage`

### components
- **Path:** `components`
- **Language:** typescript
- **Files:** 29

**Key Files:**
- `components/BackToTop.tsx` — UI components
  Exports: `BackToTop`
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
- `components/SoundPlayer.tsx` — UI components
  Exports: `SoundPlayer`

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
- **Files:** 39

**Key Files:**
- `lib/errors.ts` — error handling
  Exports: `ApiError`, `AuthError`, `ValidationError`, `NotFoundError`, `StripeError`, `RateLimitError`
- `lib/logger.ts` — configuration
- `lib/utils.ts` — utilities
  Exports: `cn`, `formatPrice`, `formatDate`, `slugify`, `truncate`, `randomId`
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
- `lib/supabase.ts` — database models
  Exports: `supabase`, `supabaseAdmin`

### prisma
- **Path:** `prisma`
- **Files:** 3

**Key Files:**
- `prisma/schema.prisma`
- `prisma/dev.db`
- `prisma/schema.postgresql.prisma`

### public
- **Path:** `public`
- **Files:** 47

**Key Files:**
- `public/contact.html`
- `public/solutions.html`
- `public/header-bg.png`
- `public/click-collect-app.png`
- `public/about.html`

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
- **Files:** 11

**Key Files:**
- `scripts/add-product.ts` — database models
- `scripts/seed-texts.js` — configuration
- `scripts/add-qrcall-products.js` — database models
- `scripts/add-qrcall-products.ts` — database models
- `scripts/test-supabase.js` — database models
- `scripts/check-db.js` — data access
- `scripts/debug-db.js` — data access
- `scripts/seed-solutions.js` — data access
- `scripts/seed-texts-admin.js` — configuration

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
- `lib/validations/auth.ts` — authentication
  Exports: `LoginSchema`, `RegisterSchema`, `PasswordResetSchema`, `PasswordUpdateSchema`
  Imports: `zod`
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
- `app/layout.tsx` — configuration
  Exports: `RootLayout`, `metadata`
  Imports: `next`, `@/components/Providers`, `@/components/ClientLayout`, `@/lib/SettingsContext`
- `app/privacy/page.tsx` — database models
  Exports: `PrivacyPage`, `metadata`
  Imports: `@/components/Header`, `@/components/Footer`
- `app/cgv/page.tsx` — CLI commands
  Exports: `CGVPage`, `metadata`
  Imports: `@/components/Header`, `@/components/Footer`
- `app/mentions-legales/page.tsx` — authentication
  Exports: `MentionsLegalesPage`, `metadata`
  Imports: `@/components/Header`, `@/components/Footer`
- `app/admin/settings/PageMusicPlayer.tsx` — UI components
  Exports: `stopAllAdminPlayers`, `PageMusicPlayer`
  Imports: `react`
- `lib/rateLimit.ts` — tests
  Exports: `checkRateLimit`, `getClientIp`
- `lib/supabase.ts` — database models
  Exports: `supabase`, `supabaseAdmin`
  Imports: `@supabase/supabase-js`

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
| tailwindcss | ^3.4.1 | npm |
| typescript | ^5.9.3 | npm |
| vitest | ^1.6.1 | npm |

## Git Insights

- **Branch:** `master`
- **Total commits:** 52
- **Contributors:** Alice Costa, NewAppAI Deploy, NewAppAI Admin

**Most Changed Files (Hotspots):**
- `app/page.tsx`
- `Dockerfile`
- `CLAUDE.md`
- `app/contact/page.tsx`
- `.codebase/project.json`
- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `app/solutions/page.tsx`
- `app/about/page.tsx`
- `components/Header.tsx`

**Recently Modified:**
- `.codebase/project.json`
- `AGENTS.md`
- `CLAUDE.md`
- `PROJECT_CONTEXT.md`
- `app/admin/accueil/page.tsx`
- `app/page.tsx`
- `app/produits/page.tsx`
- `app/solutions/page.tsx`
- `components/ProductCarousel.tsx`
- `components/TestimonialCarousel.tsx`
