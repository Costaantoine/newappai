import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QRcall — Scan & Call | NewAppAI',
  description: 'Créez et gérez vos QR codes d\'appel avec QRcall par NewAppAI. Solution de communication innovante.',
  alternates: { canonical: "https://newappai.com/qrcall" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
