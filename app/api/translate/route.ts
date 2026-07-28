import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!process.env.DEEPSEEK_API_KEY && process.env.NODE_ENV === 'production') {
      console.error('DEEPSEEK_API_KEY not configured')
    }

    // Utiliser FreeLLM API (newPC) qui aggregate 65+ modèles et 22 providers
    const url = process.env.FREELLM_API_URL || 'http://100.101.125.48:3001/v1/chat/completions'
    const freeLlmKey = process.env.FREELLM_API_KEY || ''
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(freeLlmKey ? { 'Authorization': `Bearer ${freeLlmKey}` } : {})
      },
      body: JSON.stringify({ model: 'deepseek-v4-flash',
        messages: [
          {
            role: 'system',
            content: 'Tu es un traducteur professionnel. Traduis le texte français fourni en anglais (EN), portugais (PT) et espagnol (ES). ' +
              'Réponds UNIQUEMENT au format JSON: {"en": "...", "pt": "...", "es": "..."}. ' +
              'Garde les termes techniques, noms de marques et sigles inchangés. ' +
              'Si le texte contient des placeholders comme {company} ou {email}, garde-les tels quels dans la traduction.'
          },
          {
            role: 'user',
            content: `Texte à traduire: "${text}"\n\nRéponds UNIQUEMENT au format JSON: {"en": "...", "pt": "...", "es": "..."}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepSeek API error:', response.status, errText)
      return NextResponse.json({ error: `Erreur API: ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*"en"[\s\S]*"pt"[\s\S]*"es"[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Could not parse translation response:', content)
      return NextResponse.json({ error: 'Format de réponse invalide' }, { status: 502 })
    }

    const translations = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      fr: text,
      en: translations.en || text,
      pt: translations.pt || text,
      es: translations.es || text,
    })

  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
