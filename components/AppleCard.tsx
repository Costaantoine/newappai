interface AppleCardProps {
  className?: string
  id?: string
  padding?: 'sm' | 'md' | 'lg'
  glowColor?: string
  hover?: boolean
  style?: React.CSSProperties
  children: React.ReactNode
}

const paddingClasses: Record<string, string> = {
  sm: 'p-6 md:p-8',
  md: 'p-8 md:p-12',
  lg: 'p-10 md:p-14',
}

const glowColorMap: Record<string, string> = {
  'violet-500': 'rgba(139, 92, 246, 0.05)',
  'purple-500': 'rgba(168, 85, 247, 0.05)',
  'emerald-500': 'rgba(16, 185, 129, 0.05)',
  'pink-500': 'rgba(236, 72, 153, 0.05)',
  'amber-500': 'rgba(245, 158, 11, 0.05)',
  'rose-500': 'rgba(244, 63, 94, 0.05)',
  violet: 'rgba(139, 92, 246, 0.05)',
  purple: 'rgba(168, 85, 247, 0.05)',
  emerald: 'rgba(16, 185, 129, 0.05)',
  pink: 'rgba(236, 72, 153, 0.05)',
  amber: 'rgba(245, 158, 11, 0.05)',
  rose: 'rgba(244, 63, 94, 0.05)',
}

export default function AppleCard({
  className = '',
  id,
  padding = 'md',
  glowColor,
  hover = false,
  style,
  children,
}: AppleCardProps) {
  return (
    <div
      id={id}
      style={style}
      className={`backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] shadow-lg shadow-black/30 relative overflow-hidden rounded-[2rem] ${paddingClasses[padding]} ${hover ? 'hover:border-violet-500/30 transition-all duration-300 group' : ''} ${className}`}
    >
      {glowColor && (
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] rounded-full -z-10"
          style={{ background: glowColorMap[glowColor] || glowColorMap.violet }}
        />
      )}
      {children}
    </div>
  )
}
