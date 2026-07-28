import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEWAPPAI_SUPABASE_URL || ''
const supabaseKey = process.env.NEWAPPAI_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.NEWAPPAI_SUPABASE_SERVICE_KEY || ''

// Client pour le frontend (anon key)
export const supabaseNewappai = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'newappai'
  },
  auth: {
    persistSession: false
  }
})

// Client pour le backend (service role key)
export const supabaseNewappaiAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'newappai'
  },
  auth: {
    persistSession: false
  }
})

export type DatabaseNewappai = {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string
          data: string
          updated_at: string
        }
        Insert: {
          id?: string
          data: string
          updated_at?: string
        }
        Update: {
          id?: string
          data?: string
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
          type: string
          category: string
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
          type?: string
          category?: string
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
          type?: string
          category?: string
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
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          images: string
          category: string
          active: boolean
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          price: number
          images?: string
          category?: string
          active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          images?: string
          category?: string
          active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      zone_cards: {
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
      solutions: {
        Row: {
          id: string
          key: string
          fr: string
          en: string
          pt: string
          es: string
          section: string
          type: string
          category: string
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
          type?: string
          category?: string
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
          type?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          stripe_session_id: string
          product_id: string | null
          amount: number
          status: string
          customer_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_session_id: string
          product_id?: string | null
          amount: number
          status?: string
          customer_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_session_id?: string
          product_id?: string | null
          amount?: number
          status?: string
          customer_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
