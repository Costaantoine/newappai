import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: "Découvrez NewAppAI : notre mission, notre équipe et notre vision pour l'assistant IA nouvelle génération.",
  alternates: { canonical: "https://newappai.com/about" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
