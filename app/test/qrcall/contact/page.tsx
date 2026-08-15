'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function QRcallContactPage() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('num') || searchParams.get('contact') || ''

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (phone && !initialized) {
      setInitialized(true)
      setMessages([
        { role: 'assistant', content: "Bonjour, je suis devant chez vous, je viens de scanner votre QR code, j'ai un colis pour vous." }
      ])
    }
  }, [phone, initialized])

  // Scroll en bas uniquement quand l'utilisateur envoie un message
  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    scrollToBottom()
    setLoading(true)

    try {
      const res = await fetch('/api/test/qrcall/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          lang: 'fr'
        })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        scrollToBottom()
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, je n'ai pas pu traiter votre demande. Réessayez." }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oups, une erreur est survenue. Réessayez." }])
    } finally {
      setLoading(false)
    }
  }

  const overrideStyles = `
    #test-qrcall-contact header, #test-qrcall-contact footer { background: #000 !important; --color-header-bg: #000 !important; }
    #test-qrcall-contact header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
    #test-qrcall-contact footer { border-top-color: rgb(38 38 38) !important; }
    .bottom-carousel p:first-child { display: none !important; }
    .bottom-carousel img { display: none !important; }
    .bottom-carousel [class*='h-28'] { display: none !important; }
    .top-carousel p:first-child { display: none !important; }
    @media (max-width: 767px) {
      #test-qrcall-contact footer { display: none !important; }
      .top-carousel a { min-width: 80px !important; max-width: 80px !important; }
      .top-carousel [class*='h-28'] { height: 1.5rem !important; }
      .top-carousel [class*='p-3'] { padding: 0.125rem !important; }
      .top-carousel h3 { font-size: 9px !important; }
      .top-carousel [class*='gap-'] { gap: 0.25rem !important; }
      .bottom-carousel a { min-width: 80px !important; max-width: 80px !important; }
      .bottom-carousel [class*='h-28'] { height: 1.5rem !important; }
      .bottom-carousel [class*='p-3'] { padding: 0.125rem !important; }
      .bottom-carousel h3 { font-size: 9px !important; }
      .bottom-carousel [class*='gap-'] { gap: 0.25rem !important; }
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
      <div id="test-qrcall-contact" className="min-h-screen bg-black text-white flex flex-col">
        <Header />

        {/* ── Carrousel haut ──────────────────────────── */}
        <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
          <Carousel />
        </div>

        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pt-44 sm:pt-36 md:pt-72">
          {/* En-tête contact */}
          <div className="text-center mb-6">
            <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-violet-400 mb-2">
              Test — QRcall Contact
            </span>
            <h1 className="text-lg font-medium text-white mb-1">
              Vous contactez
            </h1>
            <p className="text-neutral-400 text-sm font-mono tracking-wider">{phone || '—'}</p>
          </div>

          {/* Messages */}
          <div className="space-y-3 mb-4 px-1 pt-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-800 text-white rounded-br-md'
                    : 'bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 text-neutral-500 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm border border-neutral-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-800 pt-4 pb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Votre message..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition border border-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* ── Carrousel bas ──────────────────────────── */}
        <div className="bottom-carousel fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-neutral-800 px-2 sm:px-4 py-1">
          <div className="max-w-6xl mx-auto overflow-hidden">
            <Carousel />
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
