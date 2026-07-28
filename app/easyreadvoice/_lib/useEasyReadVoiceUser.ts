'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UseEasyReadVoiceUserOptions {
  /** Redirect to /easyreadvoice/login if no session is found. Default true. */
  requireAuth?: boolean
}

export function useEasyReadVoiceUser(options: UseEasyReadVoiceUserOptions = {}) {
  const { requireAuth = true } = options
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      if (!supabase) {
        if (active) setLoading(false)
        if (requireAuth) router.push('/easyreadvoice/login')
        return
      }

      const { data } = await supabase.auth.getUser()
      if (!active) return

      if (!data.user && requireAuth) {
        router.push('/easyreadvoice/login')
        return
      }

      setUser(data.user)
      setLoading(false)
    }

    load()

    const { data: subscription } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      if (!session?.user && requireAuth) {
        router.push('/easyreadvoice/login')
      }
    }) ?? { data: null }

    return () => {
      active = false
      subscription?.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signOut() {
    await supabase?.auth.signOut()
    router.push('/easyreadvoice/login')
  }

  return { user, loading, signOut }
}
