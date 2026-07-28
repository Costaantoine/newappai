'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EditModal from '@/components/admin/EditModal'

interface TextItem {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

export default function AdminAutresPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalFields, setModalFields] = useState<any[]>([])
  const [modalData, setModalData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/supabase/texts?section=legal', { cache: 'no-store' })
      const data = await res.json()
      setTexts(data.texts || [])
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const openEdit = (item: any, title: string) => {
    setModalTitle(title)
    setModalFields([{ name: '.', label: 'Texte', type: 'languages' }])
    setModalData(item)
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any) => {
    setSaving(true)
    try {
      const data = savedData || modalData
      await fetch('/api/supabase/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      await fetchData()
      setModalOpen(false)
      setNotification({ message: 'Enregistré !', type: 'success' })
      setTimeout(() => setNotification(null), 2000)
    } catch (error) {
      console.error('Error:', error)
      setNotification({ message: 'Erreur', type: 'error' })
    }
    finally { setSaving(false) }
  }

  const getText = (key: string): string => texts.find(t => t.key === key)?.fr || key

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  // Group texts by page
  const groups = [
    { name: 'Mentions Légales', prefix: 'legal_mentions' },
    { name: 'CGV', prefix: 'legal_cgv' },
    { name: 'Confidentialité', prefix: 'legal_privacy' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <header className="fixed w-full z-50 glass py-4 px-8 flex justify-between items-center border-b border-white/10 bg-slate-900">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tighter">
            <span className="text-white">NewApp</span><span className="text-violet-400">AI</span>
          </span>
          <span className="text-slate-400">Admin</span>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link href="/admin/accueil" className="text-slate-400 hover:text-violet-400">Accueil</Link>
          <Link href="/admin/solutions" className="text-slate-400 hover:text-violet-400">Solutions</Link>
          <Link href="/admin/produits" className="text-slate-400 hover:text-violet-400">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-violet-400">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-violet-400">Contact</Link>
          <Link href="/admin/autres" className="text-violet-400 font-medium">Autres</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Autres pages</h1>

        {groups.map(group => {
          const groupTexts = texts.filter(t => t.key.startsWith(group.prefix))
          if (groupTexts.length === 0) return null
          return (
            <section key={group.name} className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">{group.name}</h2>
              <div className="glass p-6 rounded-2xl space-y-2">
                {groupTexts.map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-400 text-xs font-mono truncate">{item.key.replace(group.prefix + '_', '')}</p>
                      <p className="text-white text-sm truncate">{item.fr}</p>
                    </div>
                    <button onClick={() => openEdit(item, item.key)} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400 shrink-0 ml-4">Modifier</button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {notification && (
        <div className={`fixed top-24 right-6 z-[300] px-6 py-4 rounded-xl shadow-2xl border ${
          notification.type === 'success' 
            ? 'bg-emerald-500/90 border-emerald-400/30 text-white' 
            : 'bg-red-500/90 border-red-400/30 text-white'
        } backdrop-blur-md animate-pulse`}>
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
    </div>
  )
}
