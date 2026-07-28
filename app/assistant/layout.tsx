import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assistant IA Eva',
  description: 'Posez vos questions à Eva, votre assistant IA intelligent. Chattez, explorez et obtenez des réponses instantanées.',
  alternates: { canonical: "https://newappai.com/assistant" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
