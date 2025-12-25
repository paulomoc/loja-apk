const CACHE_NAME = 'apk-store-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // We use addAll but in a local file context it might fail for some assets, 
            // so we handle it gracefully.
            return cache.addAll(ASSETS).catch(err => console.log('Cache error:', err));
        })
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
