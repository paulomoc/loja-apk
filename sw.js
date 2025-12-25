const CACHE_NAME = 'apk-store-v3';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    './favicon.png',
    './favicon.svg',
    './apple-touch-icon.png',
    './icon-192.png',
    './icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Take over immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // We use addAll but in a local file context it might fail for some assets, 
            // so we handle it gracefully.
            return cache.addAll(ASSETS).catch(err => console.log('Cache error:', err));
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Take control of all clients immediately
            clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch Strategy: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
