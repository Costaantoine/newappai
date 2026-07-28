import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: "Politique de Confidentialité",
  description: 'Politique de confidentialité et protection des données personnelles de NewAppAI',
  alternates: { canonical: "https://newappai.com/confidentialite" },
}

export default function ConfidentialitePage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'NewAppAI'
  const companyEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@newappai.fr'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-slate-100 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 tracking-tight">
            Politique de <span className="neon-text">Confidentialité</span>
          </h1>

          <p className="text-[#33ff33] mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <div className="space-y-10 text-[#33ff33] leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles est <strong className="text-[#33ff33]">{companyName}</strong>,
                agence spécialisée en solutions d&apos;intelligence artificielle. Pour toute question relative à vos données,
                contactez-nous à :
                <a href={`mailto:${companyEmail}`} className="text-[#33ff33] hover:underline ml-1">{companyEmail}</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">2. Données collectées</h2>
              <p>Dans le cadre de nos services d&apos;intelligence artificielle et de développement, nous collectons :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                <li><strong className="text-[#33ff33]">Formulaire de contact</strong> : nom, adresse email, sujet, message</li>
                <li><strong className="text-[#33ff33]">Commandes et devis</strong> : adresse email, informations de facturation, produit ou service commandé (via Stripe)</li>
                <li><strong className="text-[#33ff33]">Assistant IA</strong> : historique des échanges avec nos assistants conversationnels, dans la limite nécessaire à la fourniture du service</li>
                <li><strong className="text-[#33ff33]">Navigation</strong> : cookies techniques (session, langue, panier)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                <li>Répondre à vos demandes de contact et de devis</li>
                <li>Traiter et suivre vos commandes</li>
                <li>Fournir et améliorer nos solutions d&apos;intelligence artificielle</li>
                <li>Assurer le bon fonctionnement du site (session, langue)</li>
                <li>Respecter nos obligations légales et comptables</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">4. Base légale</h2>
              <p>Le traitement de vos données est fondé sur :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                <li>L&apos;exécution du contrat (commandes, prestations)</li>
                <li>Votre consentement (formulaire de contact, assistant IA)</li>
                <li>Nos obligations légales (comptabilité, fiscalité)</li>
                <li>Notre intérêt légitime (amélioration de nos services)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">5. Durée de conservation</h2>
              <p>
                Vos données sont conservées pour la durée nécessaire aux finalités pour lesquelles elles ont été
                collectées, dans le respect des obligations légales (3 ans pour les données de contact, 10 ans
                pour les données comptables).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">6. Partage des données</h2>
              <p>Vos données ne sont ni vendues ni cédées à des tiers. Elles peuvent être partagées avec :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                <li><strong className="text-[#33ff33]">Stripe</strong> : prestataire de paiement sécurisé (données de paiement uniquement)</li>
                <li><strong className="text-[#33ff33]">Fournisseurs d&apos;infrastructure IA</strong> : dans la stricte mesure nécessaire au fonctionnement de nos assistants, sous garanties contractuelles de confidentialité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">7. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                <li>Droit d&apos;accès</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d&apos;opposition</li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous à :
                <a href={`mailto:${companyEmail}`} className="text-[#33ff33] hover:underline ml-1">{companyEmail}</a>
              </p>
              <p className="mt-3">
                Vous avez également le droit d&apos;introduire une réclamation auprès de la CNIL
                (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#33ff33] hover:underline">www.cnil.fr</a>).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">8. Cookies</h2>
              <p>
                Ce site utilise uniquement des cookies techniques indispensables à son fonctionnement.
                Ces cookies ne nécessitent pas votre consentement. Vous pouvez les désactiver via les
                paramètres de votre navigateur, mais cela peut altérer le fonctionnement du site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#33ff33] mb-3">9. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
                vos données contre tout accès non autorisé, perte, altération ou divulgation.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
