'use client'

/**
 * Takeaway sombre — ref: py-32 md:py-40 neutral-900, eyebrow gold, h2 serif,
 * ✓ gold, CTA gold rounded-lg shadow-xl tracking-[0.2em].
 */

import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-takeaway { padding: var(--demo-space-py32) var(--demo-px); background: var(--demo-color-neutral-900); text-align: center; }
@media (min-width: 768px) { .demo-takeaway { padding: var(--demo-space-py40) var(--demo-px); } }
.demo-takeaway-inner { max-width: var(--demo-max-w-3xl); margin: 0 auto; }
.demo-takeaway-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1.25rem; }
.demo-takeaway-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); color: var(--demo-color-white); margin: 0 0 2.5rem; }
@media (min-width: 768px) { .demo-takeaway-title { font-size: var(--demo-text-h-md); } }
.demo-takeaway-list { list-style: none; margin: 0 0 2.75rem; padding: 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
.demo-takeaway-item { display: flex; align-items: center; gap: 0.75rem; font-family: var(--demo-font-sans); font-size: var(--demo-text-body); color: var(--demo-color-neutral-200, #E5E5E5); }
.demo-takeaway-tick { color: var(--demo-color-gold); font-weight: 700; }
.demo-takeaway-cta { display: inline-block; font-family: var(--demo-font-sans); font-size: 0.75rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-900); background: var(--demo-color-gold); padding: 1rem 2.25rem; border-radius: var(--demo-radius-lg); box-shadow: var(--demo-shadow-xl); text-decoration: none; transition: filter var(--demo-time-hover) ease; }
.demo-takeaway-cta:hover { filter: brightness(1.08); }
`

interface Props {
  highlights: readonly string[]
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoTakeaway({ highlights, anchorPrefix, labels }: Props) {
  return (
    <section className="demo-takeaway">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-takeaway-inner">
        <span className="demo-takeaway-eyebrow">{labels.takeawayEyebrow}</span>
        <h2 className="demo-takeaway-title">{labels.menuTitle}</h2>
        <ul className="demo-takeaway-list">
          {highlights.map((item) => (
            <li key={item} className="demo-takeaway-item">
              <span className="demo-takeaway-tick">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <a href={`#${anchorPrefix}-contact`} className="demo-takeaway-cta">{labels.takeawayCta}</a>
      </div>
    </section>
  )
}
