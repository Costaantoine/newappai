import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import AnimatedTitle from '@/components/AnimatedTitle'
import ParticlesBackground from '@/components/ParticlesBackground'

export const dynamic = 'force-dynamic'

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

function ProductsGrid({ products }: { products: any[] }) {
  // Grouper par catégorie
  const categories: Record<string, any[]> = {}
  const categoryLabels: Record<string, string> = {
    'industrie': 'Industrie',
    'comptabilite': 'Comptabilité',
    'outils-services': 'Outils et services',
    'commerce': 'Commerce',
    'droit': 'Droit',
    'webdesign': 'Web design',
    'a-tester': 'A Tester'
  }
  
  for (const p of products) {
    const cat = p.category || 'other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(p)
  }

  return (
    <div className="max-w-6xl mx-auto w-full space-y-16">
      {Object.entries(categories).map(([catKey, catProducts]) => (
        <div key={catKey}>
          <h2 className="text-2xl font-bold text-white mb-8 text-left flex items-center gap-3">
            <span className="w-8 h-0.5 bg-sky-400 rounded-full"></span>
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
  const products = await getProducts()
  const activeProducts = products.filter((p: any) => p.active !== false)

  return (
    <>
      <Header />
      
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
        <div className="absolute top-10 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -z-10"></div>
        <ParticlesBackground count={20} />
        <h1 data-section="products-title" className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in-up">
          Nos <span className="neon-text">Produits</span>
        </h1>
        <p data-section="products-subtitle" className="text-slate-400 max-w-2xl text-lg mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          Découvrez nos solutions innovantes pour votre entreprise.
        </p>

        {activeProducts.length === 0 ? (
          <div className="glass p-10 rounded-[2.5rem] text-center max-w-lg">
            <p className="text-slate-300 text-lg mb-4">Bientôt disponible</p>
            <p className="text-slate-400">Nos produits seront bientôt en ligne. Revenez nous voir prochainnement !</p>
            <Link href="/contact" className="inline-block mt-6 bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-400 transition">
              Nous contacter
            </Link>
          </div>
        ) : (
          <ProductsGrid products={activeProducts} />
        )}
      </section>

      <Footer />
    </>
  )
}
