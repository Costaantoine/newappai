'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function EvaAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Verifier le support du Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'fr-FR'
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(prev => prev + transcript)
          setIsRecording(false)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsRecording(false)
        }
        
        recognition.onend = () => {
          setIsRecording(false)
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = "Salut ! Je suis Eva, ta vendeuse personnelle. Tu cherches quoi aujourd'hui ?"
      setMessages([{ role: 'assistant', content: greeting }])
      // PAS de speak() ici — le browser bloque l'autoplay
      // Eva parlera quand l'utilisateur enverra son premier message
    }
  }, [isOpen, messages.length])

  const speak = async (text: string) => {
    if (!voiceEnabled) return
    try {
      setIsSpeaking(true)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (audioRef.current) audioRef.current.pause()
        audioRef.current = new Audio(url)
        audioRef.current.onended = () => setIsSpeaking(false)
        audioRef.current.onerror = () => setIsSpeaking(false)
        await audioRef.current.play()
      } else {
        setIsSpeaking(false)
      }
    } catch {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }

  const startRecording = () => {
    if (!recognitionRef.current) {
      // Speech non supporte — informer l'utilisateur
      alert("Le micro n'est pas disponible sur ce navigateur. Utilise Chrome sur mobile ou tablette pour parler a Eva.")
      return
    }
    stopSpeaking()
    setIsRecording(true)
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsRecording(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/eva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          lang: detectLanguage(userMessage)
        })
      })

      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        if (voiceEnabled) speak(data.reply)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oups, j'ai eu un petit souci. Tu peux reessayer ?" }])
    } finally {
      setLoading(false)
    }
  }

  const detectLanguage = (text: string): string => {
    if (/\b(bonjour|salut|je|tu|nous|vous|quoi|comment|pourquoi|combien|prix|produit|acheter)\b/i.test(text)) return 'fr'
    if (/\b(hello|hi|what|how|why|price|product|buy|can|do|you)\b/i.test(text)) return 'en'
    if (/\b(ola|oi|eu|tu|nos|voce|o que|como|por que|quanto|preco|produto|comprar)\b/i.test(text)) return 'pt'
    if (/\b(hola|yo|tu|nosotros|ustedes|que|como|por que|cuanto|precio|producto|comprar)\b/i.test(text)) return 'es'
    return 'fr'
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-sky-500 hover:bg-sky-400 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Parler a Eva"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-sky-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">E</div>
          <div>
            <span className="text-white font-semibold">Eva</span>
            <span className="text-sky-100 text-sm ml-2">vendeuse</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`text-white/70 hover:text-white p-1 rounded ${voiceEnabled ? 'bg-white/20' : ''}`}
            title={voiceEnabled ? 'Couper la voix' : 'Activer la voix'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button onClick={() => { setIsOpen(false); stopSpeaking(); if (isRecording) stopRecording() }} className="text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-sky-500 text-white rounded-br-md' : 'bg-gray-800 text-gray-100 rounded-bl-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl rounded-bl-md text-sm">Eva reflechit...</div>
          </div>
        )}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <span className="animate-pulse">🔊</span> Eva parle
            </div>
          </div>
        )}
        {isRecording && (
          <div className="flex justify-start">
            <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <span className="animate-pulse">🎤</span> Ecoute...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input avec micro */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex gap-2 items-center">
          {/* Bouton micro — toujours visible */}
          <button
            onMouseDown={isRecording ? stopRecording : startRecording}
            className={`rounded-full p-2 transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse scale-110' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={isRecording ? "Arrter d'ecouter" : "Parler a Eva"}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isRecording ? "Ecoute..." : "Tape ou parle..."}
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-500"
            disabled={loading || isRecording}
          />
          
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-gray-700 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
