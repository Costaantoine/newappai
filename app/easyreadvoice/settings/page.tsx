'use client'

import { useEffect, useState } from 'react'
import AppShell from '../_components/AppShell'
import { useEasyReadVoiceUser } from '../_lib/useEasyReadVoiceUser'

interface Preferences {
  defaultVoice: string
  emailNotifications: boolean
  autoDownload: boolean
}

const VOICES = [
  { id: 'female-fr', label: 'Féminine — France' },
  { id: 'female-qc', label: 'Féminine — Québec' },
  { id: 'male-fr', label: 'Masculine — France' },
  { id: 'male-qc', label: 'Masculine — Québec' },
]

function storageKey(userId: string) {
  return `erv_prefs_${userId}`
}

function loadPreferences(userId: string): Preferences {
  if (typeof window === 'undefined') {
    return { defaultVoice: 'female-fr', emailNotifications: true, autoDownload: false }
  }
  const raw = window.localStorage.getItem(storageKey(userId))
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fall through to defaults
    }
  }
  return { defaultVoice: 'female-fr', emailNotifications: true, autoDownload: false }
}

export default function SettingsPage() {
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
      <SettingsForm userId={user.id} />
    </AppShell>
  )
}

function SettingsForm({ userId }: { userId: string }) {
  const [prefs, setPrefs] = useState<Preferences>({ defaultVoice: 'female-fr', emailNotifications: true, autoDownload: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPrefs(loadPreferences(userId))
  }, [userId])

  function update(patch: Partial<Preferences>) {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    window.localStorage.setItem(storageKey(userId), JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Paramètres</h1>
          <p className="text-gray-500">Personnalisez votre expérience EasyReadVoice</p>
        </div>
        {saved && (
          <span className="text-sm font-medium text-emerald-600 animate-fade-in-up">Enregistré ✓</span>
        )}
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 animate-fade-in-up">
        <h2 className="font-bold text-gray-900 mb-4">Voix par défaut</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {VOICES.map((voice) => (
            <button
              key={voice.id}
              onClick={() => update({ defaultVoice: voice.id })}
              className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                prefs.defaultVoice === voice.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-400/20'
                  : 'border-gray-200 bg-white/70 text-gray-600 hover:bg-purple-50/50'
              }`}
            >
              {voice.label}
            </button>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-2xl p-6 space-y-5 animate-fade-in-up">
        <h2 className="font-bold text-gray-900">Notifications</h2>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-900">Notifications par email</p>
            <p className="text-xs text-gray-500">Recevoir un email quand un livre est prêt</p>
          </div>
          <ToggleSwitch checked={prefs.emailNotifications} onChange={(v) => update({ emailNotifications: v })} />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-900">Téléchargement automatique</p>
            <p className="text-xs text-gray-500">Télécharger le MP3 dès qu'il est généré</p>
          </div>
          <ToggleSwitch checked={prefs.autoDownload} onChange={(v) => update({ autoDownload: v })} />
        </label>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${checked ? 'bg-purple-600' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
