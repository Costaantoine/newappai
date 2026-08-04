'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { translations, Language, Translation } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr')
  const router = useRouter()

  useEffect(() => {
    // 1. localStorage (préférence explicite de l'utilisateur)
    const savedLang = localStorage.getItem('lang') as Language
    if (savedLang && translations[savedLang]) {
      setLang(savedLang)
      return
    }

    // 2. Détection depuis l'URL
    const pathLang = (() => {
      const path = window.location.pathname
      if (path.startsWith('/en')) return 'en'
      if (path.startsWith('/pt')) return 'pt'
      if (path.startsWith('/es')) return 'es'
      // / (page d'accueil française) ou tout autre chemin
      return null
    })() as Language | null
    if (pathLang && translations[pathLang]) {
      setLang(pathLang)
      return
    }

    // 3. Cookie (écrit par le middleware ou le sélecteur de langue)
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1] as Language | undefined
    if (cookieLang && translations[cookieLang]) {
      setLang(cookieLang)
      return
    }

    // 4. Défaut → français
    setLang('fr')
  }, [])

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    // Synchroniser avec le cookie pour le middleware
    const isSecure = window.location.protocol === 'https:'
    document.cookie = `lang=${newLang};max-age=${60*60*24*365};path=/;samesite=lax${isSecure ? ';secure' : ''}`
    // Re-rendre le contenu SSR immédiatement (les Server Components lisent le cookie)
    router.refresh()
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
