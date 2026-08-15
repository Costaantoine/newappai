import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Wizard from '@/components/webdesign/Wizard'

export const metadata = {
  title: 'Web Design 199€ — Créez votre site vitrine en 5 minutes',
  description:
    'Générateur de site vitrine one-page self-service : questionnaire guidé, aperçu live desktop & mobile, paiement unique de 199€ TTC. Hébergement et mise en ligne inclus.',
}

export default function WebdesignPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent overflow-x-hidden">
        {/* HERO */}
        <section className="relative pt-32 md:pt-40 pb-16 px-6 flex flex-col items-center text-center">
          <div className="absolute top-10 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full -z-10"></div>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-violet-400 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Web Design
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              Votre site vitrine,
              <span className="text-violet-400"> en 199€.</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Remplissez le questionnaire guidé, personnalisez couleurs et polices, et obtenez un
              site one-page à votre image — avec aperçu en temps réel avant paiement.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#createur"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-8 py-4 text-base font-bold text-white transition hover:bg-violet-400 shadow-lg shadow-violet-500/25"
              >
                Créer mon site maintenant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#createur"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-700 px-8 py-4 text-base font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
              >
                Voir un exemple de site
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Paiement unique de 199€ TTC
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hébergement & mise en ligne inclus
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Bouton WhatsApp & carte Google Maps
              </span>
            </div>
          </div>
        </section>

        {/* CRÉATEUR */}
        <section id="createur" className="px-4 md:px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <Wizard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
