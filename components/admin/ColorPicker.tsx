'use client'

import { useState } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  presets?: string[]
}

const defaultPresets = [
  '#0ea5e9', // Sky
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#64748b', // Slate
]

export default function ColorPicker({ value, onChange, label, presets = defaultPresets }: ColorPickerProps) {
  const [customOpen, setCustomOpen] = useState(false)

  return (
    <div className="space-y-2">
      {label && <label className="text-slate-400 text-sm">{label}</label>}
      
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition ${
              value === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        
        <button
          onClick={() => setCustomOpen(!customOpen)}
          className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 hover:border-slate-400 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {customOpen && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <div className="w-6 h-6 rounded bg-white" style={{ backgroundColor: value }} />
        <span className="text-slate-500 text-xs">{value}</span>
      </div>
    </div>
  )
}
