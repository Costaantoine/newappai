/**
 * Palettes de personnalisation de l'outil "Web Design 199€".
 * Chaque choix de l'étape 5 (fond / polices / accent / style) est résolu
 * en un thème CSS complet via buildTheme(), consommé par l'aperçu live
 * et par la génération du site final.
 */

export interface BackgroundOption {
  id: string
  label: string
  swatch: string
  dark: boolean // fond sombre → textes clairs, boutons accent plein
  bg: string // fond principal
  text: string // texte principal
  muted: string // texte secondaire
  alt: string // fond de section alternée
  card: string // fond des cartes
  border: string // bordures
  sectionDark: string // bande sombre (services / prix / réservation)
  sectionDarkText: string // texte sur la bande sombre
  footer: string
}

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'noir',
    label: 'Noir',
    swatch: '#000000',
    dark: true,
    bg: '#000000',
    text: '#f5f5f7',
    muted: '#9ca3af',
    alt: '#0b0b0e',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.14)',
    sectionDark: '#0f0f13',
    sectionDarkText: '#f5f5f7',
    footer: '#0a0a0d',
  },
  {
    id: 'blanc',
    label: 'Blanc',
    swatch: '#ffffff',
    dark: false,
    bg: '#ffffff',
    text: '#1d1d1f',
    muted: '#6b7280',
    alt: '#f5f5f7',
    card: '#fafafa',
    border: '#e5e7eb',
    sectionDark: '#17151a',
    sectionDarkText: '#f5f5f7',
    footer: '#17151a',
  },
  {
    id: 'gris-clair',
    label: 'Gris clair',
    swatch: '#f5f5f7',
    dark: false,
    bg: '#f5f5f7',
    text: '#1d1d1f',
    muted: '#6b7280',
    alt: '#ffffff',
    card: '#ffffff',
    border: '#e5e7eb',
    sectionDark: '#17151a',
    sectionDarkText: '#f5f5f7',
    footer: '#17151a',
  },
  {
    id: 'beige',
    label: 'Beige',
    swatch: '#faf9f6',
    dark: false,
    bg: '#faf9f6',
    text: '#2b2730',
    muted: '#6b6570',
    alt: '#f1eee7',
    card: '#ffffff',
    border: '#ece7e0',
    sectionDark: '#211f26',
    sectionDarkText: '#f5f5f7',
    footer: '#211f26',
  },
  {
    id: 'creme',
    label: 'Crème',
    swatch: '#fffdf5',
    dark: false,
    bg: '#fffdf5',
    text: '#2b2730',
    muted: '#6b6570',
    alt: '#f8f3e3',
    card: '#ffffff',
    border: '#efe9d8',
    sectionDark: '#211f26',
    sectionDarkText: '#f5f5f7',
    footer: '#211f26',
  },
  {
    id: 'bleu-nuit',
    label: 'Bleu nuit',
    swatch: '#0a0f1e',
    dark: true,
    bg: '#0a0f1e',
    text: '#e2e8f0',
    muted: '#94a3b8',
    alt: '#0d1326',
    card: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.16)',
    sectionDark: '#0f1528',
    sectionDarkText: '#e2e8f0',
    footer: '#0b1020',
  },
  {
    id: 'vert-sapin',
    label: 'Vert sapin',
    swatch: '#0d1a12',
    dark: true,
    bg: '#0d1a12',
    text: '#e7f0ea',
    muted: '#9fb3a6',
    alt: '#102016',
    card: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.16)',
    sectionDark: '#112318',
    sectionDarkText: '#e7f0ea',
    footer: '#0e1b13',
  },
  {
    id: 'bordeaux',
    label: 'Bordeaux',
    swatch: '#1a0a0c',
    dark: true,
    bg: '#1a0a0c',
    text: '#f3e8e9',
    muted: '#c0a0a4',
    alt: '#210d10',
    card: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.16)',
    sectionDark: '#241015',
    sectionDarkText: '#f3e8e9',
    footer: '#1e0c0f',
  },
]

