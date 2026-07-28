import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock iron-session and next/headers
const mockSave = vi.fn()
const mockSession: Record<string, unknown> = {}

vi.mock('iron-session', () => ({
  getIronSession: vi.fn(() => Promise.resolve(mockSession)),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve({})),
}))

// Need ADMIN_PASSWORD set for the route to check passwords
// and SESSION_SECRET for session.ts module to not throw
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test-password-123'
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'a-very-long-secret-that-is-at-least-32-chars'

describe('POST /api/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSession.isAdmin = undefined
    mockSave.mockReset()
    // Re-attach save to the mock session object
    ;(mockSession as any).save = mockSave
  })

  it('rejects request with empty body (400)', async () => {
    const { POST } = await import('@/app/api/auth/route')
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    // @ts-expect-next-line - NextRequest compat
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('rejects request with no password field (400)', async () => {
    const { POST } = await import('@/app/api/auth/route')
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: '' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(400)
  })

  it('rejects wrong password (401)', async () => {
    const { POST } = await import('@/app/api/auth/route')
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(401)
    expect(data.error).toContain('incorrect')
  })

  it('accepts correct password (200)', async () => {
    const { POST } = await import('@/app/api/auth/route')
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-password-123' }),
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('rejects invalid JSON body (400)', async () => {
    const { POST } = await import('@/app/api/auth/route')
    const req = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json-at-all',
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(400)
  })
})
