# NewAppAI — Résumé complet du projet pour Claude

## Vue d'ensemble

**NewAppAI** est un site vitrine e-commerce SaaS pour une société proposant des solutions logicielles intelligentes (Click & Collect, IA téléphonique, GPS livraison, gestion d'atelier…). Le site est entièrement administrable via un back-office intégré.

- **Framework** : Next.js 14 (App Router, TypeScript)
- **Base de données** : PostgreSQL via Prisma ORM (auto-hébergé sur VPS)
- **Paiement** : Stripe (checkout, webhooks)
- **Style** : Tailwind CSS
- **Auth** : iron-session (session cookie chiffrée)
- **Images** : Upload vers catbox.moe (CDN externe) via sharp (conversion WebP)
- **IA** : Assistant conversationnel (Groq / Gemini / Mercury, avec fallback)
- **Déploiement** : Coolify (Docker, VPS), repo GitHub @Premium-a-juste-prix

---

## Architecture des dossiers

```
NewAppAi-master/
├── app/                        # Pages Next.js (App Router)
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # Page À propos
│   ├── contact/page.tsx        # Page Contact (formulaire)
│   ├── produits/page.tsx       # Catalogue produits
│   ├── solutions/page.tsx      # Page Solutions (zones + cartes)
│   ├── success/page.tsx        # Page succès après paiement Stripe
│   ├── admin/                  # Back-office (protégé par session)
│   │   ├── login/page.tsx      # Connexion admin (mot de passe)
│   │   ├── dashboard/page.tsx  # Gestion produits (tableau)
│   │   ├── produits/page.tsx   # Gestion produits (visuel + images)
│   │   ├── texts/page.tsx      # Gestion textes/traductions
│   │   ├── zones/page.tsx      # Gestion zones + cartes
│   │   ├── solutions/page.tsx  # Gestion solutions
│   │   ├── settings/page.tsx   # Paramètres (musique, sons, hero)
│   │   ├── accueil/page.tsx    # Paramètres page accueil
│   │   ├── about/page.tsx      # Paramètres page À propos
│   │   └── contact/page.tsx    # Paramètres page Contact
│   └── api/                    # API Routes
│       ├── products/           # CRUD produits → PostgreSQL
│       ├── texts/              # CRUD textes/traductions → PostgreSQL
│       ├── zones/              # CRUD zones → PostgreSQL
│       ├── zone-cards/         # CRUD cartes de zones → PostgreSQL
│       ├── solutions/          # CRUD solutions → PostgreSQL
│       ├── stripe/
│       │   ├── checkout/       # Créer session Stripe + order
│       │   ├── checkout-cart/  # Checkout panier multi-produits
│       │   ├── session/        # Récupérer infos session Stripe
│       │   └── webhook/        # Webhook Stripe (marquer commande payée)
│       ├── auth/               # Login/logout/check admin
│       ├── upload/             # Upload image → catbox.moe (WebP via sharp)
│       ├── translate/          # Traduction FR→EN/PT/ES (Google Translate)
│       ├── assistant/          # IA chat (Groq → Gemini → Mercury)
│       └── local/              # Routes de fallback JSON (settings, products…)
├── components/                 # Composants React réutilisables
├── lib/                        # Utilitaires et contextes
├── prisma/
│   └── schema.prisma           # Schéma PostgreSQL
├── data/                       # Fichiers JSON locaux (settings.json)
├── public/                     # Assets statiques
├── Dockerfile                  # Build multi-stage pour Coolify
└── .env.example                # Variables d'environnement à configurer
```

---

## Base de données — Schéma Prisma (PostgreSQL)

### `Product`
```
id          uuid (PK)
title       String
description String
price       Int (centimes, ex: 9900 = 99€)
images      String[] (URLs externes catbox.moe)
category    String
active      Boolean
created_at  DateTime
updated_at  DateTime
```

### `Text`
Traductions dynamiques du site (multilingue FR/EN/PT/ES)
```
id       uuid (PK)
key      String (ex: "hero_title")
fr       String
en       String
pt       String
es       String
section  String (ex: "accueil", "contact")
```

### `Zone`
Sections/catégories de la page Solutions
```
id           uuid (PK)
key          String
title_key    String (clé de traduction)
subtitle_key String
badge        String
color        String (ex: "sky", "purple")
url          String
cta_key      String
newtab_key   String
order        Int
active       Boolean
```

### `ZoneCard`
Cartes de solution dans une zone (relation Zone 1→N ZoneCard)
```
id              uuid (PK)
zone_id         String (FK → Zone, onDelete: Cascade)
title_key       String
description_key String
badge_key       String
image_url       String
order           Int
active          Boolean
```

### `Solution`
Textes enrichis des solutions (multilingue)
```
id       uuid (PK)
key      String
fr/en/pt/es  String
section  String
type     String (ex: "description", "title")
category String
```

### `Order`
Commandes Stripe
```
id                uuid (PK)
stripe_session_id String (unique)
product_id        String? (FK → Product)
customer_email    String?
amount            Int (centimes)
status            String ("pending" | "paid")
```

### `Settings`
Paramètres globaux du site (1 seul enregistrement, id="main")
```
id         String ("main")
data       Json (voir structure ci-dessous)
updated_at DateTime
```

**Structure du JSON `Settings.data` :**
```json
{
  "hero_image_url": "",
  "hero_opacity": 1,
  "hero_brightness": 1,
  "hero_overlay_opacity": 0.4,
  "hero_title": "",
  "hero_subtitle1": "",
  "hero_subtitle2": "",
  "music": {
    "accueil":  { "url": "", "volume": 0.5 },
    "solutions":{ "url": "", "volume": 0.5 },
    "histoire": { "url": "", "volume": 0.5 },
    "produits": { "url": "", "volume": 0.5 },
    "contact":  { "url": "", "volume": 0.5 }
  },
  "sound_hover_enabled": false,
  "sound_click_enabled": false,
  "sound_hover_url": "",
  "sound_click_url": ""
}
```

> **Note :** Les paramètres visuels avancés (couleurs, header, footer, boutons, animations) sont stockés dans `data/settings.json` (fichier JSON local persisté sur le serveur) via `/api/local/settings`.

---

## API Routes — Détail complet

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products` | Liste tous les produits |
| POST | `/api/products` | Créer un produit |
| GET | `/api/products/[id]` | Détail d'un produit |
| PUT | `/api/products/[id]` | Modifier un produit |
| DELETE | `/api/products/[id]` | Supprimer un produit |

### Textes (traductions)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/texts` | Liste tous les textes (trié section/key) |
| POST | `/api/texts` | Créer un texte (key obligatoire en minuscules) |
| PUT | `/api/texts/[id]` | Modifier un texte |
| DELETE | `/api/texts/[id]` | Supprimer un texte |

### Zones
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/zones` | Liste zones (trié par order) |
| POST | `/api/zones` | Créer une zone |
| GET | `/api/zones/[id]` | Détail zone |
| PUT | `/api/zones/[id]` | Modifier zone |
| DELETE | `/api/zones/[id]` | Supprimer zone (cascade ZoneCards) |

### Zone Cards
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/zone-cards?zone_id=xxx` | Cartes d'une zone (ou toutes) |
| POST | `/api/zone-cards` | Créer une carte |
| GET | `/api/zone-cards/[id]` | Détail carte |
| PUT | `/api/zone-cards/[id]` | Modifier carte |
| DELETE | `/api/zone-cards/[id]` | Supprimer carte |

### Solutions
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/solutions` | Liste solutions (trié category/key) |
| POST | `/api/solutions` | Créer solution |
| PUT | `/api/solutions/[id]` | Modifier solution |
| DELETE | `/api/solutions/[id]` | Supprimer solution |

### Stripe / Paiements
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/stripe/checkout?productId=xxx` | Créer session Stripe (1 produit) + order "pending" |
| POST | `/api/stripe/checkout-cart` | Checkout panier multi-produits |
| GET | `/api/stripe/session?session_id=xxx` | Récupérer infos post-paiement |
| POST | `/api/stripe/webhook` | Webhook Stripe → passe order à "paid" |

### Auth / Session
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth` | Login admin (body: `{ password }`) → `session.isAdmin = true` |
| GET | `/api/auth` | Vérifier si admin connecté |
| DELETE | `/api/auth` | Logout |

### Utilitaires
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/upload` | Upload image → convertit en WebP via sharp → catbox.moe |
| POST | `/api/translate` | Traduction (Google Translate ou dictionnaire local) |
| POST | `/api/assistant` | Chat IA (Groq → Gemini → Mercury en fallback) |

### Settings (local JSON)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/local/settings` | Lire `data/settings.json` |
| PUT | `/api/local/settings` | Mettre à jour `data/settings.json` (deepMerge) |

---

## Frontend — Pages publiques

### Homepage (`/`)
- Hero dynamique : image de fond + opacité/luminosité/overlay configurable
- Section Zones : grille des pôles d'expertise (couleurs dynamiques)
- Section Produits : 6 premiers produits + lien "Voir tous"
- Multilingue (FR/EN/PT/ES) via textes en base + traductions statiques

### Solutions (`/solutions`)
- Zones affichées comme catégories
- Cartes de solutions dans chaque zone (image, badge, description)

### Produits (`/produits`)
- Grille de ProductCard
- Ajout au panier
- Checkout Stripe direct (1 produit) ou panier multi-produits

### Contact (`/contact`)
- Formulaire : nom, email, sujet (dropdown), message
- Étapes : formulaire → message de confirmation
- Pas d'envoi email configuré (à implémenter)

### À propos (`/about`)
- Sections Vision, Approche, Valeurs (3 cartes)

### Succès paiement (`/success`)
- Affiche nom produit + email client après paiement Stripe

---

## Frontend — Composants clés

### `Header`
- Logo + navigation (5 liens)
- Sélecteur de langue (FR/EN/PT/ES)
- Icône panier (CartWidget)
- Lien admin discret
- Style dynamique depuis SettingsContext (couleur, opacité, flou…)

### `AssistantWidget`
- Bubble chat flottante
- Reconnaissance vocale (Web Speech API)
- Historique de conversation
- Fallback vers formulaire de contact si intention détectée
- Multilingue

### `CartWidget`
- Panier flottant (icône + badge nombre d'articles)
- Modal 3 étapes : panier → informations client → paiement Stripe
- Persist dans localStorage
- Appelle `/api/stripe/checkout-cart`

### `SoundPlayer`
- Musique de fond par page (5 pages différentes)
- Fade in/out, volume configurable
- Mute persisté en localStorage
- Auto-play après première interaction utilisateur

### `ProductCard`
- Image avec filtres configurables (opacité, luminosité, contraste, saturation, sépia)
- Titre, description tronquée, prix
- Bouton "Ajouter au panier" (change de couleur si déjà dans le panier)

---

## Contextes React (lib/)

### `SettingsContext`
- Charge les settings depuis `/api/local/settings`
- Fusionne avec des valeurs par défaut
- Injecte des variables CSS dans `:root` (couleurs, opacités…)
- Exposé via `useSettings()` dans tous les composants

### `LanguageContext`
- Langue courante (fr/en/pt/es) persistée en localStorage
- Exposé via `useLanguage()` → `{ lang, setLang, t }` (fonction de traduction)

### `cartContext`
- Panier : `{ items, addItem, removeItem, updateQty, total, count }`
- Persist localStorage

---

## Variables d'environnement requises

```env
DATABASE_URL          # postgresql://user:pass@host:5432/db
ADMIN_PASSWORD        # Mot de passe back-office
SESSION_SECRET        # Secret iron-session (min 32 chars)
STRIPE_SECRET_KEY     # sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # pk_live_...
STRIPE_WEBHOOK_SECRET # whsec_...
GROQ_API_KEY          # (optionnel) pour l'IA assistant
GEMINI_API_KEY        # (optionnel) fallback IA
MERMAID_API_KEY       # (optionnel) fallback IA
```

---

## Déploiement

- **Dockerfile** multi-stage (node:20-alpine) avec `output: standalone`
- **Coolify** : PostgreSQL service + Application service (même projet)
- **DATABASE_URL** utilise le nom du service Coolify comme hostname
- Au démarrage : `prisma migrate deploy && node server.js`
- **GitHub** : repo `@Premium-a-juste-prix/NewAppAi` (branch main/master)

---

## Points importants à savoir

1. **Prix en centimes** : `price = 9900` = 99,00€ (convention Stripe)
2. **Images** : hébergées sur catbox.moe (CDN gratuit externe), converties en WebP côté serveur
3. **Settings visuels** (couleurs, header, footer, boutons, animations) → `data/settings.json` (JSON local)
4. **Settings audio/hero** → table `Settings` PostgreSQL
5. **Textes multilingues** → table `Text` PostgreSQL (clé/section + 4 langues)
6. **Pas de Firebase, pas de Supabase** — tout est PostgreSQL + Prisma
7. **Auth admin** = mot de passe unique (`ADMIN_PASSWORD` env) via iron-session
8. **Upload audio** → `/api/local/upload-audio` (stockage local serveur)
9. **Upload image** → `/api/upload` (catbox.moe) ou `/api/local/upload` (stockage local)
10. **Traduction** → `/api/translate` utilise Google Translate sans clé API (scraping limité) ou dictionnaire local
