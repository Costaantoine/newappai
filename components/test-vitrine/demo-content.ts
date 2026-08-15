/**
 * Contenu marketing générique par secteur — jamais de fait inventé (prix,
 * horaires, téléphone, adresse, créneaux). Couvre les 8 ids de `SECTORS`
 * (components/webdesign/types.ts) + un fallback `autre` pour ne jamais
 * planter si le wizard ajoute un secteur.
 */

export interface DemoSectorContent {
  /** Tagline pour la section "À propos" — `{nom}` est remplacé par le nom du commerce. */
  tagline: string
  /** 3 points forts génériques affichés dans la section takeaway (jamais prix/horaires). */
  highlights: [string, string, string]
  /** 3 services d'exemple pour le menu — nom + description, jamais de prix. */
  services: [
    { name: string; description: string },
    { name: string; description: string },
    { name: string; description: string },
  ]
}

export const DEMO_CONTENT: Record<string, DemoSectorContent> = {
  restaurant: {
    tagline:
      'Bienvenue chez {nom}, votre restaurant de confiance. Une cuisine généreuse et un accueil chaleureux, à découvrir sans plus attendre.',
    highlights: ['Cuisine généreuse', 'Accueil chaleureux', 'Produits frais'],
    services: [
      { name: 'Nos plats', description: 'Une carte qui change au fil des saisons' },
      { name: 'Menu du jour', description: 'Du frais, préparé sur place' },
      { name: 'Événements privés', description: 'Pour vos moments en famille ou entre amis' },
    ],
  },
  'nail-design': {
    tagline:
      'Bienvenue chez {nom}, votre institut de nail design. Des finitions soignées dans une ambiance apaisante.',
    highlights: ['Finitions soignées', 'Produits professionnels', 'Ambiance apaisante'],
    services: [
      { name: 'Manucure', description: 'Un soin précis pour des ongles impeccables' },
      { name: 'Pose & nail art', description: 'Des créations personnalisées, à votre image' },
      { name: 'Soins des mains', description: 'Douceur et bien-être à chaque rendez-vous' },
    ],
  },
  coiffure: {
    tagline:
      'Bienvenue chez {nom}, votre salon de coiffure. Coupe, couleur et soins dans une ambiance conviviale.',
    highlights: ['Coupe sur-mesure', 'Conseils personnalisés', 'Ambiance conviviale'],
    services: [
      { name: 'Coupe & coiffage', description: 'Un style qui vous ressemble' },
      { name: 'Coloration', description: 'Des couleurs lumineuses et durables' },
      { name: 'Soins & beauté', description: 'Pause détente et éclat retrouvé' },
    ],
  },
  artisan: {
    tagline: '{nom}, artisan à votre service. Des réalisations soignées, des délais tenus, un travail garanti.',
    highlights: ['Travail soigné', 'Délais respectés', 'Devis transparent'],
    services: [
      { name: 'Rénovation', description: 'Donnez une seconde vie à vos espaces' },
      { name: 'Installation', description: 'Pose soignée par des professionnels' },
      { name: 'Devis gratuit', description: 'Une réponse claire et rapide' },
    ],
  },
  commerce: {
    tagline: '{nom}, votre commerce de proximité. Une sélection soignée et des conseils personnalisés.',
    highlights: ['Sélection soignée', 'Conseils personnalisés', 'Service de proximité'],
    services: [
      { name: 'Nos produits', description: 'Une sélection choisie avec soin' },
      { name: 'Conseils', description: 'Une équipe à votre écoute' },
      { name: 'Commandes', description: 'Simple, rapide, fiable' },
    ],
  },
  sante: {
    tagline: '{nom}, votre espace santé et bien-être. Professionnalisme, douceur et résultats.',
    highlights: ['Suivi personnalisé', 'Professionnalisme', 'Écoute attentive'],
    services: [
      { name: 'Consultations', description: 'Un suivi personnalisé' },
      { name: 'Soins', description: 'Des protocoles adaptés à chacun' },
      { name: 'Bien-être', description: 'Prenez soin de vous' },
    ],
  },
  service: {
    tagline: '{nom}, des services simples et fiables pour votre quotidien.',
    highlights: ['Réactivité', 'Transparence', 'Accompagnement sur-mesure'],
    services: [
      { name: 'Nos prestations', description: 'Un accompagnement de A à Z' },
      { name: 'Devis gratuit', description: 'Transparent et sans engagement' },
      { name: 'Contact rapide', description: 'Une réponse sous 24h' },
    ],
  },
  autre: {
    tagline: 'Bienvenue chez {nom}. Découvrez nos services, pensés pour vous.',
    highlights: ['Qualité', 'Confiance', 'Proximité'],
    services: [
      { name: 'Nos prestations', description: 'Un savoir-faire mis à votre service' },
      { name: 'Accompagnement', description: 'Une équipe disponible et à l’écoute' },
      { name: 'Contact rapide', description: 'Une réponse simple et rapide' },
    ],
  },
}

/** Contenu générique garanti — jamais undefined même pour un id de secteur inconnu. */
export function getDemoContent(sectorId: string): DemoSectorContent {
  return DEMO_CONTENT[sectorId] ?? DEMO_CONTENT.autre
}

/** Libellés i18n — structure prête pour en/pt/es (seul `fr` est rempli, fallback fr sinon). */
export interface DemoLabels {
  navAbout: string
  navServices: string
  navGallery: string
  navBooking: string
  navContact: string
  ctaContact: string
  aboutEyebrow: string
  takeawayEyebrow: string
  takeawayCta: string
  menuEyebrow: string
  menuTitle: string
  galleryEyebrow: string
  galleryTitle: string
  bookingEyebrow: string
  bookingTitle: string
  bookingInfoTitle: string
  bookingHonestNote: string
  bookingWhatsapp: string
  contactEyebrow: string
  contactTitle: string
  contactHours: string
  contactPhone: string
  contactAddress: string
  contactMapPlaceholder: string
  footerCredit: string
  badge: string
}

const FR_LABELS: DemoLabels = {
  navAbout: 'À propos',
  navServices: 'Services',
  navGallery: 'Galerie',
  navBooking: 'Réservation',
  navContact: 'Contact',
  ctaContact: 'Nous contacter',
  aboutEyebrow: 'À propos',
  takeawayEyebrow: 'Pourquoi nous choisir',
  takeawayCta: 'Nous contacter',
  menuEyebrow: 'Nos services',
  menuTitle: 'Ce que nous proposons',
  galleryEyebrow: 'Galerie',
  galleryTitle: 'Nos réalisations',
  bookingEyebrow: 'Réservation',
  bookingTitle: 'Prendre rendez-vous',
  bookingInfoTitle: 'Informations pratiques',
  bookingHonestNote: 'Le formulaire de réservation sera disponible sur votre site final.',
  bookingWhatsapp: 'Contacter sur WhatsApp',
  contactEyebrow: 'Contact',
  contactTitle: 'Nous trouver',
  contactHours: 'Horaires',
  contactPhone: 'Téléphone',
  contactAddress: 'Adresse',
  contactMapPlaceholder: 'La carte s’affichera ici avec votre adresse réelle.',
  footerCredit: 'Développé par NewappAI',
  badge: 'DEVELOPED BY NEWAPPAI',
}

const I18N_LABELS: Record<string, DemoLabels> = {
  fr: FR_LABELS,
}

export function getDemoLabels(language?: string): DemoLabels {
  return (language && I18N_LABELS[language]) || FR_LABELS
}
