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
- "tendu" : message contenant du sarcasme, des reproches, un ton accusateur, de la passive-agressivité, des sous-entendus blessants, insultes simples (\"tu es nul\", \"tu es incapable\"), jugements de valeur, dénigrement émotionnel, humiliation verbale SANS menace sous-jacente \\u2192 reformulation proposée
- "critique" : SEULEMENT les cas impliquant un danger réel : menaces de violence physique ou de mort, mention d'armes, enlèvement ou soustraction d'enfants, privation forcée de contact avec les enfants, chantage affectif grave via les enfants, localisation de la victime (\"je sais où tu habites\"), incitation à la violence, propos indiquant un danger pour un enfant ou un adulte \\u2192 reformulation proposée ET alerte déclenchée

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


// ============================================================
// FILET DE SÉCURITÉ DÉTERMINISTE
// Force "critique" quand le message matche un pattern de danger,
// indépendamment du résultat IA. Zéro faux négatif = priorité.
// Tier 1 : un seul pattern → critique
// Tier 2 : 2+ signaux combinés → critique (messages borderline)
// ============================================================
function safetyNetOverride(message: string): 'critique' | null {
  const lower = message.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // ── TIER 1 : pattern unique = critique ──────────────────
  // Violence physique directe
  if (/\bje\s+(?:vais\s+)?(?:te\s+)?(?:tuer|frapper|battre|meurtrir|assassiner|tabasser|violenter)\b/.test(lower)) return 'critique'
  // Menace de mort
  if (/\b(?:tu|on|je\s+vais\s+te\s+faire)\s+(?:vas?\s+)?(?:mourir|crever)\b/.test(lower)) return 'critique'
  // Armes
  if (/\b(?:arme|couteau|pistolet|fusil|b[âa]ton|objet\s*tranchant)\b/.test(lower)) return 'critique'
  if (/\bje\s+(?:vais\s+)?(?:te\s+)?tirer\b/.test(lower)) return 'critique'
  // Enlèvement / prise de force d'enfants
  if (/\benlever\b/.test(lower)) return 'critique'
  if (/\b(?:prendre|emmener|emporter|saisir)\b/.test(lower) && /\bde\s+force\b/.test(lower)) return 'critique'
  if (/\b(?:prendre|emmener|emporter)\b/.test(lower) && /\b(?:les?\s+)?(?:enfant|gamin|goss|bambin)s?\b/.test(lower)) return 'critique'
  // Suppression / destruction
  if (/\bje\s+(?:vais\s+)?(?:te\s+)?supprimer\b/.test(lower)) return 'critique'
  // Incitation à la violence
  if (/\b(?:vas-y|viens)\b.*\btue\b/.test(lower)) return 'critique'
  // Localisation de la victime (élargi)
  if (/\b(?:je\s+)?(?:sais|connais)\s+(?:o[ùu]\s+)?(?:tu|vous)\s+(?:habites?|vives?)\b/.test(lower)) return 'critique'
  if (/\b(?:je\s+)?(?:sais|connais)\s+(?:ton|votre)\s+(?:adresse|r[ée]sidence|maison|logement)\b/.test(lower)) return 'critique'
  // Menace de destruction / privation de garde
  if (/\b(?:je\s+)?(?:vais\s+)?(?:te\s+)?(?:d[ée]truire|an[ée]antir)\b/.test(lower)) return 'critique'
  if (/\b(?:tu\s+)?(?:ne\s+)?(?:garderas?|obtiendras?|auras?)\s+(?:plus\s+)?rien\b/.test(lower)) return 'critique'
  // Porte plainte comme menace de privation
  if (/\bporter?\s+plainte\b/.test(lower)) return 'critique'
  // Présence d'enfants + ne plus voir/revenir = privation de contact
  if (/\b(?:les?\s+)?(?:enfant|gamin|goss|bambin)s?\b/.test(lower) && /\b(?:ne\s+)?(?:reviennent?|verront?|reverras?)\s+(?:plus\s+)?(?:jamais|chez)\b/.test(lower)) return 'critique'
  // "arrête de contacter les enfants" = menace de privation
  if (/\barr[êe]te\s+(?:de\s+)?contacter\b/.test(lower) && /\b(?:les?\s+)?(?:enfant|gamin|goss|bambin)s?\b/.test(lower)) return 'critique'

  // ── TIER 2 : 2+ signaux combinés = critique ────────────
  let tier2 = 0
  if (/\bne\s+(?:les|me|l')\s+(?:reverras?|reviennent?|verront?)\s+(?:plus\s+)?(?:jamais|chez)\b/.test(lower)) tier2++
  if (/\b(?:je\s+)?(?:vais\s+)?te\s+retrouver\b/.test(lower)) tier2++
  if (/\b(?:vas?\s+)?(?:regretter|paieras?|payer\s+ce)\b/.test(lower)) tier2++
  if (/\b(?:je\s+)?(?:vais\s+)?(?:passer|venir)\s+(?:te\s+)?(?:chercher|reprendre)\b/.test(lower)) tier2++
  if (tier2 >= 2) return 'critique'

  return null
}

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
        temperature: 0,
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
    let niveau = 'ok'
    let messageReformule = null
    let raison = 'Analyse non disponible'

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      niveau = result.niveau_alerte || 'ok'
      messageReformule = result.message_reformule || null
      raison = result.raison || ''
    } else {
      console.error('Could not parse AI response:', content)
    }

    // Filet de sécurité déterministe : force "critique" si le message
    // matche un pattern de danger, QUE L'AI AIT RÉUSSI OU NON
    const override = safetyNetOverride(message)
    if (override) {
      niveau = override
      // Masquer la reformulation pour les messages critiques
      messageReformule = null
    }

    return NextResponse.json({
      niveau_alerte: niveau,
      message_reformule: messageReformule,
      raison: raison,
    })
  } catch (error: any) {
    console.error('Serenite demo error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
