'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        window.location.href = '/admin/accueil'
      } else {
        setError('Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion, veuillez réessayer')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/5">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            <span className="text-white">NewApp</span>
            <span className="text-sky-400">AI</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 text-white">Administration</h1>
          <p className="text-slate-400 mt-2">Connectez-vous pour acceder au tableau de bord</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-slate-300">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition pr-12"
                placeholder="Entrez le mot de passe"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-form-type="other"
                data-lpignore="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-sky-500 text-white py-3 rounded-full font-bold hover:bg-sky-400 transition"
          >
            Se connecter
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-400 text-sm hover:text-sky-400 transition">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
