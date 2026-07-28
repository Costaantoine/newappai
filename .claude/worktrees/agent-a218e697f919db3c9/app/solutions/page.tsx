'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'
import TestimonialCarousel from '@/components/TestimonialCarousel'

interface TextItem { id: string; key: string; fr: string; en: string; pt: string; es: string }
interface Zone { id: string; key: string; title_key: string; subtitle_key: string; badge: string; color: string; url: string; cta_key: string; newtab_key: string; icon_url?: string; order: number; active: boolean }

const icons: Record<string, any> = {
  commerce: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  industrie: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  comptabilite: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  droit: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  webdesign: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  'outils-services': <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'a-tester': <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
}

const colorStyles: Record<string, { blur: string; text: string; bg: string; border: string }> = {
  sky:     { blur: 'bg-sky-500/10', text: 'text-sky-400', bg: 'bg-sky-500', border: 'border-sky-500/30' },
  indigo:  { blur: 'bg-indigo-500/10', text: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-500/30' },
  emerald: { blur: 'bg-emerald-500/10', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30' },
  purple:  { blur: 'bg-purple-500/10', text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30' },
  pink:    { blur: 'bg-pink-500/10', text: 'text-pink-400', bg: 'bg-pink-500', border: 'border-pink-500/30' },
  amber:   { blur: 'bg-amber-500/10', text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30' },
  rose:    { blur: 'bg-rose-500/10', text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/30' },
}

export default function SolutionsPage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const handler = () => { if (!document.hidden) fetchData() }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [lang])

  const fetchData = async () => {
    try {
      const [tr, zr] = await Promise.all([
        fetch(`/api/supabase/texts?t=${Date.now()}`),
        fetch(`/api/supabase/zones?t=${Date.now()}`)
      ])
      const textsData = await tr.json()
      const zonesData = await zr.json()
      setTexts(Array.isArray(textsData.texts) ? textsData.texts : [])
      setZones(Array.isArray(zonesData.zones) ? zonesData.zones : [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const t = (key: string, fb = ''): string => {
    const found = texts.find(x => x.key === key)
    if (found) { const v = found[lang as 'fr'|'en'|'pt'|'es']; return v || found.fr || fb || key }
    return fb || key
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  const activeZones = zones.filter(z => z.active).sort((a, b) => a.order - b.order)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        <section className="relative pt-40 pb-16 px-6 flex flex-col items-center text-center">
          <div className="absolute top-10 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
          <ParticlesBackground count={20} />
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight animate-fade-in-up">
              {t('solutions_title', 'Des outils intelligents pour chaque étape de votre activité.').includes('intelligents') ? (
                <>{t('solutions_title', '').split('intelligents')[0]}<span className="neon-text">intelligents</span>{t('solutions_title', '').split('intelligents')[1]}</>
              ) : t('solutions_title', 'Des outils intelligents pour chaque étape de votre activité.')}
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <span>{t('solutions_subtitle', 'Choisissez l\'innovation qui s\'adapte à votre métier.')}</span>
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 pb-32 space-y-20">
          {activeZones.map((zone) => {
            const cs = colorStyles[zone.color] || colorStyles.sky
            const siteUrl = t(zone.key + '_site_url', '')
            return (
              <div key={zone.id} id={zone.key} className={`animate-fade-in-up backdrop-blur-md bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden ${zone.order === 0 ? 'border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.1)]' : ''}`}>
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${cs.blur} blur-[150px] rounded-full -z-10`}></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  {zone.icon_url ? (
                    <img src={zone.icon_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <div className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 ${cs.text}`}>
                      {icons[zone.key] || <span className="font-bold text-2xl">{zone.badge}</span>}
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{t(zone.title_key)}</h3>
                    <p className={`${cs.text} text-lg font-semibold tracking-wide`}>{t(zone.subtitle_key)}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-4xl">{t('solutions_' + zone.key + '_desc_long', '')}</p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/produits" className={`px-8 py-4 rounded-full ${cs.bg} text-white font-bold hover:brightness-110 transition shadow-lg flex items-center`}>
                    Voir nos produits
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                  {(zone.key === 'commerce' || zone.key === 'industrie') && siteUrl && siteUrl !== zone.key + '_site_url' && (
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition flex items-center">
                      Voir le site internet associé
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </section>

        <TestimonialCarousel
          testimonials={[
            { id: '1', title: t('testimonial_1_title', 'Miguel Bras'), description: t('testimonial_1_desc', '') },
            { id: '2', title: t('testimonial_2_title', 'Pizzeria Portugal'), description: t('testimonial_2_desc', '') },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
