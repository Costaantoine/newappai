import type { CSSProperties } from 'react'
import styles from './ProduitVisuel.module.css'

// Visuel officiel d'un produit (public/images/produits/, celui de la fiche sur newappai.com),
// présenté en scène pleine largeur, sans bande ni fond flou : la photo remplit toute la scène, haute,
// et est recadrée sur son sujet principal (prop `cadrage`, ordinateur comme téléphone).
// Une phrase tirée du texte de la fiche, dans la police de titre de la page, est posée en bas.
type Props = {
  src: string
  alt: string
  legende?: string
  police?: string // ex. 'var(--cc-font-enseigne)'
  accent?: string
  cadrage?: string // object-position : point de la photo qui reste visible au recadrage
  priority?: boolean
}

export default function ProduitVisuel({ src, alt, legende, police, accent = '#ffffff', cadrage = '50% 40%', priority = false }: Props) {
  const style = { '--pv-accent': accent, '--pv-police': police ? `${police}, system-ui, sans-serif` : 'inherit', '--pv-cadrage': cadrage } as CSSProperties
  const chargement = priority ? 'eager' : 'lazy'
  return (
    <section className={styles.scene} style={style} aria-label={alt}>
      <img className={styles.photo} src={src} alt={alt} width={1408} height={768} loading={chargement} decoding="async" />
      <div className={styles.voile} aria-hidden="true" />
      {legende && (
        <div className={styles.texte}>
          <span className={styles.filet} aria-hidden="true" />
          <p className={styles.legende}>{legende}</p>
        </div>
      )}
    </section>
  )
}
