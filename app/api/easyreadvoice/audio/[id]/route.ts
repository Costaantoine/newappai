import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { existsSync } from 'fs'
import { join } from 'path'
import { decryptFile } from '@/lib/crypto'

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  aac: 'audio/aac',
  m4a: 'audio/mp4',
  wma: 'audio/x-ms-wma',
}

// Le pipeline ne chiffre que le mp3 ; les autres formats sont stockes en clair.
const ENCRYPTED_EXTENSIONS = new Set(['mp3'])

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.audioBook.findUnique({ where: { id: params.id } })
    if (!book || !book.audio_path) {
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 })
    }
    if (!existsSync(book.audio_path)) {
      return NextResponse.json({ error: 'Fichier supprime' }, { status: 404 })
    }

    const chapterParam = request.nextUrl.searchParams.get('chapter')
    const chapterNumber = chapterParam ? parseInt(chapterParam, 10) : 1
    if (!Number.isInteger(chapterNumber) || chapterNumber < 0 || chapterNumber > 99) {
      return NextResponse.json({ error: 'Parametre chapter invalide' }, { status: 400 })
    }

    const chapterBaseName = 'chapter_' + String(chapterNumber + 1).padStart(3, '0')
    let extension: string | null = null
    let filePath: string | null = null
    for (const ext of Object.keys(CONTENT_TYPE_BY_EXT)) {
      const candidate = join(book.audio_path, `${chapterBaseName}.${ext}`)
      if (existsSync(candidate)) {
        extension = ext
        filePath = candidate
        break
      }
    }
    if (!extension || !filePath) {
      return NextResponse.json({ error: 'Chapitre introuvable' }, { status: 404 })
    }

    const { readFile } = await import('fs/promises')
    const rawFile = await readFile(filePath)

    let audioData: Uint8Array
    if (ENCRYPTED_EXTENSIONS.has(extension)) {
      const aesKey = process.env.AES_KEY || 'h6bC9Ixii933fPdpC4xf0S8yQMtGpIhS'
      const aesIv = process.env.AES_IV || 'hJqLYuzHtbMA2f5k'
      const file = decryptFile(rawFile, aesKey, aesIv)
      audioData = new Uint8Array(file.buffer || file, file.byteOffset, file.byteLength)
    } else {
      audioData = new Uint8Array(rawFile.buffer, rawFile.byteOffset, rawFile.byteLength)
    }
    const size = audioData.byteLength
    const contentType = CONTENT_TYPE_BY_EXT[extension]

    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1
      const chunk = audioData.subarray(start, end + 1)
      return new NextResponse(chunk as any, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
          'Content-Length': String(chunk.byteLength),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
        },
      })
    }

    return new NextResponse(audioData as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Erreur chargement audio:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement de l audio' }, { status: 500 })
  }
}
