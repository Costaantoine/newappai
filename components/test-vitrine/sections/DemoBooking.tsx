'use client'

/**
 * Réservation — VISUEL HONNÊTE (ref: section sombre, 2 blobs bg-gold/5
 * blur-3xl, carte blanche rounded-2xl shadow-2xl, panneau infos bg-neutral-800
 * icônes w-10 h-10 bg-gold/20). Seuls les champs réellement renseignés sont
 * affichés ; JAMAIS de créneaux fictifs. Si un vrai téléphone existe → lien
 * wa.me ; sinon note honnête (le vrai formulaire arrive avec le site final).
 */

import { waLink } from '../../webdesign/utils'
import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-booking { position: relative; padding: var(--demo-space-py32) var(--demo-px); background: var(--demo-color-neutral-900); overflow: hidden; }
.demo-booking-blob { position: absolute; width: 24rem; height: 24rem; border-radius: 50%; background: var(--demo-gold-05); filter: blur(64px); pointer-events: none; }
.demo-booking-blob--a { top: -6rem; left: -6rem; }
.demo-booking-blob--b { bottom: -6rem; right: -6rem; }
.demo-booking-inner { position: relative; max-width: var(--demo-max-w-5xl); margin: 0 auto; }
.demo-booking-head { text-align: center; margin-bottom: 2.5rem; }
.demo-booking-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1rem; }
.demo-booking-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); color: var(--demo-color-white); margin: 0; }
@media (min-width: 768px) { .demo-booking-title { font-size: var(--demo-text-h-md); } }
.demo-booking-card { background: var(--demo-color-white); border-radius: var(--demo-radius-2xl); box-shadow: var(--demo-shadow-2xl); overflow: hidden; display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .demo-booking-card { grid-template-columns: 1fr 1fr; } }
.demo-booking-info { background: var(--demo-color-neutral-800); color: var(--demo-color-white); padding: 2.5rem; }
.demo-booking-info h3 { font-family: var(--demo-font-serif); font-weight: 400; font-size: 1.35rem; margin: 0 0 1.5rem; }
.demo-booking-row { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem; }
.demo-booking-icon { flex-shrink: 0; width: 2.5rem; height: 2.5rem; border-radius: var(--demo-radius-lg); background: var(--demo-gold-20); display: flex; align-items: center; justify-content: center; color: var(--demo-color-gold); }
.demo-booking-row h4 { font-family: var(--demo-font-sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-400); margin: 0 0 0.25rem; }
.demo-booking-row p, .demo-booking-row a { font-family: var(--demo-font-sans); font-size: 0.92rem; color: var(--demo-color-white); margin: 0; text-decoration: none; }
.demo-booking-row a:hover { color: var(--demo-color-gold); }
.demo-booking-honest { padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 1.25rem; }
.demo-booking-honest p { font-family: var(--demo-font-sans); font-size: 0.95rem; color: var(--demo-color-gray-600); line-height: 1.6; margin: 0; }
.demo-booking-cta { display: inline-block; font-family: var(--demo-font-sans); font-size: 0.75rem; text-transform: uppercase; letter-spacing: var(--demo-tracking-nav); color: var(--demo-color-neutral-900); background: var(--demo-color-gold); padding: 0.9rem 1.75rem; border-radius: var(--demo-radius-lg); text-decoration: none; transition: filter var(--demo-time-hover) ease; }
.demo-booking-cta:hover { filter: brightness(1.08); }
`

function ClockGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
function PinGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function PhoneGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

interface Props {
  phone: string
  hours: string
  address: string
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoBooking({ phone, hours, address, anchorPrefix, labels }: Props) {
  const hasAnyInfo = !!(phone || hours || address)

  return (
    <section id={`${anchorPrefix}-booking`} className="demo-booking" style={{ scrollMarginTop: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-booking-blob demo-booking-blob--a" />
      <div className="demo-booking-blob demo-booking-blob--b" />
      <div className="demo-booking-inner">
        <div className="demo-booking-head">
          <span className="demo-booking-eyebrow">{labels.bookingEyebrow}</span>
          <h2 className="demo-booking-title">{labels.bookingTitle}</h2>
        </div>
        <div className="demo-booking-card">
          <div className="demo-booking-info">
            <h3>{labels.bookingInfoTitle}</h3>
            {!hasAnyInfo && <p style={{ color: 'var(--demo-color-neutral-400)', fontSize: '0.9rem' }}>—</p>}
            {hours && (
              <div className="demo-booking-row">
                <span className="demo-booking-icon"><ClockGlyph /></span>
                <div>
                  <h4>{labels.contactHours}</h4>
                  <p>{hours}</p>
                </div>
              </div>
            )}
            {phone && (
              <div className="demo-booking-row">
                <span className="demo-booking-icon"><PhoneGlyph /></span>
                <div>
                  <h4>{labels.contactPhone}</h4>
                  <a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                </div>
              </div>
            )}
            {address && (
              <div className="demo-booking-row">
                <span className="demo-booking-icon"><PinGlyph /></span>
                <div>
                  <h4>{labels.contactAddress}</h4>
                  <p>{address}</p>
                </div>
              </div>
            )}
          </div>
          <div className="demo-booking-honest">
            <p>{labels.bookingHonestNote}</p>
            {phone && (
              <a
                href={waLink(phone, 'Bonjour, je souhaite prendre rendez-vous.')}
                target="_blank"
                rel="noopener noreferrer"
                className="demo-booking-cta"
              >
                {labels.bookingWhatsapp}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
