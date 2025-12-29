/* Service Worker for caching and showing scheduled notifications when app is open.
   Note: Browser service workers cannot reliably schedule background notifications without push.
   This worker provides caching and a simple message handler.
*/

const CACHE_NAME = 'romantic-memory-cache-v1';
const ASSETS = [ '/index.html', '/manifest.json' ];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((r) => r || fetch(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'show-notification') {
    self.registration.showNotification(event.data.title, event.data.options || {});
  }
});
