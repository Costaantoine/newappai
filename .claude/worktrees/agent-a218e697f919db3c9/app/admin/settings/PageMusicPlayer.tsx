'use client'

import { useState, useRef, useEffect } from 'react'

interface PageMusicPlayerProps {
  pageKey: string
  title: string
  icon: string
  initialUrl: string
  initialVolume: number
  onChange: (url: string, volume: number) => void
  onPlay: (audio: HTMLAudioElement) => void
}

// Global reference to stop other players
let currentPlayingAudio: HTMLAudioElement | null = null

export function stopAllAdminPlayers() {
  if (currentPlayingAudio) {
    currentPlayingAudio.pause()
    currentPlayingAudio.src = ''
    currentPlayingAudio = null
  }
}

export default function PageMusicPlayer({ 
  pageKey, 
  title, 
  icon, 
  initialUrl, 
  initialVolume,
  onChange,
  onPlay 
}: PageMusicPlayerProps) {
  const [url, setUrl] = useState(initialUrl)
  const [volume, setVolume] = useState(initialVolume)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        if (currentPlayingAudio === audioRef.current) {
          currentPlayingAudio = null
        }
      }
    }
  }, [])

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setErrorMessage(null) // Clear error when URL changes
    onChange(newUrl, volume)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    onChange(url, newVolume)
  }

  const showInlineError = (message: string) => {
    setErrorMessage(message)
    setIsPlaying(false)
  }

  const testPlayer = async () => {
    // Clear previous error
    setErrorMessage(null)

    // Validate URL before attempting
    if (!url) {
      showInlineError('⚠ Veuillez entrer une URL MP3')
      return
    }

    if (!url.startsWith('http') || !url.includes('.mp3')) {
      showInlineError('⚠ URL invalide — doit être un lien direct vers un fichier .mp3')
      return
    }

    // Stop any other playing audio
    stopAllAdminPlayers()

    // Create new audio instance with CORS support
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.src = url
    audio.volume = volume / 100
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      if (currentPlayingAudio === audio) {
        currentPlayingAudio = null
      }
    })

    audio.addEventListener('error', () => {
      showInlineError('⚠ URL inaccessible — vérifiez le lien ou utilisez une URL directe .mp3')
      if (currentPlayingAudio === audio) {
        currentPlayingAudio = null
      }
    })

    audio.addEventListener('canplay', () => {
      audio.play().then(() => {
        audioRef.current = audio
        currentPlayingAudio = audio
        setIsPlaying(true)
        onPlay(audio)
        setErrorMessage(null) // Clear error on success
      }).catch(() => {
        showInlineError('⚠ Impossible de lire l\'audio — vérifiez l\'URL')
      })
    })

    // Start loading
    audio.load()
  }

  const stopPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      setIsPlaying(false)
      if (currentPlayingAudio === audioRef.current) {
        currentPlayingAudio = null
      }
    }
  }

  return (
    <div className="glass p-6 rounded-[1.5rem] border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            URL MP3
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 text-sm"
            placeholder="https://example.com/music.mp3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Volume: {volume}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={isPlaying ? stopPlayer : testPlayer}
            className="flex-1 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold transition flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Test
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-400 text-xs mt-2">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
}
