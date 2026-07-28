'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string | { fr: string; en: string; pt: string; es: string }
  description: string | { fr: string; en: string; pt: string; es: string }
  price: number
  images: string[]
  category: string
  active: boolean
  order: number
}

interface ProductCarouselProps {
  products: Product[]
  lang: string
  getText: (texts: any[], key: string, lang: string, fallback?: string) => string
  autoPlayDelay?: number
}

function getLocalizedText(text: string | { fr: string; en: string; pt: string; es: string } | undefined, lang: string): string {
  if (!text) return ''
  if (typeof text === 'object') {
    return text[lang as keyof typeof text] || text.fr || ''
  }
  return text
}

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ''
  if (imagePath.startsWith('{')) {
    try {
      const parsed = JSON.parse(imagePath)
      return parsed.original || parsed.thumbnail || ''
    } catch { return '' }
  }
  return imagePath
}

export default function ProductCarousel({ products, lang, getText, autoPlayDelay = 5000 }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const totalSlides = Math.max(1, Math.ceil(products.length / 3))
  const totalProducts = products.length

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, totalSlides])

  const next = useCallback(() => {
    goTo(currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1)
  }, [currentIndex, totalSlides, goTo])

  const prev = useCallback(() => {
    goTo(currentIndex - 1 < 0 ? totalSlides - 1 : currentIndex - 1)
  }, [currentIndex, totalSlides, goTo])

  // Auto-play
  useEffect(() => {
    if (autoPlayDelay <= 0 || totalSlides <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1 >= totalSlides ? 0 : prev + 1))
    }, autoPlayDelay)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoPlayDelay, totalSlides])

  if (totalProducts === 0) return null

  const visibleProducts = products.slice(currentIndex * 3, currentIndex * 3 + 3)

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <div key={product.id} className="animate-fade-in-up backdrop-blur-md bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:scale-[1.02] transition-all duration-300 flex flex-col">
              {product.images && product.images[0] && (
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                  <Image src={getImageUrl(product.images[0])} alt={getLocalizedText(product.title, lang)} fill className="object-cover" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-white">{getLocalizedText(product.title, lang)}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{getLocalizedText(product.description, lang)}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sky-400 font-bold text-lg">{(product.price / 100).toFixed(2)} €</span>
                <Link 
                  href={`/api/stripe/checkout?productId=${product.id}`}
                  className="bg-sky-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-sky-400 transition"
                >
                  {getText([], 'products_buy', lang, 'Acheter')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Précédent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Suivant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-sky-400 w-8' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Aller à la slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
