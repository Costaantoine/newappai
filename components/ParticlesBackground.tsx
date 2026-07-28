'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: string
  top: string
  delay: string
  duration: string
}

interface ParticlesBackgroundProps {
  count?: number
  color?: string
}

export default function ParticlesBackground({
  count = 25,
  color = 'rgba(139,92,246,0.6)',
}: ParticlesBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const items: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 3}s`,
    }))
    setParticles(items)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: 4,
            height: 4,
            backgroundColor: color,
            animation: `particle-float ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
