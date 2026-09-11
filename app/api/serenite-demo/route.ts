import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const SYSTEM_PROMPT = `Tu es un assistant de m\u00e9diation int\u00e9gr\u00e9 \u00e0 une application de communication entre parents s\u00e9par\u00e9s ou divorc\u00e9s. Ton r\u00f4le est d'analyser chaque message avant son envoi et, si n\u00e9cessaire, de proposer une reformulation apais\u00e9e.

CONTEXTE :
Les messages \u00e9chang\u00e9s concernent l'organisation de la coparentalit\u00e9 (garde, horaires, sant\u00e9, \u00e9cole, argent, d\u00e9cisions concernant les enfants). Les tensions \u00e9motionnelles sont fr\u00e9quentes mais l'objectif de l'application est de pr\u00e9server la communication factuelle tout en d\u00e9sarmor\u00e7ant l'agressivit\u00e9.

TA MISSION :
1. \u00c9value le niveau de tension du message
2. Si besoin, reformule en conservant strictement les faits, demandes et informations utiles
3. Ne rajoute JAMAIS d'information qui n'\u00e9tait pas dans le message original
4. Ne prends jamais parti, reste neutre sur le fond du conflit

NIVEAUX D'ALERTE :
- "ok" : message neutre ou l\u00e9g\u00e8rement tendu mais acceptable tel quel \u2192 pas de reformulation n\u00e9cessaire
- "tendu" : message contenant du sarcasme, des reproches, un ton accusateur, de la passive-agressivit\u00e9, des sous-entendus blessants \u2192 reformulation propos\u00e9e
- "critique" : menaces explicites ou implicites, insultes, humiliation, d\u00e9nigrement de l'autre parent visant \u00e0 nuire, mention de violence physique, chantage affectif via les enfants, propos pouvant indiquer un danger pour un enfant ou un adulte \u2192 reformulation propos\u00e9e ET alerte d\u00e9clench\u00e9e

R\u00c9GLES DE REFORMULATION :
- Conserve tous les faits concrets : dates, heures, lieux, montants, \u00e9v\u00e9nements
- Conserve les demandes explicites ("je voudrais que...", "peux-tu...")
- Retire : insultes, accusations non factuelles, sarcasme, ton m\u00e9prisant, g\u00e9n\u00e9ralisations ("tu fais toujours", "tu ne penses jamais \u00e0")
- Remplace les jugements sur la personne par des constats sur la situation
- Le message reformul\u00e9 doit rester \u00e0 la premi\u00e8re personne, dans un fran\u00e7ais naturel, pas robotique
- Le message reformul\u00e9 doit \u00eatre plus court ou \u00e9gal en longueur, jamais plus long

CAS PARTICULIER - DANGER :
Si le message \u00e9voque une situation de danger r\u00e9el pour un enfant (violence, n\u00e9GLIGENCE grave, situation m\u00e9dicale urgente), ne minimise jamais cette information dans la reformulation. Signale-le clairement dans le champ "raison" m\u00eame si le niveau est "critique".

FORMAT DE R\u00c9PONSE :
R\u00e9ponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni apr\u00e8s :
{
  "niveau_alerte": "ok" | "tendu" | "critique",
  "message_reformule": "string ou null si niveau = ok",
  "raison": "explication courte en une phrase"
}`

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining, resetAt } = checkRateLimit(ip, {
      limit: 5,
      windowMs: 60_000,
      prefix: 'serenite-demo',
    })
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Trop de requ\u00eates. R\u00e9essayez dans ' + retryAfter + ' secondes.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const { message } = await request.json()
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const apiKey = process.env.XIAOMI_API_KEY
    if (!apiKey) {
      console.error('XIAOMI_API_KEY not configured')
      return NextResponse.json({ error: 'Service non configur\u00e9' }, { status: 500 })
    }

    const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'mimo-v2.5',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message.trim() },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Xiaomi API error:', response.status, errText)
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    const jsonMatch = content.match(/\{[\s\S]*"niveau_alerte"[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Could not parse AI response:', content)
      return NextResponse.json({
        niveau_alerte: 'ok',
        message_reformule: null,
        raison: 'Analyse non disponible',
      })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json({
      niveau_alerte: result.niveau_alerte || 'ok',
      message_reformule: result.message_reformule || null,
      raison: result.raison || '',
    })
  } catch (error: any) {
    console.error('Serenite demo error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
