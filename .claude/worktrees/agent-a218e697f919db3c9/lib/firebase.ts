// Types conservés pour compatibilité (Firebase supprimé, remplacé par PostgreSQL/Prisma)

export type Product = {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  active: boolean
  created_at: string
  updated_at: string
}

export type Settings = {
  id?: string
  hero_image_url: string
  hero_opacity: number
  hero_brightness: number
  hero_overlay_opacity: number
  hero_title: string
  hero_subtitle1: string
  hero_subtitle2: string
  music: {
    accueil: { url: string; volume: number }
    solutions: { url: string; volume: number }
    histoire: { url: string; volume: number }
    produits: { url: string; volume: number }
    contact: { url: string; volume: number }
  }
  sound_hover_enabled: boolean
  sound_click_enabled: boolean
  sound_hover_url: string
  sound_click_url: string
}
