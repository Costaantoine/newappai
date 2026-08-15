'use client'

/**
 * Footer — ref: py-20 md:py-32, 3 colonnes (conditionnelles), barre basse
 * sociaux/© crédit. Colonnes affichées seulement si le champ existe.
 */

import { facebookUrl, instagramUrl, waLink } from '../../webdesign/utils'
import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-footer { padding: var(--demo-space-py20) var(--demo-px); background: var(--demo-color-neutral-900); color: var(--demo-color-white); }
@media (min-width: 768px) { .demo-footer { padding: var(--demo-space-py32) var(--demo-px); } }
.demo-footer-grid { max-width: var(--demo-max-w-7xl); margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
@media (min-width: 640px) { .demo-footer-grid { grid-template-columns: repeat(3, 1fr); } }
.demo-footer-brand { font-family: var(--demo-font-serif); font-weight: 300; font-size: 1.5rem; margin: 0 0 0.5rem; }
.demo-footer-sub { font-family: var(--demo-font-sans); font-size: 0.68rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-neutral-400); }
.demo-footer h4 { font-family: var(--demo-font-sans); font-size: 0.7rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-400); margin: 0 0 0.9rem; }
.demo-footer p, .demo-footer a { font-family: var(--demo-font-sans); font-size: 0.88rem; color: rgba(255,255,255,0.78); margin: 0 0 0.4rem; text-decoration: none; }
.demo-footer a:hover { color: var(--demo-color-gold); }
.demo-footer-bottom { max-width: var(--demo-max-w-7xl); margin: 2.5rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center; }
.demo-footer-copy { font-family: var(--demo-font-sans); font-size: 0.75rem; color: rgba(255,255,255,0.45); }
.demo-footer-credit { font-family: var(--demo-font-sans); font-size: 0.75rem; color: rgba(255,255,255,0.45); }
.demo-footer-social { display: flex; gap: 0.75rem; }
.demo-footer-social a { width: 2.1rem; height: 2.1rem; border-radius: var(--demo-radius-full); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
`

interface Props {
  name: string
  sectorLabel: string
  hours: string
  phone: string
  email: string
  instagram: string
  facebook: string
  labels: DemoLabels
}

export default function DemoFooter({ name, sectorLabel, hours, phone, email, instagram, facebook, labels }: Props) {
  const igUrl = instagramUrl(instagram)
  const fbUrl = facebookUrl(facebook)
  const hasContactCol = !!(phone || email)
  const year = new Date().getFullYear()

  return (
    <footer className="demo-footer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-footer-grid">
        <div>
          <p className="demo-footer-brand">{name}</p>
          {sectorLabel && <p className="demo-footer-sub">{sectorLabel}</p>}
        </div>

        {hours && (
          <div>
            <h4>{labels.contactHours}</h4>
            <p>{hours}</p>
          </div>
        )}

        {hasContactCol && (
          <div>
            <h4>{labels.contactPhone}</h4>
            {phone && <a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>}
            {email && <p>{email}</p>}
          </div>
        )}
      </div>

      <div className="demo-footer-bottom">
        <p className="demo-footer-copy">© {year} {name}</p>
        {(igUrl || fbUrl) && (
          <div className="demo-footer-social">
            {igUrl && (
              <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
            )}
            {fbUrl && (
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            )}
          </div>
        )}
        <p className="demo-footer-credit">{labels.footerCredit}</p>
      </div>
    </footer>
  )
}
