'use client'

import { useEffect } from 'react'

interface LightboxProps {
  src: string
  onClose: () => void
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!src) return null

  return (
    <div 
      className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
        onClick={onClose}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        src={src} 
        alt="Full size" 
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
