import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import logger from '@/lib/logger'

type SettingsRecord = Record<string, unknown>

function deepMerge(target: SettingsRecord, source: SettingsRecord): SettingsRecord {
  const result: SettingsRecord = { ...target }
  for (const key in source) {
    const srcVal = source[key]
    const tgtVal = target[key]
    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      typeof tgtVal === 'object' &&
      tgtVal !== null &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal as SettingsRecord, srcVal as SettingsRecord)
    } else {
      result[key] = srcVal
    }
  }
  return result
}

export async function GET() {
  try {
    const settingsEntry = await prisma.settings.findUnique({
      where: { id: 'main' }
    })
    const settings = settingsEntry ? JSON.parse(settingsEntry.data) : {}
    return NextResponse.json({ settings })
  } catch (error: unknown) {
    logger.error({ error }, 'Error fetching settings')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ settings: {} })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json() as SettingsRecord
    const settingsEntry = await prisma.settings.findUnique({
      where: { id: 'main' }
    })

    const currentSettings = settingsEntry ? JSON.parse(settingsEntry.data) : {}
    const updatedSettings = deepMerge(currentSettings, body)

    await prisma.settings.upsert({
      where: { id: 'main' },
      update: { data: JSON.stringify(updatedSettings) },
      create: { id: 'main', data: JSON.stringify(updatedSettings) }
    })

    logger.info('Settings updated in SQLite')
    return NextResponse.json({ settings: updatedSettings })
  } catch (error: unknown) {
    logger.error({ error }, 'Error updating settings')
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
