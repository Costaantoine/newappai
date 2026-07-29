import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const revalidate = 60

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

interface TextRow { key: string; fr: string; en: string; pt: string; es: string }

export default async function MentionsLegalesPage() {
  const cookieStore = cookies()
  const lang = cookieStore.get('lang')?.value || 'fr'

  const texts = await prisma.text.findMany({
    where: { section: 'legal' },
  }) as TextRow[]

  const t = (key: string, fb: string = ''): string => {
    const found = texts.find(x => x.key === key)
    if (!found) return fb || key
    const val = found[lang as 'fr' | 'en' | 'pt' | 'es']
    return val || found.fr || fb || key
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

  const companyName = 'NewAppAI'
  const companyEmail = 'contact@newappai.com'
  const companyAddress = '4 impasse ZA Landegrand, 33290 Parempuyre, France'
  const hostName = 'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France'
  const fill = (text: string) =>
    text.replace(/{company}/g, companyName).replace(/{email}/g, companyEmail).replace(/{address}/g, companyAddress).replace(/{host}/g, hostName)

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
                <p>{fill(t(`legal_mentions_section_${s.num}_content`, ''))}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
