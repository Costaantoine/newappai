'use client'

import { useState, useEffect, useCallback } from 'react'
import EditModal from './EditModal'

interface SectionConfig {
  source: 'settings' | 'texts'
  settingsPath?: string
  textKey?: string
  label: string
}

const SECTION_CONFIG: Record<string, SectionConfig> = {
  'hero-title': { source: 'settings', settingsPath: 'hero_texts.title', label: 'Titre Hero' },
  'hero-subtitle': { source: 'settings', settingsPath: 'hero_texts.subtitle', label: 'Sous-titre Hero' },
  'hero-cta-1': { source: 'settings', settingsPath: 'hero_texts.cta1', label: 'CTA Hero 1' },
  'hero-cta-2': { source: 'settings', settingsPath: 'hero_texts.cta2', label: 'CTA Hero 2' },
  'solutions-title': { source: 'texts', textKey: 'solutions_title', label: 'Titre Solutions' },
  'products-title': { source: 'texts', textKey: 'products_title', label: 'Titre Produits' },
  'contact-title': { source: 'texts', textKey: 'contact_title', label: 'Titre Contact' },
  'contact-subtitle': { source: 'texts', textKey: 'contact_subtitle', label: 'Sous-titre Contact' },
  'about-title': { source: 'texts', textKey: 'about_title', label: 'Titre À propos' },
  'about-subtitle': { source: 'texts', textKey: 'about_subtitle', label: 'Sous-titre À propos' },
  'about-vision': { source: 'texts', textKey: 'about_vision_title', label: 'Titre Vision' },
  'about-approach': { source: 'texts', textKey: 'about_approach_title', label: 'Titre Approche' },
  'about-values': { source: 'texts', textKey: 'about_values_title', label: 'Titre Valeurs' },
  'expertise-title': { source: 'texts', textKey: 'expertise_title', label: 'Titre Expertise' },
  'site-logo-text': { source: 'texts', textKey: 'site_logo_text', label: 'Texte du logo' },
  'nav-products': { source: 'texts', textKey: 'nav_products', label: 'Navigation Produits' },
  'nav-qrcall': { source: 'texts', textKey: 'nav_qrcall', label: 'Navigation QRcall' },
  'footer-tagline': { source: 'texts', textKey: 'footer_tagline', label: 'Slogan Footer' },
  'footer-quick-links': { source: 'texts', textKey: 'footer_quick_links', label: 'Titre Liens rapides' },
  'footer-link-home': { source: 'texts', textKey: 'footer_link_home', label: 'Lien Accueil' },
  'footer-link-solutions': { source: 'texts', textKey: 'footer_link_solutions', label: 'Lien Solutions' },
  'footer-link-products': { source: 'texts', textKey: 'footer_link_products', label: 'Lien Produits' },
  'footer-link-contact': { source: 'texts', textKey: 'footer_link_contact', label: 'Lien Contact' },
  'footer-follow-us': { source: 'texts', textKey: 'footer_follow_us', label: 'Titre Suivez-nous' },
  'footer-copyright': { source: 'texts', textKey: 'footer_copyright', label: 'Copyright' },
  'footer-legal': { source: 'texts', textKey: 'footer_legal', label: 'Mentions légales' },
  'footer-cgv': { source: 'texts', textKey: 'footer_cgv', label: 'CGV' },
  'footer-privacy': { source: 'texts', textKey: 'footer_privacy', label: 'Confidentialité' },
  'hero-subtitle2': { source: 'settings', settingsPath: 'hero_texts.subtitle2', label: 'Sous-titre Hero 2' },
  'products-buy': { source: 'texts', textKey: 'products_buy', label: 'Bouton Acheter' },
  'solutions-subtitle': { source: 'texts', textKey: 'solutions_subtitle', label: 'Sous-titre Solutions' },
  'products-subtitle': { source: 'texts', textKey: 'products_subtitle', label: 'Sous-titre Produits' },
  'contact-name': { source: 'texts', textKey: 'contact_name', label: 'Champ Nom' },
  'contact-email': { source: 'texts', textKey: 'contact_email', label: 'Champ Email' },
  'contact-subject': { source: 'texts', textKey: 'contact_subject', label: 'Champ Sujet' },
  'contact-message': { source: 'texts', textKey: 'contact_message', label: 'Champ Message' },
  'contact-send': { source: 'texts', textKey: 'contact_send', label: 'Bouton Envoyer' },
  'contact-sent': { source: 'texts', textKey: 'contact_sent', label: 'Message envoyé' },
  'contact-sent-desc': { source: 'texts', textKey: 'contact_sent_desc', label: 'Description envoi réussi' },
  'contact-subject-1': { source: 'texts', textKey: 'contact_subject_1', label: 'Sujet Démo' },
  'contact-subject-2': { source: 'texts', textKey: 'contact_subject_2', label: 'Sujet Partenariat' },
  'contact-subject-3': { source: 'texts', textKey: 'contact_subject_3', label: 'Sujet Support' },
  'contact-subject-4': { source: 'texts', textKey: 'contact_subject_4', label: 'Sujet Autre' },
  'about-vision-desc': { source: 'texts', textKey: 'about_vision_desc', label: 'Description Vision' },
  'about-approach-desc': { source: 'texts', textKey: 'about_approach_desc', label: 'Description Approche' },
  'about-innovation-title': { source: 'texts', textKey: 'about_innovation_title', label: 'Titre Innovation' },
  'about-proximity-title': { source: 'texts', textKey: 'about_proximity_title', label: 'Titre Proximité' },
  'about-excellence-title': { source: 'texts', textKey: 'about_excellence_title', label: 'Titre Excellence' },
  'about-innovation-desc': { source: 'texts', textKey: 'about_innovation_desc', label: 'Description Innovation' },
  'about-proximity-desc': { source: 'texts', textKey: 'about_proximity_desc', label: 'Description Proximité' },
  'about-excellence-desc': { source: 'texts', textKey: 'about_excellence_desc', label: 'Description Excellence' },
  'erv-badge': { source: 'texts', textKey: 'erv_badge', label: 'Badge EasyReadVoice' },
  'erv-hero-title': { source: 'texts', textKey: 'erv_hero_title', label: 'Titre Hero ERV' },
  'erv-hero-subtitle': { source: 'texts', textKey: 'erv_hero_subtitle', label: 'Sous-titre Hero ERV' },
  'erv-why-title': { source: 'texts', textKey: 'erv_why_title', label: 'Pourquoi EasyReadVoice ?' },
  'erv-pricing-title': { source: 'texts', textKey: 'erv_pricing_title', label: 'Titre Tarifs' },
  'erv-pricing-subtitle': { source: 'texts', textKey: 'erv_pricing_subtitle', label: 'Sous-titre Tarifs' },
  'erv-how-title': { source: 'texts', textKey: 'erv_how_title', label: 'Comment ça marche' },
  'erv-token-note': { source: 'texts', textKey: 'erv_token_note', label: 'Note tokens' },
  'erv-faq-title': { source: 'texts', textKey: 'erv_faq_title', label: 'FAQ' },
  'erv-buy': { source: 'texts', textKey: 'erv_buy', label: 'Commander' },
  'qrcall-badge': { source: 'texts', textKey: 'qrcall_badge', label: 'Badge QRcall' },
  'qrcall-hero-title': { source: 'texts', textKey: 'qrcall_hero_title', label: 'Titre Hero QRcall' },
  'qrcall-hero-subtitle': { source: 'texts', textKey: 'qrcall_hero_subtitle', label: 'Sous-titre Hero QRcall' },
  'qrcall-cta-1': { source: 'texts', textKey: 'qrcall_cta_1', label: 'CTA Creer QR' },
  'qrcall-cta-2': { source: 'texts', textKey: 'qrcall_cta_2', label: 'CTA Immeuble' },
  'qrcall-how-title': { source: 'texts', textKey: 'qrcall_how_title', label: 'Comment ca marche' },
  'qrcall-plans-title': { source: 'texts', textKey: 'qrcall_plans_title', label: 'Titre Forfaits' },
  'qrcall-plans-subtitle': { source: 'texts', textKey: 'qrcall_plans_subtitle', label: 'Sous-titre Forfaits' },
  'qrcall-popular': { source: 'texts', textKey: 'qrcall_popular', label: 'Populaire' },
  'qrcall-choose': { source: 'texts', textKey: 'qrcall_choose', label: 'Choisir' },
  'qrcall-building-badge': { source: 'texts', textKey: 'qrcall_building_badge', label: 'Badge Immeuble' },
  'qrcall-faq-title': { source: 'texts', textKey: 'qrcall_faq_title', label: 'FAQ' },
}

