'use client'

import { useCallback, useEffect, useState } from 'react'
import Preview from './Preview'
import CompanyStep from './steps/CompanyStep'
import ServicesStep from './steps/ServicesStep'
import GalleryStep from './steps/GalleryStep'
import ContactStep from './steps/ContactStep'
import DesignStep from './steps/DesignStep'
import SummaryStep from './steps/SummaryStep'
import { CONFIG_STORAGE_KEY, STEPS, defaultSiteConfig, loadConfig, saveConfig, type SiteConfig } from './types'

const CHECKOUT_ENDPOINT = '/api/webdesign/checkout'

/** Retourne le message d'erreur bloquant une étape, ou null si valide. */
function stepError(step: number, config: SiteConfig): string | null {
  switch (step) {
    case 0:
      if (!config.business.name.trim()) return 'Le nom de l’entreprise est obligatoire pour continuer.'
      return null
    case 1:
      if (config.services.some((s) => s.name.trim())) return null
      return 'Ajoutez au moins un service avec un nom.'
    case 3:
      if (config.contact.phone.trim() || config.contact.email.trim()) return null
      return 'Indiquez au moins un téléphone / WhatsApp ou un email — vos clients doivent pouvoir vous joindre.'
    default:
      return null
  }
}

export default function Wizard() {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig() ?? defaultSiteConfig())
  const [step, setStep] = useState(0)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Persiste la config à chaque modification (la page de succès s'en resert).
  useEffect(() => {
    saveConfig(config)
  }, [config])

  const blockError = stepError(step, config)
  const isLast = step === STEPS.length - 1

  const next = () => {
    const err = stepError(step, config)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prev = () => {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const onPay = useCallback(async () => {
    setPaying(true)
    setError(null)
    try {
      const summary = {
        siteName: config.business.name.trim(),
        sector: config.business.sector,
        serviceCount: config.services.filter((s) => s.name.trim()).length,
        photoCount: config.gallery.filter((g) => g.type === 'image').length,
        email: config.contact.email.trim(),
      }
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Le paiement n’a pas pu être initialisé.')
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setPaying(false)
    }
  }, [config])

  const patchBusiness = useCallback((patch: Partial<SiteConfig['business']>) => {
    setConfig((p) => ({ ...p, business: { ...p.business, ...patch } }))
  }, [])
  const patchContact = useCallback((patch: Partial<SiteConfig['contact']>) => {
    setConfig((p) => ({ ...p, contact: { ...p.contact, ...patch } }))
  }, [])
  const patchDesign = useCallback((patch: Partial<SiteConfig['design']>) => {
    setConfig((p) => ({ ...p, design: { ...p.design, ...patch } }))
  }, [])

  return (
    <div>
      {/* Étapes */}
      <ol className="flex items-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <li key={s} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  active
                    ? 'border-violet-400 bg-violet-500/10 text-white'
                    : done
                      ? 'border-neutral-700 bg-neutral-900 text-slate-300 hover:border-neutral-500'
                      : 'border-neutral-800 text-slate-500'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    done ? 'bg-violet-500 text-white' : active ? 'bg-violet-500 text-white' : 'bg-neutral-800 text-slate-500'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className="hidden md:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-3 sm:w-5 bg-neutral-800" />}
            </li>
          )
        })}
      </ol>

      <div className="grid lg:grid-cols-[1fr_minmax(360px,440px)] gap-8 items-start">
        {/* Formulaire */}
        <div className="min-w-0">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8">
            {step === 0 && (
              <CompanyStep
                config={config}
                onBusiness={patchBusiness}
                onLogo={(logo) => setConfig((p) => ({ ...p, business: { ...p.business, logo } }))}
              />
            )}
            {step === 1 && (
              <ServicesStep
                services={config.services}
                onServices={(services) => setConfig((p) => ({ ...p, services }))}
              />
            )}
            {step === 2 && (
              <GalleryStep
                gallery={config.gallery}
                onGallery={(gallery) => setConfig((p) => ({ ...p, gallery }))}
              />
            )}
            {step === 3 && <ContactStep contact={config.contact} onContact={patchContact} />}
            {step === 4 && <DesignStep design={config.design} onDesign={patchDesign} />}
            {step === 5 && <SummaryStep config={config} onPay={onPay} paying={paying} />}

            {error && (
              <p className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-neutral-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Retour
            </button>
            {!isLast && (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-400 shadow-lg shadow-violet-500/25"
              >
                Continuer →
              </button>
            )}
          </div>
        </div>

        {/* Aperçu sticky */}
        <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
          <Preview config={config} />
        </div>
      </div>

      {/* Aperçu sous le formulaire (mobile/tablette) */}
      <div className="mt-10 lg:hidden">
        <Preview config={config} />
      </div>
    </div>
  )
}
