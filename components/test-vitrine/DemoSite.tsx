'use client'

/**
 * DemoSite — composition statique et ORDONNÉE des 12 sections reproduisant
 * le design réel livré aux clients (référence webolharosol). Contrat fixé
 * (identique à PreviewSite) : { config, anchorPrefix? }.
 *
 * Décision Antoine (non négociable) : `config.design` (palettes du wizard)
 * est IGNORÉ — l'identité or/neutral de la référence est épinglée en dur
 * via demo-tokens.ts, quel que soit le thème choisi dans le wizard.
 *
 * Perf temps réel : les sliders (Hero/Gallery) dérivent leur dépendance
 * d'effet d'une chaîne stable (`photos.join('|')`) plutôt que de la
 * référence du tableau — `config` est recalculé à chaque frappe côté
 * page.tsx, donc `photos` change de référence sans changer de contenu ; ceci
 * évite de relancer l'autoplay/remonter le slider à chaque caractère tapé.
 */

import { useMemo } from 'react'
import { SECTORS, type SiteConfig } from '../webdesign/types'
import { DEMO_TOKENS } from './demo-tokens'
import { getDemoContent, getDemoLabels } from './demo-content'
import DemoHeader from './sections/DemoHeader'
import DemoHero from './sections/DemoHero'
import DemoAbout from './sections/DemoAbout'
import DemoMosaic from './sections/DemoMosaic'
import DemoTakeaway from './sections/DemoTakeaway'
import DemoMenu from './sections/DemoMenu'
import DemoParallax from './sections/DemoParallax'
import DemoGallery from './sections/DemoGallery'
import DemoBooking from './sections/DemoBooking'
import DemoContact from './sections/DemoContact'
import DemoFooter from './sections/DemoFooter'
import DemoBadge from './sections/DemoBadge'

const ROOT_CSS = `
.demo-root { background: var(--demo-color-white); color: var(--demo-color-neutral-900); font-family: var(--demo-font-sans); scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
.demo-root *, .demo-root *::before, .demo-root *::after { box-sizing: border-box; }
.demo-root img { max-width: 100%; }
/* Apparition progressive : le site se "construit" section par section
   (retour Antoine — la construction pas a pas, pas l'affichage instantane) */
.demo-root > * { opacity: 0; animation: demoReveal .55s cubic-bezier(.22,.61,.36,1) forwards; }
.demo-root > *:nth-child(1) { animation-delay: .05s; }
.demo-root > *:nth-child(2) { animation-delay: .25s; }
.demo-root > *:nth-child(3) { animation-delay: .45s; }
.demo-root > *:nth-child(4) { animation-delay: .65s; }
.demo-root > *:nth-child(5) { animation-delay: .85s; }
.demo-root > *:nth-child(6) { animation-delay: 1.05s; }
.demo-root > *:nth-child(7) { animation-delay: 1.25s; }
.demo-root > *:nth-child(8) { animation-delay: 1.45s; }
.demo-root > *:nth-child(9) { animation-delay: 1.65s; }
.demo-root > *:nth-child(10) { animation-delay: 1.85s; }
.demo-root > *:nth-child(11) { animation-delay: 2.05s; }
.demo-root > *:nth-child(12) { animation-delay: 2.25s; }
@keyframes demoReveal { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
`

export default function DemoSite({
  config,
  anchorPrefix = 'demo',
}: {
  config: SiteConfig
  anchorPrefix?: string
}) {
  const photos = useMemo(
    () =>
      config.gallery
        .filter((g) => g.type === 'image')
        .map((g) => g.url || g.dataUrl)
        .filter(Boolean),
    [config.gallery],
  )

  const content = getDemoContent(config.business.sector)
  const labels = getDemoLabels(config.language)
  const sectorLabel = SECTORS.find((s) => s.id === config.business.sector)?.label || ''
  const name = config.business.name.trim() || 'Votre entreprise'
  const fallbackTagline = content.tagline.replace('{nom}', name)

  const filledServices = config.services.filter((s) => s.name.trim())
  const menuServices =
    filledServices.length > 0
      ? filledServices
      : content.services.map((s, i) => ({ id: `demo-fallback-${i}`, name: s.name, description: s.description }))

  const { phone, email, address, hours, instagram, facebook } = config.contact

  return (
    <div className="demo-root" style={DEMO_TOKENS}>
      <style dangerouslySetInnerHTML={{ __html: ROOT_CSS }} />

      <DemoHeader name={name} sectorLabel={sectorLabel} anchorPrefix={anchorPrefix} labels={labels} />
      <DemoHero photos={photos} />
      <DemoAbout
        name={name}
        description={config.business.description}
        fallbackTagline={fallbackTagline}
        address={address}
        anchorPrefix={anchorPrefix}
        labels={labels}
      />
      <DemoMosaic photos={photos} />
      <DemoTakeaway highlights={content.highlights} anchorPrefix={anchorPrefix} labels={labels} />
      <DemoMenu services={menuServices} anchorPrefix={anchorPrefix} labels={labels} />
      <DemoParallax photos={photos} />
      <DemoGallery photos={photos} anchorPrefix={anchorPrefix} labels={labels} />
      <DemoBooking phone={phone} hours={hours} address={address} anchorPrefix={anchorPrefix} labels={labels} />
      <DemoContact
        hours={hours}
        phone={phone}
        email={email}
        address={address}
        instagram={instagram}
        facebook={facebook}
        anchorPrefix={anchorPrefix}
        labels={labels}
      />
      <DemoFooter
        name={name}
        sectorLabel={sectorLabel}
        hours={hours}
        phone={phone}
        email={email}
        instagram={instagram}
        facebook={facebook}
        labels={labels}
      />
      <DemoBadge labels={labels} />
    </div>
  )
}
