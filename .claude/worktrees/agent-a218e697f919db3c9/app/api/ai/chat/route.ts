import { NextRequest, NextResponse } from 'next/server'
import { chatWithAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { messages, provider } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 })
    }

    const response = await chatWithAI(messages, provider || 'deepseek')
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur chat IA:', error)
    return NextResponse.json({ error: 'Erreur lors de la communication avec l\'IA' }, { status: 500 })
  }
}
