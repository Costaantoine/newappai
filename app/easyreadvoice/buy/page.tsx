'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEasyReadVoiceUser } from '../_lib/useEasyReadVoiceUser'

const FEATURES = [
  {
    icon: '🎧',
    title: 'Tous les formats',
    desc: 'MP3, WAV, OGG, FLAC, AAC, M4A, WMA — le player lit tous vos livres audio, quel que soit le format.',
  },
  {
    icon: '🎭',
    title: 'Multi-voix',
    desc: 'Profitez du rendu multi-voix complet : narrateur, personnages féminins et masculins.',
  },
  {
    icon: '🧠',
    title: 'Mémorisation',
    desc: 'Le player reprend automatiquement où vous vous étiez arrêté, livre par livre.',
  },
  {
    icon: '🔁',
    title: 'Lecture continue',
    desc: 'Enchaînement automatique des chapitres, sans interruption, même hors ligne.',
  },
]

type Status = 'loading' | 'purchased' | 'not_purchased' | 'error'

export default function BuyPlayerPage() {
  const { user, loading: userLoading } = useEasyReadVoiceUser()
  const [status, setStatus] = useState<Status>('loading')
  const [productId, setProductId] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    if (userLoading || !user) return

    let active = true
    fetch('/api/easyreadvoice/player-purchase')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        setProductId(data.productId ?? null)
        setStatus(data.purchased ? 'purchased' : 'not_purchased')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [user, userLoading])

  async function handleBuy() {
    if (!productId) return
    setCheckoutLoading(true)
    try {
      const origin = window.location.origin
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          successUrl: `${origin}/easyreadvoice/buy?success=1`,
          cancelUrl: `${origin}/easyreadvoice/buy`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setCheckoutLoading(false)
      }
    } catch {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50 pt-32 pb-24 flex-1">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-violet-200/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🎧 EasyReadVoice Player
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-4">
            EasyReadVoice Player —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
              4.99 €
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Le lecteur dédié à vos livres audio EasyReadVoice : installable sur votre téléphone,
            tous formats, lecture continue et reprise automatique.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-12 text-left">
            {FEATURES.map((f) => (
              <div key={f.title} className="backdrop-blur-md bg-white/80 border border-white/20 shadow-lg rounded-2xl p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-bold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {userLoading || status === 'loading' ? (
            <div className="w-10 h-10 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          ) : status === 'purchased' ? (
            <div className="space-y-3">
              <p className="text-emerald-600 font-semibold">✅ Déjà acheté</p>
              <Link
                href="/easyreadvoice/player/"
                className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
              >
                Télécharger le player →
              </Link>
            </div>
          ) : status === 'error' ? (
            <p className="text-red-600 font-medium">Une erreur est survenue. Réessayez plus tard.</p>
          ) : (
            <button
              onClick={handleBuy}
              disabled={checkoutLoading || !productId}
              className="inline-block bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              {checkoutLoading ? 'Redirection…' : 'Acheter — 4.99 €'}
            </button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
