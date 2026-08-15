'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/TestCarousel'
import QRCode from 'qrcode'

const STORAGE_KEY = 'qrcall_phones'

const CLOSING_MESSAGES: Record<string, string> = {
  fr: "",
  en: "",
  pt: "",
  es: "",
}

// ── Validation téléphone (06, +336, 00336) ─────────────────────────────
function validatePhone(value: string): { valid: boolean; cleaned: string; error: string } {
  const cleaned = value.replace(/[\s\-\.\(\)]/g, '')
  // Normaliser : 06... → +336..., 00336... → +336...
  let normalized = cleaned
  if (/^0\d/.test(cleaned)) {
    normalized = '+33' + cleaned.slice(1)
  } else if (/^00/.test(cleaned)) {
    normalized = '+' + cleaned.slice(2)
  }
  if (!normalized.startsWith('+')) {
    return { valid: false, cleaned: normalized, error: 'Format invalide. Utilisez 06, +336 ou 00336' }
  }
  const digits = normalized.slice(1)
  if (!/^\d+$/.test(digits)) {
    return { valid: false, cleaned: normalized, error: 'Caractères non valides' }
  }
  if (digits.length < 8 || digits.length > 15) {
    return { valid: false, cleaned: normalized, error: 'Numéro invalide : 8 à 15 chiffres requis' }
  }
  return { valid: true, cleaned: normalized, error: '' }
}

// ── Génération QR avec logo incrusté (niveau H) ────────────────────────
async function generateQRWithLogo(data: string, size = 400): Promise<string> {
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, data, {
    width: size, margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  })

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')

  // Taille et position du logo
  const logoSize = Math.round(size * 0.2)
  const logoX = Math.round((size - logoSize) / 2)
  const logoY = Math.round((size - logoSize) / 2)
  const pad = Math.round(logoSize * 0.15)
  const radius = Math.round(logoSize * 0.22)

  // Fond blanc derrière le logo
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2)

  // Dégradé bleu → violet pour le fond du logo
  const gradient = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize)
  gradient.addColorStop(0, '#3b82f6')
  gradient.addColorStop(1, '#8b5cf6')

  // Rounded rectangle avec dégradé
  ctx.beginPath()
  ctx.moveTo(logoX + radius, logoY)
  ctx.lineTo(logoX + logoSize - radius, logoY)
  ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + radius)
  ctx.lineTo(logoX + logoSize, logoY + logoSize - radius)
  ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - radius, logoY + logoSize)
  ctx.lineTo(logoX + radius, logoY + logoSize)
  ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - radius)
  ctx.lineTo(logoX, logoY + radius)
  ctx.quadraticCurveTo(logoX, logoY, logoX + radius, logoY)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  // Lettre "N" en blanc
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${Math.round(logoSize * 0.7)}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('N', logoX + logoSize / 2, logoY + logoSize / 2 + 1)

  return canvas.toDataURL('image/png')
}

// ── Construction du contenu QR ────────────
function buildPwaUrl(phone: string): string {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '')
  return `${window.location.origin}/test/qrcall/contact?contact=${encodeURIComponent(cleaned)}`
}

