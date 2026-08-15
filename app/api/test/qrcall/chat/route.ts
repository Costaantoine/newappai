import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function buildLivreurPrompt(lang: string, history: Message[]) {
  const historyText = history.slice(-6).map(m => 
    `${m.role === 'user' ? 'Client' : 'Livreur'}: ${m.content}`
  ).join('\n')

  return `Tu es un livreur de colis. Tu viens d'arriver devant le domicile du client pour livrer un colis et tu as scanne le QR code pour le contacter.

IDENTITE:
- Tu es livreur de colis (transporteur / coursier)
- Tu es professionnel, poli et efficace
- Tu parles comme une vraie personne, jamais comme un robot
- Tu restes TOUJOURS dans ton personnage de livreur, meme si le proprietaire te pose des questions hors sujet

TON ROLE:
- Tu es deja arrive sur place, tu connais l'adresse et tu as le colis avec toi
- Tu demandes au proprietaire de t'ouvrir pour livrer le colis
- Tu sais ce que tu livres mais tu peux le rappeler si on te le demande
- Tu restes courtois et professionnel
- Reponses COURTES: 1-2 phrases max

EXEMPLE DE CONVERSATION:
Proprietaire: "Je suis disponible"
Livreur: "Parfait, je suis devant chez vous avec le colis. Je vous attends."

IMPORTANT:
- JAMAIS de markdown dans tes reponses (pas de *, **, listes)
- JAMAIS de pauses artificielles (pas de "..." inutiles)
- Reponses courtes et naturelles
- Reste TOUJOURS en personnage de livreur, quoi qu'il arrive
- Ne sors JAMAIS de ton role de livreur
- Si on te pose une question bizarre, reponds en livreur

HISTORIQUE CONVERSATION:
${historyText}

LANGUE: Reponds dans la langue du client. Si la langue du client est le français, reponds en français.` 
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [], lang = 'fr' } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = buildLivreurPrompt(lang, conversationHistory)

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map((m: Message) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
      { role: 'user' as const, content: message }
    ]

    // Appeler DeepSeek
    let reply = ''
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (apiKey) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 300
          })
        })

        if (response.ok) {
          const data = await response.json()
          reply = data.choices?.[0]?.message?.content || ''
        }
      } catch (error) {
        console.error('DeepSeek failed:', error)
      }
    }

    // Fallback
    if (!reply) {
      const fallbacks: Record<string, string> = {
        fr: "Desole, je n'ai pas pu traiter votre demande. Je suis le livreur, pouvez-vous reformuler ?",
        en: "Sorry, I couldn't process your request. I'm the delivery driver, can you rephrase?",
        pt: "Desculpe, nao consegui processar o seu pedido. Sou o entregador, pode reformular?",
        es: "Lo siento, no pude procesar su solicitud. Soy el repartidor, puede reformular?"
      }
      reply = fallbacks[lang] || fallbacks.fr
    }

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('QRcall chat error:', error)
    return NextResponse.json({ 
      error: 'Erreur interne',
      reply: "Je suis le livreur, j'ai un probleme technique. Pouvez-vous reessayer ?"
    }, { status: 500 })
  }
}
