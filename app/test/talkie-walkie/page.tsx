'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'

// ── Messages de démo (scénarios industriels) ─────────────────────────
const MESSAGES = [
  {
    id: 'urgence',
    label: 'Urgence production',
    sender: 'Marc (Chef d\'atelier)',
    color: 'red',
    text: 'Urgence — Ligne 3 arrêtée, bris de piston. Intervenant svp.',
  },
  {
    id: 'reunion',
    label: 'Coordination équipe',
    sender: 'Sophie (Responsable planning)',
    color: 'amber',
    text: 'Réunion équipe production à 14h30 en salle blanche. Confirmer présence.',
  },
  {
    id: 'logistique',
    label: 'Routine logistique',
    sender: 'Karim (Magasinier)',
    color: 'blue',
    text: 'Palette 247 prête pour expédition — quai B, chargement prévu 16h.',
  },
  {
    id: 'maintenance',
    label: 'Intervention maintenance',
    sender: 'Thomas (Technicien)',
    color: 'amber',
    text: 'Maintenance — Capteur température four C2 déréglé, mesure erronée depuis 11h.',
  },
]

// ── Composant Téléphone simulé ───────────────────────────────────────
interface PhoneProps {
  label: string
  sender: string
  role: 'sender' | 'receiver'
  visibleWords: string[]
  isTransmitting: boolean
  hasNotification: boolean
  messageColor: string
}

