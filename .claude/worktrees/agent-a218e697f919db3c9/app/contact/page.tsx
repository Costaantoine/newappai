'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { usePathname } from 'next/navigation'
import { useSettings } from '@/lib/SettingsContext'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'

interface TextItem {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

export default function ContactPage() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const { settings: globalSettings } = useSettings()
  const [texts, setTexts] = useState<TextItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [textsRes, settingsRes] = await Promise.all([
          fetch('/api/supabase/texts'),
          fetch('/api/supabase/settings')
        ])
        const textsData = await textsRes.json()
        setTexts(Array.isArray(textsData.texts) ? textsData.texts : [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Une erreur est survenue. Veuillez réessayer.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  const subjects = [
    getText('contact_subject_1', 'Demande de démo'),
    getText('contact_subject_2', 'Partenariat'),
    getText('contact_subject_3', 'Support technique'),
    getText('contact_subject_4', 'Autre')
  ]

  // Titre depuis settings avec fallback
  const contactTitle = globalSettings?.contact_page?.title?.[lang as keyof typeof globalSettings.contact_page.title] 
    || globalSettings?.contact_page?.title?.fr 
    || 'Contactez l\'avenir'

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        <section id="contact" className="relative pt-48 pb-20 px-6 flex flex-col items-center">
          <div className="absolute top-10 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
          <ParticlesBackground count={15} />
          
          <h1 data-section="contact-title" className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-center text-white leading-tight animate-fade-in-up">
            {contactTitle.includes('avenir') ? (
              <>
                {contactTitle.split('avenir')[0]}
                <span className="neon-text">avenir</span>
                {contactTitle.split('avenir')[1]}
              </>
            ) : contactTitle}
          </h1>
          
          <p data-section="contact-subtitle" className="text-slate-400 max-w-2xl text-lg md:text-2xl mb-14 leading-relaxed text-center font-medium animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {getText('contact_subtitle', 'Vous avez un projet innovant ? Une question sur nos solutions ? Notre équipe (et notre IA) est à votre écoute.')}
          </p>

          <div className="w-full max-w-3xl backdrop-blur-md bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 relative z-10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/5 blur-[80px] rounded-full -z-10"></div>
            
            {/* Contact Info */}
            {globalSettings?.contact && (globalSettings.contact.email || globalSettings.contact.phone || globalSettings.contact.address) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6 bg-white/5 rounded-2xl border border-white/5">
                {globalSettings.contact.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Email</p>
                      <a href={`mailto:${globalSettings.contact.email}`} className="text-white font-semibold hover:text-sky-400 transition text-sm">{globalSettings.contact.email}</a>
                    </div>
                  </div>
                )}
                {globalSettings.contact.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Téléphone</p>
                      <a href={`tel:${globalSettings.contact.phone}`} className="text-white font-semibold hover:text-sky-400 transition text-sm">{globalSettings.contact.phone}</a>
                    </div>
                  </div>
                )}
                {globalSettings.contact.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Adresse</p>
                      <p className="text-white font-semibold text-sm">{globalSettings.contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <svg className="w-10 h-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4"><span data-section="contact-sent">{getText('contact_sent', 'Message envoyé !')}</span></h2>
                <p className="text-slate-400 text-lg font-medium"><span data-section="contact-sent-desc">{getText('contact_sent_desc', 'Nous vous répondrons dans les plus brefs délais.')}</span></p>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="name" className="text-sm font-bold text-slate-300 ml-1"><span data-section="contact-name">{getText('contact_name', 'Nom complet')}</span></label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="email" className="text-sm font-bold text-slate-300 ml-1"><span data-section="contact-email">{getText('contact_email', 'Email professionnel')}</span></label>
                    <input
                      type="email"
                      id="email"
                      placeholder="jean@entreprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      title="Format email valide: nom@domaine.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="subject" className="text-sm font-bold text-slate-300 ml-1"><span data-section="contact-subject">{getText('contact_subject', 'Sujet')}</span></label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>{getText('contact_subject_placeholder', 'Sélectionnez un sujet')}</option>
                    {subjects.map((s, i) => (
                      <option key={i} value={s} className="bg-slate-900" data-section={`contact-subject-${i + 1}`}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="message" className="text-sm font-bold text-slate-300 ml-1"><span data-section="contact-message">{getText('contact_message', 'Votre message')}</span></label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium resize-none"
                    placeholder={getText('contact_placeholder', 'Dites-nous tout...')}
                    required
                  />
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 font-bold text-center">
                    {submitError}
                  </div>
                )}

                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-12 py-4 rounded-full text-lg font-black hover:scale-105 transition-all shadow-xl shadow-sky-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 uppercase tracking-widest"
                  >
                    {submitting ? 'Envoi...' : <span data-section="contact-send">{getText('contact_send', 'Envoyer le message')}</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

