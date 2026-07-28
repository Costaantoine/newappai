import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)
const TEMP_DIR = '/tmp'

// Voix disponibles pour le test
const AVAILABLE_VOICES: Record<string, string> = {
  'Denise': 'fr-FR-DeniseNeural',
  'Remy': 'fr-FR-RemyMultilingualNeural',
  'Eloise': 'fr-FR-EloiseNeural',
  'Henri': 'fr-FR-HenriNeural',
  'Vivienne': 'fr-FR-VivienneMultilingualNeural',
  'Antoine': 'fr-FR-AntoineNeural',
  'Sylvie': 'fr-FR-SylvieNeural',
  'Charline': 'fr-FR-CharlineNeural',
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Le texte est requis' }, { status: 400 })
    }

    const voiceCode = voice && AVAILABLE_VOICES[voice]
      ? AVAILABLE_VOICES[voice]
      : 'fr-FR-DeniseNeural'

    // Limiter la longueur pour la performance
    const truncatedText = text.trim().substring(0, 2000)

    // Générer un nom de fichier unique
    const filename = `test_tts_${Date.now()}.mp3`
    const outputPath = join(TEMP_DIR, filename)

    // Appeler edge-tts via CLI
    const escapedText = truncatedText.replace(/'/g, "'\\''")
    const command = `edge-tts --voice "${voiceCode}" --text '${escapedText}' --write-media "${outputPath}"`

    await execAsync(command, { timeout: 30000 })

    // Lire le fichier audio
    const audioBuffer = readFileSync(outputPath)

    // Supprimer le fichier temporaire
    try { unlinkSync(outputPath) } catch {}

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Test TTS error:', error)
    return NextResponse.json({
      error: 'Échec de la génération audio',
      details: error.message,
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    voices: Object.keys(AVAILABLE_VOICES),
    message: 'Test TTS endpoint ready. Send POST with { text: string, voice?: string }',
  })
}
