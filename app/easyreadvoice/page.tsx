'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import AdBannerTop from './_components/AdBannerTop'
import AdBannerBottom from './_components/AdBannerBottom'

const STEPS = [
  {
    step: '1',
    title: 'Uploadez votre document',
    desc: 'PDF, EPUB, TXT ou DOCX — glissez-déposez votre fichier en quelques secondes.',
  },
  {
    step: '2',
    title: 'Analyse IA du texte',
    desc: 'Notre IA lit et comprend la structure de votre document : narration, dialogues, personnages.',
  },
  {
    step: '3',
    title: 'Attribution intelligente des voix',
    desc: 'Chaque personnage reçoit une voix adaptée : féminine, masculine, selon le contexte.',
  },
  {
    step: '4',
    title: 'Génération audio',
    desc: 'Votre fichier audio est généré et prêt à télécharger, où que vous soyez.',
  },
]

const FEATURES = [
  {
    icon: '🎭',
    title: 'Voix adaptées',
    desc: "L'IA détecte automatiquement qui parle et choisit la voix qui correspond à chaque personnage.",
  },
  {
    icon: '🧠',
    title: 'Intelligence embarquée',
    desc: 'Analyse structurelle du texte pour un rendu naturel : dialogues, monologues, récits.',
  },
  {
    icon: '📄',
    title: 'Multi-format',
    desc: 'Compatible PDF, EPUB, TXT et DOCX. Un seul outil pour tous vos documents.',
  },
  {
    icon: '🔒',
    title: 'Confidentialité',
    desc: 'Vos fichiers sont supprimés automatiquement après la génération de votre audio.',
  },
]

const PLANS = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: '1.99 €',
    desc: 'Pour un article, une lettre ou un petit texte.',
    features: [
      "Jusqu'à 5 000 caractères",
      'Voix féminine — narratrice naturelle',
      'Détection automatique des dialogues',
      'Téléchargement MP3',
      'Délai : ~1 min',
    ],
    popular: false,
  },
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: '4.99 €',
    desc: 'Pour un dossier, un rapport ou une nouvelle.',
    features: [
      "Jusqu'à 25 000 caractères",
      'Voix féminine + 1 voix secondaire',
      'Détection automatique des dialogues',
      'Téléchargement MP3',
      'Délai : ~5 min',
    ],
    popular: true,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '9.99 €',
    desc: 'Pour un roman court, un mémoire ou un long document.',
    features: [
      "Jusqu'à 100 000 caractères",
      'Multi-voix complètes (4-8 voix)',
      'Voix féminines + masculines selon personnages',
      'Détection automatique narrateur/dialogues',
      'Téléchargement MP3',
      'Délai : ~15 min',
    ],
    popular: false,
  },
  {
    id: 'integral',
    name: 'Intégral',
    price: '19.99 €',
    desc: 'Pour un roman complet, une thèse ou tout document long.',
    features: [
      "Jusqu'à 500 000 caractères",
      'Multi-voix complètes (8 voix max)',
      'Voix hommes, femmes adaptées aux personnages',
      'Détection automatique narrateur/dialogues',
      'Téléchargement MP3',
      'Délai : ~45 min',
    ],
    popular: false,
  },
]

const FAQ = [
  {
    q: 'Quels types de documents sont acceptés ?',
    r: 'EPUB, PDF, TXT, DOCX ou simple copier-coller. Tout texte écrit peut être transformé en audio.',
  },
  {
    q: "Combien de temps faut-il pour générer l'audio ?",
    r: "Comptez ~1 minute pour 5 000 caractères, jusqu'à ~45 minutes pour un roman complet de 500 000 caractères.",
  },
  {
    q: 'Les voix sont-elles naturelles ?',
    r: "Oui. EasyReadVoice utilise la technologie edge-TTS avec des voix neurales. 8 voix disponibles (féminines France, Québec, Belgique, Suisse ; masculines France, Québec).",
  },
  {
    q: 'Puis-je choisir les voix moi-même ?',
    r: "Pour le moment, l'attribution des voix est automatique (détection du genre des personnages). La sélection manuelle arrivera bientôt.",
  },
  {
    q: 'Les dialogues sont-ils reconnus ?',
    r: 'Oui. EasyReadVoice détecte automatiquement les dialogues, les guillemets, les tirets, et assigne des voix différentes selon le genre du personnage.',
  },
  {
    q: 'Puis-je obtenir un devis pour un très long document ?',
    r: 'Oui, contactez-nous pour les documents de plus de 500 000 caractères. Un tarif sur mesure vous sera proposé.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.r,
    },
  })),
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment transformer un document en audio avec EasyReadVoice',
  description: "Transformez n'importe quel document (PDF, EPUB, TXT, DOCX) en fichier audio avec des voix adaptées par personnage.",
  step: STEPS.map((item) => ({
    '@type': 'HowToStep',
    position: Number(item.step),
    name: item.title,
    text: item.desc,
  })),
}

