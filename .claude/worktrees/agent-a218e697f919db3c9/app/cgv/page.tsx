import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Conditions Générales de Vente | NewAppAI',
  description: 'Conditions Générales de Vente de NewAppAI',
}

export default function CGVPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'NewAppAI'
  const companyEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@newappai.fr'

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 tracking-tight">
            Conditions Générales <span className="neon-text">de Vente</span>
          </h1>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
                entre {companyName} et ses clients pour toute commande de produits ou services effectuée via ce site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Commandes</h2>
              <p>
                Toute commande passée sur ce site implique l&apos;acceptation pleine et entière des présentes CGV.
                La commande est validée à réception du paiement complet. Un email de confirmation est
                envoyé à l&apos;adresse fournie lors de la commande.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Prix</h2>
              <p>
                Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). {companyName} se réserve le
                droit de modifier ses prix à tout moment. Le prix applicable est celui en vigueur au moment
                de la validation de la commande.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Paiement</h2>
              <p>
                Le paiement s&apos;effectue en ligne via Stripe, plateforme de paiement sécurisée. Les données
                bancaires ne transitent pas sur nos serveurs. Les moyens de paiement acceptés sont :
                cartes bancaires Visa, Mastercard et American Express.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Livraison</h2>
              <p>
                Pour les produits dématérialisés (logiciels, licences, accès), la livraison s&apos;effectue
                par email dans un délai de 24h ouvrées après validation du paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Droit de rétractation</h2>
              <p>
                Conformément à l&apos;article L121-21 du Code de la Consommation, vous disposez d&apos;un délai de
                14 jours à compter de la réception pour exercer votre droit de rétractation, sans avoir à
                justifier de motifs. Pour exercer ce droit, contactez-nous à :
                <a href={`mailto:${companyEmail}`} className="text-sky-400 hover:underline ml-1">{companyEmail}</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Garanties</h2>
              <p>
                Nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés,
                conformément aux articles L217-4 et suivants du Code de la consommation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Responsabilité</h2>
              <p>
                {companyName} ne saurait être tenu responsable des dommages indirects résultant de l&apos;utilisation
                de ses produits ou services. La responsabilité de {companyName} est limitée au montant de la
                commande concernée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Litiges</h2>
              <p>
                En cas de litige, nous vous invitons à nous contacter en premier lieu à l&apos;adresse
                <a href={`mailto:${companyEmail}`} className="text-sky-400 hover:underline ml-1">{companyEmail}</a>.
                À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents français.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
