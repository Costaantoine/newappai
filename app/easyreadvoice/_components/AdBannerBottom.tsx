'use client'

interface Advertiser {
  name: string
  description: string
  url: string
  color: string
  icon: string
}

const ADVERTISERS: Advertiser[] = [
  {
    name: 'Digismart',
    description: 'Vos objets connectés, simplifiés',
    url: 'https://digismart.newappai.com',
    color: '#4ade80',
    icon: '📱',
  },
  {
    name: "Pro'Up",
    description: 'Boostez votre activité pro',
    url: 'https://proup.newappai.com',
    color: '#fbbf24',
    icon: '🚀',
  },
]

// Contenu dupliqué pour boucler la bande défilante sans coupure visible
const TRACK_ITEMS = [...ADVERTISERS, ...ADVERTISERS]

export default function AdBannerBottom() {
  return (
    <div className="w-full overflow-hidden py-3" style={{ backgroundColor: '#111827' }}>
      <div className="ad-ticker-track flex items-center gap-20 whitespace-nowrap w-max">
        {TRACK_ITEMS.map((advertiser, i) => (
          <a
            key={`${advertiser.name}-${i}`}
            href={advertiser.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 hover:opacity-80 transition"
          >
            <span className="text-4xl leading-none">{advertiser.icon}</span>
            <span className="flex flex-col">
              <span className="text-xl font-bold" style={{ color: advertiser.color }}>
                {advertiser.name}
              </span>
              <span className="text-base text-white opacity-80">{advertiser.description}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
