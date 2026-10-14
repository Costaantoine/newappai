import type { Metadata } from 'next'
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from 'next/font/google'
import SerenityShowcase from './SerenityShowcase'
import './serenity.css'

// Route dédiée : elle prend le pas sur /produits/[slug] pour Serenity.
// Design repris de vitrine-serenity.newappai.com.

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  variable: '--sv-font-display',
})

const texte = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--sv-font-texte',
})

const TITLE = 'Serenity — la vie de famille, en plus calme'
const DESCRIPTION = 'Serenity réunit l’agenda, les messages, les dépenses, le suivi de bébé et tous les papiers de la famille dans une seule application. Ses messages apaisés aident à se parler sans s’emporter.'
const CANONICAL = 'https://newappai.com/produits/serenite'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: 'Agenda partagé, messages apaisés, dépenses claires, suivi de bébé : toute la famille au même endroit.',
    url: CANONICAL,
    images: [{ url: 'https://newappai.com/produits/serenite/shots/m-cnv.webp' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  return <SerenityShowcase className={`${display.variable} ${texte.variable}`} />
}
