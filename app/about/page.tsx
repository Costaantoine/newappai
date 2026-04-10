'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { usePathname } from 'next/navigation'

interface TextItem {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

export default function AboutPage() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/local/texts')
      .then(res => res.json())
      .then(data => {
        setTexts(data.texts || data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch texts:', err)
        setLoading(false)
      })
  }, [pathname])

  const getText = (key: string): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const val = text[lang as keyof TextItem]
      if (val && val.trim() !== '') return val
      return (text.fr && text.fr.trim() !== '') ? text.fr : key
    }
    return key
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center">
        <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-center">
          {getText('about_title').replace('Histoire', <span className="neon-text" key="hist">Histoire</span> as any)}
        </h1>
        <p className="text-slate-400 max-w-3xl text-lg mb-12 leading-relaxed text-center">
          {getText('about_subtitle')}
        </p>

        <div className="max-w-4xl mx-auto glass p-10 rounded-[2.5rem] border-white/5">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-sky-400">{getText('about_vision_title')}</h2>
              <p className="text-slate-300 leading-relaxed">{getText('about_vision_desc')}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-sky-400">{getText('about_approach_title')}</h2>
              <p className="text-slate-300 leading-relaxed">{getText('about_approach_desc')}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-sky-400">{getText('about_values_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-slate-950/40 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-2 text-white">{getText('about_innovation_title')}</h3>
                  <p className="text-slate-400 text-sm">{getText('about_innovation_desc')}</p>
                </div>
                <div className="bg-slate-950/40 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-2 text-white">{getText('about_proximity_title')}</h3>
                  <p className="text-slate-400 text-sm">{getText('about_proximity_desc')}</p>
                </div>
                <div className="bg-slate-950/40 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-2 text-white">{getText('about_excellence_title')}</h3>
                  <p className="text-slate-400 text-sm">{getText('about_excellence_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
