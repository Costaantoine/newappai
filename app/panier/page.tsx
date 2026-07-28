import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PanierContent from '@/components/PanierContent'

export const metadata = {
  title: 'Votre Panier',
  alternates: { canonical: 'https://newappai.com/panier' },
}

export default function PanierPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-slate-100 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">
            Votre <span className="neon-text">Panier</span>
          </h1>
          <PanierContent />
        </div>
      </main>
      <Footer />
    </>
  )
}
