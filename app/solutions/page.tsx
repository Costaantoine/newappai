'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

interface TextItem {
  id: string
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
  newtab_key: string
  order: number
  active: boolean
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

export default function SolutionsPage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [lang])

  const fetchData = async () => {
    try {
      const [textsRes, zonesRes, cardsRes] = await Promise.all([
        fetch(`/api/local/texts?t=${Date.now()}`),
        fetch(`/api/local/zones?t=${Date.now()}`),
        fetch(`/api/local/cards?t=${Date.now()}`)
      ])

      const textsData = await textsRes.json()
      const zonesData = await zonesRes.json()
      const cardsData = await cardsRes.json()

      setTexts(Array.isArray(textsData.texts) ? textsData.texts : [])
      setZones(Array.isArray(zonesData.zones) ? zonesData.zones : [])
      setCards(Array.isArray(cardsData.cards) ? cardsData.cards : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      // We don't set error here because we'll use defaults
    } finally {
      setLoading(false)
    }
  }

  const getText = (key: string, fallback: string = ''): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const langKey = lang as 'fr' | 'en' | 'pt' | 'es'
      return text[langKey] || text.fr || fallback || key
    }
    return fallback || key
  }

  const getZoneCards = (zoneId: string, zoneKey: string): ZoneCard[] => {
    const zoneCards = cards.filter(c => c.zone_id === zoneId && c.active)
    if (zoneCards.length > 0) return zoneCards.sort((a, b) => a.order - b.order)

    // Defaults for Commerce
    if (zoneKey === 'commerce') {
      return [
        { id: 'd-c-1', zone_id: zoneId, title_key: 'solutions_clickCollect_title', description_key: 'solutions_clickCollect_desc', order: 0, active: true },
        { id: 'd-c-2', zone_id: zoneId, title_key: 'solutions_reservations_title', description_key: 'solutions_reservations_desc', order: 1, active: true },
        { id: 'd-c-3', zone_id: zoneId, title_key: 'solutions_iaPhone_title', description_key: 'solutions_iaPhone_desc', badge_key: 'solutions_iaPhone_badge', order: 2, active: true },
        { id: 'd-c-4', zone_id: zoneId, title_key: 'solutions_gps_title', description_key: 'solutions_gps_desc', badge_key: 'solutions_gps_badge', order: 3, active: true },
        { id: 'd-c-5', zone_id: zoneId, title_key: 'solutions_borne_title', description_key: 'solutions_borne_desc', badge_key: 'solutions_borne_badge', order: 4, active: true },
        { id: 'd-c-6', zone_id: zoneId, title_key: 'solutions_payment_title', description_key: 'solutions_payment_desc', badge_key: 'solutions_payment_badge', order: 5, active: true },
      ]
    }

    // Defaults for Industrie
    if (zoneKey === 'industrie') {
      return [
        { id: 'd-i-1', zone_id: zoneId, title_key: 'solutions_industrie_mb_title', description_key: 'solutions_industrie_mb_desc', order: 0, active: true },
        { id: 'd-i-2', zone_id: zoneId, title_key: 'solutions_industrie_talkie_title', description_key: 'solutions_industrie_talkie_desc', order: 1, active: true },
      ]
    }

    return []
  }

  const defaultZones: Zone[] = [
    {
      id: 'default-1',
      key: 'commerce',
      title_key: 'solutions_digismart_title',
      subtitle_key: 'solutions_digismart_subtitle',
      badge: 'DS',
      color: 'sky',
      url: 'https://digismart.premiumajusteprix.com/',
      cta_key: 'solutions_digismart_cta',
      newtab_key: 'solutions_digismart_newTab',
      order: 0,
      active: true
    },
    {
      id: 'default-2',
      key: 'industrie',
      title_key: 'solutions_industrie_title',
      subtitle_key: 'solutions_industrie_subtitle',
      badge: 'IN',
      color: 'indigo',
      url: '',
      cta_key: '',
      newtab_key: '',
      order: 1,
      active: true
    }
  ]

  const displayZones = zones.length > 0 ? zones : defaultZones

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        <section className="relative pt-40 pb-16 px-6 flex flex-col items-center text-center">
          <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              {getText('solutions_title', 'Des outils intelligents pour chaque étape de votre activité.')}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              {getText('solutions_subtitle', 'Choisissez l\'innovation qui s\'adapte à votre métier.')}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10 pb-32">
          {displayZones.map((zone) => (
            <ZoneSection key={zone.id} zone={zone} getText={getText} getZoneCards={getZoneCards} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}

function ZoneSection({ zone, getText, getZoneCards }: {
  zone: Zone
  getText: (key: string, fallback?: string) => string
  getZoneCards: (zoneId: string, zoneKey: string) => ZoneCard[]
}) {
  const cards = getZoneCards(zone.id, zone.key)
  const bgBlurClass = zone.color === 'indigo' ? 'bg-indigo-500/10' : 'bg-sky-500/10'
  const colorClass = zone.color === 'indigo' ? 'indigo' : 'sky'
  const bgColorClass = `bg-${colorClass}-500`
  const textColorClass = `text-${colorClass}-400`
  const shadowColorClass = colorClass === 'indigo' ? 'rgba(129,140,248,0.2)' : 'rgba(56,189,248,0.2)'

  return (
    <div id={zone.key} className={`backdrop-blur-md bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 mb-20 relative overflow-hidden ${zone.order === 0 ? 'border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.1)]' : ''}`}>
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${bgBlurClass} blur-[150px] rounded-full -z-10`}></div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-16">
        <div className="flex items-center space-x-6 mb-8 md:mb-0">
          <div className={`${textColorClass} ${zone.color === 'indigo' ? 'bg-indigo-400/10' : 'bg-sky-400/10'} w-20 h-20 flex items-center justify-center rounded-2xl font-bold text-3xl`}>
            {zone.badge}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getText(zone.title_key, zone.key === 'commerce' ? 'DigiSmart Solutions' : 'Pôle Industrie')}
            </h3>
            <p className={`${textColorClass} text-lg font-semibold tracking-wide`}>
              {getText(zone.subtitle_key, zone.key === 'commerce' ? 'La Suite Tout-en-Un pour Restaurants & Commerces' : 'Smart Factory & Logistique 4.0')}
            </p>
          </div>
        </div>
        {zone.url && (
          <div className="flex flex-col items-center md:items-end">
            <a href={zone.url} target="_blank" rel="noopener noreferrer" className={`px-8 py-4 rounded-full ${bgColorClass} text-white font-bold hover:brightness-110 transition shadow-lg shadow-sky-500/20 flex items-center mb-2`}>
              {getText(zone.cta_key, 'Visiter le site officiel')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
            <span className="text-xs text-slate-500 italic">
              {getText(zone.newtab_key, 'Ouverture dans un nouvel onglet')}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map(card => (
          <SolutionCard key={card.id} card={card} getText={getText} color={zone.color as 'sky' | 'indigo'} />
        ))}
      </div>
    </div>
  )
}

function SolutionCard({ card, getText, color = 'sky' }: {
  card: ZoneCard
  getText: (key: string, fallback?: string) => string
  color?: 'sky' | 'indigo'
}) {
  const colorClass = color === 'indigo' ? 'indigo' : 'sky'

  return (
    <div className={`bg-slate-900/40 p-10 rounded-3xl border border-white/5 hover:border-${colorClass}-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col group`}>
      <div className="flex items-start mb-6">
        <div className={`w-14 h-14 bg-${colorClass}-500/20 rounded-xl flex items-center justify-center text-${colorClass}-400 mr-5 group-hover:scale-110 transition-transform`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {getText(card.title_key)}
          </h4>
          {card.badge_key && (
            <span className={`text-${colorClass}-400 text-xs font-bold uppercase tracking-widest bg-${colorClass}-400/10 px-2 py-0.5 rounded`}>
              {getText(card.badge_key, 'En cours')}
            </span>
          )}
        </div>
      </div>
      <p className="text-slate-300 font-medium leading-relaxed text-lg">
        {getText(card.description_key)}
      </p>
    </div>
  )
}

