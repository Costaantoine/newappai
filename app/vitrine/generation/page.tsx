'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Chantier from '@/components/vitrine/Chantier'
import { loadConfig, type SiteConfig } from '@/components/webdesign/types'

export default function VitrineGenerationPage() {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<SiteConfig | null | undefined>(undefined)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  const jobId = searchParams.get('jobId') || undefined

  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent px-6 py-32">
        <div className="max-w-6xl mx-auto">
          {config === undefined ? null : config === null ? (
            <div className="max-w-lg mx-auto text-center rounded-2xl border border-neutral-800 bg-neutral-900/50 p-10">
              <p className="text-white text-lg font-medium mb-4">
                Remplissez d'abord le questionnaire
              </p>
              <a
                href="/webdesign"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-400"
              >
                Aller au questionnaire
              </a>
            </div>
          ) : (
            <Chantier config={config} jobId={jobId} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
