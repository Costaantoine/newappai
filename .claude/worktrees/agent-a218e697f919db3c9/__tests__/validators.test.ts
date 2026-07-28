import { describe, it, expect } from 'vitest'
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateTextSchema,
  CreateZoneSchema,
  CreateZoneCardSchema,
  CreateSolutionSchema,
  LoginSchema,
  ContactSchema,
  formatZodError,
} from '../lib/validators'

// ─── Products ────────────────────────────────────────────────────────────────

describe('CreateProductSchema', () => {
  it('validates a valid product', () => {
    const result = CreateProductSchema.safeParse({
      title: 'Mon Produit',
      price: 9900,
    })
    expect(result.success).toBe(true)
  })

  it('applies defaults for optional fields', () => {
    const result = CreateProductSchema.safeParse({ title: 'Test', price: 0 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBe('')
      expect(result.data.images).toEqual([])
      expect(result.data.active).toBe(true)
    }
  })

  it('rejects missing title', () => {
    const result = CreateProductSchema.safeParse({ price: 100 })
    expect(result.success).toBe(false)
  })

  it('rejects missing price', () => {
    const result = CreateProductSchema.safeParse({ title: 'Test' })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = CreateProductSchema.safeParse({ title: 'Test', price: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer price', () => {
    const result = CreateProductSchema.safeParse({ title: 'Test', price: 9.99 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid image URL', () => {
    const result = CreateProductSchema.safeParse({
      title: 'Test',
      price: 100,
      images: ['not-a-url'],
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid image URLs', () => {
    const result = CreateProductSchema.safeParse({
      title: 'Test',
      price: 100,
      images: ['https://files.catbox.moe/image.webp'],
    })
    expect(result.success).toBe(true)
  })
})

describe('UpdateProductSchema', () => {
  it('accepts partial updates', () => {
    const result = UpdateProductSchema.safeParse({ title: 'New title' })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = UpdateProductSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})

// ─── Texts ───────────────────────────────────────────────────────────────────

describe('CreateTextSchema', () => {
  it('validates a valid text entry', () => {
    const result = CreateTextSchema.safeParse({ key: 'hero_title', fr: 'Bienvenue' })
    expect(result.success).toBe(true)
  })

  it('rejects uppercase in key', () => {
    const result = CreateTextSchema.safeParse({ key: 'Hero_Title', fr: 'Test' })
    expect(result.success).toBe(false)
  })

  it('rejects spaces in key', () => {
    const result = CreateTextSchema.safeParse({ key: 'hero title', fr: 'Test' })
    expect(result.success).toBe(false)
  })

  it('rejects missing fr', () => {
    const result = CreateTextSchema.safeParse({ key: 'test_key' })
    expect(result.success).toBe(false)
  })
})

// ─── Zones ───────────────────────────────────────────────────────────────────

describe('CreateZoneSchema', () => {
  it('validates a valid zone', () => {
    const result = CreateZoneSchema.safeParse({ key: 'tech', title_key: 'zone_tech_title' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid color', () => {
    const result = CreateZoneSchema.safeParse({
      key: 'tech',
      title_key: 'zone_tech_title',
      color: 'hotpink',
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid colors', () => {
    const validColors = ['sky', 'purple', 'emerald', 'orange', 'rose', 'indigo', 'amber', 'teal', 'cyan', 'violet'] as const
    for (const color of validColors) {
      const result = CreateZoneSchema.safeParse({ key: 'test', title_key: 'test_key', color })
      expect(result.success).toBe(true)
    }
  })
})

// ─── ZoneCards ────────────────────────────────────────────────────────────────

describe('CreateZoneCardSchema', () => {
  it('validates a valid zone card', () => {
    const result = CreateZoneCardSchema.safeParse({
      zone_id: '550e8400-e29b-41d4-a716-446655440000',
      title_key: 'card_title',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid UUID for zone_id', () => {
    const result = CreateZoneCardSchema.safeParse({ zone_id: 'not-a-uuid', title_key: 'test' })
    expect(result.success).toBe(false)
  })
})

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('LoginSchema', () => {
  it('validates a valid password', () => {
    const result = LoginSchema.safeParse({ password: 'mypassword123' })
    expect(result.success).toBe(true)
  })

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({ password: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing password field', () => {
    const result = LoginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

// ─── Contact ──────────────────────────────────────────────────────────────────

describe('ContactSchema', () => {
  it('validates a valid contact form', () => {
    const result = ContactSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Question commerciale',
      message: 'Bonjour, je souhaite obtenir des informations.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = ContactSchema.safeParse({
      name: 'Jean',
      email: 'pas-un-email',
      subject: 'Test',
      message: 'Message suffisamment long.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short message', () => {
    const result = ContactSchema.safeParse({
      name: 'Jean',
      email: 'jean@example.com',
      subject: 'Test',
      message: 'Court',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short name', () => {
    const result = ContactSchema.safeParse({
      name: 'J',
      email: 'jean@example.com',
      subject: 'Test',
      message: 'Message suffisamment long pour passer la validation.',
    })
    expect(result.success).toBe(false)
  })
})

// ─── formatZodError ───────────────────────────────────────────────────────────

describe('formatZodError', () => {
  it('formats a zod error as a readable string', () => {
    const result = CreateProductSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const msg = formatZodError(result.error)
      expect(typeof msg).toBe('string')
      expect(msg.length).toBeGreaterThan(0)
      expect(msg).toContain(':')
    }
  })
})
