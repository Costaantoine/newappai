'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { downloadSite } from '@/components/webdesign/generateSite'
import { loadConfig, type SiteConfig } from '@/components/webdesign/types'

export default function WebdesignSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Restaure la config sauvegardée par le wizard (permet la génération).
    const saved = loadConfig()
    if (saved) setConfig(saved)

    if (!sessionId) {
      setStatus('error')
      return
    }
    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setEmail(data.customerEmail || '')
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  const name = config?.business.name?.trim()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent overflow-x-hidden">
        <section className="relative pt-40 md:pt-48 pb-24 px-6 flex flex-col items-center text-center">
          <div className="absolute top-10 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full -z-10"></div>

          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 border-2 border-neutral-700 border-t-violet-400 rounded-full animate-spin mb-6" />
              <p className="text-slate-300">Vérification de votre paiement…</p>
            </div>
          )}

          {status === 'ok' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                Félicitations{name ? ` ${name}` : ''} !
              </h1>
              <p className="text-slate-300 max-w-xl text-lg mb-8 leading-relaxed">
                Votre site vitrine <strong className="text-white">Web Design</strong> est payé.{' '}
                Il a été généré à partir de vos réponses — téléchargez-le dès maintenant.
                {email && (
                  <span className="block mt-2">
                    Un reçu a été envoyé à <span className="text-violet-400">{email}</span>.
                  </span>
                )}
              </p>

              {config ? (
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                  <button
                    type="button"
                    onClick={() => downloadSite(config)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-8 py-4 text-base font-bold text-white transition hover:bg-violet-400 shadow-lg shadow-violet-500/25"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Télécharger mon site (HTML)
                  </button>
                  <Link
                    href="/webdesign"
                    className="inline-flex items-center gap-2 rounded-2xl border border-neutral-700 px-8 py-4 text-base font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                  >
                    Retourner à l’aperçu
                  </Link>
                </div>
              ) : (
                <p className="text-slate-400 max-w-md mb-10 leading-relaxed">
                  Votre configuration n’est plus disponible dans ce navigateur. Retournez au
                  générateur pour la reconstruire — votre paiement reste valide.
                </p>
              )}

              <div className="glass p-8 rounded-[2rem] border-white/5 max-w-lg w-full text-left">
                <h2 className="text-xl font-bold mb-4">Et maintenant ?</h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-violet-400 mr-2">1.</span>
                    Téléchargez votre fichier HTML — il est 100% autonome (images incluses).
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-400 mr-2">2.</span>
                    Ouvrez-le dans un navigateur pour vérifier le rendu final.
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-400 mr-2">3.</span>
                    Nous le mettons en ligne pour vous sur votre propre nom de domaine
                    (incluse dans l’offre).
                  </li>
                </ul>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">
                Paiement introuvable
              </h1>
              <p className="text-slate-300 max-w-lg mb-8 leading-relaxed">
                Nous n’avons pas pu confirmer votre session de paiement. Si vous venez de payer,
                votre reçu est arrivé par email. Contactez-nous pour vérifier votre commande.
              </p>
              <Link
                href="/webdesign"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-8 py-4 text-base font-bold text-white transition hover:bg-violet-400 shadow-lg shadow-violet-500/25"
              >
                Retour au générateur
              </Link>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
