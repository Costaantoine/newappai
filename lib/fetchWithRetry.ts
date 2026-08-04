/**
 * Fetch avec retry intelligent : ne retente JAMAIS sur 4xx (429 inclus) —
 * le rate-limit s'auto-entretiendrait. Backoff exponentiel (500ms × 2^attempt).
 */
export async function fetchWithRetry(url: string, retries = 3, delay = 500): Promise<Response | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      // 4xx (429 inclus) = échec définitif : ne JAMAIS retenter
      if (res.status >= 400 && res.status < 500) {
        console.warn(`Fetch aborted (${res.status}) for ${url} — 4xx treated as definitive failure`)
        return null
      }
      console.warn(`Fetch failed (${res.status}) for ${url}, attempt ${attempt + 1}/${retries}`)
    } catch (e) {
      console.warn(`Fetch error for ${url}, attempt ${attempt + 1}/${retries}:`, e)
    }
    if (attempt < retries - 1) await new Promise(r => setTimeout(r, delay * Math.pow(2, attempt)))
  }
  return null
}
