'use client'

/**
 * Parallax — ref: h-[60vh], background-attachment fixed, overlay black/30.
 * `scroll` sous 768px (le fixed parallax est buggé sur iOS — cf. rapport §d.4).
 */

const CSS = `
.demo-parallax { position: relative; height: 45vh; min-height: 260px; background-size: cover; background-position: center; background-attachment: scroll; }
@media (min-width: 768px) { .demo-parallax { height: 60vh; background-attachment: fixed; } }
.demo-parallax-overlay { position: absolute; inset: 0; background: var(--demo-overlay-black-30); }
`

export default function DemoParallax({ photos }: { photos: string[] }) {
  const src = photos[3] ?? photos[0]
  if (!src) return null

  return (
    <section className="demo-parallax" style={{ backgroundImage: `url("${src}")` }} aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-parallax-overlay" />
    </section>
  )
}
