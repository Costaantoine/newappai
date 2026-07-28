'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
// @ts-ignore

// --- Types ---
interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Product {
  id: string
  title: string | { fr: string; en: string; pt: string; es: string }
  images: string[]
  category: string
}

// --- Helpers ---
function getLocalizedText(text: any, lang: string): string {
  if (!text) return ''
  if (typeof text === 'object') return text[lang] || text.fr || ''
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') return parsed[lang] || parsed.fr || ''
  } catch {}
  return text
}

function getImageUrl(img: any): string {
  if (!img) return ''
  if (typeof img === 'string') {
    try { const p = JSON.parse(img); return p.original || p.thumbnail || '' } catch {}
    return img.startsWith('http') ? img : `https://newappai.com${img}`
  }
  return ''
}

function getProductUrl(title: any): string {
  const t = typeof title === 'object' ? (title.fr || title.en || '') : String(title)
  const n = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 \-]/g, '').trim()
  const map: Record<string, string> = {
    'redesign de site vitrine': '/produits/redesign-site-vitrine',
    'creation de site vitrine cle en main': '/produits/creation-site-vitrine',
    'chatbot client intelligent': '/produits/chatbot-client-intelligent',
    'click and delivery': '/produits/click-and-delivery',
    'talkie walkie connecte': '/produits/talkie-walkie-connecte',
    'serenite': '/produits/serenite',
    'serenite communication apaisee': '/produits/serenite',
    'paperasse': '/produits/paperasse',
    'application de gestion de production': '/produits/gestion-production',
    'easyreadvoice': '/easyreadvoice',
    'easyreadvoice texte vers audio': '/easyreadvoice',
    'easyreadvoice player': '/easyreadvoice',
    'qrcall': '/qrcall',
    'qrcall scan & call': '/qrcall',
  }
  if (map[n]) return map[n]
  for (const key of Object.keys(map)) {
    if (n.includes(key) || key.includes(n)) return map[key]
  }
  return '/produits'
}

// --- Messages de l'UI ---
const UI_TEXTS: Record<string, Record<string, string>> = {
  fr: { register_title: 'Testez Léa', register_desc: 'Créez un compte gratuit pour discuter avec Léa.', email_label: 'Email', password_label: 'Mot de passe', register_btn: 'Commencer la démo', connecting: 'Connexion...', chat_placeholder: 'Écrivez votre message...', send: 'Envoyer', lea_thinking: 'Léa réfléchit...', new_session: 'Nouvelle session', products_title: 'Découvrez nos produits', view_details: 'Voir détails →', email_sent: 'E-mail envoyé !', limit_reached: 'Limite atteinte' },
  en: { register_title: 'Test Léa', register_desc: 'Create a free account to chat with Léa.', email_label: 'Email', password_label: 'Password', register_btn: 'Start demo', connecting: 'Connecting...', chat_placeholder: 'Type your message...', send: 'Send', lea_thinking: 'Léa is thinking...', new_session: 'New session', products_title: 'Discover our products', view_details: 'View details →', email_sent: 'Email sent!', limit_reached: 'Limit reached' },
  pt: { register_title: 'Teste Léa', register_desc: 'Crie uma conta gratuita para conversar com Léa.', email_label: 'Email', password_label: 'Senha', register_btn: 'Iniciar demo', connecting: 'Conectando...', chat_placeholder: 'Escreva sua mensagem...', send: 'Enviar', lea_thinking: 'Léa está pensando...', new_session: 'Nova sessão', products_title: 'Descubra nossos produtos', view_details: 'Ver detalhes →', email_sent: 'E-mail enviado!', limit_reached: 'Limite atingido' },
  es: { register_title: 'Prueba Léa', register_desc: 'Cree una cuenta gratuita para hablar con Léa.', email_label: 'Email', password_label: 'Contraseña', register_btn: 'Iniciar demo', connecting: 'Conectando...', chat_placeholder: 'Escriba su mensaje...', send: 'Enviar', lea_thinking: 'Léa está pensando...', new_session: 'Nueva sesión', products_title: 'Descubra nuestros productos', view_details: 'Ver detalles →', email_sent: '¡Email enviado!', limit_reached: 'Límite alcanzado' },
}

