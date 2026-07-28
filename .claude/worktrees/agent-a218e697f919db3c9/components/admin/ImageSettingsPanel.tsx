'use client'

import { useState, useEffect } from 'react'

interface ImageSettings {
  opacity?: number
  brightness?: number
  contrast?: number
  saturation?: number
  sepia?: number
}

interface ImageSettingsPanelProps {
  imageUrl: string
  settings: ImageSettings
  onChange: (settings: ImageSettings) => void
  onClose: () => void
}

const defaultSettings: ImageSettings = {
  opacity: 100,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0
}

export default function ImageSettingsPanel({ imageUrl, settings, onChange, onClose }: ImageSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<ImageSettings>(settings || defaultSettings)

  useEffect(() => {
    setLocalSettings(settings || defaultSettings)
  }, [settings])

  const updateSetting = (key: keyof ImageSettings, value: number) => {
    const updated = { ...localSettings, [key]: value }
    setLocalSettings(updated)
  }

  const applySettings = () => {
    onChange(localSettings)
    onClose()
  }

  const resetSettings = () => {
    setLocalSettings(defaultSettings)
  }

  const filterStyle = {
    opacity: (localSettings.opacity ?? 100) / 100,
    filter: `
      brightness(${(localSettings.brightness ?? 100) / 100})
      contrast(${(localSettings.contrast ?? 100) / 100})
      saturate(${(localSettings.saturation ?? 100) / 100})
      sepia(${(localSettings.sepia ?? 0) / 100})
    `
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Réglage de l'image</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 rounded-lg overflow-hidden bg-slate-800">
          <img src={imageUrl} alt="Preview" className="w-full h-48 object-contain" style={filterStyle} />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Opacity</span>
              <span>{localSettings.opacity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.opacity ?? 100}
              onChange={(e) => updateSetting('opacity', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Brightness</span>
              <span>{localSettings.brightness ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={localSettings.brightness ?? 100}
              onChange={(e) => updateSetting('brightness', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Contrast</span>
              <span>{localSettings.contrast ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={localSettings.contrast ?? 100}
              onChange={(e) => updateSetting('contrast', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Saturation</span>
              <span>{localSettings.saturation ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={localSettings.saturation ?? 100}
              onChange={(e) => updateSetting('saturation', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Sepia</span>
              <span>{localSettings.sepia ?? 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.sepia ?? 0}
              onChange={(e) => updateSetting('sepia', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={resetSettings}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Reset
          </button>
          <button
            onClick={applySettings}
            className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-400 font-medium"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}
