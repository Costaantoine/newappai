import SetHtmlLang from '@/components/SetHtmlLang'
import HomePageContent from '@/components/HomePageContent'

export const metadata = {
  title: 'NewAppAI | Inovação em Software — IA para a sua empresa',
  description: 'Pilote sua empresa com a inteligência de hoje. EasyReadVoice, QRcall, soluções de IA para comércios, indústrias e serviços.',
  alternates: { canonical: 'https://newappai.com/pt' },
  openGraph: {
    title: 'NewAppAI | Inovação em Software',
    description: 'Pilote sua empresa com a inteligência de hoje. EasyReadVoice, QRcall, soluções de IA para comércios, indústrias e serviços.',
    url: 'https://newappai.com/pt',
    siteName: 'NewAppAI',
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewAppAI | Inovação em Software',
    description: 'Pilote sua empresa com a inteligência de hoje.',
    images: ['https://newappai.com/og-image.jpg'],
  },
}

export default function PortugueseHomePage() {
  return (
    <>
      <SetHtmlLang lang="pt" />
      <HomePageContent />
    </>
  )
}
