'use client'

import { useCart } from '@/lib/cartContext'
import { useLanguage } from '@/lib/LanguageContext'

interface ProductTitle {
  fr: string
  en: string
  pt: string
  es: string
}

interface ProductDescription {
  fr: string
  en: string
  pt: string
  es: string
}

interface ImageSettings {
  opacity?: number
  brightness?: number
  contrast?: number
  saturation?: number
  sepia?: number
}

interface ProductCardProps {
  product: {
    id: string
    title: string | ProductTitle
    description?: string | ProductDescription
    price: number
    images?: string[]
    image_settings?: Record<string, ImageSettings>
  }
}

function getLocalizedText(text: string | ProductTitle | ProductDescription | undefined, lang: string): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  const val = text[lang as keyof ProductTitle]
  if (val && val.trim() !== '') return val
  return (text.fr && text.fr.trim() !== '') ? text.fr : ''
}

function getImageUrl(imgData: string | undefined): string {
  if (!imgData) return ''
  try {
    const parsed = JSON.parse(imgData)
    return parsed.thumbnail || parsed.original || imgData
  } catch {
    return imgData
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguage()
  const { addItem, items } = useCart()

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const title = getLocalizedText(product.title, lang)
  const description = getLocalizedText(product.description, lang)
  const imageUrl = getImageUrl(product.images?.[0])
  const imgSettings = product.image_settings?.[0] || {}

  const inCart = items.find(item => item.id === product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: title,
      price: product.price,
      image: imageUrl
    })
  }

  const imageStyle = {
    opacity: (imgSettings.opacity ?? 100) / 100,
    filter: `
      brightness(${(imgSettings.brightness ?? 100) / 100})
      contrast(${(imgSettings.contrast ?? 100) / 100})
      saturate(${(imgSettings.saturation ?? 100) / 100})
      sepia(${(imgSettings.sepia ?? 0) / 100})
    `
  }

  return (
    <div className="glass p-6 rounded-[2rem] border-white/5 hover:scale-[1.02] transition-all duration-300 flex flex-col">
      {imageUrl ? (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            style={imageStyle}
          />
        </div>
      ) : (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/5">
          <div className="text-slate-600 flex flex-col items-center gap-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Aucune image</span>
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
        {description?.replace(/<[^>]*>/g, '').substring(0, 100)}...
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sky-400 font-bold text-lg">{formatPrice(product.price)}</span>
        <button
          onClick={handleAddToCart}
          className={`px-6 py-2 rounded-full text-sm font-bold transition ${inCart
            ? 'bg-green-500 text-white'
            : 'btn-primary hover:brightness-110'
            }`}
        >
          {inCart ? 'Ajouter (+1)' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}
