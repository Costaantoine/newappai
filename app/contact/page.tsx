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

  const subjects = [
    getText('contact_subject_1'),
    getText('contact_subject_2'),
    getText('contact_subject_3'),
    getText('contact_subject_4')
  ]

  return (
    <>
      <Header />

      <section id="contact" className="relative pt-48 pb-20 px-6 flex flex-col items-center">
        <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-center">
          {getText('contact_title').replace('avenir', <span className="neon-text" key="avenir">avenir</span> as any)}
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg mb-12 leading-relaxed text-center">
          {getText('contact_subtitle')}
        </p>

        <div className="w-full max-w-3xl glass p-10 rounded-[2.5rem] border-white/5 relative z-10">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{getText('contact_sent')}</h2>
              <p className="text-slate-400">{getText('contact_sent_desc')}</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-300">{getText('contact_name')}</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-300">{getText('contact_email')}</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-300">{getText('contact_subject')}</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                >
                  {subjects.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-300">{getText('contact_message')}</label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                  placeholder={getText('contact_placeholder')}
                  required
                />
              </div>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-10 py-4 rounded-full text-base font-bold hover:scale-105 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {submitting ? '...' : getText('contact_send')}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
