'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface SoundPlayerProps {
  fileUrl: string
  volume: number
  loop: boolean
  autoplay: boolean
  fadeIn: boolean
  fadeInDuration: number
  enabled: boolean
}

const STORAGE_KEY = 'newappai_muted'

export default function SoundPlayer({
  fileUrl,
  volume = 70,
  loop = true,
  autoplay = false,
  fadeIn = true,
  fadeInDuration = 2000,
  enabled = true
}: SoundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(volume)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasInteractedRef = useRef(false)

  const doFadeIn = useCallback(() => {
    if (!audioRef.current || !fadeIn) return

    setIsFading(true)
    audioRef.current.volume = 0

    const steps = 20
    const stepDuration = fadeInDuration / steps
    const volumeStep = volume / 100 / steps
    let currentStep = 0

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return
      currentStep++
      audioRef.current.volume = Math.min(volumeStep * currentStep, volume / 100)

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
        setIsFading(false)
      }
    }, stepDuration)
  }, [fadeIn, fadeInDuration, volume])

  const doFadeOut = useCallback((callback: () => void) => {
    if (!audioRef.current) {
      callback()
      return
    }

    setIsFading(true)
    const steps = 10
    const stepDuration = 100
    const currentVol = audioRef.current.volume
    const volumeStep = currentVol / steps
    let currentStep = 0

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return
      currentStep++
      audioRef.current.volume = Math.max(currentVol - (volumeStep * currentStep), 0)

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
        audioRef.current.pause()
        setIsFading(false)
        callback()
      }
    }, stepDuration)
  }, [])

  useEffect(() => {
    const storedMuted = localStorage.getItem(STORAGE_KEY)
    if (storedMuted === 'true') {
      setMuted(true)
    }
  }, [])

  useEffect(() => {
    if (!enabled || !fileUrl) return

    if (audioRef.current) {
      audioRef.current.loop = loop
      audioRef.current.volume = muted ? 0 : (volume / 100)
    }

    const handleFirstInteraction = () => {
      if (!hasInteractedRef.current && !isPlaying && !muted && autoplay) {
        hasInteractedRef.current = true
        audioRef.current?.play().then(() => {
          if (fadeIn) doFadeIn()
          setIsPlaying(true)
        }).catch(console.error)
      }
    }

    document.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [enabled, fileUrl, autoplay, fadeIn, loop, volume, muted, isPlaying, doFadeIn])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : (volume / 100)
    }
  }, [muted, volume])

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    setShowControls(true)
    const timer = setTimeout(() => setShowControls(false), 3000)
    return () => clearTimeout(timer)
  }, [pathname])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      doFadeOut(() => setIsPlaying(false))
    } else {
      if (fadeIn) doFadeIn()
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }, [isPlaying, fadeIn, doFadeIn, doFadeOut])

  const toggleMute = useCallback(() => {
    const newMuted = !muted
    setMuted(newMuted)
    localStorage.setItem(STORAGE_KEY, String(newMuted))

    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : (volume / 100)
    }
  }, [muted, volume])

  const handleVolumeChange = useCallback((newVolume: number) => {
    setCurrentVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }, [])

  if (!enabled || !fileUrl) return null

  return (
    <>
      <audio
        ref={audioRef}
        src={fileUrl}
        style={{ display: 'none' }}
        loop={loop}
      />
      <div className="fixed bottom-6 right-[168px] z-50">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {showControls && (
          <div
            className="absolute bottom-16 right-0 glass rounded-2xl p-4 w-60 animate-in fade-in slide-in-from-bottom-2"
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            <h4 className="text-sm font-bold text-white mb-3">Paramètres Audio</h4>

            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Volume</span>
              </div>
              <div className="flex items-center gap-2">

                <button
                  onClick={toggleMute}
                  className={`p-1 transition ${muted ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}
                  title={muted ? 'Activer le son' : 'Couper le son'}
                >
                  {muted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="flex-1 accent-sky-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Fade in</span>
                <span className={`text-xs ${fadeIn ? 'text-green-400' : 'text-slate-600'}`}>
                  {fadeIn ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Boucle</span>
                <span className={`text-xs ${loop ? 'text-green-400' : 'text-slate-600'}`}>
                  {loop ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
