import type { Book } from './mockLibrary'

const API = '/api/easyreadvoice'

export async function fetchBooks(email: string): Promise<Book[]> {
  const res = await fetch(API + '/books?email=' + encodeURIComponent(email))
  if (!res.ok) return []
  const data = await res.json()
  return data.books || []
}

export async function uploadBook(
  email: string,
  title: string,
  file: File,
  planId: string,
  onProgress?: (pct: number) => void
): Promise<any> {
  const form = new FormData()
  form.append('email', email)
  form.append('title', title)
  form.append('file', file)
  form.append('planId', planId)

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', API + '/books')

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText))
      } catch {
        resolve({ error: 'Reponse invalide du serveur' })
      }
    }

    xhr.onerror = () => resolve({ error: 'Erreur reseau lors de l\'upload' })

    xhr.send(form)
  })
}
