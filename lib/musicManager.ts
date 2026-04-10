// Music Manager - Singleton pattern for page-specific background music
// Reads configuration from API settings

interface MusicConfig {
  url: string
  volume: number
}

interface MusicSettings {
  accueil: MusicConfig
  solutions: MusicConfig
  histoire: MusicConfig
  produits: MusicConfig
  contact: MusicConfig
}

// SoundHelix default URLs — CORS-friendly, public domain
const DEFAULT_MUSIC_URLS: Record<string, string> = {
  '/': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  '/solutions': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  '/about': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  '/produits': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  '/contact': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
}

// Map pathname to settings key
const PAGE_MAP: Record<string, keyof MusicSettings> = {
  '/': 'accueil',
  '/solutions': 'solutions',
  '/about': 'histoire',
  '/produits': 'produits',
  '/contact': 'contact',
}

class MusicManager {
  private static instance: MusicManager
  private audio: HTMLAudioElement | null = null
  private currentPage: string = ''
  private isMuted: boolean = false
  private defaultVolume: number = 0.3
  private hideTimeout: ReturnType<typeof setTimeout> | null = null
  private settings: MusicSettings | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('newappai_muted') === 'true'
      this.audio = new Audio()
      this.audio.volume = this.isMuted ? 0 : this.defaultVolume
      this.audio.loop = true
      
      // Load settings from API
      this.loadSettings()
    }
  }

  static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager()
    }
    return MusicManager.instance
  }

  private async loadSettings(): Promise<void> {
    try {
      const res = await fetch('/api/local/settings')
      const data = await res.json()
      if (data.settings?.music) {
        this.settings = data.settings.music
      }
    } catch (error) {
      console.error('Failed to load music settings:', error)
    }
  }

  setPage(path: string): void {
    if (!this.audio) return
    
    // Get page key from pathname
    const pageKey = PAGE_MAP[path]
    if (!pageKey) {
      console.log('No music mapping for path:', path)
      return
    }
    
    // Get config for this page
    const config = this.settings?.[pageKey]
    if (!config?.url) {
      console.log('No music URL for page:', pageKey)
      return
    }
    
    // Si on est déjà sur cette page et que la musique joue, ne rien faire
    if (this.currentPage === path && !this.audio.paused) {
      return
    }
    
    console.log('Switching music to:', pageKey, config.url)
    
    // Si c'est la première fois ou qu'on change de page
    if (this.currentPage === '' || this.audio.paused) {
      this.audio.src = config.url
      this.audio.currentTime = 0
      this.defaultVolume = config.volume / 100
      this.fadeIn()
      this.currentPage = path
      return
    }
    
    // Fade out current track puis changer
    this.fadeOut(() => {
      if (this.audio) {
        this.audio.src = config.url
        this.audio.currentTime = 0
        this.defaultVolume = config.volume / 100
        this.fadeIn()
      }
    })
    
    this.currentPage = path
  }

  private fadeOut(callback: () => void): void {
    if (!this.audio) {
      callback()
      return
    }

    const fadeSteps = 10
    const fadeInterval = 500 / fadeSteps // 0.5s total
    const volumeStep = this.audio.volume / fadeSteps
    let currentStep = 0

    const fadeTimer = setInterval(() => {
      if (!this.audio) {
        clearInterval(fadeTimer)
        callback()
        return
      }

      currentStep++
      this.audio.volume = Math.max(0, this.audio.volume - volumeStep)

      if (currentStep >= fadeSteps) {
        clearInterval(fadeTimer)
        callback()
      }
    }, fadeInterval)
  }

  private fadeIn(): void {
    if (!this.audio) return

    this.audio.volume = 0
    
    // Commencer la lecture
    this.audio.play().catch((err) => {
      console.error('Error starting playback:', err)
    })
    
    const fadeSteps = 10
    const fadeInterval = 500 / fadeSteps // 0.5s total
    const volumeStep = this.defaultVolume / fadeSteps
    let currentStep = 0

    const fadeTimer = setInterval(() => {
      if (!this.audio || this.isMuted) {
        clearInterval(fadeTimer)
        return
      }

      currentStep++
      this.audio.volume = Math.min(this.defaultVolume, this.audio.volume + volumeStep)

      if (currentStep >= fadeSteps) {
        clearInterval(fadeTimer)
      }
    }, fadeInterval)
  }

  async play(): Promise<void> {
    if (!this.audio) return
    
    try {
      await this.audio.play()
    } catch (error) {
      console.error('Music play error:', error)
    }
  }

  pause(): void {
    if (!this.audio) return
    this.audio.pause()
  }

  toggle(): void {
    if (this.audio?.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  mute(): void {
    this.isMuted = true
    if (this.audio) {
      this.audio.volume = 0
    }
    localStorage.setItem('newappai_muted', 'true')
  }

  unmute(): void {
    this.isMuted = false
    if (this.audio) {
      this.audio.volume = this.defaultVolume
    }
    localStorage.setItem('newappai_muted', 'false')
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }
  }

  setVolume(value: number): void {
    this.defaultVolume = value
    if (!this.isMuted && this.audio) {
      this.audio.volume = value
    }
  }

  getIsMuted(): boolean {
    return this.isMuted
  }

  getVolume(): number {
    return this.defaultVolume
  }

  getIsPlaying(): boolean {
    return this.audio ? !this.audio.paused : false
  }

  scheduleHide(callback: () => void, delay: number = 2000): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }
    this.hideTimeout = setTimeout(callback, delay)
  }

  cancelHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = null
    }
  }
}

export const musicManager = MusicManager.getInstance()
export { PAGE_MAP }
export type { MusicSettings, MusicConfig }
