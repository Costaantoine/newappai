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

  // Créer une fonction de traduction avec fallback français
  const createTranslationWithFallback = (lang: Language) => {
    const currentTranslations = translations[lang] || {}
    
    return new Proxy(currentTranslations, {
      get: (target, prop) => {
        const key = String(prop)
        const t = target as Record<string, unknown>
        const fr = translations.fr as Record<string, unknown>
        
        // Essayer d'abord la langue demandée
        if (t[key]) {
          return t[key]
        }
        
        // Fallback vers le français
        if (fr[key]) {
          return fr[key]
        }
        
        // Fallback vers la clé elle-même
        return key
      }
    }) as Translation
  }

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang: handleSetLang, 
      t: createTranslationWithFallback(lang) 
    }}>
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
