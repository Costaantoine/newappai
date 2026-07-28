'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ParticlesBackground'

const pages = [
  { title: 'Accueil', url: '/', keywords: ['accueil','home','newapp','newappai'] },
  { title: 'Solutions', url: '/solutions', keywords: ['solution','solutions','commerce','industrie','comptabilite','droit','webdesign'] },
  { title: 'Produits', url: '/produits', keywords: ['produit','produits','product','easyreadvoice','qrcall','gestion'] },
  { title: 'EasyReadVoice', url: '/easyreadvoice', keywords: ['easyreadvoice','audio','voice','voix','texte','tts'] },
  { title: 'QRcall', url: '/qrcall', keywords: ['qrcall','qr','code','scan','contact'] },
  { title: 'Contact', url: '/contact', keywords: ['contact','email','message'] },
  { title: 'A propos', url: '/about', keywords: ['a propos','about','histoire','vision','mission','valeurs'] },
  { title: 'Comptabilite', url: '/solutions#comptabilite', keywords: ['compta','comptabilite','accounting'] },
  { title: 'Droit & Juridique', url: '/solutions#droit', keywords: ['droit','juridique','legal','law'] },
  { title: 'Web Design', url: '/solutions#webdesign', keywords: ['web','design','site','site internet'] },
  { title: 'CGV', url: '/cgv', keywords: ['cgv','conditions','vente'] },
  { title: 'Mentions legales', url: '/mentions-legales', keywords: ['mention','legales','legal'] },
  { title: 'Confidentialite', url: '/privacy', keywords: ['privacy','confidentialite','donnees'] },
  { title: 'Marketplace', url: '/marketplace', keywords: ['marketplace','boutique','achat'] },
]

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)

  useEffect(() => { setQuery(q) }, [q])

  const filtered = q
    ? pages.filter(function(p) {
        return p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.keywords.some(function(k) { return k.toLowerCase().includes(q.toLowerCase()) })
      })
    : pages

  const resultCount = filtered.length

  return (
    <>
      <div className="relative mb-8">
        <input type="text" value={query}
          onChange={function(e) { setQuery(e.target.value) }}
          onKeyDown={function(e) {
            if (e.key === 'Enter') {
              var url = '/recherche?q=' + encodeURIComponent(query)
              window.location.href = url
            }
          }}
          placeholder="Rechercher sur NewAppAI..."
          className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg outline-none focus:border-violet-500 transition pl-14" />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {q && (
        <p className="text-slate-400 mb-6">
          {resultCount === 0
            ? 'Aucun resultat pour "' + q + '"'
            : resultCount + ' resultat' + (resultCount > 1 ? 's' : '') + ' pour "' + q + '"'
          }
        </p>
      )}

      <div className="space-y-3">
        {filtered.map(function(p, i) {
          return (
            <Link key={i} href={p.url}
              className="block glass p-5 rounded-2xl hover:bg-white/10 transition border border-white/5 hover:border-violet-500/30 group">
              <h3 className="text-white font-bold text-lg group-hover:text-violet-400 transition">
                {p.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{p.url}</p>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default function RecherchePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent pt-32 pb-20">
        <ParticlesBackground count={15} />
        <div className="max-w-4xl mx-auto px-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
