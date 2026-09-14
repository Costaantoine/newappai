interface AIChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIChatResponse {
  message: string
  provider: 'deepseek' | 'gemini'
}

export async function chatWithAI(
  messages: AIChatMessage[],
  provider: 'deepseek' | 'gemini' = 'deepseek'
): Promise<AIChatResponse> {
  if (provider === 'deepseek') {
    return chatWithDeepSeek(messages)
  }
  return chatWithGemini(messages)
}

async function chatWithDeepSeek(messages: AIChatMessage[]): Promise<AIChatResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return { message: 'Clé API DeepSeek non configurée', provider: 'deepseek' }
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Tu es un assistant utile pour NewAppAI, un hub de services multi-services.' },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      message: data.choices?.[0]?.message?.content || 'Pas de réponse',
      provider: 'deepseek',
    }
  } catch (error) {
    console.error('Erreur DeepSeek:', error)
    return { message: 'Erreur de communication avec DeepSeek', provider: 'deepseek' }
  }
}

async function chatWithGemini(messages: AIChatMessage[]): Promise<AIChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { message: 'Clé API Gemini non configurée', provider: 'gemini' }
  }

  try {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      message: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse',
      provider: 'gemini',
    }
  } catch (error) {
    console.error('Erreur Gemini:', error)
    return { message: 'Erreur de communication avec Gemini', provider: 'gemini' }
  }
}
