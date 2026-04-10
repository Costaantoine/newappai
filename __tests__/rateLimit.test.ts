import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, getClientIp } from '../lib/rateLimit'

// Use a unique prefix per test to avoid cross-test pollution
let testCounter = 0
function getPrefix() {
  return `test-${++testCounter}-${Date.now()}`
}

describe('checkRateLimit', () => {
  it('allows requests under the limit', () => {
    const prefix = getPrefix()
    const result = checkRateLimit('192.0.2.1', { limit: 5, windowMs: 60_000, prefix })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks after limit is exceeded', () => {
    const prefix = getPrefix()
    const ip = '192.0.2.2'
    const opts = { limit: 3, windowMs: 60_000, prefix }
    checkRateLimit(ip, opts)
    checkRateLimit(ip, opts)
    checkRateLimit(ip, opts)
    const result = checkRateLimit(ip, opts)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('counts independently per IP', () => {
    const prefix = getPrefix()
    const opts = { limit: 2, windowMs: 60_000, prefix }
    checkRateLimit('10.0.0.1', opts)
    checkRateLimit('10.0.0.1', opts)
    const blocked = checkRateLimit('10.0.0.1', opts)
    const allowed = checkRateLimit('10.0.0.2', opts)
    expect(blocked.allowed).toBe(false)
    expect(allowed.allowed).toBe(true)
  })

  it('returns resetAt timestamp in the future', () => {
    const prefix = getPrefix()
    const before = Date.now()
    const result = checkRateLimit('192.0.2.5', { limit: 5, windowMs: 10_000, prefix })
    expect(result.resetAt).toBeGreaterThan(before)
  })

  it('uses default prefix if not specified', () => {
    const result = checkRateLimit('192.0.2.99', { limit: 10, windowMs: 60_000 })
    expect(result.allowed).toBe(true)
  })
})

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-real-ip': '9.10.11.12' },
    })
    expect(getClientIp(req)).toBe('9.10.11.12')
  })

  it('returns "unknown" if no IP header', () => {
    const req = new Request('https://example.com')
    expect(getClientIp(req)).toBe('unknown')
  })
})
