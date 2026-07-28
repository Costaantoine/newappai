-- =====================================================
-- SCHÉMA NEWAPPAI - INITIALISATION COMPLÈTE
-- Instance: https://supabaseolharosol.newappai.com
-- =====================================================

-- 1. CRÉATION DU SCHÉMA
CREATE SCHEMA IF NOT EXISTS newappai;

-- 2. PERMISSIONS
GRANT USAGE ON SCHEMA newappai TO anon, authenticated, service_role, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA newappai GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 3. TABLE DES PARAMÈTRES (Settings)
CREATE TABLE IF NOT EXISTS newappai.settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index sur settings
CREATE INDEX IF NOT EXISTS idx_settings_id ON newappai.settings(id);

-- 4. TABLE DES TEXTES (Traductions)
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

-- Index sur texts
CREATE INDEX IF NOT EXISTS idx_texts_key ON newappai.texts(key);
CREATE INDEX IF NOT EXISTS idx_texts_section ON newappai.texts(section);

-- 5. TABLE DES ZONES
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

-- Index sur zones
CREATE INDEX IF NOT EXISTS idx_zones_key ON newappai.zones(key);
CREATE INDEX IF NOT EXISTS idx_zones_order ON newappai.zones("order");
CREATE INDEX IF NOT EXISTS idx_zones_active ON newappai.zones(active);

-- 6. TABLE DES PRODUITS
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

-- Index sur products
CREATE INDEX IF NOT EXISTS idx_products_active ON newappai.products(active);
CREATE INDEX IF NOT EXISTS idx_products_order ON newappai.products("order");
CREATE INDEX IF NOT EXISTS idx_products_category ON newappai.products(category);

-- 7. TABLE DES CARTES DE ZONES (Zone Cards)
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

-- Index sur zone_cards
CREATE INDEX IF NOT EXISTS idx_zone_cards_zone_id ON newappai.zone_cards(zone_id);
CREATE INDEX IF NOT EXISTS idx_zone_cards_order ON newappai.zone_cards("order");
CREATE INDEX IF NOT EXISTS idx_zone_cards_active ON newappai.zone_cards(active);

-- 8. FONCTION DE MISE À JOUR AUTOMATIQUE
CREATE OR REPLACE FUNCTION newappai.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. TRIGGERS POUR UPDATED_AT
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

-- 10. DONNÉES PAR DÉFAUT (Settings)
INSERT INTO newappai.settings (id, data) VALUES ('main', '{
  "site": {
    "logo_text": "NewAppAI",
    "logo_image_url": "",
    "favicon_url": "",
    "primary_color": "#0ea5e9",
    "secondary_color": "#6366f1",
    "accent_color": "#10b981",
    "background_color": "#0f172a",
    "text_color": "#ffffff",
    "text_secondary_color": "#94a3b8"
  },
  "hero": {
    "enabled": true,
    "image_url": "",
    "video_url": "",
    "opacity": 100,
    "brightness": 110,
    "overlay_opacity": 0,
    "overlay_color": "#000000",
    "effect_glow": false,
    "effect_glow_color": "#0ea5e9",
    "effect_particles": false,
    "effect_gradient": false,
    "gradient_start": "#0ea5e9",
    "gradient_end": "#6366f1"
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

-- 11. DONNÉES PAR DÉFAUT (Textes Hero)
INSERT INTO newappai.texts (key, fr, en, pt, es, section, type) VALUES
('hero_title', 'Pilotez votre entreprise avec l''Intelligence d''aujourd''hui.', 'Pilot your business with today''s Intelligence.', 'Pilote o seu negócio com a Inteligência de hoje.', 'Pilote su negocio con la Inteligencia de hoy.', 'home', 'hero'),
('hero_subtitle1', 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.', 'Adopt intelligent solutions designed to simplify your daily life, boost your productivity and satisfy your customers.', 'Adote soluções inteligentes projetadas para simplificar o seu dia a dia, aumentar a sua produtividade e satisfazer os seus clientes.', 'Adopte soluciones inteligentes diseñadas para simplificar su vida diaria, aumentar su productividad y satisfacer a sus clientes.', 'home', 'hero'),
('hero_subtitle2', 'Dans un monde qui s''accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.', 'In an accelerating world, technology must be an engine. We create tailor-made tools that connect your teams, automate your processes and enhance your know-how.', 'Num mundo que acelera, a tecnologia deve ser um motor. Criamos ferramentas sob medida que conectam suas equipes, automatizam seus processos e valorizam seu know-how.', 'En un mundo que acelera, la tecnología debe ser un motor. Creamos herramientas a medida que conectan a sus equipos, automatizan sus procesos y valoran su know-how.', 'home', 'hero'),
('hero_cta1', 'Explorer nos Solutions', 'Explore our Solutions', 'Explore as nossas Soluções', 'Explore nuestras Soluciones', 'home', 'hero'),
('hero_cta2', 'Parler à un expert', 'Talk to an expert', 'Fale com um especialista', 'Hablar con un experto', 'home', 'hero')
ON CONFLICT (key) DO NOTHING;

-- 12. ACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE newappai.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newappai.zone_cards ENABLE ROW LEVEL SECURITY;

-- 13. POLITIQUES RLS (Tout le monde peut lire, seul service_role peut modifier)
CREATE POLICY "Allow anonymous read" ON newappai.settings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON newappai.texts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON newappai.zones FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON newappai.products FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON newappai.zone_cards FOR SELECT USING (true);

-- 14. STORAGE BUCKET POUR MÉDIAS
-- Note: Les buckets storage doivent être créés via l'interface Supabase ou l'API Storage
-- Créer un bucket "newappai-media" avec les policies suivantes:
-- - Allow public read access
-- - Allow authenticated uploads
-- - Allow authenticated deletes

-- =====================================================
-- INSTALLATION TERMINÉE
-- =====================================================
