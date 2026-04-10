'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  newtab_key: string
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

export default function ZonesManager() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [editingCard, setEditingCard] = useState<ZoneCard | null>(null)
  const [showAddZone, setShowAddZone] = useState(false)
  const [showAddCard, setShowAddCard] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
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
      const [textsRes, zonesRes, cardsRes] = await Promise.all([
        fetch('/api/texts'),
        fetch('/api/zones'),
        fetch('/api/zone-cards')
      ])
      const textsData = await textsRes.json()
      const zonesData = await zonesRes.json()
      const cardsData = await cardsRes.json()
      
      setTexts(textsData.texts || [])
      setZones(zonesData.zones || [])
      setCards(cardsData.cards || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTextKeys = () => {
    return texts.map(t => t.key)
  }

  const handleSaveZone = async () => {
    if (!editingZone) return

    try {
      const res = await fetch(`/api/zones/${editingZone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone)
      })

      if (res.ok) {
        fetchData()
        setEditingZone(null)
      }
    } catch (error) {
      console.error('Error saving zone:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleAddZone = async () => {
    if (!editingZone) return

    try {
      const res = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone)
      })

      if (res.ok) {
        fetchData()
        setShowAddZone(false)
        setEditingZone(null)
      }
    } catch (error) {
      console.error('Error adding zone:', error)
      alert('Erreur lors de l\'ajout')
    }
  }

  const handleDeleteZone = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette zone et toutes ses cartes ?')) return

    try {
      const res = await fetch(`/api/zones/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
        if (selectedZone === id) setSelectedZone(null)
      }
    } catch (error) {
      console.error('Error deleting zone:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingCard) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('width', '600')
      formData.append('height', '400')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      if (data.url) {
        setEditingCard({...editingCard, image_url: data.url})
      } else {
        alert('Erreur upload: ' + (data.error || 'Inconnu'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveCard = async () => {
    if (!editingCard) return

    try {
      const res = await fetch(`/api/zone-cards/${editingCard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard)
      })

      if (res.ok) {
        fetchData()
        setEditingCard(null)
      }
    } catch (error) {
      console.error('Error saving card:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleAddCard = async () => {
    if (!editingCard || !showAddCard) return

    try {
      const res = await fetch('/api/zone-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingCard, zone_id: showAddCard })
      })

      if (res.ok) {
        fetchData()
        setShowAddCard(null)
        setEditingCard(null)
      }
    } catch (error) {
      console.error('Error adding card:', error)
      alert('Erreur lors de l\'ajout')
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette carte ?')) return

    try {
      const res = await fetch(`/api/zone-cards/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const newZoneTemplate: Zone = {
    id: '',
    key: '',
    title_key: '',
    subtitle_key: '',
    badge: '',
    color: 'sky',
    url: '',
    cta_key: '',
    newtab_key: '',
    order: zones.length,
    active: true
  }

  const newCardTemplate: ZoneCard = {
    id: '',
    zone_id: '',
    title_key: '',
    description_key: '',
    badge_key: '',
    image_url: '',
    order: 0,
    active: true
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen">
      <header className="glass py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-white">NewApp</span>
          <span className="text-sky-400">AI</span>
          <span className="text-slate-400 text-lg ml-2">Admin - Zones</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-slate-300 hover:text-sky-400 transition">
            Produits
          </Link>
          <Link href="/admin/texts" className="text-slate-300 hover:text-sky-400 transition">
            Textes
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Zones et Cartes</h1>
          <button
            onClick={() => { setEditingZone({...newZoneTemplate}); setShowAddZone(true); }}
            className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-400 transition"
          >
            + Nouvelle Zone
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : (
          <div className="space-y-6">
            {zones.length === 0 ? (
              <div className="glass p-10 rounded-[2rem] text-center">
                <p className="text-slate-400 mb-4">Aucune zone</p>
                <button
                  onClick={() => { setEditingZone({...newZoneTemplate}); setShowAddZone(true); }}
                  className="text-sky-400 hover:text-sky-300 font-bold"
                >
                  Creer la premiere zone
                </button>
              </div>
            ) : (
              zones.sort((a, b) => a.order - b.order).map(zone => (
                <div key={zone.id} className="glass p-6 rounded-[2rem]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${zone.color === 'indigo' ? 'bg-indigo-500' : 'bg-sky-500'} text-white`}>
                          {zone.badge}
                        </span>
                        <h2 className="text-xl font-bold text-white">{zone.title_key}</h2>
                        <span className={`text-xs px-2 py-1 rounded ${zone.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {zone.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{zone.subtitle_key}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingZone({...zone}); setShowAddZone(true); }}
                        className="text-sky-400 hover:text-sky-300 text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                      className={`px-4 py-2 rounded-full text-sm ${selectedZone === zone.id ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Cartes ({cards.filter(c => c.zone_id === zone.id).length})
                    </button>
                    <button
                      onClick={() => { setEditingCard({...newCardTemplate, zone_id: zone.id, order: cards.filter(c => c.zone_id === zone.id).length}); setShowAddCard(zone.id); }}
                      className="px-4 py-2 rounded-full text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      + Ajouter carte
                    </button>
                  </div>

                  {selectedZone === zone.id && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                      {cards.filter(c => c.zone_id === zone.id).sort((a, b) => a.order - b.order).map(card => (
                        <div key={card.id} className="bg-slate-800 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-bold text-white">{card.title_key}</p>
                              <p className="text-slate-400 text-sm line-clamp-2">{card.description_key}</p>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => setEditingCard({...card})}
                                className="text-sky-400 hover:text-sky-300 text-xs"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                          {card.image_url && (
                            <img src={card.image_url} alt="" className="w-full h-20 object-cover rounded mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Zone Modal */}
      {showAddZone && editingZone && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingZone.id ? 'Modifier la zone' : 'Nouvelle zone'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Key (identifiant) *</label>
                  <input
                    type="text"
                    value={editingZone.key}
                    onChange={(e) => setEditingZone({...editingZone, key: e.target.value})}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                    placeholder="digismart"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Position (0-9)</label>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={editingZone.order}
                    onChange={(e) => setEditingZone({...editingZone, order: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Badge (ex: DS, IN)</label>
                  <input
                    type="text"
                    value={editingZone.badge}
                    onChange={(e) => setEditingZone({...editingZone, badge: e.target.value})}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Couleur</label>
                  <select
                    value={editingZone.color}
                    onChange={(e) => setEditingZone({...editingZone, color: e.target.value})}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="sky">Sky (Bleu)</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm">Titre (clé texte) *</label>
                <input
                  type="text"
                  value={editingZone.title_key}
                  onChange={(e) => setEditingZone({...editingZone, title_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="digismart_title"
                  list="text-keys"
                />
                <datalist id="text-keys">
                  {getTextKeys().map(k => <option key={k} value={k} />)}
                </datalist>
              </div>

              <div>
                <label className="text-slate-400 text-sm">Sous-titre (clé texte)</label>
                <input
                  type="text"
                  value={editingZone.subtitle_key}
                  onChange={(e) => setEditingZone({...editingZone, subtitle_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="digismart_subtitle"
                  list="text-keys"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">URL du site externe</label>
                <input
                  type="url"
                  value={editingZone.url}
                  onChange={(e) => setEditingZone({...editingZone, url: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">Texte du bouton CTA</label>
                <input
                  type="text"
                  value={editingZone.cta_key}
                  onChange={(e) => setEditingZone({...editingZone, cta_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="digismart_cta"
                  list="text-keys"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">Texte "nouvel onglet"</label>
                <input
                  type="text"
                  value={editingZone.newtab_key}
                  onChange={(e) => setEditingZone({...editingZone, newtab_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="digismart_newtab"
                  list="text-keys"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="zone-active"
                  checked={editingZone.active}
                  onChange={(e) => setEditingZone({...editingZone, active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="zone-active" className="text-white">Zone active</label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={editingZone.id ? handleSaveZone : handleAddZone}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400"
              >
                {editingZone.id ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button
                onClick={() => { setShowAddZone(false); setEditingZone(null); }}
                className="px-6 py-2 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {(showAddCard || editingCard?.id) && editingCard && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCard.id ? 'Modifier la carte' : 'Nouvelle carte'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Position</label>
                  <input
                    type="number"
                    min="0"
                    max="19"
                    value={editingCard.order}
                    onChange={(e) => setEditingCard({...editingCard, order: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm">Titre (clé texte) *</label>
                <input
                  type="text"
                  value={editingCard.title_key}
                  onChange={(e) => setEditingCard({...editingCard, title_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="clickcollect_title"
                  list="text-keys"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">Description (clé texte) *</label>
                <input
                  type="text"
                  value={editingCard.description_key}
                  onChange={(e) => setEditingCard({...editingCard, description_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="clickcollect_desc"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">Badge (clé texte)</label>
                <input
                  type="text"
                  value={editingCard.badge_key || ''}
                  onChange={(e) => setEditingCard({...editingCard, badge_key: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="iaphone_badge"
                  list="text-keys"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm">Image (sera recadree en 600x400 et convertie en WEBP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white mt-1"
                />
                {uploading && <p className="text-sky-400 text-sm mt-1">Upload en cours...</p>}
                {editingCard.image_url && (
                  <div className="mt-2">
                    <img src={editingCard.image_url} alt="Apercu" className="w-32 h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setEditingCard({...editingCard, image_url: ''})}
                      className="text-red-400 text-xs mt-1 hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="card-active"
                  checked={editingCard.active}
                  onChange={(e) => setEditingCard({...editingCard, active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="card-active" className="text-white">Carte active</label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={editingCard.id ? handleSaveCard : handleAddCard}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400"
              >
                {editingCard.id ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button
                onClick={() => { setShowAddCard(null); setEditingCard(null); }}
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
