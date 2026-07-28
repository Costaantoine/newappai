# NewAppAI — Hub Multi-Services

Plateforme multi-services Next.js 14 avec Supabase, Stripe, et assistant IA. Marketplace de services avec paiements, gestion admin, authentification utilisateur, et assistant IA intégré.

## Fonctionnalités

- Marketplace de services avec catalogue produits
- Paiements Stripe (checkout, webhooks)
- Administration avec tableau de bord
- Authentification admin (iron-session)
- Assistant IA (DeepSeek API)
- Traduction multilingue (français, anglais, portugais, espagnol)
- Upload de fichiers
- Gestion de contenu (textes, zones, produits)
- Lecteur audio et effets sonores
- Panier d'achat
- Design responsive avec Tailwind CSS

## Stack Technique

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Next.js API Routes
- **Base de données:** Prisma (SQLite en dev, PostgreSQL en prod)
- **Authentification:** iron-session
- **Paiements:** Stripe
- **IA:** DeepSeek API, Gemini API
- **Stockage:** Supabase Storage
- **Email:** Nodemailer
- **Tests:** Vitest
- **Déploiement:** Docker, standalone Next.js

## Installation

```bash
# Cloner le repo
git clone <url>
cd newappai

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

## Variables d'environnement

| Variable | Description | Requis | Exemple |
|----------|-------------|--------|---------|
| `NODE_ENV` | Environnement | Oui | `development` |
| `NEXT_PUBLIC_SITE_URL` | URL du site | Oui | `http://localhost:3001` |
| `ADMIN_PASSWORD` | Mot de passe admin | Oui | `test1234` |
| `SESSION_SECRET` | Clé de session (32+ chars) | Oui | `test-secret-minimum-32-characters-long-ok` |
| `NEWAPPAI_SUPABASE_URL` | URL Supabase | Oui | `https://supabaseolharosol.newappai.com` |
| `NEWAPPAI_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Oui | `placeholder` |
| `NEWAPPAI_SUPABASE_SERVICE_KEY` | Clé service Supabase | Oui | `placeholder` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | Oui | `sk_test_placeholder` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | Oui | `whsec_placeholder` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publiable Stripe | Oui | `pk_test_placeholder` |
| `NEXT_PUBLIC_COMPANY_NAME` | Nom de l'entreprise | Non | `NewAppAI` |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Email de contact | Non | `test@newappai.com` |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | Adresse | Non | `Test Address` |
| `LOG_LEVEL` | Niveau de log | Non | `info` |
| `DATABASE_URL` | URL base de données | Oui | `file:./dev.db` |
| `DEEPSEEK_API_KEY` | Clé API DeepSeek | Non | `sk-...` |
| `GEMINI_API_KEY` | Clé API Gemini | Non | `AQ...` |

## Démarrage

```bash
# Mode développement (port 3001)
npm run dev

# Build production
npm run build

# Démarrer en production
npm start
```

## Endpoints API principaux

| Méthode | Chemin | Description |
|---------|--------|-------------|
| GET | `/` | Page d'accueil |
| GET | `/api/auth` | Authentification admin |
| POST | `/api/auth` | Connexion admin |
| GET | `/api/products` | Liste des produits |
| POST | `/api/products` | Créer un produit |
| GET | `/api/stripe/checkout` | Créer une session checkout |
| POST | `/api/stripe/webhook` | Webhook Stripe |
| GET | `/api/upload` | Upload de fichier |
| GET | `/api/contact` | Formulaire de contact |
| GET | `/api/eva` | Assistant IA EVA |
| GET | `/api/tts` | Synthèse vocale |
| GET | `/api/assistant` | Assistant général |
| GET | `/api/translate` | Traduction |

## Pages

- `/` — Accueil
- `/about` — À propos
- `/contact` — Contact
- `/produits` — Produits
- `/solutions` — Solutions
- `/admin` — Administration
- `/admin/login` — Connexion admin
- `/admin/products` — Gestion produits
- `/admin/texts` — Gestion textes
- `/admin/settings` — Paramètres
- `/cgv` — Conditions générales
- `/mentions-legales` — Mentions légales
- `/privacy` — Politique de confidentialité
- `/success` — Paiement réussi

## Déploiement

### Docker
```bash
docker build -t newappai .
docker run -p 3001:3001 newappai
```

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Tests

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Mode watch
npm run test:watch
```

## Score qualité

**Statut: BLOQUÉ** — Score global: 19/100

- Tests API: 19% de réussite (8/42 passés)
- Routes API: 9/9 endpoints retournent 404
- Pages: 10/11 pages retournent 404
- Sécurité: Non audité
- Variables d'environnement: 6 placeholders à remplacer
- SSL: Non configuré

## Structure du projet

```
app/                    # Pages et API routes Next.js
├── page.tsx            # Page d'accueil
├── layout.tsx          # Layout racine
├── admin/              # Pages d'administration
├── api/                # Routes API
├── about/              # Page À propos
├── contact/            # Page Contact
├── produits/           # Page Produits
├── solutions/          # Page Solutions
├── cgv/                # Conditions générales
├── mentions-legales/   # Mentions légales
├── privacy/            # Politique de confidentialité
├── success/            # Page de succès paiement
components/             # Composants React
lib/                    # Utilitaires et configurations
├── prisma.ts           # Client Prisma
├── stripe.ts           # Configuration Stripe
├── supabaseNewappai.ts # Client Supabase
├── rateLimit.ts        # Rate limiting
├── validators.ts       # Validation Zod
├── cartContext.tsx      # Contexte panier
├── session.ts          # Gestion sessions
├── email.ts            # Envoi d'emails
prisma/                 # Schéma et migrations
├── schema.prisma       # Schéma SQLite
├── schema.postgresql.prisma # Schéma PostgreSQL
public/                 # Fichiers statiques
scripts/                # Scripts de seed
__tests__/              # Tests unitaires
```

## Licence

ISC