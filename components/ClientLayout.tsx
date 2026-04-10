'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AssistantWidget from './AssistantWidget'
import SoundPlayer from './SoundPlayer'
import CartWidget from './CartWidget'
import BackToTop from './BackToTop'
import { CartProvider } from '@/lib/cartContext'
import { useSettings } from '@/lib/SettingsContext'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()
  const pathname = usePathname()

  return (
    <CartProvider>
      {children}
      {settings?.audio?.file_url && (
        <SoundPlayer
          fileUrl={settings.audio.file_url}
          volume={settings.audio.volume ?? 70}
          loop={settings.audio.loop ?? true}
          autoplay={settings.audio.autoplay ?? false}
          fadeIn={settings.audio.fade_in ?? true}
          fadeInDuration={settings.audio.fade_in_duration ?? 2000}
          enabled={true}
        />
      )}
      {settings?.widgets?.ai_enabled !== false && <AssistantWidget />}
      {settings?.widgets?.cart_enabled !== false && <CartWidget />}
      {settings?.widgets?.back_to_top && <BackToTop />}
    </CartProvider>
  )
}
