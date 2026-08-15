'use client'

/**
 * Hero — slider 100 % image, SANS texte (ref: #home hero slider h-[70vh]).
 * `translateX(-n*100%)` sur le conteneur (pas 100vw — on est dans un frame
 * de démo, pas en pleine page). Autoplay 4s / transition .6s (a.3).
 */

import { useEffect, useRef, useState } from 'react'

const CSS = `
.demo-hero { position: relative; height: 55vh; min-height: 320px; max-height: 620px; overflow: hidden; background: var(--demo-color-neutral-50); }
.demo-hero-track { display: flex; height: 100%; transition: transform var(--demo-time-hero-transition) ease; }
.demo-hero-slide { flex: 0 0 100%; height: 100%; background-size: cover; background-position: center; }
.demo-hero-overlay { position: absolute; inset: 0; background: var(--demo-overlay-black-10); pointer-events: none; }
.demo-hero-dots { position: absolute; bottom: 1.5rem; left: 0; right: 0; display: flex; justify-content: center; gap: 0.5rem; }
.demo-hero-dot { width: 8px; height: 8px; border-radius: var(--demo-radius-full); background: rgba(255,255,255,0.5); border: none; padding: 0; cursor: pointer; transition: background var(--demo-time-hover) ease, transform var(--demo-time-hover) ease; }
.demo-hero-dot--active { background: rgba(255,255,255,0.9); transform: scale(1.2); }
`

export default function DemoHero({ photos }: { photos: string[] }) {
  const slides = photos.slice(0, 3)
  const photosKey = slides.join('|')
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setIndex(0)
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosKey])

  return (
    <section className="demo-hero" aria-label="Galerie photo">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {slides.length > 0 ? (
        <>
          <div className="demo-hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((src, i) => (
              <div key={`${src}-${i}`} className="demo-hero-slide" style={{ backgroundImage: `url("${src}")` }} />
            ))}
          </div>
          <div className="demo-hero-overlay" />
          {slides.length > 1 && (
            <div className="demo-hero-dots">
              {slides.map((src, i) => (
                <button
                  key={`${src}-dot-${i}`}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  className={`demo-hero-dot${i === index ? ' demo-hero-dot--active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
