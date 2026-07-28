'use client'

// Build-Marker: v-premium-beta-final-deploy


import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioButton from '@/components/AudioButton'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'
import { useRouter } from 'next/navigation'
import ParticlesBackground from '@/components/ParticlesBackground'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedTitle from '@/components/AnimatedTitle'
import ProductCarousel from '@/components/ProductCarousel'

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
  icon_url?: string
  active: boolean
  order: number
}

interface ZoneCard {
  id: string
  zone_id: string
  title_key: string
  description_key: string
  badge_key?: string
  image_url?: string
  order: number
  active: boolean
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
  if (typeof text === 'object') {
    return text[lang as keyof typeof text] || text.fr || ''
  }
  return text
}

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ''
  // Si c'est un objet JSON stringifié, extraire l'URL
  if (imagePath.startsWith('{')) {
    try {
      const parsed = JSON.parse(imagePath)
      return parsed.original || parsed.thumbnail || ''
    } catch {
      return ''
    }
  }
  return imagePath
}

export default function HomePage() {
  const { lang } = useLanguage()
  const { settings: globalSettings } = useSettings()
  const pathname = usePathname()
  const router = useRouter()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const zonesRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [textsRes, zonesRes, cardsRes, productsRes] = await Promise.all([
          fetch('/api/supabase/texts'),
          fetch('/api/supabase/zones'),
          fetch('/api/supabase/cards'),
          fetch('/api/supabase/products')
        ])

        const textsRaw = await textsRes.json()
        const zonesRaw = await zonesRes.json()
        const cardsRaw = await cardsRes.json()
        const productsRaw = await productsRes.json()

        const textsArray = Array.isArray(textsRaw.texts) ? textsRaw.texts : Array.isArray(textsRaw) ? textsRaw : []
        const zonesArray = Array.isArray(zonesRaw.zones) ? zonesRaw.zones : Array.isArray(zonesRaw) ? zonesRaw : []
        const cardsArray = Array.isArray(cardsRaw.cards) ? cardsRaw.cards : Array.isArray(cardsRaw) ? cardsRaw : []
        const productsArray = Array.isArray(productsRaw.products) ? productsRaw.products : Array.isArray(productsRaw) ? productsRaw : []

        setTexts(textsArray)
        setZones(zonesArray.filter((z: Zone) => z.active).sort((a: Zone, b: Zone) => a.order - b.order))
        setCards(cardsArray.filter((c: ZoneCard) => c.active).sort((a: ZoneCard, b: ZoneCard) => a.order - b.order))
        setProducts(productsArray.filter((p: Product) => p.active).sort((a: Product, b: Product) => a.order - b.order))
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [pathname])

  // Scroll animations
  useEffect(() => {
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
  }, [])

  // Textes Hero depuis settings (avec fallbacks par défaut)
  const heroTitle = globalSettings?.hero_texts?.title?.[lang as keyof typeof globalSettings.hero_texts.title] 
    || globalSettings?.hero_texts?.title?.fr 
    || 'Pilotez votre entreprise avec l\'Intelligence d\'aujourd\'hui.'
  const heroSubtitle1 = globalSettings?.hero_texts?.subtitle?.[lang as keyof typeof globalSettings.hero_texts.subtitle] 
    || globalSettings?.hero_texts?.subtitle?.fr 
    || 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.'
  const heroSubtitle2 = globalSettings?.hero_texts?.subtitle2?.[lang as keyof typeof globalSettings.hero_texts.subtitle2] 
    || globalSettings?.hero_texts?.subtitle2?.fr 
    || 'Dans un monde qui s\'accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.'
  const heroCta1 = globalSettings?.hero_texts?.cta1?.[lang as keyof typeof globalSettings.hero_texts.cta1] 
    || globalSettings?.hero_texts?.cta1?.fr 
    || 'Explorer nos Solutions'
  const heroCta2 = globalSettings?.hero_texts?.cta2?.[lang as keyof typeof globalSettings.hero_texts.cta2] 
    || globalSettings?.hero_texts?.cta2?.fr 
    || 'Parler à un expert'
  const expertiseTitle = getText(texts, 'expertise_title', lang, 'Nos pôles d\'Expertise')
  const productsTitle = getText(texts, 'products_title', lang, 'Nos Produits')

  const defaultZones: Zone[] = [
    {
      id: 'default-1',
      key: 'commerce',
      title_key: 'commerce_title',
      subtitle_key: 'commerce_subtitle',
      badge: 'DS',
      color: 'sky',
      url: '/solutions',
      cta_key: 'commerce_cta',
      active: true,
      order: 0
    },
    {
      id: 'default-2',
      key: 'industrie',
      title_key: 'industrie_title',
      subtitle_key: 'industrie_subtitle',
      badge: 'IN',
      color: 'indigo',
      url: '/solutions#industrie',
      cta_key: 'industrie_cta',
      active: true,
      order: 1
    }
  ]

  const displayZones = zones.length > 0 ? zones : defaultZones

  const heroImage = globalSettings?.hero?.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'
  const heroOpacity = (globalSettings?.hero?.opacity ?? 40) / 100
  const heroBrightness = globalSettings?.hero?.brightness ?? 60

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Deep backdrop gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 z-[1]"></div>
          
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt="Background technology" 
              className="w-full h-full object-cover"
              style={{ 
                opacity: heroOpacity,
                filter: `brightness(${heroBrightness}%)`
              }}
            />
          </div>
          
          {/* Animated glow effects */}
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full z-[1] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full z-[1]"></div>
          <ParticlesBackground count={20} />

          <div className="relative z-10 text-center max-w-5xl mx-auto pt-20 flex flex-col items-center">
            <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
            <h1 data-section="hero-title" className="text-4xl md:text-7xl font-bold mb-8 tracking-tight drop-shadow-2xl text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {heroTitle.includes('Intelligence') ? (
                <>
                  {heroTitle.split('Intelligence')[0]}
                  <span className="neon-text">Intelligence</span>
                  {heroTitle.split('Intelligence')[1]}
                </>
              ) : heroTitle}
            </h1>
            <div className="text-slate-300 max-w-3xl text-lg md:text-xl mb-12 leading-relaxed space-y-4 font-medium drop-shadow-md">
              <p data-section="hero-subtitle" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{heroSubtitle1}</p>
              <p data-section="hero-subtitle" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>{heroSubtitle2}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                data-section="hero-cta-1"
                href="/solutions"
                className="text-white px-10 py-4 rounded-full font-bold transition shadow-xl transform hover:-translate-y-1"
                style={{
                  backgroundColor: globalSettings?.buttons?.primary_color || '#0ea5e9',
                  boxShadow: `0 10px 25px -5px ${globalSettings?.buttons?.primary_color || '#0ea5e9'}33`
                }}
              >
                {heroCta1}
              </Link>
              <Link
                data-section="hero-cta-2"
                href="/contact"
                className="backdrop-blur-md text-white px-10 py-4 rounded-full font-bold transition border"
                style={{
                  backgroundColor: `${globalSettings?.buttons?.secondary_color || '#6366f1'}20`,
                  borderColor: `${globalSettings?.buttons?.secondary_color || '#6366f1'}50`
                }}
              >
                {heroCta2}
              </Link>
            </div>
          </div>
        </section>

        {/* EXPERTISE SECTION */}
        <section id="solutions" ref={zonesRef} className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-16">
            <AnimatedTitle text={typeof expertiseTitle === 'string' ? expertiseTitle : 'Nos pôles d\'Expertise'} className="text-3xl md:text-5xl font-bold text-center text-white flex-1" as="h2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayZones.map((zone, index) => (
              <Link
                key={zone.id}
                href={zone.url}
                className={`animate-fade-in-up backdrop-blur-md bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:scale-[1.02] transition-all duration-500 cursor-pointer group flex flex-col items-start h-full ${zone.order === 0 ? 'border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.1)]' : ''}`}
                style={{ animationDelay: `${zone.order * 0.15}s` }}
              >
                <div className={`mb-6 w-20 h-20 flex items-center justify-center rounded-2xl text-3xl ${
                  zone.color === 'indigo' ? 'text-indigo-400 bg-indigo-400/10' : 'text-sky-400 bg-sky-400/10'
                }`}>
                  {zone.icon_url ? (
                    <img src={zone.icon_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : zone.key === 'commerce' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  ) : zone.key === 'industrie' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  ) : zone.key === 'comptabilite' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  ) : zone.key === 'droit' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                  ) : zone.key === 'webdesign' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  ) : zone.key === 'outils-services' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : zone.key === 'a-tester' ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  ) : (
                    <span className="font-bold">{zone.badge}</span>
                  )}
                </div>
                <h3 className={`text-3xl font-bold mb-4 transition ${
                  zone.color === 'indigo' ? 'group-hover:text-indigo-400' : 'group-hover:text-sky-400'
                }`}>
                  {getText(texts, zone.title_key, lang, zone.key === 'commerce' ? 'Pôle Commerce' : zone.key === 'industrie' ? 'Pôle Industrie' : zone.title_key)}
                </h3>
                <p className="text-slate-300 font-semibold mb-4 text-xl">
                  {getText(texts, zone.subtitle_key, lang, zone.key === 'commerce' ? 'DigiSmart Solutions' : zone.key === 'industrie' ? 'Smart Factory' : zone.subtitle_key)}
                </p>
                <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
                  {getText(texts, zone.key + '_desc', lang, zone.key === 'commerce' ? "Optimisez l'expérience client et digitalisez vos ventes." : zone.key === 'industrie' ? "Connectez votre atelier et pilotez votre production en temps réel." : '')}
                </p>
                
                {/* Zone Cards */}
                <div className="w-full grid grid-cols-1 gap-3 mb-6">
                  {cards.filter(c => c.zone_id === zone.id).map(card => (
                    <div key={card.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">
                          {getText(texts, card.title_key, lang, card.title_key)}
                        </span>
                        {card.badge_key && (
                          <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                            {getText(texts, card.badge_key, lang, card.badge_key)}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {getText(texts, card.description_key, lang, card.description_key)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center font-bold group-hover:translate-x-2 transition ${
                  zone.color === 'indigo' ? 'text-indigo-400' : 'text-sky-400'
                }`}>
                  {getText(texts, zone.cta_key, lang, 'Découvrir')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        {products.length > 0 && (
          <section id="products" ref={productsRef} className="max-w-6xl mx-auto px-6 py-20">
            <AnimatedTitle text={typeof productsTitle === 'string' ? productsTitle : 'Nos Produits'} className="text-3xl md:text-5xl font-bold mb-16 text-center text-white" as="h2" />
            <ProductCarousel 
              products={products}
              lang={lang}
              getText={getText}
              autoPlayDelay={globalSettings?.product_carousel?.delay || 5000}
            />
          </section>
        )}
      </main>
      <Footer />
      <AudioButton />
    </>
  )
}
