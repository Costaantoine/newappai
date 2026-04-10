import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Mentions légales | NewAppAI',
  description: 'Mentions légales de NewAppAI',
}

export default function MentionsLegalesPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'NewAppAI'
  const companyEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@newappai.fr'
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'À compléter'
  const hostName = 'Coolify / OVH'

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 tracking-tight">
            Mentions <span className="neon-text">légales</span>
          </h1>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Éditeur du site</h2>
              <p>
                Le présent site est édité par la société <strong className="text-white">{companyName}</strong>.
              </p>
              <p className="mt-2">Adresse : {companyAddress}</p>
              <p>Email : <a href={`mailto:${companyEmail}`} className="text-sky-400 hover:underline">{companyEmail}</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Hébergement</h2>
              <p>
                Le site est hébergé par <strong className="text-white">{hostName}</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels…)
                est la propriété exclusive de {companyName} ou de ses partenaires. Toute reproduction, distribution,
                modification ou utilisation de ces contenus sans autorisation préalable est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Limitation de responsabilité</h2>
              <p>
                {companyName} s&apos;efforce de fournir des informations aussi précises que possible sur ce site. Toutefois,
                il ne peut être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations.
                Les informations présentes sur ce site sont non contractuelles et peuvent être modifiées à tout moment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Données personnelles</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit
                d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition aux données vous concernant.
                Pour exercer ce droit, contactez-nous à l&apos;adresse : <a href={`mailto:${companyEmail}`} className="text-sky-400 hover:underline">{companyEmail}</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
              <p>
                Ce site utilise des cookies techniques nécessaires à son fonctionnement (session d&apos;authentification,
                préférences de langue, panier). Ces cookies ne collectent pas de données à des fins publicitaires.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
                français seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
