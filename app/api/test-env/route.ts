import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    MERMAID_API_KEY: process.env.MERMAID_API_KEY ? 'set' : 'not set',
    keyLength: process.env.MERMAID_API_KEY?.length || 0
  })
}
