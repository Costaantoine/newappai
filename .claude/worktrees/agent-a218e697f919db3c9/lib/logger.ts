/**
 * Lightweight structured logger compatible with Next.js (no worker threads).
 * Outputs JSON in production (ideal for Coolify/Docker log aggregation),
 * and readable lines in development.
 */

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

const LEVELS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

const configured = (process.env.LOG_LEVEL as LogLevel) || 'info'
const minLevel = LEVELS[configured] ?? LEVELS.info
const isDev = process.env.NODE_ENV !== 'production'

function write(level: LogLevel, data: object | string, message?: string) {
  if (LEVELS[level] < minLevel) return

  const ts = new Date().toISOString()
  const msg = typeof data === 'string' ? data : (message ?? '')
  const extra = typeof data === 'object' ? data : {}

  if (isDev) {
    const prefix = `[${ts}] ${level.toUpperCase().padEnd(5)}`
    const extraStr = Object.keys(extra).length
      ? ' ' + JSON.stringify(extra)
      : ''
    const out = `${prefix} ${msg}${extraStr}`
    if (level === 'error' || level === 'fatal') {
      console.error(out)
    } else if (level === 'warn') {
      console.warn(out)
    } else {
      console.log(out)
    }
  } else {
    process.stdout.write(
      JSON.stringify({ level, time: ts, msg, ...extra }) + '\n'
    )
  }
}

const logger = {
  trace: (data: object | string, msg?: string) => write('trace', data, msg),
  debug: (data: object | string, msg?: string) => write('debug', data, msg),
  info:  (data: object | string, msg?: string) => write('info',  data, msg),
  warn:  (data: object | string, msg?: string) => write('warn',  data, msg),
  error: (data: object | string, msg?: string) => write('error', data, msg),
  fatal: (data: object | string, msg?: string) => write('fatal', data, msg),
}

export default logger
