'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioButton from '@/components/AudioButton'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'
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

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ''
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

const zoneImages: Record<string, string> = {
  'commerce': '/images/zones/commerces.webp',
  'industrie': '/images/zones/industrie.webp',
  'comptabilite': '/images/zones/comptabilite.webp',
  'droit': '/images/zones/droit.webp',
  'webdesign': '/images/zones/web_design.webp',
  'outils-services': '/images/zones/service.webp',
  'a-tester': '/images/zones/a_tester.webp',
}

const tryColors: Record<string, { icon: string; hover: string }> = {
  violet:  { icon: 'bg-violet-500/10 text-violet-400', hover: 'hover:border-violet-500/30' },
  purple:  { icon: 'bg-purple-500/10 text-purple-400', hover: 'hover:border-purple-500/30' },
  emerald: { icon: 'bg-emerald-500/10 text-emerald-400', hover: 'hover:border-emerald-500/30' },
  rose:    { icon: 'bg-rose-500/10 text-rose-400', hover: 'hover:border-rose-500/30' },
  blue:    { icon: 'bg-blue-500/10 text-blue-400', hover: 'hover:border-blue-500/30' },
  amber:   { icon: 'bg-amber-500/10 text-amber-400', hover: 'hover:border-amber-500/30' },
  slate:   { icon: 'bg-slate-500/10 text-slate-400', hover: 'hover:border-slate-500/30' },
  cyan:    { icon: 'bg-cyan-500/10 text-cyan-400', hover: 'hover:border-cyan-500/30' },
  yellow:  { icon: 'bg-yellow-500/10 text-yellow-400', hover: 'hover:border-yellow-500/30' },
  teal:    { icon: 'bg-teal-500/10 text-teal-400', hover: 'hover:border-teal-500/30' },
}

const tryIcons: Record<string, any> = {
  erv: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  ),
  qrcall: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
  chatbot: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  click: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  prod: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  paperasse: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  site: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  talkie: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  ),
  serenite: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
}

