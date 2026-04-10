/**
 * Simple in-memory rate limiter (per IP address).
 * Resets window each `windowMs` milliseconds.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key)
  })
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  /** Max requests per window per IP */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
  /** Identifier prefix (e.g. 'auth', 'contact') */
  prefix?: string
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const { limit, windowMs, prefix = 'default' } = options
  const key = `${prefix}:${ip}`
  const now = Date.now()

  let entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  entry.count++
  store.set(key, entry)

  const allowed = entry.count <= limit
  return { allowed, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt }
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
