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
  site_url: string
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

  const [testimonials, setTestimonials] = useState<any[]>([])
  const [testimonialDelay, setTestimonialDelay] = useState(5000)
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [testimonialUploading, setTestimonialUploading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, zonesRes, cardsRes, settingsRes] = await Promise.all([
        fetch('/api/supabase/texts'),
        fetch('/api/supabase/zones'),
        fetch('/api/supabase/cards'),
        fetch('/api/supabase/settings')
      ])
      const textsData = await textsRes.json()
      const zonesData = await zonesRes.json()
      const cardsData = await cardsRes.json()
      const settingsData = await settingsRes.json()

      setTexts(textsData.texts || [])
      setZones(zonesData.zones || [])
      setCards(cardsData.cards || [])
      if (settingsData.settings) {
        setSettings(settingsData.settings)
        if (settingsData.settings.testimonials && settingsData.settings.testimonials.length > 0) {
          setTestimonials(settingsData.settings.testimonials)
        } else {
          // Auto-migrate from text keys
          const t1 = textsData.texts?.find((t: any) => t.key === 'testimonial_1_title')
          const t2 = textsData.texts?.find((t: any) => t.key === 'testimonial_2_title')
          const d1 = textsData.texts?.find((t: any) => t.key === 'testimonial_1_desc')
          const d2 = textsData.texts?.find((t: any) => t.key === 'testimonial_2_desc')
          const defaultTestimonials = [
            { id: '1', title: t1?.fr || 'Miguel Bras', description: d1?.fr || '', image_url: '' },
            { id: '2', title: t2?.fr || 'Pizzeria Portugal', description: d2?.fr || '', image_url: '' },
          ]
          setTestimonials(defaultTestimonials)
          // Save to settings
          fetch('/api/supabase/settings', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...settingsData.settings, testimonials: defaultTestimonials, testimonial_autoPlayDelay: settingsData.settings.testimonial_autoPlayDelay || 5000 })
          }).catch(() => {})
        }
        if (settingsData.settings.testimonial_autoPlayDelay) setTestimonialDelay(settingsData.settings.testimonial_autoPlayDelay)
      }
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

      // Extraire l'URL réelle depuis le format JSON de l'ImageUploader
      const extractUrl = (v: any) => {
        if (typeof v === 'string' && v.startsWith('{')) {
          try { const p = JSON.parse(v); return p.original || p.thumbnail || v } catch { return v }
        }
        return v || ''
      }
      if (body.icon_url) body.icon_url = extractUrl(body.icon_url)
      if (body.image_url) body.image_url = extractUrl(body.image_url)
      if (body.site_url) body.site_url = extractUrl(body.site_url)

      if (modalType === 'settings') {
        endpoint = '/api/supabase/settings'
        method = 'PUT'
      } else if (modalType === 'text') {
        endpoint = '/api/supabase/texts'
        method = 'PUT'
      } else if (modalType === 'text-solutions') {
        // Multi-save for page header
        if (body.title) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title) })
        if (body.subtitle) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.subtitle) })
        setModalOpen(false)
        await fetchData()
        return
      } else if (modalType === 'zone') {
        // Cascade save texts
        if (body.title_text) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title_text) })
        if (body.subtitle_text) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.subtitle_text) })

        endpoint = body.id ? `/api/supabase/zones?id=${body.id}` : '/api/supabase/zones'
        method = body.id ? 'PUT' : 'POST'
      } else if (modalType === 'card') {
        // Cascade save texts
        if (body.title_text) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.title_text) })
        if (body.description_text) await fetch('/api/supabase/texts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.description_text) })

        endpoint = body.id ? `/api/supabase/cards?id=${body.id}` : '/api/supabase/cards'
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

  const saveTestimonialsToSettings = async (updated: any[], delay: number) => {
    try {
      await fetch('/api/supabase/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, testimonials: updated, testimonial_autoPlayDelay: delay })
      })
      await fetchData()
    } catch (error) {
      console.error('Error saving testimonials:', error)
      alert('Erreur lors de la sauvegarde des témoignages')
    }
  }

  const handleAddTestimonial = () => {
    setEditingTestimonial({ title: '', description: '', image_url: '' })
    setTestimonialModalOpen(true)
  }

  const handleEditTestimonial = (t: any) => {
    setEditingTestimonial({ ...t })
    setTestimonialModalOpen(true)
  }

  const handleSaveTestimonial = async () => {
    if (!editingTestimonial.title) { alert('Le titre est requis'); return }
    setTestimonialUploading(true)
    try {
      let updated = [...testimonials]
      if (editingTestimonial.id) {
        const idx = updated.findIndex(t => t.id === editingTestimonial.id)
        if (idx >= 0) updated[idx] = { ...editingTestimonial }
      } else {
        updated.push({ ...editingTestimonial, id: Date.now().toString() })
      }
      setTestimonials(updated)
      await saveTestimonialsToSettings(updated, testimonialDelay)
      setTestimonialModalOpen(false)
      setEditingTestimonial(null)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setTestimonialUploading(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    const updated = testimonials.filter(t => t.id !== id)
    setTestimonials(updated)
    await saveTestimonialsToSettings(updated, testimonialDelay)
  }

  const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setEditingTestimonial((prev: any) => ({ ...prev, image_url: data.url }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Erreur upload image')
    }
    e.target.value = ''
  }

  const handleAddZone = async () => {
    setSaving(true)
    try {
      const timestamp = Date.now()
      const titleKey = `zone_title_${timestamp}`
      const subtitleKey = `zone_subtitle_${timestamp}`

      // Initialize texts
      await Promise.all([
        fetch('/api/supabase/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: titleKey, fr: 'Nouvelle Zone', section: 'solutions' })
        }),
        fetch('/api/supabase/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: subtitleKey, fr: 'Sous-titre de la zone', section: 'solutions' })
        })
      ])

      const res = await fetch('/api/supabase/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: `zone_${timestamp}`,
          title_key: titleKey,
          subtitle_key: subtitleKey,
          badge: 'NEW',
          color: 'violet',
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
        fetch('/api/supabase/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: titleKey, fr: 'Nouveau Module', section: 'solutions' })
        }),
        fetch('/api/supabase/texts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: descKey, fr: 'Description du module', section: 'solutions' })
        })
      ])

      const res = await fetch('/api/supabase/cards', {
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
      if (deleteItem.type === 'zone') endpoint = `/api/supabase/zones?id=${deleteItem.id}`
      else if (deleteItem.type === 'card') endpoint = `/api/supabase/cards?id=${deleteItem.id}`
      await fetch(endpoint, { method: 'DELETE' })
      await fetchData()
      setDeleteOpen(false)
      setDeleteItem(null)
    } catch (error) { console.error('Error:', error) }
    finally { setDeleting(false) }
  }

  const getText = (key: string): string => texts.find(t => t.key === key)?.fr || key

  const imgUrl = (url: string): string => {
    if (!url || !url.startsWith('{')) return url
    try { const p = JSON.parse(url); return p.original || p.thumbnail || url } catch { return url }
  }

  const zoneFields = [
    { name: 'title_text', label: 'Titre de la Zone', type: 'languages' },
    { name: 'subtitle_text', label: 'Description/Accroche', type: 'languages' },
    { name: 'badge', label: 'Badge (ex: NEW)', type: 'text' },
    {
      name: 'color', label: 'Couleur', type: 'select', options: [
        { value: 'violet', label: 'Violet' }, { value: 'purple', label: 'Pourpre' }, { value: 'emerald', label: 'Emeraud' }
      ]
    },
    { name: 'url', label: 'Lien page de destination (interne)', type: 'text', placeholder: '/produits' },
    { name: 'site_url', label: 'Lien du site internet associé (externe)', type: 'url', placeholder: 'https://...' },
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
            <span className="text-white">NewApp</span><span className="text-violet-400">AI</span>
          </span>
          <span className="text-slate-400">Admin</span>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link href="/admin/accueil" className="text-slate-400 hover:text-violet-400">Accueil</Link>
          <Link href="/admin/solutions" className="text-violet-400 font-medium">Solutions</Link>
          <Link href="/admin/produits" className="text-slate-400 hover:text-violet-400">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-violet-400">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-violet-400">Contact</Link>
          <Link href="/admin/autres" className="text-slate-400 hover:text-violet-400">Autres</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Solutions</h1>



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
            ])} className="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400">Modifier l'en-tête</button>
          </div>
        </section>

        {/* Témoignages */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Témoignages</h2>
            <button onClick={handleAddTestimonial} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 font-bold flex items-center gap-2 text-sm">
              + Ajouter un témoignage
            </button>
          </div>

          {/* Délai de défilement */}
          <div className="glass p-4 rounded-xl mb-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Délai de défilement</p>
              <p className="text-slate-400 text-sm">Temps entre chaque témoignage en millisecondes</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" value={testimonialDelay}
                onChange={(e) => setTestimonialDelay(parseInt(e.target.value) || 5000)}
                onBlur={() => saveTestimonialsToSettings(testimonials, testimonialDelay)}
                className="w-24 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-center" />
              <span className="text-slate-400 text-sm">ms</span>
            </div>
          </div>

          {/* Liste des témoignages */}
          {testimonials.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucun témoignage. Cliquez sur "+ Ajouter un témoignage" pour commencer.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <div key={t.id || i} className="glass p-4 rounded-xl relative group">
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEditTestimonial(t)} className="p-1.5 bg-violet-500 rounded text-white text-xs">✏️</button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 bg-red-500 rounded text-white text-xs">🗑️</button>
                  </div>
                  <div className="flex items-center gap-4">
                    {t.image_url ? (
                      <img src={imgUrl(t.image_url)} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center text-slate-500 text-2xl">
                        {t.title?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{t.title}</p>
                      <p className="text-slate-400 text-sm line-clamp-2">{t.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal témoignage */}
        {testimonialModalOpen && editingTestimonial && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={() => setTestimonialModalOpen(false)}>
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-white/10" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">{editingTestimonial.id ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Titre *</label>
                  <input type="text" value={editingTestimonial.title}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, title: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="Miguel Bras" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Description</label>
                  <textarea value={editingTestimonial.description}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, description: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-24" placeholder="Témoignage..." />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Image / Logo</label>
                  <input type="file" accept="image/*" onChange={handleTestimonialImageUpload}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  {testimonialUploading && <p className="text-violet-400 text-xs mt-1">Upload en cours...</p>}
                  {editingTestimonial.image_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={editingTestimonial.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <button onClick={() => setEditingTestimonial((prev: any) => ({ ...prev, image_url: '' }))}
                        className="text-red-400 text-xs hover:text-red-300">Supprimer</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleSaveTestimonial} disabled={testimonialUploading}
                  className="flex-1 bg-violet-500 text-white py-2 rounded-lg font-bold hover:bg-violet-400 disabled:opacity-50">
                  {testimonialUploading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button onClick={() => { setTestimonialModalOpen(false); setEditingTestimonial(null) }}
                  className="px-6 py-2 text-slate-400 hover:text-white">Annuler</button>
              </div>
            </div>
          </div>
        )}

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
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${zone.color === 'purple' ? 'bg-purple-500' : 'bg-violet-500'} text-white`}>
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
                      className="text-violet-400 text-sm hover:text-violet-300 font-bold disabled:opacity-50"
                    >
                      {saving ? '...' : '+ Ajouter'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cards.filter(c => c.zone_id === zone.id).sort((a, b) => a.order - b.order).map(card => (
                      <div key={card.id} className="bg-white/5 p-4 rounded-xl relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                          <button onClick={() => openEdit('card', card, 'Modifier le Module', cardFields)} className="p-1.5 bg-violet-500 rounded text-white text-xs">✏️</button>
                          <button onClick={() => setDeleteItem({ type: 'card', id: card.id, name: card.title_key })} className="p-1.5 bg-red-500 rounded text-white text-xs">🗑️</button>
                        </div>
                        {card.image_url && <img src={imgUrl(card.image_url)} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
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
