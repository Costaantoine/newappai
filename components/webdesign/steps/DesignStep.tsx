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

        {/* Code couleur personnalisé */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Code couleur personnalisé</h3>
          <p className="text-xs text-slate-500 mb-3">Optionnel — si rempli, remplace la couleur d'accent ci-dessus.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.customColor || '#8b5cf6'}
              onChange={(e) => onDesign({ customColor: e.target.value })}
              className="h-11 w-14 rounded-lg border border-neutral-800 bg-neutral-900/50 cursor-pointer"
              aria-label="Sélecteur de couleur personnalisée"
            />
            <input
              type="text"
              value={design.customColor || ''}
              onChange={(e) => onDesign({ customColor: e.target.value })}
              placeholder="#8b5cf6"
              maxLength={7}
              className="w-32 rounded-xl bg-neutral-900/60 border border-neutral-800 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 px-3 py-2.5 text-white placeholder:text-slate-500 text-sm outline-none transition"
            />
            {design.customColor && (
              <button
                type="button"
                onClick={() => onDesign({ customColor: '' })}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Réinitialiser
              </button>
            )}
          </div>
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
