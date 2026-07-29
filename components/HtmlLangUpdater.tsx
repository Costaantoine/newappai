'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { usePathname } from 'next/navigation'

/**
 * Met à jour l'attribut lang="…" sur <html> selon la langue active,
 * et définit les meta tags OG dynamiquement par langue.
 */
export default function HtmlLangUpdater() {
  const { lang } = useLanguage()
  const pathname = usePathname()

  useEffect(() => {
    // 1 — Langue pour l'attribut <html lang>
    document.documentElement.lang = lang

    // 2 — OG meta tags par langue
    const ogLocaleMap: Record<string, string> = {
      fr: 'fr_FR',
      en: 'en_US',
      pt: 'pt_PT',
      es: 'es_ES',
    }

    const ogTitleMap: Record<string, string> = {
      fr: 'NewAppAI | Innovation Logicielle — IA pour votre entreprise',
      en: 'NewAppAI | Software Innovation — AI for your business',
      pt: 'NewAppAI | Inovação de Software — IA para sua empresa',
      es: 'NewAppAI | Innovación de Software — IA para su empresa',
    }

    const ogDescMap: Record<string, string> = {
      fr: "Donnez une voix humaine à tous vos documents avec EasyReadVoice. QRcall, solutions IA pour commerces, industries et services.",
      en: 'Drive your business with today\'s intelligence. EasyReadVoice, QRcall, AI solutions for retail, industry and services.',
      pt: 'Pilote sua empresa com a inteligência de hoje. EasyReadVoice, QRcall, soluções de IA para comércios, indústrias e serviços.',
      es: 'Pilote su empresa con la inteligencia de hoy. EasyReadVoice, QRcall, soluciones de IA para comercios, industrias y servicios.',
    }

    const twitterTitleMap: Record<string, string> = {
      fr: 'NewAppAI | Innovation Logicielle',
      en: 'NewAppAI | Software Innovation',
      pt: 'NewAppAI | Inovação de Software',
      es: 'NewAppAI | Innovación de Software',
    }

    const twitterDescMap: Record<string, string> = {
      fr: "Donnez une voix humaine à tous vos documents, en moins de 2 minutes.",
      en: "Drive your business with today's intelligence.",
      pt: 'Pilote sua empresa com a inteligência de hoje.',
      es: 'Pilote su empresa con la inteligencia de hoy.',
    }

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (el) {
        el.setAttribute('content', content)
        return
      }
      // Fallback: chercher par name (twitter)
      el = document.querySelector(`meta[name="${property}"]`)
      if (el) {
        el.setAttribute('content', content)
      }
    }

    setMeta('og:locale', ogLocaleMap[lang] || 'fr_FR')
    setMeta('og:title', ogTitleMap[lang] || ogTitleMap.fr)
    setMeta('og:description', ogDescMap[lang] || ogDescMap.fr)
    setMeta('twitter:title', twitterTitleMap[lang] || twitterTitleMap.fr)
    setMeta('twitter:description', twitterDescMap[lang] || twitterDescMap.fr)

    // Mettre à jour le <title> de la page si on est sur la racine
    const ogTitle = ogTitleMap[lang] || ogTitleMap.fr
    if (pathname === '/' || pathname === `/${lang}`) {
      document.title = ogTitle
    }
  }, [lang, pathname])

  return null
}
