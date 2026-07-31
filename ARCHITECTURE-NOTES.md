# ARCHITECTURE-NOTES — newappai.com

Notes d'architecture et décisions techniques pour newappai.com (Next.js 14).

---

## ÉTAT FINAL — 31/07/2026 (migration terminée, Phase 4 exécutée)

### Hébergement
- **newappai.com tourne EXCLUSIVEMENT sur DEV (76.13.141.221)** — IP publique directe, Traefik (coolify-proxy) + certificat Let's Encrypt sur DEV lui-même
- DNS : newappai.com et www.newappai.com → 76.13.141.221 (confirmé depuis résolveurs externes Google/Cloudflare)
- Certificat : Let's Encrypt, SAN = newappai.com + www.newappai.com

### PJP (72.62.25.52) — ne route plus rien vers newappai.com
- `/data/coolify/proxy/dynamic/newappai.yaml` **supprimé** le 31/07/2026
- Backup du fichier : `~/newappai-cleanup-backup/newappai.yaml.bak` sur PJP
- Depuis PJP, Host newappai.com → 404 (plus de route) — vérifié
- Les autres projets PJP (qrcall, serenite, etc.) non affectés — vérifié

### newPC (100.101.125.48) — service arrêté, rien supprimé
- `newappai.service` **arrêté et désactivé** le 31/07/2026 (inactive/dead, disabled — ne redémarre pas au reboot)
- Code (~/newappai), build (~/newappai-build), DB (conteneur Docker `newappai-db`) **conservés** comme filet de sécurité temporaire
- Process orphelin next-server (port 3020) tué ; port 3020 libre
- ⚠️ Un serveur de dev (`next dev -p 3097` dans ~/CascadeProjects/newappai) tourne toujours — volontairement laissé, c'est un environnement de travail
- Réversibilité : `systemctl start newappai.service && systemctl enable newappai.service` sur newPC restaure tout

### Corrections d'autonomie (dépendances PJP/newPC éliminées)
- `17e4c5e` — translate route uses DeepSeek direct instead of FreeLLM/newPC
- `8e95537` — read order/product info from local Prisma DB instead of Supabase PJP (cart success page)
- `3931415` — remove dead checkout GET route and unused CheckoutButton
- `b3dbda6` — use local storage only for uploads, remove PJP Supabase fallback
- `4b92f3c` — ignore .env.production and backups (secrets jamais versionnés)
- `baa4c17` — note auth client orpheline
- `112d8ad` — contact notification + confirmation emails (#1)

### Re-scan final (31/07/2026) — DEV 100% autonome
- IP newPC/PJP en dur dans le code : **0**
- Références FreeLLM : **0**
- Routes utilisant supabaseNewappai (client PJP) : **0**
- .env : aucune référence newPC/PJP
- Webhooks Stripe : aucun

---

## Auth client orpheline (documenté le 31/07/2026)

`/auth/login`, `/auth/register`, `/profile` ne sont **pas utilisés** :
- 0 comptes en base au 30/07/2026 (table `User` Prisma locale)
- aucun lien dans la navigation visible (Header/Footer) ; `StickyCTA` les masque explicitement (HIDDEN_PATHS)

Ces pages dépendent de **Supabase PJP** (`/api/auth/supabase` → `supabaseolharosol.newappai.com`). Elles **resteront non-fonctionnelles après le nettoyage PJP**.

Décision : à migrer vers Prisma/iron-session (même mécanisme que l'admin) si cette fonctionnalité est réactivée un jour, sinon à supprimer proprement du code pour éviter la confusion.

---

## Backups (inventaire au 31/07/2026 — décision de conservation en attente)

| Emplacement | Contenu | Taille |
|---|---|---|
| DEV : /root/newappai-full-backup-20260730/ | .env.production (SECRETS), DB SQL (151 Ko), uploads tar.gz (10 Mo), service | 9,9 Mo |
| newPC : ~/newappai-full-backup-20260730/ | idem (copie) | 9,9 Mo |
| DEV : /root/newappai-build-backup-20260731-0925 | build standalone pré-Correction 2 | 349 Mo |
| DEV : /root/newappai-build-backup-20260731-0940 | build standalone pré-Point 2 uploads | 348 Mo |
| PJP : ~/newappai-cleanup-backup/newappai.yaml.bak | config Traefik newappai (pré-suppression) | 8 Ko |
| DEV : /root/newappai-full-backup-20260730/orders_backup_before_cleanup_20260731.csv | table Order avant nettoyage tests | 555 o |

⚠️ **Le .env.production (secrets) existe à DEUX endroits** : `/root/newappai-full-backup-20260730/.env.production` sur DEV et `~/newappai-full-backup-20260730/.env.production` sur newPC. C'est le seul backup contenant les clés (Stripe, Supabase, SMTP, DeepSeek, AES). Il est aussi présent en usage actif : `/root/newappai-build/.env` sur DEV.
