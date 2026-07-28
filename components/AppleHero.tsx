'use client'

import ParticlesBackground from '@/components/ParticlesBackground'

interface AppleHeroProps {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  particlesCount?: number
  glowColor?: string
  children?: React.ReactNode
  titleDataSection?: string
  subtitleDataSection?: string
  backgroundImage?: string
}

const glowColorMap: Record<string, string> = {
  'violet-500': 'rgba(139, 92, 246, 0.1)',
  'purple-500': 'rgba(168, 85, 247, 0.1)',
  'emerald-500': 'rgba(16, 185, 129, 0.1)',
  'pink-500': 'rgba(236, 72, 153, 0.1)',
  'amber-500': 'rgba(245, 158, 11, 0.1)',
  'rose-500': 'rgba(244, 63, 94, 0.1)',
  violet: 'rgba(139, 92, 246, 0.1)',
  purple: 'rgba(168, 85, 247, 0.1)',
  emerald: 'rgba(16, 185, 129, 0.1)',
  pink: 'rgba(236, 72, 153, 0.1)',
  amber: 'rgba(245, 158, 11, 0.1)',
  rose: 'rgba(244, 63, 94, 0.1)',
}

export default function AppleHero({
  title,
  subtitle,
  particlesCount = 15,
  glowColor = 'violet-500',
  children,
  titleDataSection,
  subtitleDataSection,
  backgroundImage,
}: AppleHeroProps) {
  const glowBg = glowColorMap[glowColor] || glowColorMap['violet-500']

  return (
    <section className="relative pt-28 pb-8 px-6 flex flex-col items-center overflow-hidden bg-[#000000]">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
      )}
      <div
        className="absolute top-10 w-[600px] h-[600px] blur-[150px] rounded-full -z-10 animate-pulse"
        style={{ background: glowBg }}
      />
      <ParticlesBackground count={particlesCount} />
      <div className="text-center max-w-4xl mx-auto z-10 relative w-full">
        <h1
          data-section={titleDataSection}
          className="text-5xl md:text-8xl font-bold mb-6 tracking-wide leading-tight text-[#f5f5f7]"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            data-section={subtitleDataSection}
            className="text-[#86868b] text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
