'use client'

/**
 * Header — logo texte serif centré (rétrécit au scroll) + nav ancres + pill
 * gold + burger mobile. Le JS pilote de la référence (.scrolled) est absent
 * du mirror analysé : le seuil de rétrécissement est donc INFÉRÉ via un
 * IntersectionObserver sur une sentinelle (cf. rapport §d.2), pas copié 1:1.
 */

import { useEffect, useRef, useState } from 'react'
import type { DemoLabels } from '../demo-content'

const CSS = `
.demo-header-sentinel { height: 1px; }
.demo-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--demo-color-white);
  border-bottom: 1px solid var(--demo-color-neutral-200);
  transition: padding var(--demo-time-hover) ease;
}
.demo-header-inner {
  max-width: var(--demo-max-w-7xl);
  margin: 0 auto;
  padding: 1.75rem var(--demo-px) 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  transition: padding var(--demo-time-hover) ease;
}
.demo-header--scrolled .demo-header-inner { padding: 0.85rem var(--demo-px); gap: 0.35rem; }
.demo-header-brand { text-align: center; text-decoration: none; }
.demo-header-logo {
  display: block;
  font-family: var(--demo-font-serif);
  font-weight: 300;
  letter-spacing: 0.04em;
  font-size: 1.75rem;
  color: var(--demo-color-neutral-900);
  transition: font-size var(--demo-time-hover) ease;
}
@media (min-width: 768px) { .demo-header-logo { font-size: 3rem; } }
.demo-header--scrolled .demo-header-logo { font-size: 1.25rem; }
.demo-header-sub {
  display: block;
  font-family: var(--demo-font-sans);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--demo-tracking-eyebrow);
  color: var(--demo-color-neutral-500);
  margin-top: 0.35rem;
  transition: opacity var(--demo-time-hover) ease, max-height var(--demo-time-hover) ease;
  overflow: hidden;
}
.demo-header--scrolled .demo-header-sub { opacity: 0; max-height: 0; margin: 0; }
.demo-header-row { display: flex; align-items: center; justify-content: center; gap: 1.75rem; flex-wrap: wrap; }
.demo-header-nav { display: none; gap: 1.75rem; }
@media (min-width: 768px) { .demo-header-nav { display: flex; } }
.demo-header-nav a {
  font-family: var(--demo-font-sans);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: var(--demo-tracking-nav);
  color: var(--demo-color-neutral-600);
  text-decoration: none;
  transition: color var(--demo-time-hover) ease;
}
.demo-header-nav a:hover { color: var(--demo-color-gold); }
.demo-header-pill {
  font-family: var(--demo-font-sans);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: var(--demo-tracking-nav);
  color: var(--demo-color-white);
  background: var(--demo-color-gold);
  padding: 0.65rem 1.5rem;
  border-radius: var(--demo-radius-full);
  text-decoration: none;
  white-space: nowrap;
  transition: filter var(--demo-time-hover) ease;
}
.demo-header-pill:hover { filter: brightness(1.08); }
.demo-header-burger {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
}
@media (min-width: 768px) { .demo-header-burger { display: none; } }
.demo-header-burger span { width: 22px; height: 2px; background: var(--demo-color-neutral-900); display: block; }
.demo-header-mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0 var(--demo-px) 1.5rem;
}
@media (min-width: 768px) { .demo-header-mobile-nav { display: none; } }
.demo-header-mobile-nav a {
  font-family: var(--demo-font-sans);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: var(--demo-tracking-nav);
  color: var(--demo-color-neutral-700, var(--demo-color-neutral-600));
  text-decoration: none;
}
`

interface Props {
  name: string
  sectorLabel: string
  anchorPrefix: string
  labels: DemoLabels
}

export default function DemoHeader({ name, sectorLabel, anchorPrefix, labels }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const anchors = [
    { href: `#${anchorPrefix}-about`, label: labels.navAbout },
    { href: `#${anchorPrefix}-services`, label: labels.navServices },
    { href: `#${anchorPrefix}-gallery`, label: labels.navGallery },
    { href: `#${anchorPrefix}-booking`, label: labels.navBooking },
    { href: `#${anchorPrefix}-contact`, label: labels.navContact },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={sentinelRef} className="demo-header-sentinel" aria-hidden="true" />
      <header className={`demo-header${scrolled ? ' demo-header--scrolled' : ''}`}>
        <div className="demo-header-inner">
          <a href={`#${anchorPrefix}-about`} className="demo-header-brand">
            <span className="demo-header-logo">{name}</span>
            {sectorLabel && <span className="demo-header-sub">{sectorLabel}</span>}
          </a>
          <div className="demo-header-row">
            <nav className="demo-header-nav">
              {anchors.map((a) => (
                <a key={a.href} href={a.href}>{a.label}</a>
              ))}
            </nav>
            <a href={`#${anchorPrefix}-contact`} className="demo-header-pill">{labels.ctaContact}</a>
            <button
              type="button"
              className="demo-header-burger"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="demo-header-mobile-nav">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} onClick={() => setMenuOpen(false)}>{a.label}</a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
