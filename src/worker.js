// assets on build

const cachePath = "no-liqor"

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cachePath).then(cache => {
      cache.addAll(assets)
    })
  )
})

// For offline
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})