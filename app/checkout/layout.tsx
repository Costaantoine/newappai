import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Finaliser ma commande',
  description: 'Finalisez votre commande en toute sécurité sur NewAppAI. Paiement sécurisé par Stripe.',
  alternates: { canonical: "https://newappai.com/checkout" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
