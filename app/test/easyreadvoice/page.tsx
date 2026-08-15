'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'
import { useLanguage } from '@/lib/LanguageContext'

interface VoiceInfo {
  id: string
  name: string
  gender: string
  style: string
}

const VOICES: VoiceInfo[] = [
  { id: 'denise', name: 'Denise', gender: 'female', style: 'naturelle, chaude' },
  { id: 'remy', name: 'Rémy', gender: 'male', style: 'multilingue, claire' },
  { id: 'eloise', name: 'Eloise', gender: 'female', style: 'douce, posée' },
  { id: 'henri', name: 'Henri', gender: 'male', style: 'grave, profonde' },
  { id: 'vivienne', name: 'Vivienne', gender: 'female', style: 'multilingue, vive' },
  { id: 'antoine', name: 'Antoine', gender: 'male', style: 'neutre, précise' },
  { id: 'sylvie', name: 'Sylvie', gender: 'female', style: 'expressive' },
  { id: 'charline', name: 'Charline', gender: 'female', style: 'enjouée' },
]

const EXAMPLES = [
  'Bonjour, je suis un texte de démonstration pour EasyReadVoice. Ce service me permet de transformer mes écrits en audio naturel et agréable à écouter.',
  'Le petit chat noir dormait paisiblement sur le canapé du salon. Soudain, un bruit le réveilla. Il ouvrit un œil, puis les deux, et regarda autour de lui.',
  '— Où vas-tu ? demanda-t-elle. — Je pars en voyage, répondit-il. — Reviens vite, murmura-t-elle en souriant.',
]

const MAX_CHARS = 1000
const TEST_EMAIL = 'test@easyreadvoice.local'

// ─── Compteur rétro ─────────────────────────────────────────────────

function RetroCounter({ current, max }: { current: number; max: number }) {
  const { t } = useLanguage()
  const ratio = current / max
  const color = ratio >= 1.0 ? '#ef4444' : ratio > 0.9 ? '#ef4444' : ratio > 0.75 ? '#f59e0b' : '#10b981'
  const digits = String(Math.min(current, 99999)).padStart(5, '0').split('')
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center gap-1 flex-shrink-0">
        {digits.map((d, i) => (
          <div key={i} className="relative w-12 h-16 sm:w-16 sm:h-24 bg-black/80 border border-white/10 rounded-md overflow-hidden"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.1) 1px, rgba(0,255,0,0.1) 2px)' }} />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-3xl sm:text-5xl font-black tracking-tighter"
              style={{ color, textShadow: `0 0 10px ${color}66, 0 0 20px ${color}33`, fontFamily: '"Courier New", monospace' }}
            >{d}</span>
          </div>
        ))}
        <span className="text-xs font-mono ml-1 uppercase tracking-widest" style={{ color }}>car.</span>
      </div>
      <p className="text-[11px] text-neutral-500 text-center mt-1">{t.testEasyreadVoiceLimit}</p>
    </div>
  )
}

// ─── Widget principal ────────────────────────────────────────────────

