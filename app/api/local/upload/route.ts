import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/session'

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

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

    // Sanitize customName to prevent path traversal (SEC-04)
    const sanitizeName = (name: string): string => {
      // Strip path separators, null bytes, and sequences like ..
      return name.replace(/[^a-zA-Z0-9_-]/g, '')
    }

    const uploadsDir = path.join(process.cwd(), 'public', ...targetDir.split('/'))

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    let finalName: string
    if (customName) {
      const ext = path.extname(file.name) || '.png'
      const safeSuffix = suffix ? sanitizeName(suffix) : ''
      finalName = `${sanitizeName(customName)}${safeSuffix}${ext}`
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

    const imageUrl = `/api/uploads/${finalName}`

    return NextResponse.json({
      success: true,
      image_url: imageUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
