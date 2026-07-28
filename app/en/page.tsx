import SetHtmlLang from '@/components/SetHtmlLang'
import HomePageContent from '@/components/HomePageContent'

export const metadata = {
  title: 'NewAppAI | Software Innovation — AI for your Business',
  description: 'Drive your business with today\'s intelligence. EasyReadVoice, QRcall, AI solutions for retail, industry and services.',
  alternates: { canonical: 'https://newappai.com/en' },
  openGraph: {
    title: 'NewAppAI | Software Innovation',
    description: 'Drive your business with today\'s intelligence. EasyReadVoice, QRcall, AI solutions for retail, industry and services.',
    images: [{ url: 'https://newappai.com/og-image.jpg', width: 1200, height: 630 }],
    url: 'https://newappai.com/en',
    siteName: 'NewAppAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewAppAI | Software Innovation',
    description: 'Drive your business with today\'s intelligence.',
    images: ['https://newappai.com/og-image.jpg'],
  },
}

export default function EnglishHomePage() {
  return (
    <>
      <SetHtmlLang lang="en" />
      <HomePageContent />
    </>
  )
}
