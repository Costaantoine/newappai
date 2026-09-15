'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'
import { useLanguage } from '@/lib/LanguageContext'
import { useTexts, TextItem } from '@/lib/useTexts'

const SPEECH_LANGS: Record<string, string> = {
  fr: 'fr-FR', en: 'en-US', pt: 'pt-PT', es: 'es-ES',
}

const overrideStyles = `
  #test-talkie-walkie-page header, #test-talkie-walkie-page footer { background: #000 !important; --color-header-bg: #000 !important; }
  #test-talkie-walkie-page header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
  #test-talkie-walkie-page footer { border-top-color: rgb(38 38 38) !important; }
  .bottom-carousel p:first-child { display: none !important; }
  .bottom-carousel img:not(.brand-logo-img) { display: none !important; }
  .bottom-carousel [class*='h-28'] { display: none !important; }
  .top-carousel p:first-child { display: none !important; }
  @media (max-width: 767px) {
    .top-carousel a { min-width: 80px !important; max-width: 80px !important; }
    .top-carousel [class*='h-28'] { height: 1.5rem !important; }
    .top-carousel [class*='p-3'] { padding: 0.125rem !important; }
    .top-carousel h3 { font-size: 9px !important; }
    .top-carousel [class*='gap-'] { gap: 0.25rem !important; }
    .bottom-carousel a { min-width: 80px !important; max-width: 80px !important; }
    .bottom-carousel [class*='h-28'] { height: 1.5rem !important; }
    .bottom-carousel [class*='p-3'] { padding: 0.125rem !important; }
    .bottom-carousel h3 { font-size: 9px !important; }
    .bottom-carousel [class*='gap-'] { gap: 0.25rem !important; }
  }
`

// ── Phone Mockup (reused from original) ────────────────────────────
interface PhoneProps {
  label: string
  sender: string
  role: 'sender' | 'receiver'
  visibleWords: string[]
  isTransmitting: boolean
  hasNotification: boolean
  messageColor: string
  tw: Record<string, string>
}

