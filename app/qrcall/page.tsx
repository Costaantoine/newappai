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
    id: 'individual-1',
    kind: 'individual',
    name: { fr: '1 QR Code', en: '1 QR Code', pt: '1 Código QR', es: '1 Código QR' },
    price: 4.99,
    priceLabel: { fr: '4.99 €', en: '€4.99', pt: '4.99 €', es: '4.99 €' },
    desc: { fr: 'Idéal pour une vitrine, un pare-brise ou une sonnette.', en: 'Perfect for a storefront, windshield, or doorbell.', pt: 'Ideal para montra, pára-brisas ou campainha.', es: 'Ideal para escaparate, parabrisas o timbre.' },
    features: [
      { fr: '1 QR code personnalisé', en: '1 customized QR code', pt: '1 código QR personalizado', es: '1 código QR personalizado' },
      { fr: 'Jusqu\'à 3 numéros en cascade', en: 'Up to 3 cascading numbers', pt: 'Até 3 números em cascata', es: 'Hasta 3 números en cascada' },
      { fr: 'Appel direct (tel:) + WhatsApp', en: 'Direct call (tel:) + WhatsApp', pt: 'Chamada direta (tel:) + WhatsApp', es: 'Llamada directa (tel:) + WhatsApp' },
      { fr: 'PWA — rien à installer pour le visiteur', en: 'PWA — nothing to install for the visitor', pt: 'PWA — nada para instalar para o visitante', es: 'PWA — nada que instalar para el visitante' },
      { fr: 'Téléchargement PNG haute qualité', en: 'High-quality PNG download', pt: 'Download PNG de alta qualidade', es: 'Descarga PNG de alta calidad' },
    ],
    popular: false,
  },
  {
    id: 'individual-5',
    kind: 'individual',
    name: { fr: '5 QR Codes', en: '5 QR Codes', pt: '5 Códigos QR', es: '5 Códigos QR' },
    price: 12.99,
    priceLabel: { fr: '12.99 €', en: '€12.99', pt: '12.99 €', es: '12.99 €' },
    desc: { fr: 'Pour couvrir plusieurs emplacements ou véhicules.', en: 'Cover multiple locations or vehicles.', pt: 'Para cobrir vários locais ou veículos.', es: 'Para cubrir varios lugares o vehículos.' },
    features: [
      { fr: '5 QR codes personnalisés', en: '5 customized QR codes', pt: '5 códigos QR personalizados', es: '5 códigos QR personalizados' },
      { fr: 'Jusqu\'à 3 numéros en cascade chacun', en: 'Up to 3 cascading numbers each', pt: 'Até 3 números em cascata cada', es: 'Hasta 3 números en cascada cada uno' },
      { fr: 'Appel direct (tel:) + WhatsApp', en: 'Direct call (tel:) + WhatsApp', pt: 'Chamada direta (tel:) + WhatsApp', es: 'Llamada directa (tel:) + WhatsApp' },
      { fr: 'PWA — rien à installer', en: 'PWA — nothing to install', pt: 'PWA — nada para instalar', es: 'PWA — nada que instalar' },
      { fr: 'Téléchargement PNG haute qualité', en: 'High-quality PNG download', pt: 'Download PNG de alta qualidade', es: 'Descarga PNG de alta calidad' },
    ],
    popular: true,
  },
  {
    id: 'individual-10',
    kind: 'individual',
    name: { fr: '10 QR Codes', en: '10 QR Codes', pt: '10 Códigos QR', es: '10 Códigos QR' },
    price: 19.99,
    priceLabel: { fr: '19.99 €', en: '€19.99', pt: '19.99 €', es: '19.99 €' },
    desc: { fr: 'Le pack complet pour les pros et les flottes.', en: 'The complete pack for pros and fleets.', pt: 'O pacote completo para profissionais e frotas.', es: 'El paquete completo para profesionales y flotas.' },
    features: [
      { fr: '10 QR codes personnalisés', en: '10 customized QR codes', pt: '10 códigos QR personalizados', es: '10 códigos QR personalizados' },
      { fr: 'Jusqu\'à 3 numéros en cascade chacun', en: 'Up to 3 cascading numbers each', pt: 'Até 3 números em cascata cada', es: 'Hasta 3 números en cascada cada uno' },
      { fr: 'Appel direct (tel:) + WhatsApp', en: 'Direct call (tel:) + WhatsApp', pt: 'Chamada direta (tel:) + WhatsApp', es: 'Llamada directa (tel:) + WhatsApp' },
      { fr: 'PWA — rien à installer', en: 'PWA — nothing to install', pt: 'PWA — nada para instalar', es: 'PWA — nada que instalar' },
      { fr: 'Téléchargement PNG haute qualité', en: 'High-quality PNG download', pt: 'Download PNG de alta qualidade', es: 'Descarga PNG de alta calidad' },
    ],
    popular: false,
  },
]

