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
const POS_KEY = 'newappai_sound_pos'

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
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasInteractedRef = useRef(false)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 })
  const wasDragging = useRef(false)

  // Restore saved position
  useEffect(() => {
    const saved = localStorage.getItem(POS_KEY)
    if (saved) {
      try { setPos(JSON.parse(saved)) } catch {}
    }
  }, [])

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
    if (!audioRef.current) { callback(); return }
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

  // Auto-hide controls after 3s
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (showControls) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [showControls])

  useEffect(() => {
    resetHideTimer()
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  }, [showControls, resetHideTimer])

  useEffect(() => {
    const storedMuted = localStorage.getItem(STORAGE_KEY)
    if (storedMuted === 'true') setMuted(true)
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
    return () => document.removeEventListener('click', handleFirstInteraction)
  }, [enabled, fileUrl, autoplay, fadeIn, loop, volume, muted, isPlaying, doFadeIn])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : (volume / 100)
  }, [muted, volume])

  useEffect(() => {
    return () => { if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current) }
  }, [])

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
    if (audioRef.current) audioRef.current.volume = newMuted ? 0 : (volume / 100)
  }, [muted, volume])

  const handleVolumeChange = useCallback((newVolume: number) => {
    setCurrentVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume / 100
  }, [])

  // Toggle controls panel (show on click, auto-hide after 3s)
  const toggleControls = useCallback(() => {
    if (wasDragging.current) { wasDragging.current = false; return }
    setShowControls(prev => !prev)
  }, [])

  // Drag handlers
  const onDragStart = useCallback((clientX: number, clientY: number) => {
    wasDragging.current = false
    dragStart.current = { x: clientX, y: clientY, elX: pos.x, elY: pos.y }
    setDragging(true)
  }, [pos])

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging) return
    const dx = clientX - dragStart.current.x
    const dy = clientY - dragStart.current.y
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) wasDragging.current = true
    setPos({ x: dragStart.current.elX + dx, y: dragStart.current.elY + dy })
  }, [dragging])

  const onDragEnd = useCallback(() => {
    setDragging(false)
    localStorage.setItem(POS_KEY, JSON.stringify(pos))
  }, [pos])

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onDragStart(e.clientX, e.clientY)
    const onMove = (ev: MouseEvent) => onDragMove(ev.clientX, ev.clientY)
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); onDragEnd() }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [onDragStart, onDragMove, onDragEnd])

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    onDragStart(t.clientX, t.clientY)
  }, [onDragStart])

  useEffect(() => {
    if (!dragging) return
    const onMove = (ev: TouchEvent) => onDragMove(ev.touches[0].clientX, ev.touches[0].clientY)
    const onUp = () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp); onDragEnd() }
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
    return () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp) }
  }, [dragging, onDragMove, onDragEnd])

  if (!enabled || !fileUrl) return null

  return (
    <>
      <audio ref={audioRef} src={fileUrl} style={{ display: 'none' }} loop={loop} />

      <div
        className="fixed z-50"
        style={{
          left: pos.x || undefined,
          right: pos.x ? undefined : 6,
          bottom: pos.y ? undefined : 6,
          top: pos.y || undefined,
          transform: 'translate(0, 0)',
          cursor: dragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Main round button */}
        <div className="flex flex-col items-center">
          <button
            onClick={toggleControls}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="w-16 h-16 rounded-full bg-violet-500 text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center"
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

          {/* Control panel (appears above, auto-hides after 3s) */}
          {showControls && (
            <div
              className="absolute bottom-20 glass rounded-2xl p-4 w-60 animate-in fade-in slide-in-from-bottom-2 shadow-2xl"
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
                    type="range" min="0" max="100"
                    value={currentVolume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="flex-1 accent-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Fade in</span>
                  <span className={`text-xs ${fadeIn ? 'text-green-400' : 'text-slate-600'}`}>{fadeIn ? 'ON' : 'OFF'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Boucle</span>
                  <span className={`text-xs ${loop ? 'text-green-400' : 'text-slate-600'}`}>{loop ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
