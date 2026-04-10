'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'

interface TextItem {
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

interface Zone {
  id: string
  key: string
  title_key: string
  subtitle_key: string
  badge: string
  color: string
  url: string
  cta_key: string
  active: boolean
  order: number
}

interface Product {
  id: string
  title: string | { fr: string; en: string; pt: string; es: string }
  description: string | { fr: string; en: string; pt: string; es: string }
  price: number
  images: string[]
  category: string
  active: boolean
  order: number
}

function getText(texts: TextItem[], key: string, lang: string, fallback: string = ''): string {
  const found = texts.find(t => t.key === key)
  if (found) {
    const val = found[lang as keyof TextItem]
    if (val && val.trim() !== '') return val
    return (found.fr && found.fr.trim() !== '') ? found.fr : fallback
  }
  return fallback
}

function getLocalizedText(text: string | { fr: string; en: string; pt: string; es: string } | undefined, lang: string): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  const val = text[lang as keyof typeof text]
  if (val && val.trim() !== '') return val
  return (text.fr && text.fr.trim() !== '') ? text.fr : ''
}

export default function HomePage() {
  const { lang } = useLanguage()
  const { settings: globalSettings } = useSettings()
  const pathname = usePathname()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const zonesRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [textsRes, zonesRes, productsRes] = await Promise.all([
          fetch('/api/local/texts'),
          fetch('/api/local/zones'),
          fetch('/api/local/products')
        ])

        const textsRaw = await textsRes.json()
        const zonesRaw = await zonesRes.json()
        const productsRaw = await productsRes.json()

        const textsArray = Array.isArray(textsRaw.texts) ? textsRaw.texts : Array.isArray(textsRaw) ? textsRaw : []
        const zonesArray = Array.isArray(zonesRaw.zones) ? zonesRaw.zones : Array.isArray(zonesRaw) ? zonesRaw : []
        const productsArray = Array.isArray(productsRaw.products) ? productsRaw.products : Array.isArray(productsRaw) ? productsRaw : []

        setTexts(textsArray)
        setZones(zonesArray.filter((z: Zone) => z.active).sort((a: Zone, b: Zone) => a.order - b.order))
        setProducts(productsArray.filter((p: Product) => p.active).sort((a: Product, b: Product) => a.order - b.order))
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [pathname])

  // Scroll animations with IntersectionObserver
  useEffect(() => {
    if (!globalSettings?.animations?.enabled || !globalSettings?.animations?.scroll_animation) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    if (zonesRef.current) observer.observe(zonesRef.current)
    if (productsRef.current) observer.observe(productsRef.current)

    return () => observer.disconnect()
  }, [globalSettings?.animations?.enabled, globalSettings?.animations?.scroll_animation])

  const getAnimationDelay = (index: number) => {
    const delay = globalSettings?.animations?.stagger_delay || 100
    return { animationDelay: `${index * delay}ms` }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </main>
        <Footer />
      </>
    )
  }

  const heroTitle = getText(texts, 'hero_title', lang, 'Pilotez votre entreprise avec l\'Intelligence d\'aujourd\'hui.')
  const heroSubtitle1 = getText(texts, 'hero_subtitle1', lang, 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien.')
  const heroSubtitle2 = getText(texts, 'hero_subtitle2', lang, 'Dans un monde qui s\'accélère, la technologie doit être un moteur.')
  const heroCta1 = getText(texts, 'hero_cta1', lang, 'Explorer nos Solutions')
  const heroCta2 = getText(texts, 'hero_cta2', lang, 'Parler à un expert')
  const expertiseTitle = getText(texts, 'expertise_title', lang, 'Nos pôles d\'Expertise')
  const productsTitle = getText(texts, 'products_title', lang, 'Nos Produits')

  const heroStyle = {
    backgroundImage: globalSettings?.hero?.image_url ? `url(${globalSettings.hero.image_url})` : undefined,
    opacity: (globalSettings?.hero?.opacity || 100) / 100,
    filter: `brightness(${globalSettings?.hero?.brightness || 110}%)`,
  }

  const overlayStyle = {
    backgroundColor: globalSettings?.hero?.overlay_color || '#000000',
    opacity: (globalSettings?.hero?.overlay_opacity || 50) / 100,
  }

  const primaryColor = globalSettings?.site?.primary_color || '#0ea5e9'
  const cardRadius = globalSettings?.cards?.border_radius || 16

  const cardStyle = {
    borderRadius: `${cardRadius}px`,
  }

  const cardHoverEffect = globalSettings?.cards?.hover_effect || 'scale'
  const cardHoverClass = cardHoverEffect === 'scale' ? 'hover:scale-[1.02]' : cardHoverEffect === 'lift' ? 'hover:-translate-y-1' : ''

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950">
        {globalSettings?.hero?.enabled !== false && (
          <section
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={heroStyle}
          >
            <div className="absolute inset-0" style={overlayStyle} />
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto">
                {heroSubtitle1}
              </p>
              <p className="text-md md:text-lg text-white/60 mb-8 max-w-3xl mx-auto">
                {heroSubtitle2}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/solutions"
                  className="btn-primary hover:brightness-110 px-8 py-4 font-semibold"
                >
                  {heroCta1}
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary hover:brightness-110 px-8 py-4 font-semibold"
                >
                  {heroCta2}
                </Link>
              </div>
            </div>
          </section>
        )}

        {zones.length > 0 && (
          <section id="zones-section" ref={zonesRef} className={`py-20 px-4 bg-slate-900/50 ${globalSettings?.animations?.enabled && globalSettings?.animations?.scroll_animation ? 'fade-in-section' : ''} ${visibleSections.has('zones-section') ? 'visible' : ''}`}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                {expertiseTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {zones.map((zone, index) => (
                  <Link
                    key={zone.id}
                    href={zone.url}
                    className={`group p-8 border border-white/10 bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 ${cardHoverClass} ${globalSettings?.animations?.enabled && globalSettings?.animations?.scroll_animation && visibleSections.has('zones-section') ? 'fade-in-up' : ''}`}
                    style={{ ...cardStyle, ...getAnimationDelay(index) }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${zone.color === 'sky' ? 'bg-sky-500/20 text-sky-400' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                        {zone.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {getText(texts, zone.title_key, lang, zone.title_key)}
                    </h3>
                    <p className="text-[var(--color-primary)] mb-4">
                      {getText(texts, zone.subtitle_key, lang, zone.subtitle_key)}
                    </p>
                    <span className={`inline-flex items-center text-[var(--color-primary)] font-medium group-hover:gap-3 gap-2 transition-all`}>
                      {getText(texts, zone.cta_key, lang, 'En savoir plus')}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section id="products-section" ref={productsRef} className={`py-20 px-4 ${globalSettings?.animations?.enabled && globalSettings?.animations?.scroll_animation ? 'fade-in-section' : ''} ${visibleSections.has('products-section') ? 'visible' : ''}`}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                {productsTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product, index) => (
                  <div
                    key={product.id}
                    className={`group rounded-2xl border border-white/10 bg-slate-800/50 overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 ${cardHoverClass} ${globalSettings?.animations?.enabled && globalSettings?.animations?.scroll_animation && visibleSections.has('products-section') ? 'fade-in-up' : ''}`}
                    style={{ ...cardStyle, ...getAnimationDelay(index) }}
                  >
                    <div className="relative h-48 bg-slate-700">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={getLocalizedText(product.title, lang)}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{getLocalizedText(product.title, lang)}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{getLocalizedText(product.description, lang)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[var(--color-primary)]">
                          {(product.price / 100).toFixed(2)} €
                        </span>
                        <button
                          className="btn-primary hover:brightness-110 px-4 py-2 text-sm font-medium"
                        >
                          {getText(texts, 'products_buy', lang, 'Acheter')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {products.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href="/produits"
                    className="btn-secondary hover:brightness-110 inline-block px-8 py-3 font-medium"
                  >
                    Voir tous les produits
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
