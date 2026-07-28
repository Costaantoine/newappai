'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Lea3DHead({ text, isSpeaking }: { text: string; isSpeaking: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const morphTargetRef = useRef<THREE.MorphTarget | null>(null)
  const animFrameRef = useRef(0)

  // Animation state
  const jawValueRef = useRef(0.01)
  const blinkTimer = useRef(0)
  const isBlinking = useRef(false)
  const blinkProgress = useRef(0)
  const idleTime = useRef(0)
  const speakingRef = useRef(false)
  const speechStart = useRef(0)
  const speechDuration = useRef(500)
  const lastText = useRef('')

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const w = container.clientWidth || 400
    const h = container.clientHeight || 400

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f0f1a)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(25, w / h, 0.01, 10)
    camera.position.set(0, 0.15, 2.5)
    camera.lookAt(0, 0.15, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, 3.0)
    key.position.set(1, 2, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 1.5)
    fill.position.set(-1, 0.5, 2)
    scene.add(fill)

    // Load texture
    const loader = new THREE.TextureLoader()
    loader.load('/images/lea/avatar.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      
      // Create an ellipsoid head shape (stretched sphere)
      const geo = new THREE.SphereGeometry(0.5, 48, 48, 0, Math.PI * 2, 0, Math.PI)
      
      // Stretch to make a head shape (wider than tall, elongated top)
      const pos = geo.attributes.position.array as Float32Array
      const uv = geo.attributes.uv.array as Float32Array
      
      // Morph target data: store original positions
      const morphPositions = new Float32Array(pos.length)
      
      for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i], y = pos[i+1], z = pos[i+2]
        
        // Scale to head proportions
        pos[i] = x * 0.55    // narrower
        pos[i+1] = y * 0.65 + 0.45  // elongated upward
        pos[i+2] = z * 0.5   // flattened front-to-back
        
        // JAW MORPH TARGET: vertices in lower half (y < 0.45) move down
        // Strongest at bottom center (chin), zero at middle (y = 0.45)
        if (y < 0.1) {
          const strength = Math.pow(0.1 - y, 0.8) * 1.5
          morphPositions[i] = pos[i] + Math.sin(x * 1.5) * 0.003 // micro mouth corner spread
          morphPositions[i+1] = pos[i+1] - strength * 0.15 // jaw drops down
          morphPositions[i+2] = pos[i+2] + strength * 0.05 // chin moves forward slightly
        } else {
          morphPositions[i] = pos[i]
          morphPositions[i+1] = pos[i+1]
          morphPositions[i+2] = pos[i+2]
        }
      }
      
      // Add morph target
      geo.morphAttributes.position = [new THREE.Float32BufferAttribute(morphPositions, 3)]
      
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.FrontSide,
        roughness: 0.6,
        metalness: 0.0,
      })
      
      const mesh = new THREE.Mesh(geo, mat)
      mesh.morphTargetInfluences = [0]
      meshRef.current = mesh
      scene.add(mesh)

      // Resize handler
      const handleResize = () => {
        if (!container || !cameraRef.current || !rendererRef.current) return
        const cw = container.clientWidth || 400
        const ch = container.clientHeight || 400
        cameraRef.current.aspect = cw / ch
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(cw, ch)
      }
      window.addEventListener('resize', handleResize)
    })

    // Animation loop
    function animate(time: number) {
      animFrameRef.current = requestAnimationFrame(animate)
      const mesh = meshRef.current
      if (!mesh) return

      const influences = mesh.morphTargetInfluences
      if (!influences) return

      // Phoneme-driven jaw value (when speaking)
      if (speakingRef.current) {
        const elapsed = performance.now() - speechStart.current
        const progress = Math.min(elapsed / speechDuration.current, 1)
        
        // Simple vowel-based phoneme profile
        const txt = lastText.current
        const chars = txt.toLowerCase().split('')
        const totalLen = chars.length
        const charPos = Math.floor(progress * totalLen)
        const ch = charPos < totalLen ? chars[charPos] : ' '
        const wideV = new Set(['a','e','o','i','u'])
        
        const targetJaw = wideV.has(ch) ? 0.8 : 0.05
        const lerp = 0.12
        jawValueRef.current += (targetJaw - jawValueRef.current) * lerp
        jawValueRef.current = Math.max(0.01, Math.min(1.0, jawValueRef.current))
        
        if (progress >= 1 && ch === ' ') {
          speakingRef.current = false
          jawValueRef.current = 0.01
        }
      } else {
        // Close mouth gradually
        jawValueRef.current += (0.01 - jawValueRef.current) * 0.05
      }

      // Blink
      blinkTimer.current++
      if (!isBlinking.current && blinkTimer.current > 180 + Math.floor(Math.random() * 240)) {
        isBlinking.current = true
        blinkProgress.current = 0
        blinkTimer.current = 0
      }
      if (isBlinking.current) {
        blinkProgress.current += 0.08
        const v = blinkProgress.current < 0.5 ? blinkProgress.current * 2 : 2 - blinkProgress.current * 2
        const blinkInfluence = Math.max(0, v) * 0.1
        influences[0] = Math.max(jawValueRef.current, blinkInfluence)
        if (blinkProgress.current >= 1) {
          isBlinking.current = false
          blinkProgress.current = 0
        }
      } else {
        influences[0] = jawValueRef.current
      }

      // Idle breathing
      if (!speakingRef.current && jawValueRef.current < 0.02) {
        idleTime.current += 0.01
        mesh.position.y = Math.sin(idleTime.current * 1.5) * 0.001
      } else {
        idleTime.current = 0
      }

      renderer.render(scene, camera)
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  // Handle speech signals
  useEffect(() => {
    if (!text || !isSpeaking || text === lastText.current) return
    lastText.current = text
    speakingRef.current = true
    
    // Generate phoneme intervals
    const chars = text.toLowerCase().split('')
    const wideV = new Set(['a','e','o','i','u'])
    let total = 0
    for (const ch of chars) total += wideV.has(ch) ? 3 : 0.5
    speechDuration.current = Math.max(text.length * 60, 500)
    speechStart.current = performance.now()
    jawValueRef.current = 0.01

    // Play TTS audio
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => {
        speakingRef.current = false
        jawValueRef.current = 0.01
        URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        speakingRef.current = false
        jawValueRef.current = 0.01
        URL.revokeObjectURL(url)
      }
      audio.play().catch(() => {
        speakingRef.current = false
        jawValueRef.current = 0.01
      })
    })
    .catch(() => {
      setTimeout(() => {
        speakingRef.current = false
        jawValueRef.current = 0.01
      }, speechDuration.current)
    })
  }, [text, isSpeaking])

  return (
    <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden" style={{ aspectRatio: '1/1' }} />
  )
}
