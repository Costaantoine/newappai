/**
 * Génère un site vitrine one-page autonome (HTML + CSS + JS) à partir de la
 * configuration du client. Toutes les images sont embarquées en base64, le
 * fichier est donc 100% autonome et peut être hébergé n'importe où.
 */

import { buildTheme } from './palette'
import type { SiteConfig } from './types'
import { SECTORS } from './types'
import { facebookUrl, instagramUrl, mapsEmbedUrl, slugify, waLink } from './utils'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const waIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="vertical-align:-3px;margin-right:8px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.001 2c-5.514 0-9.996 4.478-9.996 9.997 0 1.762.462 3.484 1.34 4.997L2 22l5.146-1.336a9.96 9.96 0 0 0 4.855 1.236h.004c5.513 0 9.995-4.479 9.995-9.998 0-2.671-1.04-5.181-2.928-7.07A9.935 9.935 0 0 0 12.001 2zm0 18.267a8.28 8.28 0 0 1-4.223-1.156l-.303-.18-3.053.793.815-2.977-.198-.306a8.263 8.263 0 0 1-1.269-4.444c0-4.573 3.72-8.293 8.235-8.293 2.2 0 4.267.858 5.823 2.415a8.185 8.185 0 0 1 2.41 5.822c-.001 4.573-3.721 8.326-8.237 8.326z"/></svg>`

function buildCss(theme: ReturnType<typeof buildTheme>): string {
  return `
