'use client'

import { useState, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const VOICES = [
  { id: 'Denise', label: 'Denise', desc: 'Féminine — naturelle, chaude' },
  { id: 'Remy', label: 'Rémy', desc: 'Masculine — multilingue, claire' },
  { id: 'Eloise', label: 'Eloise', desc: 'Féminine — douce, posée' },
  { id: 'Henri', label: 'Henri', desc: 'Masculine — grave, profonde' },
  { id: 'Vivienne', label: 'Vivienne', desc: 'Féminine — multilingue, vive' },
  { id: 'Antoine', label: 'Antoine', desc: 'Masculine — neutre, précise' },
  { id: 'Sylvie', label: 'Sylvie', desc: 'Féminine — expressive' },
  { id: 'Charline', label: 'Charline', desc: 'Féminine — enjouée' },
]

export default function TestEasyReadVoice() {
  const [text, setText] = useState('Bonjour et bienvenue dans EasyReadVoice. Ceci est un test de synthèse vocale avec différentes voix.')
  const [voice, setVoice] = useState('Denise')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  async function handleListen() {
    if (!text.trim()) {
      setError('Veuillez saisir un texte.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/test-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), voice }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erreur inconnue')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play().catch(console.error)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#000000] text-[#f5f5f7]">
        <section className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          {/* Titre */}
          <div className="mb-16 text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rose-400/80 mb-4">
              Test — EasyReadVoice
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Synthèse vocale
            </h1>
            <p className="text-[#86868b] text-lg max-w-xl mx-auto">
              Tapez ou collez un texte, choisissez une voix, puis écoutez le résultat.
            </p>
          </div>

          {/* Zone de texte */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#86868b] mb-2 tracking-wide">
              Texte à synthétiser
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={6}
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 text-[#f5f5f7] text-base focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/20 transition resize-none placeholder:text-[#4a4a4d]"
              placeholder="Saisissez ou collez votre texte ici..."
            />
            <p className="text-[#4a4a4d] text-xs mt-2 text-right">
              {text.length} caractères
            </p>
          </div>

          {/* Sélecteur de voix */}
          <div className="mb-10">
            <label className="block text-sm font-medium text-[#86868b] mb-3 tracking-wide">
              Voix
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VOICES.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    voice === v.id
                      ? 'bg-rose-500/10 border-rose-400/40 text-[#f5f5f7]'
                      : 'bg-white/[0.03] border-white/[0.08] text-[#86868b] hover:bg-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="font-semibold text-sm mb-0.5">{v.label}</div>
                  <div className="text-xs opacity-60">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton Écouter */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleListen}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-rose-500/90 text-white font-semibold text-base hover:bg-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Génération...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Écouter
                </>
              )}
            </button>

            <button
              onClick={() => setText('')}
              className="px-6 py-4 rounded-full text-[#86868b] text-sm hover:text-[#f5f5f7] transition border border-white/[0.08] hover:border-white/[0.2]"
            >
              Effacer
            </button>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Lecteur audio (caché) */}
          <audio ref={audioRef} controls className="mt-8 w-full opacity-60 hover:opacity-100 transition" />

          {/* Indice */}
          <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[#f5f5f7] mb-2">💡 Exemples de textes</h3>
            <div className="space-y-2">
              {[
                "Bonjour, je suis un texte de démonstration pour EasyReadVoice. Comment trouvez-vous cette voix ?",
                "Le petit chat noir dormait paisiblement sur le canapé du salon, bercé par le ronronnement du radiateur.",
                "— Où vas-tu ? demanda-t-elle. — Je pars en voyage, répondit-il sans se retourner.",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setText(example)}
                  className="block text-left text-sm text-[#86868b] hover:text-rose-400 transition p-2 rounded-xl hover:bg-white/[0.03] w-full"
                >
                  « {example.substring(0, 60)}... »
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
