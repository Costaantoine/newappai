import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const token = crypto.randomBytes(32).toString('hex')
  return NextResponse.json({ token })
}
