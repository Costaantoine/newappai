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
        setTexts(Array.isArray(data.texts) ? data.texts : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch texts:', err)
        setLoading(false)
      })
  }, [pathname])

  const getText = (key: string, fallback: string = ''): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const val = text[lang as keyof TextItem]
      if (val && val.trim() !== '') return val
      return (text.fr && text.fr.trim() !== '') ? text.fr : fallback || key
    }
    return fallback || key
  }

  const aboutTitle = getText('about_title', 'Notre Histoire')

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        <section className="relative pt-40 pb-20 px-6 flex flex-col items-center">
          <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-center text-white leading-tight">
            {aboutTitle.includes('Histoire') ? (
              <>
                {aboutTitle.split('Histoire')[0]}
                <span className="neon-text">Histoire</span>
                {aboutTitle.split('Histoire')[1]}
              </>
            ) : aboutTitle}
          </h1>
          
          <p className="text-slate-400 max-w-3xl text-lg md:text-2xl mb-14 leading-relaxed text-center font-medium">
            {getText('about_subtitle', 'Une passion pour l\'innovation, une mission pour votre réussite.')}
          </p>

          <div className="w-full max-w-5xl mx-auto backdrop-blur-md bg-white/5 p-8 md:p-14 rounded-[3rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full -z-10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-10">
                <div className="group">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                    <span className="w-2 h-8 bg-sky-500 rounded-full mr-4 group-hover:h-10 transition-all"></span>
                    {getText('about_vision_title', 'Notre Vision')}
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {getText('about_vision_desc', 'Chez NewAppAI, nous croyons que la technologie doit servir l\'humain, pas l\'inverse. Notre mission est de rendre l\'innovation accessible à toutes les entreprises, quelle que soit leur taille.')}
                  </p>
                </div>

                <div className="group">
                  <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                    <span className="w-2 h-8 bg-sky-500 rounded-full mr-4 group-hover:h-10 transition-all"></span>
                    {getText('about_approach_title', 'Notre Approche')}
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {getText('about_approach_desc', 'Nous développons des solutions sur-mesure qui s\'adaptent à vos besoins spécifiques. Chaque projet est unique, et nous nous engageons à vous accompagner à chaque étape de votre transformation digitale.')}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8 text-white">{getText('about_values_title', 'Nos Valeurs')}</h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { key: 'innovation', title: 'Innovation', desc: 'Toujours à la pointe des technologies' },
                    { key: 'proximity', title: 'Proximité', desc: 'Un accompagnement personnalisé' },
                    { key: 'excellence', title: 'Excellence', desc: 'Des solutions de qualité supérieure' }
                  ].map((value) => (
                    <div key={value.key} className="bg-slate-900/60 p-8 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all duration-300 group">
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-sky-400 transition-colors">
                        {getText(`about_${value.key}_title`, value.title)}
                      </h3>
                      <p className="text-slate-400 leading-relaxed font-medium">
                        {getText(`about_${value.key}_desc`, value.desc)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