function getNested(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function setNested(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const result = { ...obj }
  let current = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key] || typeof current[key] !== 'object') current[key] = {}
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
  return result
}

export default function FrontendEditor() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [settings, setSettings] = useState<any>({})
  const [texts, setTexts] = useState<any[]>([])
  const [activeEdit, setActiveEdit] = useState<{ section: string } | null>(null)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false))
  }, [])

  // Charger les settings
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
    } catch {
      console.warn('FrontendEditor: unable to load settings')
    }
  }, [])

  // Charger les textes
  const loadTexts = useCallback(async () => {
    try {
      const res = await fetch('/api/supabase/texts')
      const data = await res.json()
      setTexts(Array.isArray(data.texts) ? data.texts : [])
    } catch {
      console.warn('FrontendEditor: unable to load texts')
    }
  }, [])

  useEffect(() => {
    if (editMode) {
      loadSettings()
      loadTexts()
    }
  }, [editMode, loadSettings, loadTexts])

  // Gérer le clic sur une section éditable
  useEffect(() => {
    if (!editMode) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const sectionEl = target.closest('[data-section]') as HTMLElement | null
      if (!sectionEl) return

      // Ignorer si on clique sur le toggle ou le modal
      if (target.closest('[data-editor-toggle]') || target.closest('[data-editor-modal]') || target.closest('[data-password-modal]')) return

      e.preventDefault()
      e.stopPropagation()

      const section = sectionEl.dataset.section!
      // Load fresh data when clicking
      loadSettings()
      loadTexts()
      setActiveEdit({ section })
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [editMode, loadSettings, loadTexts])

  // Gérer le survol pour les icônes ✏️
  useEffect(() => {
    if (!editMode) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const sectionEl = target.closest('[data-section]') as HTMLElement | null
      setHoveredSection(sectionEl?.dataset.section || null)
    }

    document.addEventListener('mouseover', handleMouseOver)
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [editMode])

  // Gérer le clic sur le bouton Mode Édition
  const handleEditToggleClick = () => {
    if (editMode) {
      // Désactiver le mode édition
      setEditMode(false)
      document.body.classList.remove('edit-mode-active')
      setHoveredSection(null)
      setActiveEdit(null)
    } else if (isAdmin) {
      // Déjà admin, activer directement
      setEditMode(true)
      document.body.classList.add('edit-mode-active')
    } else {
      // Pas admin, demander le mot de passe
      setPasswordInput('')
      setPasswordError('')
      setShowPasswordModal(true)
    }
  }

  // Valider le mot de passe
  const handlePasswordSubmit = async () => {
    setPasswordLoading(true)
    setPasswordError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      })

      if (res.ok) {
        setIsAdmin(true)
        setShowPasswordModal(false)
        setEditMode(true)
        document.body.classList.add('edit-mode-active')
      } else {
        setPasswordError('Mot de passe incorrect')
      }
    } catch {
      setPasswordError('Erreur de connexion')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Sauvegarder les modifications
  const handleSave = async (data: any) => {
    if (!activeEdit) return

    const section = activeEdit.section
    const config = SECTION_CONFIG[section]
    if (!config) return

    setSaving(true)
    try {
      // Construire l'objet multilingue
      const langValue = {
        fr: data.fr || '',
        en: data.en || '',
        pt: data.pt || '',
        es: data.es || '',
      }

      if (config.source === 'settings') {
        // Sauvegarder dans les settings
        const updatedSettings = setNested(settings, config.settingsPath!, langValue)

        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSettings),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Save failed')
        }

        setSettings(updatedSettings)
      } else if (config.source === 'texts') {
        // Sauvegarder dans les textes Supabase
        const existingText = texts.find(t => t.key === config.textKey)

        if (existingText) {
          // Mettre à jour le texte existant
          const res = await fetch('/api/supabase/texts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: existingText.id,
              key: config.textKey,
              ...langValue,
            }),
          })

          if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.error || 'Save failed')
          }
        } else {
          // Créer un nouveau texte
          const res = await fetch('/api/supabase/texts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: config.textKey,
              ...langValue,
            }),
          })

          if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.error || 'Create failed')
          }
        }

        // Recharger les textes
        await loadTexts()
      }

      setActiveEdit(null)
      window.location.reload()
    } catch (err) {
      console.error('Save error:', err)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin && !showPasswordModal) return null

  // Construire les champs du modal à partir des données chargées
  const buildModalFields = () => {
    if (!activeEdit) return []
    return [
      { name: 'fr', label: 'Français', type: 'textarea' as const },
      { name: 'en', label: 'Anglais', type: 'textarea' as const },
      { name: 'pt', label: 'Portugais', type: 'textarea' as const },
      { name: 'es', label: 'Espagnol', type: 'textarea' as const },
    ]
  }

  const getInitialData = () => {
    if (!activeEdit) return {}
    const config = SECTION_CONFIG[activeEdit.section]
    if (!config) return {}

    if (config.source === 'settings') {
      const currentValue = getNested(settings, config.settingsPath!) || {}
      return {
        fr: currentValue.fr || '',
        en: currentValue.en || '',
        pt: currentValue.pt || '',
        es: currentValue.es || '',
      }
    } else {
      const textItem = texts.find(t => t.key === config.textKey)
      if (!textItem) return { fr: '', en: '', pt: '', es: '' }
      return {
        fr: textItem.fr || '',
        en: textItem.en || '',
        pt: textItem.pt || '',
        es: textItem.es || '',
      }
    }
  }

  return (
    <>
      {/* Feuille de style pour le mode édition */}
      {editMode && (
        <style jsx global>{`
          body.edit-mode-active [data-section] {
            outline: 2px dashed rgba(56, 189, 248, 0.6);
            outline-offset: 4px;
            position: relative;
            cursor: pointer;
            transition: outline-color 0.2s, background-color 0.2s;
            border-radius: 4px;
          }
          body.edit-mode-active [data-section]:hover {
            outline-color: #0ea5e9;
            background-color: rgba(56, 189, 248, 0.05);
          }
          body.edit-mode-active [data-section]::after {
            content: "✏️";
            position: absolute;
            top: -12px;
            right: -12px;
            font-size: 16px;
            opacity: ${hoveredSection ? '1' : '0.7'};
            transition: opacity 0.2s, transform 0.2s;
            z-index: 9999;
            pointer-events: none;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          }
          body.edit-mode-active [data-section]:hover::after {
            opacity: 1;
            transform: scale(1.2);
          }
        `}</style>
      )}

      {/* Bouton flottant pour activer/désactiver le mode édition */}
      <button
        data-editor-toggle
        onClick={handleEditToggleClick}
        className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 flex items-center gap-2 ${
          editMode
            ? 'bg-red-500 text-white hover:bg-red-400 scale-110'
            : 'bg-sky-500 text-white hover:bg-sky-400'
        }`}
        style={{
          boxShadow: editMode
            ? '0 0 20px rgba(239, 68, 68, 0.5)'
            : '0 0 20px rgba(56, 189, 248, 0.5)',
        }}
      >
        <span>{editMode ? '✕' : '🖊️'}</span>
        <span className="hidden sm:inline">
          {editMode ? 'Quitter' : 'Mode Édition'}
        </span>
      </button>

      {/* Modal de mot de passe */}
      {showPasswordModal && (
        <div
          data-password-modal
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false)
            }
          }}
        >
          <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-sm border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Mode Édition
            </h3>
            <p className="text-slate-400 text-sm mb-6 text-center">
              Entrez le mot de passe administrateur pour accéder au mode édition.
            </p>
            <div className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePasswordSubmit()
                }}
                placeholder="Mot de passe"
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-colors"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm text-center">{passwordError}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={passwordLoading || !passwordInput}
                  className="flex-1 bg-sky-500 text-white py-2.5 rounded-lg font-bold hover:bg-sky-400 disabled:opacity-50 transition-colors"
                >
                  {passwordLoading ? 'Vérification...' : 'Valider'}
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {activeEdit && (
        <div data-editor-modal>
          <EditModal
            isOpen={true}
            onClose={() => setActiveEdit(null)}
            onSave={handleSave}
            title={`✏️ ${SECTION_CONFIG[activeEdit.section]?.label || activeEdit.section}`}
            fields={buildModalFields()}
            initialData={getInitialData()}
            saving={saving}
          />
        </div>
      )}
    </>
  )
}
