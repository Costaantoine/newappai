'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function EasyReadVoiceRegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (!supabase) {
      setError('Service indisponible pour le moment. Réessayez plus tard.')
      return
    }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push('/easyreadvoice/dashboard')
    } else {
      setConfirmEmailSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50 px-4 py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-200/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative w-full max-w-md animate-fade-in-up">
          <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-xl rounded-3xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                🎧 EasyReadVoice
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
              <p className="text-gray-500 text-sm">Transformez vos textes en audio dès aujourd'hui</p>
            </div>

            {confirmEmailSent ? (
              <div className="text-center space-y-4 animate-fade-in-up">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                  📬
                </div>
                <p className="text-gray-700 font-medium">Vérifiez votre boîte mail</p>
                <p className="text-sm text-gray-500">
                  Un email de confirmation a été envoyé à <strong>{email}</strong>. Cliquez sur le lien pour activer votre compte.
                </p>
                <Link
                  href="/easyreadvoice/login"
                  className="inline-block mt-2 text-purple-600 font-semibold hover:underline text-sm"
                >
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-fade-in-up">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-900 transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="vous@exemple.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-900 transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="8 caractères minimum"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/60 text-gray-900 transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Création...
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Déjà un compte ?{' '}
                  <Link href="/easyreadvoice/login" className="text-purple-600 font-semibold hover:underline">
                    Se connecter
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
