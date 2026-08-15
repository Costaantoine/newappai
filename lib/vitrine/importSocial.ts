/**
 * Import du contenu social d'un client (skill social-content-import).
 * Lance scripts/import-social.sh (yt-dlp) dans le dossier du job, sans
 * bloquer la generation en cas d'echec (lien prive, extracteur casse...).
 */

import { execFile } from 'child_process'
import path from 'path'

export interface ImportSummary {
  platform: string
  photos: number
  textes: number
  dir: string // dossier ./import dans le job (parti en scp avec la mission)
}

const SCRIPT = path.join(process.cwd(), 'scripts', 'import-social.sh')
const TIMEOUT_MS = 120_000

/**
 * Importe photos + textes publics depuis le lien social du client.
 * @returns un résumé utilisable par buildMission, ou null si rien de
 * récupérable (le job continue avec le contenu du formulaire).
 */
export function importSocialContent(jobDir: string, url: string): Promise<ImportSummary | null> {
  return new Promise((resolve) => {
    execFile(
      'bash',
      [SCRIPT, jobDir, url],
      { timeout: TIMEOUT_MS },
      (_err, stdout) => {
        const m = /^OK platform=(\w+) photos=(\d+) textes=(\d+)/m.exec(stdout || '')
        if (!m) {
          resolve(null)
          return
        }
        resolve({
          platform: m[1],
          photos: Number(m[2]),
          textes: Number(m[3]),
          dir: path.join(jobDir, 'import'),
        })
      },
    )
  })
}

/** Ligne de log courte pour le chantier live. */
export function importLogLine(summary: ImportSummary | null): string {
  if (!summary) return 'Import social ignoré (rien de récupérable)'
  return `Import ${summary.platform} : ${summary.photos} photo(s), ${summary.textes} texte(s) réel(s) récupéré(s)`
}