// ── Compteur de génération (points lumineux) ──────────────────────────
function GenDots({ current, max }: { current: number; max: number }) {
  const ratio = current / max
  const color = ratio >= 1 ? '#ef4444' : ratio > 0.66 ? '#f59e0b' : '#10b981'
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${i < current ? '' : 'opacity-20'}`}
          style={{ backgroundColor: i < current ? color : '#666' }}
        />
      ))}
      <span className="text-xs tabular-nums text-neutral-500 ml-1">{current}/{max}</span>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
export default function TestQRcallPage() {
  const [lang, setLang] = useState('fr')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [sessionEnded, setSessionEnded] = useState(false)
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [closingMessage, setClosingMessage] = useState('')

  useEffect(() => {
    setLang(navigator.language?.split('-')[0] || 'fr')
  }, [])

  function handlePhoneChange(value: string) {
    setPhone(value.replace(/[^\d\s\+\-\.\(\)]/g, ''))
    setPhoneError('')
    setQrImageUrl(null)
  }

  const handleGenerate = useCallback(async () => {
    const { valid, cleaned, error } = validatePhone(phone)
    if (!valid) { setPhoneError(error); return }

    setGenerating(true)
    setQrImageUrl(null)

    try {
      const content = buildPwaUrl(cleaned)
      const qrDataUrl = await generateQRWithLogo(content, 400)
      setQrImageUrl(qrDataUrl)
    } catch {
      setPhoneError('Erreur lors de la génération du QR code')
    } finally {
      setGenerating(false)
    }
  }, [phone, lang])

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setSessionEnded(false)
    setQrImageUrl(null)
    setPhone('')
    setPhoneError('')
  }

  const overrideStyles = `
    #test-qrcall-page header, #test-qrcall-page footer { background: #000 !important; --color-header-bg: #000 !important; }
    #test-qrcall-page header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
    #test-qrcall-page footer { border-top-color: rgb(38 38 38) !important; }
    .bottom-carousel p:first-child { display: none !important; }
    .bottom-carousel img:not(.brand-logo-img) { display: none !important; }
    .bottom-carousel [class*='h-28'] { display: none !important; }
    .top-carousel p:first-child { display: none !important; }
    @media (max-width: 767px) {
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
      <div id="test-qrcall-page" className="min-h-screen bg-black text-white">
        <Header />
        <section className="relative pt-44 sm:pt-36 md:pt-72 lg:pt-80 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* ── Titre + Pitch ─────────────────────────────── */}
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-violet-400 mb-4">
                Test — QRcall
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
                QR Code d&apos;appel
              </h1>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Générez un QR code pour appeler un numéro en un scan.
                Idéal pour les vitrines, les véhicules de service, et les espaces partagés.
              </p>
            </div>

            {/* ── Carrousel haut ──────────────────────────── */}
            <div className="top-carousel fixed top-[83px] left-0 right-0 z-40 bg-black/90 px-2 sm:px-4 py-0.5 sm:py-1">
              <Carousel speed={90} />
            </div>

            {/* ── Infos session ──────────────────────────── */}
            <div className="flex items-center justify-between max-w-lg mx-auto mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${sessionEnded ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span className="text-sm text-neutral-300">
                  {sessionEnded ? 'Numéro bloqué' : 'Prêt à générer'}
                </span>
              </div>
            </div>

            <div className="max-w-lg mx-auto space-y-5">
              {sessionEnded ? (
                /* ── Message de fin ─────────────────────────── */
                <div className="bg-neutral-950 border border-red-500/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                    {closingMessage}
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    <a href="https://qrcall.newappai.com" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition border border-neutral-700">
                      Créer un compte complet
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button onClick={handleReset}
                      className="text-xs text-neutral-600 hover:text-neutral-400 transition">
                      Réinitialiser le compteur
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── Champ téléphone ───────────────────── */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-800">
                      <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Numéro de téléphone
                      </label>
                    </div>
                    <div className="p-4">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        placeholder="06 XX XX XX XX"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition font-mono tracking-wider"
                      />
                      {phoneError && <p className="text-red-400 text-xs mt-2">{phoneError}</p>}
                      <p className="text-neutral-600 text-[11px] mt-2">
                        Formats acceptés : 06 XX XX XX XX, +336XXXXXXXX, 00336XXXXXXXX
                      </p>
                    </div>
                  </div>

                  {/* ── Bouton de génération ────────────────── */}
                  <button onClick={() => handleGenerate()}
                    disabled={!phone.trim() || generating}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3.5 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 border border-neutral-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Générer QR code
                  </button>

                  {generating && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3 text-neutral-500 text-sm">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Génération du QR code...
                      </div>
                    </div>
                  )}

                  {/* ── QR affiché ──────────────────────── */}
                  {qrImageUrl && !generating && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                      <div className="flex flex-col items-center">
                        <p className="text-neutral-400 text-sm font-medium tracking-wider mb-4">
                          Discrétion assurée avec NewAppAI
                        </p>
                        <div className="bg-white rounded-xl p-3 shadow-lg">
                          <img src={qrImageUrl} alt="QR Code d'appel" className="w-64 h-64 md:w-72 md:h-72" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Comment ça marche ─────────────────────────── */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h2 className="text-center text-neutral-400 text-xs tracking-widest uppercase mb-8">
                Comment ça marche
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Saisissez un numéro', desc: 'Entrez un numéro de téléphone au format international.' },
                  { step: '2', title: 'Générez le QR', desc: 'Un clic génère un QR code vers la page de test conversation.' },
                  { step: '3', title: 'Scannez & discutez', desc: 'Le visiteur scanne, arrive sans login sur la conversation, et envoie un message.' },
                ].map(item => (
                  <div key={item.step} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-white text-sm font-medium mb-1.5">{item.title}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Carrousel bas ──────────────────────────── */}
            <div className="bottom-carousel fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-neutral-800 px-2 sm:px-4 py-1">
              <div className="max-w-6xl mx-auto overflow-hidden">
                <Carousel variant="brands" speed={90} />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
