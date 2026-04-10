'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SiteText {
  id: string
  key: string
  fr: string
  en: string
  pt: string
  es: string
  section: string
  type?: string
  category?: string
}

export default function UnifiedTextsManager() {
  const [texts, setTexts] = useState<SiteText[]>([])
  const [solutions, setSolutions] = useState<SiteText[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingItem, setEditingItem] = useState<SiteText | null>(null)
  const [newItem, setNewItem] = useState({ key: '', fr: '', en: '', pt: '', es: '', section: 'general', type: 'description', category: 'general' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'texts' | 'solutions'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const checkAuth = async () => {
    const res = await fetch('/api/auth')
    const data = await res.json()
    if (!data.isAdmin) {
      router.push('/admin/login')
    } else {
      setIsAdmin(true)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, solutionsRes] = await Promise.all([
        fetch('/api/texts'),
        fetch('/api/solutions')
      ])
      const textsData = await textsRes.json()
      const solutionsData = await solutionsRes.json()
      setTexts(textsData.texts || [])
      setSolutions(solutionsData.solutions || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const allItems = [...texts, ...solutions].map(item => ({ ...item, source: texts.find(t => t.id === item.id) ? 'texts' : 'solutions' }))

  const filteredItems = allItems.filter(item => {
    const matchesTab = activeTab === 'all' || (activeTab === 'texts' && texts.find(t => t.id === item.id)) || (activeTab === 'solutions' && solutions.find(s => s.id === item.id))
    const matchesSearch = !searchQuery || item.key.toLowerCase().includes(searchQuery.toLowerCase()) || item.fr.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleSave = async () => {
    if (!editingItem) return

    const isFromTexts = texts.find(t => t.id === editingItem.id)
    const endpoint = isFromTexts ? `/api/texts/${editingItem.id}` : `/api/solutions/${editingItem.id}`

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fr: editingItem.fr,
          en: editingItem.en,
          pt: editingItem.pt,
          es: editingItem.es
        })
      })

      if (res.ok) {
        fetchData()
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce texte ?')) return

    const isFromTexts = texts.find(t => t.id === id)
    const endpoint = isFromTexts ? `/api/texts/${id}` : `/api/solutions/${id}`

    try {
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleAddNew = async () => {
    if (!newItem.key || !newItem.fr) {
      alert('La clé et le texte français sont requis')
      return
    }

    const section = newItem.category === 'digismart' || newItem.category === 'industrie' ? 'solutions' : 'texts'
    const endpoint = section === 'texts' ? '/api/texts' : '/api/solutions'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })

      if (res.ok) {
        fetchData()
        setShowAddForm(false)
        setNewItem({ key: '', fr: '', en: '', pt: '', es: '', section: 'general', type: 'description', category: 'general' })
      }
    } catch (error) {
      console.error('Error adding:', error)
      alert('Erreur lors de l\'ajout')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = item.category || item.section || 'general'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, SiteText[]>)

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
          <Link href="/" className="text-slate-300 hover:text-sky-400 transition">
            Voir le site
          </Link>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Textes</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-400 transition"
          >
            + Nouveau texte
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full ${activeTab === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Tous les textes
          </button>
          <button
            onClick={() => setActiveTab('texts')}
            className={`px-4 py-2 rounded-full ${activeTab === 'texts' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Textes du site
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-2 rounded-full ${activeTab === 'solutions' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Solutions
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white mb-6"
        />

        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <div className="glass p-10 rounded-[2rem] text-center">
            <p className="text-slate-400">Aucun texte trouvé</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="glass p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-sky-400 mb-4 capitalize">{category}</h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start py-3 border-b border-white/5 last:border-0">
                      <div className="flex-1">
                        <p className="text-white font-mono text-sm">{item.key}</p>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{item.fr}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {texts.find(t => t.id === item.id) ? 'Texte' : 'Solution'} • {item.type || 'general'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-sky-400 hover:text-sky-300 text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Nouveau texte</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-slate-400 text-sm">Clé *</label>
                <input
                  type="text"
                  value={newItem.key}
                  onChange={(e) => setNewItem({...newItem, key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="mon_texte"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Catégorie</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="general">General</option>
                  <option value="digismart">DigiSmart</option>
                  <option value="industrie">Industrie</option>
                  <option value="nav">Navigation</option>
                  <option value="home">Accueil</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-sm">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="description">Description</option>
                <option value="title">Titre</option>
                <option value="subtitle">Sous-titre</option>
                <option value="badge">Badge</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-sm">Français *</label>
              <textarea
                value={newItem.fr}
                onChange={(e) => setNewItem({...newItem, fr: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-slate-400 text-sm">Anglais</label>
                <textarea
                  value={newItem.en}
                  onChange={(e) => setNewItem({...newItem, en: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Portugais</label>
                <textarea
                  value={newItem.pt}
                  onChange={(e) => setNewItem({...newItem, pt: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Espagnol</label>
                <textarea
                  value={newItem.es}
                  onChange={(e) => setNewItem({...newItem, es: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Modifier: {editingItem.key}</h2>
            
            <div className="mb-4">
              <label className="text-slate-400 text-sm">Français *</label>
              <textarea
                value={editingItem.fr}
                onChange={(e) => setEditingItem({...editingItem, fr: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-slate-400 text-sm">Anglais</label>
                <textarea
                  value={editingItem.en}
                  onChange={(e) => setEditingItem({...editingItem, en: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Portugais</label>
                <textarea
                  value={editingItem.pt}
                  onChange={(e) => setEditingItem({...editingItem, pt: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Espagnol</label>
                <textarea
                  value={editingItem.es}
                  onChange={(e) => setEditingItem({...editingItem, es: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="px-6 py-2 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
