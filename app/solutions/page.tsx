'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'
import SEOHead from '@/components/SEOHead'

interface TextItem { id: string; key: string; fr: string; en: string; pt: string; es: string }
interface Zone { id: string; key: string; title_key: string; subtitle_key: string; badge: string; color: string; url: string; site_url: string; cta_key: string; newtab_key: string; icon_url?: string; order: number; active: boolean }

const icons: Record<string, any> = {
  commerce: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  industrie: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  comptabilite: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  droit: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  webdesign: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  'outils-services': <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'a-tester': <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
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

const colorStyles: Record<string, { blur: string; text: string; bg: string; border: string }> = {
  violet:  { blur: 'bg-violet-500/10', text: 'text-violet-400', bg: 'bg-violet-500', border: 'border-violet-500/30' },
  purple:  { blur: 'bg-purple-500/10', text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30' },
  emerald: { blur: 'bg-emerald-500/10', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30' },
  pink:    { blur: 'bg-pink-500/10', text: 'text-pink-400', bg: 'bg-pink-500', border: 'border-pink-500/30' },
  amber:   { blur: 'bg-amber-500/10', text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30' },
  rose:    { blur: 'bg-rose-500/10', text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/30' },
}

export default function SolutionsPage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const handler = () => { if (!document.hidden) fetchData() }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [lang])

  // Scroll vers l'ancre (#zone) une fois les données chargées, et à chaque changement de hash
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
      return timer
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    if (!loading) timer = scrollToHash()

    const handleHashChange = () => { timer = scrollToHash() }
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [loading])

  const fetchWithRetry = async (url: string, retries = 3, delay = 500): Promise<Response | null> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(url)
        if (res.ok) return res
        // 4xx (429 inclus) = échec définitif : ne JAMAIS retenter, sinon le rate-limit s'auto-entretient
        if (res.status >= 400 && res.status < 500) {
          console.warn(`Fetch aborted (${res.status}) for ${url} — 4xx treated as definitive failure`)
          return null
        }
        console.warn(`Fetch failed (${res.status}) for ${url}, attempt ${attempt + 1}/${retries}`)
      } catch (e) {
        console.warn(`Fetch error for ${url}, attempt ${attempt + 1}/${retries}:`, e)
      }
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)))
    }
    return null
  }

  const fetchData = async () => {
    try {
      const [tr, zr, sr] = await Promise.allSettled([
        fetchWithRetry(`/api/supabase/texts?t=${Date.now()}`),
        fetchWithRetry(`/api/supabase/zones?t=${Date.now()}`),
        fetchWithRetry(`/api/supabase/settings?t=${Date.now()}`)
      ])
      const textsData = tr.status === 'fulfilled' && tr.value ? await tr.value.json() : null
      const zonesData = zr.status === 'fulfilled' && zr.value ? await zr.value.json() : null
      const settingsData = sr.status === 'fulfilled' && sr.value ? await sr.value.json() : null
      if (textsData && Array.isArray(textsData.texts) && textsData.texts.length > 0) {
        setTexts(textsData.texts)
      }
      if (zonesData && Array.isArray(zonesData.zones)) setZones(zonesData.zones)
      if (settingsData && settingsData.settings) setSettings(settingsData.settings)
      // RÈGLE STRICTE : si texts est vide après tous les retries, on NE passe PAS loading à false.
      // La page reste sur l'écran "Chargement..." — on ne rend JAMAIS le contenu avec des clés brutes.
      if (textsData && Array.isArray(textsData.texts) && textsData.texts.length > 0) {
        setLoading(false)
      } else {
        console.warn('/solutions: texts empty after all retries — staying on loader, no raw keys rendered')
      }
    } catch (e) { console.error(e) } finally { /* loading ne passe à false QUE si texts est rempli */ }
  }

  const t = (key: string, fb = ''): string => {
    const found = texts.find(x => x.key === key)
    if (found) { const v = found[lang as 'fr'|'en'|'pt'|'es']; return v || found.fr || fb || key }
    return fb || key
  }

  const imgUrl = (url: string): string => {
    if (!url || !url.startsWith('{')) return url
    try { const p = JSON.parse(url); return p.original || p.thumbnail || url } catch { return url }
  }

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center text-white">Chargement...</div>

  const activeZones = zones.filter(z => z.active).sort((a, b) => a.order - b.order)

  return (
    <>
      <SEOHead
        title="Solutions IA et logicielles | NewAppAI"
        description="Découvrez nos solutions IA intelligentes pour chaque secteur : commerce, industrie, comptabilité, droit, webdesign et plus."
        ogUrl="https://newappai.com/solutions"
      />
      <Header />
      <main className="min-h-screen bg-[#000000] overflow-x-hidden">
        <AppleHero
          title={t('solutions_title', 'Des outils intelligents pour chaque étape de votre activité.').includes('intelligents') ? (
            <>{t('solutions_title', '').split('intelligents')[0]}<span className="neon-text">intelligents</span>{t('solutions_title', '').split('intelligents')[1]}</>
          ) : t('solutions_title', 'Des outils intelligents pour chaque étape de votre activité.')}
          subtitle={<span>{t('solutions_subtitle', "Choisissez l'innovation qui s'adapte à votre métier.")}</span>}
          titleDataSection="solutions-title"
          subtitleDataSection="solutions-subtitle"
          particlesCount={20}
          glowColor="violet-500"
          backgroundImage="https://newappai.com/uploads/hero-ai-v2-wide.jpg"
        />

        <AppleSection className="space-y-20 pb-20">
          {activeZones.map((zone, index) => {
            const cs = colorStyles[zone.color] || colorStyles.violet
            const siteUrl = zone.site_url || t(zone.key + '_site_url', '')
            return (
              <AppleCard key={zone.id} id={zone.key} padding="lg" hover glowColor={zone.color} className={`animate-fade-in-up scroll-mt-28 ${zone.order === 0 ? 'border-violet-500/30' : ''}`} style={{ animationDelay: `${0.1 + index * 0.15}s` }}>
                
                {/* Zone image banner */}
                {zoneImages[zone.key] && (
                  <div className="w-full max-h-[36rem] rounded-2xl overflow-hidden mb-6 flex justify-center">
                    <img src={zoneImages[zone.key]} alt={t('zone_' + zone.key + '_alt', zone.key)} className="max-w-full max-h-[36rem] object-contain" />
                  </div>
                )}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  {zone.icon_url ? (
                    <img src={imgUrl(zone.icon_url)} alt={`Icône ${zone.key}`} className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 ${cs.text}`}>
                      {icons[zone.key] || <span className="font-bold text-2xl">{zone.badge}</span>}
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <h3 data-section={zone.title_key} className="text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-2 tracking-wide">{t(zone.title_key)}</h3>
                    <p data-section={zone.subtitle_key} className={`${cs.text} text-lg font-semibold tracking-wide`}>{t(zone.subtitle_key)}</p>
                  </div>
                </div>

                <p data-section={`solutions-${zone.key}-desc-long`} className="text-[#86868b] text-base leading-relaxed mb-8 max-w-4xl">{t('solutions_' + zone.key + '_desc_long', '')}</p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/produits" data-section="solutions-see-products" className={`px-8 py-4 rounded-full ${cs.bg} text-white font-bold hover:brightness-110 transition shadow-lg flex items-center`}>
                    {t('solutions_see_products', 'Voir nos produits')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                  {(zone.key === 'commerce' || zone.key === 'industrie') && siteUrl && siteUrl !== zone.key + '_site_url' && (
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" data-section="solutions-see-website" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition flex items-center">
                      {t('solutions_see_website', 'Voir le site internet associé')}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              </AppleCard>
            )
          })}
        </AppleSection>

        <TestimonialCarousel
          testimonials={settings?.testimonials?.length > 0 ? settings.testimonials : [
            { id: '1', title: t('testimonial_1_title', 'Miguel Bras'), description: t('testimonial_1_desc', ''), image_url: '' },
            { id: '2', title: t('testimonial_2_title', 'Pizzeria Portugal'), description: t('testimonial_2_desc', ''), image_url: '' },
          ]}
          autoPlayDelay={settings?.testimonial_autoPlayDelay || 5000}
        />
      </main>
      <Footer />
    </>
  )
}