function PhoneMockup({ label, sender, role, visibleWords, isTransmitting, hasNotification, messageColor }: PhoneProps) {
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
      {/* Label */}
      <div className="text-center">
        <span className="text-xs font-medium text-neutral-400 tracking-wide">{label}</span>
        <p className="text-[10px] text-neutral-600">{sender}</p>
      </div>

      {/* Téléphone */}
      <div className="relative w-full max-w-[220px]">
        {/* Notification badge */}
        {hasNotification && (
          <div className={`absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full ${colors.bg} flex items-center justify-center shadow-lg shadow-black/50 animate-bounce`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        )}

        {/* Corps du téléphone */}
        <div className={`bg-neutral-950 border-2 ${isSender && isTransmitting ? 'border-yellow-500/40' : 'border-neutral-800'} rounded-2xl overflow-hidden transition-all duration-300`}>
          {/* Header phone */}
          <div className="px-3 py-2 border-b border-neutral-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSender && isTransmitting ? 'bg-yellow-400 animate-pulse' : hasNotification ? colors.pulse : 'bg-neutral-700'}`} />
            <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
              {isSender ? 'Transmission...' : 'En attente'}
            </span>
          </div>

          {/* Zone de contenu */}
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
                  {isSender ? 'Maintenez pour parler' : 'En attente de message'}
                </p>
              </div>
            )}
          </div>

          {/* Footer phone — bouton push-to-talk pour Phone A */}
          <div className="px-3 py-2 border-t border-neutral-800 flex items-center justify-center">
            {isSender ? (
              <span className="text-[9px] text-neutral-600 tracking-wide">↑ PTT ACTIF EN DESSOUS</span>
            ) : (
              <span className="text-[9px] text-neutral-600 tracking-wide">
                {hasNotification ? '● NOUVEAU MESSAGE' : '— Aucun message'}
              </span>
            )}
          </div>
        </div>

        {/* Reflet */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
export default function TestTalkieWalkiePage() {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [visibleWordsA, setVisibleWordsA] = useState<string[]>([])
  const [visibleWordsB, setVisibleWordsB] = useState<string[]>([])
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [hasNotification, setHasNotification] = useState(false)
  const [isHolding, setIsHolding] = useState(false)

  const wordTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cascadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const wordsRef = useRef<string[]>([])
  const wordIndexRef = useRef(0)

  const currentMessage = MESSAGES[currentMsgIndex]

  // Nettoyage timers
  useEffect(() => {
    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current)
      if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current)
    }
  }, [])

  // Reset quand on change de message
  useEffect(() => {
    setVisibleWordsA([])
    setVisibleWordsB([])
    setIsTransmitting(false)
    setHasNotification(false)
    setIsHolding(false)
  }, [currentMsgIndex])

  // ── Push-to-talk: appui-maintien ────────────────────────────────
  const startTransmission = useCallback(() => {
    if (isTransmitting) return

    const words = currentMessage.text.split(' ')
    wordsRef.current = words
    wordIndexRef.current = 0

    setVisibleWordsA([])
    setVisibleWordsB([])
    setIsTransmitting(true)
    setHasNotification(false)
    setIsHolding(true)

    // Mot par mot sur Phone A (120ms par mot)
    wordTimerRef.current = setInterval(() => {
      if (wordIndexRef.current < words.length) {
        setVisibleWordsA(prev => [...prev, words[wordIndexRef.current]])
        wordIndexRef.current++
      } else {
        // Tous les mots envoyés — fin de transmission
        if (wordTimerRef.current) clearInterval(wordTimerRef.current)

        // Cascade vers Phone B avec délai 1s après le dernier mot
        cascadeTimerRef.current = setTimeout(() => {
          let bIndex = 0
          const cascadeInterval = setInterval(() => {
            if (bIndex < words.length) {
              setVisibleWordsB(prev => [...prev, words[bIndex]])
              bIndex++
            } else {
              clearInterval(cascadeInterval)
              // Notification sur Phone B
              setHasNotification(true)
            }
          }, 80)

          // Réinitialiser après 4s pour pouvoir relancer
          setTimeout(() => {
            setIsTransmitting(false)
            setIsHolding(false)
          }, words.length * 80 + 500)
        }, 1000)
      }
    }, 120)
  }, [currentMessage, isTransmitting])

  const stopTransmission = useCallback(() => {
    setIsHolding(false)
    // On ne stoppe pas la transmission en cours — elle se termine naturellement
  }, [])

  // ── Cycle entre les messages ─────────────────────────────────────
  const nextMessage = useCallback(() => {
    if (isTransmitting) return
    setCurrentMsgIndex(prev => (prev + 1) % MESSAGES.length)
  }, [isTransmitting])

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
      <div id="test-talkie-walkie-page" className="min-h-screen bg-black text-white">
        <Header />
        <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* ── Titre + Pitch ─────────────────────────────── */}
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-yellow-400 mb-4">
                Test — Talkie Walkie
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
                Communication instantanée en équipe
              </h1>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Appuyez et maintenez pour parler — le message apparaît instantanément
                sur l&apos;écran de votre collègue. Simple, rapide, sans jargon.
              </p>
            </div>

            {/* ── Carrousel haut ──────────────────────────── */}
            <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
              <Carousel speed={90} />
            </div>

            {/* ── Scénario actuel ─────────────────────────── */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    currentMessage.color === 'red' ? 'bg-red-500' :
                    currentMessage.color === 'amber' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm text-white font-medium">{currentMessage.label}</p>
                    <p className="text-[10px] text-neutral-600">{currentMessage.sender}</p>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">
                  {currentMsgIndex + 1}/{MESSAGES.length}
                </span>
              </div>
            </div>

            {/* ── Les 2 téléphones ─────────────────────────── */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="flex items-start justify-center gap-4 sm:gap-8 md:gap-12">
                <PhoneMockup
                  label="Collègue A"
                  sender={MESSAGES[currentMsgIndex].sender.split(' (')[0]}
                  role="sender"
                  visibleWords={visibleWordsA}
                  isTransmitting={isTransmitting}
                  hasNotification={false}
                  messageColor={MESSAGES[currentMsgIndex].color}
                />

                {/* Flèche de transmission */}
                <div className="flex-shrink-0 flex items-center self-center pt-8">
                  <div className={`transition-all duration-300 ${isTransmitting ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>

                <PhoneMockup
                  label="Collègue B"
                  sender={MESSAGES[currentMsgIndex].sender.split(' (')[1]?.replace(')', '') || 'Récepteur'}
                  role="receiver"
                  visibleWords={visibleWordsB}
                  isTransmitting={false}
                  hasNotification={hasNotification}
                  messageColor={MESSAGES[currentMsgIndex].color}
                />
              </div>
            </div>

            {/* ── Bouton Push-to-Talk ──────────────────────── */}
            <div className="max-w-md mx-auto mb-8">
              <button
                onMouseDown={startTransmission}
                onMouseUp={stopTransmission}
                onMouseLeave={stopTransmission}
                onTouchStart={startTransmission}
                onTouchEnd={stopTransmission}
                disabled={isTransmitting}
                className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 border ${
                  isTransmitting
                    ? 'bg-red-500/20 border-red-500/40 text-red-300 cursor-wait'
                    : isHolding
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 scale-[0.98]'
                    : 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600 active:scale-[0.97]'
                }`}
              >
                {isTransmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Transmission en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                    Appuyez pour parler
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-neutral-600 mt-2">
                {isTransmitting ? 'Maintenez l\'appui pour envoyer' : 'Maintenez le bouton pour transmettre'}
              </p>
            </div>

            {/* ── Bouton changement de scénario ─────────────── */}
            <div className="max-w-md mx-auto mb-8">
              <button
                onClick={nextMessage}
                disabled={isTransmitting}
                className="w-full border border-neutral-800 text-neutral-500 font-medium py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Choisir un autre message
              </button>
            </div>

            {/* ── Comment ça marche ─────────────────────────── */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-center text-neutral-400 text-xs tracking-widest uppercase mb-8">
                Comment ça marche
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Appuyez pour parler', desc: 'Maintenez le bouton et votre message vocal est transmis en temps réel via WiFi ou 4G.' },
                  { step: '2', title: 'Transcription instantanée', desc: 'Chaque mot est automatiquement transcrit et affiché sur les écrans de toute l\'équipe.' },
                  { step: '3', title: 'Notification immédiate', desc: 'Votre collègue reçoit une alerte et lit le message même s\'il est en zone silencieuse.' },
                ].map(item => (
                  <div key={item.step} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-white text-sm font-medium mb-1.5">{item.title}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed">{item.desc}</p>
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
