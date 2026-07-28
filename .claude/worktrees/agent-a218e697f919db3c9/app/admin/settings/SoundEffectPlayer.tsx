'use client'

import { useState, useRef, useEffect } from 'react'

interface SoundEffectPlayerProps {
  label: string
  initialUrl: string
  onChange: (url: string) => void
}

export default function SoundEffectPlayer({ label, initialUrl, onChange }: SoundEffectPlayerProps) {
  const [url, setUrl] = useState(initialUrl)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setErrorMessage(null) // Clear error when URL changes
    onChange(newUrl)
  }

  const showInlineError = (message: string) => {
    setErrorMessage(message)
    setIsPlaying(false)
  }

  const testSound = async () => {
    // Clear previous error
    setErrorMessage(null)

    // Validate URL
    if (!url) {
      showInlineError('⚠ Veuillez entrer une URL MP3')
      return
    }

    if (!url.startsWith('http') || !url.includes('.mp3')) {
      showInlineError('⚠ URL invalide — doit être un lien .mp3')
      return
    }

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.src = url
    audio.volume = 0.15 // Max 15% for click/hover sounds
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    audio.addEventListener('error', () => {
      showInlineError('⚠ URL inaccessible — vérifiez le lien')
    })

    audio.addEventListener('canplay', () => {
      audio.play().then(() => {
        audioRef.current = audio
        setIsPlaying(true)
        setErrorMessage(null) // Clear error on success
        setTimeout(() => setIsPlaying(false), 500)
      }).catch(() => {
        showInlineError('⚠ Impossible de lire l\'audio')
      })
    })

    audio.load()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 text-sm"
          placeholder="https://example.com/sound.mp3"
        />
        <button
          onClick={testSound}
          className="px-4 py-3 rounded-full bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 font-bold transition flex items-center gap-2"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
          Test
        </button>
      </div>
      
      {errorMessage && (
        <p className="text-red-400 text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
