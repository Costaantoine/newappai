import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon profil',
  description: 'Gérez votre profil, vos abonnements et vos préférences sur NewAppAI.',
  alternates: { canonical: "https://newappai.com/profile" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
