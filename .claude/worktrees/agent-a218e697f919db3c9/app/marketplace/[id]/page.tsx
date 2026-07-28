'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CheckoutButton from '@/components/CheckoutButton'
import { useCart } from '@/lib/cartContext'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string
  category: string
  active: boolean
}

interface Plan {
  id: string
  label: string
  price: number
  suffix?: string
  desc: string
  features: string[]
  popular?: boolean
}

const qrcallPlans: Plan[] = [
  {
    id: 'qrcall-1',
    label: '1 QR Code',
    price: 4.99,
    desc: 'Idéal pour une vitrine, un pare-brise',
    features: [
      'Valide à vie',
      '3 numéros en cascade',
      'Appel direct + WhatsApp',
      'Suivi en ligne',
      'Modifiable à tout moment',
    ],
  },
  {
    id: 'qrcall-5',
    label: '5 QR Codes',
    price: 12.99,
    desc: 'Pour couvrir plusieurs emplacements',
    popular: true,
    features: [
      'Valide à vie',
      '3 numéros en cascade',
      'Appel direct + WhatsApp',
      'Suivi en ligne',
      'Modifiable à tout moment',
    ],
  },
  {
    id: 'qrcall-10',
    label: '10 QR Codes',
    price: 19.99,
    desc: 'Pack complet pour les pros',
    features: [
      'Valide à vie',
      '3 numéros en cascade',
      'Appel direct + WhatsApp',
      'Suivi en ligne',
      'Modifiable à tout moment',
    ],
  },
  {
    id: 'qrcall-immeuble',
    label: 'QR Immeuble',
    price: 4.99,
    suffix: '/appart/mois',
    desc: 'Un seul QR code pour tout l\'immeuble',
    features: [
      '1 QR unique pour l\'immeuble',
      'Liste des résidents',
      '3 numéros en cascade',
      'Notification à la personne appelée',
      'Appel direct + WhatsApp',
      'Ouverture de porte (bientôt)',
    ],
  },
]

const easyreadPlans: Plan[] = [
  {
    id: 'easyread-5000',
    label: '5 000 caractères',
    price: 1.99,
    desc: 'Pour un article, une lettre ou un petit texte.',
    features: [
      'Jusqu\'à 5 000 caractères',
      'Voix féminine — narratrice naturelle',
      'Détection automatique des dialogues',
      'Téléchargement MP3',
      'Délai : ~1 min',
    ],
  },
  {
    id: 'easyread-25000',
    label: '25 000 caractères',
    price: 4.99,
    desc: 'Pour un dossier, un rapport ou une nouvelle.',
    popular: true,
    features: [
      'Jusqu\'à 25 000 caractères',
      'Voix féminine + 1 voix secondaire',
      'Détection automatique des dialogues',
      'Téléchargement MP3',
      'Délai : ~5 min',
    ],
  },
  {
    id: 'easyread-100000',
    label: '100 000 caractères',
    price: 9.99,
    desc: 'Pour un roman court, un mémoire ou un long document.',
    features: [
      'Jusqu\'à 100 000 caractères',
      'Multi-voix complètes (4-8 voix)',
      'Voix féminines + masculines selon personnages',
      'Détection automatique narrateur/dialogues',
      'Téléchargement MP3',
    ],
  },
  {
    id: 'easyread-500000',
    label: '500 000 caractères',
    price: 19.99,
    desc: 'Pour un roman complet, une thèse ou tout document long.',
    features: [
      'Jusqu\'à 500 000 caractères',
      'Multi-voix complètes (8 voix max)',
      'Voix hommes, femmes adaptées aux personnages',
      'Détection automatique narrateur/dialogues',
      'Téléchargement MP3',
    ],
  },
]

