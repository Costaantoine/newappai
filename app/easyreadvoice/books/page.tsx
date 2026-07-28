'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { fetchBooks } from '../_lib/api'
import type { Book } from '../_lib/mockLibrary'

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-gray-100 text-gray-600' },
  processing: { label: 'En cours', className: 'bg-amber-100 text-amber-700' },
  ready: { label: 'Prêt', className: 'bg-emerald-100 text-emerald-700' },
  error: { label: 'Erreur', className: 'bg-red-100 text-red-700' },
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  if (h <= 0) return `${m} min`
  return m > 0 ? `${h} h ${m} min` : `${h} h`
}

function estimateChapters(minutes: number): number {
  return Math.max(1, Math.round((minutes || 1) / 12))
}

function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return ''
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m <= 0) return `~${s}s restantes`
  return `~${m} min ${s}s restantes`
}

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const progressStartRef = useRef<Record<string, { time: number; chaptersDone: number }>>({})

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email)
        fetchBooks(user.email).then(b => { setBooks(b); setLoading(false) })
      } else setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!email) return
    const hasActiveBook = books.some(b => b.status === 'pending' || b.status === 'processing')
    if (!hasActiveBook) return
    const id = setInterval(() => {
      fetchBooks(email).then(setBooks)
    }, 4000)
    return () => clearInterval(id)
  }, [email, books])

  const readyBooks = books.filter(b => b.status === 'ready')
  const otherBooks = books.filter(b => b.status !== 'ready')

  function progressInfoFor(b: any) {
    const chaptersDone = b.chapters_done || 0
    const chaptersTotal = b.chapters || 0
    const pct = b.progress_pct || 0
    if (!progressStartRef.current[b.id] && chaptersDone > 0) {
      progressStartRef.current[b.id] = { time: Date.now(), chaptersDone }
    }
    const start = progressStartRef.current[b.id]
    let eta = ''
    if (start && chaptersDone > start.chaptersDone && chaptersTotal > 0) {
      const elapsed = (Date.now() - start.time) / 1000
      const rate = (chaptersDone - start.chaptersDone) / elapsed
      if (rate > 0) eta = formatEta((chaptersTotal - chaptersDone) / rate)
    }
    return { chaptersDone, chaptersTotal, pct, eta }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="relative flex-1 bg-gradient-to-br from-purple-50 via-white to-violet-50 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bibliothèque</h1>
              <p className="text-gray-500">{books.length} document(s)</p>
            </div>
            <Link href="/easyreadvoice/upload" className="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg">+ Nouvel upload</Link>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4 mb-6">
            🔒 Fichiers sources supprimés immédiatement après la génération audio. Lecture protégée disponible uniquement ici.
          </div>

          {loading ? (
            <div className="text-center py-16"><div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" /></div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="mb-4">Aucun document pour le moment.</p>
              <Link href="/easyreadvoice/upload" className="text-purple-600 font-semibold hover:underline">Uploader mon premier document</Link>
            </div>
          ) : (
            <div>
              {readyBooks.map(b => {
                const chapters = estimateChapters(Math.round(b.duration_sec/60))
                return (
                  <Link
                    key={b.id}
                    href={`/easyreadvoice/player/${b.id}`}
                    className="block backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-5 mb-4 hover:shadow-2xl hover:border-purple-200 transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{b.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">✓ Prêt</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {formatDuration(b.duration_sec)} · {chapters} chapitre{chapters > 1 ? 's' : ''}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600">
                      ▶ Écouter
                    </span>
                  </Link>
                )
              })}
              {otherBooks.map(b => {
                const { chaptersDone, chaptersTotal, pct, eta } = progressInfoFor(b)
                return (
                  <div key={b.id} className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-5 mb-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{b.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS[b.status]?.className || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS[b.status]?.label || b.status}
                      </span>
                    </div>
                    {b.status === 'processing' && (
                      <div className="mt-3">
                        <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {chaptersTotal > 0
                              ? `Génération audio... Chapitre ${chaptersDone}/${chaptersTotal} (${pct}%)`
                              : `Génération audio... ${pct}%`}
                          </span>
                          {eta && <span>{eta}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
