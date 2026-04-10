'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'

export default function Header() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const { settings } = useSettings()

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
      className={`fixed w-full z-50 py-4 px-8 flex justify-between items-center border-b border-white/10 ${settings?.header?.sticky ? '' : 'relative'}`}
      style={headerStyle}
    >
      <div className="text-2xl font-bold tracking-tighter">
        <Link href="/" className="flex items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <>
              <span className="text-white">{settings?.site?.logo_text || 'NewApp'}</span>
              <span className="text-[var(--color-primary)]">AI</span>
            </>
          )}
        </Link>
      </div>
      <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
        <Link href="/" className={linkClass('/')}>{t.nav.home}</Link>
        <Link href="/solutions" className={linkClass('/solutions')}>{t.nav.solutions}</Link>
        <Link href="/produits" className={linkClass('/produits')}>Produits</Link>
        <Link href="/about" className={linkClass('/about')}>{t.nav.about}</Link>
        <Link href="/contact" className={linkClass('/contact')}>{t.nav.contact}</Link>
      </nav>
      <div className="flex items-center space-x-4">
        {settings?.header?.show_search && (
          <button className="text-slate-400 hover:text-[var(--color-primary)] transition" title="Rechercher">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        {settings?.header?.show_cart && (
          <Link href="/cart" className="text-slate-400 hover:text-[var(--color-primary)] transition" title="Panier">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        )}
        {settings?.header?.show_language && (
          <select
            className="bg-transparent text-xs border-none text-slate-400 outline-none cursor-pointer"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            title="Sélecteur de langue"
          >
            <option className="bg-slate-900" value="fr">FR</option>
            <option className="bg-slate-900" value="en">EN</option>
            <option className="bg-slate-900" value="pt">PT</option>
            <option className="bg-slate-900" value="es">ES</option>
          </select>
        )}
        <Link
          href="/admin/login"
          className="p-2 text-slate-400 hover:text-[var(--color-primary)] transition border border-white/10 rounded-full hover:bg-white/5"
          title="Admin"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
