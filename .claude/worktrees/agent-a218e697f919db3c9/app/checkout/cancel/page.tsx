'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-yellow-500 text-6xl mb-4">!</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement annulé</h1>
            <p className="text-gray-600 mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
            <Link
              href="/marketplace"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Retour au marketplace
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
