'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { usePathname } from 'next/navigation'
import { useSettings } from '@/lib/SettingsContext'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'
import SEOHead from '@/components/SEOHead'
import { useTexts, TextItem } from '@/lib/useTexts'

export default function ContactPage() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const { settings: globalSettings } = useSettings()
  const { texts, loading } = useTexts()
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

  const getText = (key: string, fallback: string = ''): string => {
    const text = texts.find(t => t.key === key)
    if (text) {
      const val = text[lang as keyof TextItem]
      if (val && val.trim() !== '') return val
      return (text.fr && text.fr.trim() !== '') ? text.fr : fallback || key
    }
    return fallback || key
  }

  const formatPhone = (phone: string): string => {
    if (!phone) return phone
    const digits = phone.replace(/\D/g, '')
    if (phone.startsWith('+33') && digits.length >= 10) {
      const d = digits.slice(2) // 664100569
      return '+33 ' + d[0] + ' ' + d.slice(1, 3) + ' ' + d.slice(3, 5) + ' ' + d.slice(5, 7) + ' ' + d.slice(7, 9)
    }
    if (phone.startsWith('+351') && digits.length >= 9) {
      const d = digits.slice(3) // 923319672
      return '+351 ' + d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 9)
    }
    return phone
  }

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

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center text-white">Chargement...</div>

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
          title={contactTitle.includes('avenir') ? (
            <>
              {contactTitle.split('avenir')[0]}
              <span className="neon-text">avenir</span>
              {contactTitle.split('avenir')[1]}
            </>
          ) : contactTitle}
          subtitle={getText('contact_subtitle', 'Vous avez un projet innovant ? Une question sur nos solutions ? Notre équipe (et notre IA) est à votre écoute.')}
          particlesCount={15}
          titleDataSection="contact-title"
          subtitleDataSection="contact-subtitle"
          backgroundImage="https://newappai.com/uploads/hero-ai-v2-wide.jpg"
        />

        <AppleSection>
          <AppleCard padding="lg" className="max-w-3xl mx-auto">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/5 blur-[80px] rounded-full -z-10"></div>
            
            {/* Google Maps */}
            {(globalSettings as any)?.contact?.maps_url && (
              <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 h-[300px] md:h-[400px]">
                <iframe
                  src={(globalSettings as any).contact.maps_url.includes("embed") ? (globalSettings as any).contact.maps_url : `https://maps.google.com/maps?q=${(globalSettings as any).contact.lat || "44.961542"},${(globalSettings as any).contact.lng || "-0.626380"}&z=15&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NewAppAI - Bordeaux"
                />
              </div>
            )}

            {/* Contact Info */}
            {globalSettings?.contact && (globalSettings.contact.email || globalSettings.contact.phone || globalSettings.contact.address) && (
              <>
                <h2 className="sr-only">Informations de contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 p-6 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/[0.08] shadow-lg shadow-black/30">
                {globalSettings.contact.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p data-section="contact_phone_fr" className="text-xs text-[#86868b] font-normal">{getText('contact_phone_fr', 'Téléphone (France)')}</p>
                      <a href={`tel:${globalSettings.contact.phone}`} className="text-white font-semibold hover:text-violet-400 transition text-sm">{formatPhone(globalSettings.contact.phone)}</a>
                    </div>
                  </div>
                )}
                {globalSettings.contact.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p data-section="contact_info_email" className="text-xs text-[#86868b] font-normal">{getText('contact_info_email', 'Email')}</p>
                      <a href={`mailto:${globalSettings.contact.email}`} className="text-white font-semibold hover:text-violet-400 transition text-sm">{globalSettings.contact.email}</a>
                    </div>
                  </div>
                )}
                {globalSettings.contact.phone_pt && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p data-section="contact_phone_pt" className="text-xs text-[#86868b] font-normal">{getText('contact_phone_pt', 'Téléphone (Portugal)')}</p>
                      <a href={`tel:${globalSettings.contact.phone_pt}`} className="text-white font-semibold hover:text-violet-400 transition text-sm">{formatPhone(globalSettings.contact.phone_pt)}</a>
                    </div>
                  </div>
                )}
                {globalSettings.contact.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p data-section="contact_address" className="text-xs text-[#86868b] font-normal">{getText('contact_address', 'Adresse')}</p>
                      <p className="text-white font-semibold text-sm">{globalSettings.contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
              </>
            )}

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
                  <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4"><span data-section="contact-sent">{getText('contact_sent', 'Message envoyé !')}</span></h2>
                <p className="text-slate-400 text-lg font-medium"><span data-section="contact-sent-desc">{getText('contact_sent_desc', 'Nous vous répondrons dans les plus brefs délais.')}</span></p>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-5 py-4 text-violet-300 font-semibold text-sm">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span data-section="contact-response-time">{getText('contact_response_time', 'Nous répondons sous 24h')}</span>
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
                    <label htmlFor="name" className="text-sm font-semibold text-[#86868b] ml-1"><span data-section="contact-name">{getText('contact_name', 'Nom complet')}</span></label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setInvalidFields(prev => ({ ...prev, name: false })) }}
                      onInvalid={handleInvalid('name')}
                      className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium ${invalidFields.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-violet-500 focus:ring-violet-500'}`}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="email" className="text-sm font-semibold text-[#86868b] ml-1"><span data-section="contact-email">{getText('contact_email', 'Email professionnel')}</span></label>
                    <input
                      type="email"
                      id="email"
                      placeholder="jean@entreprise.com (confirmation envoyée ici)"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setInvalidFields(prev => ({ ...prev, email: false })) }}
                      onInvalid={handleInvalid('email')}
                      className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium ${invalidFields.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-violet-500 focus:ring-violet-500'}`}
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      title="Format email valide: nom@domaine.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="subject" className="text-sm font-semibold text-[#86868b] ml-1"><span data-section="contact-subject">{getText('contact_subject', 'Sujet')}</span></label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-950/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>{getText('contact_subject_placeholder', 'Sélectionnez un sujet')}</option>
                    {subjects.map((s, i) => (
                      <option key={i} value={s} className="bg-slate-900" data-section={`contact-subject-${i + 1}`}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="message" className="text-sm font-semibold text-[#86868b] ml-1"><span data-section="contact-message">{getText('contact_message', 'Votre message')}</span></label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setInvalidFields(prev => ({ ...prev, message: false })) }}
                    onInvalid={handleInvalid('message')}
                    className={`bg-slate-950/60 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 transition-all font-medium resize-none ${invalidFields.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-violet-500 focus:ring-violet-500'}`}
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
                    className="bg-violet-500 text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-violet-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {submitting ? 'Envoi...' : <span data-section="contact-send">{getText('contact_send', 'Envoyer le message')}</span>}
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