export interface FontPair {
  id: string
  label: string
  heading: string
  body: string
  googleHref: string
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'playfair-inter',
    label: 'Playfair Display + Inter',
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'poppins-opensans',
    label: 'Poppins + Open Sans',
    heading: "'Poppins', sans-serif",
    body: "'Open Sans', sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap',
  },
  {
    id: 'montserrat-lato',
    label: 'Montserrat + Lato',
    heading: "'Montserrat', sans-serif",
    body: "'Lato', sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&display=swap',
  },
  {
    id: 'merriweather-roboto',
    label: 'Merriweather + Roboto',
    heading: "'Merriweather', Georgia, serif",
    body: "'Roboto', system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Roboto:wght@300;400;500;700&display=swap',
  },
  {
    id: 'dm-serif-dmsans',
    label: 'DM Serif Display + DM Sans',
    heading: "'DM Serif Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;700&display=swap',
  },
]

export interface AccentOption {
  id: string
  label: string
  hex: string // boutons / éléments pleins
  onLight: string // variante foncée utilisée comme texte d'accent sur fond clair
}

export const ACCENTS: AccentOption[] = [
  { id: 'or', label: 'Doré', hex: '#d4af37', onLight: '#a8842f' },
  { id: 'violet', label: 'Violet', hex: '#8b5cf6', onLight: '#7c3aed' },
  { id: 'rose', label: 'Rose', hex: '#ec4899', onLight: '#db2777' },
  { id: 'emeraude', label: 'Émeraude', hex: '#10b981', onLight: '#059669' },
  { id: 'bleu', label: 'Bleu', hex: '#3b82f6', onLight: '#2563eb' },
  { id: 'rouge', label: 'Rouge', hex: '#ef4444', onLight: '#dc2626' },
  { id: 'ambre', label: 'Ambre', hex: '#f59e0b', onLight: '#d97706' },
]

export interface StylePreset {
  id: string
  label: string
  description: string
  radius: string // border-radius des cartes/boutons
  headingWeight: string
  letterSpacing: string
  uppercase: boolean // eyebrow en capitales espacées (style sobre/audacieux)
}

export const STYLES: StylePreset[] = [
  {
    id: 'sobre',
    label: 'Sobre & élégant',
    description: 'Typographie légère, coins arrondis, raffiné',
    radius: '20px',
    headingWeight: '400',
    letterSpacing: '0.02em',
    uppercase: true,
  },
  {
    id: 'moderne',
    label: 'Moderne',
    description: 'Netteté, équilibre, couleurs franches',
    radius: '12px',
    headingWeight: '600',
    letterSpacing: '0em',
    uppercase: false,
  },
  {
    id: 'audacieux',
    label: 'Audacieux',
    description: 'Gros titres, angles nets, fort impact',
    radius: '4px',
    headingWeight: '800',
    letterSpacing: '-0.02em',
    uppercase: false,
  },
]

export interface SiteTheme {
  bg: string
  text: string
  muted: string
  alt: string
  card: string
  border: string
  sectionDark: string
  sectionDarkText: string
  footer: string
  dark: boolean
  accent: string // boutons / pleins
  accentText: string // textes d'accent (eyebrows, prix) — adapté au contraste
  headingFont: string
  bodyFont: string
  radius: string
  headingWeight: string
  letterSpacing: string
  uppercaseEyebrow: boolean
  fontsHref: string
}

/** Résout la config design en un thème CSS complet. */
export function buildTheme(
  design: { backgroundId: string; fontPairId: string; accentId: string; styleId: string; customColor?: string },
): SiteTheme {
  const bg = BACKGROUNDS.find((b) => b.id === design.backgroundId) || BACKGROUNDS[0]
  const font = FONT_PAIRS.find((f) => f.id === design.fontPairId) || FONT_PAIRS[0]
  const accent = ACCENTS.find((a) => a.id === design.accentId) || ACCENTS[0]
  const style = STYLES.find((s) => s.id === design.styleId) || STYLES[0]
  const customColor = design.customColor?.trim() || null
  const accentHex = customColor || accent.hex

  return {
    bg: bg.bg,
    text: bg.text,
    muted: bg.muted,
    alt: bg.alt,
    card: bg.card,
    border: bg.border,
    sectionDark: bg.sectionDark,
    sectionDarkText: bg.sectionDarkText,
    footer: bg.footer,
    dark: bg.dark,
    accent: accentHex,
    accentText: bg.dark ? accentHex : (customColor || accent.onLight),
    headingFont: font.heading,
    bodyFont: font.body,
    radius: style.radius,
    headingWeight: style.headingWeight,
    letterSpacing: style.letterSpacing,
    uppercaseEyebrow: style.uppercase,
    fontsHref: font.googleHref,
  }
}
