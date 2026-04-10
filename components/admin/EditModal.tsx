'use client'

import { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader'
import ColorPicker from './ColorPicker'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any, stayOpen?: boolean) => void
  title: string
  fields: Field[]
  initialData: any
  saving?: boolean
}

interface Field {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'image' | 'image-upload' | 'select' | 'languages' | 'color' | 'boolean' | 'url'
  options?: { value: string; label: string }[]
  placeholder?: string
  customName?: string
  immediateSave?: boolean
}

const languages = [
  { key: 'fr', label: 'Francais' },
  { key: 'en', label: 'Anglais' },
  { key: 'pt', label: 'Portugais' },
  { key: 'es', label: 'Espagnol' },
]

export default function EditModal({ isOpen, onClose, onSave, title, fields, initialData, saving }: EditModalProps) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    if (isOpen) {
      setData(initialData)
    }
  }, [isOpen]) // Only reset when the modal opens

  if (!isOpen) return null

  const getNestedValue = (obj: any, path: string): any => {
    if (!path || path === '.') return obj
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  const setNestedValue = (obj: any, path: string, value: any): any => {
    if (!path || path === '.') {
      return (typeof obj === 'object' && typeof value === 'object') ? { ...obj, ...value } : value
    }
    const keys = path.split('.')
    const result = Array.isArray(obj) ? [...obj] : { ...obj }
    let current = result
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]
      const isNextArray = !isNaN(Number(nextKey))

      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : (typeof current[key] === 'object' && current[key] !== null)
          ? { ...current[key] }
          : (isNextArray ? [] : {})

      current = current[key]
    }
    const lastKey = keys[keys.length - 1]
    current[lastKey] = value
    return result
  }

  const handleChange = (fieldName: string, value: any) => {
    setData((prev: any) => setNestedValue(prev, fieldName, value))
  }

  const flattenToNested = (obj: any): any => {
    const result: any = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      const value = obj[key]
      if (key.includes('.')) {
        const keys = key.split('.')
        let current = result
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]
          const nextK = keys[i + 1]
          if (!current[k]) {
            current[k] = !isNaN(Number(nextK)) ? [] : {}
          }
          current = current[k]
        }
        current[keys[keys.length - 1]] = value
      } else {
        result[key] = value
      }
    }
    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nestedData = flattenToNested(data)
    onSave(nestedData)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>

              {field.type === 'languages' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-white/5">
                    <span className="text-xs font-semibold text-slate-300">Multilingue : {field.label}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const currentVal = getNestedValue(data, field.name)
                        const sourceText = currentVal?.fr || ''
                        if (!sourceText) return alert('Veuillez saisir un texte en Français d\'abord')

                        try {
                          const res = await fetch('/api/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: sourceText })
                          })
                          const translations = await res.json()
                          if (translations.error) throw new Error(translations.error)

                          handleChange(field.name, {
                            ...(currentVal || {}), // Preserve key, id, section, etc.
                            fr: sourceText,
                            en: translations.en,
                            pt: translations.pt,
                            es: translations.es
                          })
                        } catch (err) {
                          console.error('Translation failed:', err)
                          alert('Erreur de traduction')
                        }
                      }}
                      className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-1 rounded border border-sky-500/30 hover:bg-sky-500/40 transition-colors"
                    >
                      🪄 Traduire auto (depuis FR)
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {languages.map((lang) => {
                      const currentVal = getNestedValue(data, field.name) || {}
                      // Security: Ensure currentVal is an object if it was a string mistakenly
                      const safeVal = typeof currentVal === 'object' && currentVal !== null ? currentVal : {}

                      return (
                        <div key={lang.key} className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500 ml-1">{lang.label}</span>
                          <textarea
                            value={safeVal[lang.key] || ''}
                            onChange={(e) => {
                              const newValue = { ...safeVal, [lang.key]: e.target.value }
                              handleChange(field.name, newValue)
                            }}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white h-20 text-sm focus:border-sky-500/50 outline-none transition-colors"
                            placeholder={field.placeholder}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white h-24"
                  placeholder={field.placeholder}
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(e) => handleChange(field.name, Number(e.target.value))}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'image' ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={getNestedValue(data, field.name) || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="URL de l'image"
                  />
                  {getNestedValue(data, field.name) && (
                    <img src={getNestedValue(data, field.name)} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  )}
                </div>
              ) : field.type === 'image-upload' ? (
                <ImageUploader
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(url) => handleChange(field.name, url)}
                  onUploadComplete={(url) => {
                    if (field.immediateSave) {
                      const updatedData = setNestedValue(data, field.name, url)
                      onSave(flattenToNested(updatedData), true)
                    }
                  }}
                  label={field.label}
                  customName={field.customName}
                  id={field.name.replace(/\./g, '-')}
                />
              ) : field.type === 'color' ? (
                <ColorPicker
                  value={getNestedValue(data, field.name) || '#0ea5e9'}
                  onChange={(color) => handleChange(field.name, color)}
                  label={field.label}
                />
              ) : field.type === 'boolean' ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange(field.name, !getNestedValue(data, field.name))}
                    className={`w-14 h-8 rounded-full transition-colors ${getNestedValue(data, field.name) ? 'bg-green-500' : 'bg-slate-700'
                      }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${getNestedValue(data, field.name) ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                  <span className="text-white">
                    {getNestedValue(data, field.name) ? 'Oui' : 'Non'}
                  </span>
                </div>
              ) : field.type === 'url' ? (
                <input
                  type="url"
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                  placeholder="https://..."
                />
              ) : (
                <input
                  type="text"
                  value={getNestedValue(data, field.name) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-sky-500 text-white py-2 rounded-lg font-bold hover:bg-sky-400 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
