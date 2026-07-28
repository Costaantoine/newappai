import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { Providers } from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'
import HtmlLangUpdater from '@/components/HtmlLangUpdater'
import { SettingsProvider } from '@/lib/SettingsContext'
import { prisma } from '@/lib/prisma'

// Métadonnées par langue
const META_BY_LANG: Record<string, Metadata> = {
  fr: {
    title: 'NewAppAI | Innovation Logicielle — IA pour votre entreprise',
    description: "Pilotez votre entreprise avec l'intelligence d'aujourd'hui. EasyReadVoice, QRcall, solutions IA pour commerces, industries et services.",
  },
  en: {
    title: 'NewAppAI | Software Innovation — AI for your Business',
    description: 'Drive your business with today\'s intelligence. EasyReadVoice, QRcall, AI solutions for retail, industry and services.',
  },
  pt: {
    title: 'NewAppAI | Inovação em Software — IA para a sua empresa',
    description: 'Pilote sua empresa com a inteligência de hoje. EasyReadVoice, QRcall, soluções de IA para comércios, indústrias e serviços.',
  },
  es: {
    title: 'NewAppAI | Innovación en Software — IA para su empresa',
    description: 'Pilote su empresa con la inteligencia de hoy. EasyReadVoice, QRcall, soluciones de IA para comercios, industrias y servicios.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const cookieStr = headersList.get('cookie') || ''
  const langMatch = cookieStr.match(/lang=([^;]+)/)
  const lang = langMatch?.[1] || 'fr'

  const meta = META_BY_LANG[lang] || META_BY_LANG.fr

  return {
    title: meta.title || "NewAppAI",
    description: meta.description || "",
    openGraph: {
      title: meta.title || "NewAppAI",
      description: meta.description || "",
      url: 'https://newappai.com',
      siteName: 'NewAppAI',
      images: [{ url: 'https://newappai.com/og-image.jpg', width: 1200, height: 630 }],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : lang === 'pt' ? 'pt_PT' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title || "NewAppAI",
      description: meta.description || "",
      images: ['https://newappai.com/og-image.jpg'],
    },
    alternates: {
      canonical: 'https://newappai.com',
      languages: {
        'fr': 'https://newappai.com/',
        'fr-FR': 'https://newappai.com/',
        'en': 'https://newappai.com/en',
        'pt': 'https://newappai.com/pt',
        'es': 'https://newappai.com/es',
        'x-default': 'https://newappai.com/',
      },
    },
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NewAppAI',
  url: 'https://newappai.com',
  logo: 'https://newappai.com/og-image.jpg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33-6-64-10-05-69',
    contactType: 'customer service',
    availableLanguage: ['French', 'English', 'Portuguese', 'Spanish'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bordeaux',
    addressCountry: 'FR',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NewAppAI',
  url: 'https://newappai.com',
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://newappai.com/' },
    { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://newappai.com/solutions' },
    { '@type': 'ListItem', position: 3, name: 'Produits', item: 'https://newappai.com/produits' },
    { '@type': 'ListItem', position: 4, name: 'Contact', item: 'https://newappai.com/contact' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side fetch: get actual settings so SSR renders the real data (no flash)
  let serverSettings: any = null
  try {
    const setting = await prisma.settings.findUnique({ where: { id: 'main' } })
    if (setting) serverSettings = JSON.parse(setting.data)
  } catch (e) {
    // Fallback silently – client will fetch on mount
  }

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
<body id="premium-root" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <HtmlLangUpdater />
        <Providers>
          <SettingsProvider initialSettings={serverSettings}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SettingsProvider>
        </Providers>
      </body>
    </html>
  )
}
