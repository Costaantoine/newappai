import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Conditions Générales de Vente | NewAppAI',
    description: 'Conditions Générales de Vente de NewAppAI — commandes, prix, paiement Stripe, droit de rétractation, garanties.',
    alternates: { canonical: 'https://newappai.com/cgv' },
    openGraph: {
      title: 'CGV | NewAppAI',
      description: 'Conditions Générales de Vente de NewAppAI.',
      url: 'https://newappai.com/cgv',
    },
  }
}

interface TextRow { key: string; fr: string; en: string; pt: string; es: string }

export default async function CGVPage() {
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

  const companyEmail = 'contact@newappai.com'
  const fill = (text: string) => text.replace(/{company}/g, 'NewAppAI').replace(/{email}/g, companyEmail)

  // Each section: { num (for display), keySuffix (for DB lookup) }
  const sections = [
    { num: 1, key: '1', label: 'Objet' },
    { num: 2, key: '2', label: 'Commandes' },
    { num: 3, key: '3', label: 'Prix' },
    { num: 4, key: '4', label: 'Paiement' },
    { num: null as number | null, key: '4bis', label: 'TVA' },
    { num: 5, key: '5', label: 'Livraison' },
    { num: 6, key: '6', label: 'Droit de rétractation' },
    { num: 7, key: '7', label: 'Garanties' },
    { num: 8, key: '8', label: 'Responsabilité' },
    { num: 9, key: '9', label: 'Litiges' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6 bg-[#000000]">
        <div className="max-w-3xl mx-auto">
          <h1 data-section="legal-cgv-title" className="text-4xl font-bold mb-10 tracking-tight text-[#f5f5f7]">
            {t('legal_cgv_title', 'Conditions Générales de Vente')}
          </h1>
          <div className="space-y-10 text-[#86868b] leading-relaxed">
            {sections.map(s => (
              <section key={s.key}>
                <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">
                  {t(`legal_cgv_section_${s.key}_title`, `${s.num !== null ? s.num + '. ' : ''}${s.label}`)}
                </h2>
                <p>{fill(t(`legal_cgv_section_${s.key}_content`, ''))}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
