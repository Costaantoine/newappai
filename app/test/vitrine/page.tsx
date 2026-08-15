'use client'

/**
 * Démo instantanée « Site Vitrine » — accessible depuis la bulle du même nom.
 * Rendu par `DemoSite`, qui reproduit fidèlement le DESIGN RÉEL livré aux
 * clients (référence webolharosol — or/neutral, décision Antoine non
 * négociable), adapté en direct au nom, secteur et photos d'exemple. Ce que
 * le client voit ici = un aperçu du vrai design, pas un thème générique.
 *
 * Parcours : 1) CHOIX OBLIGATOIRE du type de commerce (cartes visuelles) →
 * 2) nom du commerce → aperçu en direct avec photos d'exemple par secteur.
 * Honnête : photos d'exemple (illustration), le site final utilise les
 * photos réelles du client ; l'aperçu est un squelette instantané, jamais
 * présenté comme le site final.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoSite from '@/components/test-vitrine/DemoSite'
import { defaultSiteConfig } from '@/components/webdesign/types'
import type { SiteConfig } from '@/components/webdesign/types'

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`

interface SectorDef {
  id: string // id partagé avec SECTORS (types.ts) — cohérence avec le wizard
  label: string
  emoji: string
  cardImage: string
  tagline: string
  services: { name: string; description: string }[]
  photos: string[] // [hero, mosaïque x3] — photos d'exemple
}

const SECTORS_DEMO: SectorDef[] = [
  {
    id: 'restaurant',
    label: 'Restaurant / Café',
    emoji: '🍽️',
    cardImage: U('photo-1414235077428-338989a2e8c0'),
    tagline: 'Bienvenue chez {nom}, votre restaurant de confiance. Une cuisine généreuse et un accueil chaleureux, à découvrir sans plus attendre.',
    services: [
      { name: 'Nos plats', description: 'Une carte qui change au fil des saisons' },
      { name: 'Menu du jour', description: 'Du frais, préparé sur place' },
      { name: 'Événements privés', description: 'Pour vos moments en famille ou entre amis' },
    ],
    photos: [
      U('photo-1414235077428-338989a2e8c0'),
      U('photo-1504674900247-0877df9cc836'),
      U('photo-1517248135467-4c7edcad34c4'),
      U('photo-1552566626-52f8b828add9'),
    ],
  },
  {
    id: 'coiffure',
    label: 'Coiffure / Salon',
    emoji: '💇‍♀️',
    cardImage: U('photo-1521590832167-7bcbfaa6381f'),
    tagline: 'Bienvenue chez {nom}, votre salon de coiffure. Coupe, couleur et soins dans une ambiance conviviale.',
    services: [
      { name: 'Coupe & coiffage', description: 'Un style qui vous ressemble' },
      { name: 'Coloration', description: 'Des couleurs lumineuses et durables' },
      { name: 'Soins & beauté', description: 'Pause détente et éclat retrouvé' },
    ],
    photos: [
      U('photo-1521590832167-7bcbfaa6381f'),
      U('photo-1560066984-138dadb4c035'),
      U('photo-1516975080664-ed2fc6a32937'),
      U('photo-1633681926022-84c23e8cb2d6'),
    ],
  },
  {
    id: 'artisan',
    label: 'Artisan',
    emoji: '🔨',
    cardImage: U('photo-1504307651254-35680f356dfd'),
    tagline: '{nom}, artisan à votre service. Des réalisations soignées, des délais tenus, un travail garanti.',
    services: [
      { name: 'Rénovation', description: 'Donnez une seconde vie à vos espaces' },
      { name: 'Installation', description: 'Pose soignée par des professionnels' },
      { name: 'Devis gratuit', description: 'Une réponse claire et rapide' },
    ],
    photos: [
      U('photo-1504307651254-35680f356dfd'),
      U('photo-1530124566582-a618bc2615dc'),
      U('photo-1581092160562-40aa08e78837'),
      U('photo-1503387762-592deb58ef4e'),
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    emoji: '🛍️',
    cardImage: U('photo-1441986300917-64674bd600d8'),
    tagline: '{nom}, votre commerce de proximité. Une sélection soignée et des conseils personnalisés.',
    services: [
      { name: 'Nos produits', description: 'Une sélection choisie avec soin' },
      { name: 'Conseils', description: 'Une équipe à votre écoute' },
      { name: 'Commandes', description: 'Simple, rapide, fiable' },
    ],
    photos: [
      U('photo-1441986300917-64674bd600d8'),
      U('photo-1556740738-b6a63e27c4df'),
      U('photo-1472851294608-062f824d29cc'),
      U('photo-1567401893414-76b7b1e5a7a5'),
    ],
  },
  {
    id: 'sante',
    label: 'Santé / Bien-être',
    emoji: '🌿',
    cardImage: U('photo-1544161515-4ab6ce6db874'),
    tagline: '{nom}, votre espace santé et bien-être. Professionnalisme, douceur et résultats.',
    services: [
      { name: 'Consultations', description: 'Un suivi personnalisé' },
      { name: 'Soins', description: 'Des protocoles adaptés à chacun' },
      { name: 'Bien-être', description: 'Prenez soin de vous' },
    ],
    photos: [
      U('photo-1544161515-4ab6ce6db874'),
      U('photo-1519823551278-64ac92734fb1'),
      U('photo-1570172619644-dfd03ed5d881'),
      U('photo-1506126613408-eca07ce68773'),
    ],
  },
  {
    id: 'service',
    label: 'Service / Pro libérale',
    emoji: '💼',
    cardImage: U('photo-1552664730-d307ca884978'),
    tagline: '{nom}, des services simples et fiables pour votre quotidien.',
    services: [
      { name: 'Nos prestations', description: 'Un accompagnement de A à Z' },
      { name: 'Devis gratuit', description: 'Transparent et sans engagement' },
      { name: 'Contact rapide', description: 'Une réponse sous 24h' },
    ],
    photos: [
      U('photo-1552664730-d307ca884978'),
      U('photo-1556761175-b413da4baf72'),
      U('photo-1521737604893-d14cc237f11d'),
      U('photo-1542744173-8e7e53415bb0'),
    ],
  },
]

const STAGES = ['Structure du site', 'Contenu adapté', 'Aperçu prêt']

export default function TestVitrinePage() {
  // Étape 1 : choix OBLIGATOIRE du type de commerce (avant le nom).
  const [sectorId, setSectorId] = useState<string | null>(null)
  // Étape 2 : nom du commerce.
  const [name, setName] = useState('')
  const [stage, setStage] = useState(0)
  const timed = useRef(false)

  const sector = SECTORS_DEMO.find((s) => s.id === sectorId) ?? null
  const hasName = !!sector && name.trim().length >= 2

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
    if (!sector) return base
    const trimmed = name.trim()
    return {
      ...base,
      business: {
        ...base.business,
        name: trimmed,
        sector: sector.id, // id partagé SECTORS — le wizard affiche la même étiquette
        description: trimmed ? sector.tagline.replace('{nom}', trimmed) : '',
      },
      services: sector.services.map((s, i) => ({
        id: `demo-${sector.id}-${i}`,
        name: s.name,
        description: s.description,
        price: '',
      })),
      gallery: sector.photos.map((url, i) => ({
        id: `demo-photo-${i}`,
        dataUrl: '',
        type: 'image' as const,
        name: `exemple-${i + 1}.jpg`,
        url,
      })),
      contact: { ...base.contact, phone: '', email: '', address: '', hours: '' },
      language: 'fr',
    }
  }, [name, sector])

  const pickSector = (id: string) => {
    setSectorId(id)
    setStage(0)
    timed.current = false
  }

  return (
    <div id="test-vitrine-page" className="min-h-screen bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        #test-vitrine-page > header, #test-vitrine-page > footer { background: #000 !important; --color-header-bg: #000 !important; }
        #test-vitrine-page > header { backdrop-filter: none !important; border-bottom-color: rgb(38 38 38) !important; }
        #test-vitrine-page > footer { border-top-color: rgb(38 38 38) !important; }
        /* NB : selecteurs > enfant direct uniquement — ne pas casser le header/footer
           blanc du design de reference a l'interieur de .demo-root (regle Antoine) */
        #test-vitrine-page .demo-frame { border: 1px solid rgb(38 38 38); border-radius: 1.25rem; overflow: hidden; background: #0a0a0a; }
        #test-vitrine-page .sector-card { transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        #test-vitrine-page .sector-card:hover { transform: translateY(-4px); border-color: rgb(139 92 246 / .6); }
        #test-vitrine-page .sector-card.selected { border-color: rgb(139 92 246); box-shadow: 0 0 0 2px rgb(139 92 246 / .5); }
      ` }} />
      <Header />
      <main className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Démo — Aperçu instantané</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#f5f5f7] tracking-tight">
            Votre site vitrine, <span className="text-violet-400">en quelques minutes</span>
          </h1>
          <p className="text-[#86868b] text-lg max-w-2xl mb-10">
            Choisissez votre type de commerce, tapez votre nom : le squelette de votre site
            se construit en direct, avec le même moteur que le vrai formulaire. Vos photos
            et vos textes s&apos;ajoutent à la génération complète.
          </p>

          {!sector ? (
            /* ── ÉTAPE 1 : CHOIX OBLIGATOIRE DU TYPE DE COMMERCE ── */
            <div>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-2">
                1. Quel est votre type de commerce ?
              </h2>
              <p className="text-[#86868b] mb-6">Choisissez pour adapter le contenu et le style de votre site.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SECTORS_DEMO.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickSector(s.id)}
                    className="sector-card relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-left group"
                  >
                    <div className="h-28 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.cardImage}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="font-semibold text-[#f5f5f7]">{s.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── ÉTAPE 2 : NOM + APERÇU EN DIRECT ── */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#f5f5f7]">
                  <span className="text-zinc-500">{sector.emoji}</span> {sector.label}
                  <button
                    onClick={() => { setSectorId(null); setName('') }}
                    className="ml-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
                  >
                    Changer de type de commerce
                  </button>
                </h2>
              </div>

              <div className="mb-6 max-w-md">
                <label className="block text-sm text-[#a1a1aa] mb-2">2. Le nom de votre commerce</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Ex : Boulangerie Martin`}
                  autoFocus
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Étapes réelles du squelette instantané */}
              <div className="flex items-center gap-3 mb-6 text-sm flex-wrap">
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
                  <DemoSite config={config} anchorPrefix="demo" />
                </div>
              </div>
              <p className="text-[#6b7280] text-xs mt-2 text-center">
                Photos d&apos;exemple (illustration) — votre site final utilise vos propres photos.
              </p>

              {/* CTA honnête vers le vrai formulaire */}
              <div className="mt-10 text-center">
                <p className="text-[#86868b] mb-4 max-w-xl mx-auto">
                  Ceci est un <strong className="text-zinc-300">aperçu instantané</strong> (squelette).
                  Le site complet — vos photos, vos vrais textes, votre lien personnalisé — est
                  généré pour vous en quelques minutes.
                </p>
                <Link
                  href="/webdesign"
                  className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-full transition-colors"
                >
                  Créer mon site complet — dès 149€
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
