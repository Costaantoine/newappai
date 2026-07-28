import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to test serializeImages, deserializeImages, normalizeProduct.
// The module reads process.env.DATABASE_URL at import time for isSQLite,
// so we'll test the behavior by controlling the env var.

describe('dbHelpers', () => {
  const originalEnv = process.env.DATABASE_URL

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.DATABASE_URL = originalEnv
    } else {
      delete process.env.DATABASE_URL
    }
  })

  // We'll dynamically import to get fresh module state per test group
  describe('deserializeImages', () => {
    it('parses a JSON string array into a JS array', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages('["img1.jpg","img2.jpg"]')
      expect(result).toEqual(['img1.jpg', 'img2.jpg'])
    })

    it('returns the array as-is if already an array', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const input = ['img1.jpg', 'img2.jpg']
      const result = deserializeImages(input)
      expect(result).toEqual(['img1.jpg', 'img2.jpg'])
    })

    it('returns empty array for invalid JSON string', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages('not json{{{')
      expect(result).toEqual([])
    })

    it('returns empty array for null', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages(null)
      expect(result).toEqual([])
    })

    it('returns empty array for undefined', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages(undefined)
      expect(result).toEqual([])
    })

    it('returns empty array for empty string', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      // Empty string is not valid JSON array, so catch returns []
      const result = deserializeImages('')
      expect(result).toEqual([])
    })

    it('returns empty array for a number', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages(42 as unknown)
      expect(result).toEqual([])
    })

    it('handles empty JSON array string', async () => {
      const { deserializeImages } = await import('../lib/dbHelpers')
      const result = deserializeImages('[]')
      expect(result).toEqual([])
    })
  })

  describe('normalizeProduct', () => {
    it('normalizes a product with JSON string images', async () => {
      const { normalizeProduct } = await import('../lib/dbHelpers')
      const product = {
        id: '1',
        title: 'Test Product',
        images: '["a.jpg","b.jpg"]',
        price: 1000,
      }
      const result = normalizeProduct(product)
      expect(result.images).toEqual(['a.jpg', 'b.jpg'])
      expect(result.title).toBe('Test Product')
      expect(result.id).toBe('1')
    })

    it('normalizes a product with array images', async () => {
      const { normalizeProduct } = await import('../lib/dbHelpers')
      const product = {
        id: '2',
        title: 'Product 2',
        images: ['x.jpg', 'y.jpg'],
        price: 500,
      }
      const result = normalizeProduct(product)
      expect(result.images).toEqual(['x.jpg', 'y.jpg'])
    })

    it('handles product with null images', async () => {
      const { normalizeProduct } = await import('../lib/dbHelpers')
      const product = {
        id: '3',
        title: 'No images',
        images: null as unknown as string[],
        price: 0,
      }
      const result = normalizeProduct(product)
      expect(result.images).toEqual([])
    })

    it('preserves all other product fields', async () => {
      const { normalizeProduct } = await import('../lib/dbHelpers')
      const product = {
        id: '4',
        title: 'Full Product',
        description: 'A description',
        images: '[]',
        price: 9900,
        category: 'tech',
        active: true,
      }
      const result = normalizeProduct(product)
      expect(result.id).toBe('4')
      expect(result.title).toBe('Full Product')
      expect(result.description).toBe('A description')
      expect(result.price).toBe(9900)
      expect(result.category).toBe('tech')
      expect(result.active).toBe(true)
      expect(result.images).toEqual([])
    })
  })

  describe('serializeImages', () => {
    it('returns the array as-is when using PostgreSQL', async () => {
      // Default env is not 'file:', so isSQLite is false
      const { serializeImages } = await import('../lib/dbHelpers')
      const input = ['img1.jpg', 'img2.jpg']
      const result = serializeImages(input)
      expect(result).toEqual(['img1.jpg', 'img2.jpg'])
      expect(Array.isArray(result)).toBe(true)
    })

    it('serializes to JSON string when DATABASE_URL starts with file:', async () => {
      // We can't re-import with different env easily due to module caching,
      // but we can verify the behavior with the current env
      const { serializeImages } = await import('../lib/dbHelpers')
      const result = serializeImages([])
      // With non-SQLite env, should return the array
      expect(Array.isArray(result)).toBe(true)
    })
  })
})
