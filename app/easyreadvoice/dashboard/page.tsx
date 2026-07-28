'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppShell from '../_components/AppShell'
import { useEasyReadVoiceUser } from '../_lib/useEasyReadVoiceUser'
import { getBooks, type Book } from '../_lib/mockLibrary'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_LABEL: Record<Book['status'], { label: string; className: string }> = {
  processing: { label: 'En cours', className: 'bg-amber-100 text-amber-700' },
  ready: { label: 'Prêt', className: 'bg-emerald-100 text-emerald-700' },
  error: { label: 'Erreur', className: 'bg-red-100 text-red-700' },
}

export default function DashboardPage() {
  const { user, loading, signOut } = useEasyReadVoiceUser()
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    if (user) setBooks(getBooks(user.id))
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    )
  }

  const totalBooks = books.length
  const readyBooks = books.filter((b) => b.status === 'ready').length
  const totalChars = books.reduce((sum, b) => sum + b.characters, 0)
  const totalMinutes = books.reduce((sum, b) => sum + (b.status === 'ready' ? b.durationMinutes : 0), 0)

  const stats = [
    { label: 'Documents uploadés', value: totalBooks, icon: '📄', color: 'from-purple-500 to-purple-600' },
    { label: 'Livres générés', value: readyBooks, icon: '🎧', color: 'from-violet-500 to-violet-600' },
    { label: 'Caractères traités', value: totalChars.toLocaleString('fr-FR'), icon: '🔤', color: 'from-violet-500 to-violet-600' },
    { label: "Minutes d'audio", value: totalMinutes, icon: '⏱️', color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <AppShell user={user} onSignOut={signOut}>
      <DashboardContent stats={stats} books={books.slice(0, 5)} userName={user.email ?? ''} />
    </AppShell>
  )
}

function DashboardContent({
  stats,
  books,
  userName,
}: {
  stats: { label: string; value: string | number; icon: string; color: string }[]
  books: Book[]
  userName: string
}) {
  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue, {userName}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl text-white shadow-lg mb-4 transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Link
          href="/easyreadvoice/upload"
          className="lg:col-span-1 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white p-6 shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 transition-transform group-hover:scale-110">📤</div>
          <p className="font-bold text-lg mb-1">Nouvel upload</p>
          <p className="text-sm text-white/80">Transformez un document en audio</p>
        </Link>
        <Link
          href="/easyreadvoice/books"
          className="lg:col-span-1 group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/80 border border-white/20 shadow-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 transition-transform group-hover:scale-110">📚</div>
          <p className="font-bold text-lg text-gray-900 mb-1">Bibliothèque</p>
          <p className="text-sm text-gray-500">Retrouvez tous vos livres audio</p>
        </Link>
        <Link
          href="/easyreadvoice/settings"
          className="lg:col-span-1 group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/80 border border-white/20 shadow-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 transition-transform group-hover:scale-110">⚙️</div>
          <p className="font-bold text-lg text-gray-900 mb-1">Paramètres</p>
          <p className="text-sm text-gray-500">Voix, notifications, préférences</p>
        </Link>
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Derniers documents</h2>
          <Link href="/easyreadvoice/books" className="text-sm text-purple-600 font-semibold hover:underline">
            Tout voir →
          </Link>
        </div>

        {books.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">Aucun document pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl transition-colors hover:bg-purple-50/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">📖</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{book.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(book.createdAt)} · {book.planLabel}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_LABEL[book.status].className}`}>
                  {STATUS_LABEL[book.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
