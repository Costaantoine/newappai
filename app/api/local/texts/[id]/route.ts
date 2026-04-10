import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData, deleteById } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const texts = readData<any>('texts.json')
  const index = texts.findIndex((t: any) => t.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  texts[index] = { ...texts[index], ...body }
  writeData('texts.json', texts)
  return NextResponse.json({ text: texts[index] })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const success = deleteById<any>('texts.json', params.id)
  if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
