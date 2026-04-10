import { NextRequest, NextResponse } from 'next/server'
import { getProductsContext, buildSystemPrompt, detectContactIntent } from '@/lib/assistantContext'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  let lang: 'fr' | 'en' = 'fr'
  
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body
    lang = body.lang || 'fr'

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const productsContext = await getProductsContext()
    const systemPrompt = buildSystemPrompt(productsContext, lang)

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((m: Message) => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    let reply: string = ''
    let usedProvider: string = ''

    // Try Groq first (fastest, free)
    if (process.env.GROQ_API_KEY) {
      try {
        reply = await callGroq(messages, process.env.GROQ_API_KEY)
        usedProvider = 'Groq'
      } catch (error) {
        console.error('Groq failed, trying next provider:', error)
      }
    }

    // Try Gemini if Groq failed
    if (!reply && process.env.GEMINI_API_KEY) {
      try {
        reply = await callGemini(messages, process.env.GEMINI_API_KEY)
        usedProvider = 'Gemini'
      } catch (error) {
        console.error('Gemini failed, trying next provider:', error)
      }
    }

    // Try Mercury if others failed
    if (!reply && process.env.MERMAID_API_KEY) {
      console.log('Trying Mercury API...')
      try {
        reply = await callMercury(messages, process.env.MERMAID_API_KEY)
        usedProvider = 'Mercury'
        console.log('Mercury success!')
      } catch (error) {
        console.error('Mercury failed:', error)
      }
    }

    // If still no reply, return fallback
    if (!reply) {
      const fallbackReply = lang === 'fr' 
        ? "Je suis désolé, le service d'assistance n'est pas configuré. Veuillez nous contacter via le formulaire de contact."
        : "I'm sorry, the assistance service is not configured. Please contact us via the contact form."
      
      return NextResponse.json({
        reply: fallbackReply,
        suggestContact: true,
        prefillData: detectContactIntent(message, lang)
      })
    }

    const contactData = detectContactIntent(message, lang)

    return NextResponse.json({
      reply,
      provider: usedProvider,
      suggestContact: contactData.suggestContact,
      prefillData: contactData.suggestContact ? {
        subject: contactData.subject,
        message: contactData.messageSummary
      } : null
    })
  } catch (error) {
    console.error('Assistant API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      reply: lang === 'fr' 
        ? "Une erreur s'est produite. Veuillez réessayer ou utiliser le formulaire de contact."
        : "An error occurred. Please try again or use the contact form."
    }, { status: 500 })
  }
}

async function callGroq(messages: Message[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'Pas de réponse'
}

async function callGemini(messages: Message[], apiKey: string): Promise<string> {
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }))

  const systemInstruction = messages.find(m => m.role === 'system')?.content || ''

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse'
}

async function callMercury(messages: Message[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.mercury.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mercury-2',
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Mercury API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'Pas de réponse'
}
