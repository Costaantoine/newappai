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
import { fetchWithRetry } from '@/lib/fetchWithRetry'
import { useTexts } from '@/lib/useTexts'
import { zoneIcons, zoneImages } from '@/lib/zoneIcons'

interface Zone { id: string; key: string; title_key: string; subtitle_key: string; badge: string; color: string; url: string; site_url: string; cta_key: string; newtab_key: string; icon_url?: string; order: number; active: boolean }

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
  const { texts, loading } = useTexts()
  const [zones, setZones] = useState<Zone[]>([])
  const [settings, setSettings] = useState<any>(null)

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

  const fetchData = async () => {
    try {
      const [zr, sr] = await Promise.allSettled([
        fetchWithRetry(`/api/supabase/zones?t=${Date.now()}`),
        fetchWithRetry(`/api/supabase/settings?t=${Date.now()}`)
      ])
      const zonesData = zr.status === 'fulfilled' && zr.value ? await zr.value.json() : null
      const settingsData = sr.status === 'fulfilled' && sr.value ? await sr.value.json() : null
      if (zonesData && Array.isArray(zonesData.zones)) setZones(zonesData.zones)
      if (settingsData && settingsData.settings) setSettings(settingsData.settings)
    } catch (e) { console.error(e) }
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

  const activeZones = zones.filter(z => z.active && z.key !== 'a-tester').sort((a, b) => a.order - b.order)

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
                      {zoneIcons[zone.key] || <span className="font-bold text-2xl">{zone.badge}</span>}
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <h3 data-section={zone.title_key} className="text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-2 tracking-wide">{t(zone.title_key)}</h3>
                    <p data-section={zone.subtitle_key} className={`${cs.text} text-lg font-semibold tracking-wide`}>{t(zone.subtitle_key)}</p>
                  </div>
                </div>

                <p data-section={`solutions_${zone.key}_desc_long`} className="text-[#86868b] text-base leading-relaxed mb-8 max-w-4xl">{t('solutions_' + zone.key + '_desc_long', '')}</p>

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
          title={t('testimonial_title', 'Ils nous font confiance')}
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
