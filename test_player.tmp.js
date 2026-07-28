const { chromium } = require('playwright')

const BOOK_ID = '1c4cf3ef-fbc2-4705-b56c-9f944f1fbea0' // livre "test", 1 chapitre, 95s

;(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 500, height: 1000 } })
  const errors = []
  page.on('pageerror', e => errors.push('pageerror: ' + e.message))
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console.error: ' + msg.text()) })

  await page.goto(`http://localhost:3099/easyreadvoice/player/${BOOK_ID}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  console.log('--- Titre visible ---')
  console.log(await page.locator('h1').first().textContent())

  console.log('--- Screenshot initial ---')
  await page.screenshot({ path: '/tmp/newappai_edit/shot_1_initial.png', fullPage: true })

  // Vérifie le bouton bookmark
  const bookmarkBtn = page.locator('button[title="Marquer cette position"]')
  console.log('bookmark button count:', await bookmarkBtn.count())
  await bookmarkBtn.click()
  await page.waitForTimeout(300)
  const memoLabel = await page.locator('text=Mémorisé !').first().isVisible().catch(() => false)
  console.log('Indicateur "Mémorisé !" visible apres clic:', memoLabel)
  await page.screenshot({ path: '/tmp/newappai_edit/shot_2_bookmark.png', fullPage: true })

  // Vérifie le localStorage du bookmark
  const bookmarks = await page.evaluate((id) => localStorage.getItem(`erv-bookmarks-${id}`), BOOK_ID)
  console.log('localStorage bookmarks:', bookmarks)

  // Joue l'audio et avance proche de la fin pour tester "fin du livre"
  await page.locator('button:has-text("▶")').click().catch(() => {})
  await page.waitForFunction(() => {
    const audio = document.querySelector('audio')
    return audio && isFinite(audio.duration) && audio.duration > 0
  }, { timeout: 15000 })

  await page.evaluate(() => {
    const audio = document.querySelector('audio')
    audio.currentTime = Math.max(0, audio.duration - 1.5)
  })
  await page.waitForTimeout(3000)

  const finBookVisible = await page.locator('text=Fin du livre').first().isVisible().catch(() => false)
  console.log('Message "Fin du livre" visible:', finBookVisible)
  await page.screenshot({ path: '/tmp/newappai_edit/shot_3_fin_du_livre.png', fullPage: true })

  const storageAfterEnd = await page.evaluate((id) => localStorage.getItem(`erv-player-${id}`), BOOK_ID)
  console.log('localStorage player state:', storageAfterEnd)

  console.log('--- Erreurs JS capturees ---')
  console.log(errors.length ? errors.join('\n') : 'AUCUNE')

  await browser.close()
})()
