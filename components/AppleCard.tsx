interface AppleCardProps {
  className?: string
  id?: string
  padding?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  hover?: boolean
  style?: React.CSSProperties
  children: React.ReactNode
}

const paddingClasses: Record<string, string> = {
  sm: 'p-6 md:p-8',
  md: 'p-8 md:p-12',
  lg: 'p-10 md:p-14',
}

export default function AppleCard({
  className = '',
  id,
  padding = 'md',
  variant = 'dark',
  hover = false,
  style,
  children,
}: AppleCardProps) {
  const bg = variant === 'light' ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'bg-[#272729] text-white'
  return (
    <div
      id={id}
      style={{ boxShadow: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px', ...style }}
      className={`${bg} rounded-lg relative overflow-hidden ${paddingClasses[padding]} ${hover ? 'transition-transform duration-300 hover:scale-[1.02]' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
