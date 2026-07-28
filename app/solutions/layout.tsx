import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Nos solutions par secteur d'activité | NewAppAI",
  description: 'Découvrez toutes les solutions NewAppAI : assistant IA, QRcall, EasyReadVoice et bien plus.',
  alternates: { canonical: "https://newappai.com/solutions" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
