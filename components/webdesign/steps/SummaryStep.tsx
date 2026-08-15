'use client'

import { useRouter } from 'next/navigation'
import { ACCENTS, BACKGROUNDS, FONT_PAIRS, STYLES } from '../palette'
import { SECTORS, type SiteConfig } from '../types'
import { StepHeading } from './ui'
import { DECOUVERTE_PRICE_CENTS } from '@/lib/vitrine/pricing'

const PRICE_LABEL = `${DECOUVERTE_PRICE_CENTS / 100}€`

interface SummaryStepProps {
  config: SiteConfig
  onPay: () => void
  paying: boolean
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-neutral-800/60 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-white font-medium text-right break-words">{value || '—'}</span>
    </div>
  )
}

export default function SummaryStep({ config, onPay, paying }: SummaryStepProps) {
  const router = useRouter()
  const bg = BACKGROUNDS.find((b) => b.id === config.design.backgroundId)
  const font = FONT_PAIRS.find((f) => f.id === config.design.fontPairId)
  const accent = ACCENTS.find((a) => a.id === config.design.accentId)
  const style = STYLES.find((s) => s.id === config.design.styleId)
  const sector = SECTORS.find((s) => s.id === config.business.sector)
  const photoCount = config.gallery.filter((g) => g.type === 'image').length
  const videoCount = config.gallery.filter((g) => g.type === 'video').length

  return (
    <div>
      <StepHeading
        number={5}
        title="Récapitulatif"
        subtitle="Vérifiez votre configuration avant de lancer le paiement. Votre site one-page sera généré immédiatement après."
      />

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-1">
        <Row label="Entreprise" value={config.business.name || '—'} />
        <Row label="Secteur" value={sector?.label || '—'} />
        <Row label="Services" value={config.services.filter((s) => s.name.trim()).map((s) => s.name).join(', ') || '—'} />
        <Row label="Photos" value={photoCount ? `${photoCount} photo${photoCount > 1 ? 's' : ''}` : 'Aucune'} />
        <Row label="Vidéos" value={videoCount ? `${videoCount} vidéo${videoCount > 1 ? 's' : ''}` : 'Aucune'} />
        <Row label="Téléphone / WhatsApp" value={config.contact.phone || '—'} />
        <Row label="Email" value={config.contact.email || '—'} />
        <Row label="Adresse" value={config.contact.address || '—'} />
        <Row label="Fond" value={bg?.label || '—'} />
        <Row label="Polices" value={font?.label || '—'} />
        <Row label="Couleur d'accent" value={accent?.label || '—'} />
        <Row label="Style" value={style?.label || '—'} />
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">Site vitrine one-page complet</p>
          <p className="text-xs text-slate-400 mt-0.5">Généré instantanément après paiement</p>
        </div>
        <div className="text-3xl font-bold text-white">{PRICE_LABEL}</div>
      </div>

      <button
        type="button"
        onClick={() => router.push('/vitrine/generation')}
        className="mt-6 w-full border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 font-medium py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
      >
        Voir mon aperçu provisoire
      </button>

      <button
        type="button"
        onClick={onPay}
        disabled={paying}
        className="mt-3 w-full bg-violet-500 hover:bg-violet-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-3 text-lg shadow-lg shadow-violet-500/25"
      >
        {paying ? (
          <>
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Redirection vers le paiement…
          </>
        ) : (
          <>
            Payer {PRICE_LABEL}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-500 mt-3">
        Paiement sécurisé par Stripe · {PRICE_LABEL} TTC · Hébergement et mise en ligne inclus
      </p>
    </div>
  )
}
