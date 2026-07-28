'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

interface TextItem {
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

function getText(texts: TextItem[], key: string, lang: string, fallback: string = ''): string {
  const found = texts.find(t => t.key === key)
  if (found) {
    const val = found[lang as keyof TextItem]
    if (val && val.trim() !== '') return val
    return (found.fr && found.fr.trim() !== '') ? found.fr : fallback
  }
  return fallback
}

const PLANS = [
  {
    id: 'decouverte',
    name: { fr: 'Découverte', en: 'Discovery', pt: 'Descoberta', es: 'Descubrimiento' },
    price: 1.99,
    maxChars: 5_000,
    priceLabel: { fr: '1.99 €', en: '€1.99', pt: '1.99 €', es: '1.99 €' },
    desc: {
      fr: 'Pour un article, une lettre ou un petit texte.',
      en: 'For an article, letter, or short text.',
      pt: 'Para um artigo, carta ou texto curto.',
      es: 'Para un artículo, carta o texto corto.',
    },
    features: [
      { fr: 'Jusqu\'à 5 000 caractères', en: 'Up to 5,000 characters', pt: 'Até 5 000 caracteres', es: 'Hasta 5,000 caracteres' },
      { fr: 'Voix féminine — narratrice naturelle', en: 'Female voice — natural narrator', pt: 'Voz feminina — narradora natural', es: 'Voz femenina — narradora natural' },
      { fr: 'Détection automatique des dialogues', en: 'Automatic dialogue detection', pt: 'Deteção automática de diálogos', es: 'Detección automática de diálogos' },
      { fr: 'Téléchargement MP3', en: 'MP3 download', pt: 'Download MP3', es: 'Descarga MP3' },
      { fr: 'Délai : ~1 min', en: 'Processing: ~1 min', pt: 'Prazo: ~1 min', es: 'Plazo: ~1 min' },
    ],
    popular: false,
  },
  {
    id: 'essentiel',
    name: { fr: 'Essentiel', en: 'Essential', pt: 'Essencial', es: 'Esencial' },
    price: 4.99,
    maxChars: 25_000,
    priceLabel: { fr: '4.99 €', en: '€4.99', pt: '4.99 €', es: '4.99 €' },
    desc: {
      fr: 'Pour un dossier, un rapport ou une nouvelle.',
      en: 'For a report, dossier, or short story.',
      pt: 'Para um relatório, dossiê ou conto.',
      es: 'Para un informe, expediente o cuento.',
    },
    features: [
      { fr: 'Jusqu\'à 25 000 caractères', en: 'Up to 25,000 characters', pt: 'Até 25 000 caracteres', es: 'Hasta 25,000 caracteres' },
      { fr: 'Voix féminine + 1 voix secondaire', en: 'Female voice + 1 secondary voice', pt: 'Voz feminina + 1 voz secundária', es: 'Voz femenina + 1 voz secundaria' },
      { fr: 'Détection automatique des dialogues', en: 'Automatic dialogue detection', pt: 'Deteção automática de diálogos', es: 'Detección automática de diálogos' },
      { fr: 'Téléchargement MP3', en: 'MP3 download', pt: 'Download MP3', es: 'Descarga MP3' },
      { fr: 'Délai : ~5 min', en: 'Processing: ~5 min', pt: 'Prazo: ~5 min', es: 'Plazo: ~5 min' },
    ],
    popular: true,
  },
  {
    id: 'standard',
    name: { fr: 'Standard', en: 'Standard', pt: 'Padrão', es: 'Estándar' },
    price: 9.99,
    maxChars: 100_000,
    priceLabel: { fr: '9.99 €', en: '€9.99', pt: '9.99 €', es: '9.99 €' },
    desc: {
      fr: 'Pour un roman court, un mémoire ou un long document.',
      en: 'For a short novel, memoir, or long document.',
      pt: 'Para um romance curto, memória ou documento longo.',
      es: 'Para una novela corta, memoria o documento largo.',
    },
    features: [
      { fr: 'Jusqu\'à 100 000 caractères', en: 'Up to 100,000 characters', pt: 'Até 100 000 caracteres', es: 'Hasta 100,000 caracteres' },
      { fr: 'Multi-voix complètes (4-8 voix)', en: 'Full multi-voice (4-8 voices)', pt: 'Vozes múltiplas completas (4-8 vozes)', es: 'Voces múltiples completas (4-8 voces)' },
      { fr: 'Voix féminines + masculines selon personnages', en: 'Male + female voices by character', pt: 'Vozes masculinas + femininas por personagem', es: 'Voces masculinas + femeninas según personaje' },
      { fr: 'Détection automatique narrateur/dialogues', en: 'Auto narrator/dialogue detection', pt: 'Deteção automática narrador/diálogos', es: 'Detección automática narrador/diálogos' },
      { fr: 'Téléchargement MP3', en: 'MP3 download', pt: 'Download MP3', es: 'Descarga MP3' },
      { fr: 'Délai : ~15 min', en: 'Processing: ~15 min', pt: 'Prazo: ~15 min', es: 'Plazo: ~15 min' },
    ],
    popular: false,
  },
  {
    id: 'integral',
    name: { fr: 'Intégral', en: 'Full', pt: 'Integral', es: 'Integral' },
    price: 19.99,
    maxChars: 500_000,
    priceLabel: { fr: '19.99 €', en: '€19.99', pt: '19.99 €', es: '19.99 €' },
    desc: {
      fr: 'Pour un roman complet, une thèse ou tout document long.',
      en: 'For a full novel, thesis, or long document.',
      pt: 'Para um romance completo, tese ou documento longo.',
      es: 'Para una novela completa, tesis o documento largo.',
    },
    features: [
      { fr: 'Jusqu\'à 500 000 caractères', en: 'Up to 500,000 characters', pt: 'Até 500 000 caracteres', es: 'Hasta 500,000 caracteres' },
      { fr: 'Multi-voix complètes (8 voix max)', en: 'Full multi-voice (up to 8 voices)', pt: 'Vozes múltiplas completas (até 8 vozes)', es: 'Voces múltiples completas (hasta 8 voces)' },
      { fr: 'Voix hommes, femmes adaptées aux personnages', en: 'Male + female voices matched to characters', pt: 'Vozes masculinas + femininas adaptadas às personagens', es: 'Voces masculinas + femeninas adaptadas a los personajes' },
      { fr: 'Détection automatique narrateur/dialogues', en: 'Auto narrator/dialogue detection', pt: 'Deteção automática narrador/diálogos', es: 'Detección automática narrador/diálogos' },
      { fr: 'Téléchargement MP3', en: 'MP3 download', pt: 'Download MP3', es: 'Descarga MP3' },
      { fr: 'Délai : ~45 min', en: 'Processing: ~45 min', pt: 'Prazo: ~45 min', es: 'Plazo: ~45 min' },
    ],
    popular: false,
  },
]

export default function EasyReadVoicePage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])

  useEffect(() => {
    fetch('/api/local/texts')
      .then(r => r.json())
      .then(d => setTexts(d.texts || []))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 pt-32 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div data-section="erv-badge" className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🎧 EasyReadVoice
          </div>
          <h1 data-section="erv-hero-title" className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Texte écrit →{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
              Audio parlé
            </span>
          </h1>
          <p data-section="erv-hero-subtitle" className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transformez n'importe quel document écrit en audio avec des voix adaptées : 
            féminines, masculines, par personnage. Romans, rapports, articles, thèses, cours…
            tout devient audio.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-10">
            <span className="bg-white/80 px-3 py-1 rounded-full">📄 PDF</span>
            <span className="bg-white/80 px-3 py-1 rounded-full">📝 Texte</span>
            <span className="bg-white/80 px-3 py-1 rounded-full">📖 EPUB</span>
            <span className="bg-white/80 px-3 py-1 rounded-full">📋 Copier-coller</span>
          </div>
        </div>
      </section>

      {/* Pourquoi EasyReadVoice */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 data-section="erv-why-title" className="text-3xl font-bold text-center text-gray-900 mb-16">
            Pourquoi EasyReadVoice ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '🎭', title: 'Voix adaptées', desc: 'Notre IA détecte automatiquement qui parle et choisit la voix qui correspond : narratrice, personnages féminins, masculins.' },
              { icon: '🧠', title: 'Intelligence embarquée', desc: 'Analyse intelligente du texte pour un rendu naturel : dialogues, monologues, récits, tout devient vivant.' },
              { icon: '📱', title: 'Simple et rapide', desc: 'Uploadez votre document, choisissez votre forfait, recevez votre audio. Rien à installer.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <h2 data-section="erv-pricing-title" className="text-3xl font-bold text-center text-gray-900 mb-4">
            Tarifs
          </h2>
          <p data-section="erv-pricing-subtitle" className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Payez uniquement ce que vous écoutez. Pas d'abonnement, pas d'engagement.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-200 hover:shadow-lg ${
                  plan.popular
                    ? 'border-indigo-400 bg-white shadow-md ring-2 ring-indigo-400/20 scale-[1.02]'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {getText(texts, 'qr.popular', lang, 'Populaire')}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {plan.name.fr}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 min-h-[40px]">
                    {plan.desc.fr}
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.priceLabel.fr}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-indigo-500 mt-0.5 shrink-0">✓</span>
                        <span>{feat.fr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  data-section="erv-buy"
                  href={`/checkout?plan=easyreadvoice-${plan.id}`}
                  className={`block w-full text-center py-3 px-4 rounded-xl font-bold transition text-sm ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Commander
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 data-section="erv-how-title" className="text-3xl font-bold text-center text-gray-900 mb-16">
            Comment ça marche
          </h2>
          <div className="grid sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Choisissez', desc: 'Votre document et votre forfait' },
              { step: '2', title: 'Analyse', desc: 'EasyReadVoice détecte la structure et les voix' },
              { step: '3', title: 'Génération', desc: 'Production audio multi-voix en quelques minutes' },
              { step: '4', title: 'Écoutez', desc: 'Téléchargez votre fichier MP3 et écoutez' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparaison token pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p data-section="erv-token-note" className="text-sm text-gray-400 mb-2">💡 Calcul des prix basé sur le coût réel des tokens DeepSeek × 10</p>
          <div className="inline-block text-left bg-white rounded-xl p-6 border border-gray-200 text-sm text-gray-500">
            <p className="mb-2"><strong>Exemple de calcul :</strong></p>
            <p>📄 Document de 100 000 car. ≈ 25 000 tokens DeepSeek</p>
            <p>💰 Coût tokens : 25K × 0.50 $/1M = <strong>0,0125 $</strong></p>
            <p>× 10 = <strong>0,125 $</strong> → prix public 9.99 €</p>
            <p className="mt-2 text-xs text-gray-400">(La marge couvre la génération audio edge-TTS, le stockage, la bande passante et les frais de plateforme)</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 data-section="erv-faq-title" className="text-3xl font-bold text-center text-gray-900 mb-12">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Quels types de documents sont acceptés ?',
                r: 'EPUB, PDF, TXT, DOCX ou simple copier-coller. Tout texte écrit peut être transformé en audio.',
              },
              {
                q: 'Combien de temps faut-il pour générer l\'audio ?',
                r: 'Comptez ~1 minute pour 5 000 caractères, jusqu\'à ~45 minutes pour un roman complet de 500 000 caractères.',
              },
              {
                q: 'Les voix sont-elles naturelles ?',
                r: 'Oui. Utilise la technologie edge-TTS avec des voix neurales. 8 voix disponibles (féminines France, Québec, Belgique, Suisse ; masculines France, Québec).',
              },
              {
                q: 'Puis-je choisir les voix moi-même ?',
                r: 'Pour le moment, l\'attribution des voix est automatique (détection du genre des personnages). La sélection manuelle arrivera bientôt.',
              },
              {
                q: 'Les dialogues sont-ils reconnus ?',
                r: 'Oui. EasyReadVoice détecte automatiquement les dialogues, les guillemets, les tirets, et assigne des voix différentes selon le genre du personnage.',
              },
              {
                q: 'Puis-je obtenir un devis pour un très long document ?',
                r: 'Oui, contactez-nous pour les documents de plus de 500 000 caractères. Un tarif sur mesure vous sera proposé.',
              },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 py-4 text-gray-600 leading-relaxed">
                  {faq.r}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
