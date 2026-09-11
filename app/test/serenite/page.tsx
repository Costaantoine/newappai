'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'
import { useLanguage } from '@/lib/LanguageContext'
import { useTexts, TextItem } from '@/lib/useTexts'

const EXAMPLE_IDS = ['ex1', 'ex2', 'ex3', 'ex4']

const EMERGENCY: Record<string, string> = {
  fr: 'Si vous ou un enfant \u00eates en danger, contactez le 119 (All\u00f4 Enfance en Danger) ou le 3919 (violences conjugales). En cas d\u2019urgence imm\u00e9diate, appelez le 17 ou le 112.',
  en: 'If you or a child are in danger, contact 112 (European emergency) or the National Domestic Violence Helpline (0808 2000 247). For immediate danger, call your local emergency number.',
  pt: 'Se voc\u00ea ou uma crian\u00e7a estiverem em perigo, ligue para o 112 (emerg\u00eancia europeia) ou para o SNS 24 (808 24 24 24). Em caso de perigo imediato, ligue 112.',
  es: 'Si usted o un ni\u00f1o est\u00e1n en peligro, llame al 112 (emergencias europeas) o al 016 (violencia de g\u00e9nero). En caso de peligro inmediato, llame al 112.',
}

const overrideStyles =
  '#test-serenite-page header, #test-serenite-page footer { background: #000 !important; --color-header-bg: #000 !important; }' +
  '#test-serenite-page header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }' +
  '#test-serenite-page footer { border-top-color: rgb(38 38 38) !important; }' +
  '.bottom-carousel p:first-child { display: none !important; }' +
  '.bottom-carousel img:not(.brand-logo-img) { display: none !important; }' +
  '.bottom-carousel [class*="h-28"] { display: none !important; }' +
  '.top-carousel p:first-child { display: none !important; }' +
  '@media (max-width: 767px) {' +
  '.top-carousel a { min-width: 80px !important; max-width: 80px !important; }' +
  '.top-carousel [class*="h-28"] { height: 1.5rem !important; }' +
  '.top-carousel [class*="p-3"] { padding: 0.125rem !important; }' +
  '.top-carousel h3 { font-size: 9px !important; }' +
  '.top-carousel [class*="gap-"] { gap: 0.25rem !important; }' +
  '.bottom-carousel a { min-width: 80px !important; max-width: 80px !important; }' +
  '.bottom-carousel [class*="h-28"] { height: 1.5rem !important; }' +
  '.bottom-carousel [class*="p-3"] { padding: 0.125rem !important; }' +
  '.bottom-carousel h3 { font-size: 9px !important; }' +
  '.bottom-carousel [class*="gap-"] { gap: 0.25rem !important; }' +
  '}'

