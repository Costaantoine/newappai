'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/lib/firebase'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth')
    const data = await res.json()
    if (!data.isAdmin) {
      router.push('/admin/login')
    } else {
      setIsAdmin(true)
    }
  }

  const fetchProducts = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen">
      <header className="glass py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-white">NewApp</span>
          <span className="text-sky-400">AI</span>
          <span className="text-slate-400 text-lg ml-2">Admin</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/products/new" className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-400 transition">
            + Nouveau produit
          </Link>
          <Link href="/admin/texts" className="text-slate-300 hover:text-sky-400 transition border border-white/20 px-4 py-2 rounded-full">
            Textes
          </Link>
          <Link href="/admin/zones" className="text-slate-300 hover:text-sky-400 transition border border-white/20 px-4 py-2 rounded-full">
            Zones
          </Link>
          <Link href="/" className="text-slate-300 hover:text-sky-400 transition">
            Voir le site
          </Link>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition">
            Deconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Gestion des produits</h1>

        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : products.length === 0 ? (
          <div className="glass p-10 rounded-[2rem] text-center">
            <p className="text-slate-400 mb-4">Aucun produit pour le moment</p>
            <Link href="/admin/products/new" className="text-sky-400 hover:text-sky-300 font-bold">
              Créer le premier produit →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Image</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Titre</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Catégorie</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Prix</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Statut</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                          ?
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-medium">{product.title}</td>
                    <td className="py-4 px-4 text-slate-400">{product.category || '-'}</td>
                    <td className="py-4 px-4 text-sky-400 font-bold">{formatPrice(product.price)}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleActive(product.id, !product.active)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {product.active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sky-400 hover:text-sky-300 transition"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
