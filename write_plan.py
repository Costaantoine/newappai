import json

plan = {
    "stack": {
        "backend": "Next.js 14 (App Router, API Routes)",
        "frontend": "Next.js 14 + React + Tailwind CSS + shadcn/ui",
        "database": "Supabase (PostgreSQL)",
        "third_party": [
            "Stripe (paiements)",
            "OpenAI / Assistant API",
            "Supabase Auth",
            "Supabase Storage",
            "Resend (emails)",
            "Zod (validation)"
        ],
        "env_vars": [
            "NEXT_PUBLIC_SUPABASE_URL",
            "NEXT_PUBLIC_SUPABASE_ANON_KEY",
            "SUPABASE_SERVICE_ROLE_KEY",
            "STRIPE_SECRET_KEY",
            "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
            "STRIPE_WEBHOOK_SECRET",
            "OPENAI_API_KEY",
            "RESEND_API_KEY",
            "NEXT_PUBLIC_APP_URL"
        ]
    },
    "files": [
        {"id": "001", "action": "CREER", "path": "app/api/auth/route.ts", "role": "Route API d'authentification (POST login, GET session, DELETE logout) avec Supabase Auth", "depends_on": []},
        {"id": "002", "action": "CREER", "path": "app/api/supabase/products/route.ts", "role": "CRUD produits marketplace via Supabase", "depends_on": ["001"]},
        {"id": "003", "action": "CREER", "path": "app/api/supabase/solutions/route.ts", "role": "CRUD solutions/services via Supabase", "depends_on": ["001"]},
        {"id": "004", "action": "CREER", "path": "app/api/supabase/orders/route.ts", "role": "CRUD commandes clients via Supabase", "depends_on": ["001"]},
        {"id": "005", "action": "CREER", "path": "app/api/supabase/cards/route.ts", "role": "CRUD cartes de services via Supabase", "depends_on": ["001"]},
        {"id": "006", "action": "CREER", "path": "app/api/supabase/settings/route.ts", "role": "GET/PUT parametres application via Supabase", "depends_on": ["001"]},
        {"id": "007", "action": "CREER", "path": "app/api/supabase/texts/route.ts", "role": "CRUD contenus textuels multilingues via Supabase", "depends_on": ["001"]},
        {"id": "008", "action": "CREER", "path": "app/api/supabase/zones/route.ts", "role": "CRUD zones geographiques via Supabase", "depends_on": ["001"]},
        {"id": "009", "action": "CREER", "path": "app/api/stripe/checkout/route.ts", "role": "GET session Stripe Checkout", "depends_on": ["001"]},
        {"id": "010", "action": "CREER", "path": "app/api/stripe/checkout-cart/route.ts", "role": "POST creation session Stripe Checkout pour panier", "depends_on": ["001"]},
        {"id": "011", "action": "CREER", "path": "app/api/stripe/session/route.ts", "role": "GET verification statut session Stripe", "depends_on": ["001"]},
        {"id": "012", "action": "CREER", "path": "app/api/stripe/webhook/route.ts", "role": "POST webhook Stripe pour evenements de paiement", "depends_on": ["001"]},
        {"id": "013", "action": "CREER", "path": "app/api/assistant/route.ts", "role": "POST assistant IA (OpenAI) pour support client", "depends_on": ["001"]},
        {"id": "014", "action": "CREER", "path": "app/api/eva/route.ts", "role": "POST assistant EVA (IA specialisee)", "depends_on": ["001"]},
        {"id": "015", "action": "CREER", "path": "app/api/translate/route.ts", "role": "POST traduction automatique via IA", "depends_on": ["001"]},
        {"id": "016", "action": "CREER", "path": "app/api/tts/route.ts", "role": "GET/POST synthese vocale (Text-to-Speech)", "depends_on": ["001"]},
        {"id": "017", "action": "CREER", "path": "app/api/contact/route.ts", "role": "POST formulaire de contact avec notification email", "depends_on": ["001"]},
        {"id": "018", "action": "CREER", "path": "app/api/upload/route.ts", "role": "POST upload fichiers generique", "depends_on": ["001"]},
        {"id": "019", "action": "CREER", "path": "app/api/local/upload/route.ts", "role": "POST upload fichiers local", "depends_on": ["001"]},
        {"id": "020", "action": "CREER", "path": "app/api/local/upload-audio/route.ts", "role": "POST upload fichiers audio local", "depends_on": ["001"]},
        {"id": "021", "action": "CREER", "path": "app/api/local/upload-media/route.ts", "role": "POST upload fichiers media local", "depends_on": ["001"]},
        {"id": "022", "action": "CREER", "path": "lib/supabase/client.ts", "role": "Client Supabase cote navigateur", "depends_on": []},
        {"id": "023", "action": "CREER", "path": "lib/supabase/server.ts", "role": "Client Supabase cote serveur (service role)", "depends_on": []},
        {"id": "024", "action": "CREER", "path": "lib/supabase/middleware.ts", "role": "Middleware Supabase pour Next.js (gestion session)", "depends_on": ["022", "023"]},
        {"id": "025", "action": "CREER", "path": "lib/stripe/client.ts", "role": "Client Stripe cote serveur", "depends_on": []},
        {"id": "026", "action": "CREER", "path": "lib/stripe/webhook.ts", "role": "Gestionnaire webhook Stripe (verification signature, traitement evenements)", "depends_on": ["025"]},
        {"id": "027", "action": "CREER", "path": "lib/ai/openai.ts", "role": "Client OpenAI pour assistant, traduction, TTS", "depends_on": []},
        {"id": "028", "action": "CREER", "path": "lib/validations/auth.ts", "role": "Schemas Zod pour validation auth (login, register, password reset)", "depends_on": []},
        {"id": "029", "action": "CREER", "path": "lib/validations/product.ts", "role": "Schemas Zod pour validation produits", "depends_on": []},
        {"id": "030", "action": "CREER", "path": "lib/validations/order.ts", "role": "Schemas Zod pour validation commandes", "depends_on": []},
        {"id": "031", "action": "CREER", "path": "lib/validations/contact.ts", "role": "Schemas Zod pour validation formulaire contact", "depends_on": []},
        {"id": "032", "action": "CREER", "path": "middleware.ts", "role": "Middleware Next.js pour securite (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) et gestion session Supabase", "depends_on": ["024"]},
        {"id": "033", "action": "MODIFIER", "path": "next.config.js", "role": "Configuration Next.js: retirer X-Powered-By, ajouter headers securite, config Stripe/OpenAI", "depends_on": []},
        {"id": "034", "action": "CREER", "path": "types/supabase.ts", "role": "Types TypeScript generes pour les tables Supabase (products, solutions, orders, cards, settings, texts, zones, users)", "depends_on": []},
        {"id": "035", "action": "CREER", "path": "types/stripe.ts", "role": "Types TypeScript pour les objets Stripe (Product, Price, Session, WebhookEvent)", "depends_on": []},
        {"id": "036", "action": "CREER", "path": "types/ai.ts", "role": "Types TypeScript pour les interactions IA (AssistantRequest, AssistantResponse, TranslationRequest, TTSRequest)", "depends_on": []},
        {"id": "037", "action": "CREER", "path": "lib/utils.ts", "role": "Fonctions utilitaires (formatage prix, dates, cn() pour Tailwind)", "depends_on": []},
        {"id": "038", "action": "CREER", "path": "lib/errors.ts", "role": "Classes d'erreur personnalisees (ApiError, AuthError, ValidationError, StripeError)", "depends_on": []},
        {"id": "039", "action": "CREER", "path": "lib/api-response.ts", "role": "Helpers de reponse API standardisee (success, error, paginated)", "depends_on": []},
        {"id": "040", "action": "CREER", "path": "lib/rate-limit.ts", "role": "Middleware de rate limiting pour les routes API", "depends_on": []},
        {"id": "041", "action": "CREER", "path": "supabase/migrations/001_initial_schema.sql", "role": "Migration initiale: tables products, solutions, orders, cards, settings, texts, zones, profiles", "depends_on": []},
        {"id": "042", "action": "CREER", "path": "supabase/seed.sql", "role": "Donnees de seed pour developpement (produits, solutions, settings)", "depends_on": ["041"]},
        {"id": "043", "action": "CREER", "path": ".env.example", "role": "Template de variables d'environnement avec toutes les cles requises", "depends_on": []},
        {"id": "044", "action": "CREER", "path": "scripts/check-env.ts", "role": "Script de verification des variables d'environnement au demarrage", "depends_on": []}
    ],
    "sequence": [
        {"bloc": 1, "name": "Fondations - Infrastructure et Configuration", "tasks": ["Creer .env.example", "Creer scripts/check-env.ts", "Modifier next.config.js", "Creer lib/utils.ts", "Creer lib/errors.ts", "Creer lib/api-response.ts", "Creer lib/rate-limit.ts", "Creer types/supabase.ts, types/stripe.ts, types/ai.ts"], "parallel": True},
        {"bloc": 2, "name": "Couche Supabase - Client et Server", "tasks": ["Creer lib/supabase/client.ts", "Creer lib/supabase/server.ts", "Creer lib/supabase/middleware.ts", "Creer supabase/migrations/001_initial_schema.sql", "Creer supabase/seed.sql"], "parallel": False},
        {"bloc": 3, "name": "Middleware et Securite", "tasks": ["Creer middleware.ts (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy + session Supabase)", "Creer lib/validations/auth.ts, product.ts, order.ts, contact.ts"], "parallel": False},
        {"bloc": 4, "name": "Routes API - Authentification", "tasks": ["Creer app/api/auth/route.ts"], "parallel": False},
        {"bloc": 5, "name": "Routes API - Stripe Paiements", "tasks": ["Creer lib/stripe/client.ts", "Creer lib/stripe/webhook.ts", "Creer app/api/stripe/checkout/route.ts", "Creer app/api/stripe/checkout-cart/route.ts", "Creer app/api/stripe/session/route.ts", "Creer app/api/stripe/webhook/route.ts"], "parallel": False},
        {"bloc": 6, "name": "Routes API - IA et Services", "tasks": ["Creer lib/ai/openai.ts", "Creer app/api/assistant/route.ts", "Creer app/api/eva/route.ts", "Creer app/api/translate/route.ts", "Creer app/api/tts/route.ts", "Creer app/api/contact/route.ts", "Creer app/api/upload/route.ts", "Creer app/api/local/upload/route.ts", "Creer app/api/local/upload-audio/route.ts", "Creer app/api/local/upload-media/route.ts"], "parallel": False},
        {"bloc": 7, "name": "Routes API - Supabase CRUD", "tasks": ["Creer app/api/supabase/products/route.ts", "Creer app/api/supabase/solutions/route.ts", "Creer app/api/supabase/orders/route.ts", "Creer app/api/supabase/cards/route.ts", "Creer app/api/supabase/settings/route.ts", "Creer app/api/supabase/texts/route.ts", "Creer app/api/supabase/zones/route.ts"], "parallel": True},
        {"bloc": 8, "name": "Tests et Validation", "tasks": ["Lancer npm run build", "Tester chaque endpoint API avec curl", "Verifier les headers de securite", "Corriger les erreurs"], "parallel": False}
    ],
    "risks": [
        {"description": "Les 42 endpoints API retournent 404 - le build Next.js ou le middleware bloque les routes API", "probability": "HAUTE", "impact": "BLOQUANT", "mitigation": "Verifier que les fichiers route.ts sont bien dans app/api/*/route.ts, que le middleware.ts n'intercepte pas les routes API, et que le build est correct (npm run build)"},
        {"description": "Variables d'environnement manquantes (Supabase, Stripe, OpenAI)", "probability": "HAUTE", "impact": "BLOQUANT", "mitigation": "Creer .env.example et scripts/check-env.ts pour valider les variables au demarrage"},
        {"description": "Schema Supabase non initialise - les migrations SQL doivent etre appliquees", "probability": "MOYENNE", "impact": "MAJEUR", "mitigation": "Executer les migrations SQL via Supabase CLI ou tableau de bord avant de tester les endpoints"},
        {"description": "Webhook Stripe non fonctionnel sans tunnel ngrok en developpement", "probability": "MOYENNE", "impact": "MAJEUR", "mitigation": "Utiliser Stripe CLI pour forwarder les webhooks en local (stripe listen --forward-to localhost:3001/api/stripe/webhook)"},
        {"description": "Rate limiting non configure - risque d'abus sur les endpoints IA (OpenAI couteux)", "probability": "MOYENNE", "impact": "MAJEUR", "mitigation": "Implementer rate limiting des le bloc 1 avec lib/rate-limit.ts"},
        {"description": "Headers de securite manquants exposes par l'audit (CSP, HSTS, X-Frame-Options)", "probability": "HAUTE", "impact": "MINEUR", "mitigation": "Ajouter tous les headers de securite dans middleware.ts et next.config.js"}
    ],
    "estimated_files_count": 44,
    "estimated_complexity": "COMPLEXE"
}

with open('plan.json', 'w') as f:
    json.dump(plan, f, indent=2)
print('plan.json written successfully')
print(f'File size: {len(json.dumps(plan, indent=2))} bytes')
