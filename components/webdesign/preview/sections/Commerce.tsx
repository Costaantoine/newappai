'use client'

import type { SiteConfig } from '../../types'

const SKILL_ITEMS = [
  'Un travail soigné, à votre écoute du début à la fin',
  'Sur rendez-vous pour vous accorder le temps qu’il faut',
  'Conseils personnalisés et produits de qualité professionnelle',
]

export function ServicesPricesSection({ config, anchorPrefix = 'pv' }: { config: SiteConfig; anchorPrefix?: string }) {
  const hasServices = config.services.some((s) => s.name.trim())
  const services = config.services.filter((s) => s.name.trim())
  const videos = config.gallery.filter((g) => g.type === 'video')

  return (
    <>
      {/* Services */}
      <section id={`${anchorPrefix}-services`} className="ws-section ws-services">
        <div className="ws-container ws-services-grid">
          <div>
            <span className="ws-eyebrow ws-eyebrow--dark">Services</span>
            <h2>Nos services</h2>
            <ul className="ws-services-list">
              {SKILL_ITEMS.map((item) => (
                <li key={item}>
                  <span className="ws-tick">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {services.length > 0 && (
              <a href="#pv-prices" className="ws-btn ws-btn--outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}>
                Voir les tarifs
              </a>
            )}
          </div>
          <div>
            {videos.length > 0 ? (
              <div className="ws-media">
                {videos.slice(0, 2).map((v) => (
                  <video key={v.id} src={v.dataUrl} muted loop playsInline preload="metadata" />
                ))}
              </div>
            ) : (
              <div className="ws-card" style={{ padding: '2.2rem 1.8rem', color: 'var(--ws-dark-text)', fontSize: '0.85rem', opacity: 0.75 }}>
                Vos vidéos (optionnel) apparaîtront ici en aperçu automatique — idéal pour montrer votre travail en mouvement.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Prix */}
      {hasServices && (
        <section id={`${anchorPrefix}-prices`} className="ws-section ws-prices">
          <div className="ws-container">
            <div className="ws-prices-head">
              <span className="ws-eyebrow">Tarifs</span>
              <h2>Nos prix</h2>
            </div>
            <div className="ws-price-grid">
              {services.map((s) => (
                <div key={s.id} className="ws-price-card">
                  <div className="ws-price-head">
                    <h3>{s.name}</h3>
                    {s.price && <span className="ws-price">{s.price}</span>}
                  </div>
                  {s.description && <p>{s.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export function GallerySection({ config, anchorPrefix = 'pv' }: { config: SiteConfig; anchorPrefix?: string }) {
  const items = config.gallery.filter((g) => g.type === 'image')
  if (items.length === 0) return null

  return (
    <section id={`${anchorPrefix}-gallery`} className="ws-section ws-gallery">
      <div className="ws-container">
        <div className="ws-gallery-head">
          <span className="ws-eyebrow">Galerie</span>
          <h2>Nos réalisations</h2>
        </div>
        <div className="ws-gallery-grid">
          {items.map((img) => (
            <div key={img.id} className="ws-gallery-item">
              <img src={img.dataUrl} alt={img.name || 'Galerie'} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
