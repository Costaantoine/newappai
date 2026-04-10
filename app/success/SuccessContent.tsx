'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

export default function SuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [productName, setProductName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.productName) setProductName(data.productName)
          if (data.customerEmail) setCustomerEmail(data.customerEmail)
        })
        .catch(console.error)
    }
  }, [sessionId])

  return (
    <>
      <Header />
      
      <section className="relative pt-48 pb-20 px-6 flex flex-col items-center">
        <div className="absolute top-10 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full -z-10"></div>
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          {t.success.title.replace('confirmé', <span className="neon-text" key="conf">confirmé</span> as any)}
        </h1>
        
        <p className="text-slate-300 max-w-xl text-lg mb-8 text-center leading-relaxed">
          {t.success.subtitle} <strong className="text-white">{productName || 'votre produit'}</strong>.
          {customerEmail && (
            <span className="block mt-2">
              {t.success.emailSent} <span className="text-sky-400">{customerEmail}</span>.
            </span>
          )}
        </p>

        <div className="glass p-8 rounded-[2rem] border-white/5 max-w-md w-full mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">{t.success.nextSteps}</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-sky-400 mr-2">1.</span>
              {t.success.step1}
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-2">2.</span>
              {t.success.step2}
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-2">3.</span>
              {t.success.step3}
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="/" className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-400 transition">
            {t.success.home}
          </a>
          <a href="/contact" className="glass text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition border border-white/10">
            {t.success.contact}
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
