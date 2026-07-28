'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function AIChat() {
  const { t } = useLanguage()
  
  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end">
      <div className="glass p-5 rounded-2xl mb-4 text-sm max-w-[220px] border-sky-500/40 shadow-2xl ai-bubble">
        {t.ai.bubble}
      </div>
      <button className="w-16 h-16 p-4 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg hover:scale-110 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>
    </div>
  )
}
