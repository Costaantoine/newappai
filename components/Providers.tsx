'use client'

import { LanguageProvider } from '@/lib/LanguageContext'
import { Language } from '@/lib/translations'

export function Providers({ children, initialLang }: { children: React.ReactNode; initialLang?: Language }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      {children}
    </LanguageProvider>
  )
}
