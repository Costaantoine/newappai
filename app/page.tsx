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

  const heroTitle = getText(texts, 'hero_title', lang, 'Pilotez votre entreprise avec l\'Intelligence d\'aujourd\'hui.')
  const heroSubtitle1 = getText(texts, 'hero_subtitle1', lang, 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.')
  const heroSubtitle2 = getText(texts, 'hero_subtitle2', lang, 'Dans un monde qui s\'accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.')
  const heroCta1 = getText(texts, 'hero_cta1', lang, 'Explorer nos Solutions')
  const heroCta2 = getText(texts, 'hero_cta2', lang, 'Parler à un expert')
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
  const heroOpacity = (globalSettings?.hero?.background_opacity ?? 40) / 100
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

          <div className="relative z-10 text-center max-w-5xl mx-auto pt-20 flex flex-col items-center">
            <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight drop-shadow-2xl text-white">
              {heroTitle.includes('Intelligence') ? (
                <>
                  {heroTitle.split('Intelligence')[0]}
                  <span className="neon-text">Intelligence</span>
                  {heroTitle.split('Intelligence')[1]}
                </>
              ) : heroTitle}
            </h1>
            <div className="text-slate-300 max-w-3xl text-lg md:text-xl mb-12 leading-relaxed space-y-4 font-medium drop-shadow-md">
              <p>{heroSubtitle1}</p>
              <p>{heroSubtitle2}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/solutions" className="bg-sky-500 text-white px-10 py-4 rounded-full font-bold hover:bg-sky-400 transition shadow-xl shadow-sky-500/20 transform hover:-translate-y-1">
                {heroCta1}
              </Link>
              <Link href="/contact" className="backdrop-blur-md bg-white/5 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition border border-white/10">
                {heroCta2}
              </Link>
            </div>
          </div>
        </section>

        {/* EXPERTISE SECTION */}
        <section id="solutions" ref={zonesRef} className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-white">
            {expertiseTitle.includes('Expertise') ? (
              <>
                {expertiseTitle.split('Expertise')[0]}
                <span className="text-sky-400">Expertise</span>
                {expertiseTitle.split('Expertise')[1]}
              </>
            ) : expertiseTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayZones.map((zone, index) => (
              <Link 
                key={zone.id} 
                href={zone.url} 
                className={`backdrop-blur-md bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:scale-[1.02] transition-all duration-500 cursor-pointer group flex flex-col items-start h-full ${zone.order === 0 ? 'border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.1)]' : ''}`}
              >
                <div className={`mb-6 w-20 h-20 flex items-center justify-center rounded-2xl font-bold text-3xl ${
                  zone.color === 'indigo' ? 'text-indigo-400 bg-indigo-400/10' : 'text-sky-400 bg-sky-400/10'
                }`}>
                  {zone.badge}
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
                  {getText(texts, zone.key + '_desc', lang, zone.key === 'commerce' ? 'Optimisez l\'expérience client et digitalisez vos ventes.' : zone.key === 'industrie' ? 'Connectez votre atelier et pilotez votre production en temps réel.' : '')}
                </p>
                <div className={`flex items-center font-bold group-hover:translate-x-2 transition ${
                  zone.color === 'indigo' ? 'text-indigo-400' : 'text-sky-400'
                }`}>
                  {getText(texts, zone.cta_key, lang, zone.key === 'commerce' ? 'Voir les 6 modules' : 'Découvrir l\'offre')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUCTS SECTION (Only if DB works or if we want defaults here too) */}
        {products.length > 0 && (
          <section id="products" ref={productsRef} className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-white">
              {productsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="backdrop-blur-md bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:scale-[1.02] transition-all duration-300 flex flex-col">
                  {product.images && product.images[0] && (
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                      <Image src={product.images[0]} alt={getLocalizedText(product.title, lang)} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-white">{getLocalizedText(product.title, lang)}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{getLocalizedText(product.description, lang)}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sky-400 font-bold text-lg">{(product.price / 100).toFixed(2)} €</span>
                    <Link 
                      href={`/api/stripe/checkout?productId=${product.id}`}
                      className="bg-sky-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-sky-400 transition"
                    >
                      {getText(texts, 'products_buy', lang, 'Acheter')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
