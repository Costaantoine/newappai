# 🚀 Guide Création Schéma NewAppAI sur Supabase Self-Hosted

## ÉTAPE 1 : Accéder au Dashboard Supabase

**URL Dashboard :** `https://supabaseolharosol.newappai.com`

1. Ouvre ton navigateur et va sur l'URL ci-dessus
2. Connecte-toi avec tes identifiants admin

---

## ÉTAPE 2 : Créer le Schéma NewAppAI

### 2.1 Ouvrir l'éditeur SQL

Dans le dashboard Supabase :
1. Clique sur **"SQL Editor"** dans le menu de gauche
2. Clique sur **"New query"** ou **"+"**
3. Nomme ta requête : `create_schema_newappai`

### 2.2 Exécuter le SQL de création de schéma

Copie-colle ce SQL et clique sur **"Run"** :

```sql
-- =====================================================
-- CRÉATION DU SCHÉMA NEWAPPAI
-- =====================================================

-- 1. Créer le schéma
CREATE SCHEMA IF NOT EXISTS newappai;

-- 2. Donner les permissions
GRANT USAGE ON SCHEMA newappai TO anon, authenticated, service_role, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA newappai GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 3. Message de confirmation
SELECT 'Schéma newappai créé avec succès!' as status;
```

---

## ÉTAPE 3 : Créer les Tables

### 3.1 Ouvrir une nouvelle requête SQL

1. Clique sur **"New query"**
2. Nomme : `create_tables_newappai`

### 3.2 Exécuter le SQL complet des tables

Copie-colle ce SQL complet et clique sur **"Run"** :

```sql
-- =====================================================
-- TABLES NEWAPPAI
-- =====================================================

-- TABLE DES PARAMÈTRES (Settings)
CREATE TABLE IF NOT EXISTS newappai.settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_id ON newappai.settings(id);

-- TABLE DES TEXTES (Traductions)
CREATE TABLE IF NOT EXISTS newappai.texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    fr TEXT NOT NULL DEFAULT '',
    en TEXT DEFAULT '',
    pt TEXT DEFAULT '',
    es TEXT DEFAULT '',
    section TEXT DEFAULT 'general',
    type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'content',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_texts_key ON newappai.texts(key);
CREATE INDEX IF NOT EXISTS idx_texts_section ON newappai.texts(section);

-- TABLE DES ZONES
CREATE TABLE IF NOT EXISTS newappai.zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    title_key TEXT NOT NULL,
    subtitle_key TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    color TEXT DEFAULT 'sky',
    url TEXT DEFAULT '',
    cta_key TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zones_key ON newappai.zones(key);
CREATE INDEX IF NOT EXISTS idx_zones_order ON newappai.zones("order");
CREATE INDEX IF NOT EXISTS idx_zones_active ON newappai.zones(active);

-- TABLE DES PRODUITS
CREATE TABLE IF NOT EXISTS newappai.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL,
    images TEXT DEFAULT '[]',
    category TEXT DEFAULT '',
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON newappai.products(active);
CREATE INDEX IF NOT EXISTS idx_products_order ON newappai.products("order");
CREATE INDEX IF NOT EXISTS idx_products_category ON newappai.products(category);

-- TABLE DES CARTES DE ZONES
CREATE TABLE IF NOT EXISTS newappai.zone_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES newappai.zones(id) ON DELETE CASCADE,
    title_key TEXT NOT NULL,
    description_key TEXT DEFAULT '',
    badge_key TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zone_cards_zone_id ON newappai.zone_cards(zone_id);
CREATE INDEX IF NOT EXISTS idx_zone_cards_order ON newappai.zone_cards("order");
CREATE INDEX IF NOT EXISTS idx_zone_cards_active ON newappai.zone_cards(active);

SELECT 'Tables créées avec succès!' as status;
```

---

## ÉTAPE 4 : Créer les Triggers et Fonctions

### 4.1 Nouvelle requête SQL
Nom : `create_triggers_newappai`

