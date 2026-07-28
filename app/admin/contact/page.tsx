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

interface Settings {
  site?: any
  hero?: any
  header?: any
  footer?: any
  cards?: any
  buttons?: any
  animations?: any
  contact?: { email?: string; phone?: string; address?: { fr?: string; en?: string; pt?: string; es?: string } }
  contact_page?: { title?: { fr?: string; en?: string; pt?: string; es?: string } }
  widgets?: any
  audio?: any
}

export default function AdminContactPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [modalType, setModalType] = useState('')
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
      const [textsRes, settingsRes] = await Promise.all([
        fetch('/api/supabase/texts', { cache: 'no-store' }),
        fetch('/api/supabase/settings', { cache: 'no-store' })
      ])
      const textsData = await textsRes.json()
      const settingsData = await settingsRes.json()
      setTexts(textsData.texts || [])
      if (settingsData.settings) setSettings(settingsData.settings)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const openEdit = (item: any, title: string, fields: any[], type: string = 'text') => {
    setModalType(type)
    setModalTitle(title)
    setModalFields(fields)
    setModalData({ ...item })
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any) => {
    setSaving(true)
    try {
      const dataToSave = savedData || modalData
      if (modalType === 'settings') {
        await fetch('/api/supabase/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      } else {
        await fetch('/api/supabase/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      }
      await fetchData()
      setModalOpen(false)
      setNotification({ message: 'Modifications enregistrées ! Rafraîchissement...', type: 'success' })
      setTimeout(() => {
        setNotification(null)
        // Force le rechargement pour voir les changements
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error:', error)
      setNotification({ message: 'Erreur lors de la sauvegarde', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    }
    finally { setSaving(false) }
  }

  const getText = (key: string): string => texts.find(t => t.key === key)?.fr || key

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  const contactTexts = [
    { key: 'contact_title', label: 'Titre' },
    { key: 'contact_subtitle', label: 'Sous-titre' },
    { key: 'contact_name', label: 'Label - Nom' },
    { key: 'contact_email', label: 'Label - Email' },
    { key: 'contact_subject', label: 'Label - Sujet' },
    { key: 'contact_message', label: 'Label - Message' },
    { key: 'contact_placeholder', label: 'Placeholder - Message' },
    { key: 'contact_send', label: 'Bouton envoyer' },
    { key: 'contact_sent', label: 'Message succes' },
    { key: 'contact_sent_desc', label: 'Description succes' },
  ]

  const subjectKeys = [
    { key: 'contact_subject_1', label: 'Sujet 1' },
    { key: 'contact_subject_2', label: 'Sujet 2' },
    { key: 'contact_subject_3', label: 'Sujet 3' },
    { key: 'contact_subject_4', label: 'Sujet 4' },
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
          <Link href="/admin/contact" className="text-violet-400 font-medium">Contact</Link>
          <Link href="/admin/autres" className="text-slate-400 hover:text-violet-400">Autres</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Contact</h1>



        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Page Contact - Informations</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-slate-400 text-sm">Titre de la page</p>
                <p className="text-white">{typeof settings?.contact_page?.title === 'object' ? settings?.contact_page?.title?.fr : (settings?.contact_page?.title || 'Contactez l\'avenir')}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); openEdit({ contact_page_title: settings?.contact_page?.title || {} }, 'Titre Page Contact (multilingue)', [
                { name: 'contact_page_title', label: 'Titre Page', type: 'languages' }
              ], 'settings')}} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-slate-400 text-sm">Adresse physique</p>
                <p className="text-white">{typeof settings?.contact?.address === 'object' ? settings?.contact?.address?.fr : (settings?.contact?.address || 'Non définie')}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); openEdit({ contact_address: settings?.contact?.address || {} }, 'Adresse (multilingue)', [
                { name: 'contact_address', label: 'Adresse', type: 'languages' }
              ], 'settings')}} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white">{settings?.contact?.email || 'contact@newappai.com'}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); openEdit({ contact: settings?.contact || {} }, 'Email & Téléphone', [
                { name: 'contact.email', label: 'Email', type: 'text' },
                { name: 'contact.phone', label: 'Téléphone', type: 'text' }
              ], 'settings')}} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Formulaire</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {contactTexts.map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`, [{ name: '.', label: 'Texte', type: 'languages' }], 'text') }} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Réseaux sociaux</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-slate-400 text-sm">Facebook</p>
                <p className="text-white text-sm truncate max-w-[300px]">{settings?.contact?.facebook_url || 'Non défini'}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); openEdit({ contact: settings?.contact || {} }, 'Réseaux sociaux', [
                { name: 'contact.facebook_url', label: 'Facebook URL', type: 'text' },
                { name: 'contact.instagram_url', label: 'Instagram URL', type: 'text' },
                { name: 'contact.linkedin_url', label: 'LinkedIn URL', type: 'text' },
                { name: 'contact.twitter_url', label: 'Twitter / X URL', type: 'text' },
                { name: 'contact.youtube_url', label: 'YouTube URL', type: 'text' }
              ], 'settings')}} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Sujets du formulaire</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            {subjectKeys.map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                  <p className="text-white">{getText(item.key)}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`, [{ name: '.', label: 'Texte', type: 'languages' }], 'text') }} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-[300] px-6 py-4 rounded-xl shadow-2xl border ${
          notification.type === 'success' 
            ? 'bg-emerald-500/90 border-emerald-400/30 text-white' 
            : 'bg-red-500/90 border-red-400/30 text-white'
        } backdrop-blur-md animate-pulse`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
    </div>
  )
}
