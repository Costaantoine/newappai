export interface StripeProduct {
  id: string
  name: string
  description: string | null
  images: string[]
  metadata: Record<string, string>
  default_price: string | StripePrice | null
  active: boolean
  created: number
  updated: number
}

export interface StripePrice {
  id: string
  product: string
  unit_amount: number | null
  currency: string
  type: 'one_time' | 'recurring'
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
  } | null
  active: boolean
  metadata: Record<string, string>
}

export interface StripeSession {
  id: string
  object: 'checkout.session'
  amount_total: number | null
  currency: string | null
  customer_email: string | null
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  status: 'open' | 'complete' | 'expired'
  metadata: Record<string, string>
  url: string | null
}

export type StripeWebhookEvent = {
  id: string
  type: string
  data: {
    object: Record<string, unknown>
  }
  created: number
  livemode: boolean
}
