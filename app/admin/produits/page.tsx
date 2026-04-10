'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EditModal from '@/components/admin/EditModal'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import AdminButton from '@/components/admin/AdminButton'
import Lightbox from '@/components/admin/Lightbox'
import ImageSettingsPanel from '@/components/admin/ImageSettingsPanel'
import ImageUploader from '@/components/admin/ImageUploader'

interface Product {
  id: string
  title: { fr: string; en: string; pt: string; es: string }
  description: { fr: string; en: string; pt: string; es: string }
  price: number
  images: string[]
  image_settings?: Record<string, { opacity?: number; brightness?: number; contrast?: number; saturation?: number; sepia?: number }>
  category: string
  active: boolean
  order: number
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
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

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [imageSettingsOpen, setImageSettingsOpen] = useState(false)
  const [imageSettingsProduct, setImageSettingsProduct] = useState<Product | null>(null)
  const [imageSettingsIndex, setImageSettingsIndex] = useState(0)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, settingsRes] = await Promise.all([
        fetch('/api/local/products'),
        fetch('/api/local/settings')
      ])
      const productsData = await productsRes.json()
      const settingsData = await settingsRes.json()
      setProducts((productsData.products || []).filter((p: Product) => p.active !== false))
      if (settingsData.settings) setSettings(settingsData.settings)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const openEdit = (type: string, item: any, title: string, fields: any[]) => {
    setModalType(type)
    setModalTitle(title)
    setModalFields(fields)
    // Convert cents to Euros for the UI
    const data = { ...item }
    if (type === 'product' && typeof data.price === 'number') {
      data.price = data.price / 100
    }
    setModalData(data)
    setModalOpen(true)
  }

  const openAdd = (type: string, title: string, fields: any[], defaults: any = {}) => {
    setModalType(type)
    setModalTitle(title)
    setModalFields(fields)
    // Convert default price to Euros
    const initialData = {
      title: { fr: '', en: '', pt: '', es: '' },
      description: { fr: '', en: '', pt: '', es: '' },
      images: [],
      ...defaults
    }
    if (type === 'product' && typeof initialData.price === 'number') {
      initialData.price = initialData.price / 100
    }
    setModalData(initialData)
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any) => {
    setSaving(true)
    try {
      let endpoint = '', method = 'POST', body: any = savedData || modalData

      if (modalType === 'settings') {
        endpoint = '/api/local/settings'
        method = 'PUT'
      } else if (modalType === 'product') {
        // Convert Euros back to cents for the DB
        if (typeof body.price === 'number') {
          body.price = Math.round(body.price * 100)
        }
        endpoint = body.id ? `/api/local/products/${body.id}` : '/api/local/products'
        method = body.id ? 'PUT' : 'POST'
      }

      const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      console.log('Save result:', data)
      fetchData()
      setModalOpen(false)
    } catch (error) { console.error('Error:', error) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleting(true)
    try {
      let endpoint = `/api/local/products/${deleteItem.id}`
      await fetch(endpoint, { method: 'DELETE' })
      fetchData()
      setDeleteOpen(false)
      setDeleteItem(null)
    } catch (error) { console.error('Error:', error) }
    finally { setDeleting(false) }
  }

  const handleImageSettings = (product: Product, index: number) => {
    setImageSettingsProduct(product)
    setImageSettingsIndex(index)
    setImageSettingsOpen(true)
  }

  const saveImageSettings = async (newSettings: any) => {
    if (!imageSettingsProduct) return
    const updatedSettings = {
      ...(imageSettingsProduct.image_settings || {}),
      [imageSettingsIndex]: newSettings
    }
    const updatedProduct = { ...imageSettingsProduct, image_settings: updatedSettings }

    await fetch(`/api/local/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    })
    fetchData()
  }

  const formatPrice = (cents: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const getImageUrl = (imgData: string): string => {
    if (!imgData) return ''
    try {
      const parsed = JSON.parse(imgData)
      return parsed.thumbnail || parsed.original || imgData
    } catch {
      return imgData
    }
  }

  const getFullImageUrl = (imgData: string): string => {
    if (!imgData) return ''
    try {
      const parsed = JSON.parse(imgData)
      return parsed.original || parsed.thumbnail || imgData
    } catch {
      return imgData
    }
  }

  const productFields = [
    { name: 'images.0', label: 'Image Produit', type: 'image-upload' },
    { name: 'title', label: 'Titre', type: 'languages' },
    { name: 'description', label: 'Description', type: 'languages' },
    { name: 'price', label: 'Prix (€)', type: 'number' },
    { name: 'category', label: 'Categorie', type: 'text' },
    { name: 'order', label: 'Ordre', type: 'number' }
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
          <Link href="/admin/solutions" className="text-slate-400 hover:text-sky-400">Solutions</Link>
          <Link href="/admin/produits" className="text-sky-400 font-medium">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-sky-400">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-sky-400">Contact</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">

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
                <button onClick={() => openEdit('settings', { site: settings?.site || {} }, 'Couleurs', [
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
                <button onClick={() => openEdit('settings', { header: settings?.header || {} }, 'Header', [
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
                <button onClick={() => openEdit('settings', { footer: settings?.footer || {} }, 'Footer', [
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
                <button onClick={() => openEdit('settings', { animations: settings?.animations || {} }, 'Animations', [
                  { name: 'animations.enabled', label: 'Activé', type: 'boolean' },
                  { name: 'animations.page_transition', label: 'Transition', type: 'select', options: [{ value: 'fade', label: 'Fondu' }, { value: 'slide', label: 'Glissement' }, { value: 'none', label: 'Aucune' }] }
                ])} className="p-2 bg-sky-500 rounded-lg text-white hover:bg-sky-400">✏️</button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Administration - Produits</h1>
          <AdminButton showAdd addLabel="Produit" onAdd={() => openAdd('product', 'Ajouter un Produit', productFields, { price: 9900, order: products.length + 1, active: true })} />
        </div>

        {products.length === 0 ? (
          <div className="glass p-8 rounded-2xl text-center">
            <p className="text-slate-400">Aucun produit</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.sort((a, b) => a.order - b.order).map(product => {
              const imgSettings = product.image_settings?.[0] || {}
              return (
                <div key={product.id} className="glass p-6 rounded-2xl relative">
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <AdminButton showEdit onEdit={() => openEdit('product', product, 'Modifier le Produit', productFields)} showDelete onDelete={() => setDeleteItem({ type: 'product', id: product.id, name: product.title?.fr || product.title?.en || 'Produit' })} />
                  </div>

                  {/* Image with thumbnail, lightbox, and settings */}
                  {product.images && product.images[0] && (
                    <div className="relative mb-4 group">
                      <div
                        className="relative w-full h-40 cursor-pointer rounded-xl overflow-hidden"
                        onClick={() => setLightboxSrc(getFullImageUrl(product.images[0]))}
                      >
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.title?.fr || product.title?.en || ''}
                          className="w-full h-full object-cover"
                          style={{
                            opacity: (imgSettings.opacity ?? 100) / 100,
                            filter: `
                              brightness(${(imgSettings.brightness ?? 100) / 100})
                              contrast(${(imgSettings.contrast ?? 100) / 100})
                              saturate(${(imgSettings.saturation ?? 100) / 100})
                              sepia(${(imgSettings.sepia ?? 0) / 100})
                            `
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Agrandir</span>
                        </div>
                      </div>
                      {/* Image settings button */}
                      <button
                        onClick={() => handleImageSettings(product, 0)}
                        className="absolute bottom-2 right-2 p-1.5 bg-slate-800/80 rounded-lg text-white hover:bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Réglage image"
                      >
                        🎨
                      </button>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-white mb-2">
                    {typeof product.title === 'string' ? product.title : (product.title?.fr || product.title?.en || 'Sans titre')}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description?.fr?.replace(/<[^>]*>/g, '') || ''}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sky-400 font-bold text-xl">{formatPrice(product.price)}</span>
                    <span className="text-xs text-slate-500">{product.category}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>


      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data) => handleSave(data)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
      <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Confirmer la suppression" message={`Voulez-vous vraiment supprimer "${deleteItem?.name}" ?`} deleting={deleting} />

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      {imageSettingsOpen && imageSettingsProduct && (
        <ImageSettingsPanel
          imageUrl={getFullImageUrl(imageSettingsProduct.images?.[imageSettingsIndex])}
          settings={imageSettingsProduct.image_settings?.[imageSettingsIndex] || {}}
          onChange={saveImageSettings}
          onClose={() => setImageSettingsOpen(false)}
        />
      )}
    </div>
  )
}
