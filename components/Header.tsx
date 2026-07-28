'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'

export default function Header() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const { settings } = useSettings()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    isActive(path) ? 'text-[var(--color-primary)] transition' : 'hover:text-[var(--color-primary)] transition'

  const headerStyle: React.CSSProperties = {}

  if (settings?.header) {
    if (settings.header.transparent) {
      headerStyle.backgroundColor = 'transparent'
    } else {
      headerStyle.backgroundColor = `var(--color-header-bg, rgba(15, 23, 42, ${(settings.header.background_opacity || 80) / 100}))`
    }
    if (settings.header.blur) {
      headerStyle.backdropFilter = `blur(${settings.header.blur_amount || 10}px)`
    }
    if (settings.header.shadow) {
      headerStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }

    // Header Background Image
    if (settings.header.background_image_url) {
      let val = settings.header.background_image_url
      // inline getImageUrl logic for the background image
      try {
        const parsed = JSON.parse(val)
        val = parsed.original || parsed.thumbnail || val
      } catch { }
      if (val.includes('header_bg')) {
        val = `${val}?t=${Date.now()}`
      }
      headerStyle.backgroundImage = `url('${val}')`
      headerStyle.backgroundSize = 'cover'
      headerStyle.backgroundPosition = 'center'
    }
  }

  const getImageUrl = (val: string): string => {
    if (!val) return ''
    try {
      const parsed = JSON.parse(val)
      const url = parsed.original || parsed.thumbnail || val
      // Add cache buster for fixed logo name
      if (url.includes('logo_site') || url.includes('header_bg')) {
        return `${url}?t=${Date.now()}`
      }
      return url
    } catch {
      if (val.includes('logo_site') || val.includes('header_bg')) {
        return `${val}?t=${Date.now()}`
      }
      return val
    }
  }

  const logoUrl = getImageUrl(settings?.site?.logo_image_url || '')

  return (
    <header
      className={`fixed w-full z-50 py-4 px-8 flex justify-between items-center border-b border-white/10 site-header ${settings?.header?.sticky ? '' : 'relative'}`}
      style={headerStyle}
    >
      <Link href="/">
        <div className="flex flex-col leading-tight">
          <span data-section="header-logo-text" className="text-white text-3xl font-bold tracking-tighter">NewAppAi</span>
          <span data-section="header-tagline" className="text-xs text-slate-400 font-normal -mt-0.5">{t.nav?.tagline || 'by premiumajusteprix'}</span>
        </div>
      </Link>
      <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
        <Link href="/" className={`${linkClass('/')} nav-link`}>{t.nav.home}</Link>
        <Link href="/solutions" className={`${linkClass('/solutions')} nav-link`}>{t.nav.solutions}</Link>
        <Link href="/produits" className={`${linkClass('/produits')} nav-link`}><span data-section="nav-products">{t.nav.products}</span></Link>
        <Link href="/about" className={`${linkClass('/about')} nav-link`}>{t.nav.about}</Link>
        <Link href="/contact" className={`${linkClass('/contact')} nav-link`}>{t.nav.contact}</Link>
      </nav>
      {/* Hamburger mobile */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400 hover:text-white transition p-1" title="Menu" aria-label="Ouvrir le menu de navigation" aria-expanded={menuOpen} aria-controls="mobile-nav">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <div className="flex items-center space-x-4">
        {settings?.header?.show_search && (
          <div className="relative">
            <button onClick={() => {
              const input = document.getElementById('header-search-input')
              if (input) {
                if (input.classList.contains('w-0')) {
                  input.classList.remove('w-0', 'opacity-0', 'px-0')
                  input.classList.add('w-40', 'opacity-100', 'px-3')
                  setTimeout(() => (input as HTMLInputElement).focus(), 100)
                } else {
                  input.classList.add('w-0', 'opacity-0', 'px-0')
                  input.classList.remove('w-40', 'opacity-100', 'px-3')
                }
              }
            }} className="text-slate-400 hover:text-[var(--color-primary)] transition" title={t.nav?.search || 'Rechercher'} aria-label={t.nav?.search || 'Rechercher'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input id="header-search-input"
              type="text" placeholder={t.nav?.search_placeholder || 'Rechercher...'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  const q = (e.target as HTMLInputElement).value.trim()
                  window.location.href = '/recherche?q=' + encodeURIComponent(q)
                }
              }}
              className="w-0 opacity-0 px-0 transition-all duration-300 bg-slate-800 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-violet-500 absolute right-full mr-2 top-1/2 -translate-y-1/2 h-8" />
          </div>
        )}
        {settings?.header?.show_cart && (
          <button onClick={() => window.dispatchEvent(new Event('open-cart'))} className="text-slate-400 hover:text-[var(--color-primary)] transition" title={t.nav?.cart || 'Panier'} aria-label={t.nav?.cart || 'Panier'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        )}
        {settings?.header?.show_language && (
          <div className="flex items-center gap-1.5 mr-2">
            {(['fr', 'en', 'pt', 'es'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all duration-200 uppercase tracking-wider ${
                  lang === code
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm shadow-violet-500/10'
                    : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10 hover:text-slate-300 hover:border-white/10'
                }`}
                aria-label={`Changer la langue en ${code.toUpperCase()}`}
                title={code === 'fr' ? 'Français' : code === 'en' ? 'English' : code === 'pt' ? 'Português' : 'Español'}
              >
                {code}
              </button>
            ))}
          </div>
        )}
        <Link
          href="/admin/login"
          className="p-2 text-slate-400 hover:text-[var(--color-primary)] transition border border-white/10 rounded-full hover:bg-white/5"
          aria-label={t.nav?.admin || "Panneau d'administration"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
      {/* Menu mobile */}
      {menuOpen && (
        <nav id="mobile-nav" className="absolute top-full left-0 right-0 md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 py-6 px-8 flex flex-col space-y-4 text-sm font-medium text-slate-300">
          <Link href="/" onClick={() => setMenuOpen(false)} className={`${linkClass('/')} nav-link py-2`}>{t.nav.home}</Link>
          <Link href="/solutions" onClick={() => setMenuOpen(false)} className={`${linkClass('/solutions')} nav-link py-2`}>{t.nav.solutions}</Link>
          <Link href="/produits" onClick={() => setMenuOpen(false)} className={`${linkClass('/produits')} nav-link py-2`}><span data-section="nav-products">{t.nav.products}</span></Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className={`${linkClass('/about')} nav-link py-2`}>{t.nav.about}</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className={`${linkClass('/contact')} nav-link py-2`}>{t.nav.contact}</Link>
        </nav>
      )}
    </header>
  )
}
