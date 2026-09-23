'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AudioButton from '@/components/AudioButton'
import { useLanguage } from '@/lib/LanguageContext'
import { useSettings } from '@/lib/SettingsContext'
import ProductCarousel from '@/components/ProductCarousel'
import { zoneIcons, zoneImages } from '@/lib/zoneIcons'

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
  status: string // 'visible' | 'hidden' | 'development' (schéma actuel — ex-colonne active supprimée)
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

function getLocalizedField(value: string | { fr: string; en: string; pt: string; es: string } | undefined, lang: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[lang as keyof typeof value] || value.fr || ''
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

const tryColors: Record<string, { icon: string; hover: string }> = {
  violet:  { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  purple:  { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  emerald: { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  rose:    { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  blue:    { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  amber:   { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  slate:   { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  cyan:    { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  yellow:  { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
  teal:    { icon: 'bg-white/5 text-[#2997ff]', hover: 'hover:scale-[1.02]' },
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
  const [remoteHero, setRemoteHero] = useState<{titre?: string; sous_titre?: string; cta?: string} | null>(null)

  const zonesRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [fading, setFading] = useState(false)

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
        setProducts(productsArray.filter((p: Product) => p.status === 'visible' || p.status === 'development').sort((a: Product, b: Product) => a.order - b.order))

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
    fetch('https://reseaux.sociaux.maxnewappai.com/api/current-hero')
      .then(r => r.json())
      .then(data => {
        if (data?.hero?.titre) setRemoteHero(data.hero)
      })
      .catch(() => {}) // silent fail
  }, [])

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
  const heroTitle = remoteHero?.titre
    || globalSettings?.hero_texts?.title?.[lang as keyof typeof globalSettings.hero_texts.title]
    || globalSettings?.hero_texts?.title?.fr
    || 'Donnez une voix humaine à tous vos documents, en moins de 2 minutes.'
  const heroSubtitle1 = remoteHero?.sous_titre
    || globalSettings?.hero_texts?.subtitle?.[lang as keyof typeof globalSettings.hero_texts.subtitle]
    || globalSettings?.hero_texts?.subtitle?.fr
    || 'Adoptez des solutions intelligentes conçues pour simplifier votre quotidien, booster votre productivité et satisfaire vos clients.'
  const heroSubtitle2 = globalSettings?.hero_texts?.subtitle2?.[lang as keyof typeof globalSettings.hero_texts.subtitle2]
    || globalSettings?.hero_texts?.subtitle2?.fr
    || 'Dans un monde qui s\'accélère, la technologie doit être un moteur. Nous créons des outils sur-mesure qui connectent vos équipes, automatisent vos processus et valorisent votre savoir-faire.'
  const heroCta1 = remoteHero?.cta
    || globalSettings?.hero_texts?.cta1?.[lang as keyof typeof globalSettings.hero_texts.cta1]
    || globalSettings?.hero_texts?.cta1?.fr
    || 'Explorer nos Solutions'
  const heroCta2 = globalSettings?.hero_texts?.cta2?.[lang as keyof typeof globalSettings.hero_texts.cta2]
    || globalSettings?.hero_texts?.cta2?.fr
    || 'Parler à un expert'
  const expertiseTitle = getText(texts, 'expertise_title', lang, 'Notre savoir faire')
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

  // Slides du hero rotatif — 100% données réelles : le message du jour (API
  // interne reseaux.sociaux.maxnewappai.com) puis jusqu'à 3 produits réels avec image.
  const productSlides = products
    .filter(p => p.images && p.images.length > 0)
    .slice(0, 3)
    .map(p => ({
      title: getLocalizedField(p.title, lang),
      subtitle: getLocalizedField(p.description, lang),
      image: getImageUrl(p.images[0]),
      href: '/produits',
    }))

  const heroSlides = [
    { title: heroTitle, subtitle: heroSubtitle1, image: heroImage, href: '/produits' },
    ...(remoteHero?.titre
      ? [{ title: remoteHero.titre, subtitle: remoteHero.sous_titre || '', image: heroImage, href: '/produits' }]
      : []),
    ...productSlides,
  ]

  useEffect(() => {
    if (heroSlides.length < 2) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActiveSlide(i => (i + 1) % heroSlides.length)
        setFading(false)
      }, 600)
    }, 5000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length])

  const currentSlide = heroSlides[activeSlide % heroSlides.length] || heroSlides[0]
  const socialLinks = [
    { url: globalSettings?.contact?.linkedin_url, label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { url: globalSettings?.contact?.facebook_url, label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { url: globalSettings?.contact?.instagram_url, label: 'Instagram', path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
  ].filter(s => !!s.url)

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
      <main className="min-h-screen bg-transparent overflow-x-hidden pt-[83px]">
        {/* HERO SECTION — Apple style: noir pur, texte rotatif, réseaux sociaux */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#000000]">
          <div className="relative z-10 text-center max-w-[980px] mx-auto flex flex-col items-center">
            <span data-section="hero-daily-label" className="text-[12px] uppercase tracking-[0.08em] text-[#2997ff] mb-4 font-semibold">
              {getText(texts, 'hero_daily_label', lang, 'Nos messages journaliers')}
            </span>
            <h1
              data-section="hero-title"
              className={`apple-headline mb-6 transition-opacity duration-[600ms] ${fading ? 'opacity-0' : 'opacity-100'}`}
            >
              {currentSlide.title}
            </h1>
            <p
              data-section="hero-subtitle"
              className={`text-[21px] leading-[1.19] text-white/80 max-w-2xl mb-10 font-normal transition-opacity duration-[600ms] ${fading ? 'opacity-0' : 'opacity-100'}`}
            >
              {currentSlide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <Link
                data-section="hero-cta-1"
                href="/contact"
                className="inline-block text-white px-[15px] py-2 rounded-lg font-normal text-[17px] transition bg-[#0071e3] hover:brightness-110"
              >
                {heroCta1}
              </Link>
              <Link
                data-section="hero-cta-2"
                href="/solutions"
                className="inline-block text-white px-[15px] py-2 rounded-[980px] font-normal text-[17px] transition border border-white/40 hover:border-white"
              >
                {heroCta2}
              </Link>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3" data-section="hero-social-links">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-[#2997ff] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EXPERTISE SECTION — Apple style: fond clair, cartes sobres sans bordure */}
        <section id="solutions" ref={zonesRef} className="bg-apple-light px-6 py-24 md:py-32">
          <div className="max-w-[980px] mx-auto">
            <h2 data-section="expertise-title" className="apple-title text-center mb-16">
              {typeof expertiseTitle === 'string' ? expertiseTitle : 'Notre savoir faire'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayZones.filter(z => z.key !== 'a-tester').map((zone) => (
                <Link
                  key={zone.id}
                  href={zone.url}
                  aria-label={getText(texts, 'zone_' + zone.key + '_alt', lang, `Découvrir le pôle ${zone.key}`)}
                  className="scroll-reveal bg-white p-10 rounded-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer group flex flex-col items-start h-full relative overflow-hidden"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px' }}
                >
                  {zoneImages[zone.key] && (
                    <div className="w-full mb-6 rounded-lg overflow-hidden flex justify-center">
                      <img src={zoneImages[zone.key]} alt={zone.key} className="max-w-full max-h-60 object-contain" />
                    </div>
                  )}
                  <div className="mb-5 w-16 h-16 flex items-center justify-center rounded-lg text-2xl bg-[#0071e3]/10 text-[#0071e3]">
                    {zone.icon_url ? (
                      <img src={zone.icon_url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      zoneIcons[zone.key] || <span className="font-bold">{zone.badge}</span>
                    )}
                  </div>
                  <h3 data-section={zone.title_key} className="text-[28px] font-normal leading-[1.14] mb-3 text-[#1d1d1f]">
                    {getText(texts, zone.title_key, lang, zone.key)}
                  </h3>
                  <p data-section={zone.subtitle_key} className="text-black/80 font-normal mb-6 text-base leading-relaxed flex-grow">
                    {getText(texts, zone.subtitle_key, lang, '')}
                  </p>
                  <div className="w-full grid grid-cols-1 gap-2 mb-6">
                    {cards.filter(c => c.zone_id === zone.id).slice(0, 3).map(card => (
                      <div key={card.id} className="bg-[#f5f5f7] rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span data-section={card.title_key} className="text-[#1d1d1f] font-medium text-sm">
                            {getText(texts, card.title_key, lang, card.title_key)}
                          </span>
                          {card.badge_key && (
                            <span data-section={card.badge_key} className="text-xs bg-[#0071e3]/10 text-[#0071e3] px-2 py-0.5 rounded-full">
                              {getText(texts, card.badge_key, lang, card.badge_key)}
                            </span>
                          )}
                        </div>
                        <p data-section={card.description_key} className="text-black/60 text-xs leading-relaxed">
                          {getText(texts, card.description_key, lang, card.description_key)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div data-section={zone.cta_key} className="flex items-center font-normal text-sm text-[#0066cc] group-hover:underline">
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
          <section id="products" ref={productsRef} className="bg-apple-black px-6 py-24 md:py-32">
            <div className="max-w-[980px] mx-auto">
              <h2 data-section="products-title" className="apple-title text-center mb-16">
                {typeof productsTitle === 'string' ? productsTitle : 'Nos Produits'}
              </h2>
              <ProductCarousel
                products={products}
                lang={lang}
                getText={getText}
                autoPlayDelay={globalSettings?.product_carousel?.delay || 5000}
              />
            </div>
          </section>
        )}

        {/* NOS SÉLECTIONS (ex-page "Nos sélections", fusionnée sur l'accueil) — grille d'applications */}
        {tryItems.length > 0 && (
        <section className="bg-apple-black px-6 py-24 md:py-32 border-t border-white/10">
          <div className="max-w-[980px] mx-auto">
            {displayZones.filter(z => z.key === 'a-tester').length > 0 && (
              <div className="mb-16 text-center">
                <h2 className="apple-title mb-4" data-section={displayZones.find(z => z.key === 'a-tester')!.title_key}>
                  {getText(texts, displayZones.find(z => z.key === 'a-tester')!.title_key, lang, 'Nos sélections')}
                </h2>
                <p className="text-white/60 text-lg max-w-xl mx-auto" data-section={displayZones.find(z => z.key === 'a-tester')!.subtitle_key}>
                  {getText(texts, displayZones.find(z => z.key === 'a-tester')!.subtitle_key, lang, 'Nos applications innovantes pour booster votre activité')}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tryItems.map(item => {
                const color = tryColors[item.color] || tryColors.violet
                return (
                  <Link
                    key={item.id}
                    href={item.url || '/test'}
                    className={`scroll-reveal group bg-[#272729] p-6 rounded-lg ${color.hover} transition-transform duration-300 flex flex-col items-center text-center`}
                  >
                    <div className={`w-14 h-14 rounded-lg ${color.icon} flex items-center justify-center mb-4`}>
                      {item.icon_url ? (
                        <img src={getImageUrl(item.icon_url)} alt="" className="w-7 h-7 object-contain" />
                      ) : (
                        tryIcons[item.icon_key] || <span className="font-bold">{item.badge || '?'}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[#f5f5f7] mb-1">{getText(texts, item.title_key, lang, '')}</h4>
                    <p data-section={`home-app-${item.icon_key || item.id}-desc`} className="text-[10px] text-white/60 leading-relaxed">{getText(texts, item.description_key, lang, '')}</p>
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
