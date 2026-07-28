'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export default function PanierContent() {
  const { items, total, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="glass rounded-2xl border border-[#33ff33]/20 p-12 text-center">
        <p className="text-[#33ff33] text-lg mb-6">Votre panier est vide</p>
        <Link
          href="/produits"
          className="inline-block bg-green-500 text-[#33ff33] px-6 py-3 rounded-full font-bold hover:bg-green-400 transition shadow-lg shadow-green-500/20"
        >
          Découvrir nos produits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-[#33ff33]/20 divide-y divide-white/5 overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-6">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <h2 className="font-semibold text-slate-100">{item.title}</h2>
              <p className="text-[#33ff33] text-sm">
                {formatPrice(item.price)} &times; {item.quantity}
              </p>
            </div>
            <p className="text-[#33ff33] font-bold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-[#33ff33]/20 p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center text-lg">
          <span className="text-[#33ff33]">Total</span>
          <span className="text-[#33ff33] font-bold text-2xl">{formatPrice(total)}</span>
        </div>
        <button
          className="w-full bg-emerald-500 text-black py-3 rounded-full font-bold hover:opacity-90 transition"
        >
          Passer la commande
        </button>
      </div>
    </div>
  )
}
