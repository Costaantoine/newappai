import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'
import AppleHero from '@/components/AppleHero'
import AppleCard from '@/components/AppleCard'
import AppleSection from '@/components/AppleSection'

export const dynamic = 'force-dynamic'

const productsTranslations: Record<string, Record<string, string>> = {
  fr: {
    meta_title: 'Tous nos produits et solutions IA | NewAppAI',
    meta_desc: 'Découvrez tous les produits et solutions IA de NewAppAI : EasyReadVoice, QRcall, chatbot, gestion de production et plus encore.',
    hero_title: 'Nos Produits',
    hero_subtitle: 'Découvrez nos solutions innovantes pour votre entreprise.',
    cat_industrie: 'Industrie',
    cat_comptabilite: 'Comptabilité',
    cat_outils_services: 'Outils et services',
    cat_commerce: 'Commerce',
    cat_droit: 'Droit',
    cat_webdesign: 'Web design',
    cat_a_tester: 'À tester',
    empty_title: 'Bientôt disponible',
    empty_desc: 'Nos produits seront bientôt en ligne. Revenez nous voir prochainement !',
    contact_us: 'Nous contacter',
  },
  en: {
    meta_title: 'All our products and AI solutions | NewAppAI',
    meta_desc: 'Discover all NewAppAI products and AI solutions: EasyReadVoice, QRcall, chatbot, production management and more.',
    hero_title: 'Our Products',
    hero_subtitle: 'Discover our innovative solutions for your business.',
    cat_industrie: 'Industry',
    cat_comptabilite: 'Accounting',
    cat_outils_services: 'Tools & Services',
    cat_commerce: 'Commerce',
    cat_droit: 'Legal',
    cat_webdesign: 'Web Design',
    cat_a_tester: 'To test',
    empty_title: 'Coming soon',
    empty_desc: 'Our products will be online soon. Come back and see us!',
    contact_us: 'Contact us',
  },
  pt: {
    meta_title: 'Todos os nossos produtos e soluções IA | NewAppAI',
    meta_desc: 'Descubra todos os produtos e soluções IA da NewAppAI: EasyReadVoice, QRcall, chatbot, gestão de produção e muito mais.',
    hero_title: 'Nossos Produtos',
    hero_subtitle: 'Descubra nossas soluções inovadoras para sua empresa.',
    cat_industrie: 'Indústria',
    cat_comptabilite: 'Contabilidade',
    cat_outils_services: 'Ferramentas e Serviços',
    cat_commerce: 'Comércio',
    cat_droit: 'Direito',
    cat_webdesign: 'Web Design',
    cat_a_tester: 'Para testar',
    empty_title: 'Em breve',
    empty_desc: 'Nossos produtos estarão online em breve. Volte a nos visitar!',
    contact_us: 'Fale conosco',
  },
  es: {
    meta_title: 'Todos nuestros productos y soluciones IA | NewAppAI',
    meta_desc: 'Descubra todos los productos y soluciones IA de NewAppAI: EasyReadVoice, QRcall, chatbot, gestión de producción y más.',
    hero_title: 'Nuestros Productos',
    hero_subtitle: 'Descubra nuestras soluciones innovadoras para su empresa.',
    cat_industrie: 'Industria',
    cat_comptabilite: 'Contabilidad',
    cat_outils_services: 'Herramientas y Servicios',
    cat_commerce: 'Comercio',
    cat_droit: 'Derecho',
    cat_webdesign: 'Diseño Web',
    cat_a_tester: 'Para probar',
    empty_title: 'Próximamente',
    empty_desc: 'Nuestros productos estarán en línea pronto. ¡Vuelva a vernos!',
    contact_us: 'Contáctenos',
  },
}

function getLang(): string {
  const cookieStore = cookies()
  const lang = cookieStore.get('lang')?.value
  if (lang && ['fr', 'en', 'pt', 'es'].includes(lang)) return lang
  return 'fr'
}

function t(key: string, lang: string): string {
  return productsTranslations[lang]?.[key] || productsTranslations.fr[key] || key
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = getLang()
  return {
    title: t('meta_title', lang),
    description: t('meta_desc', lang),
    alternates: { canonical: 'https://newappai.com/produits' },
    openGraph: {
      title: t('meta_title', lang),
      description: t('meta_desc', lang),
      images: [{ url: 'https://newappai.com/og-image.jpg', width: 1200, height: 630 }],
      url: 'https://newappai.com/produits',
      siteName: 'NewAppAI',
      locale: lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : lang === 'pt' ? 'pt_PT' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title', lang),
      description: t('meta_desc', lang),
      images: ['https://newappai.com/og-image.jpg'],
    },
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/supabase/products`, {
      cache: 'no-store'
    })
    const data = await res.json()
    return data.products || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

function ProductsGrid({ products, lang }: { products: any[]; lang: string }) {
  // Grouper par catégorie
  const categories: Record<string, any[]> = {}
  const categoryLabels: Record<string, string> = {
    'industrie': t('cat_industrie', lang),
    'comptabilite': t('cat_comptabilite', lang),
    'outils-services': t('cat_outils_services', lang),
    'commerce': t('cat_commerce', lang),
    'droit': t('cat_droit', lang),
    'webdesign': t('cat_webdesign', lang),
    'a-tester': t('cat_a_tester', lang),
  }
  
  for (const p of products) {
    const cat = p.category || 'other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(p)
  }

  return (
    <div className="max-w-6xl mx-auto w-full space-y-20">
      {Object.entries(categories).map(([catKey, catProducts]) => (
        <div key={catKey}>
          <h2 data-section={`cat-${catKey}`} className="text-3xl md:text-4xl font-bold text-[#f5f5f7] mb-10 text-left flex items-center gap-3 tracking-wide">
            <span className="w-8 h-0.5 bg-violet-400 rounded-full"></span>
            {categoryLabels[catKey] || catKey}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function ProduitsPage() {
  const lang = getLang()
  const products = await getProducts()
  const activeProducts = products.filter((p: any) => p.status === 'visible' || p.status === 'development')

  return (
    <>
      <Header />
      
      <AppleHero
        title={<>{t('hero_title', lang).split(' ').slice(0, -1).join(' ')} <span className="neon-text">{t('hero_title', lang).split(' ').pop()}</span></>}
        subtitle={t('hero_subtitle', lang)}
        particlesCount={20}
        titleDataSection="products-title"
        subtitleDataSection="products-subtitle"
        backgroundImage="https://newappai.com/uploads/hero-ai-v2-wide.jpg"
      />

      <AppleSection>
        {activeProducts.length === 0 ? (
          <AppleCard padding="lg" className="text-center max-w-lg mx-auto">
            <p data-section="empty-title" className="text-[#86868b] text-lg mb-4">{t('empty_title', lang)}</p>
            <p data-section="empty-desc" className="text-[#86868b]">{t('empty_desc', lang)}</p>
            <Link href="/contact" data-section="contact-us" className="inline-block mt-6 bg-violet-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-violet-400 transition">
              {t('contact_us', lang)}
            </Link>
          </AppleCard>
        ) : (
          <ProductsGrid products={activeProducts} lang={lang} />
        )}
      </AppleSection>

      <Footer />
    </>
  )
}
