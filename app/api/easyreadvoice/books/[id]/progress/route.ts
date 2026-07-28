import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { chapters_done, progress_pct } = body

    if (chapters_done === undefined && progress_pct === undefined) {
      return NextResponse.json({ error: "chapters_done ou progress_pct requis" }, { status: 400 })
    }

    const data: any = {}
    if (chapters_done !== undefined) data.chapters_done = chapters_done
    if (progress_pct !== undefined) data.progress_pct = progress_pct

    await prisma.audioBook.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
