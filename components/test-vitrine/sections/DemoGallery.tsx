'use client'

/**
 * Galerie — ref: py-20 neutral-50, carrousel `perView = innerWidth>=768 ? 3 : 1`,
 * aspect-square, hover:scale-105, autoplay 5s, indicateurs gold, pause au hover.
 */

import { useEffect, useState } from 'react'
import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-gallery { padding: var(--demo-space-py20) var(--demo-px); background: var(--demo-color-neutral-50); }
.demo-gallery-inner { max-width: var(--demo-max-w-7xl); margin: 0 auto; }
.demo-gallery-head { text-align: center; margin-bottom: 2.5rem; }
.demo-gallery-eyebrow { display: block; font-family: var(--demo-font-sans); font-size: var(--demo-text-eyebrow); text-transform: uppercase; letter-spacing: var(--demo-tracking-eyebrow); color: var(--demo-color-gold); margin-bottom: 1rem; }
.demo-gallery-title { font-family: var(--demo-font-serif); font-weight: 300; font-size: var(--demo-text-h-sm); color: var(--demo-color-neutral-900); margin: 0; }
@media (min-width: 768px) { .demo-gallery-title { font-size: var(--demo-text-h-md); } }
.demo-gallery-viewport { overflow: hidden; }
.demo-gallery-track { display: flex; transition: transform var(--demo-time-gallery-transition) ease; }
.demo-gallery-slide { flex-shrink: 0; padding: 0 0.5rem; }
.demo-gallery-frame { aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--demo-radius-lg); }
.demo-gallery-frame img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform var(--demo-time-hover) ease; }
.demo-gallery-frame:hover img { transform: scale(1.05); }
.demo-gallery-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.75rem; }
.demo-gallery-dot { width: 8px; height: 8px; border-radius: var(--demo-radius-full); background: var(--demo-color-neutral-200); border: none; padding: 0; cursor: pointer; transition: background var(--demo-time-hover) ease; }
.demo-gallery-dot--active { background: var(--demo-color-gold); }
`

interface Props {
  photos: string[]
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoGallery({ photos, anchorPrefix, labels }: Props) {
  const photosKey = photos.join('|')
  const [perView, setPerView] = useState(3)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => setPerView(window.innerWidth >= 768 ? 3 : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    setIndex(0)
  }, [photosKey])

  const maxIndex = Math.max(0, photos.length - perView)

  useEffect(() => {
    if (paused || photos.length <= perView) return
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [paused, maxIndex, perView, photosKey, photos.length])

  if (photos.length === 0) return null

  return (
    <section id={`${anchorPrefix}-gallery`} className="demo-gallery" style={{ scrollMarginTop: '5rem' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-gallery-inner">
        <div className="demo-gallery-head">
          <span className="demo-gallery-eyebrow">{labels.galleryEyebrow}</span>
          <h2 className="demo-gallery-title">{labels.galleryTitle}</h2>
        </div>
        <div
          className="demo-gallery-viewport"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="demo-gallery-track"
            style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
          >
            {photos.map((src, i) => (
              <div key={`${src}-${i}`} className="demo-gallery-slide" style={{ flexBasis: `${100 / perView}%` }}>
                <div className="demo-gallery-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Réalisation" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {maxIndex > 0 && (
          <div className="demo-gallery-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Aller au groupe ${i + 1}`}
                className={`demo-gallery-dot${i === index ? ' demo-gallery-dot--active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
