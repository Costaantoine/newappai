'use client'

/**
 * Mosaïque — ref: py-20 neutral-50, grid-cols-12 (7× aspect-[4/5] + 5×2× aspect-[4/3]).
 * Affichée seulement si ≥3 photos (photos[1..3], la photo[0] est déjà le hero).
 */

const CSS = `
.demo-mosaic { padding: var(--demo-space-py20) var(--demo-px); background: var(--demo-color-neutral-50); }
.demo-mosaic-inner { max-width: var(--demo-max-w-7xl); margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
@media (min-width: 768px) { .demo-mosaic-inner { grid-template-columns: repeat(12, 1fr); } }
.demo-mosaic-large { overflow: hidden; border-radius: var(--demo-radius-lg); aspect-ratio: 4 / 5; }
@media (min-width: 768px) { .demo-mosaic-large { grid-column: span 7; } }
.demo-mosaic-stack { display: flex; flex-direction: column; gap: 0.75rem; }
@media (min-width: 768px) { .demo-mosaic-stack { grid-column: span 5; } }
.demo-mosaic-small { overflow: hidden; border-radius: var(--demo-radius-lg); aspect-ratio: 4 / 3; }
.demo-mosaic img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

export default function DemoMosaic({ photos }: { photos: string[] }) {
  if (photos.length < 3) return null
  const large = photos[1]
  const small = [photos[2], photos[3]].filter(Boolean)

  return (
    <section className="demo-mosaic">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-mosaic-inner">
        <div className="demo-mosaic-large">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={large} alt="Réalisation" loading="lazy" />
        </div>
        <div className="demo-mosaic-stack">
          {small.map((src, i) => (
            <div key={`${src}-${i}`} className="demo-mosaic-small">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Réalisation" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
