'use client'

import { useEffect, useRef, useState } from 'react'

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

function fmt(t: number): string {
  if (!t || t < 0) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ bookId }: { bookId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRateState] = useState(1)
  const [chapterIdx, setChapterIdx] = useState(0)
  const [showChapters, setShowChapters] = useState(false)
  const [markers, setMarkers] = useState<{ start_seconds: number; title?: string }[]>([])

  const audioUrl = '/api/easyreadvoice/audio/' + bookId
  const storageKey = 'erv-pos-' + bookId

  // Charger les markers depuis l API
  useEffect(() => {
    fetch('/api/easyreadvoice/audio/' + bookId + '/markers')
      .then(r => r.json())
      .then(data => setMarkers(data.markers || []))
      .catch(() => {})
  }, [bookId])

  // Restaurer la position
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = rate
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.time) audio.currentTime = data.time
        setRateState(data.rate || 1)
        audio.playbackRate = data.rate || 1
      } catch {}
    }
  }, [])

  // Auto-save position
  useEffect(() => {
    const interval = setInterval(() => {
      const a = audioRef.current
      if (a && !a.paused && duration > 0) {
        localStorage.setItem(storageKey, JSON.stringify({ time: a.currentTime, rate }))
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [rate, duration])

  // Update chapter index
  useEffect(() => {
    for (let i = markers.length - 1; i >= 0; i--) {
      if ((markers[i].start_seconds || 0) <= current) { setChapterIdx(i); break }
    }
  }, [current, markers])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else { a.pause(); setPlaying(false) }
  }

  function setRate(r: number) { setRateState(r); if (audioRef.current) audioRef.current.playbackRate = r }

  function seekTo(t: number) { const a = audioRef.current; if (a) a.currentTime = t; setCurrent(t) }

  function goToChapter(i: number) {
    if (i < 0 || i >= markers.length) return
    setChapterIdx(i)
    seekTo(markers[i].start_seconds || 0)
    setShowChapters(false)
    const a = audioRef.current; if (a && a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0
  const totalMarkers = markers.length

  return (
    <div className="bg-[#0f0f1a] rounded-2xl p-4 mt-2 text-[#e2e8f0]">
      <audio ref={audioRef} src={audioUrl} preload="metadata"
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => { const d = audioRef.current?.duration || 0; setDuration(d) }}
        onEnded={() => { setPlaying(false); if (chapterIdx < totalMarkers - 1) goToChapter(chapterIdx + 1) }}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500 w-10 text-right">{fmt(current)}</span>
        <input type="range" min={0} max={duration || 1} value={current}
          onChange={e => seekTo(parseFloat(e.target.value))}
          className="flex-1 h-1.5 appearance-none bg-[#1e293b] rounded-full cursor-pointer" style={{ accentColor: '#a855f7' }} />
        <span className="text-xs text-gray-500 w-10">{fmt(duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3">
        <button onClick={() => goToChapter(Math.max(0, chapterIdx - 1))}
          className="w-10 h-10 rounded-full border border-[#334155] text-gray-400 text-lg flex items-center justify-center active:scale-90">⏮</button>
        <button onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[#a855f7] text-white text-2xl flex items-center justify-center shadow-lg active:scale-90">
          {playing ? '⏸' : '▶'}</button>
        <button onClick={() => goToChapter(Math.min(totalMarkers - 1, chapterIdx + 1))}
          className="w-10 h-10 rounded-full border border-[#334155] text-gray-400 text-lg flex items-center justify-center active:scale-90">⏭</button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {RATES.map(r => (
          <button key={r} onClick={() => setRate(r)}
            className={`py-1.5 rounded-full text-xs border transition-all ${
              rate === r ? 'bg-[#a855f7] text-white border-[#a855f7]' : 'bg-transparent text-gray-400 border-[#334155]'
            }`}>{r}×</button>
        ))}
      </div>

      {totalMarkers > 0 && (
        <>
          <button onClick={() => setShowChapters(!showChapters)}
            className="text-xs text-gray-400 flex items-center gap-1 w-full justify-center py-1">
            {showChapters ? '▼' : '▶'} {chapterIdx + 1}/{totalMarkers}
          </button>
          {showChapters && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-0.5">
              {markers.map((m, i) => (
                <button key={i} onClick={() => goToChapter(i)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                    i === chapterIdx ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'text-gray-400 hover:bg-[#1e293b]'
                  }`}>
                  <span className="text-gray-500 mr-2">{fmt(m.start_seconds || 0)}</span>
                  {m.title || `Chapitre ${i + 1}`}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
