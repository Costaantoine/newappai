'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/SettingsContext'

export default function AudioButton() {
  const { settings } = useSettings()
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (settings?.audio?.file_url && !audio) {
      const audioElement = new Audio(settings.audio.file_url)
      audioElement.loop = settings.audio.loop || false
      audioElement.volume = (settings.audio.volume || 30) / 100
      audioElement.muted = settings.audio.muted || false
      
      if (settings.audio.autoplay) {
        audioElement.play().catch(() => {
          // Autoplay bloqué par le navigateur
        })
      }
      
      setAudio(audioElement)
    }
  }, [settings?.audio?.file_url, audio])

  const toggleAudio = () => {
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        // Erreur de lecture
      })
    }
    setIsPlaying(!isPlaying)
  }

  // Afficher le bouton si une URL audio est configurée (même si disabled, on peut l'activer manuellement)
  if (!settings?.audio?.file_url) {
    return null
  }

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-6 right-24 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      style={{
        background: `linear-gradient(135deg, ${settings.buttons?.primary_color || '#0ea5e9'}, ${settings.buttons?.secondary_color || '#6366f1'})`
      }}
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </button>
  )
}
