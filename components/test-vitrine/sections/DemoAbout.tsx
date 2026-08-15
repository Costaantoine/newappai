'use client'

/**
 * À propos — ref: py-16 md:py-24, grid 2 col, h2 serif font-light 4xl→6xl
 * à gauche, paragraphes text-lg gray-600 à droite, pied border-t neutral-200.
 */

import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-about { padding: var(--demo-space-py16) var(--demo-px); background: var(--demo-color-white); }
@media (min-width: 768px) { .demo-about { padding: var(--demo-space-py24) var(--demo-px); } }
.demo-about-inner { max-width: var(--demo-max-w-7xl); margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
@media (min-width: 768px) { .demo-about-inner { grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; } }
.demo-about-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1rem; }
.demo-about-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); line-height: 1.15; color: var(--demo-color-neutral-900); margin: 0; }
@media (min-width: 768px) { .demo-about-title { font-size: var(--demo-text-h-md); } }
@media (min-width: 1024px) { .demo-about-title { font-size: var(--demo-text-h-lg); } }
.demo-about-text p { font-family: var(--demo-font-sans); font-size: var(--demo-text-body); line-height: 1.75; color: var(--demo-color-gray-600); margin: 0 0 1.25rem; }
.demo-about-footnote { grid-column: 1 / -1; border-top: 1px solid var(--demo-color-neutral-200); padding-top: 1.25rem; margin-top: 0.5rem; }
.demo-about-footnote span { font-family: var(--demo-font-sans); font-size: 0.7rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-500); }
`

interface Props {
  name: string
  description: string
  fallbackTagline: string
  address?: string
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoAbout({ name, description, fallbackTagline, address, anchorPrefix, labels }: Props) {
  const tagline = description || fallbackTagline
  return (
    <section id={`${anchorPrefix}-about`} className="demo-about" style={{ scrollMarginTop: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-about-inner">
        <div>
          <span className="demo-about-eyebrow">{labels.aboutEyebrow}</span>
          <h2 className="demo-about-title">{name}</h2>
        </div>
        <div className="demo-about-text">
          <p>{tagline}</p>
          <p>
            Découvrez nos services, notre galerie et prenez contact avec nous en quelques clics.
          </p>
        </div>
        {address && (
          <div className="demo-about-footnote">
            <span>{address}</span>
          </div>
        )}
      </div>
    </section>
  )
}
