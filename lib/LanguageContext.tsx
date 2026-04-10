'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, Translation } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language
    if (savedLang && translations[savedLang]) {
      setLang(savedLang)
    }
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default values instead of throwing error
    return {
      lang: 'fr',
      setLang: () => {},
      t: translations.fr
    }
  }
  return context
}
