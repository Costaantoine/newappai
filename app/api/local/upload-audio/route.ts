import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.webm']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 })
    }

    const audioDir = path.join(process.cwd(), 'public', 'audio')

    if (!existsSync(audioDir)) {
      await mkdir(audioDir, { recursive: true })
    }

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = path.join(audioDir, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const fileUrl = `/audio/${fileName}`

    return NextResponse.json({
      success: true,
      file_url: fileUrl
    })
  } catch (error) {
    console.error('Audio upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
