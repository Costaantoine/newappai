/**
 * Design system de la démo "site vitrine" — structure et typographie
 * épinglées sur l'identité webolharosol (Playfair Display + Inter,
 * espacements, rayons, ombres, timings — INCHANGÉS quel que soit le choix
 * du client). Les COULEURS, elles, reflètent la palette choisie par le
 * client à l'étape Design du wizard (`resolveDemoTokens`) — c'est une
 * promesse vendue (149€, « personnalisez couleurs et polices »). Tant que
 * le client n'a pas encore personnalisé (config par défaut du wizard),
 * l'identité or/neutral de la référence reste affichée telle quelle. Les
 * sections ne font que consommer `var(--demo-*)` — aucune couleur en dur.
 */

import type { CSSProperties } from 'react'
import { defaultSiteConfig, type DesignConfig } from '../webdesign/types'
import { buildTheme } from '../webdesign/palette'

/** Variables CSS posées une fois sur la racine `.demo-root` (voir DemoSite.tsx). */
export const DEMO_TOKENS: CSSProperties = {
  // Couleurs — ref: bg-gold / text-gold / border-gold (admin.BcWy1cgi.css)
  '--demo-color-gold': '#D4AF37',
  '--demo-color-white': '#FFFFFF',
  '--demo-color-neutral-50': '#FAFAFA',
  '--demo-color-neutral-200': '#E5E5E5',
  '--demo-color-neutral-400': '#A3A3A3',
  '--demo-color-neutral-500': '#737373',
  '--demo-color-neutral-600': '#525252',
  '--demo-color-neutral-800': '#262626',
  '--demo-color-neutral-900': '#171717',
  '--demo-color-gray-900': '#111827',
  '--demo-color-gray-800': '#1F2937',
  '--demo-color-gray-600': '#4B5563',
  '--demo-color-gray-500': '#6B7280',
  '--demo-color-gray-400': '#9CA3AF',
  '--demo-color-gray-300': '#D1D5DB',
  // Overlays / blobs — ref: bg-black/10, bg-black/30, bg-gold/5, hover:bg-gold/10, bg-gold/20
  '--demo-overlay-black-10': 'rgba(0,0,0,.10)',
  '--demo-overlay-black-30': 'rgba(0,0,0,.30)',
  '--demo-gold-05': 'rgba(212,175,55,.05)',
  '--demo-gold-10': 'rgba(212,175,55,.10)',
  '--demo-gold-20': 'rgba(212,175,55,.20)',

  // Typo — ref: Playfair Display font-light (300) + Inter
  '--demo-font-serif': "'Playfair Display', Georgia, serif",
  '--demo-font-sans': 'Inter, system-ui, sans-serif',
  // ref: h1/h2 2.25rem → 3rem (md) → 3.75rem (lg)
  '--demo-text-h-sm': '2.25rem',
  '--demo-text-h-md': '3rem',
  '--demo-text-h-lg': '3.75rem',
  // ref: eyebrow 0.875rem uppercase tracking-[0.3em]
  '--demo-text-eyebrow': '0.875rem',
  '--demo-tracking-eyebrow': '0.3em',
  '--demo-tracking-nav': '0.2em',
  // ref: corps text-lg
  '--demo-text-body': '1.125rem',

  // Espacements — ref: py-16/20/32/40/48 (4/5/8/10/12rem)
  '--demo-space-py16': '4rem',
  '--demo-space-py20': '5rem',
  '--demo-space-py24': '6rem',
  '--demo-space-py32': '8rem',
  '--demo-space-py40': '10rem',
  '--demo-space-py48': '12rem',
  '--demo-px': '2rem',

  // Largeurs — ref: max-w-3xl/5xl/7xl
  '--demo-max-w-3xl': '48rem',
  '--demo-max-w-5xl': '64rem',
  '--demo-max-w-7xl': '80rem',

  // Rayons — ref: rounded-lg / rounded-2xl / rounded-full
  '--demo-radius-lg': '0.5rem',
  '--demo-radius-2xl': '1rem',
  '--demo-radius-full': '9999px',

  // Ombres — ref: shadow-lg / shadow-xl / shadow-2xl
  '--demo-shadow-lg': '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)',
  '--demo-shadow-xl': '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)',
  '--demo-shadow-2xl': '0 25px 50px -12px rgba(0,0,0,.25)',

  // Timings CSS — ref: hero 4s/.6s, carrousel 5s/500ms, hover 300ms
  '--demo-time-hero': '4s',
  '--demo-time-hero-transition': '.6s',
  '--demo-time-gallery': '5s',
  '--demo-time-gallery-transition': '500ms',
  '--demo-time-hover': '300ms',
} as CSSProperties

/** Mêmes timings, en millisecondes, pour piloter les sliders (setInterval/setTimeout). */
export const DEMO_TIMINGS = {
  heroSlideMs: 4000,
  heroTransitionMs: 600,
  galleryAutoplayMs: 5000,
  galleryTransitionMs: 500,
  hoverMs: 300,
} as const

const DEFAULT_DESIGN = defaultSiteConfig().design

/** Le client n'a pas (encore) personnalisé le design — garde l'identité de référence. */
function isDefaultDesign(design: DesignConfig): boolean {
  return (
    design.backgroundId === DEFAULT_DESIGN.backgroundId &&
    design.fontPairId === DEFAULT_DESIGN.fontPairId &&
    design.accentId === DEFAULT_DESIGN.accentId &&
    design.styleId === DEFAULT_DESIGN.styleId &&
    !design.customColor?.trim()
  )
}

/** #rgb / #rrggbb → rgba(r,g,b,alpha). Retombe sur l'or de référence si le hex est invalide. */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.trim().replace(/^#/, '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return `rgba(212,175,55,${alpha})`
  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * Surcharge DEMO_TOKENS avec la palette choisie par le client (backgroundId /
 * accentId / customColor de l'étape Design) — résolue via `buildTheme`, le
 * même moteur que l'aperçu live et le site final. Structure, typo, rayons,
 * espacements et timings restent épinglés (non surchargés). `--demo-overlay-
 * black-*` reste un noir pur : ce sont des voiles de contraste posés sur des
 * photos (Hero/Parallax), pas une couleur de thème.
 */
export function resolveDemoTokens(design: DesignConfig): CSSProperties {
  if (isDefaultDesign(design)) return DEMO_TOKENS

  const theme = buildTheme(design)

  return {
    ...DEMO_TOKENS,
    '--demo-color-gold': theme.accent,
    '--demo-color-white': theme.bg,
    '--demo-color-neutral-50': theme.alt,
    '--demo-color-neutral-200': theme.alt,
    '--demo-color-neutral-400': theme.muted,
    '--demo-color-neutral-500': theme.muted,
    '--demo-color-neutral-600': theme.muted,
    '--demo-color-neutral-800': theme.sectionDark,
    '--demo-color-neutral-900': theme.text,
    '--demo-color-gray-900': theme.sectionDark,
    '--demo-color-gray-800': theme.footer,
    '--demo-color-gray-600': theme.muted,
    '--demo-color-gray-500': theme.muted,
    '--demo-color-gray-400': theme.muted,
    '--demo-color-gray-300': theme.alt,
    '--demo-gold-05': hexToRgba(theme.accent, 0.05),
    '--demo-gold-10': hexToRgba(theme.accent, 0.1),
    '--demo-gold-20': hexToRgba(theme.accent, 0.2),
  } as CSSProperties
}
