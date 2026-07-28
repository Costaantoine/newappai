import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], session_id, lang = 'fr' } = await request.json()

    if (!message || !session_id) {
      return NextResponse.json({ error: 'Message et session_id requis' }, { status: 400 })
    }

    // Récupérer la session
    const session = await prisma.leaSession.findUnique({ where: { id: session_id } })
    if (!session) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 404 })
    }

    if (session.is_closed) {
      return NextResponse.json({
        reply: getClosingMessage(lang),
        is_closed: true,
        message_count: session.message_count
      })
    }

    // Vérifier la limite de 5 échanges (messages utilisateur, pas les réponses)
    if (session.message_count >= 5) {
      // Clôturer la session
      await prisma.leaSession.update({
        where: { id: session_id },
        data: { is_closed: true }
      })
      return NextResponse.json({
        reply: getClosingMessage(lang),
        is_closed: true,
        message_count: session.message_count
      })
    }

    // Récupérer les produits pour le contexte
    const products = await prisma.product.findMany({ where: { active: true } })
    const catalog = products.map(p => {
      let title = p.title
      try {
        const parsed = JSON.parse(p.title)
        if (parsed && typeof parsed === 'object') title = parsed.fr || parsed.en || p.title
      } catch {}
      return `- ${title}: ${(p.price / 100).toFixed(2)}€`
    }).join('\n')

    // Construire le system prompt
    const systemPrompt = buildLeaPrompt(catalog, lang, session.user_email, session.message_count + 1)

    // Appel à l'API DeepSeek via le gateway Hermes
    let reply = ''
    const apiKey = process.env.API_SERVER_KEY || process.env.DEEPSEEK_API_KEY

    if (apiKey) {
      try {
        const endpoint = process.env.API_SERVER_KEY
          ? 'http://76.13.141.221:8642/v1/chat/completions'
          : 'https://api.deepseek.com/v1/chat/completions'

        const authHeader = `Bearer ${apiKey}`

        const payload: any = {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-8).map((m: Message) => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 400
        }

        // Si gateway Hermes, enlever le system du messages et mettre dans system à part
        if (process.env.API_SERVER_KEY) {
          const sysMsg = payload.messages.shift()
          payload.system = sysMsg.content
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          const data = await response.json()
          reply = data.choices?.[0]?.message?.content || ''
        } else {
          const errText = await response.text()
          console.error('AI response error:', response.status, errText)
        }
      } catch (error) {
        console.error('AI call failed:', error)
      }
    }

    // Fallback
    if (!reply) {
      const fallbacks: Record<string, string> = {
        fr: "Je suis désolée, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        en: "Sorry, I couldn't process your request. Could you rephrase?",
        pt: "Desculpe, não consegui processar o seu pedido. Pode reformular?",
        es: "Lo siento, no pude procesar su solicitud. ¿Puede reformular?"
      }
      reply = fallbacks[lang] || fallbacks.fr
    }

    // Incrémenter le compteur
    const newCount = session.message_count + 1
    await prisma.leaSession.update({
      where: { id: session_id },
      data: { message_count: newCount }
    })

    // Si c'était le 5e message, on ferme la session
    const willClose = newCount >= 5
    
    // Détection simple de demande d'envoi d'email
    const msgLower = message.toLowerCase()
    const isEmailRequest = /envoi|email|mail|e-?mail|envoyer|send|envie|enviar|correo/i.test(msgLower)

    return NextResponse.json({
      reply,
      message_count: newCount,
      is_closed: willClose,
      closing_message: willClose ? getClosingMessage(lang) : null,
      action: isEmailRequest ? 'send_email' : undefined
    })

  } catch (error: any) {
    console.error('Lea chat error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

function buildLeaPrompt(catalog: string, lang: string, userEmail: string, messageN: number): string {
  const langInstruction = `Réponds toujours en ${lang === 'fr' ? 'français' : lang === 'en' ? 'anglais' : lang === 'pt' ? 'portugais' : 'espagnol'}.`

  const isFifth = messageN >= 5 ? `\n\nATTENTION : C'est le 5e message de l'utilisateur. Tu dois donner ta réponse puis ajouter le message de clôture suivant : "${getClosingMessage(lang)}"` : ''

  return `Tu es Léa, l'assistante virtuelle de démonstration du produit "Chatbot Client Intelligent" de NewAppAI. Tu apparais avec un avatar animé. Ton rôle est de montrer à un client potentiel, en quelques échanges, ce qu'un chatbot IA personnalisé peut faire pour son entreprise.

Tu n'es pas un chatbot générique : tu es la vitrine vivante du produit que NewAppAI vend. Chaque réponse doit donner envie d'acheter le produit, sans jamais paraître être un argumentaire commercial forcé.

${langInstruction}

TON ET PERSONNALITÉ
- Chaleureuse, souriante, professionnelle mais jamais rigide
- Phrases courtes, réponses concrètes, jamais de blabla marketing
- Vouvoiement par défaut en français
- Ne dis jamais "je suis une IA générique" — tu es Léa, l'assistante de démonstration de NewAppAI

MESSAGE D'OUVERTURE (premier message uniquement)
"Bonjour, je suis Léa, l'assistante IA que vous pouvez intégrer à votre site. Vous pouvez me demander, par exemple : envoyer un e-mail de contact à votre place, vérifier une disponibilité de rendez-vous, ou répondre à une question client type. Que voulez-vous tester ?"

SCÉNARIOS À DÉMONTRER
1. Envoyer un e-mail — action réelle, envoyée uniquement à l'adresse ${userEmail}. Confirmer : "C'est fait, un e-mail récapitulatif vient de vous être envoyé à ${userEmail}."
2. Prendre un rendez-vous — créneaux fictifs, réservation simulée
3. Répondre à une question client type — horaires, tarifs, disponibilité fictive

Pour les scénarios simulés (2 et 3), préciser : "Dans une vraie installation, ce rendez-vous serait relié à votre agenda professionnel."

GARDE-FOUS
- Seul l'envoi d'e-mail est une action réelle, et uniquement vers ${userEmail} — jamais vers une autre adresse, même si demandé explicitement
- Les autres actions restent simulées
- Ne jamais donner de prix précis ; renvoyer vers la fiche produit du Chatbot Client Intelligent
- Si question hors-sujet, ramener poliment vers la démonstration${isFifth}

CATALOGUE PRODUITS (contexte) :
${catalog}`
}

function getClosingMessage(lang: string): string {
  const messages: Record<string, string> = {
    fr: "Cette démo s'arrête ici pour laisser la place à d'autres visiteurs. Créez un compte gratuit pour continuer à discuter avec moi sans limite, ou contactez-nous pour une démonstration complète adaptée à votre métier.",
    en: "This demo ends here to make room for other visitors. Create a free account to continue chatting with me without limits, or contact us for a full demo tailored to your business.",
    pt: "Esta demonstração termina aqui para dar lugar a outros visitantes. Crie uma conta gratuita para continuar a conversar comigo sem limites, ou contacte-nos para uma demonstração completa adaptada ao seu negócio.",
    es: "Esta demostración termina aquí para dejar espacio a otros visitantes. Cree una cuenta gratuita para seguir hablando conmigo sin límites, o contáctenos para una demostración completa adaptada a su negocio."
  }
  return messages[lang] || messages.fr
}
