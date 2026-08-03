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

interface Settings {
  site: { logo_text: string; logo_image_url: string; favicon_url: string; primary_color: string; secondary_color: string; accent_color: string; background_color: string; text_color: string; text_secondary_color: string }
  hero: { enabled: boolean; image_url: string; video_url: string; opacity: number; brightness: number; overlay_opacity: number; overlay_color: string; effect_glow: boolean; effect_glow_color: string; effect_particles: boolean; effect_gradient: boolean; gradient_start: string; gradient_end: string }
  header: { style: string; transparent: boolean; blur: boolean; blur_amount: number; background_opacity: number; show_search: boolean; show_cart: boolean; show_language: boolean; sticky: boolean; shadow: boolean }
  navigation: { items: any[]; style: string; languages: string[]; default_language: string }
  footer: { enabled: boolean; style: string; background_color: string; text_color: string; show_socials: boolean; show_links: boolean; show_newsletter: boolean; show_copyright: boolean; copyright_text: string; columns: any[]; socials: any[] }
  cards: { style: string; border_radius: number; shadow: boolean; hover_effect: string; background_opacity: number; animation: string }
  buttons: { primary_color: string; secondary_color: string; border_radius: number; hover_effect: string; transition_duration: number }
  animations: { enabled: boolean; page_transition: string; scroll_animation: string; stagger_delay: number }
  product_carousel?: { delay: number }
  contact: { email: string; phone: string; address: string; facebook_url: string; instagram_url: string; linkedin_url: string; twitter_url: string; youtube_url: string }
  widgets: { ai_enabled: boolean; cart_enabled: boolean; sound_enabled: boolean; chat_enabled: boolean; back_to_top: boolean }
  audio: { enabled: boolean; file_url: string; volume: number; muted: boolean; loop: boolean; autoplay: boolean; fade_in: boolean; fade_in_duration: number; sound_hover_enabled: boolean; sound_click_enabled: boolean; sound_hover_url: string; sound_click_url: string }
  music: { accueil: { url: string; volume: number }; solutions: { url: string; volume: number }; histoire: { url: string; volume: number }; produits: { url: string; volume: number }; contact: { url: string; volume: number } }
  hero_texts?: { title?: { fr?: string; en?: string; pt?: string; es?: string }; subtitle?: { fr?: string; en?: string; pt?: string; es?: string }; cta1?: { fr?: string; en?: string; pt?: string; es?: string }; cta2?: { fr?: string; en?: string; pt?: string; es?: string } }
  contact_page?: { title?: { fr?: string; en?: string; pt?: string; es?: string } }
}

