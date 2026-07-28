// Configuration des apps de test pour la section "Tester les nouveautés"
// Chaque entrée correspond à une mini-app disponible sur /test/[slug]

export interface TestAppConfig {
  name: string
  slug: string  // le slug de l'URL (ex: 'easyreadvoice', 'qrcall', 'chatbot')
  description: string
  color: string // rose, emerald, violet, blue, amber, slate, cyan, yellow, teal
  icon: string  // SVG inline en string
}

export const TEST_APPS: TestAppConfig[] = [
  {
    name: 'EasyReadVoice',
    slug: 'easyreadvoice',
    description: 'Synthèse vocale — testez les voix et écoutez le rendu.',
    color: 'rose',
    icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>',
  },
  {
    name: 'QRcall',
    slug: 'qrcall',
    description: 'Générez un QR code pour appel direct ou vCard.',
    color: 'emerald',
    icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>',
  },
  {
    name: 'Chatbot IA',
    slug: 'chatbot',
    description: 'Assistant conversationnel — testez les réponses et le flux de dialogue.',
    color: 'violet',
    icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>',
  },
  // Les autres apps (Click & Delivery, Gestion Production, Paperasse, etc.) restent avec slug générique
  { name: 'Click & Delivery', slug: '#', description: 'Gestion de commandes et livraisons de proximité.', color: 'blue', icon: '...' },
  { name: 'Gestion Production', slug: '#', description: 'Pilotage de production pour ateliers industriels.', color: 'amber', icon: '...' },
  { name: 'Paperasse', slug: '#', description: 'Automatisation de documents administratifs.', color: 'slate', icon: '...' },
  { name: 'Site Vitrine', slug: '#', description: 'Génération de sites professionnels par IA.', color: 'cyan', icon: '...' },
  { name: 'Talkie Walkie', slug: '#', description: 'Communication instantanée en équipe.', color: 'yellow', icon: '...' },
  { name: 'Sérénité', slug: '#', description: 'Bien-être et suivi au quotidien.', color: 'teal', icon: '...' },
]
