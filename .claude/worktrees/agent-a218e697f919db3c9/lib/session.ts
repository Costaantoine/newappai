import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAdmin: boolean
}

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET manquant - définir dans .env')
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'newappai_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session.isAdmin) {
    return false
  }
  return true
}