export default function AdminAccueilPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cards, setCards] = useState<ZoneCard[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('fr')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalFields, setModalFields] = useState<any[]>([])
  const [modalData, setModalData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ type: string, id: string, name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [textsRes, zonesRes, cardsRes, settingsRes] = await Promise.all([
        fetch('/api/supabase/texts', { cache: 'no-store' }),
        fetch('/api/supabase/zones', { cache: 'no-store' }),
        fetch('/api/supabase/cards', { cache: 'no-store' }),
        fetch('/api/supabase/settings', { cache: 'no-store' })
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

  const getText = (key: string): string => {
    const text = texts.find(t => t.key === key)
    return text?.[lang as keyof TextItem] || text?.fr || key
  }

  const openEdit = (type: string, item: any, title: string, fields: any[]) => {
    setModalType(type)
    setModalTitle(title)
    setModalFields(fields)
    setModalData({ ...item })
    setModalOpen(true)
  }

  const openAdd = (type: string, title: string, fields: any[], defaults: any = {}) => {
    setModalType(type)
    setModalTitle(title)
    setModalFields(fields)
    setModalData(defaults)
    setModalOpen(true)
  }

  const handleSave = async (savedData?: any, stayOpen = false) => {
    setSaving(true)
    try {
      let endpoint = '', method = 'POST', body = savedData || modalData

      console.log('handleSave called:', { modalType, modalData, savedData, body })

      if (modalType === 'settings') {
        endpoint = '/api/supabase/settings'
        method = 'PUT'
      }
      else if (modalType === 'zone') { endpoint = '/api/supabase/zones'; method = modalData.id ? 'PUT' : 'POST' }
      else if (modalType === 'card') { endpoint = '/api/supabase/cards'; method = modalData.id ? 'PUT' : 'POST' }

      const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      console.log('API response status:', res.status, res.statusText)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('API error response:', errorText)
        throw new Error(`Save failed: ${res.status} ${errorText}`)
      }

      const data = await res.json()
      console.log('Saved successfully:', data)
      await fetchData()
      if (!stayOpen) setModalOpen(false)
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

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleting(true)
    try {
      let endpoint = ''
      if (deleteItem.type === 'zone') endpoint = `/api/supabase/zones?id=${deleteItem.id}`
      else if (deleteItem.type === 'card') endpoint = `/api/supabase/cards?id=${deleteItem.id}`
      await fetch(endpoint, { method: 'DELETE' })
      fetchData()
      setDeleteOpen(false)
      setDeleteItem(null)
    } catch (error) { console.error('Error:', error) }
    finally { setDeleting(false) }
  }

  const parseImage = (v?: string): string => {
    if (!v) return ''
    try { const p = JSON.parse(v); return p.original || p.thumbnail || v } catch { return v }
  }
  const heroImage = parseImage(settings?.hero?.image_url)
  const heroOpacity = settings?.hero?.opacity ?? 100

  const siteFields = [
    { name: 'logo_text', label: 'Texte du logo', type: 'text', description: 'Le nom de votre site affiché dans le header et le footer' },
    { name: 'logo_image_url', label: 'Image du logo', type: 'image-upload', customName: 'logo_site', immediateSave: true, description: 'Logo de votre site (format carré recommandé). Laissez vide pour utiliser le texte à la place' },
    { name: 'favicon_url', label: 'Favicon', type: 'image-upload', customName: 'favicon', immediateSave: true, description: 'Icône affichée dans l\'onglet du navigateur (32x32 pixels recommandé)' },
    { name: 'primary_color', label: 'Couleur primaire', type: 'color', description: 'Couleur principale des boutons et des liens sur le site' },
    { name: 'secondary_color', label: 'Couleur secondaire', type: 'color', description: 'Couleur secondaire pour les éléments en surbrillance' },
    { name: 'accent_color', label: 'Couleur d\'accent', type: 'color', description: 'Couleur d\'accent pour les éléments décoratifs' },
    { name: 'background_color', label: 'Couleur de fond', type: 'color', description: 'Couleur de fond générale du site' },
    { name: 'text_color', label: 'Couleur du texte', type: 'color', description: 'Couleur principale du texte' },
    { name: 'text_secondary_color', label: 'Couleur du texte secondaire', type: 'color', description: 'Couleur du texte secondaire (sous-titres, descriptions)' }
  ]

  const headerFields = [
    { name: 'style', label: 'Style', type: 'select', options: [{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solide' }, { value: 'transparent', label: 'Transparent' }], description: 'Style du menu de navigation: Glass (vitré), Solide (plein), Transparent' },
    { name: 'transparent', label: 'Transparent', type: 'boolean', description: 'Rend le header transparent quand activé' },
    { name: 'blur', label: 'Flou (blur)', type: 'boolean', description: 'Ajoute un effet de flou derrière le header' },
    { name: 'blur_amount', label: 'Intensité du flou', type: 'number', description: 'Intensité du flou en pixels (plus le nombre est élevé, plus c\'est flou)' },
    { name: 'background_opacity', label: 'Opacité du fond (%)', type: 'number', description: 'Opacité du fond du header (0 = invisible, 100 = opaque)' },
    { name: 'background_image_url', label: 'Image de fond du Header', type: 'image-upload', customName: 'header_bg', immediateSave: true, description: 'Image de fond personnalisée pour le header' },
    { name: 'sticky', label: 'Header fixe', type: 'boolean', description: 'Le header reste visible en haut quand on descend sur la page' },
    { name: 'shadow', label: 'Ombre', type: 'boolean', description: 'Ajoute une ombre sous le header' },
    { name: 'show_search', label: 'Afficher recherche', type: 'boolean', description: 'Affiche la barre de recherche dans le header' },
    { name: 'show_cart', label: 'Afficher panier', type: 'boolean', description: 'Affiche l\'icône du panier dans le header' },
    { name: 'show_language', label: 'Afficher langue', type: 'boolean', description: 'Affiche le sélecteur de langue dans le header' }
  ]

  const heroFields = [
    { name: 'enabled', label: 'Actif', type: 'boolean', description: 'Affiche ou masque la section hero (grande bannière en haut de la page d\'accueil)' },
    { name: 'image_url', label: 'Image de fond', type: 'image-upload', description: 'Image de fond de la bannière hero. Laissez vide pour utiliser la couleur par défaut' },
    { name: 'video_url', label: 'Video (URL)', type: 'url', description: 'URL d\'une vidéo de fond (remplace l\'image si renseignée)' },
    { name: 'opacity', label: 'Opacité (%)', type: 'number', description: 'Transparence de l\'image de fond (100% = visible, 0% = invisible)' },
    { name: 'brightness', label: 'Luminosité (%)', type: 'number', description: 'Luminosité de l\'image de fond (100% = normale)' },
    { name: 'overlay_opacity', label: 'Opacité overlay (%)', type: 'number', description: 'Opacité du voile coloré par-dessus l\'image (0% = transparent, 100% = opaque)' },
    { name: 'overlay_color', label: 'Couleur overlay', type: 'color', description: 'Couleur du voile par-dessus l\'image de fond' },
    { name: 'effect_glow', label: 'Effet glow', type: 'boolean', description: 'Active un effet lumineux (glow) sur le hero' },
    { name: 'effect_glow_color', label: 'Couleur glow', type: 'color', description: 'Couleur de l\'effet lumineux (glow)' },
    { name: 'effect_particles', label: 'Particules', type: 'boolean', description: 'Active des particules animées sur le hero' },
    { name: 'effect_gradient', label: 'Dégradé', type: 'boolean', description: 'Active un dégradé de couleurs sur le hero' },
    { name: 'gradient_start', label: 'Début dégradé', type: 'color', description: 'Couleur de début du dégradé' },
    { name: 'gradient_end', label: 'Fin dégradé', type: 'color', description: 'Couleur de fin du dégradé' }
  ]

  const footerFields = [
    { name: 'enabled', label: 'Actif', type: 'boolean', description: 'Affiche ou masque complètement le footer' },
    { name: 'style', label: 'Style', type: 'select', options: [{ value: 'dark', label: 'Sombre' }, { value: 'light', label: 'Clair' }, { value: 'glass', label: 'Glass' }], description: 'Style du footer: dark (sombre), light (clair) ou glass (vitré)' },
    { name: 'background_color', label: 'Couleur de fond', type: 'color', description: 'Couleur de fond du footer' },
    { name: 'text_color', label: 'Couleur du texte', type: 'color', description: 'Couleur du texte dans le footer' },
    { name: 'show_socials', label: 'Réseaux sociaux', type: 'boolean', description: 'Affiche les icônes de réseaux sociaux dans le footer' },
    { name: 'show_links', label: 'Liens', type: 'boolean', description: 'Affiche les liens de navigation dans le footer' },
    { name: 'show_newsletter', label: 'Newsletter', type: 'boolean', description: 'Affiche le formulaire d\'inscription à la newsletter' },
    { name: 'show_copyright', label: 'Copyright', type: 'boolean', description: 'Affiche le texte de copyright en bas du footer' },
    { name: 'copyright_text', label: 'Texte copyright', type: 'text', description: 'Texte de copyright affiché en bas du footer' }
  ]

  const cardStyleFields = [
    { name: 'style', label: 'Style', type: 'select', options: [{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solide' }, { value: 'bordered', label: 'Bordé' }], description: 'Style visuel des cartes: glass (vitré), solid (plein) ou bordered (bordé)' },
    { name: 'border_radius', label: 'Bordure arrondie (px)', type: 'number', description: 'Arrondi des coins des cartes en pixels' },
    { name: 'shadow', label: 'Ombre', type: 'boolean', description: 'Ajoute une ombre aux cartes' },
    { name: 'hover_effect', label: 'Effet au survol', type: 'select', options: [{ value: 'scale', label: 'Zoom' }, { value: 'glow', label: 'Glow' }, { value: 'lift', label: 'Levée' }, { value: 'none', label: 'Aucun' }], description: 'Effet visuel quand on survole une carte avec la souris' },
    { name: 'background_opacity', label: 'Opacité du fond (%)', type: 'number', description: 'Opacité du fond des cartes (0-100)' },
    { name: 'animation', label: 'Animation', type: 'select', options: [{ value: 'fade', label: 'Fondu' }, { value: 'slide', label: 'Glissement' }, { value: 'none', label: 'Aucune' }], description: 'Animation d\'apparition des cartes quand on descend la page' }
  ]

  const buttonFields = [
    { name: 'primary_color', label: 'Couleur primaire', type: 'color', description: 'Couleur de fond des boutons principaux' },
    { name: 'secondary_color', label: 'Couleur secondaire', type: 'color', description: 'Couleur de fond des boutons secondaires' },
    { name: 'border_radius', label: 'Bordure arrondie (px)', type: 'number', description: 'Arrondi des coins des boutons en pixels' },
    { name: 'hover_effect', label: 'Effet au survol', type: 'select', options: [{ value: 'brightness', label: 'Luminosité' }, { value: 'scale', label: 'Zoom' }, { value: 'glow', label: 'Glow' }], description: 'Effet visuel quand on survole un bouton' },
    { name: 'transition_duration', label: 'Durée transition (ms)', type: 'number', description: 'Durée de l\'animation au survol (300ms = rapide, 500ms = lent)' }
  ]

  const animationFields = [
    { name: 'enabled', label: 'Animations activées', type: 'boolean' },
    { name: 'page_transition', label: 'Transition de page', type: 'select', options: [{ value: 'fade', label: 'Fondu' }, { value: 'slide', label: 'Glissement' }, { value: 'none', label: 'Aucune' }] },
    { name: 'scroll_animation', label: 'Animation au défilement', type: 'select', options: [{ value: 'fade', label: 'Fondu' }, { value: 'slide', label: 'Glissement' }, { value: 'none', label: 'Aucune' }] },
  ]
  
  const carouselFields = [
    { name: 'delay', label: 'Délai auto (ms)', type: 'number', description: 'Délai en millisecondes entre chaque slide du carrousel produits (5000 = 5 secondes). Mettre 0 pour désactiver le défilement auto.' },
  ]

  const widgetFields = [
    { name: 'ai_enabled', label: 'IA activée', type: 'boolean', description: 'Active ou désactive l\'assistant IA sur le site' },
    { name: 'cart_enabled', label: 'Panier activé', type: 'boolean', description: 'Active ou désactive la fonctionnalité panier d\'achat' },
    { name: 'sound_enabled', label: 'Son activé', type: 'boolean', description: 'Active ou désactive les effets sonores sur le site' },
    { name: 'chat_enabled', label: 'Chat activé', type: 'boolean', description: 'Active ou désactive le chat en direct' },
    { name: 'back_to_top', label: 'Bouton retour en haut', type: 'boolean', description: 'Affiche un bouton pour remonter en haut de la page' }
  ]

  const audioFields = [
    { name: 'enabled', label: 'Audio activé', type: 'boolean', description: 'Active ou désactive la lecture audio sur le site' },
    { name: 'file_url', label: 'URL du fichier audio', type: 'url', description: 'URL du fichier audio à diffuser sur le site' },
    { name: 'volume', label: 'Volume (%)', type: 'number', description: 'Volume par défaut de l\'audio (0 = muet, 100 = maximum)' },
    { name: 'muted', label: 'Muet par défaut', type: 'boolean', description: 'Démarre la lecture en mode muet' },
    { name: 'loop', label: 'Lecture en boucle', type: 'boolean', description: 'Recommence la lecture automatiquement quand le fichier est terminé' },
    { name: 'autoplay', label: 'Autoplay au chargement', type: 'boolean', description: 'Démarre la lecture automatiquement au chargement de la page' },
    { name: 'fade_in', label: 'Fade in au démarrage', type: 'boolean', description: 'Augmente progressivement le volume au démarrage' },
    { name: 'fade_in_duration', label: 'Durée fade in (ms)', type: 'number', description: 'Durée du fondu sonore au démarrage en millisecondes' },
    { name: 'sound_hover_enabled', label: 'Son au survol', type: 'boolean', description: 'Joue un son quand on survole les boutons avec la souris' },
    { name: 'sound_click_enabled', label: 'Son au clic', type: 'boolean', description: 'Joue un son quand on clique sur les boutons' },
    { name: 'sound_hover_url', label: 'URL son hover', type: 'url', description: 'URL du fichier son joué au survol des boutons' },
    { name: 'sound_click_url', label: 'URL son clic', type: 'url', description: 'URL du fichier son joué au clic sur les boutons' }
  ]

  const musicPageFields = [
    { name: 'accueil', label: 'Page Accueil', type: 'music-page' },
    { name: 'solutions', label: 'Page Solutions', type: 'music-page' },
    { name: 'produits', label: 'Page Produits', type: 'music-page' },
    { name: 'contact', label: 'Page Contact', type: 'music-page' }
  ]

  const zoneFields = [
    { name: 'key', label: 'Cle', type: 'text', placeholder: 'digismart' },
    { name: 'badge', label: 'Badge', type: 'text', placeholder: 'DS' },
    { name: 'title_key', label: 'Cle titre', type: 'select', options: texts.map(t => ({ value: t.key, label: t.key })) },
    { name: 'subtitle_key', label: 'Cle sous-titre', type: 'select', options: texts.map(t => ({ value: t.key, label: t.key })) },
    {
      name: 'color', label: 'Couleur', type: 'select', options: [
        { value: 'sky', label: 'Sky (Bleu)' }, { value: 'indigo', label: 'Indigo' }, { value: 'emerald', label: 'Emeraud' }
      ]
    },
    { name: 'url', label: 'URL', type: 'text' },
    { name: 'order', label: 'Ordre', type: 'number' }
  ]

  const cardFields = [
    { name: 'zone_id', label: 'Zone', type: 'select', options: zones.map(z => ({ value: z.id, label: z.title_key })) },
    { name: 'title_key', label: 'Cle titre', type: 'select', options: texts.map(t => ({ value: t.key, label: t.key })) },
    { name: 'description_key', label: 'Cle description', type: 'select', options: texts.map(t => ({ value: t.key, label: t.key })) },
    { name: 'badge_key', label: 'Badge', type: 'text' },
    { name: 'image_url', label: 'Image', type: 'image-upload' },
    { name: 'order', label: 'Ordre', type: 'number' }
  ]

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="fixed w-full z-50 glass py-4 px-8 flex justify-between items-center border-b border-white/10 bg-slate-900">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tighter">
            <span className="text-white">{settings?.site?.logo_text || 'NewApp'}</span><span className="text-sky-400">AI</span>
          </span>
          <span className="text-slate-400">Admin</span>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link href="/admin/accueil" className="text-sky-400 font-medium">Accueil</Link>
          <Link href="/admin/solutions" className="text-slate-400 hover:text-sky-400">Solutions</Link>
          <Link href="/admin/produits" className="text-slate-400 hover:text-sky-400">Produits</Link>
          <Link href="/admin/about" className="text-slate-400 hover:text-sky-400">A propos</Link>
          <Link href="/admin/contact" className="text-slate-400 hover:text-sky-400">Contact</Link>
          <Link href="/admin/autres" className="text-slate-400 hover:text-sky-400">Autres</Link>
        </nav>
        <Link href="/" className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Voir le site</Link>
      </header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration - Accueil</h1>

        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 mb-8 flex items-center justify-between">
          <p className="text-sky-300 text-sm">Conseil : survolez les champs avec la souris pour voir une explication détaillée.</p>
          <Link href="/" className="text-sky-400 hover:text-sky-300 text-sm font-medium underline">Voir le site →</Link>
        </div>

        {/* Logo & Identité */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Logo & Identité
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {settings?.site?.logo_image_url ? (
                  <img src={settings.site.logo_image_url} alt="Logo" className="w-16 h-16 object-contain rounded-xl bg-white/10 p-2" />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: settings?.site?.primary_color || '#0ea5e9' }}>
                    {settings?.site?.logo_text?.[0] || 'N'}
                  </div>
                )}
                <div>
                  <p className="text-white font-bold text-lg">{settings?.site?.logo_text || 'NewAppAI'}</p>
                  <div className="flex gap-2 mt-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: settings?.site?.primary_color }} title="Primaire" />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: settings?.site?.secondary_color }} title="Secondaire" />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: settings?.site?.accent_color }} title="Accent" />
                  </div>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { site: settings?.site || {} }, 'Logo & Identité', siteFields.map(f => ({ ...f, name: `site.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            Header
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
                <div>
                  <p className="text-white font-medium">Style: {settings?.header?.style || 'glass'}</p>
                  <p className="text-slate-400 text-sm">Transparent: {settings?.header?.transparent ? 'Oui' : 'Non'} | Flou: {settings?.header?.blur ? 'Oui' : 'Non'}</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { header: settings?.header || {} }, 'Paramètres Header', headerFields.map(f => ({ ...f, name: `header.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Hero
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {heroImage && <img src={heroImage} alt="Hero" className="w-32 h-20 object-cover rounded-lg" />}
                <div>
                  <p className="text-white font-medium">Actif: {settings?.hero?.enabled !== false ? 'Oui' : 'Non'}</p>
                  <p className="text-slate-400 text-sm">Opacité: {heroOpacity}% | Luminosité: {settings?.hero?.brightness || 110}%</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { hero: settings?.hero || {} }, 'Paramètres Hero', heroFields.map(f => ({ ...f, name: `hero.${f.name}` })))} />
            </div>
            {/* Textes Hero éditables */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Textes du Hero (multilingue)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Titre Principal</p>
                  <p className="text-white text-sm truncate">{settings?.hero_texts?.title?.fr || 'Donnez une voix humaine...'}</p>
                  <button onClick={(e) => { e.preventDefault(); openEdit('settings', { hero_texts: { title: settings?.hero_texts?.title || {} } }, 'Titre Hero (multilingue)', [
                    { name: 'hero_texts.title', label: 'Titre Hero', type: 'languages' }
                  ]) }} className="mt-2 px-3 py-1 bg-sky-500 text-white rounded text-xs hover:bg-sky-400">Modifier</button>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Sous-titre</p>
                  <p className="text-white text-sm truncate">{settings?.hero_texts?.subtitle?.fr || 'Adoptez des solutions...'}</p>
                  <button onClick={(e) => { e.preventDefault(); openEdit('settings', { hero_texts: { subtitle: settings?.hero_texts?.subtitle || {} } }, 'Sous-titre Hero (multilingue)', [
                    { name: 'hero_texts.subtitle', label: 'Sous-titre', type: 'languages' }
                  ]) }} className="mt-2 px-3 py-1 bg-sky-500 text-white rounded text-xs hover:bg-sky-400">Modifier</button>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Bouton 1 (Explorer)</p>
                  <p className="text-white text-sm">{settings?.hero_texts?.cta1?.fr || 'Explorer nos Solutions'}</p>
                  <button onClick={(e) => { e.preventDefault(); openEdit('settings', { hero_texts: { cta1: settings?.hero_texts?.cta1 || {} } }, 'Bouton 1 (multilingue)', [
                    { name: 'hero_texts.cta1', label: 'Bouton Explorer', type: 'languages' }
                  ]) }} className="mt-2 px-3 py-1 bg-sky-500 text-white rounded text-xs hover:bg-sky-400">Modifier</button>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Bouton 2 (Expert)</p>
                  <p className="text-white text-sm">{settings?.hero_texts?.cta2?.fr || 'Parler à un expert'}</p>
                  <button onClick={(e) => { e.preventDefault(); openEdit('settings', { hero_texts: { cta2: settings?.hero_texts?.cta2 || {} } }, 'Bouton 2 (multilingue)', [
                    { name: 'hero_texts.cta2', label: 'Bouton Expert', type: 'languages' }
                  ]) }} className="mt-2 px-3 py-1 bg-sky-500 text-white rounded text-xs hover:bg-sky-400">Modifier</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Style des cartes */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Style des cartes
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                </div>
                <div>
                  <p className="text-white font-medium">Style: {settings?.cards?.style || 'glass'}</p>
                  <p className="text-slate-400 text-sm">Bordure: {settings?.cards?.border_radius || 16}px | Ombre: {settings?.cards?.shadow ? 'Oui' : 'Non'}</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { cards: settings?.cards || {} }, 'Style des cartes', cardStyleFields.map(f => ({ ...f, name: `cards.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Boutons */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            Boutons
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded text-white text-sm" style={{ backgroundColor: settings?.buttons?.primary_color || '#0ea5e9', borderRadius: settings?.buttons?.border_radius || 8 }}>Primaire</button>
                  <button className="px-4 py-2 rounded text-white text-sm" style={{ backgroundColor: settings?.buttons?.secondary_color || '#6366f1', borderRadius: settings?.buttons?.border_radius || 8 }}>Secondaire</button>
                </div>
                <div>
                  <p className="text-white font-medium">Bordure: {settings?.buttons?.border_radius || 8}px</p>
                  <p className="text-slate-400 text-sm">Transition: {settings?.buttons?.transition_duration || 300}ms</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { buttons: settings?.buttons || {} }, 'Style des boutons', buttonFields.map(f => ({ ...f, name: `buttons.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Animations
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className={`w-6 h-6 text-sky-400 ${settings?.animations?.enabled ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                </div>
                <div>
                  <p className="text-white font-medium">{settings?.animations?.enabled ? 'Animations activées' : 'Animations désactivées'}</p>
                  <p className="text-slate-400 text-sm">Transition: {settings?.animations?.page_transition || 'fade'}</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { animations: settings?.animations || {} }, 'Animations', animationFields.map(f => ({ ...f, name: `animations.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Footer
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="text-white font-medium">{settings?.footer?.enabled !== false ? 'Footer activé' : 'Footer désactivé'}</p>
                  <p className="text-slate-400 text-sm">Style: {settings?.footer?.style || 'dark'} | Réseaux: {settings?.footer?.show_socials ? 'Oui' : 'Non'}</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { footer: settings?.footer || {} }, 'Paramètres Footer', footerFields.map(f => ({ ...f, name: `footer.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Widgets */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
            Widgets
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.widgets?.ai_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">IA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.widgets?.cart_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">Panier</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.widgets?.sound_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">Son</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.widgets?.chat_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.widgets?.back_to_top ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">Retour en haut</span>
              </div>
            </div>
            <div className="mt-4">
              <AdminButton showEdit onEdit={() => openEdit('settings', { widgets: settings?.widgets || {} }, 'Widgets', widgetFields.map(f => ({ ...f, name: `widgets.${f.name}` })))} />
            </div>
          </div>
          
          {/* Carrousel Produits */}
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
                <div>
                  <p className="text-white font-medium">Carrousel Produits</p>
                  <p className="text-slate-400 text-xs">Délai: {settings?.product_carousel?.delay || 5000}ms</p>
                </div>
              </div>
              <AdminButton showEdit onEdit={() => openEdit('settings', { product_carousel: settings?.product_carousel || { delay: 5000 } }, 'Carrousel Produits', carouselFields.map(f => ({ ...f, name: `product_carousel.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Audio Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            Paramètres Audio
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.audio?.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-300">Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Volume: {settings?.audio?.volume || 30}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.audio?.fade_in ? 'bg-green-500' : 'bg-slate-600'}`} />
                <span className="text-slate-300 text-sm">Fade in</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.audio?.loop ? 'bg-green-500' : 'bg-slate-600'}`} />
                <span className="text-slate-300 text-sm">Boucle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${settings?.audio?.autoplay ? 'bg-green-500' : 'bg-slate-600'}`} />
                <span className="text-slate-300 text-sm">Autoplay</span>
              </div>
            </div>

            {/* Upload Audio & Preview */}
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <input
                  type="file"
                  accept=".mp3,.wav,.ogg,.m4a,.webm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const formData = new FormData()
                    formData.append('file', file)
                    try {
                      const res = await fetch('/api/local/upload-audio', {
                        method: 'POST',
                        body: formData
                      })
                      const data = await res.json()
                      if (data.success) {
                        const updatedSettings = { ...settings, audio: { ...settings?.audio, file_url: data.file_url } }
                        await fetch('/api/supabase/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updatedSettings)
                        })
                        fetchData()
                      }
                    } catch (err) {
                      console.error('Upload failed:', err)
                      alert('Échec de la sauvegarde audio.')
                    }
                  }}
                  className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500"
                />
                {settings?.audio?.file_url && (
                  <button
                    onClick={() => window.open(settings.audio.file_url, '_blank')}
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
                  >
                    Tester
                  </button>
                )}
              </div>

              {/* Audio Preview */}
              {settings?.audio?.file_url && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Prévisualisation:</p>
                  <audio controls src={settings.audio.file_url} className="w-full h-10" />
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs text-slate-400 mb-1">URL actuelle:</p>
                <p className="text-sm text-slate-300 truncate">{settings?.audio?.file_url || 'Non défini'}</p>
              </div>
            </div>

            <div className="mt-4">
              <AdminButton showEdit onEdit={() => openEdit('settings', { audio: settings?.audio || {} }, 'Paramètres Audio', audioFields.map(f => ({ ...f, name: `audio.${f.name}` })))} />
            </div>
          </div>
        </section>

        {/* Zones d'Expertise */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Zones d'Expertise
          </h2>
          <div className="flex justify-end mb-4">
            <AdminButton showAdd addLabel="Zone" onAdd={() => openAdd('zone', 'Ajouter une Zone', zoneFields, { color: 'sky', order: zones.length + 1, active: true })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.filter(z => z.active).sort((a, b) => a.order - b.order).map((zone) => (
              <div key={zone.id} className="glass p-5 rounded-2xl relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <AdminButton showEdit onEdit={() => openEdit('zone', zone, 'Modifier la Zone', zoneFields)} showDelete onDelete={() => setDeleteItem({ type: 'zone', id: zone.id, name: zone.title_key })} />
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${zone.color === 'indigo' ? 'bg-indigo-500' : 'bg-sky-500'} text-white`}>
                    {zone.badge}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{getText(zone.title_key)}</h3>
                    <p className="text-slate-400 text-sm">{cards.filter(c => c.zone_id === zone.id).length} modules</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button onClick={() => openAdd('card', 'Ajouter un Module', cardFields, { zone_id: zone.id, order: cards.filter(c => c.zone_id === zone.id).length + 1, active: true })} className="text-sky-400 text-sm hover:text-sky-300">
                    + Ajouter un module
                  </button>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cards.filter(c => c.zone_id === zone.id).sort((a, b) => a.order - b.order).map(card => (
                      <div key={card.id} className="bg-white/5 px-3 py-1 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                        <span>{card.title_key}</span>
                        <button onClick={() => openEdit('card', card, 'Modifier le Module', cardFields)} className="text-sky-400 hover:text-sky-300">✏️</button>
                        <button onClick={() => setDeleteItem({ type: 'card', id: card.id, name: card.title_key })} className="text-red-400 hover:text-red-300">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
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

      <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={(data, stayOpen) => handleSave(data, stayOpen)} title={modalTitle} fields={modalFields} initialData={modalData} saving={saving} />
      <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Confirmer la suppression" message={`Voulez-vous vraiment supprimer "${deleteItem?.name}" ?`} deleting={deleting} />
    </div>
  )
}
