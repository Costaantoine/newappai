interface AppleSectionProps {
  className?: string
  children: React.ReactNode
  id?: string
}

export default function AppleSection({
  className = '',
  children,
  id,
}: AppleSectionProps) {
  return (
    <section id={id} className={`px-6 py-24 md:py-32 bg-[#000000] ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  )
}
