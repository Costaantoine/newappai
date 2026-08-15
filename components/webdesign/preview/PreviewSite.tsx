'use client'

import { useMemo, type CSSProperties } from 'react'
import { buildTheme, type SiteTheme } from '../palette'
import { SECTORS, type SiteConfig } from '../types'
import { facebookUrl, instagramUrl, mapsEmbedUrl, waLink } from '../utils'
import { ServicesPricesSection, GallerySection } from './sections/Commerce'
import { BookingSection } from './sections/Booking'

/** Convertit un thème en variables CSS consommées par le <style> scoped .wsite. */
export function cssVars(theme: SiteTheme): CSSProperties {
  return {
    '--ws-bg': theme.bg,
    '--ws-text': theme.text,
    '--ws-muted': theme.muted,
    '--ws-alt': theme.alt,
    '--ws-card': theme.card,
    '--ws-border': theme.border,
    '--ws-dark': theme.sectionDark,
    '--ws-dark-text': theme.sectionDarkText,
    '--ws-footer': theme.footer,
    '--ws-accent': theme.accent,
    '--ws-accent-text': theme.accentText,
    '--ws-head': theme.headingFont,
    '--ws-body': theme.bodyFont,
    '--ws-radius': theme.radius,
    '--ws-head-w': theme.headingWeight,
    '--ws-ls': theme.letterSpacing,
    '--ws-header-bg': theme.dark ? 'rgba(10,10,14,0.82)' : 'rgba(255,255,255,0.92)',
    '--ws-eyebrow-tt': theme.uppercaseEyebrow ? 'uppercase' : 'none',
    '--ws-eyebrow-ls': theme.uppercaseEyebrow ? '0.26em' : '0.08em',
  } as CSSProperties
}