const BUILDING_PLAN = {
  id: 'building',
  kind: 'building',
  name: { fr: 'QRcall Immeuble', en: 'QRcall Building', pt: 'QRcall Edifício', es: 'QRcall Edificio' },
  desc: { fr: 'Un seul QR code pour tout l\'immeuble. Le visiteur scanne, choisit le résident, et l\'appelle.', en: 'One QR code for the whole building. Visitors scan, pick a resident, and call.', pt: 'Um único código QR para todo o edifício. O visitante digitaliza, escolhe o residente e liga.', es: 'Un solo código QR para todo el edificio. El visitante escanea, elige al residente y llama.' },
  pricePerApt: 4.99,
  priceLabel: { fr: '4.99 €/appart/mois', en: '€4.99/apartment/month', pt: '4.99 €/apto/mês', es: '4.99 €/apto/mes' },
  features: [
    { fr: '1 QR code unique pour l\'immeuble', en: '1 unique QR code for the building', pt: '1 código QR único para o edifício', es: '1 código QR único para el edificio' },
    { fr: 'Liste des résidents avec appel direct', en: 'Resident list with direct call', pt: 'Lista de residentes com chamada direta', es: 'Lista de residentes con llamada directa' },
    { fr: 'Chaque résident peut avoir 3 numéros', en: 'Each resident can have 3 numbers', pt: 'Cada residente pode ter 3 números', es: 'Cada residente puede tener 3 números' },
    { fr: 'Notification d\'appel entrant', en: 'Incoming call notification', pt: 'Notificação de chamada recebida', es: 'Notificación de llamada entrante' },
    { fr: 'Appel vocal + WhatsApp', en: 'Voice call + WhatsApp', pt: 'Chamada de voz + WhatsApp', es: 'Llamada de voz + WhatsApp' },
    { fr: 'Option ouverture de porte à distance (bientôt)', en: 'Remote door opening option (coming soon)', pt: 'Opção de abertura de porta remota (em breve)', es: 'Opción de apertura de puerta remota (próximamente)' },
    { fr: 'Abonnement mensuel par appartement', en: 'Monthly subscription per apartment', pt: 'Assinatura mensal por apartamento', es: 'Suscripción mensual por apartamento' },
  ],
}

