import SetHtmlLang from '@/components/SetHtmlLang'
import HomePageContent from '@/components/HomePageContent'

export const metadata = {
  title: 'NewAppAI | Innovación en Software — IA para su empresa',
  description: 'Pilote su empresa con la inteligencia de hoy. EasyReadVoice, QRcall, soluciones de IA para comercios, industrias y servicios.',
  alternates: { canonical: 'https://newappai.com/es' },
  openGraph: {
    title: 'NewAppAI | Innovación en Software',
    description: 'Pilote su empresa con la inteligencia de hoy. EasyReadVoice, QRcall, soluciones de IA para comercios, industrias y servicios.',
    url: 'https://newappai.com/es',
    siteName: 'NewAppAI',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewAppAI | Innovación en Software',
    description: 'Pilote su empresa con la inteligencia de hoy.',
    images: ['https://newappai.com/og-image.jpg'],
  },
}

export default function SpanishHomePage() {
  return (
    <>
      <SetHtmlLang lang="es" />
      <HomePageContent />
    </>
  )
}
