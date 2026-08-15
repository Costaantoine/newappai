import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 })
    }

    // Sauvegarder le fichier uploade
    const uploadDir = "/tmp/easyreadvoice-uploads"
    await mkdir(uploadDir, { recursive: true })
    const ext = file.name.split(".").pop() || "txt"
    const fileName = `upload-${Date.now()}.${ext}`
    const filePath = join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Extraire le texte (pour l'instant TXT seulement)
    let extractedText = ""
    const lower = file.name.toLowerCase()
    if (lower.endsWith(".txt")) {
      extractedText = await file.text()
    } else {
      // Pour PDF/EPUB/DOCX, on utilise l'extension du fichier brut
      // Extraction basique : on retourne juste le nom
      extractedText = `[Fichier ${ext} uploade : ${file.name}. L'extraction de texte pour ce format necessite un module complementaire.]`
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      extractedText,
      filePath,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