export default function LeaWidget() {
  const { lang } = useLanguage()
  const t = UI_TEXTS[lang] || UI_TEXTS.fr

  // États
  const [step, setStep] = useState<'register' | 'chat' | 'closed'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [closingMsg, setClosingMsg] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const currentJaw = 0 // unused - using CSS keyframes instead
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [lastLeaText, setLastLeaText] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Charger les produits
  useEffect(() => {
    fetch('/api/supabase/products')
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {})
  }, [])

  // Auto-scroll carrousel produits
  useEffect(() => {
    const el = carouselRef.current
    if (!el || products.length === 0) return
    const scrollWidth = el.scrollWidth / 2
    let animationId = 0
    let lastTime = performance.now()
    const speed = 0.08

    const step = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      if (el.scrollLeft >= scrollWidth) {
        el.scrollLeft = 0
      } else {
        el.scrollLeft += delta * speed
      }
      animationId = requestAnimationFrame(step)
    }

    const onEnter = () => cancelAnimationFrame(animationId)
    const onLeave = () => {
      lastTime = performance.now()
      animationId = requestAnimationFrame(step)
    }
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    el.addEventListener("mousedown", onEnter)

    animationId = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(animationId)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [products])

  // Inscription
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/lea/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), lang })
      })
      const data = await res.json()
      if (data.session_id) {
        setSessionId(data.session_id)
        // Message d'ouverture de Léa
        const openers: Record<string, string> = {
          fr: "Bonjour, je suis Léa, l'assistante IA que vous pouvez intégrer à votre site. Vous pouvez me demander, par exemple : envoyer un e-mail de contact à votre place, vérifier une disponibilité de rendez-vous, ou répondre à une question client type. Que voulez-vous tester ?",
          en: "Hello, I'm Léa, the AI assistant you can integrate into your website. You can ask me, for example: send a contact email on your behalf, check appointment availability, or answer a typical customer question. What would you like to test?",
          pt: "Olá, sou a Léa, a assistente de IA que pode integrar no seu site. Pode pedir-me, por exemplo: enviar um e-mail de contacto por si, verificar disponibilidade de reunião, ou responder a uma pergunta típica de cliente. O que gostaria de testar?",
          es: "Hola, soy Léa, la asistente de IA que puedes integrar en tu sitio web. Puedes pedirme, por ejemplo: enviar un correo de contacto en tu lugar, verificar disponibilidad de cita, o responder a una pregunta típica de cliente. ¿Qué te gustaría probar?"
        }
        const openerText = openers[lang] || openers.fr
        setMessages([{ role: 'assistant', content: openerText }])
        setLastLeaText(openerText)
        setStep('chat')
      } else {
        alert(data.error || 'Erreur')
      }
    } catch (err) {
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const speakText = (txt: string) => {
    if (!voiceEnabled) return
    setLastLeaText(txt)
    setIsSpeaking(true)
  }

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!input.trim() || loading || step === 'closed') return

    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/lea/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages,
          session_id: sessionId,
          lang
        })
      })
      const data = await res.json()

      const replyMsg: Message = { role: 'assistant', content: data.reply }
      setMessages(prev => [...prev, replyMsg])
      setLastLeaText(data.reply)

      // Synthèse vocale de la réponse
      speakText(data.reply)

      // Envoi d'email géré par le backend via le flag `action`
      if (data.action === 'send_email' && !emailSent) {
        try {
          await fetch('/api/lea/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, email, history: [...messages, userMsg, replyMsg], lang })
          })
          setEmailSent(true)
        } catch {}
      }

      // Si session fermée (5e message ou clôture)
      if (data.is_closed) {
        setStep('closed')
        setClosingMsg(data.closing_message || data.reply)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur est survenue." }])
    } finally {
      setLoading(false)
    }
  }

  function resetDemo() {
    setStep('register')
    setMessages([])
    setSessionId('')
    setEmail('')
    setPassword('')
    setEmailSent(false)
    setClosingMsg('')
  }

  // Load Anam widget script
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[data-anam]')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@anam-ai/widget@latest'
      s.type = 'module'
      s.setAttribute('data-anam', '')
      document.head.appendChild(s)
    }
  }, [])

  // --- Rendu ---
  return (
    <div className="w-full max-w-4xl mx-auto">
      <style>{`
        .lea-mouth {
          transition: transform 0.04s ease-out;
          filter: brightness(1.1);
        }
        .lea-mouth-big {
          filter: brightness(1.15) drop-shadow(0 0 12px rgba(139,92,246,0.3));
        }
      `}</style>
      {step === 'register' && (
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-violet-500/20 flex-shrink-0">
              <Image src="/images/lea/avatar.png" alt="Léa" width={96} height={96} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#f5f5f7] mb-2">{t.register_title}</h2>
              <p className="text-[#86868b]">{t.register_desc}</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm text-[#86868b] mb-1.5">{t.email_label}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-violet-500/50 transition"
                placeholder="exemple@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-[#86868b] mb-1.5">{t.password_label}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-violet-500/50 transition"
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-3.5 rounded-xl transition disabled:opacity-50"
            >
              {loading ? t.connecting : t.register_btn}
            </button>
          </form>
        </div>
      )}

      {step === 'chat' && (
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl overflow-hidden">
          {/* En-tête */}
          <div className="flex items-center gap-3 p-4 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-violet-500/20 flex-shrink-0">
              <Image src="/images/lea/avatar.png" alt="Léa" width={40} height={40} className={"w-full h-full object-cover lea-mouth" + (isSpeaking ? " active" : "")} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#f5f5f7]">Léa</div>
              <div className="text-xs text-[#86868b]">{email}</div>
            </div>
            {isSpeaking && (
              <div className="text-xs text-violet-400 animate-pulse">🔊 Léa parle</div>
            )}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-xs text-white/70 hover:text-white p-1 rounded"
              title={voiceEnabled ? 'Couper la voix' : 'Activer la voix'}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {/* Avatar 3D de Léa */}
          <div className="flex flex-col items-center py-3 border-b border-white/[0.08] bg-white/[0.01]">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shadow-violet-500/20 bg-black/20">
              <Image
                src="/images/lea/avatar.png"
                alt="Léa"
                width={192}
                height={192}
                className="w-full h-full object-cover"
                style={{
                  transform: isSpeaking ? 'scaleY(1.15)' : 'scaleY(1)',
                  transformOrigin: '50% 80%',
                  transition: 'transform 0.15s ease-in-out'
                }}
              />
            </div>
            {isSpeaking && (
              <div className="mt-2 text-xs text-violet-400 animate-pulse font-medium tracking-wide">
                🔊 Lea parle...
              </div>
            )}
          </div>
          <div className="flex flex-col items-center py-6 border-b border-white/[0.08] bg-white/[0.01]">
          {/* Messages */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-violet-500/20 flex-shrink-0 mr-2 mt-1">
                    <Image src="/images/lea/avatar.png" alt="Léa" width={32} height={32} className={"w-full h-full object-cover lea-mouth" + (isSpeaking ? " active" : "")} />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-violet-500/20 text-[#f5f5f7] rounded-br-md'
                    : 'bg-white/[0.06] text-[#e8e8ed] rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-violet-500/20 flex-shrink-0 mr-2 mt-1">
                  <Image src="/images/lea/avatar.png" alt="Léa" width={32} height={32} className={"w-full h-full object-cover lea-mouth" + (isSpeaking ? " active" : "")} />
                </div>
                <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Email sent badge */}
          {emailSent && (
            <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 text-emerald-400 text-xs text-center">
              ✓ {t.email_sent}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/[0.08]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t.chat_placeholder}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-violet-500/50 transition text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-violet-500 hover:bg-violet-400 text-white px-5 py-2.5 rounded-xl disabled:opacity-50 transition font-medium text-sm"
              >
                {t.send}
              </button>
            </div>
          </form>
        </div>
        </div>
      )}

      {step === 'closed' && (
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-violet-500/20 mx-auto mb-4">
            <Image src="/images/lea/avatar.png" alt="Léa" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <p className="text-[#e8e8ed] text-lg leading-relaxed mb-6 max-w-lg mx-auto">
            {closingMsg}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetDemo}
              className="bg-white/[0.08] hover:bg-white/[0.12] text-[#f5f5f7] px-6 py-2.5 rounded-xl transition text-sm font-medium"
            >
              {t.new_session}
            </button>
            <Link
              href="/contact"
              className="bg-violet-500 hover:bg-violet-400 text-white px-6 py-2.5 rounded-xl transition text-sm font-medium"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      )}

      {/* Carrousel produits */}
      {products.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-[#86868b] tracking-wide uppercase mb-4">
            {t.products_title}
          </h3>
          <div ref={carouselRef} className="flex gap-4 overflow-x-hidden pb-4 scrollbar-thin scrollbar-thumb-white/[0.08] scrollbar-track-transparent">
            {[...products.filter((p: any) => p.active !== false), ...products.filter((p: any) => p.active !== false)].map((p: any, idx: number) => {
              const title = getLocalizedText(p.title, lang)
              const imgUrl = getImageUrl(p.images?.[0])
              return (
                <Link
                  key={`${p.id}-${idx}`}
                  href={getProductUrl(p.title)}
                  className="flex-shrink-0 w-44 backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.07] transition group"
                >
                  {imgUrl && (
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-white/[0.05]">
                      <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-sm font-medium text-[#f5f5f7] group-hover:text-violet-400 transition line-clamp-2">
                    {title}
                  </div>
                  <div className="text-xs text-violet-400 mt-2 opacity-0 group-hover:opacity-100 transition">
                    {t.view_details}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
