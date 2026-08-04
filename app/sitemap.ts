import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://newappai.com'

  const staticPages = [
    { url: '', priority: 1.0, changeFreq: 'weekly' as const },
    { url: '/solutions', priority: 0.9, changeFreq: 'weekly' as const },
    { url: '/produits', priority: 0.9, changeFreq: 'weekly' as const },
    { url: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { url: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    { url: '/easyreadvoice', priority: 0.8, changeFreq: 'weekly' as const },
    { url: '/qrcall', priority: 0.8, changeFreq: 'weekly' as const },
    { url: '/cgv', priority: 0.3, changeFreq: 'monthly' as const },
    { url: '/en', priority: 0.5, changeFreq: 'monthly' as const },
    { url: '/pt', priority: 0.5, changeFreq: 'monthly' as const },
    { url: '/es', priority: 0.5, changeFreq: 'monthly' as const },
    { url: '/easyreadvoice/login', priority: 0.4, changeFreq: 'monthly' as const },
    { url: '/easyreadvoice/register', priority: 0.4, changeFreq: 'monthly' as const },
  ]

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }))
}
