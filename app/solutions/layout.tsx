import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Nos solutions par secteur d'activité | NewAppAI",
  description: 'Découvrez toutes les solutions NewAppAI : assistant IA, QRcall, EasyReadVoice et bien plus.',
  alternates: { canonical: 'https://newappai.com/solutions' },
  openGraph: {
    title: "Solutions IA et logicielles | NewAppAI",
    description: "Découvrez nos solutions IA intelligentes pour chaque secteur : commerce, industrie, comptabilité, droit, webdesign et plus.",
    url: 'https://newappai.com/solutions',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
