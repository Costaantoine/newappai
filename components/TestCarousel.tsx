'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string | Record<string, string>
  images: string[]
  active: boolean
  slug: string
  category: string
}

interface CarouselProps {
  speed?: number
  variant?: 'products' | 'brands'
}

const BRANDS = [
  {
    name: 'Pro\'up',
    subtitle: 'Solutions Pro',
    href: 'https://pro-up.newappai.com',
    logo: 'https://pro-up.newappai.com/logo-transparent.png',
  },
  {
    name: 'Digismart.ai',
    subtitle: 'by Premium à juste prix',
    href: 'https://digismartai.newappai.com',
    logo: 'svg',
  },
]

export default function Carousel({ speed = 20, variant = 'products' }: CarouselProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (variant !== 'products') return
    fetch('/api/supabase/products?active=true')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
      })
      .catch(() => {})
  }, [variant])

  const getTitle = (p: Product): string => {
    if (typeof p.title === 'object') return p.title.fr || ''
    try {
      const parsed = JSON.parse(p.title)
      return parsed.fr || ''
    } catch {
      return p.title || ''
    }
  }

  const getSlug = (p: Product): string => p.slug || ''

  const getImage = (p: Product): string => {
    if (!p.images || !p.images[0]) return ''
    try {
      const raw = p.images[0]
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      return parsed.thumbnail || parsed.original || raw
    } catch {
      if (typeof p.images[0] === 'string') return p.images[0]
      return ''
    }
  }

  if (variant === 'brands') {
    const doubled = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS]
    return (
      <div className="w-full overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 items-center marquee-track">
            {doubled.map((brand, idx) => (
              <a
                key={`${brand.name}-${idx}`}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-neutral-800 hover:border-neutral-600 transition-colors rounded-lg px-5 py-2.5 flex-shrink-0 group brand-card"
              >
                {brand.logo === 'svg' ? (
                  <svg className="w-9 h-9 text-white group-hover:opacity-80 transition-opacity brand-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ) : (
                  <span className="w-10 h-10 rounded-md bg-white flex items-center justify-center flex-shrink-0 brand-logo-badge">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain brand-logo-img" />
                  </span>
                )}
                <span className="text-neutral-300 text-sm font-medium group-hover:text-white transition-colors whitespace-nowrap brand-name">
                  {brand.name}
                </span>
              </a>
            ))}
          </div>
        </div>
        <style jsx>{`
          .marquee-track {
            animation: scroll-left ${speed}s linear infinite;
            width: max-content;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    )
  }

  if (products.length === 0 || !mounted) return null

  const doubled = [...products, ...products]

  return (
    <div className="w-full overflow-hidden">
      <p className="text-neutral-600 text-xs tracking-widest uppercase mb-5 text-center">
        Toute notre gamme
      </p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 marquee-track">
          {doubled.map((product, idx) => {
            const title = getTitle(product)
            const slug = getSlug(product)
            const imgUrl = getImage(product)
            const initials = title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

            return (
              <Link
                key={`${product.id}-${idx}`}
                href={`/produits/${slug}`}
                className="min-w-[190px] max-w-[190px] border border-neutral-800 hover:border-neutral-600 transition-colors rounded-lg flex-shrink-0 overflow-hidden group block"
              >
                {imgUrl ? (
                  <div className="w-full h-28 overflow-hidden bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-28 bg-neutral-900 flex items-center justify-center">
                    <span className="text-neutral-700 text-3xl font-bold select-none">{initials}</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-neutral-300 text-sm font-medium truncate group-hover:text-white transition-colors">
                    {title}
                  </h3>
                  <span className="text-neutral-600 text-xs mt-1.5 inline-flex items-center gap-1 group-hover:text-neutral-400 transition-colors">
                    Voir détails
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: scroll-left ${speed}s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
