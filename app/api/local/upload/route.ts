import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const customName = formData.get('customName') as string | null
    const suffix = formData.get('suffix') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let targetDir = 'uploads'
    if (customName === 'header_bg') {
      targetDir = 'assets/header'
    }

    const uploadsDir = path.join(process.cwd(), 'public', ...targetDir.split('/'))

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    let finalName: string
    if (customName) {
      const ext = path.extname(file.name) || '.png'
      finalName = `${customName}${suffix || ''}${ext}`
    } else {
      const timestamp = Date.now()
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const ext = path.extname(originalName) || '.jpg'
      const baseName = path.basename(originalName, ext)
      finalName = `${timestamp}-${baseName}${suffix || ''}${ext}`
    }

    const filePath = path.join(uploadsDir, finalName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const imageUrl = `/${targetDir}/${finalName}`

    return NextResponse.json({
      success: true,
      image_url: imageUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
