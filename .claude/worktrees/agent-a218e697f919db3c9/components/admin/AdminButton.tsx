'use client'

interface AdminButtonProps {
  onEdit?: () => void
  onDelete?: () => void
  onAdd?: () => void
  showEdit?: boolean
  showDelete?: boolean
  showAdd?: boolean
  addLabel?: string
}

export default function AdminButton({ onEdit, onDelete, onAdd, showEdit = true, showDelete = true, showAdd = false, addLabel = 'Ajouter' }: AdminButtonProps) {
  return (
    <>
      {showAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      )}
      
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg hover:bg-sky-500/30 transition"
          title="Modifier"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          title="Supprimer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </>
  )
}
