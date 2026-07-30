import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mentions légales | NewAppAI',
    description: 'Mentions légales du site NewAppAI (Premium à juste prix) — éditeur, hébergement OVH, SIRET 980 127 591 00017, directrice de publication Brigitte VALADIE.',
    alternates: { canonical: 'https://newappai.com/mentions-legales' },
    openGraph: {
      title: 'Mentions légales | NewAppAI',
      description: 'Mentions légales du site NewAppAI — SIRET 980 127 591 00017, RCS Bordeaux.',
      url: 'https://newappai.com/mentions-legales',
    },
  }
}

// Fallback texts when DB is unavailable (read-only, shipped with the build)
const FALLBACK: Record<string, string> = {
  legal_mentions_title: 'Mentions légales',
  legal_mentions_section_1_title: '1. Éditeur du site',
  legal_mentions_section_1_content: 'Le site newappai.com est édité par la société Premium à juste prix, SAS au capital social de 1 500 €, immatriculée au Registre du Commerce et des Sociétés de Bordeaux sous le numéro SIRET 980 127 591 00017, dont le siège social est situé 4 impasse ZA Landegrand, 33290 Parempuyre, France. Numéro de TVA intracommunautaire : FR57 980 127 591.',
  legal_mentions_section_2_title: '2. Hébergement',
  legal_mentions_section_2_content: 'Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.',
  legal_mentions_section_3_title: '3. Propriété intellectuelle',
  legal_mentions_section_3_content: "L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de NewAppAI ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation de ces contenus sans autorisation préalable est strictement interdite.",
  legal_mentions_section_4_title: '4. Limitation de responsabilité',
  legal_mentions_section_4_content: "NewAppAI s'efforce de fournir des informations aussi précises que possible sur ce site. Toutefois, il ne peut être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations.",
  legal_mentions_section_5_title: '5. Données personnelles',
  legal_mentions_section_5_content: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, d\'effacement et d\'opposition aux données vous concernant. Contact : contact@newappai.com.',
  legal_mentions_section_6_title: '6. Cookies',
  legal_mentions_section_6_content: 'Ce site utilise des cookies techniques nécessaires à son fonctionnement.',
  legal_mentions_section_7_title: '7. Droit applicable',
  legal_mentions_section_7_content: 'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.',
  legal_mentions_section_8_title: '8. Directrice de la publication',
  legal_mentions_section_8_content: 'Brigitte VALADIE.',
}

interface TextRow { key: string; fr: string; en: string; pt: string; es: string }

export default async function MentionsLegalesPage() {
  const cookieStore = cookies()
  const lang = cookieStore.get('lang')?.value || 'fr'

  let texts: TextRow[] = []
  try {
    texts = await prisma.text.findMany({ where: { section: 'legal' } }) as TextRow[]
  } catch (e) {
    console.error('Prisma error in mentions-legales, using fallback:', e)
  }

  const t = (key: string, fb: string = ''): string => {
    const found = texts.find(x => x.key === key)
    if (found) {
      const val = found[lang as 'fr' | 'en' | 'pt' | 'es']
      if (val) return val
    }
    return FALLBACK[key] || fb || key
  }

  const sections = [
    { num: 1, label: 'Éditeur du site' },
    { num: 2, label: 'Hébergement' },
    { num: 3, label: 'Propriété intellectuelle' },
    { num: 4, label: 'Limitation de responsabilité' },
    { num: 5, label: 'Données personnelles' },
    { num: 6, label: 'Cookies' },
    { num: 7, label: 'Droit applicable' },
    { num: 8, label: 'Directrice de la publication' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6 bg-[#000000]">
        <div className="max-w-3xl mx-auto">
          <h1 data-section="legal-mentions-title" className="text-4xl font-bold mb-10 tracking-tight text-[#f5f5f7]">
            {t('legal_mentions_title', 'Mentions légales')}
          </h1>
          <div className="space-y-10 text-[#86868b] leading-relaxed">
            {sections.map(s => (
              <section key={s.num}>
                <h2 data-section={`legal-mentions-section-${s.num}`} className="text-xl font-semibold text-[#f5f5f7] mb-3">
                  {t(`legal_mentions_section_${s.num}_title`, `${s.num}. ${s.label}`)}
                </h2>
                <p>{t(`legal_mentions_section_${s.num}_content`, '')}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
