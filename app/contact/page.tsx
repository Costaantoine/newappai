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

export default function ContactPage() {
  const { lang } = useLanguage()
  const pathname = usePathname()
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

  const contactTitle = getText('contact_title', 'Contactez l\'avenir')

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-950 overflow-x-hidden">
        <section id="contact" className="relative pt-48 pb-20 px-6 flex flex-col items-center">
          <div className="absolute top-10 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-center text-white leading-tight">
            {contactTitle.includes('avenir') ? (
              <>
                {contactTitle.split('avenir')[0]}
                <span className="neon-text">avenir</span>
                {contactTitle.split('avenir')[1]}
              </>
            ) : contactTitle}
          </h1>
          
          <p className="text-slate-400 max-w-2xl text-lg md:text-2xl mb-14 leading-relaxed text-center font-medium">
            {getText('contact_subtitle', 'Vous avez un projet innovant ? Une question sur nos solutions ? Notre équipe (et notre IA) est à votre écoute.')}
          </p>

          <div className="w-full max-w-3xl backdrop-blur-md bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/5 blur-[80px] rounded-full -z-10"></div>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <svg className="w-10 h-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{getText('contact_sent', 'Message envoyé !')}</h2>
                <p className="text-slate-400 text-lg font-medium">{getText('contact_sent_desc', 'Nous vous répondrons dans les plus brefs délais.')}</p>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="name" className="text-sm font-bold text-slate-300 ml-1">{getText('contact_name', 'Nom complet')}</label>
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
                    <label htmlFor="email" className="text-sm font-bold text-slate-300 ml-1">{getText('contact_email', 'Email professionnel')}</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="jean@entreprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="subject" className="text-sm font-bold text-slate-300 ml-1">{getText('contact_subject', 'Sujet')}</label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>{getText('contact_subject_placeholder', 'Sélectionnez un sujet')}</option>
                    {subjects.map((s, i) => (
                      <option key={i} value={s} className="bg-slate-900">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="message" className="text-sm font-bold text-slate-300 ml-1">{getText('contact_message', 'Votre message')}</label>
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
                    {submitting ? 'Envoi...' : getText('contact_send', 'Envoyer le message')}
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

