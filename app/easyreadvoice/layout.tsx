import type { Metadata } from 'next'
import ServiceWorkerRegister from './_components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'EasyReadVoice — Texte vers Audio par IA | NewAppAI',
  description: "Transformez n'importe quel document écrit en audio avec des voix adaptées : féminines, masculines, par personnage.",
  alternates: { canonical: 'https://newappai.com/easyreadvoice' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ERVP',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ServiceWorkerRegister />
    </>
  )
}
