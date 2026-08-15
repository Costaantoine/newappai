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
.demo-badge { pointer-events: auto; display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--demo-font-sans); font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--demo-color-neutral-600); background: rgba(255,255,255,0.92); border: 1px solid var(--demo-color-neutral-200); border-radius: var(--demo-radius-full); padding: 0.4rem 0.9rem; box-shadow: var(--demo-shadow-lg); backdrop-filter: blur(4px); text-decoration: none; transition: color var(--demo-time-hover) ease, border-color var(--demo-time-hover) ease; }
.demo-badge:hover { color: var(--demo-color-neutral-900); border-color: var(--demo-color-gold); }
`

export default function DemoBadge({ labels }: { labels: DemoLabels }) {
  return (
    <div className="demo-badge-wrap" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a
        className="demo-badge"
        href="https://newappai.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Site développé par newappai.com — s'ouvre dans un nouvel onglet"
      >
        {labels.badge}
      </a>
    </div>
  )
}
