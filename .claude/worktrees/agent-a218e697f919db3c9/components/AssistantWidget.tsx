'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PrefillData {
  subject: string
  message: string
}

export default function AssistantWidget() {
  const { lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [suggestContact, setSuggestContact] = useState(false)
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = {
    fr: {
      placeholder: 'Posez votre question...',
      send: 'Envoyer',
      listening: 'Écoute...',
      fillForm: 'Remplir le formulaire',
      welcome: 'Bonjour ! Je suis l\'assistant NewAppAI. Comment puis-je vous aider ?',
      error: 'Désolé, une erreur s\'est produite. Veuillez réessayer.'
    },
    en: {
      placeholder: 'Ask your question...',
      send: 'Send',
      listening: 'Listening...',
      fillForm: 'Fill the form',
      welcome: 'Hello! I\'m the NewAppAI assistant. How can I help you?',
      error: 'Sorry, an error occurred. Please try again.'
    },
    pt: {
      placeholder: 'Faça sua pergunta...',
      send: 'Enviar',
      listening: 'Ouvindo...',
      fillForm: 'Preencher o formulário',
      welcome: 'Olá! Sou o assistente NewAppAI. Como posso ajudá-lo?',
      error: 'Desculpe, ocorreu um erro. Por favor, tente novamente.'
    },
    es: {
      placeholder: 'Haga su pregunta...',
      send: 'Enviar',
      listening: 'Escuchando...',
      fillForm: 'Rellenar el formulario',
      welcome: '¡Hola! Soy el asistente NewAppAI. ¿Cómo puedo ayudarle?',
      error: 'Lo siento, se produjo un error. Por favor, inténtelo de nuevo.'
    }
  }[lang] || {
    placeholder: 'Posez votre question...',
    send: 'Envoyer',
    listening: 'Écoute...',
    fillForm: 'Remplir le formulaire',
    welcome: 'Bonjour ! Je suis l\'assistant NewAppAI. Comment puis-je vous aider ?',
    error: 'Désolé, une erreur s\'est produite. Veuillez réessayer.'
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.welcome }])
    }
  }, [isOpen, t.welcome])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }, [lang])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages,
          lang
        })
      })

      const data = await response.json()

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.reply || t.error 
      }
      setMessages(prev => [...prev, assistantMessage])

      if (data.suggestContact && data.prefillData) {
        setSuggestContact(true)
        setPrefillData(data.prefillData)
      }

      speak(data.reply)
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: t.error }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = lang === 'fr' ? 'fr-FR' : 'en-US'
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onstart = () => setIsListening(true)
    recognitionRef.current.onend = () => setIsListening(false)
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      sendMessage(transcript)
    }

    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const fillContactForm = () => {
    setIsOpen(false)
    
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/contact'
      return
    }

    setTimeout(() => {
      const subjectSelect = document.querySelector('select#subject') as HTMLSelectElement
      const messageTextarea = document.querySelector('textarea#message') as HTMLTextAreaElement

      if (subjectSelect && prefillData?.subject) {
        const options = Array.from(subjectSelect.options)
        const matchingOption = options.find(opt => 
          opt.value.toLowerCase().includes(prefillData.subject.toLowerCase()) ||
          opt.text.toLowerCase().includes(prefillData.subject.toLowerCase())
        )
        if (matchingOption) {
          subjectSelect.value = matchingOption.value
        }
      }

      if (messageTextarea && prefillData?.message) {
        messageTextarea.value = prefillData.message
        messageTextarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }, 500)

    setSuggestContact(false)
    setPrefillData(null)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
          <div className="glass rounded-[2rem] border-sky-500/30 shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '70vh' }}>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-bold">Assistant NewAppAI</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80" style={{ minHeight: '300px' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-sky-500 text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              {suggestContact && (
                <div className="flex justify-center">
                  <button
                    onClick={fillContactForm}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all"
                  >
                    {t.fillForm} →
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-slate-950/80">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? t.listening : t.placeholder}
                  className="flex-1 bg-slate-800 border border-white/10 rounded-full px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
