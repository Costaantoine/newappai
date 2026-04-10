interface SoundEffectSettings {
  sound_hover_enabled: boolean
  sound_click_enabled: boolean
  sound_hover_url: string | null
  sound_click_url: string | null
}

let clickListener: ((e: MouseEvent) => void) | null = null
let hoverListener: ((e: MouseEvent) => void) | null = null
let clickAudio: HTMLAudioElement | null = null
let currentSettings: SoundEffectSettings = {
  sound_hover_enabled: true,
  sound_click_enabled: true,
  sound_hover_url: 'https://cdn.freesound.org/previews/256/256113_4097033-lq.mp3',
  sound_click_url: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3',
}

function preloadClickSound() {
  if (currentSettings.sound_click_url) {
    clickAudio = new Audio(currentSettings.sound_click_url)
    clickAudio.volume = 0.15
    clickAudio.load()
  }
}

export function initSoundEffects(settings: SoundEffectSettings) {
  currentSettings = {
    sound_hover_enabled: settings.sound_hover_enabled,
    sound_click_enabled: settings.sound_click_enabled,
    sound_hover_url: settings.sound_hover_url,
    sound_click_url: settings.sound_click_url,
  }

  if (clickListener) {
    document.removeEventListener('click', clickListener)
    clickListener = null
  }
  if (hoverListener) {
    document.removeEventListener('mouseover', hoverListener)
    hoverListener = null
  }

  if (currentSettings.sound_click_url) {
    preloadClickSound()
  }

  if (currentSettings.sound_click_enabled) {
    clickListener = () => {
      if (!currentSettings.sound_click_enabled) return
      try {
        if (clickAudio && currentSettings.sound_click_url === clickAudio.src) {
          const clone = clickAudio.cloneNode() as HTMLAudioElement
          clone.volume = 0.15
          clone.play().catch(() => {})
        } else if (currentSettings.sound_click_url) {
          const audio = new Audio(currentSettings.sound_click_url)
          audio.volume = 0.15
          audio.play().catch(() => {})
        }
      } catch {}
    }
    document.addEventListener('click', clickListener)
  }

  if (currentSettings.sound_hover_enabled && currentSettings.sound_hover_url) {
    hoverListener = (e: MouseEvent) => {
      if (!currentSettings.sound_hover_enabled || !currentSettings.sound_hover_url) return
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        try {
          const audio = new Audio(currentSettings.sound_hover_url)
          audio.volume = 0.3
          audio.play().catch(() => {})
        } catch {}
      }
    }
    document.addEventListener('mouseover', hoverListener)
  }
}

export function destroySoundEffects() {
  if (clickListener) {
    document.removeEventListener('click', clickListener)
    clickListener = null
  }
  if (hoverListener) {
    document.removeEventListener('mouseover', hoverListener)
    hoverListener = null
  }
  clickAudio = null
}

export function getSoundEffectSettings(): SoundEffectSettings {
  return { ...currentSettings }
}
