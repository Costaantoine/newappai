'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartContext'
import Link from 'next/link'

const IMMEDIATE_PRODUCT_IDS = new Set([
  '1020f90c-7355-4353-8e45-907777cdeffd',
  '33c9d282-7154-4ae6-ae2e-87e8d7d02bd3',
  'cd0ab50d-d479-4671-a723-841e7068a791',
  'd4f985d2-803b-4c28-93f7-79a8cf1ec5c0',
  'b1c8a28c-c5ab-41c3-aeed-f48068b08bb3',
  'c234b8d8-e829-4d7b-81b9-9f401d88fa1c',
  '8a8677a3-c519-4f40-9464-940b2cfcdc09',
  'ae2ac1ef-1b73-4f86-bc9f-63a3977aa9d3',
  '256ecb1e-d92a-469c-91da-24a5215af2ca',
])

const WAIVER_TEXT = "Je renonce à mon droit de rétractation conformément à l'article L221-28 du Code de la consommation, le téléchargement/l'activation commençant immédiatement après validation du paiement."

export default function CartWidget() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'summary' | 'processing'>('cart')
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const hasImmediateProduct = items.some(item => IMMEDIATE_PRODUCT_IDS.has(item.id))
  const needsWaiver = hasImmediateProduct

  useEffect(() => {
    if (isOpen) setWaiverAccepted(false)
  }, [isOpen])

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true)
    window.addEventListener('open-cart', handleOpenCart)
    return () => window.removeEventListener('open-cart', handleOpenCart)
  }, [])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const handleProceedToSummary = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Veuillez remplir votre nom, email et téléphone')
      return
    }
    setCheckoutStep('summary')
  }

  const handleCheckout = async () => {
    if (needsWaiver && !waiverAccepted) return
    setCheckoutStep('processing')
    try {
      const response = await fetch('/api/stripe/checkout-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customer: customerInfo,
          ...(needsWaiver ? {
            waiver_accepted: true,
            waiver_timestamp: new Date().toISOString(),
          } : {}),
        })
      })

      const data = await response.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        alert('Erreur lors du checkout')
        setCheckoutStep('summary')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Erreur lors du checkout')
      setCheckoutStep('summary')
    }
  }

  if (itemCount === 0) return null

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setCheckoutStep('cart'); }}
        className="fixed top-24 right-4 z-50 bg-violet-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-violet-400 transition flex items-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="font-bold text-lg">Panier</span>
        <span className="bg-red-500 text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
          {itemCount}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl">

            {/* Header - Fixed */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-white">
                {checkoutStep === 'cart' && 'Mon Panier'}
                {checkoutStep === 'summary' && 'Récapitulatif'}
                {checkoutStep === 'processing' && 'Paiement...'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white" title="Fermer" aria-label="Fermer le panier">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Progress Bar */}
              {checkoutStep !== 'processing' && (
                <div className="flex justify-center gap-2 py-4">
                  <div className={`w-3 h-3 rounded-full ${checkoutStep === 'cart' ? 'bg-violet-500' : 'bg-green-500'}`}></div>
                  <div className={`w-3 h-3 rounded-full ${checkoutStep === 'summary' ? 'bg-violet-500' : 'bg-slate-600'}`}></div>
                </div>
              )}

              {/* CART STEP */}
              {checkoutStep === 'cart' && (
                <div className="p-6 pt-0">
                  {/* Product List */}
                  <div className="space-y-4 mb-8">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                          <p className="text-violet-400 font-bold text-sm">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-white w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-red-400 hover:text-red-300 text-xs"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-semibold mb-3 text-sm">Informations client</h3>
                    <input
                      type="text"
                      placeholder="Nom complet *"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 mb-3 text-sm focus:border-violet-500 outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 mb-3 text-sm focus:border-violet-500 outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone *"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 text-sm focus:border-violet-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* SUMMARY STEP */}
              {checkoutStep === 'summary' && (
                <div className="p-6 pt-0">
                  {needsWaiver && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={waiverAccepted}
                          onChange={(e) => setWaiverAccepted(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-600 bg-slate-700 text-violet-500 focus:ring-violet-500"
                        />
                        <span className="text-amber-200 text-sm leading-relaxed">{WAIVER_TEXT}</span>
                      </label>
                    </div>
                  )}
                  <h3 className="text-white font-semibold mb-4 text-sm">Détails de la commande</h3>

                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-white/5">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-white text-sm">{item.title}</p>
                          <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-violet-400 font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-white/5">
                    <h4 className="text-white font-semibold mb-2 text-sm">Client</h4>
                    <p className="text-slate-300 text-sm">{customerInfo.name}</p>
                    <p className="text-slate-300 text-sm">{customerInfo.email}</p>
                    {customerInfo.phone && <p className="text-slate-300 text-sm">{customerInfo.phone}</p>}
                  </div>
                </div>
              )}

              {/* PROCESSING STEP */}
              {checkoutStep === 'processing' && (
                <div className="p-12 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-white">Redirection vers le paiement...</p>
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            {checkoutStep !== 'processing' && (
              <div className="p-6 border-t border-white/10 bg-slate-900 bg-opacity-95 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between text-white font-bold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-violet-400">{formatPrice(total)}</span>
                </div>
                {checkoutStep === 'cart' ? (
                  <button
                    onClick={handleProceedToSummary}
                    className="w-full bg-violet-500 text-white py-3 rounded-full font-bold hover:bg-violet-400 transition shadow-lg shadow-violet-500/20"
                  >
                    Passer la commande
                  </button>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={needsWaiver && !waiverAccepted}
                    className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-400 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                  >
                    Confirmer et payer
                  </button>
                )}
                <button
                  onClick={() => checkoutStep === 'cart' ? setIsOpen(false) : setCheckoutStep('cart')}
                  className="w-full mt-2 text-slate-400 py-2 hover:text-white text-sm transition-colors"
                >
                  {checkoutStep === 'cart' ? 'Continuer mes achats' : 'Retour au panier'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
