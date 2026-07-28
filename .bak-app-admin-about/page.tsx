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

export default function AdminAboutPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalFields, setModalFields] = useState<any[]>([])
  const [modalData, setModalData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, settingsRes] = await Promise.all([
        fetch('/api/supabase/texts'),
        fetch('/api/supabase/settings')
      ])
      const textsData = await textsRes.json()
      const settingsData = await settingsRes.json()
      setTexts(textsData.texts || [])
      if (settingsData.settings) setSettings(settingsData.settings)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const openEdit = (item: any, title: string, fields?: any[]) => {
    setModalType('text')
    setModalTitle(title)
    setModalFields(fields || [{ name: '.', label: 'Francais', type: 'languages' }])
    setModalData({ ...item })
    setModalOpen(true)
  }

  const openEditSettings = (data: any, title: string, fields: any[]) => {
    setModalType('settings')
    setModalTitle(title)
    setModalFields(fields)
    setModalData(data)
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any) => {
    setSaving(true)
    try {
      const dataToSave = savedData || modalData
      if (modalType === 'settings') {
        await fetch('/api/supabase/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      } else {
        await fetch('/api/supabase/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      }
      fetchData()
      setModalOpen(false)
    } catch (error) { console.error('Error:', error) }
    finally { setSaving(false) }
  }

  const getText = (key: string): string => texts.find(t => t.key === key)?.fr || key

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  const aboutTexts = [
    { key: 'about_title', label: 'Titre' },
    { key: 'about_subtitle', label: 'Sous-titre' },
    { key: 'about_vision_title', label: 'Vision - Titre' },
    { key: 'about_vision_desc', label: 'Vision - Description' },
    { key: 'about_approach_title', label: 'Approche - Titre' },
    { key: 'about_approach_desc', label: 'Approche - Description' },
    { key: 'about_values_title', label: 'Valeurs - Titre' },
    { key: 'about_innovation_title', label: 'Valeur 1 - Titre' },
    { key: 'about_innovation_desc', label: 'Valeur 1 - Description' },
    { key: 'about_proximity_title', label: 'Valeur 2 - Titre' },
    { key: 'about_proximity_desc', label: 'Valeur 2 - Description' },
    { key: 'about_excellence_title', label: 'Valeur 3 - Titre' },
    { key: 'about_excellence_desc', label: 'Valeur 3 - Description' },
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
          <Link href="/admin/about" className="text-violet-400 font-medium">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-violet-400">Contact</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - A propos</h1>



        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Titre et Sous-titre</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {aboutTexts.slice(0, 2).map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`)} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Vision</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {aboutTexts.slice(2, 4).map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`)} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Approche</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {aboutTexts.slice(4, 6).map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`)} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Valeurs</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {aboutTexts.slice(6).map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`)} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
    </div>
  )
}
