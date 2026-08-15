'use client'

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/** Classe de base des champs du wizard (cohérente avec le design system newappai). */
export const fieldClass =
  'w-full rounded-xl bg-neutral-900/60 border border-neutral-800 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20 px-4 py-3 text-white placeholder:text-slate-500 text-sm outline-none transition'

/** Encadré d'un champ : label + aide + enfant. */
export function Field({
  label,
  optional,
  hint,
  children,
}: {
  label: string
  optional?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <span className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-white">{label}</span>
        {optional && <span className="text-[11px] text-slate-500 uppercase tracking-wide">Optionnel</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1.5">{hint}</span>}
    </div>
  )
}

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />
}

export function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} resize-y min-h-[90px] ${className}`} {...props} />
}

export function SelectInput({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${fieldClass} appearance-none bg-no-repeat pr-10 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%236b7280' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
        backgroundPosition: 'right 0.9rem center',
        backgroundSize: '1rem',
      }}
      {...props}
    >
      {children}
    </select>
  )
}

/** Titre d'étape du wizard. */
export function StepHeading({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-2">
        Étape {number + 1} / 6
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1.5">{subtitle}</p>}
    </div>
  )
}