```sql
-- Fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION newappai.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON newappai.settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON newappai.settings
    FOR EACH ROW
    EXECUTE FUNCTION newappai.update_updated_at_column();

DROP TRIGGER IF EXISTS update_texts_updated_at ON newappai.texts;
CREATE TRIGGER update_texts_updated_at
    BEFORE UPDATE ON newappai.texts
    FOR EACH ROW
    EXECUTE FUNCTION newappai.update_updated_at_column();

DROP TRIGGER IF EXISTS update_zones_updated_at ON newappai.zones;
CREATE TRIGGER update_zones_updated_at
    BEFORE UPDATE ON newappai.zones
    FOR EACH ROW
    EXECUTE FUNCTION newappai.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON newappai.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON newappai.products
    FOR EACH ROW
    EXECUTE FUNCTION newappai.update_updated_at_column();

DROP TRIGGER IF EXISTS update_zone_cards_updated_at ON newappai.zone_cards;
CREATE TRIGGER update_zone_cards_updated_at
    BEFORE UPDATE ON newappai.zone_cards
    FOR EACH ROW
    EXECUTE FUNCTION newappai.update_updated_at_column();

SELECT 'Triggers créés avec succès!' as status;
```

---

## ÉTAPE 5 : Activer RLS et Créer les Policies

### 5.1 Nouvelle requête SQL
Nom : `setup_rls_newappai`

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE newappai.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.zone_cards ENABLE ROW LEVEL SECURITY;

-- Policies : Tout le monde peut lire
DROP POLICY IF EXISTS "Allow anonymous read" ON newappai.settings;
CREATE POLICY "Allow anonymous read" ON newappai.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous read" ON newappai.texts;
CREATE POLICY "Allow anonymous read" ON newappai.texts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous read" ON newappai.zones;
CREATE POLICY "Allow anonymous read" ON newappai.zones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous read" ON newappai.products;
CREATE POLICY "Allow anonymous read" ON newappai.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous read" ON newappai.zone_cards;
CREATE POLICY "Allow anonymous read" ON newappai.zone_cards FOR SELECT USING (true);