export const previewCss = `
.wsite { background: var(--ws-bg); color: var(--ws-text); font-family: var(--ws-body); scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
.wsite * { box-sizing: border-box; }
.wsite img, .wsite video { max-width: 100%; display: block; }
.wsite a { color: inherit; text-decoration: none; }
.wsite h1, .wsite h2, .wsite h3 { font-family: var(--ws-head); font-weight: var(--ws-head-w); letter-spacing: var(--ws-ls); line-height: 1.12; margin: 0; }
.wsite p { line-height: 1.65; margin: 0; color: var(--ws-muted); }
.wsite .ws-container { max-width: 1040px; margin: 0 auto; padding: 0 24px; }
.wsite .ws-section { padding: 76px 24px; }
.wsite .ws-eyebrow { color: var(--ws-accent-text); text-transform: var(--ws-eyebrow-tt); letter-spacing: var(--ws-eyebrow-ls); font-size: 0.66rem; font-weight: 600; }
.wsite .ws-eyebrow--dark { color: var(--ws-accent); }
.wsite .ws-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.7rem; border-radius: var(--ws-radius); background: var(--ws-accent); color: #fff; font-weight: 600; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.16em; border: none; cursor: pointer; transition: filter 0.2s ease; font-family: var(--ws-body); }
.wsite .ws-btn:hover { filter: brightness(1.1); }
.wsite .ws-btn--outline { background: transparent; border: 1px solid var(--ws-border); color: var(--ws-text); }
.wsite .ws-btn--outline:hover { filter: none; border-color: var(--ws-accent); color: var(--ws-accent-text); }
.wsite .ws-card { background: var(--ws-card); border: 1px solid var(--ws-border); border-radius: var(--ws-radius); }
.wsite .ws-header { position: sticky; top: 0; z-index: 40; background: var(--ws-header-bg); backdrop-filter: blur(8px); border-bottom: 1px solid var(--ws-border); }
.wsite .ws-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 12px 24px; max-width: 1040px; margin: 0 auto; }
.wsite .ws-brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.wsite .ws-logo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--ws-accent); flex-shrink: 0; }
.wsite .ws-logo-fallback { width: 40px; height: 40px; border-radius: 50%; background: var(--ws-accent); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--ws-head); font-size: 1.05rem; font-weight: 600; flex-shrink: 0; }
.wsite .ws-brand-name { font-family: var(--ws-head); font-size: 1.2rem; letter-spacing: 0.02em; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.wsite .ws-brand-sub { font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ws-muted); }
.wsite .ws-nav { display: none; gap: 1.4rem; }
.wsite .ws-nav a { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ws-text); }
.wsite .ws-nav a:hover { color: var(--ws-accent-text); }
@media (min-width: 600px) { .wsite .ws-nav { display: flex; } }
.wsite .ws-hero { position: relative; min-height: 320px; display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; overflow: hidden; background: linear-gradient(160deg, var(--ws-dark), var(--ws-bg)); }
.wsite .ws-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.wsite .ws-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,14,0.4) 0%, rgba(10,10,14,0.22) 45%, rgba(10,10,14,0.78) 100%); }
.wsite .ws-hero-inner { position: relative; z-index: 2; padding: 88px 24px 72px; max-width: 620px; }
.wsite .ws-hero-inner h1 { font-size: clamp(1.8rem, 7vw, 2.7rem); color: #fff; margin: 0.8rem 0; }
.wsite .ws-hero-inner p { color: rgba(255,255,255,0.88); max-width: 460px; margin: 0 auto 1.5rem; font-size: 0.92rem; }
.wsite .ws-hero-ctas { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }
.wsite .ws-about-grid { display: grid; gap: 2.2rem; align-items: start; }
@media (min-width: 620px) { .wsite .ws-about-grid { grid-template-columns: 1fr 1.4fr; } }
.wsite .ws-about-grid p { font-size: 0.92rem; margin-bottom: 1rem; }
.wsite .ws-footnote { margin-top: 1.5rem; padding-top: 1.3rem; border-top: 1px solid var(--ws-border); }
.wsite .ws-footnote span { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ws-muted); }
.wsite .ws-mosaic { background: var(--ws-alt); padding: 44px 24px; }
.wsite .ws-mosaic-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 620px) { .wsite .ws-mosaic-grid { grid-template-columns: 7fr 5fr; } }
.wsite .ws-mosaic-large { aspect-ratio: 4/5; overflow: hidden; border-radius: var(--ws-radius); }
.wsite .ws-mosaic-stack { display: flex; flex-direction: column; gap: 12px; }
.wsite .ws-mosaic-stack > div { aspect-ratio: 4/3; overflow: hidden; border-radius: var(--ws-radius); }
.wsite .ws-mosaic img { width: 100%; height: 100%; object-fit: cover; }
.wsite .ws-footer { background: var(--ws-footer); color: #fff; padding: 52px 24px 30px; }
.wsite .ws-footer-grid { display: grid; gap: 2rem; max-width: 1040px; margin: 0 auto; }
@media (min-width: 620px) { .wsite .ws-footer-grid { grid-template-columns: repeat(3, 1fr); } }
.wsite .ws-footer h3 { font-size: 1.5rem; }
.wsite .ws-footer-sub { color: rgba(255,255,255,0.5); font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.16em; }
.wsite .ws-footer h4 { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.5); margin: 0 0 0.8rem; font-family: var(--ws-body); font-weight: 500; }
.wsite .ws-footer p, .wsite .ws-footer a { color: rgba(255,255,255,0.75); font-size: 0.84rem; margin: 0 0 0.35rem; }
.wsite .ws-footer a:hover { color: var(--ws-accent); }
.wsite .ws-footer-bottom { margin-top: 2.4rem; padding-top: 1.4rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center; max-width: 1040px; margin-left: auto; margin-right: auto; }
.wsite .ws-copy { font-size: 0.7rem; color: rgba(255,255,255,0.45); }
.wsite .ws-wa-float { position: fixed; bottom: 14px; right: 14px; z-index: 60; width: 46px; height: 46px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px -8px rgba(37,211,102,0.7); }
.wsite .ws-wa-float svg { width: 23px; height: 23px; fill: #fff; }
`

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2c-5.514 0-9.996 4.478-9.996 9.997 0 1.762.462 3.484 1.34 4.997L2 22l5.146-1.336a9.96 9.96 0 0 0 4.855 1.236h.004c5.513 0 9.995-4.479 9.995-9.998 0-2.671-1.04-5.181-2.928-7.07A9.935 9.935 0 0 0 12.001 2zm0 18.267a8.28 8.28 0 0 1-4.223-1.156l-.303-.18-3.053.793.815-2.977-.198-.306a8.263 8.263 0 0 1-1.269-4.444c0-4.573 3.72-8.293 8.235-8.293 2.2 0 4.267.858 5.823 2.415a8.185 8.185 0 0 1 2.41 5.822c-.001 4.573-3.721 8.326-8.237 8.326z" />
    </svg>
  )
}

