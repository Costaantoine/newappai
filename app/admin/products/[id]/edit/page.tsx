'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  active: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const productId = params?.id as string
    if (productId) {
      fetchProduct(productId)
    }
  }, [params?.id])

  const fetchProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`)
    const data = await res.json()
    if (data.product) {
      setProduct(data.product)
      setTitle(data.product.title)
      setDescription(data.product.description || '')
      setPrice((data.product.price / 100).toFixed(2))
      setCategory(data.product.category || '')
      setActive(data.product.active)
      setImages(data.product.images || [])
    }
    setLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', files[0])

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        setImages([...images, data.url])
      } else {
        alert(data.error || 'Erreur lors du téléchargement')
      }
    } catch {
      alert('Erreur lors du téléchargement de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const productId = params?.id as string

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: Math.round(parseFloat(price) * 100),
          images,
          category,
          active,
        }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        alert('Erreur lors de la mise à jour du produit')
      }
    } catch {
      alert('Erreur lors de la mise à jour du produit')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Produit non trouvé</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="glass py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter">
          <Link href="/admin/dashboard">
            <span className="text-white">NewApp</span>
            <span className="text-sky-400">AI</span>
            <span className="text-slate-400 text-lg ml-2">Admin</span>
          </Link>
        </div>
        <Link href="/admin/dashboard" className="text-slate-300 hover:text-sky-400 transition">
          ← Retour
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Modifier le produit</h1>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-[2rem] space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Images (gratuit - Imgur)</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-white/20 rounded-xl py-8 text-slate-400 hover:border-sky-500 hover:text-sky-400 transition"
            >
              {uploading ? 'Téléchargement...' : '+ Ajouter une image'}
            </button>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((url, index) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="active" className="text-slate-300">Produit actif (visible sur le site)</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sky-500 text-white py-3 rounded-full font-bold hover:bg-sky-400 transition disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </main>
    </div>
  )
}