export default function TestEasyReadVoicePage() {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('denise')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<{ name: string; text: string } | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrent, setAudioCurrent] = useState(0)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Pipeline state
  const [step, setStep] = useState<'idle' | 'uploading' | 'generating' | 'polling' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [bookId, setBookId] = useState<string | null>(null)
  const [statusText, setStatusText] = useState('')

  const charCount = uploadedFile ? uploadedFile.text.length : text.length

  // ─── Animation du compteur ──────────────────────────────────────
  const [displayCount, setDisplayCount] = useState(0)
  const prevCountRef = useRef(0)

  useEffect(() => {
    const target = Math.min(charCount, 99999)
    const start = prevCountRef.current
    if (target === start) { setDisplayCount(target); return }
    const duration = 6000
    const startTime = performance.now()
    let frame: number
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(start + (target - start) * progress)
      setDisplayCount(current)
      if (progress < 1) frame = requestAnimationFrame(animate)
      else { setDisplayCount(target); prevCountRef.current = target }
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [charCount])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const AudioIcon = ({ isPlaying: ip }: { isPlaying: boolean }) => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      {ip ? (<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>) : (<path d="M8 5v14l11-7z" />)}
    </svg>
  )

  // Header pour les appels pipeline en mode test
  function pipelineHeaders() {
    return { 'x-test-mode': 'true' }
  }

  const handleGenerate = useCallback(async () => {
    const source = (uploadedFile?.text || text).slice(0, MAX_CHARS)
    if (!source.trim()) return

    setGenerating(true)
    setError('')
    setBookId(null)
    setStep('uploading')
    setProgress(10)
    setStatusText('Création du fichier...')

    try {
      // Créer un fichier txt à partir du texte
      const blob = new Blob([source], { type: 'text/plain' })
      const file = new File([blob], `test-pipeline-${Date.now()}.txt`, { type: 'text/plain' })
      const title = `Test — ${new Date().toLocaleString('fr-FR')}`

      // Étape 1 : POST /api/easyreadvoice/books (vrai endpoint pipeline)
      setStatusText('Upload via POST /api/easyreadvoice/books...')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', TEST_EMAIL)
      formData.append('title', title)
      formData.append('planId', 'decouverte')

      const uploadRes = await fetch('/api/easyreadvoice/books', {
        method: 'POST',
        body: formData,
        headers: pipelineHeaders() as any,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.success) {
        setError(uploadData.error || "Échec création AudioBook")
        setGenerating(false); setStep('idle'); return
      }

      const id = uploadData.book.id
      setBookId(id)
      setProgress(30)
      setStatusText(`AudioBook créé (${id.substring(0, 8)}...)`)

      // Étape 2 : POST /api/easyreadvoice/books/[id]/generate (vrai endpoint pipeline)
      setStep('generating')
      setProgress(50)
      setStatusText("Génération audio via edge-tts...")
      const genRes = await fetch(`/api/easyreadvoice/books/${id}/generate`, {
        method: 'POST',
        headers: { ...pipelineHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: selectedVoice }),
      })
      const genData = await genRes.json()
      if (!genRes.ok || !genData.success) {
        setError(genData.error || "Échec mise en file d'attente")
        setGenerating(false); setStep('idle'); return
      }

      // Étape 3 : Polling jusqu'à ready
      setStep('polling')
      setProgress(60)
      setStatusText('Worker en cours — polling GET /api/easyreadvoice/books...')

      const poll = async () => {
        try {
          const pollRes = await fetch(`/api/easyreadvoice/books?email=${encodeURIComponent(TEST_EMAIL)}`, {
            headers: pipelineHeaders(),
          })
          const pollData = await pollRes.json()
          const book = (pollData.books || []).find((b: any) => b.id === id)
          if (!book) return

          if (book.status === 'processing') {
            setProgress(60 + Math.round((book.progress_pct || 0) * 0.35))
            setStatusText(`Génération audio... ${book.progress_pct || 0}%`)
          } else if (book.status === 'ready') {
            setProgress(100)
            setStatusText('Prêt !')
            setStep('done')
            if (pollRef.current) clearInterval(pollRef.current)

            setTimeout(() => {
              if (audioRef.current) {
                const el = audioRef.current
                el.src = `/api/easyreadvoice/audio/${id}?chapter=0`
                el.load()
                el.onloadedmetadata = () => { setAudioDuration(el.duration); setAudioProgress(0); setAudioCurrent(0) }
                el.ontimeupdate = () => { setAudioCurrent(el.currentTime); setAudioProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0) }
                el.onplay = () => setIsPlaying(true)
                el.onpause = () => setIsPlaying(false)
                el.onended = () => { setIsPlaying(false); setAudioProgress(100) }
                el.play().catch(() => {})
              }
            }, 500)
          } else if (book.status === 'error') {
            setError("La génération a échoué")
            setGenerating(false); setStep('idle')
            if (pollRef.current) clearInterval(pollRef.current)
          }
        } catch {}
      }

      poll()
      pollRef.current = setInterval(poll, 3000)
    } catch (e: any) {
      setError(e.message || "Erreur")
      setGenerating(false)
      setStep('idle')
    }
  }, [text, uploadedFile, selectedVoice])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/test/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erreur d'upload"); return }
      setUploadedFile({ name: data.fileName, text: data.extractedText })
      setShowUpload(false)
    } catch { setError("Erreur lors de l'upload") }
  }

  const getVoiceIcon = (gender: string) =>
    gender === 'female'
      ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      : 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'

  const overrideStyles = `
    #test-easyreadvoice-page header, #test-easyreadvoice-page footer { background: #000 !important; --color-header-bg: #000 !important; }
    #test-easyreadvoice-page header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
    #test-easyreadvoice-page footer { border-top-color: rgb(38 38 38) !important; }
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
      <style dangerouslySetInnerHTML={{__html: overrideStyles}} />
      <div id="test-easyreadvoice-page">
        <Header />
        <main className={`min-h-screen bg-black text-neutral-100 pb-24 ${generating ? 'cursor-wait' : ''}`}>
          <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              {/* En-tête */}
              <div className="text-center mb-10">
                <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-violet-400 mb-4">Test — EasyReadVoice</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-3">Synthèse Vocale IA</h1>
                <p className="text-neutral-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                  Transformez vos écrits en audio naturel et agréable, avec des voix françaises de qualité.
                  Idéal pour les livres audio, les articles et la synthèse vocale.
                </p>
              </div>

              {/* Carrousel - toujours visible */}
              <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
                <Carousel speed={90} />
              </div>

              {/* Widget principal */}
              <div className="max-w-lg mx-auto space-y-5">
                {/* Zone de texte + compteur */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-neutral-800 flex items-center justify-center w-full">
                    <RetroCounter current={displayCount} max={MAX_CHARS} />
                  </div>
                  <div className="p-4">
                    {uploadedFile ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-400 font-medium">{uploadedFile.name} ({Math.min(uploadedFile.text.length, MAX_CHARS)}/{MAX_CHARS} car.)</span>
                          <button onClick={() => setUploadedFile(null)} className="text-xs text-neutral-600 hover:text-red-400 transition">Supprimer</button>
                        </div>
                        <p className="text-neutral-300 text-sm line-clamp-6">{uploadedFile.text}</p>
                      </div>
                    ) : (
                      <textarea value={text} onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                        placeholder="Saisissez ou collez votre texte ici..." rows={6}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition resize-y min-h-[160px]"
                      />
                    )}
                    <div className="mt-3">
                      <button onClick={() => setShowUpload(!showUpload)} className="text-xs text-neutral-500 hover:text-neutral-300 transition flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploadedFile ? 'Changer de document' : 'Uploader un document (PDF, EPUB, TXT, DOCX)'}
                      </button>
                      {showUpload && (
                        <div className="mt-3 p-4 border border-dashed border-neutral-800 rounded-xl bg-neutral-900">
                          <input type="file" accept=".pdf,.epub,.txt,.docx,application/pdf,application/epub+zip,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload}
                            className="block w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
                          />
                          <p className="text-xs text-neutral-600 mt-2">Max 5 Mo — Formats : PDF, EPUB, TXT, DOCX</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sélecteur de voix */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <h3 className="text-xs font-medium text-violet-400 uppercase tracking-wider">Sélectionnez une voix</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {VOICES.map(voice => (
                        <button key={voice.id} onClick={() => setSelectedVoice(voice.id)}
                          className={`text-left p-3 rounded-xl border transition ${selectedVoice === voice.id ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-800 hover:border-neutral-700 bg-black'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${selectedVoice === voice.id ? 'bg-neutral-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getVoiceIcon(voice.gender)} />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white leading-tight">{voice.name}</p>
                              <p className="text-[10px] text-neutral-500 capitalize leading-tight">{voice.style}</p>
                            </div>
                            {selectedVoice === voice.id && <div className="ml-auto"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400" /></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exemples */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <button onClick={() => setShowExamples(!showExamples)} className="px-4 py-3 flex items-center justify-between w-full text-left border-b border-neutral-800">
                    <h3 className="text-xs font-medium text-violet-400 uppercase tracking-wider">Exemples de textes</h3>
                    <svg className={`w-4 h-4 text-neutral-500 transition-transform ${showExamples ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showExamples && (
                    <div className="p-4 space-y-2">
                      {EXAMPLES.map((ex, i) => (
                        <button key={i} onClick={() => { setText(ex); setUploadedFile(null) }}
                          className="w-full text-left text-xs text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 p-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
                        >« {ex.substring(0, 80)}… »</button>
                      ))}
                    </div>
                  )}
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

                {/* Progression pipeline */}
                {step !== 'idle' && (
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
                      <svg className="animate-spin w-4 h-4 text-purple-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-sm text-neutral-300">{statusText}</p>
                    </div>
                    <div className="p-4">
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>
                          {step === 'uploading' ? 'POST /api/easyreadvoice/books' :
                           step === 'generating' ? 'POST .../generate' :
                           step === 'polling' ? 'GET /api/easyreadvoice/books' :
                           'Terminé'}
                        </span>
                        <span>{bookId ? `ID: ${bookId.substring(0, 8)}...` : ''}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Générer */}
                <button onClick={handleGenerate} disabled={step !== 'idle' || (!text.trim() && !uploadedFile)}
                  className="w-full bg-neutral-800 text-white font-medium py-3.5 rounded-xl hover:bg-neutral-700 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-neutral-700"
                >
                  {step !== 'idle' ? (
                    <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Pipeline en cours…</>
                  ) : (
                    <><svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Générer via le pipeline</>
                  )}
                </button>

                <button onClick={() => { setText(''); setUploadedFile(null); setError(''); setStep('idle'); setBookId(null); setProgress(0) }}
                  className="w-full border border-neutral-800 text-neutral-500 font-medium py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition text-sm"
                >Effacer</button>

              {/* Carrousel flottant en bas */}
              <div className="bottom-carousel fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-neutral-800 px-2 sm:px-4 py-1">
                <div className="max-w-6xl mx-auto overflow-hidden">
                  <Carousel variant="brands" speed={90} />
                </div>
              </div>

                {/* Résultat audio */}
                {step === 'done' && (
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white">Pipeline terminé — Audio généré</p>
                    </div>
                    <div className="p-4">
                      <audio ref={audioRef} className="hidden" preload="auto" />
                      <div className="flex items-center gap-4">
                        <button onClick={() => { const el = audioRef.current; if (!el) return; if (el.paused) el.play().catch(() => {}); else el.pause() }}
                          className="w-10 h-10 rounded-full bg-neutral-600 hover:bg-neutral-500 flex items-center justify-center flex-shrink-0 transition"
                        ><AudioIcon isPlaying={isPlaying} /></button>
                        <div className="flex-1">
                          <div className="relative h-2 bg-neutral-800 rounded-full cursor-pointer group"
                            onClick={(e) => { const el = audioRef.current; if (!el || !audioDuration) return; const r = e.currentTarget.getBoundingClientRect(); el.currentTime = ((e.clientX - r.left) / r.width) * audioDuration }}
                          >
                            <div className="absolute left-0 top-0 h-full bg-neutral-500 rounded-full transition-all duration-100" style={{ width: `${audioProgress}%` }} />
                            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-neutral-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${audioProgress}% - 7px)` }} />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <span className="text-[11px] text-neutral-600 font-mono">{formatTime(audioCurrent)}</span>
                            <span className="text-[11px] text-neutral-600 font-mono">{formatTime(audioDuration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
