'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (sessionId) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [sessionId])

  return (
    <div className="max-w-2xl mx-auto px-4 text-center">
      {status === 'loading' && (
        <div className="py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification du paiement...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
          <p className="text-gray-600 mb-8">
            Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
          </p>
          <Link
            href="/marketplace"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Retour au marketplace
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Erreur de vérification</h1>
          <p className="text-gray-600 mb-8">
            Impossible de vérifier votre paiement. Contactez le support.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Nous contacter
          </Link>
        </div>
      )}
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto px-4 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        }>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
