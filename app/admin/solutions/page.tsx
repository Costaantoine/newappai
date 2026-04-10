'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EditModal from '@/components/admin/EditModal'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import AdminButton from '@/components/admin/AdminButton'

interface TextItem {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
}

interface Zone {
  id: string
  key: string
  title_key: string
  subtitle_key: string
  badge: string
  color: string
  url: string
  cta_key: string
  order: number
  active: boolean
}

interface ZoneCard {
  id: string
  zone_id: string
  title_key: string
  description_key: string
  badge_key?: string
  image_url?: string
  order: number
  active: boolean
}

export default function AdminSolutionsPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalFields, setModalFields] = useState<any[]>([])
  const [modalData, setModalData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ type: string, id: string, name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, zonesRes, cardsRes, settingsRes] = await Promise.all([
        fetch('/api/local/texts'),
        fetch('/api/local/zones'),
        fetch('/api/local/cards'),
        fetch('/api/local/settings')
      ])
      const textsData = await textsRes.json()
      const zonesData = await zonesRes.json()
      const cardsData = await cardsRes.json()
      const settingsData = await settingsRes.json()

      setTexts(textsData.texts || [])
      setZones(zonesData.zones || [])
      setCards(cardsData.cards || [])
      if (settingsData.settings) setSettings(settingsData.settings)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const openEdit = (type: string, item: any, title: string, fields: any[]) => {
    setModalType(type)
    setModalTitle(title)

    let data = { ...item }
    if (type === 'zone') {
      data.title_text = texts.find(t => t.key === item.title_key) || { key: item.title_key, fr: '' }
      data.subtitle_text = texts.find(t => t.key === item.subtitle_key) || { key: item.subtitle_key, fr: '' }
    } else if (type === 'card') {
      data.title_text = texts.find(t => t.key === item.title_key) || { key: item.title_key, fr: '' }
      data.description_text = texts.find(t => t.key === item.description_key) || { key: item.description_key, fr: '' }
    }

    setModalFields(fields)
    setModalData(data)
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any) => {
    setSaving(true)
    try {
      let endpoint = '', method = 'POST', body = savedData || modalData

      if (modalType === 'settings') {
        endpoint = '/api/local/settings'
        method = 'PUT'
      } else if (modalType === 'text') {
        endpoint = '/api/local/texts'
        method = 'PUT'
      } else if (modalType === 'text-solutions') {
        // Multi-save for page header
        if (body.title) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title) })
        if (body.subtitle) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.subtitle) })
        setModalOpen(false)
        await fetchData()
        return
      } else if (modalType === 'zone') {
        // Cascade save texts
        if (body.title_text) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title_text) })
        if (body.subtitle_text) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.subtitle_text) })

        endpoint = body.id ? `/api/local/zones/${body.id}` : '/api/local/zones'
        method = body.id ? 'PUT' : 'POST'
      } else if (modalType === 'card') {
        // Cascade save texts
        if (body.title_text) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title_text) })
        if (body.description_text) await fetch('/api/local/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.description_text) })

        endpoint = body.id ? `/api/local/cards/${body.id}` : '/api/local/cards'
        method = body.id ? 'PUT' : 'POST'
      }

      if (!endpoint) throw new Error('Invalid modal type')

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error('Erreur lors de la sauvegarde')

      await fetchData()
      setModalOpen(false)
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  const handleAddZone = async () => {
    setSaving(true)
    try {
      const timestamp = Date.now()
      const titleKey = `zone_title_${timestamp}`
      const subtitleKey = `zone_subtitle_${timestamp}`

      // Initialize texts
      await Promise.all([
        fetch('/api/local/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: titleKey, fr: 'Nouvelle Zone', section: 'solutions' })
        }),
        fetch('/api/local/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: subtitleKey, fr: 'Sous-titre de la zone', section: 'solutions' })
        })
      ])

      const res = await fetch('/api/local/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: `zone_${timestamp}`,
          title_key: titleKey,
          subtitle_key: subtitleKey,
          badge: 'NEW',
          color: 'sky',
          order: zones.length + 1,
          active: true
        })
      })

      if (!res.ok) throw new Error('Failed to create zone')
      await fetchData()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la création de la zone')
    } finally {
      setSaving(true)
      setTimeout(() => setSaving(false), 500)
    }
  }

  const handleAddCard = async (zoneId: string) => {
    setSaving(true)
    try {
      const timestamp = Date.now()
      const titleKey = `card_title_${timestamp}`
      const descKey = `card_desc_${timestamp}`

      await Promise.all([
        fetch('/api/local/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: titleKey, fr: 'Nouveau Module', section: 'solutions' })
        }),
        fetch('/api/local/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: descKey, fr: 'Description du module', section: 'solutions' })
        })
      ])

      const res = await fetch('/api/local/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: zoneId,
          title_key: titleKey,
          description_key: descKey,
          order: cards.filter(c => c.zone_id === zoneId).length + 1,
          active: true
        })
      })

      if (!res.ok) throw new Error('Failed to create card')
      await fetchData()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la création du module')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleting(true)
    try {
      let endpoint = ''
      if (deleteItem.type === 'zone') endpoint = `/api/local/zones/${deleteItem.id}`
      else if (deleteItem.type === 'card') endpoint = `/api/local/cards/${deleteItem.id}`
      await fetch(endpoint, { method: 'DELETE' })
      await fetchData()
      setDeleteOpen(false)
      setDeleteItem(null)
    } catch (error) { console.error('Error:', error) }
    finally { setDeleting(false) }
  }

  const getText = (key: string): string => texts.find(t => t.key === key)?.fr || key

  const zoneFields = [
    { name: 'title_text', label: 'Titre de la Zone', type: 'languages' },
    { name: 'subtitle_text', label: 'Description/Accroche', type: 'languages' },
    { name: 'badge', label: 'Badge (ex: NEW)', type: 'text' },
    {
      name: 'color', label: 'Couleur', type: 'select', options: [
        { value: 'sky', label: 'Sky (Bleu)' }, { value: 'indigo', label: 'Indigo' }, { value: 'emerald', label: 'Emeraud' }
      ]
    },
    { name: 'url', label: 'Lien CTA (facultatif)', type: 'url' },
    { name: 'order', label: 'Ordre d\'affichage', type: 'number' },
    { name: 'active', label: 'Afficher sur le site', type: 'boolean' }
  ]

  const cardFields = [
    { name: 'title_text', label: 'Titre du Module', type: 'languages' },
    { name: 'description_text', label: 'Description détaillée', type: 'languages' },
    { name: 'badge_key', label: 'Badge (facultatif)', type: 'text' },
    { name: 'image_url', label: 'Image', type: 'image-upload' },
    { name: 'order', label: 'Ordre', type: 'number' },
    { name: 'active', label: 'Actif', type: 'boolean' }
  ]

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

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
          <Link href="/admin/solutions" className="text-sky-400 font-medium">Solutions</Link>
          <Link href="/admin/produits" className="text-slate-400 hover:text-sky-400">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-sky-400">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-sky-400">Contact</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Solutions</h1>

        {/* Design Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Design
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                    <span className="text-sky-400 text-lg" style={{ color: settings?.site?.primary_color }}>Aa</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Couleurs</p>
                    <p className="text-slate-400 text-xs">Site, Hero, Boutons</p>
                  </div>
                </div>
                <AdminButton showEdit onEdit={() => openEdit('settings', { site: settings?.site || {} }, 'Couleurs du site', [
                  { name: 'primary_color', label: 'Couleur primaire', type: 'color' },
                  { name: 'secondary_color', label: 'Couleur secondaire', type: 'color' },
                  { name: 'accent_color', label: 'Couleur accent', type: 'color' },
                  { name: 'background_color', label: 'Couleur fond', type: 'color' },
                  { name: 'text_color', label: 'Couleur texte', type: 'color' }
                ].map(f => ({ ...f, name: `site.${f.name}` })))} />
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
                    <p className="text-slate-400 text-xs">Style, Transparent, Flou</p>
                  </div>
                </div>
                <AdminButton showEdit onEdit={() => openEdit('settings', { header: settings?.header || {} }, 'Paramètres Header', [
                  { name: 'style', label: 'Style', type: 'select', options: [{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solide' }, { value: 'transparent', label: 'Transparent' }] },
                  { name: 'transparent', label: 'Transparent', type: 'boolean' },
                  { name: 'blur', label: 'Flou', type: 'boolean' },
                  { name: 'sticky', label: 'Fixe', type: 'boolean' },
                  { name: 'shadow', label: 'Ombre', type: 'boolean' }
                ].map(f => ({ ...f, name: `header.${f.name}` })))} />
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
                    <p className="text-slate-400 text-xs">Style, Réseaux sociaux</p>
                  </div>
                </div>
                <AdminButton showEdit onEdit={() => openEdit('settings', { footer: settings?.footer || {} }, 'Paramètres Footer', [
                  { name: 'enabled', label: 'Actif', type: 'boolean' },
                  { name: 'style', label: 'Style', type: 'select', options: [{ value: 'dark', label: 'Sombre' }, { value: 'light', label: 'Clair' }, { value: 'glass', label: 'Glass' }] },
                  { name: 'background_color', label: 'Couleur fond', type: 'color' },
                  { name: 'show_socials', label: 'Réseaux sociaux', type: 'boolean' },
                  { name: 'show_copyright', label: 'Copyright', type: 'boolean' }
                ].map(f => ({ ...f, name: `footer.${f.name}` })))} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Titre de la page</h2>
          <div className="glass p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{getText('solutions_title')}</p>
              <p className="text-slate-400 text-sm">{getText('solutions_subtitle')}</p>
            </div>
            <button onClick={() => openEdit('text-solutions', {
              title: texts.find(t => t.key === 'solutions_title') || { key: 'solutions_title', section: 'solutions', fr: '' },
              subtitle: texts.find(t => t.key === 'solutions_subtitle') || { key: 'solutions_subtitle', section: 'solutions', fr: '' }
            }, 'En-tête Solutions', [
              { name: 'title', label: 'Titre de la page', type: 'languages' },
              { name: 'subtitle', label: 'Sous-titre / Description', type: 'languages' }
            ])} className="px-3 py-1 bg-sky-500 text-white rounded text-sm hover:bg-sky-400">Modifier l'en-tête</button>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Zones</h2>
            <button
              disabled={saving}
              onClick={handleAddZone}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Création...' : '+ Ajouter une Zone'}
            </button>
          </div>
          <div className="space-y-4">
            {zones.filter(z => z.active).sort((a, b) => a.order - b.order).map(zone => (
              <div key={zone.id} className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${zone.color === 'indigo' ? 'bg-indigo-500' : 'bg-sky-500'} text-white`}>
                      {zone.badge}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{getText(zone.title_key)}</h3>
                      <p className="text-slate-400">{getText(zone.subtitle_key)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AdminButton showEdit onEdit={() => openEdit('zone', zone, 'Modifier la Zone', zoneFields)} showDelete onDelete={() => setDeleteItem({ type: 'zone', id: zone.id, name: zone.title_key })} />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm">Modules ({cards.filter(c => c.zone_id === zone.id).length})</span>
                    <button
                      disabled={saving}
                      onClick={() => handleAddCard(zone.id)}
                      className="text-sky-400 text-sm hover:text-sky-300 font-bold disabled:opacity-50"
                    >
                      {saving ? '...' : '+ Ajouter'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cards.filter(c => c.zone_id === zone.id).sort((a, b) => a.order - b.order).map(card => (
                      <div key={card.id} className="bg-white/5 p-4 rounded-xl relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                          <button onClick={() => openEdit('card', card, 'Modifier le Module', cardFields)} className="p-1.5 bg-sky-500 rounded text-white text-xs">✏️</button>
                          <button onClick={() => setDeleteItem({ type: 'card', id: card.id, name: card.title_key })} className="p-1.5 bg-red-500 rounded text-white text-xs">🗑️</button>
                        </div>
                        {card.image_url && <img src={card.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                        <h4 className="font-bold text-white text-sm">{getText(card.title_key)}</h4>
                        <p className="text-slate-400 text-xs line-clamp-2">{getText(card.description_key)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
      <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Confirmer la suppression" message={`Voulez-vous vraiment supprimer "${deleteItem?.name}" ?`} deleting={deleting} />
    </div>
  )
}
