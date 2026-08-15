'use client'

import { ACCENTS, BACKGROUNDS, FONT_PAIRS, STYLES } from '../palette'
import type { DesignConfig } from '../types'
import { StepHeading } from './ui'

interface DesignStepProps {
  design: DesignConfig
  onDesign: (patch: Partial<DesignConfig>) => void
}

const selectedClass =
  'border-violet-400 ring-2 ring-violet-500/30 bg-violet-500/10'
const idleClass =
  'border-neutral-800 bg-neutral-900/50 hover:border-neutral-600'

export default function DesignStep({ design, onDesign }: DesignStepProps) {
  return (
    <div>
      <StepHeading
        number={4}
        title="Personnalisez le design"
        subtitle="Choisissez le fond, les polices, la couleur d'accent et le style. L'aperçu se met à jour en temps réel à droite."
      />

      {/* Charge les polices pour les aperçus des cartes */}
      <link rel="stylesheet" href={FONT_PAIRS[0].googleHref} />
      <link rel="stylesheet" href={FONT_PAIRS[1].googleHref} />
      <link rel="stylesheet" href={FONT_PAIRS[2].googleHref} />
      <link rel="stylesheet" href={FONT_PAIRS[3].googleHref} />
      <link rel="stylesheet" href={FONT_PAIRS[4].googleHref} />

      <div className="space-y-8">
        {/* Fond */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Fond du site</h3>
          <div className="grid grid-cols-4 gap-3">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onDesign({ backgroundId: b.id })}
                className={`rounded-xl border p-2 transition text-left ${
                  design.backgroundId === b.id ? selectedClass : idleClass
                }`}
                aria-label={`Fond ${b.label}`}
              >
                <span
                  className="block h-12 rounded-lg border border-black/10"
                  style={{ backgroundColor: b.swatch }}
                />
                <span className="block mt-2 text-xs text-slate-300 truncate">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Polices */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Polices</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {FONT_PAIRS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onDesign({ fontPairId: f.id })}
                className={`rounded-xl border p-4 transition text-left ${
                  design.fontPairId === f.id ? selectedClass : idleClass
                }`}
              >
                <span className="block text-3xl leading-none" style={{ fontFamily: f.heading }}>
                  Aa
                </span>
                <span
                  className="block mt-1.5 text-sm"
                  style={{ fontFamily: f.body }}
                >
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Couleur d'accent</h3>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onDesign({ accentId: a.id })}
                aria-label={`Accent ${a.label}`}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                  design.accentId === a.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: a.hex }}
              >
                {design.accentId === a.id && (
                  <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {ACCENTS.find((a) => a.id === design.accentId)?.label}
          </p>
        </div>

        {/* Style */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Style</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onDesign({ styleId: s.id })}
                className={`rounded-xl border p-4 transition text-left ${
                  design.styleId === s.id ? selectedClass : idleClass
                }`}
              >
                <span
                  className="block text-lg leading-none text-white mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: s.headingWeight,
                    letterSpacing: s.letterSpacing,
                  }}
                >
                  Titre
                </span>
                <span className="block text-xs text-slate-400 leading-snug">{s.label}</span>
                <span className="block text-[11px] text-slate-500 mt-1">{s.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
