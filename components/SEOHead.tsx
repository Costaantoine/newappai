'use client'

import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
  ogUrl?: string
  ogTitle?: string
  ogDescription?: string
}

/**
 * Injecte les balises meta Open Graph / Twitter dans le <head>
 * pour les pages 'use client' qui ne peuvent pas exporter `metadata`.
 */
export default function SEOHead({
  title,
  description,
  ogImage = 'https://newappai.com/og-image.jpg',
  ogUrl,
  ogTitle,
  ogDescription,
}: SEOHeadProps) {
  useEffect(() => {
    const og = ogTitle || title
    const od = ogDescription || description
    const url = ogUrl || (typeof window !== 'undefined' ? window.location.href : '')

    document.title = title

    const setMeta = (property: string, content: string) => {
      const key = property.startsWith('twitter:') ? 'name' : 'property'
      let el = document.querySelector(`meta[${key}="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(key, property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title', og)
    setMeta('og:description', od)
    setMeta('og:image', ogImage)
    setMeta('og:url', url)
    setMeta('og:site_name', 'NewAppAI')
    setMeta('og:type', 'website')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', og)
    setMeta('twitter:description', od)
    setMeta('twitter:image', ogImage)
  }, [title, description, ogImage, ogUrl, ogTitle, ogDescription])

  return null
}
