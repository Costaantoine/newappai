import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
// @ts-expect-error -- @types/react-dom n'est pas installé dans ce projet
import { renderToStaticMarkup } from 'react-dom/server'
import { existsSync } from 'fs'
import path from 'path'
import SerenityShowcase, { SERENITY_CART_ITEM } from '@/app/produits/serenite/SerenityShowcase'

const nextConfig = require('../next.config.js')

vi.mock('@/components/Header', () => ({ default: () => createElement('nav', { 'data-testid': 'site-header' }) }))
vi.mock('@/lib/cartContext', () => ({ useCart: () => ({ items: [], addItem: () => {} }) }))
vi.mock('@/components/Footer', () => ({ default: () => createElement('footer', { 'data-testid': 'site-footer' }) }))

describe('page produit Serenity (design vitrine-serenity)', () => {
  const html = renderToStaticMarkup(createElement(SerenityShowcase))

  it('affiche le héros et toutes les sections de la vitrine', () => {
    expect(html).toContain('La vie de famille, <em>en plus calme.</em>')
    for (const id of ['accueil', 'modules', 'messages', 'depenses', 'agenda', 'bebe', 'pour-vous', 'essai']) {
      expect(html).toContain(`id="${id}"`)
    }
  })

  it('garde la barre de navigation du site en haut de page', () => {
    expect(html).toContain('data-testid="site-header"')
    expect(html.indexOf('data-testid="site-header"')).toBeLessThan(html.indexOf('class="top"'))
  })

  it('garde le footer du site en bas de page', () => {
    expect(html).toContain('data-testid="site-footer"')
    expect(html.indexOf('data-testid="site-footer"')).toBeGreaterThan(html.indexOf('id="essai"'))
  })

  it('affiche un seul bouton panier, flottant, hors du contenu de la page', () => {
    const boutons = [...html.matchAll(/class="btn btn-panier"/g)]
    expect(boutons.length).toBe(1)
    expect(html).toContain('class="panier flottant"')
    expect(html.indexOf('class="panier flottant"')).toBeGreaterThan(html.indexOf('</main>'))
    expect(html).toContain('Ajouter au panier')
  })

  it('fait défiler les téléphones « Tout au même endroit » en boucle, avec un bouton pause', () => {
    const modules = html.slice(html.indexOf('id="modules"'), html.indexOf('id="messages"'))
    expect(modules).toContain('class="rail"')
    expect((modules.match(/<figure/g) || []).length).toBe(18)
    expect((modules.match(/<figure aria-hidden="true"/g) || []).length).toBe(9)
    expect(modules).toMatch(/<button[^>]*class="btn btn-clair defile-pause"[^>]*aria-pressed="false"/)
    expect(modules).toContain('Pause')
  })

  it('ajoute Serenity au panier avec le prix du catalogue', () => {
    expect(SERENITY_CART_ITEM).toEqual({
      id: '256ecb1e-d92a-469c-91da-24a5215af2ca',
      title: 'Serenity',
      price: 999,
      image: '/images/produits/serenite.webp',
    })
  })

  it("envoie les boutons d'essai vers l'installeur Serenity", () => {
    const essais = html.match(/href="https:\/\/serenity\.newappai\.com\/installer\/\?lang=fr"/g) || []
    expect(essais.length).toBe(3)
    expect((html.match(/Télécharger et essayer gratuitement/g) || []).length).toBe(2)
  })

  it('ne référence que des médias présents dans public/', () => {
    const medias = [...html.matchAll(/(?:src|poster)="(\/produits\/serenite\/[^"]+)"/g)].map((m) => m[1])
    expect(medias.length).toBeGreaterThan(15)
    for (const media of medias) {
      expect(existsSync(path.join(__dirname, '..', 'public', media)), media).toBe(true)
    }
  })

  it("redirige l'ancien slug vers /produits/serenite", async () => {
    const redirects = await nextConfig.redirects()
    expect(redirects).toContainEqual({
      source: '/produits/serenite-communication-apaisee',
      destination: '/produits/serenite',
      permanent: true,
    })
  })
})
