'use client'

import { useCart } from '@/lib/cartContext'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

interface ProductData {
  id: string
  title: string | Record<string, string>
  description?: string | Record<string, string>
  price: number
  images?: string[]
}

function getLocalizedText(text: string | Record<string, string> | undefined, lang: string): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  const val = text[lang as keyof Record<string, string>]
  if (val && val.trim() !== '') return val
  return (text.fr && text.fr.trim() !== '') ? text.fr : ''
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export default function EasyReadVoiceBlock({ products }: { products: ProductData[] }) {
  const { lang } = useLanguage()
  const { addItem, items } = useCart()

  // Trier par prix croissant
  const sorted = [...products].sort((a, b) => a.price - b.price)

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border-white/5">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
        <div className="relative w-full md:w-64 h-48 md:h-56 rounded-xl overflow-hidden shrink-0">
          <img
            src="/images/produits/easyreadvoice.webp"
            alt="EasyReadVoice"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-green-400 rounded-full"></span>
            <h3 className="text-2xl font-bold text-[#33ff33]">EasyReadVoice</h3>
          </div>
          <p className="text-[#33ff33] leading-relaxed mb-4">
            Transformez vos textes en audio naturel avec EasyReadVoice. Choisissez
            l&apos;offre adaptée à vos besoins, du texte court aux longs documents.
          </p>
          <Link
            href="/easyreadvoice"
            className="text-sm text-[#33ff33] hover:text-[#33ff33] transition underline underline-offset-4"
          >
            En savoir plus →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Offres disponibles
        </h4>
        <div className="space-y-3">
          {sorted.map((product) => {
            const title = getLocalizedText(product.title, lang)
            const description = getLocalizedText(product.description, lang)
            const inCart = items.find(item => item.id === product.id)

            const handleAddToCart = () => {
              addItem({
                id: product.id,
                title,
                price: product.price,
                image: '/images/produits/easyreadvoice.webp',
              })
            }

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5 gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#33ff33] font-semibold truncate">{title}</p>
                  {description && (
                    <p className="text-slate-500 text-xs mt-0.5 truncate">
                      {description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[#33ff33] font-bold whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    data-section="products-buy"
                    onClick={handleAddToCart}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                      inCart
                        ? 'bg-green-500 text-[#33ff33]'
                        : 'btn-primary hover:brightness-110'
                    }`}
                  >
                    {inCart ? 'Ajouter (+1)' : 'Ajouter au panier'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
