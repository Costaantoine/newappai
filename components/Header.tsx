'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'

interface NavProduct {
  slug: string
  title: string
}

// Catalogue réel des 15 produits (titre + slug /produits/[slug]).
// Statique par choix : l'API /api/supabase/products ne renvoie pas de champ
// `slug` (absent du modèle Prisma Product), donc ces valeurs ne peuvent pas
// être dérivées de manière fiable côté client — ce sont les slugs réels du
// catalogue, fournis tels quels plutôt qu'inventés.
const NAV_PRODUCTS: NavProduct[] = [
  { slug: 'click-and-collect', title: 'Click and Collect' },
  { slug: 'easyreadvoice', title: 'EasyReadVoice - Texte vers Audio' },
  { slug: 'easyreadvoice-standard', title: 'EasyReadVoice - Texte vers Audio (Standard)' },
  { slug: 'easyreadvoice-essentiel', title: 'EasyReadVoice - Texte vers Audio (Essentiel)' },
  { slug: 'easyreadvoice-player', title: 'EasyReadVoice Player' },
  { slug: 'serenite', title: 'Sérénité - Communication Apaisée' },
  { slug: 'talkie-walkie-connecte', title: 'Talkie Walkie Connecté' },
  { slug: 'click-and-delivery', title: 'Click and Delivery' },
  { slug: 'chatbot-client-intelligent', title: 'Chatbot Client Intelligent' },
  { slug: 'creation-de-site-vitrine', title: 'Création de Site Vitrine clé en main' },
  { slug: 'redesign-de-site-vitrine', title: 'Redesign de Site Vitrine' },
  { slug: 'paperasse', title: 'Paperasse — Services IA pour votre entreprise' },
  { slug: 'easyreadvoice-texte-vers-audio', title: 'EasyReadVoice - Texte vers Audio' },
  { slug: 'qrcall-scan-call', title: 'QRcall - Scan & Call' },
  { slug: 'application-de-gestion-de-production', title: 'Application de Gestion de Production' },
]

