import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Politique de confidentialité | NewAppAI',
    description: 'Politique de confidentialité de NewAppAI — collecte, traitement et protection de vos données personnelles conformément au RGPD.',
    alternates: { canonical: 'https://newappai.com/privacy' },
    openGraph: {
      title: 'Politique de confidentialité | NewAppAI',
      description: 'Politique de confidentialité de NewAppAI — données personnelles et RGPD.',
      url: 'https://newappai.com/privacy',
    },
  }
}

interface TextRow { key: string; fr: string; en: string; pt: string; es: string }

export default async function PrivacyPage() {
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

  const dateStr = new Date().toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-PT' : lang === 'es' ? 'es-ES' : 'en-US'
  )

  const numItems = (prefix: string, count: number) =>
    Array.from({ length: count }, (_, i) => i + 1).map(i => ({ num: i, text: t(`${prefix}_${i}`, '') }))

  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-20 px-6 bg-[#000000]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 tracking-tight text-[#f5f5f7]">
            {t('legal_privacy_title', 'Politique de confidentialité')}
          </h1>
          <p className="text-[#86868b] mb-10">{fill(t('legal_privacy_last_update', "Dernière mise à jour : {date}")).replace('{date}', dateStr)}</p>
          <div className="space-y-10 text-[#86868b] leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_1_title', '1. Responsable du traitement')}</h2>
              <p>{fill(t('legal_privacy_section_1_content', ''))}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_2_title', '2. Données collectées')}</h2>
              <p>{t('legal_privacy_section_2_intro', '')}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                {numItems('legal_privacy_section_2_item', 3).map(i => <li key={i.num}>{i.text}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_3_title', '3. Finalités du traitement')}</h2>
              <p>{t('legal_privacy_section_3_intro', '')}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                {numItems('legal_privacy_section_3_item', 4).map(i => <li key={i.num}>{i.text}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_4_title', '4. Base légale')}</h2>
              <p>{t('legal_privacy_section_4_intro', '')}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                {numItems('legal_privacy_section_4_item', 3).map(i => <li key={i.num}>{i.text}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_5_title', '5. Durée de conservation')}</h2>
              <p>{t('legal_privacy_section_5_content', '')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_6_title', '6. Partage des données')}</h2>
              <p>{t('legal_privacy_section_6_intro', '')}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                {numItems('legal_privacy_section_6_item', 1).map(i => <li key={i.num} dangerouslySetInnerHTML={{ __html: i.text }} />)}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_7_title', '7. Vos droits')}</h2>
              <p>{t('legal_privacy_section_7_intro', '')}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside ml-2">
                {numItems('legal_privacy_section_7_item', 6).map(i => <li key={i.num}>{i.text}</li>)}
              </ul>
              <p className="mt-3">{fill(t('legal_privacy_section_7_contact', ''))}</p>
              <p className="mt-3">{t('legal_privacy_section_7_cnil', '')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-3">{t('legal_privacy_section_8_title', '8. Cookies')}</h2>
              <p>{t('legal_privacy_section_8_content', '')}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
