-- Seed data for development

-- Insert sample products
INSERT INTO products (title, description, price, category, active) VALUES
  ('Site Vitrine', 'Site web professionnel pour votre entreprise', 50000, 'web', true),
  ('Application Mobile', 'Application iOS et Android sur mesure', 150000, 'mobile', true),
  ('SEO Optimisation', 'Référencement naturel pour votre site', 30000, 'marketing', true),
  ('Design UI/UX', 'Design d''interface utilisateur moderne', 25000, 'design', true),
  ('Maintenance Site', 'Forfait maintenance mensuel site web', 15000, 'web', true),
  ('Formation Digitale', 'Formation aux outils numériques', 20000, 'formation', true);

-- Insert sample solutions
INSERT INTO solutions (key, fr, en, pt, es, icon, order_index, active) VALUES
  ('site_vitrine', 'Création de sites vitrines modernes et responsives', 'Modern and responsive showcase websites', 'Criação de sites vitrine modernos e responsivos', 'Creación de sitios web modernos y responsivos', 'globe', 1, true),
  ('ecommerce', 'Développement de boutiques en ligne performantes', 'High-performance e-commerce development', 'Desenvolvimento de lojas online de alto desempenho', 'Desarrollo de tiendas online de alto rendimiento', 'shopping-cart', 2, true),
  ('application', 'Applications web et mobiles sur mesure', 'Custom web and mobile applications', 'Aplicações web e mobile personalizadas', 'Aplicaciones web y móviles personalizadas', 'smartphone', 3, true),
  ('design', 'Design UI/UX et identité visuelle', 'UI/UX design and visual identity', 'Design UI/UX e identidade visual', 'Diseño UI/UX e identidad visual', 'palette', 4, true),
  ('seo', 'Optimisation SEO et marketing digital', 'SEO optimization and digital marketing', 'Otimização SEO e marketing digital', 'Optimización SEO y marketing digital', 'trending-up', 5, true),
  ('maintenance', 'Maintenance et support technique', 'Maintenance and technical support', 'Manutenção e suporte técnico', 'Mantenimiento y soporte técnico', 'tool', 6, true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('hero', '{"image_url": "/images/hero-bg.jpg", "opacity": 0.5, "brightness": 100, "overlay_opacity": 0.3, "title": "Bienvenue sur NewAppAI", "subtitle1": "Solutions digitales innovantes", "subtitle2": "Propulsez votre entreprise"}'),
  ('music', '{"accueil": {"url": "/music/accueil.mp3", "volume": 0.5}, "solutions": {"url": "/music/solutions.mp3", "volume": 0.5}, "histoire": {"url": "/music/histoire.mp3", "volume": 0.5}, "produits": {"url": "/music/produits.mp3", "volume": 0.5}, "contact": {"url": "/music/contact.mp3", "volume": 0.5}}'),
  ('sounds', '{"hover_enabled": true, "click_enabled": true, "hover_url": "/sounds/hover.mp3", "click_url": "/sounds/click.mp3"}'),
  ('general', '{"site_name": "NewAppAI", "site_description": "Hub de services multi-services", "contact_email": "contact@newappai.com", "language": "fr"}');

-- Insert sample zones
INSERT INTO zones (key, title_key, subtitle_key, badge, color, url, cta_key, newtab_key, order_index, active) VALUES
  ('accueil', 'home_title', 'home_subtitle', 'Bienvenue', 'sky', '/', 'home_cta', 'home_newtab', 1, true),
  ('solutions', 'solutions_title', 'solutions_subtitle', 'Services', 'purple', '/solutions', 'solutions_cta', 'solutions_newtab', 2, true),
  ('produits', 'products_title', 'products_subtitle', 'Produits', 'emerald', '/produits', 'products_cta', 'products_newtab', 3, true),
  ('histoire', 'story_title', 'story_subtitle', 'Notre Histoire', 'orange', '/histoire', 'story_cta', 'story_newtab', 4, true),
  ('contact', 'contact_title', 'contact_subtitle', 'Contact', 'rose', '/contact', 'contact_cta', 'contact_newtab', 5, true);

-- Insert sample texts
INSERT INTO texts (key, fr, en, pt, es, section) VALUES
  ('home_title', 'Bienvenue sur NewAppAI', 'Welcome to NewAppAI', 'Bem-vindo ao NewAppAI', 'Bienvenido a NewAppAI', 'home'),
  ('home_subtitle', 'Votre partenaire digital de confiance', 'Your trusted digital partner', 'Seu parceiro digital de confiança', 'Su socio digital de confianza', 'home'),
  ('home_cta', 'Découvrir nos services', 'Discover our services', 'Descubra nossos serviços', 'Descubra nuestros servicios', 'home'),
  ('solutions_title', 'Nos Solutions', 'Our Solutions', 'Nossas Soluções', 'Nuestras Soluciones', 'solutions'),
  ('solutions_subtitle', 'Des solutions adaptées à vos besoins', 'Solutions tailored to your needs', 'Soluções adaptadas às suas necessidades', 'Soluciones adaptadas a sus necesidades', 'solutions'),
  ('products_title', 'Nos Produits', 'Our Products', 'Nossos Produtos', 'Nuestros Productos', 'products'),
  ('products_subtitle', 'Des produits de qualité pour votre entreprise', 'Quality products for your business', 'Produtos de qualidade para sua empresa', 'Productos de calidad para su empresa', 'products'),
  ('story_title', 'Notre Histoire', 'Our Story', 'Nossa História', 'Nuestra Historia', 'story'),
  ('story_subtitle', 'Découvrez notre parcours', 'Discover our journey', 'Descubra nossa jornada', 'Descubra nuestro viaje', 'story'),
  ('contact_title', 'Contactez-nous', 'Contact Us', 'Contate-nos', 'Contáctenos', 'contact'),
  ('contact_subtitle', 'Nous sommes là pour vous aider', 'We are here to help you', 'Estamos aqui para ajudá-lo', 'Estamos aquí para ayudarle', 'contact');
