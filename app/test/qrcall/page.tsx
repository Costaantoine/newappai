'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TestQRcall() {
  const [phone, setPhone] = useState('')
  const [qrUrl, setQrUrl] = useState('')

  function generateVCardQr() {
    // Nettoyer le numéro
    const cleaned = phone.replace(/[\s\-\.\(\)]/g, '')
    if (!cleaned) return

    // Construire une vCard simple pour appel direct
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `TEL;TYPE=CELL:${cleaned}`,
      'END:VCARD',
    ].join('\n')

    // Utiliser l'API QR Server
    const encoded = encodeURIComponent(vcard)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}`)
  }

  function generateTelQr() {
    const cleaned = phone.replace(/[\s\-\.\(\)]/g, '')
    if (!cleaned) return
    const encoded = encodeURIComponent(`tel:${cleaned}`)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}`)
  }

  function handlePhoneChange(value: string) {
    // N'autoriser que les chiffres, +, espaces et tirets
    const sanitized = value.replace(/[^\d\s\+\-\.\(\)]/g, '')
    setPhone(sanitized)
    setQrUrl('')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#000000] text-[#f5f5f7]">
        <section className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          {/* Titre */}
          <div className="mb-16 text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400/80 mb-4">
              Test — QRcall
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              QR Code d&apos;appel
            </h1>
            <p className="text-[#86868b] text-lg max-w-xl mx-auto">
              Entrez un numéro de téléphone pour générer un QR code compatible appel direct.
            </p>
          </div>

          {/* Input numéro */}
          <div className="mb-10">
            <label className="block text-sm font-medium text-[#86868b] mb-2 tracking-wide">
              Numéro de téléphone
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-4 text-[#f5f5f7] text-lg focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition placeholder:text-[#4a4a4d]"
              />
            </div>
            <p className="text-[#4a4a4d] text-xs mt-2">
              Format international recommandé : +33612345678
            </p>
          </div>

          {/* Boutons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={generateVCardQr}
              disabled={!phone.trim()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500/90 text-white font-semibold text-base hover:bg-emerald-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Générer QR vCard
            </button>
            <button
              onClick={generateTelQr}
              disabled={!phone.trim()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.08] text-[#f5f5f7] font-semibold text-base hover:bg-white/[0.12] transition disabled:opacity-40 disabled:cursor-not-allowed border border-white/[0.1]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Générer QR tel:
            </button>
          </div>

          {/* QR Code affiché */}
          {qrUrl && (
            <div className="flex flex-col items-center">
              <div className="p-6 rounded-2xl bg-white border border-white/[0.1] shadow-xl shadow-black/40">
                <img
                  src={qrUrl}
                  alt="QR Code d'appel"
                  className="w-72 h-72 md:w-80 md:h-80"
                />
              </div>
              <p className="text-[#86868b] text-sm mt-4">
                Scannez ce QR code avec votre téléphone pour lancer l&apos;appel
              </p>
              <a
                href={qrUrl}
                download={`qrcall-${phone.replace(/[^\d]/g, '')}.png`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger le QR code
              </a>
            </div>
          )}

          {/* Indice */}
          {!qrUrl && (
            <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="text-sm font-semibold text-[#f5f5f7] mb-2">💡 Comment ça marche</h3>
              <ul className="text-sm text-[#86868b] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">1.</span>
                  <span>Saisissez un numéro de téléphone au format international</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">2.</span>
                  <span>Choisissez &quot;QR vCard&quot; (contact complet) ou &quot;QR tel:&quot; (appel direct)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">3.</span>
                  <span>Scannez le QR code avec l&apos;appareil photo de votre téléphone</span>
                </li>
              </ul>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