export default function QRcallPage() {
  const { lang } = useLanguage()
  const [texts, setTexts] = useState<TextItem[]>([])
  
  useEffect(() => {
    fetch('/api/supabase/texts')
      .then(r => r.json())
      .then(d => setTexts(Array.isArray(d.texts) ? d.texts : []))
      .catch(() => {})
  }, [])

  const t = (key: string, fallback: string) => getText(texts, key, lang, fallback)
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent overflow-x-hidden">
        
        {/* HERO */}
        <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
          <div className="absolute top-10 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
          <div className="max-w-4xl mx-auto">
            <div data-section="qrcall-badge" className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-violet-400 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QRcall
            </div>
            <h1 data-section="qrcall-hero-title" className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white">
              Un scan, <span className="neon-text">un appel.</span>
            </h1>
            <p data-section="qrcall-hero-subtitle" className="text-slate-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Créez votre QR code en 30 secondes. Vos visiteurs le scannent et vous appellent directement 
              — jusqu&apos;à 3 numéros en cascade, sans rien installer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a data-section="qrcall-cta-1" href="https://qrcall.newappai.com" className="bg-violet-500 text-white px-8 py-4 rounded-full font-bold hover:bg-violet-400 transition shadow-lg shadow-violet-500/20">
                Créer mon QR code
              </a>
              <a data-section="qrcall-cta-2" href="#building" className="backdrop-blur-md bg-white/5 text-white px-8 py-4 rounded-full font-bold border border-white/10 hover:bg-white/10 transition">
                QR Immeuble
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 data-section="qrcall-how-title" className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">
            Comment ça <span className="neon-text">marche</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: { fr: 'Créez', en: 'Create', pt: 'Crie', es: 'Cree' }, desc: { fr: 'Entrez votre numéro ou les numéros de vos résidents. Générez votre QR code en un clic.', en: 'Enter your number or your residents\' numbers. Generate your QR code in one click.', pt: 'Insira o seu número ou os números dos seus residentes. Gere o seu código QR com um clique.', es: 'Ingrese su número o los números de sus residentes. Genere su código QR con un clic.' } },
              { step: '2', title: { fr: 'Scannez', en: 'Scan', pt: 'Digitalize', es: 'Escanee' }, desc: { fr: 'Imprimez et apposez le QR. Le visiteur le scanne avec son appareil photo.', en: 'Print and place the QR. Visitors scan it with their camera.', pt: 'Imprima e coloque o QR. O visitante digitaliza com a câmara.', es: 'Imprima y coloque el QR. El visitante lo escanea con su cámara.' } },
              { step: '3', title: { fr: 'Appelez', en: 'Call', pt: 'Ligue', es: 'Llame' }, desc: { fr: 'Le visiteur arrive sur une page PWA et appelle directement (tel: ou WhatsApp).', en: 'The visitor lands on a PWA page and calls directly (tel: or WhatsApp).', pt: 'O visitante chega a uma página PWA e liga diretamente (tel: ou WhatsApp).', es: 'El visitante llega a una página PWA y llama directamente (tel: o WhatsApp).' } },
            ].map((item, i) => (
              <div key={i} className="backdrop-blur-md bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title[lang as keyof typeof item.title] || item.title.fr}</h3>
                <p className="text-slate-400">{item.desc[lang as keyof typeof item.desc] || item.desc.fr}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INDIVIDUAL PLANS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 data-section="qrcall-plans-title" className="text-3xl md:text-5xl font-bold text-center mb-4 text-white">
            Forfaits <span className="neon-text">Particulier</span>
          </h2>
          <p data-section="qrcall-plans-subtitle" className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Chaque QR code peut sonner jusqu&apos;à 3 numéros en cascade, dans l&apos;ordre de priorité que vous définissez. 
            Appel direct ou WhatsApp.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`backdrop-blur-md p-8 rounded-[2rem] border flex flex-col ${
                  plan.popular
                    ? 'bg-violet-500/5 border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.15)] scale-[1.02]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <span data-section="qrcall-popular" className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full w-fit mb-4">
                    Populaire
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-1">
                  {plan.name[lang as keyof typeof plan.name] || plan.name.fr}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{plan.desc[lang as keyof typeof plan.desc] || plan.desc.fr}</p>
                <div className="text-4xl font-bold text-violet-400 mb-6">
                  {plan.priceLabel[lang as keyof typeof plan.priceLabel] || plan.priceLabel.fr}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat[lang as keyof typeof feat] || feat.fr}
                    </li>
                  ))}
                </ul>
                <a data-section="qrcall-choose"
                  href="https://qrcall.newappai.com"
                  className={`w-full text-center py-3 rounded-full font-bold transition ${
                    plan.popular
                      ? 'bg-violet-500 text-white hover:bg-violet-400 shadow-lg shadow-violet-500/20'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  Choisir
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* BUILDING PLAN */}
        <section id="building" className="max-w-4xl mx-auto px-6 py-20">
          <div className="backdrop-blur-md bg-white/5 p-10 md:p-16 rounded-[2.5rem] border border-purple-500/30 shadow-[0_0_30px_rgba(129,140,248,0.1)]">
            <div className="text-center mb-10">
              <div data-section="qrcall-building-badge" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                Nouveau
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {BUILDING_PLAN.name[lang as keyof typeof BUILDING_PLAN.name] || BUILDING_PLAN.name.fr}
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                {BUILDING_PLAN.desc[lang as keyof typeof BUILDING_PLAN.desc] || BUILDING_PLAN.desc.fr}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {BUILDING_PLAN.priceLabel[lang as keyof typeof BUILDING_PLAN.priceLabel] || BUILDING_PLAN.priceLabel.fr}
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Abonnement mensuel. Prix dégressif selon le nombre d&apos;appartements.
                </p>
                <ul className="space-y-3">
                  {BUILDING_PLAN.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat[lang as keyof typeof feat] || feat.fr}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-4">Simulateur de prix</h4>
                <p className="text-slate-400 text-sm mb-4">
                  Exemple pour 10 appartements :
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Abonnement de base</span>
                    <span className="text-white font-medium">Inclus</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>10 appartements × 4.99€</span>
                    <span className="text-white font-medium">49.90 €/mois</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-purple-400">49.90 €/mois</span>
                  </div>
                </div>
                <a
                  href="https://qrcall.newappai.com"
                  className="mt-6 w-full block text-center bg-purple-500 text-white py-3 rounded-full font-bold hover:bg-purple-400 transition shadow-lg shadow-purple-500/20"
                >
                  Créer mon QR Immeuble
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / INFO */}
        <section className="max-w-4xl mx-auto px-6 pb-32">
          <h2 data-section="qrcall-faq-title" className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Questions <span className="neon-text">fréquentes</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: { fr: 'Le visiteur doit-il installer une application ?', en: 'Does the visitor need to install an app?', pt: 'O visitante precisa instalar uma aplicação?', es: '¿El visitante necesita instalar una aplicación?' },
                r: { fr: 'Non. Le QR ouvre une page web (PWA) directement dans le navigateur. Le visiteur clique sur "Appeler" et ça lance l\'appel natif ou WhatsApp.', en: 'No. The QR opens a web page (PWA) directly in the browser. The visitor clicks "Call" and it launches the native dialer or WhatsApp.', pt: 'Não. O QR abre uma página web (PWA) diretamente no navegador. O visitante clica em "Ligar" e inicia a chamada nativa ou WhatsApp.', es: 'No. El QR abre una página web (PWA) directamente en el navegador. El visitante hace clic en "Llamar" y se inicia la llamada nativa o WhatsApp.' },
              },
              {
                q: { fr: 'Puis-je changer mes numéros après avoir créé le QR ?', en: 'Can I change my numbers after creating the QR?', pt: 'Posso alterar os meus números depois de criar o QR?', es: '¿Puedo cambiar mis números después de crear el QR?' },
                r: { fr: 'Oui. Connectez-vous à votre espace QRcall pour modifier les numéros associés à chaque QR code. Le QR déjà imprimé reste valide.', en: 'Yes. Log in to your QRcall dashboard to modify the numbers for each QR code. Already-printed QRs stay valid.', pt: 'Sim. Aceda ao seu espaço QRcall para modificar os números associados a cada código QR. O QR já impresso permanece válido.', es: 'Sí. Inicie sesión en su espacio QRcall para modificar los números asociados a cada código QR. El QR ya impreso sigue siendo válido.' },
              },
              {
                q: { fr: 'Comment fonctionne la cascade d\'appels ?', en: 'How does call cascading work?', pt: 'Como funciona a cascata de chamadas?', es: '¿Cómo funciona la cascada de llamadas?' },
                r: { fr: 'Vous définissez l\'ordre de priorité de vos numéros (1, 2, 3). Le visiteur appelle d\'abord le n°1. Si pas de réponse, il peut essayer le n°2, puis le n°3. Chaque numéro peut être appelé via téléphone ou WhatsApp.', en: 'You set the priority order of your numbers (1, 2, 3). The visitor first calls #1. If no answer, they can try #2, then #3. Each number can be called via phone or WhatsApp.', pt: 'Você define a ordem de prioridade dos seus números (1, 2, 3). O visitante liga primeiro para o nº1. Se não atender, pode tentar o nº2 e depois o nº3. Cada número pode ser chamado por telefone ou WhatsApp.', es: 'Usted define el orden de prioridad de sus números (1, 2, 3). El visitante llama primero al n.º 1. Si no contesta, puede probar el n.º 2 y luego el n.º 3. Cada número se puede llamar por teléfono o WhatsApp.' },
              },
              {
                q: { fr: 'QRcall Immeuble : comment le résident reçoit les appels ?', en: 'QRcall Building: how does the resident receive calls?', pt: 'QRcall Edifício: como é que o residente recebe as chamadas?', es: 'QRcall Edificio: ¿cómo recibe el residente las llamadas?' },
                r: { fr: 'Le résident reçoit un appel direct sur son téléphone (le visiteur clique sur "Appeler"). Une notification peut également être envoyée si l\'option est activée. Chaque résident peut gérer ses numéros depuis son espace.', en: 'The resident receives a direct call on their phone (the visitor clicks "Call"). A notification can also be sent if the option is enabled. Each resident can manage their numbers from their dashboard.', pt: 'O residente recebe uma chamada direta no seu telefone (o visitante clica em "Ligar"). Uma notificação também pode ser enviada se a opção estiver ativada. Cada residente pode gerir os seus números a partir do seu espaço.', es: 'El residente recibe una llamada directa en su teléfono (el visitante hace clic en "Llamar"). También se puede enviar una notificación si la opción está activada. Cada residente puede gestionar sus números desde su espacio.' },
              },
            ].map((faq, i) => (
              <details key={i} className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 group">
                <summary className="text-white font-semibold cursor-pointer flex items-center justify-between list-none">
                  <span>{faq.q[lang as keyof typeof faq.q] || faq.q.fr}</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                  {faq.r[lang as keyof typeof faq.r] || faq.r.fr}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
