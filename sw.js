const CACHE = 'bayan-v4-' + self.registration.scope;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './A.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.endsWith(self.registration.scope) && (key.startsWith('aamali-') || key.startsWith('bayan-')) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const allowed = FILES.map(path => new URL(path, self.registration.scope).href);
  if (!allowed.includes(url.href)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
      return response;
    }
    return caches.match(event.request).then(cached => cached || response);
  }).catch(() => caches.match(event.request).then(cached => cached || new Response('بيان غير متاح بدون إنترنت بعد. افتحه مرة أثناء الاتصال.', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}}))));
});
