'use client'

export type BookStatus = 'processing' | 'ready' | 'error'

export interface Book {
  id: string
  title: string
  planId: string
  planLabel: string
  characters: number
  status: BookStatus
  createdAt: string
  durationMinutes: number
}

const STORAGE_PREFIX = 'erv_books_'

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

const SEED_TITLES = [
  'Le Comte de Monte-Cristo',
  'Rapport annuel 2025',
  'Notes de cours — Physique quantique',
  'Nouvelles du soir',
]

function seedBooks(): Book[] {
  return SEED_TITLES.map((title, i) => ({
    id: `seed-${i}`,
    title,
    planId: ['decouverte', 'essentiel', 'standard', 'integral'][i % 4],
    planLabel: ['Découverte', 'Essentiel', 'Standard', 'Intégral'][i % 4],
    characters: [4200, 18500, 82000, 310000][i % 4],
    status: (['ready', 'ready', 'processing', 'ready'] as BookStatus[])[i % 4],
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 3).toISOString(),
    durationMinutes: [6, 24, 95, 240][i % 4],
  }))
}

export function getBooks(userId: string): Book[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(storageKey(userId))
  if (!raw) {
    const seeded = seedBooks()
    window.localStorage.setItem(storageKey(userId), JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(raw) as Book[]
  } catch {
    return []
  }
}

export function addBook(userId: string, book: Omit<Book, 'id' | 'createdAt' | 'status'>): Book {
  const books = getBooks(userId)
  const newBook: Book = {
    ...book,
    id: `book-${Date.now()}`,
    status: 'processing',
    createdAt: new Date().toISOString(),
  }
  const updated = [newBook, ...books]
  window.localStorage.setItem(storageKey(userId), JSON.stringify(updated))
  return newBook
}

export function markBookReady(userId: string, bookId: string) {
  const books = getBooks(userId).map((b) =>
    b.id === bookId ? { ...b, status: 'ready' as BookStatus } : b
  )
  window.localStorage.setItem(storageKey(userId), JSON.stringify(books))
}
