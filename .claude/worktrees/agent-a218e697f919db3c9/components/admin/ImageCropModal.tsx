'use client'

import { useState, useRef, useEffect } from 'react'

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, crop: CropArea) => Promise<string>
  currentImage?: string
  width?: number
  height?: number
}

export default function ImageCropModal({ isOpen, onClose, onUpload, currentImage, width = 800, height = 600 }: ImageCropModalProps) {
  const [image, setImage] = useState<string>(currentImage || '')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>('')
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 })
  const [urlInput, setUrlInput] = useState(currentImage || '')
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (currentImage) {
      setImage(currentImage)
      setUrlInput(currentImage)
    }
  }, [currentImage])

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [file])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput) {
      setImage(urlInput)
      onClose()
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const url = await onUpload(file, crop)
      setImage(url)
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Choisir une image</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'upload' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'url' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            URL
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {!preview ? (
              <div 
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-sky-500 transition"
              >
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400">Cliquez ou glissez une image ici</p>
                  <p className="text-slate-500 text-sm mt-2">PNG, JPG, WEBP</p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-slate-800">
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
                  <button
                    onClick={() => { setFile(null); setPreview(''); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Crop Controls */}
                <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                  <p className="text-white font-medium text-sm">Recadrage</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs">Largeur (%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={crop.width}
                        onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs">Hauteur (%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={crop.height}
                        onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs">Position X (%)</label>
                      <input
                        type="range"
                        min="0"
                        max={100 - crop.width}
                        value={crop.x}
                        onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs">Position Y (%)</label>
                      <input
                        type="range"
                        min="0"
                        max={100 - crop.height}
                        value={crop.y}
                        onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">URL de l'image</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            </div>
            {urlInput && (
              <div className="rounded-xl overflow-hidden bg-slate-800">
                <img src={urlInput} alt="Preview" className="w-full max-h-48 object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          {activeTab === 'upload' && preview && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400 disabled:opacity-50"
            >
              {uploading ? 'Upload...' : 'Upload et enregistrer'}
            </button>
          )}
          {activeTab === 'url' && (
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput}
              className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400 disabled:opacity-50"
            >
              Utiliser cette URL
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">
            Annuler
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
