'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'

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

function getAbsoluteImageUrl(imagePath: string | undefined): string | undefined {
  const url = getImageUrl(imagePath)
  if (!url) return undefined
  return url.startsWith('http') ? url : `https://newappai.com${url}`
}

function buildProductJsonLd(name: string, description: string, price: number, url: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(image ? { image: [image] } : {}),
    brand: {
      '@type': 'Brand',
      name: 'NewAppAI',
    },
    offers: {
      '@type': 'Offer',
      price: Number((price / 100).toFixed(2)),
      priceCurrency: 'EUR',
      url,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'NewAppAI',
      },
    },
  }
}

// ERV variant products that should be grouped
const ERV_GROUP_TITLES = [
  'EasyReadVoice - Texte vers Audio',
  'EasyReadVoice - Texte vers Audio (Essentiel)',
  'EasyReadVoice - Texte vers Audio (Standard)',
  'EasyReadVoice - Texte vers Audio (Integral)',
]

const ERV_VARIANTS = [
  { labelKey: 'erv_base' as const, suffix: 'EasyReadVoice - Texte vers Audio', price: 199, id: '' },
  { labelKey: 'erv_essentiel' as const, suffix: 'EasyReadVoice - Texte vers Audio (Essentiel)', price: 499, id: '' },
  { labelKey: 'erv_standard' as const, suffix: 'EasyReadVoice - Texte vers Audio (Standard)', price: 999, id: '' },
  { labelKey: 'erv_integral' as const, suffix: 'EasyReadVoice - Texte vers Audio (Integral)', price: 1999, id: '' },
]

export default function ProductCarousel({ products, lang, getText, autoPlayDelay = 5000 }: ProductCarouselProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(2) // Standard by default
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Separate ERV group products, ERV Player, and others
  const ervGroup = products.filter(p => ERV_GROUP_TITLES.includes(typeof p.title === 'string' ? p.title : ''))
  const ervPlayer = products.filter(p => (typeof p.title === 'string' ? p.title : '').startsWith('EasyReadVoice Player'))
  const otherProducts = products.filter(p => {
    const t = typeof p.title === 'string' ? p.title : ''
    return !ERV_GROUP_TITLES.includes(t) && !t.startsWith('EasyReadVoice Player')
  })

  // Fill variant IDs from products
  ERV_VARIANTS.forEach(v => {
    const found = ervGroup.find(p => (typeof p.title === 'string' ? p.title : '') === v.suffix)
    if (found) v.id = found.id
  })

  // Build display list: ERV grouped card + ERV Player + other products
  const ervBaseProduct = ervGroup[0]
  const displayProducts = ervBaseProduct
    ? [ervBaseProduct, ...ervPlayer, ...otherProducts]
    : [...ervPlayer, ...otherProducts]

  const totalSlides = Math.max(1, Math.ceil(displayProducts.length / 3))
  const totalProducts = displayProducts.length

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

  const visibleProducts = displayProducts.slice(currentIndex * 3, currentIndex * 3 + 3)

  const isERVGroup = (product: Product) => {
    const t = typeof product.title === 'string' ? product.title : ''
    return ERV_GROUP_TITLES.includes(t)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((product) => {
            // ERV grouped card
            if (isERVGroup(product)) {
              const variant = ERV_VARIANTS[selectedVariant]
              return (
                <div key="erv-group" className="animate-fade-in-up backdrop-blur-2xl bg-white/[0.03] p-8 rounded-[1.5rem] border border-white/[0.08] shadow-lg shadow-black/30 hover:bg-white/[0.06] hover:border-violet-400/30 transition-all duration-300 flex flex-col">
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify(buildProductJsonLd(
                        'EasyReadVoice',
                        'Multi-layer text-to-audio — character detection, natural voices.',
                        variant.price,
                        'https://newappai.com/easyreadvoice',
                        getAbsoluteImageUrl(product.images?.[0])
                      ))
                    }}
                  />
                  {product.images && product.images[0] && (
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                      <Image src={getImageUrl(product.images[0])} alt="EasyReadVoice" fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-[#f5f5f7]">EasyReadVoice</h3>
                  <p className="text-[#86868b] text-sm mb-4 flex-grow">{t?.product?.erv_desc || 'Texte vers Audio multicouche — détection des personnages, voix naturelles.'}</p>
                  
                  {/* Price selector */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {ERV_VARIANTS.map((v, i) => (
                      <button
                        key={v.labelKey}
                        onClick={() => setSelectedVariant(i)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition border ${
                          i === selectedVariant
                            ? 'bg-violet-500 text-white border-violet-400'
                            : 'bg-white/5 text-[#86868b] border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {t?.product?.[v.labelKey] || v.labelKey}
                        <span className="block text-xs opacity-80">{(v.price / 100).toFixed(2)} €</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-violet-400 font-bold text-lg">{(variant.price / 100).toFixed(2)} €</span>
                    {variant.id ? (
                      <Link
                        href={`/checkout?productId=${variant.id}`}
                        className="bg-violet-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-violet-400 transition"
                      >
                        {t?.product?.add_cart || 'Acheter'}
                      </Link>
                    ) : (
                      <span className="text-[#6e6e73] text-sm">{t?.product?.soon || "Bientôt"}</span>
                    )}
                  </div>
                </div>
              )
            }

            // Normal product card
            return (
              <div key={product.id} className="animate-fade-in-up backdrop-blur-2xl bg-white/[0.03] p-8 rounded-[1.5rem] border border-white/[0.08] shadow-lg shadow-black/30 hover:bg-white/[0.06] hover:border-violet-400/30 transition-all duration-300 flex flex-col">
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildProductJsonLd(
                      getLocalizedText(product.title, lang),
                      getLocalizedText(product.description, lang),
                      product.price,
                      `https://newappai.com/produits#${product.id}`,
                      getAbsoluteImageUrl(product.images?.[0])
                    ))
                  }}
                />
                {product.images && product.images[0] && (
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                    <Image src={getImageUrl(product.images[0])} alt={getLocalizedText(product.title, lang)} fill className="object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-[#f5f5f7]">{getLocalizedText(product.title, lang)}</h3>
                <p className="text-[#86868b] text-sm mb-4 line-clamp-2 flex-grow">{getLocalizedText(product.description, lang)}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-violet-400 font-bold text-lg">{(product.price / 100).toFixed(2)} €</span>
                  <Link
                    href={`/checkout?productId=${product.id}`}
                    className="bg-violet-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-violet-400 transition"
                  >
                    {t?.product?.add_cart || 'Acheter'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {totalSlides > 1 && (
        <>
          <button onClick={prev} className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10" aria-label={t?.product?.previous || "Précédent"}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10" aria-label={t?.product?.next || "Suivant"}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-violet-400 w-8' : 'bg-white/20 hover:bg-white/40'}`} aria-label={`${t?.product?.slide_label || "Aller à la slide"} ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