export default function HomePageContent() {
  const { lang } = useLanguage()
  const { settings: globalSettings } = useSettings()
  const pathname = usePathname()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [tryItems, setTryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const zonesRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [textsRes, zonesRes, cardsRes, productsRes, tryRes] = await Promise.all([
          fetch('/api/supabase/texts'),
          fetch('/api/supabase/zones'),
          fetch('/api/supabase/cards'),
          fetch('/api/supabase/products'),
          fetch('/api/supabase/try')
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

        const tryRaw = await tryRes.json()
        const tryArray = Array.isArray(tryRaw.tryItems) ? tryRaw.tryItems : Array.isArray(tryRaw) ? tryRaw : []
        setTryItems(tryArray.filter((t: any) => t.active).sort((a: any, b: any) => a.order - b.order))
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [pathname])

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

  // Hero texts
  const heroTitle = globalSettings?.hero_texts?.title?.[lang as keyof typeof globalSettings.hero_texts.title]
    || globalSettings?.hero_texts?.title?.fr
    || 'Donnez une voix humaine à tous vos documents, en moins de 2 minutes.'
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
      color: 'violet',
      url: '/solutions#commerce',
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
      color: 'purple',
      url: '/solutions#industrie',
      cta_key: 'industrie_cta',
      active: true,
      order: 1
    }
  ]

  const displayZones = zones.length > 0 ? zones : defaultZones

  const heroImage = getImageUrl(globalSettings?.hero?.image_url) || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=75&fm=webp'
  const heroOpacity = (globalSettings?.hero?.opacity ?? 40) / 100
  const heroBrightness = globalSettings?.hero?.brightness ?? 60

  const SOFTWARE_APPS = [
    {
      name: 'EasyReadVoice',
      description: "Transforme n'importe quel document (PDF, EPUB, TXT, DOCX) en fichier audio avec des voix adaptées par personnage.",
      url: 'https://newappai.com/easyreadvoice',
      category: 'MultimediaApplication',
    },
    {
      name: 'QRcall',
      description: 'Interphone virtuel par QR code pour recevoir des appels visiteurs sans installation matérielle.',
      url: 'https://newappai.com/qrcall',
      category: 'CommunicationApplication',
    },
    {
      name: 'Chatbot',
      description: "Assistant conversationnel IA pour l'engagement client et le support.",
      url: 'https://newappai.com/produits',
      category: 'BusinessApplication',
    },
    {
      name: 'Click&Delivery',
      description: 'Gestion de commandes et livraisons pour commerces de proximité.',
      url: 'https://newappai.com/produits',
      category: 'BusinessApplication',
    },
    {
      name: 'Gestion Production',
      description: 'Pilotage de production en temps réel pour ateliers industriels.',
      url: 'https://newappai.com/produits',
      category: 'BusinessApplication',
    },
    {
      name: 'Paperasse',
      description: 'Automatisation et traitement intelligent de documents administratifs.',
      url: 'https://newappai.com/produits',
      category: 'BusinessApplication',
    },
    {
      name: 'Site Vitrine',
      description: 'Génération de sites vitrines professionnels assistée par IA.',
      url: 'https://newappai.com/produits',
      category: 'DesignApplication',
    },
    {
      name: 'Talkie Walkie',
      description: 'Communication instantanée en équipe via talkie-walkie virtuel.',
      url: 'https://newappai.com/produits',
      category: 'CommunicationApplication',
    },
    {
      name: 'Sérénité',
      description: 'Application de bien-être et suivi de sérénité au quotidien.',
      url: 'https://newappai.com/produits',
      category: 'HealthApplication',
    },
    {
      name: 'EasyReadVoice Player',
      description: 'Lecteur dédié pour écouter vos fichiers audio générés par EasyReadVoice.',
      url: 'https://newappai.com/easyreadvoice/buy',
      category: 'MultimediaApplication',
    },
  ]

  const softwareApplicationsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SOFTWARE_APPS.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.name,
        description: app.description,
        url: app.url,
        applicationCategory: app.category,
        operatingSystem: 'Web',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationsJsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-transparent overflow-x-hidden">
        {/* HERO SECTION — Apple style: noir pur, typo large, image dominante */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#000000]">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt=""
              fetchPriority="high"
              className="w-full h-full object-cover"
              style={{
                opacity: heroOpacity,
                filter: `brightness(${heroBrightness}%)`
              }}
            />
          </div>
          <div className="absolute inset-0 bg-[#000000] z-[2] pointer-events-none" style={{ opacity: 0.65 }}></div>

          <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
            <h1 data-section="hero-title" className="text-5xl md:text-8xl font-bold mb-6 tracking-wide leading-tight text-[#f5f5f7]">
              {heroTitle.includes('Intelligence') ? (
                <>
                  {heroTitle.split('Intelligence')[0]}
                  <span className="text-[#a78bfa]">Intelligence</span>
                  {heroTitle.split('Intelligence')[1]}
                </>
              ) : heroTitle}
            </h1>
            <p data-section="hero-subtitle" className="text-[#86868b] max-w-2xl text-lg md:text-xl mb-12 leading-relaxed font-normal">
              {heroSubtitle1}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                data-section="hero-cta-1"
                href="/contact"
                className="inline-block text-white px-8 py-3.5 rounded-full font-semibold text-base transition"
                style={{
                  backgroundColor: globalSettings?.buttons?.primary_color || '#8b5cf6',
                }}
              >
                {heroCta1}
              </Link>
              <Link
                data-section="hero-cta-2"
                href="/solutions"
                className="inline-block text-[#f5f5f7] px-8 py-3.5 rounded-full font-semibold text-base transition border border-white/20 hover:border-white/40"
              >
                {heroCta2}
              </Link>
            </div>
          </div>
        </section>

        {/* EXPERTISE SECTION — Apple style: fond uni, cartes sobres */}
        <section id="solutions" ref={zonesRef} className="bg-apple-dark px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <AnimatedTitle data-section="expertise-title" text={typeof expertiseTitle === 'string' ? expertiseTitle : "Nos pôles d'Expertise"} className="text-4xl md:text-6xl font-bold text-center text-[#f5f5f7] tracking-wide mb-20" as="h2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayZones.filter(z => z.key !== 'a-tester').map((zone, index) => (
                <Link
                  key={zone.id}
                  href={zone.url}
                  aria-label={getText(texts, 'zone_' + zone.key + '_alt', lang, `Découvrir le pôle ${zone.key}`)}
                  className={`backdrop-blur-2xl bg-white/[0.03] p-10 rounded-[2rem] border border-white/[0.08] shadow-lg shadow-black/30 hover:bg-white/[0.07] transition-all duration-500 cursor-pointer group flex flex-col items-start h-full relative overflow-hidden ${zone.order === 0 ? 'border-violet-500/20' : ''}`}
                >
                  {zoneImages[zone.key] && (
                    <div className="w-full mb-6 rounded-2xl overflow-hidden flex justify-center">
                      <img src={zoneImages[zone.key]} alt={zone.key} className="max-w-full max-h-60 object-contain" />
                    </div>
                  )}
                  <div className={`mb-5 w-16 h-16 flex items-center justify-center rounded-2xl text-2xl ${
                    zone.color === 'purple' ? 'text-purple-400 bg-purple-400/10' : 'text-violet-400 bg-violet-400/10'
                  }`}>
                    {zone.icon_url ? (
                      <img src={zone.icon_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="font-bold">{zone.badge}</span>
                    )}
                  </div>
                  <h3 data-section={zone.title_key} className={`text-3xl font-bold mb-3 tracking-wide transition ${
                    zone.color === 'purple' ? 'group-hover:text-purple-400' : 'group-hover:text-violet-400'
                  }`}>
                    {getText(texts, zone.title_key, lang, zone.key)}
                  </h3>
                  <p data-section={zone.subtitle_key} className="text-[#86868b] font-normal mb-6 text-base leading-relaxed flex-grow">
                    {getText(texts, zone.subtitle_key, lang, '')}
                  </p>
                  <div className="w-full grid grid-cols-1 gap-2 mb-6">
                    {cards.filter(c => c.zone_id === zone.id).slice(0, 3).map(card => (
                      <div key={card.id} className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.05]">
                        <div className="flex items-center justify-between mb-1">
                          <span data-section={card.title_key} className="text-[#f5f5f7] font-medium text-sm">
                            {getText(texts, card.title_key, lang, card.title_key)}
                          </span>
                          {card.badge_key && (
                            <span data-section={card.badge_key} className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full">
                              {getText(texts, card.badge_key, lang, card.badge_key)}
                            </span>
                          )}
                        </div>
                        <p data-section={card.description_key} className="text-[#86868b] text-xs leading-relaxed">
                          {getText(texts, card.description_key, lang, card.description_key)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div data-section={zone.cta_key} className={`flex items-center font-medium text-sm group-hover:translate-x-1 transition ${
                    zone.color === 'purple' ? 'text-purple-400' : 'text-violet-400'
                  }`}>
                    {getText(texts, zone.cta_key, lang, 'Découvrir')}
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        {products.length > 0 && (
          <section id="products" ref={productsRef} className="bg-apple-black px-6 py-32">
            <div className="max-w-6xl mx-auto">
              <AnimatedTitle data-section="products-title" text={typeof productsTitle === 'string' ? productsTitle : 'Nos Produits'} className="text-4xl md:text-6xl font-bold mb-20 text-center text-[#f5f5f7] tracking-wide" as="h2" />
              <ProductCarousel
                products={products}
                lang={lang}
                getText={getText}
                autoPlayDelay={globalSettings?.product_carousel?.delay || 5000}
              />
            </div>
          </section>
        )}

        {/* TESTER LES NOUVEAUTÉS — Apple style minimal (dynamique) */}
        {tryItems.length > 0 && (
        <section className="bg-apple-dark px-6 py-32">
          <div className="max-w-6xl mx-auto">
            {displayZones.filter(z => z.key === 'a-tester').length > 0 && (
              <div className="mb-16 text-center">
                <h3 className="text-4xl md:text-6xl font-bold mb-4 text-[#f5f5f7] tracking-wide" data-section={displayZones.find(z => z.key === 'a-tester')!.title_key}>
                  {getText(texts, displayZones.find(z => z.key === 'a-tester')!.title_key, lang, 'Tester les nouveautés')}
                </h3>
                <p className="text-[#86868b] text-lg max-w-xl mx-auto" data-section={displayZones.find(z => z.key === 'a-tester')!.subtitle_key}>
                  {getText(texts, displayZones.find(z => z.key === 'a-tester')!.subtitle_key, lang, 'Nouveautés en phase de test')}
                </p>
              </div>
            )}

            {/* Pictos des apps en test */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tryItems.map(item => {
                const color = tryColors[item.color] || tryColors.violet
                return (
                  <Link
                    key={item.id}
                    href={item.url || '/test'}
                    className={`group backdrop-blur-2xl bg-white/[0.03] p-6 rounded-2xl border border-white/[0.08] ${color.hover} transition-all duration-300 flex flex-col items-center text-center`}
                  >
                    <div className={`w-14 h-14 rounded-xl ${color.icon} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon_url ? (
                        <img src={getImageUrl(item.icon_url)} alt="" className="w-7 h-7 object-contain" />
                      ) : (
                        tryIcons[item.icon_key] || <span className="font-bold">{item.badge || '?'}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[#f5f5f7] mb-1">{getText(texts, item.title_key, lang, '')}</h4>
                    <p data-section={`home-app-${item.icon_key || item.id}-desc`} className="text-[10px] text-[#86868b] leading-relaxed">{getText(texts, item.description_key, lang, '')}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
        )}

      </main>
      <Footer />
      <AudioButton />
    </>
  )
}
