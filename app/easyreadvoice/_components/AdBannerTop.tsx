'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: string
  title: string
  description: string
  active: boolean
  slug?: string
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'fallback', title: 'NewAppAI', description: '', active: true },
]

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function slugify(str: string): string {
  return normalize(str)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getIcon(title: string): string {
  const t = normalize(title)
  if (/\bia\b|intelligence artificielle|chatbot|\bbot\b|assistant/.test(t)) return '🤖'
  if (/audio|voix|voice|podcast|\bson\b|musique/.test(t)) return '🎧'
  if (/app|application|mobile/.test(t)) return '📱'
  if (/shop|boutique|vente|e-?commerce|commerce/.test(t)) return '🛒'
  if (/service|boost|lancement|startup|site/.test(t)) return '🚀'
  return '✨'
}

function getGradient(title: string): string {
  const t = normalize(title)
  if (/\bia\b|intelligence artificielle|chatbot|\bbot\b|assistant/.test(t)) return 'from-purple-600 to-purple-800'
  if (/audio|voix|voice|podcast|\bson\b|musique/.test(t)) return 'from-pink-600 to-rose-800'
  if (/app|application|mobile/.test(t)) return 'from-blue-600 to-cyan-800'
  if (/shop|boutique|vente|e-?commerce|commerce/.test(t)) return 'from-orange-600 to-amber-800'
  if (/service|boost|lancement|startup|site/.test(t)) return 'from-emerald-600 to-teal-800'
  return 'from-slate-600 to-gray-800'
}

export default function AdBannerTop() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Product[]) => {
        if (cancelled) return
        const active = Array.isArray(data) ? data.filter((p) => p.active) : []
        setProducts(active)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const items = products.length > 0 ? products : FALLBACK_PRODUCTS
  // Contenu dupliqué pour boucler la bande défilante sans coupure visible
  const trackItems = [...items, ...items]

  return (
    <div className="w-full overflow-hidden py-3" style={{ backgroundColor: '#111827' }}>
      <div className="ad-ticker-track-reverse flex items-center gap-32 whitespace-nowrap w-max">
        {trackItems.map((product, i) => (
          <a
            key={`${product.id}-${i}`}
            href={product.id === 'fallback' ? 'https://newappai.com' : `/produits/${product.slug || slugify(product.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {product.id === 'fallback' ? (
              <div className="flex items-center gap-2 text-white opacity-80 group-hover:opacity-100 transition">
                <span className="text-2xl leading-none">{getIcon(product.title)}</span>
                <span className="text-base font-bold">{product.title}</span>
              </div>
            ) : (
              <div
                className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${getGradient(product.title)} px-4 py-1 w-36 transition group-hover:scale-105 group-hover:shadow-2xl`}
              >
                <span className="text-xl leading-none">{getIcon(product.title)}</span>
                <span className="text-base font-bold text-white text-center truncate">{product.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