const qrcallFaq = [
  {
    q: 'Faut-il une application pour utiliser QRcall ?',
    r: 'Non, aucune application à installer. Vous scannerez le QR code avec l\'appareil photo de votre smartphone, et l\'appel se lance instantanément.',
  },
  {
    q: 'Puis-je changer les numéros après avoir créé mon QR code ?',
    r: 'Oui ! Chaque QR code est modifiable à tout moment depuis votre espace en ligne. Vous pouvez changer les numéros, ajouter ou retirer des destinations.',
  },
  {
    q: 'Comment fonctionne la cascade d\'appels ?',
    r: 'Si le premier numéro ne répond pas, l\'appel est automatiquement transféré au second, puis au troisième. Utile pour les plombiers, livreurs ou tout professionnel qui se déplace.',
  },
  {
    q: 'QR Immeuble, comment ça marche ?',
    r: 'Un seul QR code est affiché à l\'entrée de l\'immeuble. Le visiteur scanne, choisit un résident dans la liste, et l\'appel est envoyé directement au bon logement. Pas de digicode, pas d\'interphone, pas d\'application.',
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (params.id) fetchProduct()
  }, [params.id])

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) throw new Error('Produit non trouvé')
      const data = await res.json()
      setProduct(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (plan: Plan) => {
    addItem({
      id: `${product?.id}-${plan.id}`,
      title: `${product?.title} — ${plan.label}`,
      price: Math.round(plan.price * 100),
    })
    setAddedToCart(plan.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-950 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Chargement...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-950 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center py-24">
            <p className="text-red-400">{error || 'Produit non trouvé'}</p>
            <Link href="/marketplace" className="inline-block mt-6 text-sky-400 hover:text-sky-300 transition">
              ← Retour aux produits
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const images = (() => {
    try {
      return JSON.parse(product.images || '[]')
    } catch {
      return []
    }
  })()

  const isQRcall = product.title.toLowerCase().includes('qrcall')
  const isEasyRead = product.title.toLowerCase().includes('easyreadvoice')

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">{children}</h2>
  )

  const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12 text-lg">{children}</p>
  )

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <div
      className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-[2rem] p-6 sm:p-8 flex flex-col transition-all duration-300 hover:border-sky-500/40 ${
        plan.popular
          ? 'border-sky-400/50 ring-2 ring-sky-400/20 scale-[1.02] sm:scale-105'
          : 'border-white/10'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-sky-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-sky-500/30">
          Populaire
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{plan.label}</h3>
        <p className="text-slate-400 text-sm mb-4 min-h-[40px]">{plan.desc}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-sky-400">{plan.price.toFixed(2)} €</span>
          {plan.suffix && <span className="text-slate-400 text-sm ml-1">{plan.suffix}</span>}
        </div>
        <ul className="space-y-2.5 mb-8">
          {plan.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => handleAddToCart(plan)}
        data-section="products-buy"
        className={`w-full px-6 py-3.5 rounded-full font-semibold transition-all ${
          addedToCart === plan.id
            ? 'bg-green-500 text-white'
            : plan.popular
              ? 'bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/25'
              : 'border border-white/20 text-slate-300 hover:bg-white/5'
        }`}
      >
        {addedToCart === plan.id ? 'Ajouté ✓' : 'Choisir'}
      </button>
    </div>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 py-12">
        <ParticlesBackground count={15} />
        <div className="max-w-6xl mx-auto px-4">
          {/* Retour */}
          <Link
            href="/marketplace"
            className="inline-flex items-center text-slate-400 hover:text-sky-400 transition mb-8 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux produits
          </Link>

          {/* Carte produit */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl mb-12 animate-fade-in-up">
            {images.length > 0 && (
              <div className="relative w-full h-80 sm:h-96 bg-slate-800">
                <img
                  src={images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>
            )}

            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {product.title}
                </h1>
                <span className="text-3xl sm:text-4xl font-bold text-sky-400">
                  {product.price.toFixed(2)} €
                </span>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Link
                  href="/marketplace"
                  className="flex-1 text-center border border-white/20 text-slate-300 px-8 py-3 rounded-full hover:bg-white/5 transition font-medium"
                >
                  Voir plus
                </Link>
                <CheckoutButton productId={product.id} className="flex-1 text-center" />
              </div>
            </div>
          </div>

          {/* ========== QRcall ========== */}
          {isQRcall && (
            <>
              {/* Hero */}
              <section className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 text-sm font-semibold px-4 py-2 rounded-full border border-sky-500/20 mb-6">
                  QRcall
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
                  Un scan, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">un appel.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Remplacez les cartes de visite, les flyers et les interphones par un QR code.
                  Scan, appel, connexion instantanée.
                </p>
              </section>

              {/* Comment ça marche */}
              <section className="mb-20">
                <SectionTitle>Comment ça marche</SectionTitle>
                <SectionSubtitle>3 étapes pour transformer n'importe quel support en point de contact.</SectionSubtitle>
                <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {[
                    { step: '1', title: 'Créez', desc: 'Créez votre QR code depuis votre espace. Ajoutez jusqu\'à 3 numéros (téléphone, WhatsApp).' },
                    { step: '2', title: 'Scannez', desc: 'Imprimez, collez, affichez. Vos clients scannent avec l\'appareil photo de leur téléphone.' },
                    { step: '3', title: 'Appelez', desc: 'L\'appel se lance automatiquement. Si pas de réponse, le suivant dans la cascade prend le relais.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center">
                      <div className="w-14 h-14 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 border border-sky-500/20">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Forfaits Particulier */}
              <section className="mb-20" id="pricing">
                <SectionTitle>Forfaits Particulier</SectionTitle>
                <SectionSubtitle>Un QR code qui vous ressemble, pour tous vos supports.</SectionSubtitle>
                <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {qrcallPlans.filter(p => !p.id.includes('immeuble')).map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </section>

              {/* QR Immeuble */}
              <section className="mb-20">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sm:p-12 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 text-sm font-semibold px-4 py-2 rounded-full border border-sky-500/20 mb-4">
                      QR Immeuble
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      4,99 €<span className="text-lg text-slate-400 font-normal">/appart/mois</span>
                    </h3>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                      Un seul QR code pour tout l'immeuble. Fini les interphones, les digicodes, les applications.
                    </p>
                  </div>
                  <div className="max-w-lg mx-auto">
                    <ul className="space-y-3 mb-8">
                      {qrcallPlans.find(p => p.id.includes('immeuble'))!.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleAddToCart(qrcallPlans.find(p => p.id.includes('immeuble'))!)}
                      data-section="products-buy"
                      className={`w-full px-6 py-3.5 rounded-full font-semibold transition-all ${
                        addedToCart === 'qrcall-immeuble'
                          ? 'bg-green-500 text-white'
                          : 'bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/25'
                      }`}
                    >
                      {addedToCart === 'qrcall-immeuble' ? 'Ajouté ✓' : 'Choisir QR Immeuble'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Simulateur de prix */}
              <section className="mb-20">
                <SectionTitle>Simulateur de prix</SectionTitle>
                <SectionSubtitle>Exemple de calcul pour un immeuble de 10 appartements.</SectionSubtitle>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sm:p-10 max-w-lg mx-auto">
                  <div className="space-y-4 text-lg">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-slate-400">Abonnement de base</span>
                      <span className="text-white font-semibold">Inclus</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-slate-400">10 appartements × 4,99 €</span>
                      <span className="text-white font-semibold">49,90 €</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-white font-bold text-xl">Total / mois</span>
                      <span className="text-sky-400 font-bold text-2xl">49,90 €</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm text-center mt-6">
                    Pas de surprise. Pas d'engagement. Résiliable à tout moment.
                  </p>
                </div>
              </section>

              {/* FAQ */}
              <section className="mb-12">
                <SectionTitle>FAQ</SectionTitle>
                <SectionSubtitle>Les questions les plus fréquentes sur QRcall.</SectionSubtitle>
                <div className="max-w-3xl mx-auto space-y-4">
                  {qrcallFaq.map((faq, i) => (
                    <details key={i} className="group bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                      <summary className="cursor-pointer px-6 py-5 font-medium text-white hover:bg-white/5 transition flex items-center justify-between">
                        <span>{faq.q}</span>
                        <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.r}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ========== EasyReadVoice ========== */}
          {isEasyRead && (
            <section className="mb-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 text-sm font-semibold px-4 py-2 rounded-full border border-sky-500/20 mb-4">
                  EasyReadVoice
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Forfaits de conversion texte → audio
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Payez uniquement ce que vous écoutez. Pas d'abonnement, pas d'engagement.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {easyreadPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
