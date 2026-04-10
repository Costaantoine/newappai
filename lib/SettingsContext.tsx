'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface SiteSettings {
  site: {
    logo_text: string
    logo_image_url: string
    favicon_url: string
    primary_color: string
    secondary_color: string
    accent_color: string
    background_color: string
    text_color: string
    text_secondary_color: string
  }
  hero: {
    enabled: boolean
    image_url: string
    opacity: number
    brightness: number
    overlay_opacity: number
    overlay_color: string
  }
  header: {
    style: string
    transparent: boolean
    blur: boolean
    blur_amount: number
    background_opacity: number
    background_image_url: string
    show_search: boolean
    show_cart: boolean
    show_language: boolean
    sticky: boolean
    shadow: boolean
  }
  footer: {
    enabled: boolean
    style: string
    background_color: string
    text_color: string
    show_socials: boolean
    show_links: boolean
    show_copyright: boolean
    copyright_text: string
  }
  contact: {
    email: string
    phone: string
    address: string
    facebook_url: string
    instagram_url: string
    linkedin_url: string
    twitter_url: string
    youtube_url: string
  }
  widgets: {
    ai_enabled: boolean
    cart_enabled: boolean
    sound_enabled: boolean
    chat_enabled: boolean
    back_to_top: boolean
  }
  cards: {
    style: string
    border_radius: number
    shadow: boolean
    hover_effect: string
    background_opacity: number
    animation: string
  }
  buttons: {
    primary_color: string
    secondary_color: string
    border_radius: number
    hover_effect: string
    transition_duration: number
  }
  animations: {
    enabled: boolean
    page_transition: string
    scroll_animation: string
    stagger_delay: number
  }
  audio: {
    enabled: boolean
    file_url: string
    volume: number
    muted: boolean
    loop: boolean
    autoplay: boolean
    fade_in: boolean
    fade_in_duration: number
    sound_hover_enabled: boolean
    sound_click_enabled: boolean
    sound_hover_url: string
    sound_click_url: string
  }
  music: {
    accueil: { url: string; volume: number }
    solutions: { url: string; volume: number }
    histoire: { url: string; volume: number }
    produits: { url: string; volume: number }
    contact: { url: string; volume: number }
  }
  sound_hover_enabled: boolean
  sound_click_enabled: boolean
  sound_hover_url: string
  sound_click_url: string
}

interface SettingsContextType {
  settings: SiteSettings | null
  loading: boolean
  updateSettings: () => void
}

const defaultSettings: SiteSettings = {
  site: {
    logo_text: 'NewAppAI',
    logo_image_url: '',
    favicon_url: '',
    primary_color: '#0ea5e9',
    secondary_color: '#6366f1',
    accent_color: '#8b5cf6',
    background_color: '#0f172a',
    text_color: '#ffffff',
    text_secondary_color: '#94a3b8'
  },
  hero: {
    enabled: true,
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    opacity: 100,
    brightness: 110,
    overlay_opacity: 50,
    overlay_color: '#000000'
  },
  header: {
    style: 'glass',
    transparent: false,
    blur: true,
    blur_amount: 10,
    background_opacity: 80,
    background_image_url: '',
    show_search: false,
    show_cart: true,
    show_language: true,
    sticky: true,
    shadow: true
  },
  footer: {
    enabled: true,
    style: 'dark',
    background_color: '#0f172a',
    text_color: '#94a3b8',
    show_socials: true,
    show_links: true,
    show_copyright: true,
    copyright_text: '© 2025 NewAppAI. Tous droits réservés.'
  },
  contact: {
    email: 'contact@newappai.com',
    phone: '+33 1 23 45 67 89',
    address: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    twitter_url: '',
    youtube_url: ''
  },
  widgets: {
    ai_enabled: true,
    cart_enabled: true,
    sound_enabled: false,
    chat_enabled: true,
    back_to_top: true
  },
  cards: {
    style: 'glass',
    border_radius: 16,
    shadow: true,
    hover_effect: 'scale',
    background_opacity: 50,
    animation: 'fade'
  },
  buttons: {
    primary_color: '#0ea5e9',
    secondary_color: '#6366f1',
    border_radius: 8,
    hover_effect: 'brightness',
    transition_duration: 300
  },
  animations: {
    enabled: true,
    page_transition: 'fade',
    scroll_animation: 'fade',
    stagger_delay: 100
  },
  audio: {
    enabled: false,
    file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    volume: 30,
    muted: false,
    loop: true,
    autoplay: false,
    fade_in: true,
    fade_in_duration: 2000,
    sound_hover_enabled: true,
    sound_click_enabled: true,
    sound_hover_url: 'https://cdn.freesound.org/previews/256/256113_4097033-lq.mp3',
    sound_click_url: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3'
  },
  music: {
    accueil: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', volume: 30 },
    solutions: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', volume: 30 },
    histoire: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', volume: 30 },
    produits: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', volume: 30 },
    contact: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', volume: 30 }
  },
  sound_hover_enabled: true,
  sound_click_enabled: true,
  sound_hover_url: 'https://cdn.freesound.org/previews/256/256113_4097033-lq.mp3',
  sound_click_url: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3'
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateSettings: () => { }
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const applyStyles = (merged: any) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', merged.site?.primary_color || '#0ea5e9')
      root.style.setProperty('--color-secondary', merged.site?.secondary_color || '#6366f1')
      root.style.setProperty('--color-accent', merged.site?.accent_color || '#8b5cf6')
      root.style.setProperty('--color-background', merged.site?.background_color || '#0f172a')
      root.style.setProperty('--color-text', merged.site?.text_color || '#ffffff')
      root.style.setProperty('--color-text-secondary', merged.site?.text_secondary_color || '#94a3b8')

      // Header variables
      const headerOpacity = (merged.header?.background_opacity || 80) / 100
      root.style.setProperty('--color-header-bg', merged.header?.transparent ? 'transparent' : `rgba(15, 23, 42, ${headerOpacity})`)

      // Card settings
      root.style.setProperty('--card-border-radius', `${merged.cards?.border_radius || 16}px`)
      root.style.setProperty('--card-opacity', `${merged.cards?.background_opacity || 50}%`)

      // Button settings
      root.style.setProperty('--button-radius', `${merged.buttons?.border_radius || 8}px`)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/local/settings', { cache: 'no-store' })
      const data = await res.json()
      const merged = { ...defaultSettings, ...(data.settings || {}) }
      setSettings(merged as SiteSettings)
      applyStyles(merged)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      setSettings(defaultSettings)
      applyStyles(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const pathname = usePathname()

  useEffect(() => {
    fetchSettings()
  }, [pathname])

  return (
    <SettingsContext.Provider value={{ settings: settings as SiteSettings, loading, updateSettings: fetchSettings }}>
      {settings && (
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --button-primary: ${settings.buttons?.primary_color || '#0ea5e9'} !important;
            --button-secondary: ${settings.buttons?.secondary_color || '#6366f1'} !important;
            --button-radius: ${settings.buttons?.border_radius || 8}px !important;
            --button-transition: ${settings.buttons?.transition_duration || 300}ms !important;
          }
          
          /* Site public override */
          .btn-primary {
            background-color: var(--button-primary) !important;
            border-radius: var(--button-radius) !important;
            transition: all var(--button-transition) !important;
            color: #ffffff !important;
          }
          
          .btn-secondary {
            background-color: var(--button-secondary) !important;
            border-radius: var(--button-radius) !important;
            transition: all var(--button-transition) !important;
            color: #ffffff !important;
          }
        `}} />
      )}
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    return { settings: defaultSettings, loading: false, updateSettings: () => { } }
  }
  return context
}
