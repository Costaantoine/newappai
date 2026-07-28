# AGENTS.md — newappai

## Project Summary

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Entry Points

- `lib/supabase/server.ts`

## Key Commands

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run start
```

## Conventions

- mixed, absolute imports, feature-based file organization
- Tests: `*.test.ts`
- Patterns: command, helper, middleware, provider, repository, router, service

## Architecture Flow

**Type:** monolith

```
Entry (lib/supabase/server.ts)
  → Modules: __tests__, app, components, evidence, lib
  → Frontend + Database
```

## Modules

- `__tests__`
- `app`
- `components`
- `evidence`
- `lib`
- `prisma`
- `public`
- `reports`
- `scripts`
- `supabase`
- `types`

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

## Build Status

See `docs/progress.md` for current implementation state.
