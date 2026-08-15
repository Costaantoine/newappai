/**
 * Types partagés de l'outil "Web Design 149€" — générateur de site vitrine.
 * La config remplie par le client pilote à la fois l'aperçu live, le paiement
 * et la génération du site one-page final.
 */

/** Fichier uploadé en mémoire (FileReader → base64). Aucun stockage serveur. */
export interface MediaFile {
  id: string
  dataUrl: string // base64 (image, redimensionnée) ou data URL brute (vidéo)
  type: 'image' | 'video'
  name: string
  url?: string // URL distante (démo uniquement — les uploads réels restent en base64)
}

/** Une prestation / un service vendu (liste répétable, comme les prestations Filipa). */
export interface Service {
  id: string
  name: string
  description: string
  price: string // ex: "dès 15€"
}

/** Choix de personnalisation (étape 5). Les ids référencent les palettes de palette.ts. */
export interface DesignConfig {
  backgroundId: string
  fontPairId: string
  accentId: string
  styleId: string
  customColor?: string // code hex libre (prioritaire sur l'accent de la palette si rempli)
}

/** Configuration complète du site vitrine rempli dans le wizard. */
export interface SiteConfig {
  business: {
    name: string
    sector: string
    description: string
    logo: MediaFile | null
    website?: string // site existant du client (informatif — lu pour contexte, ne remplace pas les réponses du formulaire)
  }
  services: Service[]
  gallery: MediaFile[]
  contact: {
    phone: string // téléphone / WhatsApp (un seul numéro, comme le site Filipa)
    email: string
    instagram: string
    facebook: string
    address: string
    hours: string
    socialImport?: string // URL complète Instagram/TikTok/Facebook/Pinterest → import photos+textes réels (skill social-content-import)
  }
  design: DesignConfig
  language?: string // langue du site généré (fr / pt / en / es) — défaut 'fr'
}

export const STEPS = [
  'Entreprise',
  'Services & tarifs',
  'Galerie',
  'Contact',
  'Design',
  'Récapitulatif',
] as const

export type StepId = (typeof STEPS)[number]

/** Secteurs d'activité proposés (étape 1). */
export const SECTORS: { id: string; label: string }[] = [
  { id: 'restaurant', label: 'Restaurant / Café' },
  { id: 'nail-design', label: 'Nail design / Esthétique' },
  { id: 'coiffure', label: 'Coiffure / Salon' },
  { id: 'artisan', label: 'Artisan' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'sante', label: 'Santé / Bien-être' },
  { id: 'service', label: 'Service / Profession libérale' },
  { id: 'autre', label: 'Autre' },
]

/** Langues disponibles pour le site généré (référence webolharosol = pt). */
export const LANGUAGES: { id: string; label: string }[] = [
  { id: 'fr', label: 'Français' },
  { id: 'pt', label: 'Português' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
]

/** Identifiant unique court (id stable dans la session). */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Config par défaut — design d'entrée sobre + fond noir + violet (cohérent newappai). */
export function defaultSiteConfig(): SiteConfig {
  return {
    business: {
      name: '',
      sector: 'restaurant',
      description: '',
      logo: null,
      website: '',
    },
    services: [{ id: uid(), name: '', description: '', price: '' }],
    gallery: [],
    contact: {
      phone: '',
      email: '',
      instagram: '',
      facebook: '',
      address: '',
      hours: '',
    },
    design: {
      backgroundId: 'noir',
      fontPairId: 'playfair-inter',
      accentId: 'violet',
      styleId: 'sobre',
      customColor: '',
    },
    language: 'fr',
  }
}

/** Clé localStorage qui conserve la config entre le wizard et la page de confirmation. */
export const CONFIG_STORAGE_KEY = 'newappai-webdesign-config'

/** Sauvegarde (et restaure) la config dans localStorage — indispensable pour la page succès. */
export function saveConfig(config: SiteConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch {
    // localStorage plein (grosse galerie) — on continue sans persistance
  }
}

export function loadConfig(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SiteConfig
  } catch {
    return null
  }
}
