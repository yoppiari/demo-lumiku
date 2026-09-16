// ==========================================================================
// SERVICE WORKER - RUANG TUMBUH REMAJA PWA
// Offline-First Caching Strategy & Zero-Database Architecture
// ==========================================================================

const CACHE_NAME = 'ruang-tumbuh-v1.0';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/memphis-unified.css?v=20260908_v15',
  './js/kespro-content.js?v=20260910_v16',
  './js/selfhelp-content.js?v=20260910_v16',
  './js/kespro-app.js?v=20260910_v16',
  './js/selfhelp-app.js?v=20260910_v16',
  './js/portal.js?v=20260910_v16',
  './js/security-manager.js',
  './js/backup-manager.js',
  './js/mental-health-insights.js',
  './js/guidance-manager.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.svg',
  './assets/hero-cover.jpg',
  './assets/kespro-book-cover.jpg',
  './assets/mental-health-hero.jpg'
];

// Install: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch on each to avoid failing if an optional asset is missing
      return Promise.allSettled(
        CORE_ASSETS.map(url => cache.add(url).catch(err => console.warn('SW pre-cache miss:', url, err)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for optimal offline experience
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Ignore cross-origin non-http(s) requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // If offline and not in cache, fallback to index.html if request is navigation
          if (event.request.mode === 'navigate') {
            return cache.match('./index.html');
          }
          return null;
        });

        // Return cached version immediately if available, while updating cache in background
        return cachedResponse || fetchPromise;
      });
    })
  );
});