function PhoneMockup({ label, sender, role, visibleWords, isTransmitting, hasNotification, messageColor, tw }: PhoneProps) {
  const isSender = role === 'sender'
  const fullText = visibleWords.join(' ')

  const colorClasses: Record<string, { bg: string; ring: string; pulse: string }> = {
    red: { bg: 'bg-red-500', ring: 'ring-red-500/30', pulse: 'bg-red-400' },
    amber: { bg: 'bg-amber-500', ring: 'ring-amber-500/30', pulse: 'bg-amber-400' },
    blue: { bg: 'bg-blue-500', ring: 'ring-blue-500/30', pulse: 'bg-blue-400' },
  }
  const colors = colorClasses[messageColor] || colorClasses.amber

  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <div className="text-center">
        <span className="text-xs font-medium text-neutral-400 tracking-wide">{label}</span>
        <p className="text-[10px] text-neutral-600">{sender}</p>
      </div>
      <div className="relative w-full max-w-[220px]">
        {hasNotification && (
          <div className={`absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full ${colors.bg} flex items-center justify-center shadow-lg shadow-black/50 animate-bounce`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        )}
        <div className={`bg-neutral-950 border-2 ${isSender && isTransmitting ? 'border-yellow-500/40' : 'border-neutral-800'} rounded-2xl overflow-hidden transition-all duration-300`}>
          <div className="px-3 py-2 border-b border-neutral-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSender && isTransmitting ? 'bg-yellow-400 animate-pulse' : hasNotification ? colors.pulse : 'bg-neutral-700'}`} />
            <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
              {isSender ? (tw.tw_transmitting || 'Transmission...') : (tw.tw_waiting || 'En attente')}
            </span>
          </div>
          <div className="px-3 py-4 min-h-[140px] flex flex-col justify-end">
            {fullText ? (
              <div className={`rounded-xl px-3 py-2 text-sm leading-relaxed transition-all duration-200 ${
                isSender
                  ? 'bg-neutral-800 text-white ml-4'
                  : `bg-neutral-800 text-white mr-4 border-l-2 ${colors.bg.replace('bg-', 'border-l-')}`
              }`}>
                <p className="font-medium">{fullText}<span className={`inline-block w-0.5 h-4 ml-0.5 animate-pulse ${visibleWords.length > 0 ? 'bg-white/60' : ''}`}>&nbsp;</span></p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-2">
                  {isSender ? (
                    <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  )}
                </div>
                <p className="text-[10px] text-neutral-700">
                  {isSender ? (tw.tw_hold_to_speak || 'Maintenez pour parler') : (tw.tw_waiting_msg || 'En attente de message')}
                </p>
              </div>
            )}
          </div>
          <div className="px-3 py-2 border-t border-neutral-800 flex items-center justify-center">
            {isSender ? (
              <span className="text-[9px] text-neutral-600 tracking-wide">{tw.tw_ptt_active || '↑ PTT ACTIF'}</span>
            ) : (
              <span className="text-[9px] text-neutral-600 tracking-wide">
                {hasNotification ? (tw.tw_new_msg || '● NOUVEAU MESSAGE') : (tw.tw_no_msg || '— Aucun message')}
              </span>
            )}
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
export default function TestTalkieWalkiePage() {
  const { lang } = useLanguage()
  const { texts, loading: textsLoading } = useTexts('talkie-walkie')

  // DB text getter
  const getText = useCallback(
    (key: string, fallback: string = ''): string => {
      if (!texts.length) return fallback
      const item = texts.find((t: TextItem) => t.key === key)
      if (!item) return fallback
      return item[lang as keyof Pick<TextItem, 'fr' | 'en' | 'pt' | 'es'>] || item.fr || fallback
    },
    [texts, lang]
  )

  // ── Micro + Speech Recognition state ──────────────────────────────
  const [micState, setMicState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle')
  const [isListening, setIsListening] = useState(false)
  const [liveWords, setLiveWords] = useState<string[]>([])
  const [finalWords, setFinalWords] = useState<string[]>([])
  const [receivedWords, setReceivedWords] = useState<string[]>([])
  const [hasNotification, setHasNotification] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [recognitionError, setRecognitionError] = useState(false)

  const recognitionRef = useRef<any>(null)
  const finalWordsRef = useRef<string[]>([])
  const isListeningRef = useRef(false)
  const cascadeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
      if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current)
    }
  }, [])

  // Reset on language change
  useEffect(() => {
    setLiveWords([])
    setFinalWords([])
    setReceivedWords([])
    setHasNotification(false)
    setIsTransmitting(false)
    setRecognitionError(false)
    finalWordsRef.current = []
    // Update recognition language if active
    if (recognitionRef.current) {
      try { recognitionRef.current.lang = SPEECH_LANGS[lang] || 'fr-FR' } catch {}
    }
  }, [lang])

  // ── Check browser support ─────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMicState('unsupported')
    }
  }, [])

  // ── Request microphone ────────────────────────────────────────────
  const requestMic = useCallback(async () => {
    setMicState('requesting')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicState('active')
      startRecognition()
    } catch (err: any) {
      console.error('Mic denied:', err)
      setMicState('denied')
    }
  }, [lang])

  // ── Start Speech Recognition ──────────────────────────────────────
  const startRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LANGS[lang] || 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const interim: string[] = []
      const final: string[] = []

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (result.isFinal) {
          final.push(...text.split(/\s+/))
        } else {
          interim.push(...text.split(/\s+/))
        }
      }

      // Merge all final words (accumulated across events)
      const allFinal = [...finalWordsRef.current]
      // Rebuild final from the last finalIndex
      const allWords: string[] = []
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        allWords.push(...text.split(/\s+/))
      }

      finalWordsRef.current = allWords
      setLiveWords([...allWords, ...interim])
      setFinalWords(allWords)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicState('denied')
      } else if (event.error !== 'aborted') {
        setRecognitionError(true)
        setTimeout(() => setRecognitionError(false), 3000)
      }
    }

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListeningRef.current) {
        try { recognition.start() } catch {}
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      isListeningRef.current = true
      setIsListening(true)
    } catch {}
  }, [lang])

  // ── Push-to-Talk: press & hold ────────────────────────────────────
  const startTransmission = useCallback(() => {
    if (isTransmitting || micState !== 'active') return
    setIsTransmitting(true)
    setLiveWords([])
    setFinalWords([])
    setReceivedWords([])
    setHasNotification(false)
    finalWordsRef.current = []

    // Start recognition fresh for this transmission
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
    }
    startRecognition()
  }, [isTransmitting, micState, startRecognition])

  const stopTransmission = useCallback(() => {
    if (!isTransmitting) return
    setIsTransmitting(false)
    isListeningRef.current = false
    setIsListening(false)

    // Stop recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
    }

    // Get the final words
    const words = finalWordsRef.current.length > 0 ? finalWordsRef.current : liveWords
    if (words.length === 0) return

    // Cascade to Phone B after 1s
    cascadeTimerRef.current = setTimeout(() => {
      let bIndex = 0
      const cascadeInterval = setInterval(() => {
        if (bIndex < words.length) {
          setReceivedWords(prev => [...prev, words[bIndex]])
          bIndex++
        } else {
          clearInterval(cascadeInterval)
          setHasNotification(true)
        }
      }, 80)
    }, 1000)
  }, [isTransmitting, liveWords])

  // ── Touch handling ────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    startTransmission()
  }, [startTransmission])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    stopTransmission()
  }, [stopTransmission])

  // ── Loading state ─────────────────────────────────────────────────
  if (textsLoading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
        <div id="test-talkie-walkie-page" className="min-h-screen bg-black text-white">
          <Header />
          <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-neutral-500">Chargement...</p>
            </div>
          </section>
          <Footer />
        </div>
      </>
    )
  }

  const senderFirstName = getText('tw_phone_a', 'Collègue A').split(' ')[0]
  const receiverLabel = getText('tw_receiver', 'Récepteur')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
      <div id="test-talkie-walkie-page" className="min-h-screen bg-black text-white">
        <Header />
        <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* ── Badge + Titre + Description ─────────────── */}
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-yellow-400 mb-4" data-section="tw_badge">
                {getText('tw_badge', 'Aperçu — Talkie Walkie')}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
                {getText('tw_step1_title', 'Communication instantanée en équipe')}
              </h1>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed mb-4" data-section="tw_description">
                {getText('tw_description', '')}
              </p>
              <a
                href="/produits/talkie-walkie-connecte"
                className="inline-flex items-center gap-2 text-yellow-400 text-xs sm:text-sm hover:text-yellow-300 transition-colors"
                data-section="tw_link_product"
              >
                {getText('tw_link_product', 'Découvrir Talkie Walkie')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* ── Carrousel haut ──────────────────────────── */}
            <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
              <Carousel speed={90} />
            </div>

            {/* ── MICRO: état non supporté ──────────────── */}
            {micState === 'unsupported' && (
              <div className="max-w-md mx-auto mb-10 bg-neutral-950 border border-red-500/30 rounded-xl p-6 text-center">
                <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-red-300 text-sm">{getText('tw_not_supported', 'Votre navigateur ne supporte pas la reconnaissance vocale.')}</p>
              </div>
            )}

            {/* ── MICRO: état refusé ────────────────────── */}
            {micState === 'denied' && (
              <div className="max-w-md mx-auto mb-10 bg-neutral-950 border border-amber-500/30 rounded-xl p-6 text-center">
                <svg className="w-10 h-10 text-amber-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-amber-300 text-sm">{getText('tw_mic_denied', 'Accès micro refusé.')}</p>
              </div>
            )}

            {/* ── MICRO: bouton activation ──────────────── */}
            {micState === 'idle' && (
              <div className="max-w-md mx-auto mb-10">
                <button
                  onClick={requestMic}
                  className="w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                  {getText('tw_activate_mic', 'Activer le micro')}
                </button>
                <p className="text-center text-[10px] text-neutral-600 mt-2">{getText('tw_mic_desc', '')}</p>
              </div>
            )}

            {/* ── MICRO: en cours de demande ─────────────── */}
            {micState === 'requesting' && (
              <div className="max-w-md mx-auto mb-10 text-center">
                <div className="inline-flex items-center gap-2 text-yellow-400 text-sm">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                  Autorisation du micro en cours...
                </div>
              </div>
            )}

            {/* ── MODE INTERACTIF (micro actif) ──────────── */}
            {micState === 'active' && (
              <>
                {/* Les 2 téléphones */}
                <div className="max-w-3xl mx-auto mb-6">
                  <div className="flex items-start justify-center gap-4 sm:gap-8 md:gap-12">
                    <PhoneMockup
                      label={getText('tw_phone_a', 'Collègue A')}
                      sender={senderFirstName}
                      role="sender"
                      visibleWords={isTransmitting ? liveWords : finalWords}
                      isTransmitting={isTransmitting}
                      hasNotification={false}
                      messageColor="amber"
                      tw={{ tw_transmitting: getText('tw_transmitting', 'Transmission...'), tw_waiting: getText('tw_waiting', 'En attente'), tw_hold_to_speak: getText('tw_hold_to_speak', 'Maintenez pour parler'), tw_waiting_msg: getText('tw_waiting_msg', 'En attente de message'), tw_ptt_active: getText('tw_ptt_active', '↑ PTT ACTIF'), tw_new_msg: getText('tw_new_msg', '● NOUVEAU MESSAGE'), tw_no_msg: getText('tw_no_msg', '— Aucun message') }}
                    />

                    <div className="flex-shrink-0 flex items-center self-center pt-8">
                      <div className={`transition-all duration-300 ${isTransmitting ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>

                    <PhoneMockup
                      label={getText('tw_phone_b', 'Collègue B')}
                      sender={receiverLabel}
                      role="receiver"
                      visibleWords={receivedWords}
                      isTransmitting={false}
                      hasNotification={hasNotification}
                      messageColor="amber"
                      tw={{ tw_transmitting: getText('tw_transmitting', 'Transmission...'), tw_waiting: getText('tw_waiting', 'En attente'), tw_hold_to_speak: getText('tw_hold_to_speak', 'Maintenez pour parler'), tw_waiting_msg: getText('tw_waiting_msg', 'En attente de message'), tw_ptt_active: getText('tw_ptt_active', '↑ PTT ACTIF'), tw_new_msg: getText('tw_new_msg', '● NOUVEAU MESSAGE'), tw_no_msg: getText('tw_no_msg', '— Aucun message') }}
                    />
                  </div>
                </div>

                {/* Statut micro */}
                <div className="max-w-md mx-auto mb-4 text-center">
                  {isListening && !isTransmitting && (
                    <p className="text-green-400 text-xs">{getText('tw_mic_active', '🔴 Micro actif — parlez maintenant')}</p>
                  )}
                  {recognitionError && (
                    <p className="text-amber-400 text-xs">{getText('tw_mic_error', 'Erreur de reconnaissance.')}</p>
                  )}
                </div>

                {/* Bouton Push-to-Talk */}
                <div className="max-w-md mx-auto mb-8">
                  <button
                    onMouseDown={startTransmission}
                    onMouseUp={stopTransmission}
                    onMouseLeave={stopTransmission}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    disabled={!isListening && !isTransmitting}
                    className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 border select-none ${
                      isTransmitting
                        ? 'bg-red-500/20 border-red-500/40 text-red-300 cursor-wait'
                        : 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 active:scale-[0.97]'
                    }`}
                  >
                    {isTransmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        {getText('tw_btn_transmitting', 'Transmission en cours...')}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                        {getText('tw_btn_talk', 'Appuyez pour parler')}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-neutral-600 mt-2">
                    {isTransmitting ? getText('tw_btn_hold_send', "Maintenez l'appui pour envoyer") : getText('tw_btn_hold_transmit', 'Maintenez le bouton pour transmettre')}
                  </p>
                </div>
              </>
            )}

            {/* ── Comment ça marche ─────────────────────── */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-center text-neutral-400 text-xs tracking-widest uppercase mb-8" data-section="tw_how_title">
                {getText('tw_how_title', 'Comment ça marche')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '1', titleKey: 'tw_step1_title', descKey: 'tw_step1_desc', fallbackTitle: 'Appuyez pour parler', fallbackDesc: 'Maintenez le bouton et votre message vocal est transmis en temps réel via WiFi ou 4G.' },
                  { step: '2', titleKey: 'tw_step2_title', descKey: 'tw_step2_desc', fallbackTitle: 'Transcription instantanée', fallbackDesc: "Chaque mot est automatiquement transcrit et affiché sur les écrans de toute l'équipe." },
                  { step: '3', titleKey: 'tw_step3_title', descKey: 'tw_step3_desc', fallbackTitle: 'Notification immédiate', fallbackDesc: "Votre collègue reçoit une alerte et lit le message même s'il est en zone silencieuse." },
                ].map(item => (
                  <div key={item.step} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-white text-sm font-medium mb-1.5" data-section={item.titleKey}>{getText(item.titleKey, item.fallbackTitle)}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed" data-section={item.descKey}>{getText(item.descKey, item.fallbackDesc)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Carrousel bas ──────────────────────────── */}
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
