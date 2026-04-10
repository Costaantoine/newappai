import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readData<T>(filename: string): T[] {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  
  if (!fs.existsSync(filePath)) {
    return []
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

export function writeData<T>(filename: string, data: T[]): boolean {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

export function readSettings(filename: string = 'settings.json'): Record<string, any> {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  
  if (!fs.existsSync(filePath)) {
    return {}
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return {}
  }
}

export function writeSettings(filename: string = 'settings.json', data: Record<string, any>): boolean {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function findById<T extends { id: string }>(filename: string, id: string): T | undefined {
  const data = readData<T>(filename)
  return data.find(item => item.id === id)
}

export function updateById<T extends { id: string }>(filename: string, id: string, updates: Partial<T>): boolean {
  const data = readData<T>(filename)
  const index = data.findIndex(item => item.id === id)
  
  if (index === -1) return false
  
  data[index] = { ...data[index], ...updates }
  return writeData(filename, data)
}

export function deleteById<T extends { id: string }>(filename: string, id: string): boolean {
  const data = readData<T>(filename)
  const filtered = data.filter(item => item.id !== id)
  
  if (filtered.length === data.length) return false
  
  return writeData(filename, filtered)
}

export function addItem<T extends { id: string }>(filename: string, item: T): boolean {
  const data = readData<T>(filename)
  data.push(item)
  return writeData(filename, data)
}
