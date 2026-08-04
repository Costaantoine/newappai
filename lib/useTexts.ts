'use client'

import { useEffect, useState } from 'react'
import { fetchWithRetry } from './fetchWithRetry'

export interface TextItem {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

/**
 * Charge /api/supabase/texts avec retry + cache-buster.
 * RÈGLE STRICTE : si texts reste vide après tous les retries, loading ne passe
 * JAMAIS à false — la page reste sur le loader, aucune clé brute n'est rendue.
 */
export function useTexts(): { texts: TextItem[]; loading: boolean } {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const res = await fetchWithRetry(`/api/supabase/texts?t=${Date.now()}`)
      if (mounted && res && res.ok) {
        try {
          const data = await res.json()
          if (Array.isArray(data.texts) && data.texts.length > 0) {
            setTexts(data.texts)
            setLoading(false)
            return
          }
        } catch (e) {
          console.error('useTexts: invalid response', e)
        }
      }
      console.warn('useTexts: texts empty after all retries — staying on loader, no raw keys rendered')
      // loading reste true
    }
    load()
    return () => { mounted = false }
  }, [])

  return { texts, loading }
}
