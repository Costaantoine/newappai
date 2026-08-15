'use client'

/**
 * Contact — ref: py-32 md:py-48, blocs infos + iframe Maps pointer-events:none.
 * Blocs conditionnels (seuls les champs réellement renseignés) ; iframe
 * seulement si adresse réelle, sinon placeholder neutre (aucune fausse carte).
 */

import { facebookUrl, instagramUrl, mapsEmbedUrl, waLink } from '../../webdesign/utils'
import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-contact { padding: var(--demo-space-py32) var(--demo-px); background: var(--demo-color-white); }
@media (min-width: 768px) { .demo-contact { padding: var(--demo-space-py48) var(--demo-px); } }
.demo-contact-inner { max-width: var(--demo-max-w-7xl); margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 3rem; }
@media (min-width: 768px) { .demo-contact-inner { grid-template-columns: 1fr 1fr; align-items: start; } }
.demo-contact-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1rem; }
.demo-contact-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); color: var(--demo-color-neutral-900); margin: 0 0 1.75rem; }
@media (min-width: 768px) { .demo-contact-title { font-size: var(--demo-text-h-md); } }
.demo-contact-block { margin-bottom: 1.5rem; }
.demo-contact-block h3 { font-family: var(--demo-font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-500); margin: 0 0 0.4rem; }
.demo-contact-block p, .demo-contact-block a { font-family: var(--demo-font-sans); font-size: var(--demo-text-body); color: var(--demo-color-gray-600); margin: 0; text-decoration: none; }
.demo-contact-block a:hover { color: var(--demo-color-gold); }
.demo-contact-social { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.demo-contact-social a { width: 2.25rem; height: 2.25rem; border-radius: var(--demo-radius-full); border: 1px solid var(--demo-color-neutral-200); display: flex; align-items: center; justify-content: center; }
.demo-contact-map { border-radius: var(--demo-radius-lg); overflow: hidden; aspect-ratio: 4 / 3; background: var(--demo-color-neutral-50); border: 1px solid var(--demo-color-neutral-200); }
.demo-contact-map iframe { width: 100%; height: 100%; border: 0; }
.demo-contact-map-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; font-family: var(--demo-font-sans); font-size: 0.85rem; color: var(--demo-color-neutral-400); text-align: center; padding: 1.5rem; }
`

interface Props {
  hours: string
  phone: string
  email: string
  address: string
  instagram: string
  facebook: string
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoContact({ hours, phone, email, address, instagram, facebook, anchorPrefix, labels }: Props) {
  const igUrl = instagramUrl(instagram)
  const fbUrl = facebookUrl(facebook)

  return (
    <section id={`${anchorPrefix}-contact`} className="demo-contact" style={{ scrollMarginTop: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-contact-inner">
        <div>
          <span className="demo-contact-eyebrow">{labels.contactEyebrow}</span>
          <h2 className="demo-contact-title">{labels.contactTitle}</h2>

          <div className="demo-contact-block">
            <h3>{labels.contactHours}</h3>
            <p>{hours || '—'}</p>
          </div>

          {phone && (
            <div className="demo-contact-block">
              <h3>{labels.contactPhone}</h3>
              <a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
            </div>
          )}

          {email && (
            <div className="demo-contact-block">
              <h3>Email</h3>
              <p>{email}</p>
            </div>
          )}

          {address && (
            <div className="demo-contact-block">
              <h3>{labels.contactAddress}</h3>
              <p>{address}</p>
            </div>
          )}

          {(igUrl || fbUrl) && (
            <div className="demo-contact-block">
              <h3>Réseaux sociaux</h3>
              <div className="demo-contact-social">
                {igUrl && (
                  <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                )}
                {fbUrl && (
                  <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="demo-contact-map">
          {address ? (
            <iframe
              src={mapsEmbedUrl(address)}
              title="Carte Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <div className="demo-contact-map-placeholder">{labels.contactMapPlaceholder}</div>
          )}
        </div>
      </div>
    </section>
  )
}
