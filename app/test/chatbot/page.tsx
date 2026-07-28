'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TestChatbotPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#000000] text-[#f5f5f7]">
        <section className="max-w-5xl mx-auto px-6 pt-32 pb-24">
          {/* Titre */}
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-violet-400/80 mb-4">
              Test — Chatbot IA
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Chatbot Client Intelligent
            </h1>
            <p className="text-[#86868b] text-lg max-w-2xl mx-auto">
              Discutez avec Léa, notre assistante IA de démonstration.
            </p>
          </div>

          {/* Anam Player - Lea en iframe */}
          <div className="w-full max-w-2xl mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08]">
            <iframe
              src="https://lab.anam.ai/share/imYGe58nfmGkewnIqs3Mc"
              className="w-full h-full"
              allow="microphone; camera; autoplay"
              style={{ border: 'none' }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
