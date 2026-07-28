import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Recherchez parmi tous les services et contenus NewAppAI. Trouvez ce que vous cherchez en un instant.',
  alternates: { canonical: "https://newappai.com/recherche" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
