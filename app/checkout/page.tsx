'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const PLAN_TO_PRODUCT_ID: Record<string, string> = {
  'easyreadvoice-decouverte': '1020f90c-7355-4353-8e45-907777cdeffd',
  'easyreadvoice-essentiel': '33c9d282-7154-4ae6-ae2e-87e8d7d02bd3',
  'easyreadvoice-standard': 'cd0ab50d-d479-4671-a723-841e7068a791',
  'easyreadvoice-integral': 'd4f985d2-803b-4c28-93f7-79a8cf1ec5c0',
}

const WAIVER_TEXT = "Je renonce à mon droit de rétractation conformément à l'article L221-28 du Code de la consommation, le téléchargement/l'activation commençant immédiatement après validation du paiement."

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const productIdParam = searchParams.get('productId')
  const successUrlParam = searchParams.get('successUrl')
  const cancelUrlParam = searchParams.get('cancelUrl')

  const [productTitle, setProductTitle] = useState('')
  const [productPrice, setProductPrice] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const id = plan ? PLAN_TO_PRODUCT_ID[plan] || plan : productIdParam

  useEffect(() => {
    if (!id) {
      setError('Aucun produit sélectionné.')
      setLoading(false)
      return
    }
    fetch('/api/products/' + id)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('Produit non trouvé.')
          setLoading(false)
          return
        }
        const title = typeof data.title === 'object'
          ? data.title.fr || data.title.en || Object.values(data.title)[0]
          : data.title
        setProductTitle(title)
        setProductPrice(data.price)
        setLoading(false)
      })
      .catch(() => {
        setError('Erreur lors du chargement du produit.')
        setLoading(false)
      })
  }, [plan, productIdParam, id])

  const handlePay = async () => {
    if (!waiverAccepted || !id) return
    setPaying(true)
    setPayError(null)
    try {
      const body: any = {
        productId: id,
        waiver_accepted: true,
        waiver_timestamp: new Date().toISOString(),
      }
      if (successUrlParam) body.successUrl = successUrlParam
      if (cancelUrlParam) body.cancelUrl = cancelUrlParam

      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setPayError(data.error || 'Impossible de créer la session de paiement.')
      }
    } catch {
      setPayError('Erreur réseau lors de la connexion au paiement.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Chargement du produit...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 text-center py-12">
        <div className="text-red-400 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-white mb-4">Commande impossible</h1>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/produits" className="inline-block bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-400 transition">
          Voir nos produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Finaliser votre commande</h1>

        <div className="bg-slate-900/80 rounded-xl p-5 mb-6 border border-white/5">
          <h2 className="text-white font-semibold text-lg">{productTitle}</h2>
          <p className="text-violet-400 font-bold text-xl mt-2">{(productPrice / 100).toFixed(2)} €</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={waiverAccepted}
              onChange={(e) => setWaiverAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-slate-700 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-amber-200 text-sm leading-relaxed">{WAIVER_TEXT}</span>
          </label>
        </div>

        {payError && <p className="text-red-400 text-sm mb-4 text-center">{payError}</p>}

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePay}
            disabled={!waiverAccepted || paying}
            className="w-full bg-violet-500 text-white py-3 rounded-full font-bold hover:bg-violet-400 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
          >
            {paying ? 'Redirection vers le paiement...' : 'Payer ' + (productPrice / 100).toFixed(2) + ' €'}
          </button>
          <Link href="/produits" className="text-center text-gray-400 hover:text-white text-sm py-2 transition-colors">
            Annuler
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <Suspense fallback={<div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div></div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
