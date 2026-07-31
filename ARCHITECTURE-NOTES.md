# ARCHITECTURE-NOTES — newappai.com

Notes d'architecture et décisions techniques pour newappai.com (Next.js 14 sur DEV 76.13.141.221).

---

## Auth client orpheline (documenté le 31/07/2026)

`/auth/login`, `/auth/register`, `/profile` ne sont **pas utilisés** :
- 0 comptes en base au 30/07/2026 (table `User` Prisma locale)
- aucun lien dans la navigation visible (Header/Footer) ; `StickyCTA` les masque explicitement (HIDDEN_PATHS)

Ces pages dépendent aujourd'hui de **Supabase PJP** (`/api/auth/supabase` → `supabaseolharosol.newappai.com`). Elles **resteront non-fonctionnelles après le nettoyage PJP**.

Décision : à migrer vers Prisma/iron-session (même mécanisme que l'admin) si cette fonctionnalité est réactivée un jour, sinon à supprimer proprement du code pour éviter la confusion.
