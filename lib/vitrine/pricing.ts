/**
 * SOURCE DE VÉRITÉ UNIQUE DES PRIX — Offres de l'outil vitrine / Web Design.
 *
 * Stratégie commerciale (décision Antoine, appliquée le 15/08) :
 *   - DÉCOUVERTE (one-shot)  : 149€      (fourchette décidée 99-149€, défaut retenu 149€)
 *   - AUTO-GÉRÉ (abonnement) : 29€/mois  (fourchette 19-39€)
 *   - PREMIUM (abonnement)   : 79€/mois  (fourchette 59-99€)
 *
 * IMPORTANT V1 : comptes clients / éditeur / abonnements sont POST-V1 (pas encore
 * construits). Le SEUL paiement encaissable aujourd'hui est l'offre DÉCOUVERTE
 * (one-shot) ; les deux offres par abonnement sont affichées « Bientôt disponible ».
 *
 * CHANGER UN PRIX = MODIFIER CE FICHIER UNIQUEMENT.
 */

export const DECOUVERTE_PRICE_CENTS = 14900 // 149€ one-shot (anciennement 19900)
export const AUTO_GERE_MONTHLY_CENTS = 2900 // 29€/mois
export const PREMIUM_MONTHLY_CENTS = 7900 // 79€/mois

export interface Offer {
  id: 'decouverte' | 'auto-gere' | 'premium'
  name: string
  priceLabel: string
  period: 'one-shot' | 'abonnement'
  features: string[]
  available: boolean
}

export const OFFERS: Offer[] = [
  {
    id: 'decouverte',
    name: 'Découverte',
    priceLabel: '149€',
    period: 'one-shot',
    features: [
      'Site vitrine one-page généré',
      '1 an d\'hébergement inclus',
      'Mise en ligne incluse',
      'Modifications limitées',
    ],
    available: true,
  },
  {
    id: 'auto-gere',
    name: 'Auto-Géré',
    priceLabel: '29€/mois',
    period: 'abonnement',
    features: [
      'Éditeur click-to-edit illimité',
      'Versions et historique',
      'Modules : contact, WhatsApp, statistiques',
    ],
    available: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceLabel: '79€/mois',
    period: 'abonnement',
    features: [
      'Tout Auto-Géré inclus',
      'Modules métier : réservation, paiement',
      'Site multi-pages',
      'Modifications par langage naturel',
      'Support prioritaire',
    ],
    available: false,
  },
]
