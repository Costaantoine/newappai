'use client'

import { useState, useRef } from 'react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  onUploadComplete?: (url: string) => void
  label?: string
  customName?: string
  id?: string
}

export default function ImageUploader({ value, onChange, onUploadComplete, label, customName, id }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateThumbnail = async (file: File): Promise<{ original: File; thumbnail: File }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 200
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!

        const ratio = Math.min(img.width, img.height)
        const sx = (img.width - ratio) / 2
        const sy = (img.height - ratio) / 2
        ctx.drawImage(img, sx, sy, ratio, ratio, 0, 0, size, size)

        canvas.toBlob((blob) => {
          const thumbFile = new File([blob!], 'thumb.webp', { type: 'image/webp' })
          resolve({ original: file, thumbnail: thumbFile })
        }, 'image/webp', 0.85)
      }
      img.onerror = () => {
        resolve({ original: file, thumbnail: file })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)
    setStatus('idle')

    try {
      const { original, thumbnail } = await generateThumbnail(file)

      const formData = new FormData()
      formData.append('file', original)
      if (customName) formData.append('customName', customName)

      const res = await fetch('/api/local/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Upload failed (${res.status})`)
      }
      const { image_url } = await res.json()

      const thumbForm = new FormData()
      thumbForm.append('file', thumbnail)
      thumbForm.append('suffix', '-thumb')
      if (customName) thumbForm.append('customName', customName)

      const thumbRes = await fetch('/api/local/upload', { method: 'POST', body: thumbForm })
      if (!thumbRes.ok) {
        const errData = await thumbRes.json().catch(() => ({}))
        throw new Error(errData.error || `Thumbnail upload failed (${thumbRes.status})`)
      }
      const { image_url: thumb_url } = await thumbRes.json()

      const fullUrl = JSON.stringify({ original: image_url, thumbnail: thumb_url })
      onChange(fullUrl)
      setStatus('success')
      if (onUploadComplete) {
        onUploadComplete(fullUrl)
      }
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Erreur technique : ${error.message}. Vérifiez les droits du dossier /public/uploads/ ou le format du fichier.`)
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  const getImageUrl = (val: string): string => {
    if (!val) return ''
    try {
      const parsed = JSON.parse(val)
      return parsed.original || parsed.thumbnail || val
    } catch {
      return val
    }
  }

  const currentImageUrl = preview || getImageUrl(value)

  return (
    <div className="space-y-2">
      {label && <label htmlFor={id} className="text-slate-400 text-sm">{label}</label>}

      <div className="flex items-center gap-3">
        <div className="flex-1">
          {currentImageUrl ? (
            <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-white/10 group">
              <img src={currentImageUrl} alt="Preview" className="w-full h-32 object-contain bg-black/20" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null)
                  onChange('')
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
              <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-500 text-sm">Aucune image</p>
            </div>
          )}
        </div>

        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${status === 'success' ? 'bg-green-600 text-white' :
              status === 'error' ? 'bg-red-600 text-white' :
                'bg-sky-500 text-white hover:bg-sky-400'
              } disabled:opacity-50`}
          >
            {uploading ? 'Upload...' : status === 'success' ? 'C\'est prêt !' : value ? 'Changer' : 'Choisir'}
          </button>

          {status === 'success' && <p className="text-green-500 text-[10px] font-bold animate-pulse text-center">Enregistré !</p>}
          {status === 'error' && <p className="text-red-500 text-[10px] font-bold text-center">Erreur</p>}
        </div>
      </div>

      {value && (
        <input
          type="text"
          value={getImageUrl(value)}
          onChange={(e) => {
            onChange(e.target.value)
            setPreview(e.target.value)
          }}
          placeholder="URL de l'image"
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mt-2"
        />
      )}
    </div>
  )
}
