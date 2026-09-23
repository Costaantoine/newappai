interface AppleHeroProps {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  children?: React.ReactNode
  titleDataSection?: string
  subtitleDataSection?: string
  backgroundImage?: string
  variant?: 'dark' | 'light'
}

export default function AppleHero({
  title,
  subtitle,
  children,
  titleDataSection,
  subtitleDataSection,
  backgroundImage,
  variant = 'dark',
}: AppleHeroProps) {
  const bg = variant === 'light' ? 'bg-apple-light' : 'bg-apple-black'
  const subtitleColor = variant === 'light' ? 'text-black/80' : 'text-white/80'

  return (
    <section className={`relative pt-28 pb-16 px-6 flex flex-col items-center overflow-hidden ${bg}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
      )}
      <div className="text-center max-w-[980px] mx-auto z-10 relative w-full">
        <h1 data-section={titleDataSection} className="apple-headline">
          {title}
        </h1>
        {subtitle && (
          <p
            data-section={subtitleDataSection}
            className={`text-[21px] leading-[1.19] mt-6 mb-10 max-w-2xl mx-auto font-normal ${subtitleColor}`}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
