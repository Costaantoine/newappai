'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// close icon (inline SVG)

const HIDDEN_PATHS = ['/admin', '/auth', '/checkout', '/profile', '/easyreadvoice/player']
const STORAGE_KEY = 'sticky_cta_dismissed'
const DISMISS_DAYS = 7

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check localStorage first
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10)
        if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
          setVisible(false)
          return
        }
      }
    } catch {
      // localStorage unavailable
    }

    // Check path exclusion
    const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path))
    setVisible(!shouldHide)
  }, [pathname])

  const handleDismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // localStorage unavailable
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999]">
      <div className="relative backdrop-blur-xl bg-black/70 border-t border-[#33ff33]/20 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <p className="text-[#33ff33] text-sm sm:text-base font-medium">
            Vous avez un projet ?
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold
                         text-black
                         hover:brightness-110 active:scale-[0.97]
                         transition-all duration-200"
                         style={{ backgroundColor: 'var(--color-primary, #33ff33)' }}
            >
              Demander une demo
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <button
              onClick={handleDismiss}
              aria-label="Fermer"
              className="text-[#33ff33]/50 hover:text-[#33ff33]/90 transition-colors p-1 rounded-lg hover:bg-black"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
