'use client'

/**
 * Démo instantanée « Site Vitrine » — accessible depuis la bulle du même nom.
 * COHÉRENCE TOTALE avec le produit : ce composant utilise EXACTEMENT le même
 * moteur d'aperçu que le wizard (/webdesign) — même PreviewSite, mêmes
 * palettes, même config par défaut. Ce que le client voit ici = l'aperçu
 * provisoire qu'il verra avant de payer. Aucun autre visuel.
 * Règle honnête : c'est un APERÇU INSTANTANÉ (squelette), jamais présenté
 * comme le site final (qui est généré par le pipeline après paiement).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreviewSite from '@/components/webdesign/preview/PreviewSite'
import { defaultSiteConfig } from '@/components/webdesign/types'
import type { SiteConfig } from '@/components/webdesign/types'

interface SectorDef {
  id: string
  label: string
  tagline: string
  services: { name: string; description: string }[]
}

const SECTORS: SectorDef[] = [
  {
    id: 'restaurant',
    label: 'Restaurant / Bar',
    tagline: 'Bienvenue chez {nom}, votre restaurant de confiance. Une cuisine généreuse et un accueil chaleureux, à découvrir sans plus attendre.',
    services: [
      { name: 'Nos plats', description: 'Une carte qui change au fil des saisons' },
      { name: 'Menu du jour', description: 'Du frais, préparé sur place' },
      { name: 'Événements privés', description: 'Pour vos moments en famille ou entre amis' },
    ],
  },
  {
    id: 'coiffure',
    label: 'Salon / Coiffure',
    tagline: 'Bienvenue chez {nom}, votre salon de coiffure. Coupe, couleur et soins dans une ambiance conviviale.',
    services: [
      { name: 'Coupe & coiffage', description: 'Un style qui vous ressemble' },
      { name: 'Coloration', description: 'Des couleurs lumineuses et durables' },
      { name: 'Soins & beauté', description: 'Pause détente et éclat retrouvé' },
    ],
  },
  {
    id: 'artisan',
    label: 'Artisan / BTP',
    tagline: '{nom}, artisan à votre service. Des réalisations soignées, des délais tenus, un travail garanti.',
    services: [
      { name: 'Rénovation', description: 'Donnez une seconde vie à vos espaces' },
      { name: 'Installation', description: 'Pose soignée par des professionnels' },
      { name: 'Devis gratuit', description: 'Une réponse claire et rapide' },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce / Boutique',
    tagline: '{nom}, votre commerce de proximité. Une sélection soignée et des conseils personnalisés.',
    services: [
      { name: 'Nos produits', description: 'Une sélection choisie avec soin' },
      { name: 'Conseils', description: 'Une équipe à votre écoute' },
      { name: 'Commandes', description: 'Simple, rapide, fiable' },
    ],
  },
  {
    id: 'sante',
    label: 'Santé / Bien-être',
    tagline: '{nom}, votre espace santé et bien-être. Professionnalisme, douceur et résultats.',
    services: [
      { name: 'Consultations', description: 'Un suivi personnalisé' },
      { name: 'Soins', description: 'Des protocoles adaptés à chacun' },
      { name: 'Bien-être', description: 'Prenez soin de vous' },
    ],
  },
  {
    id: 'service',
    label: 'Services aux particuliers',
    tagline: '{nom}, des services simples et fiables pour votre quotidien.',
    services: [
      { name: 'Nos prestations', description: 'Un accompagnement de A à Z' },
      { name: 'Devis gratuit', description: 'Transparent et sans engagement' },
      { name: 'Contact rapide', description: 'Une réponse sous 24h' },
    ],
  },
]

const STAGES = ['Structure du site', 'Contenu adapté', 'Aperçu prêt']

export default function TestVitrinePage() {
  const [name, setName] = useState('')
  const [sectorId, setSectorId] = useState('restaurant')
  const [stage, setStage] = useState(0)
  const timed = useRef(false)

  const sector = SECTORS.find((s) => s.id === sectorId) ?? SECTORS[0]
  const hasName = name.trim().length >= 2

  // Étapes réelles du squelette instantané (structure → contenu → rendu).
  // Honnête : l'aperçu est réellement instantané, on met en scène ce qui se passe.
  useEffect(() => {
    if (!hasName) {
      setStage(0)
      timed.current = false
      return
    }
    if (timed.current) return
    timed.current = true
    setStage(1)
    const t2 = setTimeout(() => setStage(2), 450)
    const t3 = setTimeout(() => setStage(3), 900)
    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [hasName])

  const config = useMemo<SiteConfig>(() => {
    const base = defaultSiteConfig()
    const trimmed = name.trim()
    const services = sector.services.map((s, i) => ({
      id: `demo-${sectorId}-${i}`,
      name: s.name,
      description: s.description,
      price: '',
    }))
    return {
      ...base,
      business: {
        ...base.business,
        name: trimmed,
        sector: sector.label,
        description: trimmed ? sector.tagline.replace('{nom}', trimmed) : '',
      },
      services,
      contact: { ...base.contact, phone: '', email: '', address: '', hours: '' },
      language: 'fr',
    }
  }, [name, sectorId])

  return (
    <div id="test-vitrine-page" className="min-h-screen bg-black text-white">
      <style>{`
        #test-vitrine-page header, #test-vitrine-page footer { background: #000 !important; --color-header-bg: #000 !important; }
        #test-vitrine-page header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
        #test-vitrine-page footer { border-top-color: rgb(38 38 38) !important; }
        #test-vitrine-page .demo-frame { border: 1px solid rgb(38 38 38); border-radius: 1.25rem; overflow: hidden; background: #0a0a0a; }
      `}</style>
      <Header />
      <main className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Démo — Aperçu instantané</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#f5f5f7] tracking-tight">
            Votre site vitrine, <span className="text-violet-400">en quelques minutes</span>
          </h1>
          <p className="text-[#86868b] text-lg max-w-2xl mb-10">
            Tapez le nom de votre commerce : le squelette de votre site se construit en direct,
            avec le même moteur que le vrai formulaire. Vos photos, vos textes et votre lien
            personnalisé s&apos;ajoutent à la génération complète.
          </p>

          {/* Contrôles */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Nom de votre commerce</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Boulangerie Martin"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Votre secteur</label>
              <select
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Étapes réelles du squelette instantané */}
          <div className="flex items-center gap-3 mb-6 text-sm">
            {STAGES.map((label, i) => {
              const done = hasName && stage > i
              const active = hasName && stage === i + 1
              return (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full border transition-all ${
                      done
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : active
                          ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                          : 'border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {done ? '✓ ' : ''}
                    {label}
                  </span>
                  {i < STAGES.length - 1 && <span className="text-zinc-700">→</span>}
                </div>
              )
            })}
          </div>

          {/* Le MÊME aperçu que le wizard */}
          <div className="demo-frame relative">
            {!hasName && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <p className="text-zinc-300 text-lg px-6 text-center">
                  Tapez le nom de votre commerce pour voir votre site se construire ✨
                </p>
              </div>
            )}
            <div className="max-h-[560px] overflow-y-auto">
              <PreviewSite config={config} anchorPrefix="demo" />
            </div>
          </div>

          {/* CTA honnête vers le vrai formulaire */}
          <div className="mt-10 text-center">
            <p className="text-[#86868b] mb-4 max-w-xl mx-auto">
              Ceci est un <strong className="text-zinc-300">aperçu instantané</strong> (squelette).
              Le site complet — vos photos, vos vrais textes, votre lien personnalisé, votre
              domaine — est généré pour vous en quelques minutes.
            </p>
            <Link
              href="/webdesign"
              className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Créer mon site complet — dès 149€
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
