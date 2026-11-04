/* Small same-origin cache for installable mobile invitation; no external data cached. */
const CACHE = 'arif-suchana-kabin-v4';
const ASSETS = ['/', '/arif-suchana.webp', '/white-dove-sprite.webp', '/white-dove-still.webp', '/peacock-walk-sprite.webp', '/peacock-fan-sprite.webp', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await Promise.allSettled(ASSETS.map(async url => {
      try { const response = await fetch(url, { cache: 'reload' }); if (response.ok) await cache.put(url, response); } catch { /* offline first install: ignore */ }
    }));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('arif-suchana-kabin-') && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim(),
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); void caches.open(CACHE).then(cache => cache.put('/', copy)); }
      return response;
    }).catch(async () => (await caches.match('/')) || Response.error()));
    return;
  }
  if (['script','style','image','font','manifest'].includes(request.destination)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); void caches.open(CACHE).then(cache => cache.put(request, copy)); }
      return response;
    })));
  }
});
