'use client'

import { useEffect, useRef } from 'react'

const CHAR_SET = ['N', 'E', 'W', 'A', 'P', 'P', 'A', 'I']
const COL_SPACING = 5

const HEAD_COLORS = [
  'rgba(0, 255, 65, 0.95)',
  'rgba(0, 255, 65, 0.90)',
]

const TRAIL_COLORS = [
  'rgba(0, 255, 65, 0.35)',
  'rgba(0, 255, 65, 0.30)',
]

interface Drop {
  x: number
  y: number
  speed: number
  length: number
  headColor: string
  trailColor: string
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let drops: Drop[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const init = () => {
      const cols = Math.ceil(canvas.width / COL_SPACING)
      drops = Array.from({ length: cols }, (_, i) => ({
        x: i * COL_SPACING,
        y: -Math.random() * canvas.height,
        speed: 0.8 + Math.random() * 1.6,
        length: 8 + Math.floor(Math.random() * 15),
        headColor: HEAD_COLORS[Math.floor(Math.random() * HEAD_COLORS.length)],
        trailColor: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
      }))
    }
    init()

    const randomChar = () => CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const drop of drops) {
        const fontSize = 16 + Math.floor(Math.random() * 4)
        ctx.font = `${fontSize}px monospace`

        ctx.shadowBlur = 0

        for (let i = 0; i < drop.length; i++) {
          const char = randomChar()
          const y = drop.y + i * fontSize

          if (i === 0) {
            ctx.fillStyle = drop.headColor
            ctx.shadowColor = drop.headColor
            ctx.shadowBlur = 8
          } else {
            ctx.fillStyle = drop.trailColor
            ctx.shadowBlur = 0
          }

          ctx.fillText(char, drop.x, y)
        }

        drop.y += drop.speed

        // Reset when fully off-screen
        if (drop.y - drop.length * fontSize > canvas.height) {
          drop.y = -drop.length * fontSize - Math.random() * canvas.height
          drop.speed = 0.8 + Math.random() * 1.6
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  )
}
