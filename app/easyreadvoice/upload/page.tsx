'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { uploadBook, fetchBooks } from '../_lib/api'
import AdBannerTop from '../_components/AdBannerTop'
import AdBannerBottom from '../_components/AdBannerBottom'

const STEPS = [
  { key: 'pending', icon: '📄', label: 'Analyse du document' },
  { key: 'voices', icon: '🎭', label: 'Attribution des voix' },
  { key: 'processing', icon: '🎵', label: 'Génération audio' },
  { key: 'ready', icon: '✅', label: 'Prêt !' },
]

function stepIndexForStatus(status: string): number {
  if (status === 'ready') return 3
  if (status === 'processing') return 2
  return 0
}

function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return ''
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m <= 0) return `~${s}s restantes`
  return `~${m} min ${s}s restantes`
}

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [plan, setPlan] = useState('decouverte')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [pendingBookId, setPendingBookId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('pending')
  const [uploadPct, setUploadPct] = useState<number>(0)
  const [chaptersDone, setChaptersDone] = useState<number>(0)
  const [chaptersTotal, setChaptersTotal] = useState<number>(0)
  const [progressPct, setProgressPct] = useState<number>(0)
  const genStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
  }, [])

  const poll = useCallback(async () => {
    if (!pendingBookId || !userEmail) return
    const books = await fetchBooks(userEmail)
    const book: any = books.find((b: any) => b.id === pendingBookId)
    if (!book) return
    setStatus(book.status)
    if (book.status === 'processing') {
      if (genStartRef.current === null) genStartRef.current = Date.now()
      setChaptersDone(book.chapters_done || 0)
      setChaptersTotal(book.chapters || 0)
      setProgressPct(book.progress_pct || 0)
    }
    if (book.status === 'ready') {
      router.push(`/easyreadvoice/player/${pendingBookId}`)
    } else if (book.status === 'error') {
      setError("La génération a échoué. Contactez le support si le problème persiste.")
    }
  }, [pendingBookId, userEmail, router])

  useEffect(() => {
    if (!pendingBookId) return
    poll()
    const id = setInterval(poll, 4000)
    return () => clearInterval(id)
  }, [pendingBookId, poll])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title) return
    setLoading(true); setError(''); setUploadPct(0)
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) { setError('Connectez-vous pour uploader'); setLoading(false); return }
    const result = await uploadBook(user.email, title, file, plan, (pct) => setUploadPct(pct))
    if (result.success) {
      setUserEmail(user.email)
      setPendingBookId(result.book.id)
      setStatus('pending')
    } else {
      setError(result.error || "Erreur lors de l'upload")
      setLoading(false)
    }
  }

  if (pendingBookId) {
    const stepIdx = stepIndexForStatus(status)
    const generating = status === 'processing' && chaptersTotal > 0
    const pct = generating ? progressPct : Math.round(((stepIdx + 1) / STEPS.length) * 100)

    let eta = ''
    if (generating && chaptersDone > 0 && genStartRef.current) {
      const elapsed = (Date.now() - genStartRef.current) / 1000
      const perChapter = elapsed / chaptersDone
      const remaining = perChapter * (chaptersTotal - chaptersDone)
      eta = formatEta(remaining)
    }

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <AdBannerTop />
        <main className="relative flex-1 bg-gradient-to-br from-purple-50 via-white to-violet-50 px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Génération en cours</h1>
            <p className="text-gray-500 mb-10">{title}</p>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
            ) : (
              <>
                <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-3xl p-8 mb-8">
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-8">
                    <span>
                      {generating
                        ? `${pct}% — Chapitre ${chaptersDone}/${chaptersTotal}`
                        : `${pct}%`}
                    </span>
                    {eta && <span>{eta}</span>}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {STEPS.map((s, i) => {
                      const active = i === stepIdx
                      const done = i < stepIdx
                      return (
                        <div key={s.key} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                              done
                                ? 'bg-purple-600 text-white'
                                : active
                                ? 'bg-purple-100 text-purple-700 ring-4 ring-purple-200 animate-pulse'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {s.icon}
                          </div>
                          <span className={`text-xs text-center ${active || done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                            {s.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Cette page se met à jour automatiquement. Vous serez redirigé vers votre livre audio dès qu'il sera prêt.
                </p>
              </>
            )}
          </div>
        </main>
        <AdBannerBottom />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="relative flex-1 bg-gradient-to-br from-purple-50 via-white to-violet-50 px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nouvel upload</h1>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4 mb-6">
            🔒 Vos fichiers sont supprimés immédiatement après la génération audio. Seuls les documents libres de droit
            doivent être traités. Vous êtes seul responsable des fichiers téléversés.
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-3xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-900" placeholder="Mon document" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fichier (PDF, EPUB, TXT, DOCX)</label>
              <input type="file" ref={fileRef} accept=".pdf,.epub,.txt,.docx" onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Forfait</label>
              <select value={plan} onChange={e => setPlan(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-900">
                <option value="decouverte">Découverte - 1.99€</option>
                <option value="essentiel">Essentiel - 4.99€</option>
                <option value="standard">Standard - 9.99€</option>
                <option value="integral">Intégral - 19.99€</option>
              </select>
            </div>
            {loading && (
              <div>
                <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Téléchargement... {uploadPct}%</p>
              </div>
            )}
            <button type="submit" disabled={loading || !file}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50">
              {loading ? `Téléchargement... ${uploadPct}%` : 'Lancer la génération'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
