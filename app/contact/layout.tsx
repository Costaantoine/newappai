import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactez NewAppAI | Innovation Logicielle — IA pour votre entreprise',
  description: 'Vous avez un projet innovant ? Contactez NewAppAI pour vos solutions IA et logicielles. Réponse sous 24h.',
  alternates: { canonical: "https://newappai.com/contact" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
