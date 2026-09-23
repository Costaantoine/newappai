interface AppleSectionProps {
  className?: string
  children: React.ReactNode
  id?: string
  variant?: 'dark' | 'light'
}

export default function AppleSection({
  className = '',
  children,
  id,
  variant = 'dark',
}: AppleSectionProps) {
  const bg = variant === 'light' ? 'bg-apple-light' : 'bg-apple-black'
  return (
    <section id={id} className={`px-6 py-24 md:py-32 ${bg} ${className}`}>
      <div className="max-w-[980px] mx-auto">
        {children}
      </div>
    </section>
  )
}
