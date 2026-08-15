'use client'

/**
 * Badge dev — ref: `fixed bottom-0 right-8 "Developed for free by"`.
 * Ici la démo vit dans un frame scrollable (pas la page entière) : on utilise
 * `position: sticky` pour rester visible en bas du frame sans passer en
 * `fixed` (qui se positionnerait par rapport à la fenêtre, hors du frame).
 * Marque OBLIGATOIRE : "DEVELOPED BY NEWAPPAI" (jamais une autre marque).
 */

import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-badge-wrap { position: sticky; bottom: 0; display: flex; justify-content: flex-end; padding: 0.75rem; pointer-events: none; }
.demo-badge { pointer-events: auto; font-family: var(--demo-font-sans); font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--demo-color-neutral-600); background: rgba(255,255,255,0.92); border: 1px solid var(--demo-color-neutral-200); border-radius: var(--demo-radius-full); padding: 0.4rem 0.9rem; box-shadow: var(--demo-shadow-lg); backdrop-filter: blur(4px); }
`

export default function DemoBadge({ labels }: { labels: DemoLabels }) {
  return (
    <div className="demo-badge-wrap" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <span className="demo-badge">{labels.badge}</span>
    </div>
  )
}
