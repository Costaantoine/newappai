const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Configuration Firebase Admin
const serviceAccount = {
  projectId: "newappai-9dd90",
  clientEmail: "firebase-adminsdk-fbsvc@newappai-9dd90.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIygtlr872PQ6u\nOGXGf5Q1uPLdFn4KtD7E7fIGOrKAFPRJj5cQhj1G7KtBXETj1hOgnffSVREWCqO5\n6z0WsPRXoQMJSExxeE/DBj6d2HfZMzfXRwEz1x/tdzyn29N2liPgR0/12P9S3IfI\ns0qDBHKqub9sUXE5ETgjjdDtrfxH3Lc0HLLtEfMQEiP+F7Eqk5uD4LHkMWD+UkR6\nKM/CQiS87+xoMRteWvAtDn1kjakQB7tyVhOn8Et6VVV4uNpDuCK2FQA92irScexN\nwvfwkQw/3ihVG0AR4YL7cDGyv8cHcYFPR0DOXKpJWDRlo5kXSYOsLrQvOBdLlZDi\nOcIs56KhAgMBAAECggEAG+0V9rekBlVppEuNxDTcTTiC9sL5Fs4I6OTbQ4iIaQ4B\nB/YjoZW6EhI6o2WM409T/YPbAvL35GPob6RLI8vKwCFRxcm7cBC2rz5AGT4RNTFN\nc/CZNzeVZjauRf5qA9VP+hKRCXV71W98pypgk6ZbuGkLOap+H9zIPRGtXFFVhDzs\nDmzw+lGHGZCjbdGhsi6gd4rY/ttTl5uKpXQ+No8OPwQz311cUEZzUKujgUvuXLzD\nx+5emC2yeatPlsLSYZa81wN7QI/XcC8QRctUdoxkeD7T34Yt8CpYLJLYJ4aZ3dUr\nN+WH0xBGdO4sETSt6UOfQY9+Y+LdorAF3dg4sYW3EQKBgQD63YZGmuVgxU3WJ3PF\nlE/zAftifPXs5Ebi92TVYTERfl6jiyIVZOkNKkSeutmYNdPq0QIjPydyBW/SSuoW\nNac/cvhiCld0rFd9VZxXdOnx5Ur7pndGppzsdQCnimTWUGxUq79VFVg7QoxBOUwY\nlx4Vvchk3KyePbDoOx4lRWYudQKBgQDM5iINoyFwFMsvaK7/5efpmuIQskvCNaYY\n4bKomXuqV79nfSsBb0xunvIVWOrCDbUwzcFKIJixQYGFQVf86qqAKYRNbQb3a0OQ\n5pSaTr97EAcGMfBpBXpVkMVK5gYjkNKloS3GIKZ5DB2CrgxQR4GNon3KcF1QSVwl\nuLcNK2e1/QKBgFxuULIlEkzUhbhZMvPikI6V9Vy1dBtDhMbNpm5kcCLk79PMSNOf\nKas7HqtpZxEJDDrhpar88vi0/h16ksN6I1RidRgSfWS0t0urxn4Gysfg1v7ft+Tl\nML6C4anZeQvp9/A+k7Gyup6jB3Bkvx/0VhZmpbZcBJINYug+F/5dkqedAoGAAid1\nOjF524TMcg4msNgI7SLMt6I4O612tpJA35blfu/3Oi5NsnEqG4uePe02Yp3kRsQT\nASWAlXR72RvLwgPxlv+YvXuk9BrzleVmsIydZLzRZhZGUcRV+epQuK3caKlQHZ+p\nLIkRVvpyoPoVdQ6bZRLNQcCWqo5q4pajjgbjyz0CgYEAjB47FU/YUG/+aUA5SHRi\n1wDIpVEl4bczmUZe2TK0wNUPnQkTs2p106QSpUV+3hQVqHB1mm0XWd9bavfdqCyK\n0AduQNrgu/UbqdlhQZ/VO6OWGcWf2YclebWvV2NQWk2RH4IqDSgNrz3bmeC7FnTs\nWqiGcCL8SwjFyJ5IXso8jBs=\n-----END PRIVATE KEY-----\n"
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Textes à insérer (excluant produits et solutions)
const textsToSeed = [
  // Navigation
  { key: 'nav_home', section: 'navigation', fr: 'Accueil', en: 'Home', pt: 'Início', es: 'Inicio' },
  { key: 'nav_solutions', section: 'navigation', fr: 'Nos Solutions', en: 'Our Solutions', pt: 'Nossas Soluções', es: 'Nuestras Soluciones' },
  { key: 'nav_about', section: 'navigation', fr: 'Notre histoire', en: 'Our Story', pt: 'Nossa História', es: 'Nuestra Historia' },
  { key: 'nav_contact', section: 'navigation', fr: 'Contact', en: 'Contact', pt: 'Contato', es: 'Contacto' },

  // Hero Section
  { key: 'hero_title', section: 'homepage', fr: 'Pilotez votre entreprise avec l\'Intelligence d\'aujourd\'hui.', en: 'Drive your business with today\'s Intelligence.', pt: 'Pilote sua empresa com a Inteligência de hoje.', es: 'Pilote su empresa con la Inteligencia de hoy.' },
  { key: 'hero_subtitle1', section: 'homepage', fr: 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.', en: 'Adopt smart solutions designed to simplify your daily life, boost your productivity and satisfy your customers.', pt: 'Adote soluções inteligentes projetadas para simplificar seu dia a dia, aumentar sua produtividade e satisfazer seus clientes.', es: 'Adopte soluciones inteligentes diseñadas para simplificar su vida diaria, aumentar su productividad y satisfacer a sus clientes.' },
  { key: 'hero_subtitle2', section: 'homepage', fr: 'Dans un monde qui s\'accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.', en: 'In an accelerating world, technology must be a driver. We create custom tools that connect your teams, automate your processes and enhance your expertise.', pt: 'Em um mundo acelerado, a tecnologia deve ser um motor. Criamos ferramentas personalizadas que conectam suas equipes, automatizam seus processos e valorizam seu saber-fazer.', es: 'En un mundo acelerado, la tecnología debe ser un motor. Creamos herramientas personalizadas que conectan a sus equipos, automatizan sus procesos y valorizan su saber hacer.' },
  { key: 'hero_cta1', section: 'homepage', fr: 'Explorer nos Solutions', en: 'Explore our Solutions', pt: 'Explorar nossas Soluções', es: 'Explorar nuestras Soluciones' },
  { key: 'hero_cta2', section: 'homepage', fr: 'Parler à un expert', en: 'Talk to an expert', pt: 'Falar com um especialista', es: 'Hablar con un experto' },

  // Expertise Section
  { key: 'expertise_title', section: 'homepage', fr: 'Nos pôles d\'Expertise', en: 'Our Areas of Expertise', pt: 'Nossos Pólos de Especialização', es: 'Nuestros Polos de Especialización' },
  { key: 'commerce_title', section: 'homepage', fr: 'Pôle Commerce', en: 'Commerce Hub', pt: 'Pólo Comércio', es: 'Polo Comercio' },
  { key: 'commerce_subtitle', section: 'homepage', fr: 'DigiSmart Solutions', en: 'DigiSmart Solutions', pt: 'DigiSmart Solutions', es: 'DigiSmart Solutions' },
  { key: 'commerce_desc', section: 'homepage', fr: 'Optimisez l\'expérience client et digitalisez vos ventes.', en: 'Optimize customer experience and digitize your sales.', pt: 'Otimize a experiência do cliente e digitalize suas vendas.', es: 'Optimice la experiencia del cliente y digitalice sus ventas.' },
  { key: 'commerce_cta', section: 'homepage', fr: 'Voir les 6 modules', en: 'View 6 modules', pt: 'Ver os 6 módulos', es: 'Ver los 6 módulos' },
  { key: 'industrie_title', section: 'homepage', fr: 'Pôle Industrie', en: 'Industry Hub', pt: 'Pólo Indústria', es: 'Polo Industria' },
  { key: 'industrie_subtitle', section: 'homepage', fr: 'Smart Factory', en: 'Smart Factory', pt: 'Smart Factory', es: 'Smart Factory' },
  { key: 'industrie_desc', section: 'homepage', fr: 'Connectez votre atelier et pilotez votre production en temps réel.', en: 'Connect your workshop and manage your production in real-time.', pt: 'Conecte sua oficina e pilote sua produção em tempo real.', es: 'Conecte su taller y pilote su producción en tiempo real.' },
  { key: 'industrie_cta', section: 'homepage', fr: 'Découvrir l\'offre', en: 'Discover the offer', pt: 'Descobrir a oferta', es: 'Descubrir la oferta' },

  // About Page
  { key: 'about_title', section: 'about', fr: 'Notre Histoire : La passion du terrain', en: 'Our Story: A passion for the field', pt: 'Nossa História: Uma paixão pelo terreno', es: 'Nuestra Historia: Una pasión por el terreno' },
  { key: 'about_subtitle', section: 'about', fr: 'Notre aventure est née d\'une envie simple : mettre la technologie au service du savoir-faire humain.', en: 'Our adventure was born from a simple desire: to put technology at the service of human expertise.', pt: 'Nossa aventura nasceu de um desejo simples: colocar a tecnologia a serviço do saber-fazer humano.', es: 'Nuestra aventura nació de un deseo simple: poner la tecnología al servicio del saber hacer humano.' },
  { key: 'about_vision_title', section: 'about', fr: 'Une vision concrète de l\'innovation', en: 'A concrete vision of innovation', pt: 'Uma visão concreta da inovação', es: 'Una visión concreta de la innovación' },
  { key: 'about_vision_desc', section: 'about', fr: 'Nous avons décidé de lancer cette entreprise pour transformer votre quotidien en une expérience plus fluide et plus moderne. Pour nous, le numérique n\'est pas là pour remplacer l\'humain, mais pour lui donner les moyens d\'aller plus loin.', en: 'We decided to start this business to transform your daily life into a smoother and more modern experience. For us, digital is not there to replace humans, but to give them the means to go further.', pt: 'Decidimos iniciar este negócio para transformar seu dia a dia em uma experiência mais fluida e moderna. Para nós, o digital não está ali para substituir o humano, mas para dar a ele os meios de ir mais longe.', es: 'Decidimos iniciar este negocio para transformar su vida diaria en una experiencia más fluida y moderna. Para nosotros, lo digital no está ahí para reemplazar al humano, sino para darle los medios de ir más lejos.' },
  { key: 'about_value1_title', section: 'about', fr: 'Une écoute active des besoins', en: 'Active listening to needs', pt: 'Uma escuta ativa das necessidades', es: 'Una escucha activa de las necesidades' },
  { key: 'about_value1_desc', section: 'about', fr: 'Nous comprenons vos enjeux car nous avons toujours travaillé au plus près des réalités de l\'entreprise. Chaque application est pensée pour être un allié naturel dans votre journée.', en: 'We understand your challenges because we have always worked closely with business realities. Each application is designed to be a natural ally in your day.', pt: 'Compreendemos seus desafios porque sempre trabalhamos próximo às realidades empresariais. Cada aplicação é pensada para ser uma aliada natural em seu dia.', es: 'Entendemos sus desafíos porque siempre hemos trabajado cerca de las realidades empresariales. Cada aplicación está diseñada para ser un aliado natural en su día.' },
  { key: 'about_value2_title', section: 'about', fr: 'L\'efficacité avant tout', en: 'Efficiency above all', pt: 'A eficiência acima de tudo', es: 'La eficiencia ante todo' },
  { key: 'about_value2_desc', section: 'about', fr: 'Nous créons des solutions directes et intuitives qui s\'intègrent immédiatement dans vos habitudes.', en: 'We create direct and intuitive solutions that immediately integrate into your habits.', pt: 'Criamos soluções diretas e intuitivas que se integram imediatamente em seus hábitos.', es: 'Creamos soluciones directas e intuitivas que se integran inmediatamente en sus hábitos.' },
  { key: 'about_value3_title', section: 'about', fr: 'Le futur avec vous', en: 'The future with you', pt: 'O futuro com você', es: 'El futuro con usted' },
  { key: 'about_value3_desc', section: 'about', fr: 'Nous sommes fiers de bâtir avec vous les outils qui font avancer vos établissements, avec l\'ambition de rendre chaque tâche plus simple et chaque journée plus productive.', en: 'We are proud to build with you the tools that move your establishments forward, with the ambition to make every task simpler and every day more productive.', pt: 'Temos orgulho de construir com você as ferramentas que fazem avançar seus estabelecimentos, com a ambição de tornar cada tarefa mais simples e cada dia mais produtivo.', es: 'Estamos orgullosos de construir con usted las herramientas que hacen avanzar sus establecimientos, con la ambición de hacer cada tarea más simple y cada día más productivo.' },

  // Contact Page
  { key: 'contact_title', section: 'contact', fr: 'Contactez l\'avenir', en: 'Contact the Future', pt: 'Contate o Futuro', es: 'Contacte el Futuro' },
  { key: 'contact_subtitle', section: 'contact', fr: 'Vous avez un projet innovant ? Une question sur nos solutions ? Notre équipe (et notre IA) est à votre écoute.', en: 'Have an innovative project? Questions about our solutions? Our team (and our AI) is listening.', pt: 'Você tem um projeto inovador? Perguntas sobre nossas soluções? Nossa equipe (e nossa IA) está ouvindo.', es: '¿Tiene un proyecto innovador? ¿Preguntas sobre nuestras soluciones? Nuestro equipo (y nuestra IA) está escuchando.' },
  { key: 'contact_name', section: 'contact', fr: 'Nom complet', en: 'Full name', pt: 'Nome completo', es: 'Nombre completo' },
  { key: 'contact_email', section: 'contact', fr: 'Email professionnel', en: 'Professional email', pt: 'Email profissional', es: 'Email profesional' },
  { key: 'contact_subject', section: 'contact', fr: 'Sujet', en: 'Subject', pt: 'Assunto', es: 'Asunto' },
  { key: 'contact_message', section: 'contact', fr: 'Votre message', en: 'Your message', pt: 'Sua mensagem', es: 'Su mensaje' },
  { key: 'contact_placeholder', section: 'contact', fr: 'Dites-nous tout...', en: 'Tell us everything...', pt: 'Conte-nos tudo...', es: 'Cuéntenos todo...' },
  { key: 'contact_send', section: 'contact', fr: 'Envoyer le message', en: 'Send message', pt: 'Enviar mensagem', es: 'Enviar mensaje' },

  // AI Assistant
  { key: 'ai_bubble', section: 'assistant', fr: 'Besoin d\'aide ? Je suis l\'IA de NewAppAI. Parlez-moi !', en: 'Need help? I\'m NewAppAI\'s AI. Talk to me!', pt: 'Precisa de ajuda? Sou a IA da NewAppAI. Fale comigo!', es: '¿Necesita ayuda? Soy la IA de NewAppAI. ¡Hable conmigo!' },

  // Footer
  { key: 'footer', section: 'footer', fr: '© 2025 NewAppAI.com — Édité par Premium à Juste Prix SAS', en: '© 2025 NewAppAI.com — Published by Premium à Juste Prix SAS', pt: '© 2025 NewAppAI.com — Editado por Premium à Juste Prix SAS', es: '© 2025 NewAppAI.com — Editado por Premium à Juste Prix SAS' }
];

async function seedTexts() {
  try {
    console.log('Début de l\'ajout des textes...');
    
    for (const text of textsToSeed) {
      const docRef = await db.collection('texts').add({
        ...text,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp()
      });
      console.log(`✅ Texte ajouté: ${text.key} (ID: ${docRef.id})`);
    }
    
    console.log(`\n🎉 ${textsToSeed.length} textes ont été ajoutés avec succès !`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des textes:', error);
  }
}

seedTexts();