export default function PreviewSite({
  config,
  anchorPrefix = 'pv',
}: {
  config: SiteConfig
  anchorPrefix?: string
}) {
  const theme = useMemo(() => buildTheme(config.design), [config.design])
  const photos = config.gallery.filter((g) => g.type === 'image')
  const sector = SECTORS.find((s) => s.id === config.business.sector)?.label || ''
  const name = config.business.name.trim()
  const phone = config.contact.phone
  const waHref = waLink(phone, `Bonjour ${name}, je vous contacte depuis votre site internet.`)
  const heroPhoto = photos[0]?.dataUrl

  const anchors = [
    { href: `#${anchorPrefix}-about`, label: 'À propos' },
    { href: `#${anchorPrefix}-services`, label: 'Services' },
    { href: `#${anchorPrefix}-prices`, label: 'Tarifs' },
    { href: `#${anchorPrefix}-gallery`, label: 'Galerie' },
    { href: `#${anchorPrefix}-booking`, label: 'Réservation' },
    { href: `#${anchorPrefix}-contact`, label: 'Contact' },
  ]

  return (
    <div className="wsite" style={cssVars(theme)}>
      <style>{previewCss}</style>

      {/* Header */}
      <header className="ws-header">
        <div className="ws-header-inner">
          <a href={`#${anchorPrefix}-about`} className="ws-brand">
            {config.business.logo ? (
              <img src={config.business.logo.dataUrl} alt="Logo" className="ws-logo" />
            ) : (
              <span className="ws-logo-fallback">{(name || 'V').charAt(0).toUpperCase()}</span>
            )}
            <span>
              <span className="ws-brand-name block">{name || 'Votre entreprise'}</span>
              {sector && <span className="ws-brand-sub block">{sector}</span>}
            </span>
          </a>
          <nav className="ws-nav">
            {anchors.map((a) => (
              <a key={a.href} href={a.href}>{a.label}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id={`${anchorPrefix}-about`} className="ws-hero">
        {heroPhoto && <div className="ws-hero-bg" style={{ backgroundImage: `url("${heroPhoto}")` }} />}
        <div className="ws-hero-inner">
          <span className="ws-eyebrow ws-eyebrow--dark">{sector || 'Bienvenue'}</span>
          <h1>{name || 'Votre entreprise'}</h1>
          <p>
            {config.business.description ||
              'Ajoutez votre description courte — elle s\'affichera ici, au cœur du hero de votre site.'}
          </p>
          <div className="ws-hero-ctas">
            <a href={`#${anchorPrefix}-booking`} className="ws-btn">Réserver</a>
            {phone && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="ws-btn ws-btn--outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="ws-section">
        <div className="ws-container ws-about-grid">
          <span className="ws-eyebrow">À propos</span>
          <div>
            <p>
              {config.business.description ||
                'Décrivez votre entreprise en 2 à 3 phrases : votre histoire, votre savoir-faire et ce qui vous rend unique.'}
            </p>
            <p>
              Votre site vitrine présente vos services, vos tarifs et votre galerie — et permet à vos clients de vous
              contacter en un clic via WhatsApp.
            </p>
            {config.contact.address && (
              <div className="ws-footnote">
                <span>{sector} · Localisation : {config.contact.address}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mosaïque (photos 2-4 si disponibles) */}
      {photos.length >= 3 && (
        <div className="ws-mosaic">
          <div className="ws-container ws-mosaic-grid">
            <div className="ws-mosaic-large">
              <img src={photos[1].dataUrl} alt="Travail 1" />
            </div>
            {photos.length >= 4 ? (
              <div className="ws-mosaic-stack">
                <div><img src={photos[2].dataUrl} alt="Travail 2" /></div>
                <div><img src={photos[3].dataUrl} alt="Travail 3" /></div>
              </div>
            ) : (
              <div className="ws-mosaic-stack">
                <div><img src={photos[2].dataUrl} alt="Travail 2" /></div>
              </div>
            )}
          </div>
        </div>
      )}

      <ServicesPricesSection config={config} anchorPrefix={anchorPrefix} />
      <GallerySection config={config} anchorPrefix={anchorPrefix} />
      <BookingSection config={config} anchorPrefix={anchorPrefix} />

      {/* Footer */}
      <footer className="ws-footer">
        <div className="ws-footer-grid">
          <div>
            <h3>{name || 'Votre entreprise'}</h3>
            <p className="ws-footer-sub">{sector || 'Site vitrine'}</p>
          </div>
          <div>
            <h4>Horaires</h4>
            <p>{config.contact.hours || 'Sur rendez-vous'}</p>
          </div>
          <div>
            <h4>Contact</h4>
            {phone && <p><a href={waLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a></p>}
            {config.contact.email && <p>{config.contact.email}</p>}
          </div>
        </div>
        <div className="ws-footer-bottom">
          <p className="ws-copy">© {new Date().getFullYear()} {name || 'Votre entreprise'}</p>
          {(config.contact.instagram || config.contact.facebook) && (
            <div className="ws-social-row" style={{ gap: '1rem' }}>
              {instagramUrl(config.contact.instagram) && (
                <a href={instagramUrl(config.contact.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {facebookUrl(config.contact.facebook) && (
                <a href={facebookUrl(config.contact.facebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* WhatsApp flottant */}
      {phone && (
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="ws-wa-float" aria-label="Contact via WhatsApp">
          <WhatsAppIcon />
        </a>
      )}
    </div>
  )
}
