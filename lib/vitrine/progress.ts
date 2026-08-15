/**
 * Parseur d'étapes du chantier live — transforme les lignes de log brutes de
 * la mission Claude Code en étapes françaises affichables au client.
 * Aucune fausse progression : une étape n'est allumée que si un marqueur
 * réel a été détecté dans le log (ou si le job est marqué "done").
 */

export const STEPS: { label: string; match: RegExp }[] = [
  { label: 'Mission envoyée', match: /(?!)/ }, // jamais matché directement — étape de départ (index 0)
  { label: 'Lecture du design de référence', match: /webolharosol|référence|ref\b|scraper|mirror/i },
  { label: 'Génération des sections du site', match: /index\.html|écri|write|fichier|fichiers|section/i },
  { label: 'Vérification finale', match: /vérif|verif|checklist|validate|contr[ôo]le/i },
]

export const ESTIMATION = '5-15 min'
export const POLL_MS = 2000

/**
 * Retourne l'étape la plus avancée détectée dans les logs, en parcourant
 * les marqueurs dans l'ordre croissant (une étape plus tardive écrase les
 * précédentes, jamais l'inverse).
 */
export function parseProgress(
  logLines: string[],
  status?: string
): { etapeIndex: number; etape: string } {
  if (status === 'done') {
    return { etapeIndex: STEPS.length, etape: 'Aperçu prêt !' }
  }

  let etapeIndex = 0
  for (const line of logLines) {
    for (let i = STEPS.length - 1; i >= 1; i--) {
      if (STEPS[i].match.test(line) && i > etapeIndex) {
        etapeIndex = i
        break
      }
    }
  }

  return { etapeIndex, etape: STEPS[etapeIndex].label }
}
