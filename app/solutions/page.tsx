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

      setTexts(textsData.texts || [])
      setZones(zonesData.zones || [])
      setCards(cardsData.cards || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const getText = (key: string): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const langKey = lang as 'fr' | 'en' | 'pt' | 'es'
      return text[langKey] || text.fr || key
    }
    return key
  }

  const getZoneCards = (zoneId: string): ZoneCard[] => {
    return cards
      .filter(c => c.zone_id === zoneId && c.active)
      .sort((a, b) => a.order - b.order)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchData} className="bg-sky-500 text-white px-6 py-2 rounded-full">
              Reessayer
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const activeZones = zones.filter(z => z.active).sort((a, b) => a.order - b.order)

  return (
    <>
      <Header />

      <section className="relative pt-40 pb-16 px-6 flex flex-col items-center text-center">
        <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {getText('solutions_title')}
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg mb-8 leading-relaxed">
            {getText('solutions_subtitle')}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {activeZones.length === 0 ? (
          <div className="glass p-10 rounded-[2.5rem] text-center">
            <p className="text-slate-400">Aucune zone disponible</p>
          </div>
        ) : (
          activeZones.map((zone, zoneIndex) => (
            <ZoneSection key={zone.id} zone={zone} getText={getText} getZoneCards={getZoneCards} />
          ))
        )}
      </section>

      <Footer />
    </>
  )
}

function ZoneSection({ zone, getText, getZoneCards }: {
  zone: Zone
  getText: (key: string) => string
  getZoneCards: (zoneId: string) => ZoneCard[]
}) {
  const cards = getZoneCards(zone.id)
  const bgBlurClass = zone.color === 'indigo' ? 'bg-indigo-500/10' : 'bg-sky-500/10'
  const colorClass = zone.color || 'sky'
  const bgColorClass = `${colorClass}-500`
  const textColorClass = `${colorClass}-400`
  const shadowColorClass = colorClass === 'indigo' ? 'rgba(129,140,248,0.2)' : 'rgba(56,189,248,0.2)'

  return (
    <div id={zone.key} className={`glass p-8 md:p-12 rounded-[2.5rem] ${zone.order === 0 ? 'neon-border' : ''} mb-16 relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${bgBlurClass} blur-[150px] rounded-full -z-10`}></div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
        <div className="flex items-center space-x-6 mb-6 md:mb-0">
          <div className={`text-${textColorClass} bg-${textColorClass}/10 w-20 h-20 flex items-center justify-center rounded-2xl font-bold text-3xl shadow-[0_0_30px_${shadowColorClass.replace(/ /g, '_')}]`}>
            {zone.badge}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{getText(zone.title_key)}</h3>
            <p className={`text-${textColorClass} text-lg font-semibold tracking-wide`}>{getText(zone.subtitle_key)}</p>
          </div>
        </div>
        {zone.url && (
          <div className="flex flex-col items-center md:items-end">
            <a href={zone.url} target="_blank" rel="noopener noreferrer" className={`px-8 py-3 rounded-full bg-${bgColorClass} text-white font-bold hover:opacity-80 transition shadow-lg flex items-center mb-2`}>
              {getText(zone.cta_key)}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
            <span className="text-xs text-slate-500">{getText(zone.newtab_key)}</span>
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
  getText: (key: string) => string
  color?: 'sky' | 'indigo'
}) {
  const bgClass = color === 'indigo' ? 'indigo' : 'sky'

  const getImageUrl = (val: string): string => {
    if (!val) return ''
    try {
      const parsed = JSON.parse(val)
      return parsed.original || parsed.thumbnail || val
    } catch {
      return val
    }
  }

  return (
    <div className={`bg-slate-950/40 p-8 rounded-3xl border border-white/5 hover:bg-${bgClass}-500/5 hover:border-${bgClass}-500/20 transition duration-300 flex flex-col`}>
      {card.image_url && (
        <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
          <img src={getImageUrl(card.image_url)} alt={getText(card.title_key)} className="w-full h-48 object-cover" />
        </div>
      )}
      <div className="flex items-center mb-4">
        <div className={`w-14 h-14 bg-${bgClass}-500/20 rounded-xl flex items-center justify-center text-${bgClass}-400 mr-4`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white">{getText(card.title_key)}</h4>
          {card.badge_key && <p className={`text-${bgClass}-400 text-sm font-semibold`}>{getText(card.badge_key)}</p>}
        </div>
      </div>
      <p className="text-slate-300 font-medium mb-4 text-lg">{getText(card.description_key)}</p>
    </div>
  )
}