:root {
  --bg: ${theme.bg}; --text: ${theme.text}; --muted: ${theme.muted};
  --alt: ${theme.alt}; --card: ${theme.card}; --border: ${theme.border};
  --dark: ${theme.sectionDark}; --dark-text: ${theme.sectionDarkText};
  --footer: ${theme.footer}; --accent: ${theme.accent}; --accent-text: ${theme.accentText};
  --head: ${theme.headingFont}; --body: ${theme.bodyFont};
  --radius: ${theme.radius}; --head-w: ${theme.headingWeight}; --ls: ${theme.letterSpacing};
  --header-bg: ${theme.dark ? 'rgba(10,10,14,0.82)' : 'rgba(255,255,255,0.92)'};
  --eyebrow-tt: ${theme.uppercaseEyebrow ? 'uppercase' : 'none'};
  --eyebrow-ls: ${theme.uppercaseEyebrow ? '0.26em' : '0.08em'};
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--body); line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, video { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
h1, h2, h3 { font-family: var(--head); font-weight: var(--head-w); letter-spacing: var(--ls); line-height: 1.12; }
p { color: var(--muted); line-height: 1.65; }
.container { max-width: 1040px; margin: 0 auto; padding: 0 24px; }
.section { padding: 88px 24px; }
.eyebrow { color: var(--accent-text); text-transform: var(--eyebrow-tt); letter-spacing: var(--eyebrow-ls); font-size: 0.68rem; font-weight: 600; }
.eyebrow.dark { color: var(--accent); }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: var(--radius); background: var(--accent); color: #fff; font-weight: 600; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.16em; border: none; cursor: pointer; transition: filter .2s; font-family: var(--body); }
.btn:hover { filter: brightness(1.1); }
.btn.outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); }
/* header */
header.site { position: sticky; top: 0; z-index: 50; background: var(--header-bg); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
header.site .inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 24px; max-width: 1040px; margin: 0 auto; }
.brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.brand img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); }
.brand .fallback { width: 42px; height: 42px; border-radius: 50%; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--head); font-size: 1.1rem; }
.brand-name { font-family: var(--head); font-size: 1.25rem; letter-spacing: .02em; line-height: 1.1; }
.brand-sub { font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; color: var(--muted); }
nav.desktop { display: flex; gap: 22px; }
nav.desktop a { font-size: .68rem; text-transform: uppercase; letter-spacing: .14em; }
nav.desktop a:hover { color: var(--accent-text); }
@media (max-width: 640px) { nav.desktop { display: none; } }
/* hero */
.hero { position: relative; min-height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; overflow: hidden; }
.hero .bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,14,.4) 0%, rgba(10,10,14,.22) 45%, rgba(10,10,14,.8) 100%); }
.hero-inner { position: relative; z-index: 2; padding: 120px 24px; max-width: 640px; }
.hero h1 { font-size: clamp(2.2rem, 7vw, 3.6rem); color: #fff; margin: 16px 0; }
.hero p { color: rgba(255,255,255,.88); max-width: 480px; margin: 0 auto 24px; font-size: 1rem; }
.hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.hero .btn.outline { color: #fff; border-color: rgba(255,255,255,.5); }
/* about */
.about-grid { display: grid; gap: 40px; align-items: start; }
@media (min-width: 700px) { .about-grid { grid-template-columns: 1fr 1.4fr; } }
.about-grid p { font-size: .98rem; margin-bottom: 16px; }
.footnote { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); font-size: .64rem; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); }
/* mosaic */
.mosaic { background: var(--alt); padding: 48px 24px; }
.mosaic-grid { display: grid; gap: 12px; }
@media (min-width: 700px) { .mosaic-grid { grid-template-columns: 7fr 5fr; } }
.mosaic-large { aspect-ratio: 4/5; overflow: hidden; border-radius: var(--radius); }
.mosaic-stack { display: flex; flex-direction: column; gap: 12px; }
.mosaic-stack > div { aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius); }
.mosaic img { width: 100%; height: 100%; object-fit: cover; }
/* services */
.services { background: var(--dark); color: var(--dark-text); }
.services-grid { display: grid; gap: 44px; align-items: center; }
@media (min-width: 700px) { .services-grid { grid-template-columns: 1fr 1fr; } }
.services h2 { color: #fff; margin: 12px 0 26px; font-size: 2.2rem; }
.services ul { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.services li { display: flex; gap: 10px; align-items: flex-start; color: var(--dark-text); opacity: .92; }
.tick { color: var(--accent); font-weight: 700; flex-shrink: 0; }
.media { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.media video { width: 100%; height: 100%; min-height: 170px; object-fit: cover; border-radius: 10px; }
/* prices */
.prices-head { text-align: center; margin-bottom: 42px; }
.prices-head h2 { font-size: 2.2rem; margin-top: 12px; }
.price-grid { display: grid; gap: 16px; }
@media (min-width: 620px) { .price-grid { grid-template-columns: 1fr 1fr; } }
.price-card { padding: 24px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); transition: border-color .2s; }
.price-card:hover { border-color: var(--accent); }
.price-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.price-head h3 { font-size: 1.2rem; }
.price { font-family: var(--head); color: var(--accent-text); font-size: 1.05rem; font-weight: 600; white-space: nowrap; }
.price-card p { font-size: .88rem; }
/* gallery */
.gallery { background: var(--alt); }
.gallery-head { text-align: center; margin-bottom: 40px; }
.gallery-head h2 { font-size: 2.2rem; margin-top: 12px; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.g-item { position: relative; aspect-ratio: 4/5; overflow: hidden; border-radius: 8px; cursor: pointer; background: #000; }
.g-item img, .g-item video { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.g-item:hover img { transform: scale(1.04); }
.play-badge { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(15,15,20,.7); display: flex; align-items: center; justify-content: center; }
.play-badge svg { width: 13px; height: 13px; fill: #fff; }
/* booking */
.booking { background: var(--dark); color: var(--dark-text); }
.booking-head { text-align: center; margin-bottom: 40px; }
.booking-head h2 { color: #fff; font-size: 2.2rem; margin-top: 12px; }
.booking-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.booking-grid { display: grid; grid-template-columns: 1fr; }
@media (min-width: 720px) { .booking-grid { grid-template-columns: 2fr 3fr; } }
.booking-info { background: var(--card); padding: 32px 28px; }
.booking-info h3 { color: var(--accent-text); font-size: 1rem; margin-bottom: 22px; }
.info-row { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px; }
.info-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: .92; }
.info-icon svg { width: 17px; height: 17px; }
.info-row h4 { font-size: .8rem; margin-bottom: 4px; color: #fff; font-family: var(--body); font-weight: 600; }
.info-row p, .info-row a { font-size: .85rem; color: var(--dark-text); opacity: .78; }
.info-row a:hover { opacity: 1; color: var(--accent); }
.booking-note { border-top: 1px solid var(--border); margin-top: 20px; padding-top: 18px; font-size: .74rem; opacity: .55; }
.booking-form { padding: 32px 28px; }
.form-row { display: grid; gap: 12px; margin-bottom: 14px; }
.form-row.two { grid-template-columns: 1fr 1fr; }
@media (max-width: 520px) { .form-row.two { grid-template-columns: 1fr; } }
.field label { display: block; font-size: .66rem; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); margin-bottom: 6px; }
.field input, .field select, .field textarea { width: 100%; padding: 12px 13px; border-radius: 9px; border: 1px solid var(--border); background: var(--alt); font-family: inherit; font-size: .9rem; color: var(--text); outline: none; }
.field textarea { resize: vertical; min-height: 76px; }
.submit { width: 100%; justify-content: center; }
/* contact */
.contact-grid { display: grid; gap: 40px; }
@media (min-width: 700px) { .contact-grid { grid-template-columns: 1fr 1fr; } }
.contact-block { margin-bottom: 26px; }
.contact-block h3 { font-size: .66rem; text-transform: uppercase; letter-spacing: .2em; color: var(--muted); margin-bottom: 10px; font-family: var(--body); font-weight: 600; }
.contact-block p, .contact-block a { font-size: .98rem; }
.contact-block a:hover { color: var(--accent-text); }
.social-row { display: flex; gap: 12px; }
.social-row a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted); }
.social-row a:hover { color: #fff; background: var(--accent); border-color: var(--accent); }
.social-row svg { width: 17px; height: 17px; fill: currentColor; }
.map { border-radius: 12px; overflow: hidden; min-height: 300px; height: 100%; }
.map iframe { width: 100%; height: 100%; min-height: 300px; border: 0; }
/* footer */
footer.site { background: var(--footer); color: #fff; padding: 60px 24px 34px; }
.footer-grid { display: grid; gap: 32px; max-width: 1040px; margin: 0 auto; }
@media (min-width: 700px) { .footer-grid { grid-template-columns: repeat(3, 1fr); } }
.footer-grid h3 { font-size: 1.6rem; }
.footer-sub { color: rgba(255,255,255,.5); font-size: .66rem; text-transform: uppercase; letter-spacing: .16em; }
.footer-grid h4 { font-size: .66rem; text-transform: uppercase; letter-spacing: .18em; color: rgba(255,255,255,.5); margin-bottom: 12px; font-family: var(--body); font-weight: 500; }
.footer-grid p, .footer-grid a { color: rgba(255,255,255,.75); font-size: .88rem; margin-bottom: 6px; }
.footer-grid a:hover { color: var(--accent); }
.footer-bottom { margin-top: 40px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; align-items: center; max-width: 1040px; margin-left: auto; margin-right: auto; }
.copy { font-size: .74rem; color: rgba(255,255,255,.45); }
/* lightbox + whatsapp */
.lightbox { position: fixed; inset: 0; background: rgba(5,5,8,.94); display: none; align-items: center; justify-content: center; z-index: 100; cursor: zoom-out; }
.lightbox.open { display: flex; }
.lightbox img, .lightbox video { max-width: 92vw; max-height: 88vh; border-radius: 10px; }
.wa-float { position: fixed; bottom: 18px; right: 18px; z-index: 90; width: 52px; height: 52px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px -8px rgba(37,211,102,.7); }
.wa-float svg { width: 26px; height: 26px; fill: #fff; }
`
}

function buildHeader(business: SiteConfig['business'], sectorLabel: string): string {
  const name = esc(business.name.trim())
  return `
<header class="site">
  <div class="inner">
    <a href="#about" class="brand">
      ${business.logo ? `<img src="${business.logo.dataUrl}" alt="Logo ${name}">` : `<span class="fallback">${(name || 'V').charAt(0).toUpperCase()}</span>`}
      <span><span class="brand-name">${name || 'Votre entreprise'}</span>${sectorLabel ? `<div class="brand-sub">${esc(sectorLabel)}</div>` : ''}</span>
    </a>
    <nav class="desktop">
      <a href="#about">À propos</a>
      <a href="#services">Services</a>
      <a href="#prices">Tarifs</a>
      <a href="#gallery">Galerie</a>
      <a href="#booking">Réservation</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>`
}

function buildHero(config: SiteConfig, sectorLabel: string): string {
  const name = esc(config.business.name.trim())
  const photo = config.gallery.find((g) => g.type === 'image')?.dataUrl
  const phone = config.contact.phone
  const wa = waLink(phone, `Bonjour ${name}, je vous contacte depuis votre site internet.`)
  return `
<section class="hero" id="about">
  ${photo ? `<div class="bg" style="background-image:url('${photo}')"></div>` : ''}
  <div class="hero-inner">
    <span class="eyebrow dark">${esc(sectorLabel || 'Bienvenue')}</span>
    <h1>${name || 'Votre entreprise'}</h1>
    <p>${esc(config.business.description || 'Découvrez nos services et nos réalisations.')}</p>
    <div class="hero-ctas">
      <a href="#booking" class="btn">Réserver</a>
      ${phone ? `<a href="${wa}" target="_blank" rel="noopener" class="btn outline">WhatsApp</a>` : ''}
    </div>
  </div>
</section>`
}

function buildAbout(config: SiteConfig, sectorLabel: string): string {
  const description = config.business.description.trim()
  return `
<section class="section">
  <div class="container about-grid">
    <span class="eyebrow">À propos</span>
    <div>
      ${description ? `<p>${esc(description)}</p>` : ''}
      <p>Votre site vitrine présente vos services, vos tarifs et votre galerie — et permet à vos clients de vous contacter en un clic via WhatsApp.</p>
      ${config.contact.address ? `<div class="footnote">${esc(sectorLabel)} · Localisation : ${esc(config.contact.address)}</div>` : ''}
    </div>
  </div>
</section>`
}

function buildMosaic(config: SiteConfig): string {
  const photos = config.gallery.filter((g) => g.type === 'image')
  if (photos.length < 3) return ''
  const [a, b, c] = photos
  return `
<div class="mosaic">
  <div class="container mosaic-grid">
    <div class="mosaic-large"><img src="${a.dataUrl}" alt="Travail 1"></div>
    <div class="mosaic-stack">
      <div><img src="${b.dataUrl}" alt="Travail 2"></div>
      ${c ? `<div><img src="${c.dataUrl}" alt="Travail 3"></div>` : ''}
    </div>
  </div>
</div>`
}

function buildServicesPrices(config: SiteConfig): string {
  const videos = config.gallery.filter((g) => g.type === 'video')
  const services = config.services.filter((s) => s.name.trim())
  const media = videos.length
    ? `<div class="media">${videos.slice(0, 2).map((v) => `<video src="${v.dataUrl}" muted loop playsinline preload="metadata"></video>`).join('')}</div>`
    : ''
  const prices = services.length
    ? `<section class="section" id="prices">
      <div class="container">
        <div class="prices-head"><span class="eyebrow">Tarifs</span><h2>Nos prix</h2></div>
        <div class="price-grid">${services
          .map(
            (s) => `<div class="price-card"><div class="price-head"><h3>${esc(s.name)}</h3>${s.price ? `<span class="price">${esc(s.price)}</span>` : ''}</div>${s.description ? `<p>${esc(s.description)}</p>` : ''}</div>`
          )
          .join('')}</div>
      </div>
    </section>`
    : ''
  return `
<section class="section services" id="services">
  <div class="container services-grid">
    <div>
      <span class="eyebrow dark">Services</span>
      <h2>Nos services</h2>
      <ul>
        <li><span class="tick">✓</span>Un travail soigné, à votre écoute du début à la fin</li>
        <li><span class="tick">✓</span>Sur rendez-vous pour vous accorder le temps qu’il faut</li>
        <li><span class="tick">✓</span>Conseils personnalisés et produits de qualité professionnelle</li>
      </ul>
      ${services.length ? `<a href="#prices" class="btn outline">Voir les tarifs</a>` : ''}
    </div>
    <div>${media}</div>
  </div>
</section>${prices}`
}

function buildGallery(config: SiteConfig): string {
  const photos = config.gallery.filter((g) => g.type === 'image')
  if (photos.length === 0) return ''
  return `
<section class="section gallery" id="gallery">
  <div class="container">
    <div class="gallery-head"><span class="eyebrow">Galerie</span><h2>Nos réalisations</h2></div>
    <div class="gallery-grid">
      ${photos.map((p, i) => `<div class="g-item" data-lightbox="1" data-src="${p.dataUrl}"><img src="${p.dataUrl}" alt="${esc(p.name || `Photo ${i + 1}`)}" loading="lazy"></div>`).join('')}
    </div>
  </div>
</section>`
}

function buildBooking(config: SiteConfig): string {
  const { phone, email, address, hours } = config.contact
  const services = config.services.filter((s) => s.name.trim())
  const serviceOptions = services.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('')
  return `
<section class="section booking" id="booking">
  <div class="container">
    <div class="booking-head"><span class="eyebrow dark">Réservation</span><h2>Demande de rendez-vous</h2></div>
    <div class="booking-card">
      <div class="booking-grid">
        <div class="booking-info">
          <h3>Informations pratiques</h3>
          ${hours ? `<div class="info-row"><span class="info-icon">${clockIcon}</span><div><h4>Horaires</h4><p>${esc(hours)}</p></div></div>` : ''}
          ${phone ? `<div class="info-row"><span class="info-icon">${phoneIcon}</span><div><h4>Téléphone / WhatsApp</h4><a href="${waLink(phone)}" target="_blank" rel="noopener">${esc(phone)}</a></div></div>` : ''}
          ${address ? `<div class="info-row"><span class="info-icon">${pinIcon}</span><div><h4>Adresse</h4><p>${esc(address)}</p></div></div>` : ''}
          <p class="booking-note">Votre demande est envoyée directement sur WhatsApp — réponse rapide garantie.</p>
        </div>
        <form class="booking-form" id="booking-form">
          <div class="form-row">
            <div class="field"><label for="b-name">Nom</label><input id="b-name" name="name" required placeholder="Votre nom"></div>
            <div class="field"><label for="b-phone">Téléphone</label><input id="b-phone" name="phone" type="tel" placeholder="06 12 34 56 78"></div>
          </div>
          <div class="form-row two">
            ${services.length ? `<div class="field"><label for="b-service">Service</label><select id="b-service" name="service">${serviceOptions}</select></div>` : ''}
            <div class="field"><label for="b-date">Date souhaitée</label><input id="b-date" name="date" type="date"></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="b-notes">Message</label><textarea id="b-notes" name="notes" placeholder="Votre message, vos questions…"></textarea></div>
          </div>
          <button type="submit" class="btn submit">${waIcon}Envoyer la demande</button>
        </form>
      </div>
    </div>
  </div>
</section>`
}

function buildContact(config: SiteConfig): string {
  const { phone, email, address, hours, instagram, facebook } = config.contact
  const ig = instagramUrl(instagram)
  const fb = facebookUrl(facebook)
  const socials = [
    ig ? `<a href="${ig}" target="_blank" rel="noopener" aria-label="Instagram">${instaSvg}</a>` : '',
    fb ? `<a href="${fb}" target="_blank" rel="noopener" aria-label="Facebook">${fbSvg}</a>` : '',
  ].join('')
  return `
<section class="section" id="contact">
  <div class="container contact-grid">
    <div>
      <span class="eyebrow">Contact</span>
      <div class="contact-block" style="margin-top:14px"><h3>Horaires</h3><p>${esc(hours || 'Sur rendez-vous')}</p></div>
      ${phone ? `<div class="contact-block"><h3>Téléphone / WhatsApp</h3><a href="${waLink(phone)}" target="_blank" rel="noopener">${esc(phone)}</a></div>` : ''}
      ${email ? `<div class="contact-block"><h3>Email</h3><p>${esc(email)}</p></div>` : ''}
      ${address ? `<div class="contact-block"><h3>Adresse</h3><p>${esc(address)}</p></div>` : ''}
      ${socials ? `<div class="contact-block"><h3>Réseaux sociaux</h3><div class="social-row">${socials}</div></div>` : ''}
    </div>
    ${address ? `<div class="map"><iframe src="${mapsEmbedUrl(address)}" title="Carte Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>` : ''}
  </div>
</section>`
}

function buildFooter(config: SiteConfig): string {
  const { phone, email, hours } = config.contact
  const name = esc(config.business.name.trim())
  return `
<footer class="site">
  <div class="footer-grid">
    <div><h3>${name || 'Votre entreprise'}</h3><div class="footer-sub">${esc(SECTORS.find((s) => s.id === config.business.sector)?.label || 'Site vitrine')}</div></div>
    <div><h4>Horaires</h4><p>${esc(hours || 'Sur rendez-vous')}</p></div>
    <div><h4>Contact</h4>${phone ? `<p><a href="${waLink(phone)}" target="_blank" rel="noopener">${esc(phone)}</a></p>` : ''}${email ? `<p>${esc(email)}</p>` : ''}</div>
  </div>
  <div class="footer-bottom">
    <p class="copy">© ${new Date().getFullYear()} ${name || 'Votre entreprise'}</p>
    <p class="copy">Site créé avec newappai</p>
  </div>
</footer>`
}

const clockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`
const phoneIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
const pinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
const instaSvg = `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
const fbSvg = `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`

const siteScript = `
(function () {
  // Formulaire de réservation → WhatsApp
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var lines = ['Bonjour, je souhaite prendre rendez-vous.'];
      if (f.name && f.name.value) lines.push('Nom : ' + f.name.value);
      if (f.phone && f.phone.value) lines.push('Téléphone : ' + f.phone.value);
      if (f.service && f.service.value) lines.push('Service : ' + f.service.value);
      if (f.date && f.date.value) lines.push('Date souhaitée : ' + f.date.value);
      if (f.notes && f.notes.value) lines.push('Notes : ' + f.notes.value);
      var href = document.querySelector('[data-wa]');
      var base = href ? href.getAttribute('href').split('?')[0] : '';
      if (base) window.open(base + '?text=' + encodeURIComponent(lines.join('\\n')), '_blank');
    });
  }
  // Lightbox galerie
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach(function (el) {
      el.addEventListener('click', function () {
        var src = el.getAttribute('data-src');
        lightbox.innerHTML = '<img src="' + src + '" alt="Aperçu">';
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function () { lightbox.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }
  // Lecture des vidéos au survol (services)
  document.querySelectorAll('video').forEach(function (v) {
    v.addEventListener('mouseenter', function () { v.play(); });
    v.addEventListener('mouseleave', function () { v.pause(); });
  });
})();
`

/** Construit le fichier HTML complet du site vitrine. */
export function buildSiteHtml(config: SiteConfig): string {
  const theme = buildTheme(config.design)
  const sectorLabel = SECTORS.find((s) => s.id === config.business.sector)?.label || ''
  const name = config.business.name.trim()
  const phone = config.contact.phone
  const wa = waLink(phone)
  const font = theme.headingFont && theme.bodyFont

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(name || 'Votre entreprise')}${sectorLabel ? ' — ' + esc(sectorLabel) : ''}</title>
<meta name="description" content="${esc((config.business.description || 'Site vitrine one-page.').slice(0, 160))}">
${font ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${theme.fontsHref}" rel="stylesheet">` : ''}
<style>${buildCss(theme)}</style>
</head>
<body>
${buildHeader(config.business, sectorLabel)}
${buildHero(config, sectorLabel)}
${buildAbout(config, sectorLabel)}
${buildMosaic(config)}
${buildServicesPrices(config)}
${buildGallery(config)}
${buildBooking(config)}
${buildContact(config)}
${buildFooter(config)}
${phone ? `<a href="${wa}" data-wa target="_blank" rel="noopener" class="wa-float" aria-label="Contact via WhatsApp">${waIcon.replace('width="18" height="18" style="vertical-align:-3px;margin-right:8px"', 'width="26" height="26"')}</a>` : ''}
<div class="lightbox" id="lightbox" aria-label="Aperçu"></div>
<script>
${siteScript}
</script>
</body>
</html>`
}

/** Télécharge le site généré en fichier HTML autonome. */
export function downloadSite(config: SiteConfig): void {
  const html = buildSiteHtml(config)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(config.business.name.trim()) || 'mon-site'}.html`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
