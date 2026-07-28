# AGENTS.md — newappai

## Project Summary

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Entry Points

- `lib/supabase/server.ts`
- `.claude/worktrees/agent-a218e697f919db3c9/lib/supabase/server.ts`

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

## Build Status

See `docs/progress.md` for current implementation state.
