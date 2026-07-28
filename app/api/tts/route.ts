import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)

// Voix Eva: francais feminin, chaleureux
const EVA_VOICE = 'fr-FR-DeniseNeural'
const TEMP_DIR = '/tmp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voice } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Limiter la longueur pour la performance
    const truncatedText = text.substring(0, 2000)
    
    // Generer un nom de fichier unique
    const filename = `eva_${Date.now()}.mp3`
    const outputPath = join(TEMP_DIR, filename)
    const voiceToUse = voice || EVA_VOICE

    // Appeler edge-tts
    const escapedText = truncatedText.replace(/'/g, "'\\''")
    const command = `edge-tts --voice "${voiceToUse}" --text '${escapedText}' --write-media "${outputPath}"`
    
    await execAsync(command, { timeout: 30000 })

    // Lire le fichier audio
    const audioBuffer = readFileSync(outputPath)
    
    // Supprimer le fichier temporaire
    try { unlinkSync(outputPath) } catch {}

    // Retourner l'audio
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error: any) {
    console.error('TTS error:', error)
    return NextResponse.json({ 
      error: 'TTS generation failed',
      details: error.message 
    }, { status: 500 })
  }
}

// Endpoint GET pour tester
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    voice: EVA_VOICE,
    message: 'TTS endpoint is running. Send POST with { text: "..." }'
  })
}
