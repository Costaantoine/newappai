'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// La page /easyreadvoice envoie plan=easyreadvoice-<slug>, mais la table Product
// n'est indexee que par UUID. On mappe ici les slugs vers les vrais ids.
const PLAN_TO_PRODUCT_ID: Record<string, string> = {
  'easyreadvoice-decouverte': '1020f90c-7355-4353-8e45-907777cdeffd',
  'easyreadvoice-essentiel': '33c9d282-7154-4ae6-ae2e-87e8d7d02bd3',
  'easyreadvoice-standard': 'cd0ab50d-d479-4671-a723-841e7068a791',
  'easyreadvoice-integral': 'd4f985d2-803b-4c28-93f7-79a8cf1ec5c0',
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!plan) {
      setStatus('error')
      setErrorMessage('Aucune offre sélectionnée.')
      return
    }

    let cancelled = false
    const productId = PLAN_TO_PRODUCT_ID[plan] || plan

    fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (cancelled) return
        if (res.ok && data.url) {
          window.location.href = data.url
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'Impossible de créer la session de paiement.')
        }
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
        setErrorMessage('Erreur réseau lors de la connexion à Stripe.')
      })

    return () => {
      cancelled = true
    }
  }, [plan])

  return (
    <div className="max-w-2xl mx-auto px-4 text-center">
      {status === 'loading' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirection vers la page de paiement sécurisée...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Impossible de démarrer le paiement</h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <Link
            href="/easyreadvoice"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Retour à EasyReadVoice
          </Link>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto px-4 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
