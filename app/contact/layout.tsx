import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactez NewAppAI — Bordeaux | Innovation Logicielle',
  description: 'Contactez l\'équipe NewAppAI. Une question, un projet ? Nous sommes à votre écoute.',
  alternates: { canonical: "https://newappai.com/contact" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
