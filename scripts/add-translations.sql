-- ==========================================================
-- Script de traduction BDD — Ajout des traductions EN/PT/ES
-- ==========================================================
-- Usage: psql "$DATABASE_URL" -f scripts/add-translations.sql

-- Mise à jour des textes existants ou création s'ils n'existent pas
-- Basé sur les clés utilisées dans app/page.tsx

-- ===== TEXTS PRINCIPAUX =====
INSERT INTO "Text" (id, key, fr, en, pt, es, section)
VALUES
  -- Hero / Expertise
  (gen_random_uuid(), 'expertise_title', 'Nos pôles d''Expertise', 'Our Areas of Expertise', 'Nossos Pólos de Especialização', 'Nuestros Polos de Especialización', 'home'),
  (gen_random_uuid(), 'products_title', 'Nos Produits', 'Our Products', 'Nossos Produtos', 'Nuestros Productos', 'home'),

  -- Zone: Commerce
  (gen_random_uuid(), 'commerce_title', 'Pôle Commerce', 'Commerce Hub', 'Pólo Comércio', 'Polo Comercio', 'zones'),
  (gen_random_uuid(), 'commerce_subtitle', 'DigiSmart Solutions', 'DigiSmart Solutions', 'DigiSmart Solutions', 'DigiSmart Solutions', 'zones'),
  (gen_random_uuid(), 'commerce_desc', 'Optimisez l''expérience client et digitalisez vos ventes avec nos solutions connectées.', 'Optimize customer experience and digitize your sales with our connected solutions.', 'Otimize a experiência do cliente e digitalize suas vendas com nossas soluções conectadas.', 'Optimice la experiencia del cliente y digitalice sus ventas con nuestras soluciones conectadas.', 'zones'),
  (gen_random_uuid(), 'commerce_cta', 'Voir les 6 modules', 'View all 6 modules', 'Ver os 6 módulos', 'Ver los 6 módulos', 'zones'),

  -- Zone: Industrie
  (gen_random_uuid(), 'industrie_title', 'Pôle Industrie', 'Industry Hub', 'Pólo Indústria', 'Polo Industria', 'zones'),
  (gen_random_uuid(), 'industrie_subtitle', 'Smart Factory', 'Smart Factory', 'Smart Factory', 'Smart Factory', 'zones'),
  (gen_random_uuid(), 'industrie_desc', 'Connectez votre atelier et pilotez votre production en temps réel.', 'Connect your workshop and manage your production in real-time.', 'Conecte sua oficina e pilote sua produção em tempo real.', 'Conecte su taller y gestione su producción en tiempo real.', 'zones'),
  (gen_random_uuid(), 'industrie_cta', 'Découvrir l''offre', 'Discover the offer', 'Descobrir a oferta', 'Descubrir la oferta', 'zones'),

  -- Zone: Comptabilité
  (gen_random_uuid(), 'comptabilite_title', 'Pôle Comptabilité', 'Accounting Hub', 'Pólo Contabilidade', 'Polo Contabilidad', 'zones'),
  (gen_random_uuid(), 'comptabilite_subtitle', 'Gestion Financière', 'Financial Management', 'Gestão Financeira', 'Gestión Financiera', 'zones'),
  (gen_random_uuid(), 'comptabilite_desc', 'Automatisez votre comptabilité et suivez vos finances en temps réel.', 'Automate your accounting and track your finances in real-time.', 'Automatize sua contabilidade e acompanhe suas finanças em tempo real.', 'Automatice su contabilidad y controle sus finanzas en tiempo real.', 'zones'),
  (gen_random_uuid(), 'comptabilite_cta', 'Découvrir', 'Discover', 'Descobrir', 'Descubrir', 'zones'),

  -- Zone: Droit
  (gen_random_uuid(), 'droit_title', 'Pôle Droit', 'Legal Hub', 'Pólo Direito', 'Polo Derecho', 'zones'),
  (gen_random_uuid(), 'droit_subtitle', 'Solutions Juridiques', 'Legal Solutions', 'Soluções Jurídicas', 'Soluciones Jurídicas', 'zones'),
  (gen_random_uuid(), 'droit_desc', 'Simplifiez la gestion juridique de votre entreprise avec nos outils numériques.', 'Simplify your company''s legal management with our digital tools.', 'Simplifique a gestão jurídica da sua empresa com nossas ferramentas digitais.', 'Simplifique la gestión jurídica de su empresa con nuestras herramientas digitales.', 'zones'),
  (gen_random_uuid(), 'droit_cta', 'Découvrir', 'Discover', 'Descobrir', 'Descubrir', 'zones'),

  -- Zone: Web Design
  (gen_random_uuid(), 'webdesign_title', 'Pôle Web Design', 'Web Design Hub', 'Pólo Web Design', 'Polo Web Design', 'zones'),
  (gen_random_uuid(), 'webdesign_subtitle', 'Création Digitale', 'Digital Creation', 'Criação Digital', 'Creación Digital', 'zones'),
  (gen_random_uuid(), 'webdesign_desc', 'Donnez vie à votre marque avec des designs modernes et percutants.', 'Bring your brand to life with modern and impactful designs.', 'Dê vida à sua marca com designs modernos e impactantes.', 'Dé vida a su marca con diseños modernos e impactantes.', 'zones'),
  (gen_random_uuid(), 'webdesign_cta', 'Voir nos créations', 'View our creations', 'Ver nossas criações', 'Ver nuestras creaciones', 'zones'),

  -- Zone: Outils & Services
  (gen_random_uuid(), 'outils-services_title', 'Outils & Services', 'Tools & Services', 'Ferramentas & Serviços', 'Herramientas & Servicios', 'zones'),
  (gen_random_uuid(), 'outils-services_subtitle', 'Boîte à Outils', 'Toolbox', 'Caixa de Ferramentas', 'Caja de Herramientas', 'zones'),
  (gen_random_uuid(), 'outils-services_desc', 'Découvrez nos outils complémentaires pour booster votre productivité.', 'Discover our complementary tools to boost your productivity.', 'Descubra nossas ferramentas complementares para aumentar sua produtividade.', 'Descubra nuestras herramientas complementarias para aumentar su productividad.', 'zones'),
  (gen_random_uuid(), 'outils-services_cta', 'Explorer', 'Explore', 'Explorar', 'Explorar', 'zones'),

  -- Zone: À tester
  (gen_random_uuid(), 'a-tester_title', 'Tester les nouveautés', 'Try the latest', 'Testar as novidades', 'Probar las novedades', 'zones'),
  (gen_random_uuid(), 'a-tester_subtitle', 'Nouveautés en phase de test', 'New features in beta', 'Novidades em fase de teste', 'Novedades en fase de prueba', 'zones'),
  (gen_random_uuid(), 'a-tester_desc', 'Testez nos fonctionnalités en avant-première et participez à leur amélioration.', 'Test our features early and help us improve them.', 'Teste nossos recursos em primeira mão e participe de sua melhoria.', 'Pruebe nuestras funciones en primicia y participe en su mejora.', 'zones'),
  (gen_random_uuid(), 'a-tester_cta', 'Tester maintenant', 'Try now', 'Testar agora', 'Probar ahora', 'zones')

