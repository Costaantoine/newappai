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
  'home-test-title': { source: 'texts', textKey: 'home_test_title', label: 'Titre Tester les nouveautés' },
  'home-test-subtitle': { source: 'texts', textKey: 'home_test_subtitle', label: 'Sous-titre Tester les nouveautés' },
  'home-testimonials-title': { source: 'texts', textKey: 'home_testimonials_title', label: 'Titre Témoignages' },
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

  // NOTRE HISTOIRE
  'hist-title': { source: 'texts', textKey: 'hist_title', label: 'Titre Notre Histoire' },
  'hist-title-highlight': { source: 'texts', textKey: 'hist_title_highlight', label: 'Mot Histoire en vert' },
  'hist-subtitle': { source: 'texts', textKey: 'hist_subtitle', label: 'Sous-titre Histoire' },
  'hist-who-title': { source: 'texts', textKey: 'hist_who_title', label: 'Titre Qui sommes-nous' },
  'hist-who-desc': { source: 'texts', textKey: 'hist_who_desc', label: 'Description Qui sommes-nous' },
  'hist-mission-title': { source: 'texts', textKey: 'hist_mission_title', label: 'Titre Mission' },
  'hist-mission-desc': { source: 'texts', textKey: 'hist_mission_desc', label: 'Description Mission' },
  'hist-values-title': { source: 'texts', textKey: 'hist_values_title', label: 'Titre Valeurs' },
  'hist-value-innovation-title': { source: 'texts', textKey: 'hist_value_innovation_title', label: 'Titre Valeur Innovation' },
  'hist-value-innovation-desc': { source: 'texts', textKey: 'hist_value_innovation_desc', label: 'Description Innovation' },
  'hist-value-proximity-title': { source: 'texts', textKey: 'hist_value_proximity_title', label: 'Titre Valeur Proximité' },
  'hist-value-proximity-desc': { source: 'texts', textKey: 'hist_value_proximity_desc', label: 'Description Proximité' },
  'hist-value-excellence-title': { source: 'texts', textKey: 'hist_value_excellence_title', label: 'Titre Valeur Excellence' },
  'hist-value-excellence-desc': { source: 'texts', textKey: 'hist_value_excellence_desc', label: 'Description Excellence' },
  'hist-value-transparency-title': { source: 'texts', textKey: 'hist_value_transparency_title', label: 'Titre Valeur Transparence' },
  'hist-value-transparency-desc': { source: 'texts', textKey: 'hist_value_transparency_desc', label: 'Description Transparence' },
  'hist-team-title': { source: 'texts', textKey: 'hist_team_title', label: 'Titre Équipe' },
  'hist-team-direction-title': { source: 'texts', textKey: 'hist_team_direction_title', label: 'Titre Direction' },
  'hist-team-direction-desc': { source: 'texts', textKey: 'hist_team_direction_desc', label: 'Description Direction' },
  'hist-team-engineering-title': { source: 'texts', textKey: 'hist_team_engineering_title', label: 'Titre Ingénierie' },
  'hist-team-engineering-desc': { source: 'texts', textKey: 'hist_team_engineering_desc', label: 'Description Ingénierie' },
  'hist-team-design-title': { source: 'texts', textKey: 'hist_team_design_title', label: 'Titre Design' },
  'hist-team-design-desc': { source: 'texts', textKey: 'hist_team_design_desc', label: 'Description Design' },

  // LEGAL PAGES
  'legal-mentions-title': { source: 'texts', textKey: 'legal_mentions_title', label: 'Titre Mentions légales' },
  'legal-mentions-section-1': { source: 'texts', textKey: 'legal_mentions_section_1_title', label: 'Section Éditeur' },
  'legal-mentions-section-2': { source: 'texts', textKey: 'legal_mentions_section_2_title', label: 'Section Hébergement' },
  'legal-mentions-section-3': { source: 'texts', textKey: 'legal_mentions_section_3_title', label: 'Section Propriété intellectuelle' },
  'legal-mentions-section-4': { source: 'texts', textKey: 'legal_mentions_section_4_title', label: 'Section Responsabilité' },
  'legal-mentions-section-5': { source: 'texts', textKey: 'legal_mentions_section_5_title', label: 'Section Données personnelles' },
  'legal-mentions-section-6': { source: 'texts', textKey: 'legal_mentions_section_6_title', label: 'Section Cookies' },
  'legal-mentions-section-7': { source: 'texts', textKey: 'legal_mentions_section_7_title', label: 'Section Droit applicable' },
  'legal-cgv-title': { source: 'texts', textKey: 'legal_cgv_title', label: 'Titre CGV' },

  // HEADER
  'header-logo-text': { source: 'texts', textKey: 'header_logo_text', label: 'Texte Logo Header' },
  'header-tagline': { source: 'texts', textKey: 'header_tagline', label: 'Slogan Header' },

  // FOOTER
  'footer-logo-text': { source: 'texts', textKey: 'footer_logo_text', label: 'Texte Logo Footer' },

  // SOLUTIONS PAGE
  'solutions-see-products': { source: 'texts', textKey: 'solutions_see_products', label: 'CTA Voir produits' },
  'solutions-see-website': { source: 'texts', textKey: 'solutions_see_website', label: 'CTA Site associé' },
  'solutions-loading': { source: 'texts', textKey: 'solutions_loading', label: 'Chargement solutions' },

  // CONTACT
  'contact-response-time': { source: 'texts', textKey: 'contact_response_time', label: 'Délai réponse' },
  'contact-subject-placeholder': { source: 'texts', textKey: 'contact_subject_placeholder', label: 'Placeholder sujet' },
  'contact-placeholder': { source: 'texts', textKey: 'contact_placeholder', label: 'Placeholder message' },

  // ERV - Hero
  'erv-hero-desc': { source: 'texts', textKey: 'erv_hero_desc', label: 'Description Hero ERV' },
  'erv-cta-commencer': { source: 'texts', textKey: 'erv_cta_commencer', label: 'CTA Commencer ERV' },
  'erv-format-pdf': { source: 'texts', textKey: 'erv_format_pdf', label: 'Format PDF ERV' },
  'erv-format-epub': { source: 'texts', textKey: 'erv_format_epub', label: 'Format EPUB ERV' },
  'erv-format-txt': { source: 'texts', textKey: 'erv_format_txt', label: 'Format TXT ERV' },
  'erv-format-docx': { source: 'texts', textKey: 'erv_format_docx', label: 'Format DOCX ERV' },

  // ERV - Steps
  'erv-step-1-title': { source: 'texts', textKey: 'erv_step_1_title', label: 'Étape 1 titre ERV' },
  'erv-step-1-desc': { source: 'texts', textKey: 'erv_step_1_desc', label: 'Étape 1 desc ERV' },
  'erv-step-2-title': { source: 'texts', textKey: 'erv_step_2_title', label: 'Étape 2 titre ERV' },
  'erv-step-2-desc': { source: 'texts', textKey: 'erv_step_2_desc', label: 'Étape 2 desc ERV' },
  'erv-step-3-title': { source: 'texts', textKey: 'erv_step_3_title', label: 'Étape 3 titre ERV' },
  'erv-step-3-desc': { source: 'texts', textKey: 'erv_step_3_desc', label: 'Étape 3 desc ERV' },
  'erv-step-4-title': { source: 'texts', textKey: 'erv_step_4_title', label: 'Étape 4 titre ERV' },
  'erv-step-4-desc': { source: 'texts', textKey: 'erv_step_4_desc', label: 'Étape 4 desc ERV' },

  // ERV - Features
  'erv-feature-1-title': { source: 'texts', textKey: 'erv_feature_1_title', label: 'Fonctionnalité 1 titre ERV' },
  'erv-feature-1-desc': { source: 'texts', textKey: 'erv_feature_1_desc', label: 'Fonctionnalité 1 desc ERV' },
  'erv-feature-2-title': { source: 'texts', textKey: 'erv_feature_2_title', label: 'Fonctionnalité 2 titre ERV' },
  'erv-feature-2-desc': { source: 'texts', textKey: 'erv_feature_2_desc', label: 'Fonctionnalité 2 desc ERV' },
  'erv-feature-3-title': { source: 'texts', textKey: 'erv_feature_3_title', label: 'Fonctionnalité 3 titre ERV' },
  'erv-feature-3-desc': { source: 'texts', textKey: 'erv_feature_3_desc', label: 'Fonctionnalité 3 desc ERV' },
  'erv-feature-4-title': { source: 'texts', textKey: 'erv_feature_4_title', label: 'Fonctionnalité 4 titre ERV' },
  'erv-feature-4-desc': { source: 'texts', textKey: 'erv_feature_4_desc', label: 'Fonctionnalité 4 desc ERV' },

  // ERV - Pricing + Conf
  'erv-pricing-note': { source: 'texts', textKey: 'erv_pricing_note', label: 'Note tarifs ERV' },
  'erv-cta-commander': { source: 'texts', textKey: 'erv_cta_commander', label: 'CTA Commander ERV' },
  'erv-conf-title': { source: 'texts', textKey: 'erv_conf_title', label: 'Titre confidentialité ERV' },
  'erv-conf-desc-1': { source: 'texts', textKey: 'erv_conf_desc_1', label: 'Description conf ERV 1' },
  'erv-conf-desc-2': { source: 'texts', textKey: 'erv_conf_desc_2', label: 'Description conf ERV 2' },
  'erv-conf-desc-3': { source: 'texts', textKey: 'erv_conf_desc_3', label: 'Description conf ERV 3' },

  // QRcall
  'qrcall-hero-desc': { source: 'texts', textKey: 'qrcall_hero_desc', label: 'Description Hero QRcall' },
  'qrcall-step-1-title': { source: 'texts', textKey: 'qrcall_step_1_title', label: 'Étape 1 titre QRcall' },
  'qrcall-step-1-desc': { source: 'texts', textKey: 'qrcall_step_1_desc', label: 'Étape 1 desc QRcall' },
  'qrcall-step-2-title': { source: 'texts', textKey: 'qrcall_step_2_title', label: 'Étape 2 titre QRcall' },
  'qrcall-step-2-desc': { source: 'texts', textKey: 'qrcall_step_2_desc', label: 'Étape 2 desc QRcall' },
  'qrcall-step-3-title': { source: 'texts', textKey: 'qrcall_step_3_title', label: 'Étape 3 titre QRcall' },
  'qrcall-step-3-desc': { source: 'texts', textKey: 'qrcall_step_3_desc', label: 'Étape 3 desc QRcall' },
  'qrcall-building-cta': { source: 'texts', textKey: 'qrcall_building_cta', label: 'CTA Immeuble QRcall' },
  'qrcall-building-price-note': { source: 'texts', textKey: 'qrcall_building_price_note', label: 'Note prix immeuble' },
  'qrcall-simulator-title': { source: 'texts', textKey: 'qrcall_simulator_title', label: 'Titre simulateur' },
  'qrcall-simulator-example': { source: 'texts', textKey: 'qrcall_simulator_example', label: 'Exemple simulateur' },

  // PRODUITS PAGE
  'products-cat-industrie': { source: 'texts', textKey: 'products_cat_industrie', label: 'Catégorie Industrie' },
  'products-cat-comptabilite': { source: 'texts', textKey: 'products_cat_comptabilite', label: 'Catégorie Comptabilité' },
  'products-cat-outils-services': { source: 'texts', textKey: 'products_cat_outils_services', label: 'Catégorie Outils' },
  'products-cat-commerce': { source: 'texts', textKey: 'products_cat_commerce', label: 'Catégorie Commerce' },
  'products-cat-droit': { source: 'texts', textKey: 'products_cat_droit', label: 'Catégorie Droit' },
  'products-cat-webdesign': { source: 'texts', textKey: 'products_cat_webdesign', label: 'Catégorie Web design' },
  'products-cat-a-tester': { source: 'texts', textKey: 'products_cat_a_tester', label: 'Catégorie À tester' },
  'products-empty-title': { source: 'texts', textKey: 'products_empty_title', label: 'Titre vide produits' },
  'products-empty-desc': { source: 'texts', textKey: 'products_empty_desc', label: 'Description vide produits' },
  'products-contact-us': { source: 'texts', textKey: 'products_contact_us', label: 'Bouton nous contacter' },

  // HOME - Apps test section
  'home-app-erv-name': { source: 'texts', textKey: 'home_app_erv_name', label: 'Nom ERV test' },
  'home-app-qrcall-name': { source: 'texts', textKey: 'home_app_qrcall_name', label: 'Nom QRcall test' },
  'home-app-chatbot-name': { source: 'texts', textKey: 'home_app_chatbot_name', label: 'Nom Chatbot test' },
  'home-app-click-name': { source: 'texts', textKey: 'home_app_click_name', label: 'Nom Click test' },
  'home-app-prod-name': { source: 'texts', textKey: 'home_app_prod_name', label: 'Nom Production test' },
  'home-app-paperasse-name': { source: 'texts', textKey: 'home_app_paperasse_name', label: 'Nom Paperasse test' },
  'home-app-site-name': { source: 'texts', textKey: 'home_app_site_name', label: 'Nom Site test' },
  'home-app-talkie-name': { source: 'texts', textKey: 'home_app_talkie_name', label: 'Nom Talkie test' },
  'home-app-serenite-name': { source: 'texts', textKey: 'home_app_serenite_name', label: 'Nom Sérénité test' },
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
    const config = SECTION_CONFIG[section] || { source: 'texts' as const, textKey: section, label: section }
    if (!config) return

    setSaving(true)
    try {
      // Construire l'objet multilingue
      const langValue = {
        fr: data.texts?.fr ?? data.fr ?? '',
        en: data.texts?.en ?? data.en ?? '',
        pt: data.texts?.pt ?? data.pt ?? '',
        es: data.texts?.es ?? data.es ?? '',
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
        const textKey = resolveTextKey(config.textKey || section)
        const existingText = texts.find(t => t.key === textKey)

        if (existingText) {
          // Mettre à jour le texte existant
          const res = await fetch('/api/supabase/texts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: existingText.id,
              key: textKey,
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
              key: textKey,
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
      { name: 'texts', label: 'Texte', type: 'languages' as const },
    ]
  }

  // Résoudre la clé de texte réelle pour le fallback : la section peut être en tirets
  // (ex: 'about-approach-title') alors que la clé DB est en underscores (ex: 'about_approach_title')
  const resolveTextKey = (section: string): string => {
    const underscore = section.replace(/-/g, '_')
    if (texts.some(t => t.key === section)) return section
    if (texts.some(t => t.key === underscore)) return underscore
    return underscore
  }

  const getInitialData = () => {
    if (!activeEdit) return {}
    const config = SECTION_CONFIG[activeEdit.section] || { source: 'texts' as const, textKey: activeEdit.section, label: activeEdit.section }
    if (!config) return {}

    if (config.source === 'settings') {
      const currentValue = getNested(settings, config.settingsPath!) || {}
      return {
        texts: {
          fr: currentValue.fr || '',
          en: currentValue.en || '',
          pt: currentValue.pt || '',
          es: currentValue.es || '',
        },
      }
    } else {
      const textKey = resolveTextKey(config.textKey || activeEdit.section)
      const textItem = texts.find(t => t.key === textKey)
      if (!textItem) return { texts: { fr: '', en: '', pt: '', es: '' } }
      return {
        texts: {
          fr: textItem.fr || '',
          en: textItem.en || '',
          pt: textItem.pt || '',
          es: textItem.es || '',
        },
      }
    }
  }

  return (
    <>
      {/* Feuille de style pour le mode édition */}
      {editMode && (
        <style jsx global>{`
          body.edit-mode-active [data-section] {
            outline: 2px dashed rgba(139, 92, 246, 0.6);
            outline-offset: 4px;
            position: relative;
            cursor: pointer;
            transition: outline-color 0.2s, background-color 0.2s;
            border-radius: 4px;
          }
          body.edit-mode-active [data-section]:hover {
            outline-color: #8b5cf6;
            background-color: rgba(139, 92, 246, 0.05);
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
        className={`fixed bottom-6 left-6 z-[9999] px-4 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 flex items-center gap-2 ${
          editMode
            ? 'bg-red-500 text-white hover:bg-red-400 scale-110'
            : 'bg-violet-500 text-white hover:bg-violet-400'
        }`}
        style={{
          boxShadow: editMode
            ? '0 0 20px rgba(239, 68, 68, 0.5)'
            : '0 0 20px rgba(139, 92, 246, 0.5)',
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
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-500/50 outline-none transition-colors"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm text-center">{passwordError}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={passwordLoading || !passwordInput}
                  className="flex-1 bg-violet-500 text-white py-2.5 rounded-lg font-bold hover:bg-violet-400 disabled:opacity-50 transition-colors"
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
