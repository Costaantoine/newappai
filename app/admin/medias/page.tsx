'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminMediasPage() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  async function fetchFiles() {
    try {
      const res = await fetch('/api/upload')
      if (res.ok) {
        const data = await res.json()
        setFiles(data)
      }
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        fetchFiles()
      }
    } catch (err) {
      console.error('Error uploading file:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des médias</h1>
        
        <div className="mb-8">
          <label className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition">
            {uploading ? 'Upload en cours...' : 'Uploader un fichier'}
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : files.length === 0 ? (
          <p className="text-gray-600">Aucun fichier uploadé.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file: any) => (
              <div key={file.id} className="bg-white rounded-lg shadow p-4">
                {file.type?.startsWith('image/') && (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm text-gray-600 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
