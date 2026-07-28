import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY manquant - les fonctionnalités IA seront désactivées')
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export async function createAssistantMessage(
  message: string,
  assistantId?: string
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI non configuré')
  }

  const thread = await openai.beta.threads.create()
  
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: message,
  })

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId || process.env.OPENAI_ASSISTANT_ID || 'asst_default',
  })

  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data[0]
    if (lastMessage.content[0].type === 'text') {
      return lastMessage.content[0].text.value
    }
  }

  return 'Désolé, je n\'ai pas pu traiter votre demande.'
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI non configuré')
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es un traducteur professionnel. Traduis le texte suivant en ${targetLang}. Réponds uniquement avec la traduction, sans commentaire.`,
      },
      { role: 'user', content: text },
    ],
    temperature: 0.3,
  })

  return response.choices[0]?.message?.content || text
}

export async function textToSpeech(text: string): Promise<Buffer | null> {
  if (!openai) {
    throw new Error('OpenAI non configuré')
  }

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  })

  const buffer = Buffer.from(await response.arrayBuffer())
  return buffer
}