export default function Header() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const { settings } = useSettings()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const products = NAV_PRODUCTS
  const logoMenuRef = useRef<HTMLDivElement>(null)
  const productsMenuRef = useRef<HTMLDivElement>(null)
  const productsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openProductsMenu = () => {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current)
    setProductsMenuOpen(true)
  }

  const scheduleCloseProductsMenu = () => {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current)
    productsCloseTimer.current = setTimeout(() => setProductsMenuOpen(false), 150)
  }

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current)
    }
  }, [])

  // Ferme les menus déroulants au clic extérieur. Un simple overlay
  // `fixed inset-0` ne fonctionne pas ici : le `backdrop-filter` du header
  // crée un containing block pour les descendants `position: fixed`, qui se
  // retrouvent alors confinés à la hauteur du header (~44px) au lieu de
  // couvrir tout le viewport.
  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuOpen && logoMenuRef.current && !logoMenuRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [menuOpen])

  useEffect(() => {
    if (!productsMenuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (productsMenuRef.current && !productsMenuRef.current.contains(target)) {
        setProductsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [productsMenuOpen])

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    isActive(path) ? 'text-[#2997ff] transition' : 'hover:text-[#2997ff] transition'

  const getImageUrl = (val: string): string => {
    if (!val) return ''
    try {
      const parsed = JSON.parse(val)
      const url = parsed.original || parsed.thumbnail || val
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
      className={`fixed w-full z-50 px-8 flex justify-between items-center site-header site-nav ${compact ? 'nav-compact py-2' : 'py-4'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'saturate(180%) blur(20px)' }}
    >
      <div className="relative" ref={logoMenuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col leading-tight text-left"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="apple-dropdown-menu"
        >
          <span className="text-white text-3xl font-bold tracking-tighter">NewAppAi</span>
          <span className="text-xs text-white/50 font-normal -mt-0.5">{t.nav?.tagline || 'by premiumajusteprix'}</span>
        </button>

        {menuOpen && (
            <nav
              id="apple-dropdown-menu"
              className="absolute top-full left-0 mt-3 w-80 max-h-[70vh] overflow-y-auto rounded-lg bg-[#1d1d1f] py-4 z-50"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px' }}
            >
              <Link href="/" onClick={() => setMenuOpen(false)} className="block px-6 py-2 text-[17px] text-white hover:text-[#2997ff] transition">
                {t.nav.home}
              </Link>
              <div className="px-6 pt-4 pb-1 text-[12px] uppercase tracking-wide text-white/40">
                {t.nav.products}
              </div>
              {products.length > 0 ? (
                products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/produits/${p.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-1.5 text-[14px] text-white/80 hover:text-[#2997ff] transition"
                  >
                    {p.title || p.slug}
                  </Link>
                ))
              ) : (
                <Link href="/produits" onClick={() => setMenuOpen(false)} className="block px-6 py-1.5 text-[14px] text-white/80 hover:text-[#2997ff] transition">
                  {t.nav.products}
                </Link>
              )}
              <div className="mt-3 pt-3 border-t border-white/10">
                <Link href="/about" onClick={() => setMenuOpen(false)} className="block px-6 py-2 text-[17px] text-white hover:text-[#2997ff] transition">
                  {t.nav.about}
                </Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="block px-6 py-2 text-[17px] text-white hover:text-[#2997ff] transition">
                  {t.nav.contact}
                </Link>
              </div>
            </nav>
        )}
      </div>

      {/* Barre de navigation visible (desktop) */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
        <Link href="/" className={`${linkClass('/')} transition`}>
          {t.nav.home}
        </Link>

        <div
          className="relative"
          ref={productsMenuRef}
          onMouseEnter={openProductsMenu}
          onMouseLeave={scheduleCloseProductsMenu}
        >
          <button
            onClick={() => setProductsMenuOpen((v) => !v)}
            className={`${linkClass('/produits')} transition flex items-center gap-1`}
            aria-haspopup="true"
            aria-expanded={productsMenuOpen}
            aria-controls="products-dropdown-menu"
          >
            {t.nav.products}
            <svg className={`w-3 h-3 transition-transform ${productsMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {productsMenuOpen && (
            <div
              id="products-dropdown-menu"
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 max-h-[70vh] overflow-y-auto rounded-lg bg-[#1d1d1f] py-4 z-50"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px' }}
            >
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/produits/${p.slug}`}
                  onClick={() => setProductsMenuOpen(false)}
                  className="block px-6 py-1.5 text-[14px] text-white/80 hover:text-[#2997ff] transition"
                >
                  {p.title || p.slug}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-white/10">
                <Link
                  href="/produits"
                  onClick={() => setProductsMenuOpen(false)}
                  className="block px-6 py-1.5 text-[14px] font-medium text-white hover:text-[#2997ff] transition"
                >
                  {t.nav.products} →
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/about" className={`${linkClass('/about')} transition`}>
          {t.nav.about}
        </Link>
        <Link href="/contact" className={`${linkClass('/contact')} transition`}>
          {t.nav.contact}
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        {/* Hamburger mobile */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white/70 hover:text-white transition p-1" title="Menu" aria-label="Ouvrir le menu de navigation" aria-expanded={mobileMenuOpen} aria-controls="mobile-nav">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
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
            }} className="text-white/60 hover:text-[#2997ff] transition" title={t.nav?.search || 'Rechercher'} aria-label={t.nav?.search || 'Rechercher'}>
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
              className="w-0 opacity-0 px-0 transition-all duration-300 bg-[#1d1d1f] border-0 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-[#0071e3] absolute right-full mr-2 top-1/2 -translate-y-1/2 h-8" />
          </div>
        )}
        {settings?.header?.show_cart && (
          <button onClick={() => window.dispatchEvent(new Event('open-cart'))} className="text-white/60 hover:text-[#2997ff] transition" title={t.nav?.cart || 'Panier'} aria-label={t.nav?.cart || 'Panier'}>
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
                    ? 'bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/40'
                    : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/80'
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
          className="p-2 text-white/60 hover:text-[#2997ff] transition rounded-full hover:bg-white/5"
          aria-label={t.nav?.admin || "Panneau d'administration"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <nav id="mobile-nav" className="absolute top-full left-0 right-0 md:hidden bg-[#1d1d1f]/95 backdrop-blur-xl py-6 px-8 flex flex-col space-y-4 text-sm font-medium text-white/80">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`${linkClass('/')} nav-link py-2`}>{t.nav.home}</Link>
          <Link href="/produits" onClick={() => setMobileMenuOpen(false)} className={`${linkClass('/produits')} nav-link py-2`}><span data-section="nav-products">{t.nav.products}</span></Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`${linkClass('/about')} nav-link py-2`}>{t.nav.about}</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`${linkClass('/contact')} nav-link py-2`}>{t.nav.contact}</Link>
        </nav>
      )}
    </header>
  )
}
