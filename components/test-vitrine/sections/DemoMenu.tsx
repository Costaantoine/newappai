'use client'

/**
 * Menu / services — ref: py-32 md:py-40, header centré, cartes p-8
 * bg-neutral-50 hover:bg-gold/10 hover:border-gold, chevron.
 * JAMAIS de prix (démo honnête) ni de lightbox (images absentes du mirror).
 */

import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-menu { padding: var(--demo-space-py32) var(--demo-px); background: var(--demo-color-white); }
@media (min-width: 768px) { .demo-menu { padding: var(--demo-space-py40) var(--demo-px); } }
.demo-menu-inner { max-width: var(--demo-max-w-5xl); margin: 0 auto; }
.demo-menu-head { text-align: center; margin-bottom: 3rem; }
.demo-menu-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1rem; }
.demo-menu-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); color: var(--demo-color-neutral-900); margin: 0; }
@media (min-width: 768px) { .demo-menu-title { font-size: var(--demo-text-h-md); } }
.demo-menu-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 640px) { .demo-menu-grid { grid-template-columns: 1fr 1fr; } }
.demo-menu-card { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 2rem; background: var(--demo-color-neutral-50); border: 1px solid transparent; border-radius: var(--demo-radius-lg); transition: background var(--demo-time-hover) ease, border-color var(--demo-time-hover) ease; }
.demo-menu-card:hover { background: var(--demo-gold-10); border-color: var(--demo-color-gold); }
.demo-menu-card h3 { font-family: var(--demo-font-serif); font-weight: 400; font-size: 1.15rem; color: var(--demo-color-neutral-900); margin: 0 0 0.4rem; }
.demo-menu-card p { font-family: var(--demo-font-sans); font-size: 0.92rem; color: var(--demo-color-gray-600); margin: 0; }
.demo-menu-chevron { flex-shrink: 0; color: var(--demo-color-gold); font-size: 1.1rem; }
.demo-menu-right { display: flex; align-items: center; gap: 0.9rem; flex-shrink: 0; }
.demo-menu-price { font-family: var(--demo-font-serif); font-size: 1.05rem; color: var(--demo-color-neutral-900); white-space: nowrap; }
`

interface Props {
  services: { id: string; name: string; description: string; price?: string }[]
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoMenu({ services, anchorPrefix, labels }: Props) {
  return (
    <section id={`${anchorPrefix}-services`} className="demo-menu" style={{ scrollMarginTop: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-menu-inner">
        <div className="demo-menu-head">
          <span className="demo-menu-eyebrow">{labels.menuEyebrow}</span>
          <h2 className="demo-menu-title">{labels.menuTitle}</h2>
        </div>
        <div className="demo-menu-grid">
          {services.map((s) => (
            <div key={s.id} className="demo-menu-card">
              <div>
                <h3>{s.name}</h3>
                {s.description && <p>{s.description}</p>}
              </div>
              <div className="demo-menu-right">
                {s.price && <span className="demo-menu-price">{s.price}</span>}
                <span className="demo-menu-chevron">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
