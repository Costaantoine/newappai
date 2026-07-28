'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ParticlesBackground'
import { useCart } from '@/lib/cartContext'

interface ProductInfo {
  titleFr: string
  subtitle: string
  longDesc: string
  features: string[]
  options?: string[]
  priceNote: string
  forWho: string
}

const slugMap: Record<string, ProductInfo> = {
  'redesign-site-vitrine': {
    titleFr: 'Redesign de Site Vitrine',
    subtitle: 'Modernisez votre site sans tout refaire',
    longDesc: "Votre site internet a pris un coup de vieux ? Il ne reflète plus l'image moderne et dynamique de votre entreprise ? Notre service de redesign est la solution idéale. Nous conservons vos contenus et votre référencement tout en transformant radicalement l'apparence, l'ergonomie et les performances de votre site.\n\nNotre processus commence par un audit complet de votre site actuel : design, vitesse de chargement, expérience utilisateur mobile, accessibilité. Nous identifions ce qui fonctionne et ce qui doit évoluer. Ensuite, nous concevons une nouvelle maquette avec un design contemporain, des animations subtiles et une navigation fluide.\n\nLe résultat ? Un site plus rapide, plus beau, mieux référencé, qui donne une image professionnelle et attire plus de clients. Et tout ça sans perdre vos précieux contenus ni votre positionnement dans Google.",
    features: [
      'Audit design complet : analyse de votre site actuel (vitesse, UX, mobile, accessibilité)',
      'Refonte graphique sur mesure avec design moderne et animations',
      'Optimisation mobile (responsive) et des performances (vitesse de chargement)',
      'Amélioration du référencement naturel (SEO) : balises, structure, meta-données',
      'Conservation de tous vos contenus existants et de votre référencement',
      'Intégration de nouvelles sections et fonctionnalités si besoin',
      'Tests cross-navigateurs et corrections',
      'Mise en ligne et formation à l\'administration',
    ],
    options: [
      'Chatbot client intelligent adapté à vos clients (réponses automatiques, prise de rendez-vous)',
      'Système de réservation de tables en ligne (pour restaurants, hôtels, services)',
    ],
    priceNote: 'Le prix de base inclut le redesign complet. Les options (chatbot, réservations) sont facturées en supplément : 299€ l\'option, 499€ les deux.',
    forWho: 'Idéal pour les TPE, PME, artisans, commerçants, restaurateurs et professions libérales qui ont déjà un site mais souhaitent le moderniser sans repartir de zéro.',
  },
  'creation-site-vitrine': {
    titleFr: 'Création de Site Vitrine clé en main',
    subtitle: 'Un site professionnel de A à Z, sans complication',
    longDesc: "Vous n'avez pas encore de site internet ou le vôtre est irrécupérable ? Notre formule clé en main est faite pour vous. Pas de connaissances techniques requises, pas de gestion复杂的. Nous nous occupons de tout, de la conception à la mise en ligne.\n\nTout commence par notre questionnaire stratégique de 20 questions. Nous voulons comprendre votre activité, vos valeurs, vos clients cibles, vos concurrents et vos objectifs. Ces réponses sont la fondation de votre futur site. Nous concevons ensuite des maquettes que vous validez avant le développement.\n\nNous construisons votre site avec les meilleures technologies pour garantir rapidité, sécurité et évolutivité. Vous recevez un site vitrine complet, moderne, responsive (adapté mobile/tablette), avec des textes optimisés pour le référencement. Le nom de domaine et l'hébergement sont inclus la première année.",
    features: [
      'Questionnaire stratégique détaillé (20 questions pour cerner votre activité)',
      'Maquettes sur mesure et validation avant développement',
      'Site responsive (mobile, tablette, desktop) avec design moderne et animations',
      'Rédaction des contenus assistée par IA et optimisée SEO',
      'Pages : Accueil, Présentation, Services/Produits, Contact, Galerie (selon besoins)',
      'Formulaire de contact avec envoi d\'email intégré',
      'Installation et configuration du nom de domaine (1 an offert)',
      'Mise en ligne et formation à la gestion du site',
    ],
    options: [
      'Chatbot client intelligent adapté à vos clients (299€)',
      'Système de réservation de tables en ligne (299€)',
    ],
    priceNote: 'Le prix de base inclut un site complet jusqu\'à 5 pages. Pages supplémentaires : 150€/page. Options chatbot et réservation : 299€ chacune.',
    forWho: 'Parfait pour les entrepreneurs, auto-entrepreneurs, associations, artisans et commerçants qui démarrent et veulent un site professionnel sans se prendre la tête avec la technique.',
  },
  'chatbot-client-intelligent': {
    titleFr: 'Chatbot Client Intelligent',
    subtitle: 'Un assistant virtuel pour vos clients, disponible 24h/24',
    longDesc: "Offrez à vos clients un assistant virtuel intelligent qui répond à leurs questions, prend des rendez-vous et les oriente vers les bons services, même quand vous dormez. Notre chatbot s'adapte parfaitement à votre activité, que vous soyez restaurateur, commerçant, artisan ou professionnel libéral.\n\nConcrètement, votre client arrive sur votre site ou votre page Facebook. Il pose une question naturelle : « Est-ce que vous livrez le dimanche ? » ou « Je voudrais réserver une table pour 4 personnes ce soir ». Le chatbot comprend la question, y répond instantanément avec les informations de votre établissement, ou propose de réserver directement.\n\nLa force de notre solution, c'est qu'elle apprend de chaque conversation. Plus vos clients interagissent, plus le chatbot devient précis et pertinent. Et vous gardez la main grâce à un dashboard simple qui vous montre les questions fréquentes, les réservations prises et les conversations en cours.",
    features: [
      'Compréhension du langage naturel : le chatbot comprend les questions de vos clients, pas besoin de mots-clés',
      'Réponses automatiques personnalisées selon votre activité et vos horaires',
      'Prise de rendez-vous et réservations intégrée (restaurant, hôtel, salon, cabinet)',
      'Multilingue natif : français, anglais, portugais, espagnol',
      'Intégration facile sur votre site existant (simple copier-coller)',
      'Dashboard de suivi : historique des conversations, statistiques, questions fréquentes',
      'Apprentissage continu : le chatbot s\'améliore avec chaque échange',
      'Options : transfert vers un humain si le chatbot ne peut pas répondre',
    ],
    priceNote: 'Installation et configuration incluses. Hébergement et maintenance : 29€/mois. Engagement 12 mois recommandé pour un apprentissage optimal.',
    forWho: 'Tous les commerces de proximité, restaurants, hôtels, salons de coiffure, cabinets médicaux et toute entreprise qui reçoit des demandes clients répétitives par téléphone ou email.',
  },
  'click-and-delivery': {
    titleFr: 'Click and Delivery',
    subtitle: 'Votre plateforme de livraison locale clé en main',
    longDesc: "Vous êtes livreur indépendant et vous voulez créer votre propre réseau de commerçants partenaires ? Ou vous êtes commerçant et vous souhaitez proposer la livraison à domicile sans gérer de flotte ? Click and Delivery est la solution qui connecte l'offre et la demande de livraison locale.\n\nPour le livreur : créez votre réseau de commerçants partenaires dans votre zone de livraison. Gérez vos tournées, recevez les commandes en temps réel, optimisez vos itinéraires. Deux formules de prix selon votre niveau d'activité : une formule de démarrage à 1499€ et une formule pro à 2499€ avec plus de fonctionnalités.\n\nPour le commerçant : proposez la livraison à domicile à vos clients sans gérer de livreurs. Les commandes arrivent, un livreur de votre secteur les prend en charge, le client est livré. Vous payez une commission par livraison, rien d'autre. Simple, efficace, sans prise de tête.\n\nInspiré de modèles comme Pedir Sem Sair, notre plateforme est entièrement personnalisable à votre image et à votre secteur géographique.",
    features: [
      'Application livreur avec géolocalisation et optimisation d\'itinéraire',
      'Interface commerçant pour gérer les commandes et le catalogue',
      'Paiement en ligne sécurisé intégré (Stripe)',
      'Notifications push en temps réel (nouvelle commande, livraison acceptée)',
      'Gestion des zones de livraison et des créneaux horaires',
      'Historique des commandes, statistiques et rapports',
      'Support technique prioritaire et formation incluse',
    ],
    options: [
      'Pack Livreur (1499€) : application livreur + mise en relation avec jusqu\'à 10 commerçants',
      'Pack Commerçant + Livreurs (2499€) : application livreur + interface commerçant + gestion de flotte illimitée',
    ],
    priceNote: 'Deux formules : 1499€ (livreur autonome, démarrage) ou 2499€ (package complet commerçant + livreurs). Maintenance mensuelle : 19€/mois après la première année.',
    forWho: 'Livreurs indépendants qui veulent créer leur activité de livraison, restaurants et commerces de proximité qui veulent proposer la livraison sans gérer de livreurs, et zones rurales où les grandes plateformes ne livrent pas.',
  },
  'talkie-walkie-connecte': {
    titleFr: 'Talkie Walkie Connecté',
    subtitle: 'Communication instantanée entre le bureau et l\'atelier',
    longDesc: "Fini les allers-retours entre le bureau et l'usine, les appels qui ne passent pas, les messages WhatsApp perdus dans le fil. Notre talkie-walkie nouvelle génération révolutionne la communication dans vos locaux professionnels. Un bouton, vous parlez, tout le monde entend. Simple, rapide, efficace.\n\nContrairement aux talkies-walkies traditionnels qui ont une portée limitée et un son de mauvaise qualité, notre solution utilise le réseau WiFi ou 4G de votre entreprise. La portée est illimitée dans vos locaux, la qualité audio est cristalline, et chaque message est automatiquement transcrit en texte et archivé.\n\nVous pouvez créer des groupes par équipe (production, logistique, maintenance, administration), envoyer des messages urgents avec notification prioritaire, et même passer en mode silencieux où seuls les textes s'affichent. L'historique consultable permet de retrouver une information importante sans fouiller dans des fils de discussion interminables.",
    features: [
      'Communication vocale instantanée en un clic (push-to-talk), latence < 500ms',
      'Transcription automatique de chaque message vocal en texte',
      'Création de groupes par équipe, service ou projet (production, logistique, admin)',
      'Notifications prioritaires pour les messages urgents',
      'Mode silencieux : réception des messages en texte uniquement (idéal en réunion)',
      'Historique complet des conversations consultable et exportable',
      'Application disponible sur smartphone, tablette et desktop (Windows/Mac)',
      'Chiffrement de bout en bout des communications',
    ],
    priceNote: 'Licence annuelle par utilisateur : 49€/utilisateur/an. Déploiement sur site (on-premise) ou cloud. 15 utilisateurs minimum. Formation des équipes incluse.',
    forWho: 'Entreprises industrielles, PME manufacturières, entrepôts logistiques, chantiers de construction, hôtels, restaurants et tous les environnements où l\'équipe est répartie dans différents espaces et a besoin de communiquer rapidement.',
  },
  'serenite': {
    titleFr: 'Sérénité',
    subtitle: 'Communication apaisée pour parents séparés',
    longDesc: "La séparation est déjà assez difficile. La communication avec l'autre parent ne devrait pas l'être autant. Sérénité est une application conçue spécifiquement pour aider les couples séparés ou divorcés à communiquer de manière apaisée et constructive.\n\nLe principe fondateur : chaque message est filtré et peut être relu calmement avant d'être envoyé. L'application détecte les échanges impulsifs ou déplacés et propose de reformuler avant l'envoi. L'objectif n'est pas de censurer mais de permettre des échanges respectueux, surtout quand des enfants sont concernés.\n\nAu-delà de la messagerie, Sérénité intègre un calendrier partagé pour la garde des enfants, un outil de suivi des dépenses partagées (école, santé, activités), et la possibilité d'exporter l'historique des échanges pour votre médiateur ou avocat si nécessaire. Tout est conçu pour apaiser, simplifier et protéger.",
    features: [
      'Messagerie apaisée avec détection des échanges impulsifs et suggestion de reformulation',
      'Calendrier partagé pour la garde des enfants avec rappels automatiques',
      'Gestion des dépenses partagées : saisie, validation, suivi des remboursements',
      'Espace neutre et bienveillant, sans jugement, sans pression',
      'Notifications discrètes et paramétrables',
      'Journal de bord consultable pour le suivi des échanges',
      'Export des échanges et du journal pour médiation ou avocat',
      'Confidentialité absolue, chiffrement de bout en bout',
    ],
    priceNote: 'Abonnement : 9,99€/mois par couple ou 99€/an. Accès sur serenite.newappai.com. Application mobile native disponible. Période d\'essai gratuite de 14 jours.',
    forWho: 'Parents séparés ou divorcés qui souhaitent maintenir une communication saine pour le bien-être de leurs enfants. Recommandé par des médiateurs familiaux et avocats spécialisés en droit de la famille.',
  },
  'paperasse': {
    titleFr: 'Paperasse - Services IA',
    subtitle: 'Automatisez votre comptabilité, fiscalité et administration',
    longDesc: "Paperasse est votre assistant administratif intelligent. Notre suite d'agents IA spécialisés prend en charge les tâches répétitives et complexes de votre entreprise : comptabilité, contrôle fiscal, audit, déclarations, gestion de copropriété et bien plus.\n\nFini les heures passées sur la compta, les relevés bancaires à classer, les déclarations fiscales à préparer. Nos agents IA travaillent pour vous 24h/24, avec une précision et une rapidité inégalées.\n\nChaque agent est spécialisé dans un domaine : l'agent comptable suit vos comptes au quotidien, le contrôleur fiscal vérifie la conformité de vos déclarations, le commissaire aux comptes audite vos comptes annuels, le fiscaliste optimise votre fiscalité, le notaire automatise les actes courants, et le syndic gère votre copropriété. Une solution complète pour libérer du temps et vous concentrer sur votre cœur de métier.",
    features: [
      'Agent Comptable : saisie automatique, lettrage, rapprochement bancaire, balance, bilan',
      'Agent Contrôle Fiscal : vérification de conformité, détection des anomalies, alertes',
      'Agent Commissaire aux Comptes : audit des comptes, certification, rapport de gestion',
      'Agent Fiscaliste : optimisation fiscale, déclarations, suivi des échéances',
      'Agent Notaire : automatisation des actes courants, gestion des dossiers',
      'Agent Syndic : gestion de copropriété, appels de fonds, suivi des travaux',
      'Dashboard centralisé avec vue d\'ensemble de votre situation administrative',
      'Export des rapports et documents au format PDF/Excel',
    ],
    priceNote: 'Abonnement mensuel par agent : à partir de 29€/mois/agent forfait découverte. Forfait entreprise (tous les agents) : 149€/mois. Personnalisation et intégration sur devis.',
    forWho: 'TPE, PME, experts-comptables, cabinets de gestion, syndics de copropriété, et toute entreprise qui veut automatiser sa gestion administrative et comptable.',
  },
  'gestion-production': {
    titleFr: 'Application de Gestion de Production',
    subtitle: 'Pilotez votre production en temps réel',
    longDesc: "Optimisez votre chaîne de production avec notre application de gestion complète. Suivez vos stocks, planifiez vos ordres de fabrication, gérez vos achats et suivez votre productivité en temps réel. Notre solution s'adapte à votre secteur : industrie manufacturière, agroalimentaire, assemblage, conditionnement.\n\nLe module de planification vous permet de créer des ordres de fabrication à partir des commandes clients ou des prévisions de vente. Chaque ordre est suivi étape par étape : lancement, encours, contrôle qualité, fin de production. Les opérateurs sur le terrain valident les étapes depuis une tablette ou un smartphone.\n\nLes stocks sont mis à jour automatiquement à chaque mouvement : entrée de matières premières, consommation en production, sortie de produits finis. Les alertes de seuil minimum vous évitent les ruptures. Et le tableau de bord de production vous donne en un coup d'œil la performance de votre atelier : taux de rendement, taux de rebut, productivité par opérateur.",
    features: [
      'Planification des ordres de fabrication (OF) avec échéancier',
      'Suivi de production en temps réel : lancement, encours, fin',
      'Gestion des stocks multi-dépôts avec alertes de seuil',
      'Contrôle qualité intégré : points de contrôle, non-conformités, actions correctives',
      'Tableau de bord production : TRS, taux de rebut, productivité',
      'Gestion des achats et des approvisionnements',
      'Interface opérateur simplifiée sur tablette/écran tactile',
      'Export des rapports de production vers Excel/PDF',
    ],
    priceNote: 'À partir de 999€ (licence de base 5 utilisateurs). Par utilisateur supplémentaire : 150€. Hébergement cloud inclus. Formation sur site : 800€/jour.',
    forWho: 'PME industrielles, ateliers de fabrication, entreprises agroalimentaires, sous-traitants, et toute structure qui doit suivre et optimiser sa production au quotidien.',
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string || ''
  const info = slugMap[slug]
  const { addItem, items } = useCart()
  const inCart = items.find(item => item.id?.startsWith(slug))

  const handleAddToCart = () => {
    if (!info) return
    const prices: Record<string, number> = {
      'redesign-site-vitrine': 79900,
      'creation-site-vitrine': 149900,
      'chatbot-client-intelligent': 29900,
      'click-and-delivery': 149900,
      'talkie-walkie-connecte': 249900,
      'serenite': 199900,
      'paperasse': 0,
      'gestion-production': 99900,
    }
    addItem({
      id: 'slug-' + slug,
      title: info.titleFr,
      price: prices[slug] || 99900,
    })
  }

  if (!info) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-transparent pt-32 pb-20 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-6">
            <h1 className="text-3xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-slate-400 mb-6">Le produit que vous recherchez n'existe pas ou a été déplacé.</p>
            <Link href="/produits" className="text-violet-400 hover:text-violet-300">Retour aux produits</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent pt-32 pb-20">
        <ParticlesBackground count={15} />
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/produits" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">
            &larr; Retour aux produits
          </Link>

          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{info.titleFr}</h1>
            <p className="text-xl text-violet-400 font-medium">{info.subtitle}</p>
          </div>

          <div className="text-slate-300 text-lg leading-relaxed mb-12 whitespace-pre-line">
            {info.longDesc}
          </div>

          {/* À qui ça s'adresse */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              À qui ça s'adresse
            </h2>
            <p className="text-slate-300">{info.forWho}</p>
          </div>

          {/* Fonctionnalités */}
          {info.features && info.features.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">Fonctionnalités</h2>
              <div className="grid gap-3">
                {info.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300 bg-white/5 p-4 rounded-xl">
                    <svg className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {info.options && info.options.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">Options disponibles</h2>
              <div className="grid gap-3">
                {info.options.map((o, i) => (
                  <div key={i} className="flex items-start gap-3 text-amber-300 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prix */}
          {info.priceNote && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-2">Informations tarifs</h2>
              <p className="text-slate-300">{info.priceNote}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button onClick={handleAddToCart}
              className={'px-8 py-4 rounded-full font-bold transition ' + (inCart ? 'bg-green-500 text-white' : 'bg-violet-500 text-white hover:bg-violet-400')}>
              {inCart ? 'Ajouter au panier (+1)' : 'Ajouter au panier'}
            </button>
            <Link href="/contact" className="px-8 py-4 border border-violet-500/30 text-violet-400 rounded-full font-bold hover:bg-violet-500/10 transition">
              Demander un devis
            </Link>
            <Link href="/produits" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