ON CONFLICT (key) DO UPDATE SET
  en = EXCLUDED.en,
  pt = EXCLUDED.pt,
  es = EXCLUDED.es,
  section = EXCLUDED.section;

-- ===== MISE À JOUR DES ZONES =====
-- Si les zones existent déjà, leurs title_key/subtitle_key pointent vers les textes ci-dessus
-- (géré via la table Text, pas besoin de modifier zones)

-- ===== HERO TEXTS (Settings JSON) =====
-- Les hero_texts sont stockés dans le champ JSON "data" de la table settings (id='main')
-- Mise à jour via l'API settings, ou directement en SQL :
-- UPDATE settings SET data = jsonb_set(data, '{hero_texts}', '{
--   "title": {"fr": "...", "en": "...", "pt": "...", "es": "..."},
--   "subtitle": {"fr": "...", "en": "...", "pt": "...", "es": "..."},
--   "subtitle2": {"fr": "...", "en": "...", "pt": "...", "es": "..."},
--   "cta1": {"fr": "...", "en": "...", "pt": "...", "es": "..."},
--   "cta2": {"fr": "...", "en": "...", "pt": "...", "es": "..."}
-- }') WHERE id = 'main';

-- ===== SOLUTIONS =====
-- Les traductions des solutions sont dans la table "Solution" via Prisma
-- Les clés de solution sont déjà dans l'interface page.tsx

-- ===== CONTACT =====
INSERT INTO "Text" (id, key, fr, en, pt, es, section)
VALUES
  (gen_random_uuid(), 'solutions_title', 'Des outils intelligents pour chaque étape de votre activité.', 'Smart tools for every stage of your business.', 'Ferramentas inteligentes para cada etapa da sua atividade.', 'Herramientas inteligentes para cada etapa de su actividad.', 'solutions'),
  (gen_random_uuid(), 'solutions_subtitle', 'Choisissez l''innovation qui s''adapte à votre métier.', 'Choose the innovation that fits your business.', 'Escolha a inovação que se adapta ao seu negócio.', 'Elija la innovación que se adapta a su negocio.', 'solutions'),
  (gen_random_uuid(), 'contact_title', 'Contactez l''avenir', 'Contact the Future', 'Contate o Futuro', 'Contacte el Futuro', 'contact'),
  (gen_random_uuid(), 'contact_subtitle', 'Vous avez un projet innovant ? Notre équipe (et notre IA) est à votre écoute.', 'Have an innovative project? Our team (and our AI) is listening.', 'Tem um projeto inovador? Nossa equipe (e nossa IA) está ouvindo.', '¿Tiene un proyecto innovador? Nuestro equipo (y nuestra IA) está escuchando.', 'contact')
ON CONFLICT (key) DO UPDATE SET
  en = EXCLUDED.en,
  pt = EXCLUDED.pt,
  es = EXCLUDED.es;

-- ===== PRODUCT DESCRIPTIONS (titles et descriptions) =====
-- Les produits (Product) ont title et description comme JSON avec fr/en/pt/es
-- Mise à jour via l'admin API

-- ===== ZONE CARDS translations =====
-- Les cartes de zones ont des title_key et description_key qui pointent vers la table Text
-- Si de nouvelles cartes sont ajoutées, leurs clés seront automatiquement traduites
