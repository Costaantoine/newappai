import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commande réussie',
  description: 'Votre commande NewAppAI a été confirmée avec succès. Merci pour votre confiance !',
  alternates: { canonical: "https://newappai.com/success" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
