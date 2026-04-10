import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : null
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let sharpInstance = sharp(buffer)

    if (width || height) {
      sharpInstance = sharpInstance.resize(width || null, height || null, {
        fit: 'cover',
        position: 'center'
      })
    }

    const webpBuffer = await sharpInstance
      .webp({ quality: 85 })
      .toBuffer()

    const formDataToUpload = new FormData()
    formDataToUpload.append('reqtype', 'fileupload')
    formDataToUpload.append('time', '1h')
    formDataToUpload.append('fileToUpload', new Blob([webpBuffer as any], { type: 'image/webp' }), 'image.webp')

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formDataToUpload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Catbox error:', errorText)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const url = await response.text()
    
    if (!url.startsWith('http')) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ url: url.trim() })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
