import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'
import { SettingsProvider } from '@/lib/SettingsContext'

export const metadata: Metadata = {
  title: 'NewAppAI | Innovation Logicielle',
  description: 'Solutions intelligentes pour simplifier votre quotidien',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("Layout Premium loaded");
  return (
    <html lang="fr" data-branch="master" data-version="v-premium-beta">
      <script src="https://cdn.tailwindcss.com" async></script>
      <body className="overflow-x-hidden">
        <Providers>
          <SettingsProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SettingsProvider>
        </Providers>
      </body>
    </html>
  )
}
