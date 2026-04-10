'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageMusicPlayer, { stopAllAdminPlayers } from './PageMusicPlayer'
import SoundEffectPlayer from './SoundEffectPlayer'
import { initSoundEffects } from '@/lib/soundEffects'

interface PageMusicConfig {
  url: string
  volume: number
}

interface MusicSettings {
  accueil: PageMusicConfig
  solutions: PageMusicConfig
  histoire: PageMusicConfig
  produits: PageMusicConfig
  contact: PageMusicConfig
}

interface Settings {
  hero_image_url: string
  hero_opacity: number
  hero_brightness: number
  hero_overlay_opacity: number
  hero_title: string
  hero_subtitle1: string
  hero_subtitle2: string
  music: MusicSettings
  sound_hover_enabled: boolean
  sound_click_enabled: boolean
  sound_hover_url: string
  sound_click_url: string
}

// SoundHelix URLs — CORS-friendly, public domain
const defaultMusicSettings: MusicSettings = {
  accueil: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', volume: 30 },
  solutions: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', volume: 30 },
  histoire: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', volume: 30 },
  produits: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', volume: 30 },
  contact: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', volume: 30 },
}

const defaultSettings: Settings = {
  hero_image_url: '',
  hero_opacity: 100,
  hero_brightness: 110,
  hero_overlay_opacity: 50,
  hero_title: '',
  hero_subtitle1: '',
  hero_subtitle2: '',
  music: defaultMusicSettings,
  sound_hover_enabled: true,
  sound_click_enabled: true,
  sound_hover_url: 'https://cdn.freesound.org/previews/256/256113_4097033-lq.mp3',
  sound_click_url: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'hero' | 'sounds'>('hero')
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState<HTMLAudioElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchSettings()
    
    // Cleanup on unmount
    return () => {
      stopAllAdminPlayers()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth')
      const data = await res.json()
      if (!data.isAdmin) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/local/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings({
          hero_image_url: data.settings.hero?.image_url || '',
          hero_opacity: data.settings.hero?.opacity || 100,
          hero_brightness: data.settings.hero?.brightness || 110,
          hero_overlay_opacity: data.settings.hero?.overlay_opacity || 50,
          hero_title: '',
          hero_subtitle1: '',
          hero_subtitle2: '',
          music: data.settings.music || defaultMusicSettings,
          sound_hover_enabled: data.settings.sound_hover_enabled !== false,
          sound_click_enabled: data.settings.sound_click_enabled !== false,
          sound_hover_url: data.settings.sound_hover_url || defaultSettings.sound_hover_url,
          sound_click_url: data.settings.sound_click_url || 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError(null)

    try {
      // Merge with existing settings to preserve other fields
      const existingRes = await fetch('/api/local/settings')
      const existingData = await existingRes.json()
      
      const mergedSettings = {
        ...existingData.settings,
        hero: {
          ...existingData.settings?.hero,
          image_url: settings.hero_image_url,
          opacity: settings.hero_opacity,
          brightness: settings.hero_brightness,
          overlay_opacity: settings.hero_overlay_opacity,
        },
        music: settings.music,
        sound_hover_enabled: settings.sound_hover_enabled,
        sound_click_enabled: settings.sound_click_enabled,
        sound_hover_url: settings.sound_hover_url,
        sound_click_url: settings.sound_click_url,
      }

      const res = await fetch('/api/local/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedSettings),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setSaveError('⚠ Erreur lors de la sauvegarde')
      }
    } catch {
      setSaveError('⚠ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const updateMusicConfig = (page: keyof MusicSettings, url: string, volume: number) => {
    setSettings(prev => ({
      ...prev,
      music: {
        ...prev.music,
        [page]: { url, volume }
      }
    }))
  }

  const handlePlayerPlay = (audio: HTMLAudioElement) => {
    setCurrentPlayingAudio(audio)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
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
        <div className="flex items-center space-x-4">
          <Link href="/" target="_blank" className="text-slate-300 hover:text-sky-400 transition">
            Voir le site
          </Link>
          <Link href="/admin/dashboard" className="text-slate-300 hover:text-sky-400 transition">
            Produits
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Paramètres du site</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-sky-500 text-white px-6 py-3 rounded-full font-bold hover:bg-sky-400 transition disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>

        {saved && (
          <div className="bg-green-500/20 border border-green-500/40 text-green-400 px-6 py-4 rounded-xl mb-6">
            Paramètres sauvegardés avec succès !
          </div>
        )}

        {saveError && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-6 py-4 rounded-xl mb-6">
            {saveError}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'hero' 
                ? 'bg-sky-500 text-white' 
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            Hero & Images
          </button>
          <button
            onClick={() => setActiveTab('sounds')}
            className={`px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'sounds' 
                ? 'bg-sky-500 text-white' 
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            Musique & Sons
          </button>
        </div>

        {activeTab === 'hero' && (
          <>
            {/* Preview */}
            <div className="glass p-6 rounded-[2rem] mb-8">
              <h2 className="text-xl font-bold mb-4">Aperçu Hero</h2>
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img 
                  src={settings.hero_image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'} 
                  alt="Preview hero"
                  className="w-full h-full object-cover"
                  style={{ 
                    opacity: settings.hero_opacity / 100,
                    filter: `brightness(${settings.hero_brightness}%)`
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-950/90"
                  style={{ opacity: settings.hero_overlay_opacity / 100 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white text-center px-4">
                    {settings.hero_title || 'Pilotez votre entreprise avec l\'Intelligence d\'aujourd\'hui.'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Hero Settings */}
            <div className="glass p-8 rounded-[2rem] space-y-8 mb-8">
              <div>
                <h2 className="text-xl font-bold mb-6 text-sky-400">Image Hero</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">URL de l'image</label>
                    <input
                      type="text"
                      value={settings.hero_image_url}
                      onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Opacité: {settings.hero_opacity}%</label>
                      <input type="range" min="0" max="100" value={settings.hero_opacity} onChange={(e) => setSettings({ ...settings, hero_opacity: Number(e.target.value) })} className="w-full accent-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Luminosité: {settings.hero_brightness}%</label>
                      <input type="range" min="50" max="200" value={settings.hero_brightness} onChange={(e) => setSettings({ ...settings, hero_brightness: Number(e.target.value) })} className="w-full accent-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Overlay: {settings.hero_overlay_opacity}%</label>
                      <input type="range" min="0" max="100" value={settings.hero_overlay_opacity} onChange={(e) => setSettings({ ...settings, hero_overlay_opacity: Number(e.target.value) })} className="w-full accent-sky-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-6 text-sky-400">Textes Hero</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Titre principal</label>
                    <input type="text" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="Laisser vide pour traductions" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Sous-titre 1</label>
                    <textarea value={settings.hero_subtitle1} onChange={(e) => setSettings({ ...settings, hero_subtitle1: e.target.value })} rows={2} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="Laisser vide pour traductions" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Sous-titre 2</label>
                    <textarea value={settings.hero_subtitle2} onChange={(e) => setSettings({ ...settings, hero_subtitle2: e.target.value })} rows={2} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="Laisser vide pour traductions" />
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="glass p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold mb-4 text-sky-400">Presets d'images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', name: 'Tech' },
                  { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80', name: 'Robot' },
                  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80', name: 'Circuits' },
                  { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80', name: 'Bureau' },
                  { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80', name: 'Code' },
                  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80', name: 'Cyber' },
                  { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80', name: 'Data' },
                  { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80', name: 'Startup' },
                ].map((preset) => (
                  <button key={preset.name} onClick={() => setSettings({ ...settings, hero_image_url: preset.url })} className={`p-2 rounded-lg border transition ${settings.hero_image_url === preset.url ? 'border-sky-500 bg-sky-500/20' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={preset.url} alt={preset.name} className="w-full h-20 object-cover rounded" />
                    <p className="text-xs text-slate-300 mt-1">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'sounds' && (
          <>
            {/* Per-Page Music Configuration */}
            <div className="glass p-8 rounded-[2rem] mb-8">
              <h2 className="text-2xl font-bold mb-6 text-sky-400">🎵 Musique par Page</h2>
              <p className="text-slate-400 mb-6">Configurez une musique différente pour chaque page du site.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PageMusicPlayer
                  pageKey="accueil"
                  title="🏠 Accueil"
                  icon="🏠"
                  initialUrl={settings.music.accueil.url}
                  initialVolume={settings.music.accueil.volume}
                  onChange={(url, volume) => updateMusicConfig('accueil', url, volume)}
                  onPlay={handlePlayerPlay}
                />
                <PageMusicPlayer
                  pageKey="solutions"
                  title="💡 Nos Solutions"
                  icon="💡"
                  initialUrl={settings.music.solutions.url}
                  initialVolume={settings.music.solutions.volume}
                  onChange={(url, volume) => updateMusicConfig('solutions', url, volume)}
                  onPlay={handlePlayerPlay}
                />
                <PageMusicPlayer
                  pageKey="histoire"
                  title="📖 Notre Histoire"
                  icon="📖"
                  initialUrl={settings.music.histoire.url}
                  initialVolume={settings.music.histoire.volume}
                  onChange={(url, volume) => updateMusicConfig('histoire', url, volume)}
                  onPlay={handlePlayerPlay}
                />
                <PageMusicPlayer
                  pageKey="produits"
                  title="🛍️ Produits"
                  icon="🛍️"
                  initialUrl={settings.music.produits.url}
                  initialVolume={settings.music.produits.volume}
                  onChange={(url, volume) => updateMusicConfig('produits', url, volume)}
                  onPlay={handlePlayerPlay}
                />
                <PageMusicPlayer
                  pageKey="contact"
                  title="📩 Contact"
                  icon="📩"
                  initialUrl={settings.music.contact.url}
                  initialVolume={settings.music.contact.volume}
                  onChange={(url, volume) => updateMusicConfig('contact', url, volume)}
                  onPlay={handlePlayerPlay}
                />
              </div>
            </div>

            {/* Sound Effects */}
            <div className="glass p-8 rounded-[2rem]">
              <h2 className="text-2xl font-bold mb-6 text-sky-400">🔊 Effets Sonores</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    id="sound_hover_enabled" 
                    checked={settings.sound_hover_enabled} 
                    onChange={(e) => {
                      const newSettings = { ...settings, sound_hover_enabled: e.target.checked }
                      setSettings(newSettings)
                      initSoundEffects({
                        sound_hover_enabled: newSettings.sound_hover_enabled,
                        sound_click_enabled: newSettings.sound_click_enabled,
                        sound_hover_url: newSettings.sound_hover_url,
                        sound_click_url: newSettings.sound_click_url,
                      })
                    }} 
                    className="w-5 h-5 accent-sky-500" 
                  />
                  <label htmlFor="sound_hover_enabled" className="text-slate-300 font-semibold">Son au survol (boutons/liens)</label>
                </div>
                
                {settings.sound_hover_enabled && (
                  <div className="ml-9">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">URL son hover</label>
                    <SoundEffectPlayer
                      label="Son hover"
                      initialUrl={settings.sound_hover_url}
                      onChange={(url) => setSettings({ ...settings, sound_hover_url: url })}
                    />
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    id="sound_click_enabled" 
                    checked={settings.sound_click_enabled} 
                    onChange={(e) => {
                      const newSettings = { ...settings, sound_click_enabled: e.target.checked }
                      setSettings(newSettings)
                      initSoundEffects({
                        sound_hover_enabled: newSettings.sound_hover_enabled,
                        sound_click_enabled: newSettings.sound_click_enabled,
                        sound_hover_url: newSettings.sound_hover_url,
                        sound_click_url: newSettings.sound_click_url,
                      })
                    }} 
                    className="w-5 h-5 accent-sky-500" 
                  />
                  <label htmlFor="sound_click_enabled" className="text-slate-300 font-semibold">Son au clic</label>
                </div>

                {settings.sound_click_enabled && (
                  <div className="ml-9">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">URL son clic (très léger)</label>
                    <SoundEffectPlayer
                      label="Son clic"
                      initialUrl={settings.sound_click_url}
                      onChange={(url) => setSettings({ ...settings, sound_click_url: url })}
                    />
                    <p className="text-xs text-slate-500 mt-2">Volume maximum: 15% pour ne pas être intrusif</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
