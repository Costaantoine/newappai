export interface Plan {
  id: string
  name: string
  price: number
  priceLabel: string
  maxChars: number
  desc: string
}

export const UPLOAD_PLANS: Plan[] = [
  { id: 'decouverte', name: 'Découverte', price: 1.99, priceLabel: '1.99 €', maxChars: 5_000, desc: "Jusqu'à 5 000 caractères" },
  { id: 'essentiel', name: 'Essentiel', price: 4.99, priceLabel: '4.99 €', maxChars: 25_000, desc: "Jusqu'à 25 000 caractères" },
  { id: 'standard', name: 'Standard', price: 9.99, priceLabel: '9.99 €', maxChars: 100_000, desc: "Jusqu'à 100 000 caractères" },
  { id: 'integral', name: 'Intégral', price: 19.99, priceLabel: '19.99 €', maxChars: 500_000, desc: "Jusqu'à 500 000 caractères" },
]
