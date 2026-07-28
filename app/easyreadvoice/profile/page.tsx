'use client'

import { useEffect, useState } from 'react'
import AppShell from '../_components/AppShell'
import { useEasyReadVoiceUser } from '../_lib/useEasyReadVoiceUser'
import { getBooks } from '../_lib/mockLibrary'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
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
      <ProfileContent
        email={user.email ?? ''}
        userId={user.id}
        createdAt={user.created_at}
      />
    </AppShell>
  )
}

function ProfileContent({ email, userId, createdAt }: { email: string; userId: string; createdAt: string }) {
  const [bookCount, setBookCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    setBookCount(getBooks(userId).length)
  }, [userId])

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMessage('')
    if (newPassword.length < 8) {
      setPasswordMessage('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    setPasswordSaving(true)
    const { error } = await supabase?.auth.updateUser({ password: newPassword }) ?? { error: null }
    setPasswordSaving(false)
    if (error) {
      setPasswordMessage(error.message)
    } else {
      setNewPassword('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Mon profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles</p>
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 flex items-center gap-5 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {email.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900">{email}</p>
          <p className="text-sm text-gray-500">
            Membre depuis {new Date(createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 text-center animate-fade-in-up">
          <p className="text-2xl font-bold text-gray-900">{bookCount}</p>
          <p className="text-sm text-gray-500">Documents</p>
        </div>
        <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 text-center animate-fade-in-up">
          <p className="text-2xl font-bold text-gray-900">EasyReadVoice</p>
          <p className="text-sm text-gray-500">Compte standard</p>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 animate-fade-in-up">
        <h2 className="font-bold text-gray-900 mb-4">Modifier le mot de passe</h2>

        {passwordMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {passwordMessage}
          </div>
        )}
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in-up">
            Mot de passe mis à jour ✓
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            minLength={8}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
          >
            {passwordSaving ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  )
}
