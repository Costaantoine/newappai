'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SiteText {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
  section: string
}

interface DynamicTranslation {
  [key: string]: string | DynamicTranslation
}

interface LanguageContextType {
  lang: 'fr' | 'en' | 'pt' | 'es'
  setLang: (lang: 'fr' | 'en' | 'pt' | 'es') => void
  t: DynamicTranslation
  loading: boolean
}

const DynamicLanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function DynamicLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'fr' | 'en' | 'pt' | 'es'>('fr')
  const [texts, setTexts] = useState<SiteText[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'fr' | 'en' | 'pt' | 'es'
    if (savedLang && ['fr', 'en', 'pt', 'es'].includes(savedLang)) {
      setLang(savedLang)
    }
    fetchTexts()
  }, [])

  const fetchTexts = async () => {
    try {
      const res = await fetch('/api/texts')
      const data = await res.json()
      setTexts(data.texts || [])
    } catch (error) {
      console.error('Error fetching texts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetLang = (newLang: 'fr' | 'en' | 'pt' | 'es') => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  // Convertir les textes de la base de données en structure de traduction
  const buildTranslations = (): DynamicTranslation => {
    const translations: DynamicTranslation = {}
    
    texts.forEach(text => {
      const keys = text.key.split('_')
      let current = translations
      
      // Créer la structure imbriquée
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) {
          current[key] = {}
        }
        current = current[key] as DynamicTranslation
      }
      
      // Ajouter la traduction
      const lastKey = keys[keys.length - 1]
      current[lastKey] = text[lang] || text.fr || ''
    })
    
    return translations
  }

  const t = buildTranslations()

  return (
    <DynamicLanguageContext.Provider value={{ lang, setLang: handleSetLang, t, loading }}>
      {children}
    </DynamicLanguageContext.Provider>
  )
}

export function useDynamicLanguage() {
  const context = useContext(DynamicLanguageContext)
  if (!context) {
    return {
      lang: 'fr' as const,
      setLang: () => {},
      t: {},
      loading: true
    }
  }
  return context
}

// Helper pour accéder aux traductions imbriquées
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || ''
}
