'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'
import SEOHead from '@/components/SEOHead'

const CONTACT_INFO = {
  franceAddress: '4 Impasse ZA Landegrand, 33290 Parempuyre, France',
  francePhone: '+33 6 64 10 05 69',
  franceLat: 44.961542,
  franceLng: -0.626380,
  portugalAddress: 'R. Associação Desportiva Oliveirense 567, Oliveira Santa Maria, Portugal',
  portugalPhone: '+351 923 319 672',
  portugalLat: 41.407270,
  portugalLng: -8.416475,
  email: 'contact@newappai.com',
  linkedin: 'https://www.linkedin.com/company/newappai'
}

const SUBJECTS = ['Demande de démo', 'Partenariat', 'Support technique', 'Autre']

export default function ContactPage() {
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot anti-spam
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [invalidFields, setInvalidFields] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({})
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const csrfRes = await fetch('/api/csrf')
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json()
          setCsrfToken(csrfData.token || '')
        }
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err)
      }
    }
    fetchCsrf()
  }, [pathname])

  const handleInvalid = (field: 'name' | 'email' | 'message') => (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setInvalidFields(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (formData.website) {
      // Honeypot rempli : trafic de bot, on simule un succès sans rien envoyer
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers,
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

  return (
    <>
      <SEOHead
        title="Contactez NewAppAI | Innovation Logicielle — IA pour votre entreprise"
        description="Vous avez un projet innovant ? Contactez NewAppAI pour vos solutions IA et logicielles. Réponse sous 24h."
        ogUrl="https://newappai.com/contact"
      />
      <Header />

      <main className="min-h-screen bg-[#000000] overflow-x-hidden">
        <AppleHero
          title="Contactez l'avenir"
          subtitle="Vous avez un projet innovant ? Une question sur nos solutions ? Notre équipe (et notre IA) est à votre écoute."
          titleDataSection="contact-title"
          subtitleDataSection="contact-subtitle"
        />

        <AppleSection>
          <AppleCard padding="lg" className="max-w-3xl mx-auto">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Carte 1 : NewAppAI — France */}
              <div className="p-6 bg-[#272729] rounded-lg flex flex-col gap-4">
                <div className="rounded-lg overflow-hidden h-[200px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${CONTACT_INFO.franceLat},${CONTACT_INFO.franceLng}&z=15&output=embed`}
                    width="100%" height="100%" style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NewAppAI — France"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#2997ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-white">NewAppAI — France</p>
                </div>
                <div>
                  <p className="text-xs text-[#86868b] font-normal">Adresse</p>
                  <p className="text-white font-semibold text-sm">{CONTACT_INFO.franceAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-[#86868b] font-normal">Téléphone</p>
                  <a href={`tel:${CONTACT_INFO.francePhone}`} className="text-white font-semibold hover:text-[#2997ff] transition text-sm">{CONTACT_INFO.francePhone}</a>
                </div>
              </div>

              {/* Carte 2 : NewAppAI — Portugal */}
              <div className="p-6 bg-[#272729] rounded-lg flex flex-col gap-4">
                <div className="rounded-lg overflow-hidden h-[200px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${CONTACT_INFO.portugalLat},${CONTACT_INFO.portugalLng}&z=15&output=embed`}
                    width="100%" height="100%" style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NewAppAI — Portugal"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0071e3]/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#2997ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-white">NewAppAI — Portugal</p>
                </div>
                <div>
                  <p className="text-xs text-[#86868b] font-normal">Adresse</p>
                  <p className="text-white font-semibold text-sm">{CONTACT_INFO.portugalAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-[#86868b] font-normal">Téléphone</p>
                  <a href={`tel:${CONTACT_INFO.portugalPhone}`} className="text-white font-semibold hover:text-[#2997ff] transition text-sm">{CONTACT_INFO.portugalPhone}</a>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="p-6 bg-[#272729] rounded-lg flex flex-col gap-4 mb-12">
              <p className="text-sm font-semibold text-white">Informations de contact</p>
              <div>
                <p className="text-xs text-[#86868b] font-normal">Email</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-white font-semibold hover:text-[#2997ff] transition text-sm">{CONTACT_INFO.email}</a>
              </div>
              <div className="flex items-center gap-3 bg-[#0071e3]/10 rounded-lg px-5 py-3 text-[#2997ff] font-semibold text-sm w-fit">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Nous répondons sous 24h</span>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#0071e3]/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
                  <svg className="w-10 h-10 text-[#2997ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Message envoyé !</h2>
                <p className="text-slate-400 text-lg font-medium">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 bg-[#0071e3]/10 rounded-lg px-5 py-4 text-[#2997ff] font-semibold text-sm">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Nous répondons sous 24h</span>
                </div>

                {/* Honeypot anti-spam : champ invisible, ne doit jamais être rempli par un humain */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] w-px h-px opacity-0 overflow-hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="name" className="text-sm font-semibold text-[#86868b] ml-1">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setInvalidFields(prev => ({ ...prev, name: false })) }}
                      onInvalid={handleInvalid('name')}
                      className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium ${invalidFields.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#0071e3] focus:ring-[#0071e3]'}`}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="email" className="text-sm font-semibold text-[#86868b] ml-1">Email professionnel</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="jean@entreprise.com (confirmation envoyée ici)"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setInvalidFields(prev => ({ ...prev, email: false })) }}
                      onInvalid={handleInvalid('email')}
                      className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium ${invalidFields.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#0071e3] focus:ring-[#0071e3]'}`}
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      title="Format email valide: nom@domaine.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="subject" className="text-sm font-semibold text-[#86868b] ml-1">Sujet</label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Sélectionnez un sujet</option>
                    {SUBJECTS.map((s, i) => (
                      <option key={i} value={s} className="bg-slate-900">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="message" className="text-sm font-semibold text-[#86868b] ml-1">Votre message</label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setInvalidFields(prev => ({ ...prev, message: false })) }}
                    onInvalid={handleInvalid('message')}
                    className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium resize-none ${invalidFields.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#0071e3] focus:ring-[#0071e3]'}`}
                    placeholder="Dites-nous tout..."
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
                    className="bg-[#0071e3] text-white px-12 py-4 rounded-lg text-lg font-normal hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Envoi...' : 'Envoyer le message'}
                  </button>
                </div>
              </form>
            )}
          </AppleCard>
        </AppleSection>
      </main>

      <Footer />
    </>
  )
}
