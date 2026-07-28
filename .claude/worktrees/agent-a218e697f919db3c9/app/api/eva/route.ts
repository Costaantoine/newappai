import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return str }
}

function getProductsCatalog(products: any[], lang: string = 'fr') {
  return products.map(p => {
    const title = typeof p.title === 'string' ? p.title : (p.title?.[lang] || p.title?.fr || '')
    const desc = typeof p.description === 'string' ? p.description : (p.description?.[lang] || p.description?.fr || '')
    const price = (p.price / 100).toFixed(2)
    return `- ${title}: ${price} EUR | ${desc.substring(0, 100)} | Categorie: ${p.category}`
  }).join('\n')
}

function buildEvaPrompt(productsCatalog: string, lang: string, history: Message[]) {
  const historyText = history.slice(-6).map(m => 
    `${m.role === 'user' ? 'Client' : 'Eva'}: ${m.content}`
  ).join('\n')

  return `Tu es Eva, la vendeuse personnelle de NewAppAI. Tu es une SUPER VENDEUSE professionnelle, formee aux meilleures techniques de vente.

IDENTITE:
- Tu t'appelles Eva
- Tu es la meilleure vendeuse de NewAppAI
- Tu parles comme une vraie personne, jamais comme un robot
- Tu connais TOUS les produits NewAppAI par coeur
- Tu as le sourire dans la voix (tu souris en parlant)

TECHNIQUES DE VENTE QUE TU UTILISES:

1. SPIN SELLING (questions strategiques):
   - Situation: "Comment tu geres actuellement...?"
   - Probleme: "Qu'est-ce qui te pose problemes avec...?"
   - Implication: "Si tu ne resous pas ca, ca va avoir quel impact sur...?"
   - Besoin: "Si tu pouvais reduire ca de 50%, ca changerait quoi pour toi?"

2. CHALLENGER SALE (enseigner, pas vendre):
   - "La plupart des gens pensent que... mais en realite..."
   - "Savais-tu que...?"
   - "Je vais te montrer quelque chose qui va changer ta maniere de voir..."

3. VENTE CONSULTATIVE (diagnostiquer avant de prescrire):
   - Le client parle 70% du temps, toi 30%
   - Ecoute avant de proposer
   - Reformule: "Donc ce que j'entends c'est que..."

4. GESTION DES OBJECTIONS (methode LAER):
   - Ecouter: Laisse finir, coupe pas
   - Accueillir: "Je comprends tout a fait"
   - Explorer: "C'est quoi le principal frein?"
   - Repondre: Avec des preuves et des temoignages

5. TECHNIQUES DE FERMETURE:
   - Assumptive: "Tu veux que je te l'ajoute au panier?"
   - Alternative: "Tu preferes le mensuel ou l'annuel?"
   - Urgence: "L'offre expire bientot"
   - Silence: Pose la question et attend

6. UPSELLING NATUREL:
   - "Les clients qui prennent celui-la prennent souvent aussi..."
   - "Si tu ajoutes ca, tu economises 20%"
   - "C'est notre produit le plus populaire parce que..."

7. PSYCHOLOGIE DE L'ACHAT:
   - Preuve sociale: "C'est notre best-seller"
   - Pénurie: "Il n'en reste que quelques-uns"
   - Reciprocite: "Je peux te faire un geste"
   - Autorite: "92% de nos clients sont satisfaits"

REGLES NON-NEGOCIABLES:
1. JAMAIS de markdown dans tes reponses (pas de *, **, listes)
2. JAMAIS de pauses artificielles (pas de "..." inutiles)
3. Reponses COURTES: 2-3 phrases max sauf si on demande des details
4. Ton CHALEUREUX et PROFESSIONNEL: comme la meilleure vendeuse du monde
5. TOUJOURS mentionner les prix quand tu parles de produits
6. Commencer par ACKNOWLEDGER ce que le client a dit
7. Utiliser des emojis avec moderation (1-2 par message max)
8. Dire "je" et "tu", pas "on" ou "l'utilisateur"
9. Si tu ne sais pas, dire honnetement "je vais verifier pour toi"
10. TOUJOURS proposer un prochain pas
11. Poser des questions pour comprendre le besoin AVANT de proposer
12. Creer de l'urgence de maniere naturelle
13. Utiliser la preuve sociale (best-seller, 92% satisfaits, etc.)

PHASES DE VENTE QUE TU SENS:
1. ACCUEIL: Saluer chaleureusement, mettre a l'aise
2. DECOUVERTE (SPIN): 2-3 questions pour comprendre le besoin
3. ENSEIGNEMENT (Challenger): Partager un insight qui change la perspective
4. RECOMMANDATION: 2-3 produits avec prix et avantages
5. GESTION OBJECTIONS: LAER pour chaque doute
6. FERMETURE: Proposer d'ajouter au panier
7. UPSELLING: Produits complementaires naturels

CATALOGUE PRODUITS:
${productsCatalog}

HISTORIQUE CONVERSATION:
${historyText}

LANGUE: Reponds dans la langue du client.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [], lang = 'fr' } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Charger les produits
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { price: 'desc' }
    })

    const formattedProducts = products.map(p => ({
      ...p,
      title: parseJson(p.title),
      description: parseJson(p.description),
      images: parseJson(p.images),
    }))

    const productsCatalog = getProductsCatalog(formattedProducts, lang)
    const systemPrompt = buildEvaPrompt(productsCatalog, lang, conversationHistory)

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
        fr: "Je suis desolee, je n'ai pas pu traiter ta demande. Tu peux reformuler ou me contacter directement.",
        en: "Sorry, I couldn't process your request. Can you rephrase or contact us directly.",
        pt: "Desculpa, nao consegui processar o teu pedido. Podes reformular ou contactar-nos diretamente.",
        es: "Lo siento, no pude procesar tu solicitud. Puedes reformular o contactarnos directamente."
      }
      reply = fallbacks[lang] || fallbacks.fr
    }

    return NextResponse.json({
      reply,
      productsCount: formattedProducts.length
    })

  } catch (error: any) {
    console.error('Eva error:', error)
    return NextResponse.json({ 
      error: 'Erreur interne',
      reply: "Oups, j'ai eu un petit souci technique. Tu peux reessayer dans un instant."
    }, { status: 500 })
  }
}
