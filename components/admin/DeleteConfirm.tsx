'use client'

interface DeleteConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  deleting?: boolean
}

export default function DeleteConfirm({ isOpen, onClose, onConfirm, title, message, deleting }: DeleteConfirmProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-red-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-400 disabled:opacity-50"
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