SELECT 'RLS activé avec succès!' as status;
```

---

## ÉTAPE 6 : Insérer les Données par Défaut

### 6.1 Nouvelle requête SQL
Nom : `insert_defaults_newappai`

```sql
-- Settings par défaut
INSERT INTO newappai.settings (id, data) VALUES ('main', '{
  "site": {
    "logo_text": "NewAppAI",
    "logo_image_url": "",
    "primary_color": "#0ea5e9",
    "secondary_color": "#6366f1",
    "accent_color": "#10b981"
  },
  "hero": {
    "enabled": true,
    "image_url": "",
    "opacity": 40,
    "brightness": 60,
    "overlay_opacity": 0,
    "overlay_color": "#000000"
  },
  "header": {
    "style": "glass",
    "transparent": false,
    "blur": true,
    "blur_amount": 10,
    "background_opacity": 80,
    "show_search": true,
    "show_cart": true,
    "show_language": true,
    "sticky": true,
    "shadow": true
  },
  "footer": {
    "enabled": true,
    "style": "dark",
    "background_color": "#1e293b",
    "text_color": "#ffffff",
    "show_socials": true,
    "show_links": true,
    "show_newsletter": true,
    "show_copyright": true,
    "copyright_text": "© 2024 NewAppAI. Tous droits réservés."
  },
  "buttons": {
    "primary_color": "#0ea5e9",
    "secondary_color": "#6366f1",
    "border_radius": 8,
    "hover_effect": "brightness",
    "transition_duration": 300
  },
  "audio": {
    "enabled": false,
    "file_url": "",
    "volume": 30,
    "muted": false,
    "loop": true,
    "autoplay": false
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Textes par défaut
INSERT INTO newappai.texts (key, fr, en, pt, es, section, type) VALUES
('hero_title', 'Pilotez votre entreprise avec l''Intelligence d''aujourd''hui.', 'Pilot your business with today''s Intelligence.', 'Pilote o seu negócio com a Inteligência de hoje.', 'Pilote su negocio con la Inteligencia de hoy.', 'home', 'hero'),
('hero_subtitle1', 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.', 'Adopt intelligent solutions designed to simplify your daily life, boost your productivity and satisfy your customers.', 'Adote soluções inteligentes projetadas para simplificar o seu dia a dia, aumentar a sua produtividade e satisfazer os seus clientes.', 'Adopte soluciones inteligentes diseñadas para simplificar su vida diaria, aumentar su productividad y satisfacer a sus clientes.', 'home', 'hero'),
('hero_subtitle2', 'Dans un monde qui s''accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.', 'In an accelerating world, technology must be an engine. We create tailor-made tools that connect your teams, automate your processes and enhance your know-how.', 'Num mundo que acelera, a tecnologia deve ser um motor. Criamos ferramentas sob medida que conectam suas equipes, automatizam seus processos e valorizam seu know-how.', 'En un mundo que acelera, la tecnología debe ser un motor. Creamos herramientas a medida que conectan a sus equipos, automatizan sus procesos y valoran su know-how.', 'home', 'hero'),
('hero_cta1', 'Explorer nos Solutions', 'Explore our Solutions', 'Explore as nossas Soluções', 'Explore nuestras Soluciones', 'home', 'hero'),
('hero_cta2', 'Parler à un expert', 'Talk to an expert', 'Fale com um especialista', 'Hablar con un experto', 'home', 'hero')
ON CONFLICT (key) DO NOTHING;

SELECT 'Données par défaut insérées avec succès!' as status;
```

---

## ÉTAPE 7 : Créer le Bucket Storage

### Dans le Dashboard Supabase :

1. Va dans **"Storage"** dans le menu de gauche
2. Clique sur **"New bucket"**
3. Nom du bucket : `newappai-media`
4. Coche **"Public bucket"** ✅
5. Clique sur **"Create bucket"**

### Créer les Policies du bucket :

1. Clique sur le bucket `newappai-media`
2. Va dans l'onglet **"Policies"**
3. Clique sur **"Add policy"**

**Policy 1 - Lecture publique :**
- Policy name : `Public Read`
- Allowed operation : `SELECT`
- Target roles : `anon`, `authenticated`
- Policy definition : `true`

**Policy 2 - Upload authentifié :**
- Policy name : `Authenticated Upload`
- Allowed operation : `INSERT`
- Target roles : `authenticated`
- Policy definition : `true`

**Policy 3 - Suppression authentifié :**
- Policy name : `Authenticated Delete`
- Allowed operation : `DELETE`
- Target roles : `authenticated`
- Policy definition : `true`

---

## ÉTAPE 8 : Récupérer les Clés API

### Dans le Dashboard Supabase :

1. Va dans **"Project Settings"** (icône ⚙️ en bas à gauche)
2. Clique sur **"API"** dans le menu
3. Copie ces valeurs :

**Clé Anon (publique) :**
- URL : `https://supabaseolharosol.newappai.com`
- anon public : copie la clé longue commençant par `eyJhbGci...`

**Clé Service Role (secrète) :**
- service_role : copie la clé longue (NE JAMAIS EXPOSER CETTE CLÉ)

---

## ÉTAPE 9 : Mettre à jour les Variables d'Environnement

### Éditer le fichier `.env.local` :

```bash
# Supabase NewAppAI Instance
NEWAPPAI_SUPABASE_URL="https://supabaseolharosol.newappai.com"
NEWAPPAI_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."  # Ta clé anon ici
NEWAPPAI_SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIs..."  # Ta clé service_role ici
```

---

## ✅ VÉRIFICATION

### Test rapide dans SQL Editor :

```sql
-- Vérifier que tout est créé
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'newappai';

-- Vérifier les données
SELECT * FROM newappai.settings;
SELECT * FROM newappai.texts;
```

Si tu vois les tables et les données → **C'est bon !** 🎉

---

## 🚀 Redémarrer le serveur

```bash
npm run dev
```

Et voilà ! Ton projet NewAppAI est maintenant connecté à Supabase avec persistance totale des données ! 🎊
