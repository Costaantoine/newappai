'use client'

import { useRef, useState } from 'react'
import type { MediaFile } from './types'
import { uid } from './types'

interface FileUploadProps {
  label: string
  helper?: string
  kind: 'image' | 'video'
  files: MediaFile[]
  onChange: (files: MediaFile[]) => void
  multiple?: boolean
  maxFiles?: number
  maxSizeMb?: number
  /** Redimensionne les images à cette dimension max (garde les fichiers légers). */
  maxDimension?: number
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Lit une image et la redimensionne via canvas → JPEG base64 (léger pour l'aperçu + l'export). */
function readImageDownscaled(file: File, maxDimension: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(src)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        } catch {
          resolve(src)
        }
      }
      img.onerror = () => reject(new Error('Image illisible'))
      img.src = src
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function FileUpload({
  label,
  helper,
  kind,
  files,
  onChange,
  multiple = true,
  maxFiles = 20,
  maxSizeMb = kind === 'image' ? 8 : 30,
  maxDimension = 1400,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const canAddMore = files.length < maxFiles

  const handleFiles = async (list: FileList | null) => {
    if (!list || !canAddMore) return
    setBusy(true)
    setError('')
    try {
      const added: MediaFile[] = []
      for (const file of Array.from(list)) {
        if (files.length + added.length >= maxFiles) break
        const sizeMb = file.size / 1024 / 1024
        if (sizeMb > maxSizeMb) {
          setError(`« ${file.name} » dépasse ${maxSizeMb} Mo.`)
          continue
        }
        const isImage = kind === 'image' && file.type.startsWith('image/')
        const isVideo = kind === 'video' && file.type.startsWith('video/')
        if (!isImage && !isVideo) continue
        const dataUrl = isImage
          ? await readImageDownscaled(file, maxDimension)
          : await readAsDataUrl(file)
        added.push({ id: uid(), dataUrl, type: isImage ? 'image' : 'video', name: file.name })
      }
      if (added.length) onChange([...files, ...added])
    } catch {
      setError('Impossible de lire ce fichier.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs text-slate-500">{files.length}/{maxFiles}</span>
      </div>

      {helper && <p className="text-xs text-slate-500 mb-3">{helper}</p>}

      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-full rounded-xl border-2 border-dashed border-neutral-700 hover:border-violet-400/60 bg-neutral-900/40 hover:bg-neutral-900/70 transition px-4 py-6 flex flex-col items-center gap-2 text-slate-400 hover:text-violet-300 disabled:opacity-50"
        >
          {busy ? (
            <span className="text-sm">Lecture du fichier…</span>
          ) : (
            <>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">
                {multiple ? 'Cliquez pour ajouter des fichiers' : 'Cliquez pour ajouter un fichier'}
              </span>
              <span className="text-xs text-slate-500">
                {kind === 'image' ? 'JPG / PNG / WebP' : 'MP4 / WebM'} — max {maxSizeMb} Mo
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/*' : 'video/*'}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {files.map((file) => (
            <div key={file.id} className="relative group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-square">
              {file.type === 'image' ? (
                <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <video src={file.dataUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                aria-label={`Supprimer ${file.name}`}
                onClick={() => onChange(files.filter((f) => f.id !== file.id))}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {file.type === 'video' && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white">
                  Vidéo
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
