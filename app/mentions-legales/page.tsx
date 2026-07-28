'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

interface TextItem { id: string; key: string; fr: string; en: string; pt: string; es: string }

export default function MentionsLegalesPage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/supabase/texts?section=legal')
      .then(res => res.json())
      .then(data => { setTexts(data.texts || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const t = (key: string, fb: string = ''): string => {
    const found = texts.find(x => x.key === key)
    if (found) { const v = found[lang as 'fr'|'en'|'pt'|'es']; return v || found.fr || fb }
    return fb || key
  }

  const companyName = 'NewAppAI'
  const companyEmail = 'contact@newappai.com'
  const companyAddress = 'France'
  const hostName = 'Coolify / OVH'
  const fill = (text: string) => text.replace(/{company}/g, companyName).replace(/{email}/g, companyEmail).replace(/{address}/g, companyAddress).replace(/{host}/g, hostName)

  useEffect(() => { document.title = t('legal_mentions_title', 'Mentions légales') + ' | NewAppAI' }, [lang, texts])

  if (loading) return <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white"><Header /></div>

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6 bg-[#000000]">
        <div className="max-w-3xl mx-auto">
          <h1 data-section="legal-mentions-title" className="text-4xl font-bold mb-10 tracking-tight text-[#f5f5f7]">
            {t('legal_mentions_title', 'Mentions légales')}
          </h1>
          <div className="space-y-10 text-[#86868b] leading-relaxed">
            {[
              { num: 1, label: 'Éditeur du site' },
              { num: 2, label: 'Hébergement' },
              { num: 3, label: 'Propriété intellectuelle' },
              { num: 4, label: 'Limitation de responsabilité' },
              { num: 5, label: 'Données personnelles' },
              { num: 6, label: 'Cookies' },
              { num: 7, label: 'Droit applicable' },
            ].map(s => (
              <section key={s.num}>
                <h2 data-section={`legal-mentions-section-${s.num}`} className="text-xl font-semibold text-[#f5f5f7] mb-3">{t(`legal_mentions_section_${s.num}_title`, `${s.num}. ${s.label}`)}</h2>
                <p>{fill(t(`legal_mentions_section_${s.num}_content`, ''))}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
