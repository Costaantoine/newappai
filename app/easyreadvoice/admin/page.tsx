'use client'

import AppShell, { isEasyReadVoiceAdmin } from '../_components/AppShell'
import { useEasyReadVoiceUser } from '../_lib/useEasyReadVoiceUser'

interface DemoUser {
  email: string
  books: number
  plan: string
  joined: string
}

const DEMO_USERS: DemoUser[] = [
  { email: 'marie.d@exemple.com', books: 12, plan: 'Standard', joined: '2026-02-14' },
  { email: 'thomas.b@exemple.com', books: 4, plan: 'Essentiel', joined: '2026-04-02' },
  { email: 'sofia.r@exemple.com', books: 27, plan: 'Intégral', joined: '2025-11-30' },
  { email: 'lucas.m@exemple.com', books: 1, plan: 'Découverte', joined: '2026-06-18' },
]

export default function AdminPage() {
  const { user, loading, signOut } = useEasyReadVoiceUser()

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AppShell user={user} onSignOut={signOut}>
      {isEasyReadVoiceAdmin(user) ? <AdminContent /> : <RestrictedNotice />}
    </AppShell>
  )
}

function RestrictedNotice() {
  return (
    <div className="max-w-md mx-auto text-center py-20 animate-fade-in-up">
      <div className="text-5xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès réservé</h1>
      <p className="text-gray-500">
        Cette section est réservée aux administrateurs d'EasyReadVoice.
      </p>
    </div>
  )
}

function AdminContent() {
  const totalUsers = DEMO_USERS.length
  const totalBooks = DEMO_USERS.reduce((sum, u) => sum + u.books, 0)
  const stats = [
    { label: 'Utilisateurs', value: totalUsers, icon: '👥', color: 'from-purple-500 to-purple-600' },
    { label: 'Livres générés', value: totalBooks, icon: '🎧', color: 'from-violet-500 to-violet-600' },
    { label: 'Revenu estimé', value: '842 €', icon: '💶', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Taux de conversion', value: '18%', icon: '📈', color: 'from-violet-500 to-violet-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Administration</h1>
        <p className="text-gray-500">Vue d'ensemble de la plateforme EasyReadVoice</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl text-white shadow-lg mb-4`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 animate-fade-in-up overflow-x-auto">
        <h2 className="font-bold text-gray-900 mb-4">Utilisateurs récents</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Livres</th>
              <th className="pb-3 font-medium">Forfait</th>
              <th className="pb-3 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((u) => (
              <tr key={u.email} className="border-b border-gray-50 last:border-0 transition-colors hover:bg-purple-50/40">
                <td className="py-3 font-medium text-gray-900">{u.email}</td>
                <td className="py-3 text-gray-600">{u.books}</td>
                <td className="py-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                    {u.plan}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(u.joined).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
