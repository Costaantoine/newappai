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

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, settingsRes] = await Promise.all([
        fetch('/api/local/texts'),
        fetch('/api/local/settings')
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
        await fetch('/api/local/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      } else {
        await fetch('/api/local/texts', {
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
            <span className="text-white">NewApp</span><span className="text-sky-400">AI</span>
          </span>
          <span className="text-slate-400">Admin</span>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link href="/admin/accueil" className="text-slate-400 hover:text-sky-400">Accueil</Link>
          <Link href="/admin/solutions" className="text-slate-400 hover:text-sky-400">Solutions</Link>
          <Link href="/admin/produits" className="text-slate-400 hover:text-sky-400">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-sky-400">A propos</Link>
          <Link href="/admin/contact" className="text-sky-400 font-medium">Contact</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Contact</h1>

        {/* Design Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Design
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                    <span className="text-sky-400 text-lg" style={{ color: settings?.site?.primary_color }}>Aa</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Couleurs</p>
                    <p className="text-slate-400 text-xs">Site global</p>
                  </div>
                </div>
                <button onClick={() => openEdit({ site: settings?.site || {} }, 'Couleurs', [
                  { name: 'site.primary_color', label: 'Couleur primaire', type: 'color' },
                  { name: 'site.secondary_color', label: 'Couleur secondaire', type: 'color' },
                  { name: 'site.accent_color', label: 'Couleur accent', type: 'color' }
                ])} className="p-2 bg-sky-500 rounded-lg text-white hover:bg-sky-400">✏️</button>
              </div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Header</p>
                    <p className="text-slate-400 text-xs">Navigation</p>
                  </div>
                </div>
                <button onClick={() => openEdit({ header: settings?.header || {} }, 'Header', [
                  { name: 'header.style', label: 'Style', type: 'select', options: [{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solide' }] },
                  { name: 'header.transparent', label: 'Transparent', type: 'boolean' },
                  { name: 'header.sticky', label: 'Fixe', type: 'boolean' }
                ])} className="p-2 bg-sky-500 rounded-lg text-white hover:bg-sky-400">✏️</button>
              </div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Footer</p>
                    <p className="text-slate-400 text-xs">Pied de page</p>
                  </div>
                </div>
                <button onClick={() => openEdit({ footer: settings?.footer || {} }, 'Footer', [
                  { name: 'footer.enabled', label: 'Actif', type: 'boolean' },
                  { name: 'footer.show_socials', label: 'Réseaux sociaux', type: 'boolean' },
                  { name: 'footer.show_copyright', label: 'Copyright', type: 'boolean' }
                ])} className="p-2 bg-sky-500 rounded-lg text-white hover:bg-sky-400">✏️</button>
              </div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Animations</p>
                    <p className="text-slate-400 text-xs">Effets visuels</p>
                  </div>
                </div>
                <button onClick={() => openEdit({ animations: settings?.animations || {} }, 'Animations', [
                  { name: 'animations.enabled', label: 'Activé', type: 'boolean' },
                  { name: 'animations.page_transition', label: 'Transition', type: 'select', options: [{ value: 'fade', label: 'Fondu' }, { value: 'slide', label: 'Glissement' }, { value: 'none', label: 'Aucune' }] }
                ])} className="p-2 bg-sky-500 rounded-lg text-white hover:bg-sky-400">✏️</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Coordonnees</h2>
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white">{settings?.contact?.email}</p>
              </div>
              <button onClick={() => openEdit({ contact: settings?.contact || {} }, 'Coordonnees', [
                { name: 'contact.email', label: 'Email', type: 'text' },
                { name: 'contact.phone', label: 'Telephone', type: 'text' }
              ], 'settings')} className="px-3 py-1 bg-sky-500 text-white rounded text-sm hover:bg-sky-400">Modifier</button>
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
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`, [{ name: '.', label: 'Texte', type: 'languages' }], 'text')} className="px-3 py-1 bg-sky-500 text-white rounded text-sm hover:bg-sky-400">Modifier</button>
              </div>
            ))}
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
                <button onClick={() => openEdit(texts.find(t => t.key === item.key) || { key: item.key }, `Modifier ${item.label}`, [{ name: '.', label: 'Texte', type: 'languages' }], 'text')} className="px-3 py-1 bg-sky-500 text-white rounded text-sm hover:bg-sky-400">Modifier</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
    </div>
  )
}
