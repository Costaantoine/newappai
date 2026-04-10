'use client'

import { useState, useRef, useEffect } from 'react'

interface MusicPlayerProps {
  url: string
  name: string
  isSelected: boolean
  onSelect: () => void
}

export default function MusicPlayer({ url, name, isSelected, onSelect }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.volume = volume / 100
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  return (
    <div className={`p-3 rounded-lg border transition ${isSelected ? 'border-sky-500 bg-sky-500/20' : 'border-white/10 hover:border-white/30'}`}>
      <button 
        onClick={onSelect}
        className="w-full text-left mb-2"
      >
        <p className="text-sm text-slate-300 font-semibold">{name}</p>
      </button>
      
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 accent-sky-500 h-1"
          onClick={(e) => e.stopPropagation()}
        />
        
        <span className="text-xs text-slate-400 w-8">{volume}%</span>
      </div>
    </div>
  )
}
