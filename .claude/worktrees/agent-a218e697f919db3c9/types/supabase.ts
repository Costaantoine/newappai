export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description?: string
          price: number
          images?: string[]
          category?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          images?: string[]
          category?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      solutions: {
        Row: {
          id: string
          key: string
          fr: string
          en: string
          pt: string
          es: string
          icon: string
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          fr: string
          en?: string
          pt?: string
          es?: string
          icon?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          fr?: string
          en?: string
          pt?: string
          es?: string
          icon?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          productId: string
          quantity: number
          customerEmail: string
          customerName: string
          status: string
          stripeSessionId: string | null
          total: number
          metadata: Json
          paidAt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          productId: string
          quantity?: number
          customerEmail: string
          customerName: string
          status?: string
          stripeSessionId?: string | null
          total: number
          metadata?: Json
          paidAt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          productId?: string
          quantity?: number
          customerEmail?: string
          customerName?: string
          status?: string
          stripeSessionId?: string | null
          total?: number
          metadata?: Json
          paidAt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          zone_id: string
          title_key: string
          description_key: string
          badge_key: string
          image_url: string
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_id: string
          title_key: string
          description_key?: string
          badge_key?: string
          image_url?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          zone_id?: string
          title_key?: string
          description_key?: string
          badge_key?: string
          image_url?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      texts: {
        Row: {
          id: string
          key: string
          fr: string
          en: string
          pt: string
          es: string
          section: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          fr: string
          en?: string
          pt?: string
          es?: string
          section?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          fr?: string
          en?: string
          pt?: string
          es?: string
          section?: string
          created_at?: string
          updated_at?: string
        }
      }
      zones: {
        Row: {
          id: string
          key: string
          title_key: string
          subtitle_key: string
          badge: string
          color: string
          url: string
          cta_key: string
          newtab_key: string
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          title_key: string
          subtitle_key?: string
          badge?: string
          color?: string
          url?: string
          cta_key?: string
          newtab_key?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          title_key?: string
          subtitle_key?: string
          badge?: string
          color?: string
          url?: string
          cta_key?: string
          newtab_key?: string
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
