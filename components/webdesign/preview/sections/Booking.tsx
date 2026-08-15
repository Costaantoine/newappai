'use client'

import { useState, type FormEvent } from 'react'
import type { SiteConfig } from '../../types'
import { mapsEmbedUrl, waLink } from '../../utils'

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2c-5.514 0-9.996 4.478-9.996 9.997 0 1.762.462 3.484 1.34 4.997L2 22l5.146-1.336a9.96 9.96 0 0 0 4.855 1.236h.004c5.513 0 9.995-4.479 9.995-9.998 0-2.671-1.04-5.181-2.928-7.07A9.935 9.935 0 0 0 12.001 2z" />
    </svg>
  )
}

function Clock() {
  return <ClockIcon />
}
function Phone() {
  return <PhoneIcon />
}
function Pin() {
  return <PinIcon />
}
function WhatsApp() {
  return <WhatsAppIcon />
}

export function BookingSection({ config, anchorPrefix = 'pv' }: { config: SiteConfig; anchorPrefix?: string }) {
  const { phone, email, address, hours, instagram, facebook } = config.contact
  const hasServices = config.services.some((s) => s.name.trim())
  const serviceNames = config.services.filter((s) => s.name.trim()).map((s) => s.name)

  const [name, setName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [service, setService] = useState(serviceNames[0] || '')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!phone) return
    const lines = [
      `Bonjour, je souhaite prendre rendez-vous.`,
      name && `\nNom : ${name}`,
      clientPhone && `Téléphone : ${clientPhone}`,
      service && `Service : ${service}`,
      date && `Date souhaitée : ${date}`,
      notes && `Notes : ${notes}`,
    ].filter(Boolean)
    window.open(waLink(phone, lines.join('\n')), '_blank')
  }

  return (
    <>
      {/* Réservation */}
      <section id={`${anchorPrefix}-booking`} className="ws-section ws-booking">
        <div className="ws-container">
          <div className="ws-booking-head">
            <span className="ws-eyebrow ws-eyebrow--dark">Réservation</span>
            <h2>Demande de rendez-vous</h2>
          </div>
          <div className="ws-booking-card">
            <div className="ws-booking-grid">
              <div className="ws-booking-info">
                <h3>Informations pratiques</h3>
                {hours && (
                  <div className="ws-info-row">
                    <span className="ws-info-icon"><Clock /></span>
                    <div>
                      <h4>Horaires</h4>
                      <p>{hours}</p>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="ws-info-row">
                    <span className="ws-info-icon"><Phone /></span>
                    <div>
                      <h4>Téléphone / WhatsApp</h4>
                      <a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="ws-info-row">
                    <span className="ws-info-icon"><Pin /></span>
                    <div>
                      <h4>Adresse</h4>
                      <p>{address}</p>
                    </div>
                  </div>
                )}
                <p className="ws-booking-note">
                  Votre demande est envoyée directement sur WhatsApp — réponse rapide garantie.
                </p>
              </div>
              <form className="ws-booking-form" onSubmit={onSubmit}>
                <div className="ws-form-row">
                  <div className="ws-field">
                    <label htmlFor="pv-name">Nom</label>
                    <input id="pv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" required />
                  </div>
                  <div className="ws-field">
                    <label htmlFor="pv-phone">Téléphone</label>
                    <input id="pv-phone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="06 12 34 56 78" />
                  </div>
                </div>
                <div className="ws-form-row two">
                  {hasServices && (
                    <div className="ws-field">
                      <label htmlFor="pv-service">Service</label>
                      <select id="pv-service" value={service} onChange={(e) => setService(e.target.value)}>
                        {serviceNames.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="ws-field">
                    <label htmlFor="pv-date">Date souhaitée</label>
                    <input id="pv-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>
                <div className="ws-form-row">
                  <div className="ws-field">
                    <label htmlFor="pv-notes">Message</label>
                    <textarea id="pv-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Votre message, vos questions…" />
                  </div>
                </div>
                <button type="submit" className="ws-btn ws-submit">
                  <WhatsApp /> Envoyer la demande
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact + carte */}
      <section id={`${anchorPrefix}-contact`} className="ws-section">
        <div className="ws-container">
          <div className="ws-contact-grid">
            <div>
              <span className="ws-eyebrow">Contact</span>
              <div className="ws-contact-block" style={{ marginTop: '1rem' }}>
                <h3>Horaires</h3>
                <p>{hours || 'Sur rendez-vous'}</p>
              </div>
              {phone && (
                <div className="ws-contact-block">
                  <h3>Téléphone / WhatsApp</h3>
                  <a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                </div>
              )}
              {email && (
                <div className="ws-contact-block">
                  <h3>Email</h3>
                  <p>{email}</p>
                </div>
              )}
              {address && (
                <div className="ws-contact-block">
                  <h3>Adresse</h3>
                  <p>{address}</p>
                </div>
              )}
              {(instagram || facebook) && (
                <div className="ws-contact-block">
                  <h3>Réseaux sociaux</h3>
                  <div className="ws-social-row">
                    {instagram && (
                      <a href={`https://www.instagram.com/${instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                    )}
                    {facebook && (
                      <a href={`https://www.facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            {address && (
              <div className="ws-map">
                <iframe
                  src={mapsEmbedUrl(address)}
                  title="Carte Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
