'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatInterface from '@/components/ChatInterface'

export default function AssistantPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Assistant IA</h1>
          <p className="text-gray-600 mb-8">
            Posez vos questions à notre assistant intelligent. Il peut vous aider avec :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Produits</h3>
              <p className="text-sm text-gray-600">Informations sur nos services</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Support</h3>
              <p className="text-sm text-gray-600">Aide technique et questions</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Conseils</h3>
              <p className="text-sm text-gray-600">Recommandations personnalisées</p>
            </div>
          </div>
          <ChatInterface />
        </div>
      </main>
      <Footer />
    </>
  )
}
