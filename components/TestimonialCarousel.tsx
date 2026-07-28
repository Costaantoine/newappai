'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface Testimonial {
  id: string
  title: string
  description: string
  image_url?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlayDelay?: number
}

export default function TestimonialCarousel({ testimonials, autoPlayDelay = 5000 }: TestimonialCarouselProps) {
  const { t: langTranslations } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, testimonials.length - 1)))
  }

  const next = useCallback(() => {
    goTo(currentIndex + 1 >= testimonials.length ? 0 : currentIndex + 1)
  }, [currentIndex, testimonials.length])

  const prev = useCallback(() => {
    goTo(currentIndex - 1 < 0 ? testimonials.length - 1 : currentIndex - 1)
  }, [currentIndex, testimonials.length])

  useEffect(() => {
    if (autoPlayDelay <= 0 || testimonials.length <= 1) return
    intervalRef.current = setInterval(next, autoPlayDelay)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoPlayDelay, next, testimonials.length])

  if (testimonials.length === 0) return null

  const t = testimonials[currentIndex]

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">{langTranslations?.testimonial?.title || "Ils nous font confiance"}</h2>
      
      <div className="relative">
        <div className="bg-white/[0.04] p-8 md:p-12 rounded-[2rem] border border-white/[0.08]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
              {t.image_url ? (
                <img src={t.image_url} alt={t.title} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">{t.title}</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{t.description}</p>
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <>
            <button onClick={prev} className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10" aria-label={langTranslations?.testimonial?.previous || "Précédent"}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next} className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10" aria-label={langTranslations?.testimonial?.next || "Suivant"}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-violet-400 w-8' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`${langTranslations?.testimonial?.slide_label || "Aller au témoignage"} ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
