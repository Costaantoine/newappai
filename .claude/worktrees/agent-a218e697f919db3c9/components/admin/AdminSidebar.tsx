'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/produits', label: 'Produits', icon: '📦' },
  { href: '/admin/textes', label: 'Textes', icon: '📝' },
  { href: '/admin/zones', label: 'Zones', icon: '🗺️' },
  { href: '/admin/solutions', label: 'Solutions', icon: '💡' },
  { href: '/admin/commandes', label: 'Commandes', icon: '🛒' },
  { href: '/admin/parametres', label: 'Paramètres', icon: '⚙️' },
  { href: '/admin/medias', label: 'Médias', icon: '🖼️' },
  { href: '/admin/settings', label: 'Settings', icon: '🔧' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Administration</h2>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
        >
          <span>🏠</span>
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  )
}
