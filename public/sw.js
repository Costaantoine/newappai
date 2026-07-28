const CACHE_NAME = 'ervp-cache-v1'
const OFFLINE_URL = '/easyreadvoice/player/'

const PRECACHE_ASSETS = [
  '/easyreadvoice/player/',
  '/manifest.json',
  '/easyreadvoice/icons/icon-192.png',
  '/easyreadvoice/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Audio streaming: always go to network, never cache (fichiers protégés/volumineux)
  if (url.pathname.startsWith('/api/easyreadvoice/audio/')) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => cached || (request.mode === 'navigate' ? caches.match(OFFLINE_URL) : undefined))

      return cached || network
    })
  )
})
