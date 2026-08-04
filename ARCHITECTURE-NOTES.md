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

---

## Déploiement (procédure officielle — depuis le 03/08/2026)

- Le déploiement passe UNIQUEMENT par `bash /root/newappai/scripts/deploy.sh` (build source → rsync standalone → restart systemd).
- Le script de déploiement exclut désormais `.env` et `.env.*` du rsync pour éviter tout écrasement accidentel des variables de prod. Le `.env` de production vit dans `/root/newappai-build/.env` et n'est JAMAIS écrasé par un déploiement.
- Un backup du build précédent est conservé automatiquement dans `/root/newappai-build-backup-pre-deploy` (rollback : `cp -a` de ce dossier vers `/root/newappai-build` puis `systemctl restart newappai`).
- Ne JAMAIS déployer avec un rsync manuel sans l'exclusion `.env` (incident du 03/08 : HOSTNAME, PORT et SMTP_FROM avaient été perdus).
- Les images uploadées via l'admin (`/api/local/upload`) sont servies par `/api/uploads/<fichier>` qui lit depuis `public/uploads` du build — servies immédiatement, sans restart (corrigé le 03/08 ; l'ancien fallback `/root/newappai-uploads` n'existait pas → 404).

---

## Audit des traductions multi-langues (04/08/2026 — point 2 du chantier i18n)

Contexte : audit + correction des désynchronisations EN/PT/ES vs FR (328 clés en table Text).
Point 1 du chantier : bouton "Traduire auto" dans le mode édition front (commit 67990a1).
Point 2 : correction mécanique des clés trouées, validée par Anthony avant écriture.

### Clés corrigées (14, via PUT /api/supabase/texts — valeurs validées en amont)

Légales (9) — traductions générées via /api/translate (DeepSeek) puis relues :
- legal_cgv_section_4_content : EN/PT/ES ajoutés (paiement Stripe)
- legal_mentions_section_1_address : EN/PT/ES ajoutés
- legal_mentions_section_1_content : PT/ES ajoutés (EN existant conservé)
- legal_mentions_section_1_email : EN/PT/ES ajoutés
- legal_mentions_section_2_content : PT/ES ajoutés (EN existant conservé)
- legal_mentions_section_3_content : PT/ES ajoutés (EN existant conservé)
- legal_mentions_section_4_content : EN/PT/ES ajoutés
- legal_mentions_section_5_content : EN/PT/ES ajoutés
- legal_privacy_section_1_content : EN/PT/ES ajoutés
Normalisations appliquées : "Premium à juste prix" et "France" INCHANGÉS dans les 3 langues
(nom légal + pays d'adresse non traduits, cohérents avec l'EN existant).

Suspectes (5) — uniformisation décidée par Anthony :
- about_hero_title : PT/ES → "NewAppAI" (l'ancien "NovoAppAI"/"Nueva aplicación AI" = traduction d'un ancien FR)
- solutions_clickCollect_title : "Click & Collect" dans les 4 langues (le FR développé remplacé)
- commerce_subtitle : "DigiSmart Solutions" dans les 4 langues
- solutions_digismart_title : "DigiSmart Solutions" dans les 4 langues
- commerce_title : "Commerce Hub" dans les 4 langues (remplace "Pôle Commerce" FR, "Hub Comercial" PT/ES)

Non touchées (décisions) : home_test_title (clé morte, seule référence = SECTION_CONFIG statique),
commerce_site_url + industrie_site_url (URLs, fallbacks jamais atteints — les zones ont leur propre
site_url en DB, ex. digismartai.netlify.app / pro-up.newappai.com).

### Vérification (04/08)
- DB : 14/14 clés confirmées (4 langues, accents OK, zéro résidu "França/Francia/at the right price/a preço justo/a precio justo")
- Visuel navigateur : /mentions-legales EN+PT (8/8 sections), /cgv EN+PT (section Paiement), /privacy EN+PT (17 items, 0 vide), /about PT ("NewAppAI"), /solutions ("Commerce Hub", "DigiSmart Solutions"), accueil ("Commerce Hub" + "DigiSmart Solutions")
- Tests : 107/108 (échec unique préexistant validators.test.ts CreateProductSchema)
- Aucun code modifié (contenu DB uniquement). Pas de commit nécessaire (working tree propre).

### Découvertes pour le point 3 (audit sémantique)
- legal_privacy_last_update : placeholders traduits → PT "{data}", ES "{fecha}" au lieu de "{date}" → s'affichent littéralement sur les pages PT/ES. Corriger en remettant {date}.
- solutions_clickCollect_title : clé ORPHELINE (aucune référence dans app/ components/ lib/) — le produit Click and Delivery (table Product, status development) a son propre titre JSON sans rapport.
- Traductions existantes avec accents perdus (ex. CGV 4bis PT : "a juste prix", "esta", "numero" sans accents ; mentions 4bis EN : "Premium a juste prix" sans accents) — candidats audit sémantique.
- /about : la langue du cookie est réécrite par le sélecteur du header lors de navigations (à vérifier si comportement voulu).

---

## Fix changement de langue (04/08/2026 — commits b81bc19 + 3b28443)

Bug : le middleware réécrivait le cookie lang en le déduisant du PATH sur les pages racine
(/, /en, /pt, /es) → choix utilisateur détruit à chaque passage par l'accueil (vérifié par curl :
GET / avec Cookie lang=es → Set-Cookie lang=fr). Résultat : pages SSR (mentions-legales, cgv,
privacy, produits) rendues en FR malgré un choix ES/PT, et contenu figé au clic (Server Components).

Correctifs :
1. middleware.ts : cookie lang présent → jamais réécrit (la géolocalisation IP ne s'applique
   qu'aux visiteurs SANS cookie). 
2. lib/LanguageContext.tsx : router.refresh() dans handleSetLang → le contenu SSR se met à jour
   IMMÉDIATEMENT au clic sur FR/EN/PT/ES (plus de rechargement manuel).
3. lib/LanguageContext.tsx : cookie client avec `secure` si HTTPS (aligné middleware, évite le
   double cookie).

Tests réels passés (navigateur) : mentions-legales/cgv/privacy clic langue → contenu traduit
immédiat ; /produits → h1 + sous-titre + catégories + cartes cohérents ; accueil puis retour
page légale → cookie préservé ; nouveau visiteur sans cookie → géoloc intacte (US → /en + cookie
en ; FR → cookie fr).

⚠️ RESTE OUVERT (bug initial de la session, NON résolu par ce fix) : le HTML SSR initial de
l'accueil (/en) contient le contenu FR (h1 FR) alors que la metadata est EN — le
LanguageProvider initialise lang='fr' côté serveur (useState('fr')) et ne reçoit pas la langue
du cookie ; l'hydratation corrige ensuite (humain OK, flash FR→EN), mais les crawlers/SEO voient
FR sur /en. Fix prévu : passer la langue détectée (cookie) en prop initiale au LanguageProvider
depuis le layout (RootLayout lit déjà le cookie).
