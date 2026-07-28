'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function EvaAssistant() {
  const { t, lang } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const voiceEnabledRef = useRef(true)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const recognitionRef = useRef<any>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Debloquer l audio sur le premier clic utilisateur
  const primeAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        ctx.resume()
        // Silence 0.1s pour pre-chauffer le systeme audio
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        gain.gain.value = 0.001  // quasi-silence
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
        audioCtxRef.current = ctx
      } catch (e) {
        console.warn('AudioContext init failed:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Verifier le support du Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
          fr: "Salut ! Je suis Eva, ta vendeuse personnelle. Tu cherches quoi aujourd'hui ?",
          en: "Hi! I'm Eva, your personal sales assistant. What are you looking for today?",
          pt: "Olá! Sou a Eva, a tua vendedora pessoal. O que procuras hoje?",
          es: "¡Hola! Soy Eva, tu vendedora personal. ¿Qué buscas hoy?"
        }[lang] || "Salut ! Je suis Eva, ta vendeuse personnelle. Tu cherches quoi aujourd'hui ?"
        setMessages([{ role: 'assistant', content: greeting }])
      // PAS de speak() ici — le browser bloque l'autoplay
      // Eva parlera quand l'utilisateur enverra son premier message
    }
  }, [isOpen, messages.length])



  const speak = async (text: string) => {
    if (!voiceEnabledRef.current) return
    try {
      setIsSpeaking(true)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (res.ok) {
        const blob = await res.blob()
        const arrayBuffer = await blob.arrayBuffer()

        // Decoder et jouer via AudioContext (respecte les politiques autoplay du navigateur
        // une fois que AudioContext a ete resume par un clic utilisateur)
        const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
        if (ctx.state === 'suspended') await ctx.resume()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

        // Arreter la lecture precedente si elle existe
        if (sourceRef.current) {
          try { sourceRef.current.stop() } catch {}
          sourceRef.current = null
        }

        const source = ctx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(ctx.destination)
        source.onended = () => { setIsSpeaking(false); sourceRef.current = null }
        source.start()
        sourceRef.current = source
      } else {
        setIsSpeaking(false)
      }
    } catch {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch {}
      sourceRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }

  // Rendre le contenu avec les URLs cliquables
  const renderMessageContent = (text: string) => {
    // Regex pour trouver les URLs (newappai.com/..., https://..., etc.)
    const urlRegex = /(https?:\/\/[^\s]+)|(?:^|\s)(newappai\.com\/[^\s]+)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    const re = new RegExp(urlRegex.source, 'g')
    while ((match = re.exec(text)) !== null) {
      // Texte avant l'URL
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      
      let url = match[0].trim()
      // Enlever la ponctuation finale (.,!?:;) qui ne fait pas partie de l'URL
      url = url.replace(/[.,!?;:)]+$/, '')
      
      // Completer l'URL si besoin
      const href = url.startsWith('http') ? url : `https://${url}`
      
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-300 hover:text-violet-200 underline"
        >
          {url}
        </a>
      )
      
      lastIndex = re.lastIndex
    }
    // Reste du texte apres la derniere URL
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const toggleRecording = async () => {
    primeAudio()
    if (isRecording) {
      stopRecording()
      return
    }

    setMicError(null)

    if (!speechSupported) {
      setMicError("Le micro n'est pas disponible sur ce navigateur. Utilise Chrome ou Edge.")
      return
    }

    // Demander l'acces au micro avant de demarrer la reconnaissance
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
    } catch (err: any) {
      console.error('getUserMedia error:', err.name)
      setIsRecording(false)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError("Permission micro refusée. Autorise le micro dans les paramètres du site (🔒 dans la barre d'adresse → Microphone → Autoriser) et réessaie.")
      } else if (err.name === 'NotFoundError') {
        setMicError("Aucun micro trouvé. Vérifie que ton micro est branché.")
      } else {
        setMicError("Impossible d'accéder au micro. Vérifie les permissions Chrome et réessaie.")
      }
      return
    }

    // Micro OK, lancer la reconnaissance vocale
    stopSpeaking()
    setIsRecording(true)
    setMicError(null)

    // Creer la reconnaissance a chaque demarrage
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'fr-FR'

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)

      if (event.results[event.results.length - 1].isFinal) {
        setIsRecording(false)
        const finalText = transcript.trim()
        if (finalText) {
          setTimeout(() => {
            setInput('')
            setMessages(prev => [...prev, { role: 'user', content: finalText }])
            sendMessage(finalText)
          }, 300)
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
      if (event.error === 'not-allowed') {
        setMicError("Le micro n'a pas été autorisé. Vérifie les paramètres du site (🔒 dans la barre d'adresse → Microphone → Autoriser) et réessaie.")
      } else if (event.error === 'no-speech') {
        setMicError("Aucune parole détectée. Réessaie.")
      } else if (event.error === 'audio-capture') {
        setMicError("Aucun micro trouvé. Vérifie que ton micro est branché.")
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setIsRecording(false)
      setMicError("Impossible de démarrer la reconnaissance vocale. Vérifie les permissions micro dans Chrome.")
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignorer
      }
      recognitionRef.current = null
    }
    setIsRecording(false)
  }

  const sendMessage = async (textOverride?: string) => {
    primeAudio()
    const userMessage = textOverride || input.trim()
    if (!userMessage || loading) return

    // Arreter l'ecoute si elle tourne encore
    if (isRecording) stopRecording()

    setInput('')
    setMicError(null)
    if (!textOverride) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    }
    setLoading(true)

    try {
      const res = await fetch('/api/eva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          lang: lang || detectLanguage(userMessage)
        })
      })

      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        if (voiceEnabledRef.current) speak(data.reply)
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
        onClick={() => { setIsOpen(true); primeAudio() }}
        className="fixed bottom-6 right-6 z-50 bg-violet-500 hover:bg-violet-400 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label={t.nav?.talk_to_eva || 'Parler à Eva'}
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
      <div className="bg-violet-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">E</div>
          <div>
            <span className="text-white font-semibold">Eva</span>
            <span className="text-violet-100 text-sm ml-2">vendeuse</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { 
              const newVal = !voiceEnabled
              setVoiceEnabled(newVal)
              voiceEnabledRef.current = newVal
              if (!newVal) stopSpeaking()  // Arreter la lecture en cours
            }}
            className={`text-white/70 hover:text-white p-1 rounded ${voiceEnabled ? 'bg-white/20' : ''}`}
            title={voiceEnabled ? 'Couper la voix' : 'Activer la voix'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <button onClick={() => { setIsOpen(false); stopSpeaking(); stopRecording() }} className="text-white/70 hover:text-white" aria-label="Fermer Eva">
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
              msg.role === 'user' ? 'bg-violet-500 text-white rounded-br-md' : 'bg-gray-800 text-gray-100 rounded-bl-md'
            }`}>
              {renderMessageContent(msg.content)}
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
            <div className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
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
        {micError && (
          <div className="flex justify-start">
            <div className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line">
              ⚠️ {micError}
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
            onClick={toggleRecording}
            className={`rounded-full p-2 transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse scale-110'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={isRecording ? "Arrter d'ecouter" : "Parler a Eva"}
            aria-label={isRecording ? (t.nav?.stop_recording || "Arrêter l'écoute") : (t.nav?.talk_to_eva || 'Parler à Eva')}
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
            placeholder={isRecording ? "Parle..." : "Tape ou parle..."}
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
            disabled={loading || isRecording}
          />
          
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-violet-500 hover:bg-violet-400 disabled:bg-gray-700 text-white rounded-full p-2 transition-colors"
            aria-label="Envoyer le message"
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
