-- Insérer les textes par défaut dans la table texts de Supabase
-- À exécuter dans le SQL Editor de Supabase

INSERT INTO texts (key, fr, en, pt, es) VALUES
-- HEADER (priorité haute)
('site_logo_text', 'NewApp AI', 'NewApp AI', 'NewApp AI', 'NewApp AI'),
('nav_products', 'Produits', 'Products', 'Produtos', 'Productos'),
('nav_qrcall', 'QRcall', 'QRcall', 'QRcall', 'QRcall'),

-- FOOTER (priorité haute)
('footer_tagline', 'Solutions intelligentes pour simplifier votre quotidien.', 'Smart solutions to simplify your daily life.', 'Soluções inteligentes para simplificar o seu dia a dia.', 'Soluciones inteligentes para simplificar tu día a día.'),
('footer_quick_links', 'Liens rapides', 'Quick links', 'Links rápidos', 'Enlaces rápidos'),
('footer_link_home', 'Accueil', 'Home', 'Início', 'Inicio'),
('footer_link_solutions', 'Solutions', 'Solutions', 'Soluções', 'Soluciones'),
('footer_link_products', 'Produits', 'Products', 'Produtos', 'Productos'),
('footer_link_contact', 'Contact', 'Contact', 'Contato', 'Contacto'),
('footer_follow_us', 'Suivez-nous', 'Follow us', 'Siga-nos', 'Síguenos'),
('footer_copyright', 'Tous droits réservés.', 'All rights reserved.', 'Todos os direitos reservados.', 'Todos los derechos reservados.'),
('footer_legal', 'Mentions légales', 'Legal notices', 'Avisos legais', 'Avisos legales'),
('footer_cgv', 'CGV', 'Terms', 'Termos', 'Términos'),
('footer_privacy', 'Confidentialité', 'Privacy', 'Privacidade', 'Privacidad'),

-- CONTACT (moyenne priorité)
('contact_name', 'Nom complet', 'Full name', 'Nome completo', 'Nombre completo'),
('contact_email', 'Email professionnel', 'Professional email', 'Email profissional', 'Email profesional'),
('contact_subject', 'Sujet', 'Subject', 'Assunto', 'Asunto'),
('contact_message', 'Votre message', 'Your message', 'Sua mensagem', 'Tu mensaje'),
('contact_send', 'Envoyer le message', 'Send message', 'Enviar mensagem', 'Enviar mensaje'),
('contact_sent', 'Message envoyé !', 'Message sent!', 'Mensagem enviada!', '¡Mensaje enviado!'),
('contact_sent_desc', 'Nous vous répondrons dans les plus brefs délais.', 'We will get back to you as soon as possible.', 'Responderemos o mais breve possível.', 'Le responderemos lo antes posible.'),
('contact_subject_1', 'Demande de démo', 'Demo request', 'Pedido de demonstração', 'Solicitud de demo'),
('contact_subject_2', 'Partenariat', 'Partnership', 'Parceria', 'Asociación'),
('contact_subject_3', 'Support technique', 'Technical support', 'Suporte técnico', 'Soporte técnico'),
('contact_subject_4', 'Autre', 'Other', 'Outro', 'Otro'),

-- ABOUT (moyenne priorité)
('about_vision_desc', 'Chez NewAppAI, nous croyons que la technologie doit servir l\'humain, pas l\'inverse. Notre vision est un monde où chaque entreprise, quelle que soit sa taille, a accès à des outils intelligents pour se développer.', 'At NewAppAI, we believe technology should serve people, not the other way around.', 'Na NewAppAI, acreditamos que a tecnologia deve servir as pessoas.', 'En NewAppAI, creemos que la tecnología debe servir a las personas.'),
('about_approach_desc', 'Nous développons des solutions sur-mesure en combinant intelligence artificielle, design thinking et expertise métier pour créer des outils qui transforment réellement votre quotidien.', 'We develop tailor-made solutions combining AI, design thinking and business expertise.', 'Desenvolvemos soluções personalizadas combinando IA, design thinking e expertise.', 'Desarrollamos soluciones a medida combinando IA, design thinking y expertise.'),
('about_innovation_title', 'Innovation', 'Innovation', 'Inovação', 'Innovación'),
('about_innovation_desc', 'Toujours à la pointe des technologies pour vous offrir les meilleures solutions.', 'Always at the cutting edge of technology.', 'Sempre na vanguarda da tecnologia.', 'Siempre a la vanguardia de la tecnología.'),
('about_proximity_title', 'Proximité', 'Proximity', 'Proximidade', 'Proximidad'),
('about_proximity_desc', 'Un accompagnement personnalisé à chaque étape de votre projet.', 'Personalized support at every stage.', 'Apoio personalizado em cada etapa.', 'Acompañamiento personalizado en cada etapa.'),
('about_excellence_title', 'Excellence', 'Excellence', 'Excelência', 'Excelencia'),
('about_excellence_desc', 'Des solutions de qualité supérieure pour des résultats qui parlent d\'eux-mêmes.', 'Superior quality solutions for outstanding results.', 'Soluções de qualidade superior para resultados excepcionais.', 'Soluciones de calidad superior para resultados excepcionales.'),

-- PRODUITS (moyenne priorité)
('products_subtitle', 'Découvrez nos solutions innovantes pour votre entreprise.', 'Discover our innovative solutions for your business.', 'Descubra nossas soluções inovadoras para sua empresa.', 'Descubre nuestras soluciones innovadoras para tu empresa.'),
('products_buy', 'Acheter', 'Buy', 'Comprar', 'Comprar'),

-- SOLUTIONS (moyenne priorité)
('solutions_subtitle', 'Choisissez l\'innovation qui s\'adapte à votre métier.', 'Choose the innovation that fits your business.', 'Escolha a inovação que se adapta ao seu negócio.', 'Elige la innovación que se adapta a tu negocio.');