export default function TestSerenitePage() {
  const { lang } = useLanguage()
  const { texts, loading } = useTexts('serenite')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{
    niveau_alerte: string
    message_reformule: string | null
    raison: string
  } | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getText = useCallback(
    (key: string, fallback: string = ''): string => {
      if (!texts.length) return fallback
      const item = texts.find((t: TextItem) => t.key === key)
      if (!item) return fallback
      return item[lang as keyof Pick<TextItem, 'fr' | 'en' | 'pt' | 'es'>] || item.fr || fallback
    },
    [texts, lang]
  )

  const handleSubmit = useCallback(async (message?: string) => {
    const msg = message || input.trim()
    if (!msg) return
    setLoadingAI(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/serenite-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, lang }),
      })
      if (res.status === 429) {
        setError(getText('serenite_error_rate', 'Trop de requ\u00eates. R\u00e9essayez dans une minute.'))
        return
      }
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setResult(data)
    } catch {
      setError(getText('serenite_error_generic', 'Erreur. R\u00e9essayez.'))
    } finally {
      setLoadingAI(false)
    }
  }, [input, lang, getText])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Chargement...</div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
      <div id="test-serenite-page" className="min-h-screen bg-black text-white">
        <Header />
        <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Titre + Pitch */}
            <div className="text-center mb-10">
              <span data-section="serenite_badge"
                className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-teal-400 mb-4">
                {getText('serenite_badge', 'Test \u2014 S\u00e9r\u00e9nit\u00e9')}
              </span>
              <h1 data-section="serenite_title"
                className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
                {getText('serenite_title', 'Communication apais\u00e9e entre parents')}
              </h1>
              <p data-section="serenite_description"
                className="text-neutral-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                {getText('serenite_description', "Avant d'envoyer un message tendu, notre IA vous propose une reformulation plus douce.")}
              </p>
            </div>

            {/* Carrousel haut */}
            <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
              <Carousel speed={90} />
            </div>

            {/* Contenu interactif */}
            <div className="max-w-lg mx-auto space-y-5">

              {/* Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p data-section="serenite_disclaimer"
                   className="text-yellow-200/80 text-xs leading-relaxed text-center">
                  {getText('serenite_disclaimer',
                    "Ceci est une d\u00e9monstration. N'entrez pas d'informations personnelles r\u00e9elles. Les messages ne sont pas conserv\u00e9s mais sont trait\u00e9s par un service d'intelligence artificielle tiers.")}
                </p>
              </div>

              {/* Boutons d\u00e9xemple */}
              <div className="grid grid-cols-2 gap-2">
                {EXAMPLE_IDS.map((id) => (
                  <button key={id}
                    onClick={() => {
                      const txt = getText('serenite_' + id + '_text')
                      setInput(txt)
                      handleSubmit(txt)
                    }}
                    disabled={loadingAI}
                    className="bg-neutral-900 border border-neutral-700 hover:border-teal-500/40 rounded-xl p-3 text-left transition disabled:opacity-50">
                    <span className="text-[10px] text-teal-400 font-medium block mb-1">
                      {getText('serenite_' + id + '_label', 'Exemple')}
                    </span>
                    <span className="text-neutral-300 text-xs line-clamp-2">
                      {getText('serenite_' + id + '_text', '...')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Champ de saisie */}
              <div className="relative">
                <textarea value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getText('serenite_input_placeholder', 'Tapez ou collez un message...')}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-teal-500/40 resize-none" />
              </div>

              {/* Bouton Adoucir */}
              <button onClick={() => handleSubmit()}
                disabled={!input.trim() || loadingAI}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-medium py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2">
                {loadingAI ? (
                  <>
                    <span className="animate-spin inline-block">&#8987;</span>
                    {' ' + getText('serenite_loading', 'Analyse en cours...')}
                  </>
                ) : (
                  getText('serenite_btn_soften', '\u2728 Adoucir mon message')
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* R\u00e9sultat */}
              {result && (
                <div className="space-y-3">
                  {/* Badge tension */}
                  <div className="flex items-center gap-2">
                    {result.niveau_alerte === 'ok' && (
                      <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        {getText('serenite_label_ok', 'Message OK')}
                      </span>
                    )}
                    {result.niveau_alerte === 'tendu' && (
                      <span className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        {getText('serenite_label_softened', 'Message adouci')}
                      </span>
                    )}
                    {result.niveau_alerte === 'critique' && (
                      <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {'\u26A0\uFE0F ' + getText('serenite_critique_title', 'Niveau critique')}
                      </span>
                    )}
                  </div>

                  {/* Message original */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide mb-2">
                      {getText('serenite_label_original', 'Message original')}
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{input}</p>
                  </div>

                  {/* Bloc CRITIQUE \u2014 JAMAIS la reformulation */}
                  {result.niveau_alerte === 'critique' && (
                    <div className="bg-red-950 border-2 border-red-500/30 rounded-xl p-6 text-center">
                      <div className="text-3xl mb-3">{'\uD83D\uDEE1\uFE0F'}</div>
                      <p className="text-red-200 text-sm leading-relaxed font-medium">
                        {getText('serenite_critique_msg',
                          "Cette d\u00e9mo n'est pas con\u00e7ue pour traiter ce type de message. " + EMERGENCY[lang] || EMERGENCY.fr)}
                      </p>
                    </div>
                  )}

                  {/* R\u00e9sultat OK ou TENDU */}
                  {result.niveau_alerte !== 'critique' && result.message_reformule && (
                    <div className="bg-neutral-950 border border-teal-500/20 rounded-xl p-4">
                      <p className="text-[10px] text-teal-400 uppercase tracking-wide mb-2">
                        {getText('serenite_label_softened', 'Message adouci')}
                      </p>
                      <p className="text-white text-sm leading-relaxed">{result.message_reformule}</p>
                      {result.raison && (
                        <p className="text-neutral-500 text-xs mt-2 italic">{result.raison}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment \u00e7a marche */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 data-section="serenite_how_title"
                className="text-center text-neutral-400 text-xs tracking-widest uppercase mb-8">
                {getText('serenite_how_title', 'Comment \u00e7a marche')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {step}
                    </div>
                    <h3 data-section={'serenite_how_step' + step + '_title'}
                      className="text-white text-sm font-medium mb-1.5">
                      {getText('serenite_how_step' + step + '_title', '\u00c9tape ' + step)}
                    </h3>
                    <p data-section={'serenite_how_step' + step + '_desc'}
                      className="text-neutral-500 text-xs leading-relaxed">
                      {getText('serenite_how_step' + step + '_desc', '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrousel bas */}
            <div className="bottom-carousel fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-neutral-800 px-2 sm:px-4 py-1">
              <div className="max-w-6xl mx-auto overflow-hidden">
                <Carousel variant="brands" speed={90} />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
