'use client'

import { useEffect, useState } from 'react'
import { FONT_PAIRS } from './palette'
import type { SiteConfig } from './types'
import PreviewSite from './preview/PreviewSite'

type Device = 'desktop' | 'mobile'

export default function Preview({ config }: { config: SiteConfig }) {
  const [device, setDevice] = useState<Device>('desktop')

  // Charge la police de la paire sélectionnée pour le rendu de l'aperçu.
  useEffect(() => {
    const pair = FONT_PAIRS.find((f) => f.id === config.design.fontPairId)
    if (!pair) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = pair.googleHref
    link.dataset.previewFont = '1'
    document.head.appendChild(link)
    return () => {
      document.querySelectorAll('link[data-preview-font]').forEach((l) => l.remove())
    }
  }, [config.design.fontPairId])

  const buttons: { id: Device; label: string }[] = [
    { id: 'desktop', label: 'Desktop' },
    { id: 'mobile', label: 'Mobile' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Aperçu en direct
        </p>
        <div className="flex rounded-lg border border-neutral-800 bg-neutral-900/50 p-0.5">
          {buttons.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setDevice(b.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                device === b.id
                  ? 'bg-violet-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex justify-center rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 overflow-hidden">
        {device === 'mobile' ? (
          /* Téléphone */
          <div className="flex flex-col w-[330px] shrink-0 rounded-[2.4rem] border-[6px] border-neutral-800 bg-black overflow-hidden shadow-2xl shadow-black/60">
            <div className="flex items-center justify-center py-2 bg-neutral-900">
              <span className="h-4 w-20 rounded-full bg-neutral-800" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto bg-white">
              <PreviewSite config={config} />
            </div>
            <div className="flex items-center justify-center py-1.5 bg-neutral-900">
              <span className="h-1 w-24 rounded-full bg-neutral-700" />
            </div>
          </div>
        ) : (
          /* Desktop */
          <div className="flex flex-col flex-1 min-w-0 rounded-t-xl border border-neutral-700 bg-black overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 flex-1 max-w-[260px] mx-auto rounded-md bg-neutral-800/70 px-3 py-1 text-[11px] text-slate-500 truncate text-center">
                {config.business.name || 'votre-entreprise.com'}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto bg-white">
              <PreviewSite config={config} />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
        L’aperçu reflète vos données et votre design en temps réel. La galerie, la carte et le
        bouton WhatsApp sont interactifs.
      </p>
    </div>
  )
}
