'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface NavItem {
  href: string
  label: string
  icon: string
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/easyreadvoice/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/easyreadvoice/upload', label: 'Upload', icon: '📤' },
  { href: '/easyreadvoice/books', label: 'Bibliothèque', icon: '📚' },
  { href: '/easyreadvoice/profile', label: 'Profil', icon: '👤' },
  { href: '/easyreadvoice/settings', label: 'Paramètres', icon: '⚙️' },
  { href: '/easyreadvoice/admin', label: 'Admin', icon: '🛡️', adminOnly: true },
]

export function isEasyReadVoiceAdmin(user: User | null): boolean {
  if (!user) return false
  return user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
}

export default function AppShell({
  user,
  onSignOut,
  children,
}: {
  user: User | null
  onSignOut: () => void
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = isEasyReadVoiceAdmin(user)
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 w-72 shrink-0 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full m-3 rounded-2xl backdrop-blur-md bg-white/80 border border-white/20 shadow-xl flex flex-col p-5">
          <Link href="/easyreadvoice" className="flex items-center gap-2 mb-8 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🎧</span>
            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
              EasyReadVoice
            </span>
          </Link>

          <nav className="flex-1 space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-600/20'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-gray-200/60">
            <p className="text-xs text-gray-500 truncate mb-3 px-1">{user?.email}</p>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <span>🚪</span> Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-white/20 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
            EasyReadVoice
          </span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center transition hover:bg-purple-100"
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  )
}