export default function EasyReadVoicePage() {
  useEffect(() => {
    document.body.dataset.theme = 'erv-light'

    const styleId = 'erv-header-light'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        body[data-theme="erv-light"] header,
        body[data-theme="erv-light"] [class*="fixed"][class*="z-50"] {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(12px) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        }
        body[data-theme="erv-light"] header a,
        body[data-theme="erv-light"] header span,
        body[data-theme="erv-light"] header button,
        body[data-theme="erv-light"] [class*="fixed"][class*="z-50"] a,
        body[data-theme="erv-light"] [class*="fixed"][class*="z-50"] span {
          color: #374151 !important;
        }
        body[data-theme="erv-light"] header a:hover,
        body[data-theme="erv-light"] [class*="fixed"][class*="z-50"] a:hover {
          color: #7c3aed !important;
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      const s = document.getElementById(styleId)
      if (s) s.remove()
      delete document.body.dataset.theme
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Header />
      <AdBannerTop />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50 pt-32 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-violet-200/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v3z" />
            </svg>
            EasyReadVoice
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Vos textes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
              prennent vie
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transformez n'importe quel document en audio avec des voix adaptées : féminines,
            masculines, par personnage.
          </p>
          <Link
            href="/easyreadvoice/upload"
            className="inline-block bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
          >
            Commencer →
          </Link>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mt-10">
            <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-100">PDF</span>
            <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-100">EPUB</span>
            <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-100">TXT</span>
            <span className="bg-white/80 px-3 py-1 rounded-full border border-gray-100">DOCX</span>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Comment ça marche
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center relative backdrop-blur-2xl bg-white/[0.03] p-6 rounded-2xl border border-white/[0.08] shadow-lg shadow-black/30">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg shadow-purple-600/20">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Pourquoi EasyReadVoice ?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Tarifs</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Payez uniquement ce que vous écoutez. Pas d'abonnement, pas d'engagement.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-200 hover:shadow-lg ${
                  plan.popular
                    ? 'border-purple-400 bg-white shadow-md ring-2 ring-purple-400/20 scale-[1.02]'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{plan.desc}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-purple-500 mt-0.5 shrink-0">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={`/checkout?plan=easyreadvoice-${plan.id}`}
                  className={`block w-full text-center py-3 px-4 rounded-xl font-bold transition text-sm ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Commander
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            💡 Paiement à l'utilisation. Pas d'abonnement, pas d'engagement.
          </p>
        </div>
      </section>

      {/* Confidentialité & droits d'auteur */}
      <section className="py-16 bg-purple-50/50 border-y border-purple-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Confidentialité &amp; droits d'auteur</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Vos fichiers sont supprimés immédiatement après la génération audio. Aucune copie n'est conservée sur nos serveurs.
          </p>
          <p className="text-gray-600 leading-relaxed mb-2">
            Seuls les documents libres de droit ou dont vous détenez les droits doivent être traités via EasyReadVoice.
          </p>
          <p className="text-sm text-gray-500">
            L'utilisateur est seul responsable des fichiers qu'il téléverse et de leur conformité au droit d'auteur.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map((faq) => (
              <details key={faq.q} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 py-4 text-gray-600 leading-relaxed">{faq.r}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AdBannerBottom />
      <Footer />
    </div>
  )
}
