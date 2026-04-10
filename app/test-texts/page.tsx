'use client'

import { useEffect, useState } from 'react'

interface SiteText {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
  section: string
}

export default function TestTextsPage() {
  const [texts, setTexts] = useState<SiteText[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test des textes dynamiques</h1>
      
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Navigation ({texts.filter(t => t.section === 'navigation').length} textes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.filter(t => t.section === 'navigation').map(text => (
              <div key={text.id} className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">{text.key}</p>
                <p className="text-white font-medium">{text.fr}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Homepage ({texts.filter(t => t.section === 'homepage').length} textes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.filter(t => t.section === 'homepage').map(text => (
              <div key={text.id} className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">{text.key}</p>
                <p className="text-white font-medium">{text.fr}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">About ({texts.filter(t => t.section === 'about').length} textes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.filter(t => t.section === 'about').map(text => (
              <div key={text.id} className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">{text.key}</p>
                <p className="text-white font-medium">{text.fr}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Contact ({texts.filter(t => t.section === 'contact').length} textes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.filter(t => t.section === 'contact').map(text => (
              <div key={text.id} className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">{text.key}</p>
                <p className="text-white font-medium">{text.fr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <a href="/admin/texts" className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-400 transition inline-block">
          → Gérer les textes
        </a>
      </div>
    </div>
  )
}
