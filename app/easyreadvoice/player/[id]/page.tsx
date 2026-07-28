'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEasyReadVoiceUser } from '../../_lib/useEasyReadVoiceUser'
import { fetchBooks } from '../../_lib/api'
import AdBannerTop from '../../_components/AdBannerTop'
import AdBannerBottom from '../../_components/AdBannerBottom'

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

interface Chapter {
  id: number
  file: string
  title?: string
  duration_sec?: number
}

function fmt(t: number): string {
  if (!t || t < 0 || !isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading: userLoading } = useEasyReadVoiceUser({ requireAuth: false })
  const audioRef = useRef<HTMLAudioElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const bookmarkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoPlayNextRef = useRef(false)
  const storageKey = `erv-player-${id}`
  const bookmarkKey = `erv-bookmarks-${id}`

  const [bookTitle, setBookTitle] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [chapterIdx, setChapterIdx] = useState(0)
  const [loadingManifest, setLoadingManifest] = useState(true)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState('')
  const [finished, setFinished] = useState(false)
  const [bookmarkSaved, setBookmarkSaved] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  // Charger le manifest + titre du livre
  useEffect(() => {
    if (!id) return
    fetch(`/api/easyreadvoice/audio/${id}/manifest`)
      .then(r => {
        if (!r.ok) throw new Error('manifest')
        return r.json()
      })
      .then(data => {
        setChapters(data.chapters || [])
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (typeof parsed.chapter === 'number') setChapterIdx(parsed.chapter)
            if (typeof parsed.rate === 'number') setRate(parsed.rate)
          } catch {}
        }
      })
      .catch(() => setError("Impossible de charger ce livre audio."))
      .finally(() => setLoadingManifest(false))

    fetchBooks(user?.email || "").then(books => {
      const book = books.find((b: any) => b.id === id)
      if (book) setBookTitle(book.title)
    })
  }, [user, id, storageKey])

  // Charger l'audio du chapitre courant via fetch+blob (pas de src direct)
  const loadChapter = useCallback(async (idx: number) => {
    if (!chapters[idx]) return
    setLoadingAudio(true)
    setError('')
    try {
      const res = await fetch(`/api/easyreadvoice/audio/${id}?chapter=${chapters[idx].id}`)
      if (!res.ok) throw new Error('audio')
      const blob = await res.blob()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.playbackRate = rate
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed.chapter === idx && typeof parsed.time === 'number') {
              audioRef.current.currentTime = parsed.time
            }
          } catch {}
        }
        if (autoPlayNextRef.current) {
          autoPlayNextRef.current = false
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
        }
      }
    } catch {
      setError("Impossible de charger ce chapitre.")
    } finally {
      setLoadingAudio(false)
    }
  }, [chapters, id, rate, storageKey])

  useEffect(() => {
    if (chapters.length > 0) loadChapter(chapterIdx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, chapterIdx])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      if (bookmarkTimeoutRef.current) clearTimeout(bookmarkTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  // Sauvegarde du marque-page
  useEffect(() => {
    const interval = setInterval(() => {
      const a = audioRef.current
      if (a && duration > 0) {
        localStorage.setItem(storageKey, JSON.stringify({ chapter: chapterIdx, time: a.currentTime, rate }))
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [chapterIdx, rate, duration, storageKey])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else { a.pause(); setPlaying(false) }
  }

  function changeRate(r: number) {
    setRate(r)
    if (audioRef.current) audioRef.current.playbackRate = r
  }

  function seekTo(t: number) {
    const a = audioRef.current
    if (a) a.currentTime = t
    setCurrent(t)
  }

  function goToChapter(idx: number) {
    if (idx < 0 || idx >= chapters.length) return
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
    setTransitioning(false)
    setPlaying(false)
    setCurrent(0)
    setDuration(0)
    setFinished(false)
    setChapterIdx(idx)
    // Mémorise immédiatement le changement de chapitre (pas d'attente du tick 4s)
    localStorage.setItem(storageKey, JSON.stringify({ chapter: idx, time: 0, rate }))
  }

  function saveBookmark() {
    let bookmarks: { chapter: number; time: number; label: string }[] = []
    const existing = localStorage.getItem(bookmarkKey)
    if (existing) {
      try { bookmarks = JSON.parse(existing) } catch {}
    }
    bookmarks.push({ chapter: chapterIdx, time: current, label: `Position ${bookmarks.length + 1}` })
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks))
    setBookmarkSaved(true)
    if (bookmarkTimeoutRef.current) clearTimeout(bookmarkTimeoutRef.current)
    bookmarkTimeoutRef.current = setTimeout(() => setBookmarkSaved(false), 2000)
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0
  const chapter = chapters[chapterIdx]

  if (userLoading || loadingManifest) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="sticky top-16 z-50">
        <AdBannerTop />
      </div>
      <main className="relative flex-1 bg-gradient-to-br from-purple-50 via-white to-violet-50 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.push('/easyreadvoice/books')} className="text-sm text-purple-600 hover:underline mb-6">
            ← Retour à la bibliothèque
          </button>

          <p className="text-xs font-semibold tracking-wide text-purple-500 uppercase mb-2">EasyReadVoice Player</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{bookTitle || 'Livre audio'}</h1>
          <p className="text-gray-500 mb-8">
            Chapitre {chapterIdx + 1} / {chapters.length}
            {chapter?.title ? ` — ${chapter.title}` : ''}
          </p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

          <div className="bg-[#0f0f1a] rounded-3xl p-6 text-[#e2e8f0] shadow-xl">
            <audio
              ref={audioRef}
              preload="metadata"
              onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onEnded={() => {
                setPlaying(false)
                if (chapterIdx < chapters.length - 1) {
                  setTransitioning(true)
                  transitionTimeoutRef.current = setTimeout(() => {
                    transitionTimeoutRef.current = null
                    setTransitioning(false)
                    autoPlayNextRef.current = true
                    goToChapter(chapterIdx + 1)
                  }, 2000)
                } else {
                  setFinished(true)
                }
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />

            {transitioning && (
              <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-2xl px-5 py-3 mb-5 text-center text-sm font-medium">
                Chapitre suivant dans 2s...
              </div>
            )}

            {finished && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl px-5 py-4 mb-5 text-center">
                <p className="font-semibold mb-2">🎉 Fin du livre</p>
                <p className="text-sm text-emerald-200/80 mb-3">
                  Vous avez terminé la lecture de « {bookTitle || 'ce livre'} ».
                </p>
                <button
                  onClick={() => router.push('/easyreadvoice/books')}
                  className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition"
                >
                  ← Retour à la bibliothèque
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 w-10 text-right">{fmt(current)}</span>
              <input
                type="range" min={0} max={duration || 1} value={current}
                onChange={e => seekTo(parseFloat(e.target.value))}
                className="flex-1 h-1.5 appearance-none bg-[#1e293b] rounded-full cursor-pointer"
                style={{ accentColor: '#a855f7' }}
              />
              <span className="text-xs text-gray-400 w-10">{fmt(duration)}</span>
              <button
                onClick={saveBookmark}
                title="Sauvegarder cette position pour y revenir plus tard"
                className="h-8 px-3 rounded-full border border-[#334155] text-xs font-medium flex items-center gap-1.5 hover:bg-[#1e293b] active:scale-90 transition shrink-0"
              >
                <span className="text-base leading-none">🔖</span>
                <span>Mémoriser la lecture</span>
              </button>
            </div>
            <p className={`text-xs text-emerald-400 text-center mb-3 transition-opacity ${bookmarkSaved ? 'opacity-100' : 'opacity-0'}`}>
              Mémorisé !
            </p>

            <div className="flex items-center justify-center gap-5 mb-5">
              <button onClick={() => goToChapter(chapterIdx - 1)} disabled={chapterIdx === 0}
                className="w-11 h-11 rounded-full border border-[#334155] text-gray-300 text-lg flex items-center justify-center active:scale-90 disabled:opacity-30">⏮</button>
              <button onClick={togglePlay} disabled={loadingAudio}
                className="w-16 h-16 rounded-full bg-[#a855f7] text-white text-2xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-50">
                {loadingAudio ? '…' : playing ? '⏸' : '▶'}
              </button>
              <button onClick={() => goToChapter(chapterIdx + 1)} disabled={chapterIdx >= chapters.length - 1}
                className="w-11 h-11 rounded-full border border-[#334155] text-gray-300 text-lg flex items-center justify-center active:scale-90 disabled:opacity-30">⏭</button>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-5">
              {RATES.map(r => (
                <button key={r} onClick={() => changeRate(r)}
                  className={`py-1.5 rounded-full text-xs border transition-all ${
                    rate === r ? 'bg-[#a855f7] text-white border-[#a855f7]' : 'bg-transparent text-gray-400 border-[#334155]'
                  }`}>{r}×</button>
              ))}
            </div>

            {chapters.length > 0 && (
              <div className="max-h-56 overflow-y-auto space-y-0.5 border-t border-[#1e293b] pt-3">
                {chapters.map((c, i) => (
                  <button key={c.id} onClick={() => goToChapter(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      i === chapterIdx ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'text-gray-400 hover:bg-[#1e293b]'
                    }`}>
                    {c.title || `Chapitre ${i + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            🔒 Lecture protégée — disponible uniquement dans votre bibliothèque EasyReadVoice.
          </p>
          <p className="text-xs text-gray-300 text-center mt-2">
            Propulsé par NewAppAI
          </p>
        </div>
      </main>
      <div className="sticky bottom-0 z-50">
        <AdBannerBottom />
      </div>
      <Footer />
    </div>
  )
}
