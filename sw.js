const CACHE_NAME = 'apk-store-v5'; // Versão alterada para forçar refresh
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './favicon.ico',
    './favicon.png',
    './apple-touch-icon.png'
];

// Instalação - Estratégia Tolerante
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Tenta adicionar um por um para não quebrar se um arquivo faltar
            return Promise.allSettled(
                ASSETS.map(url => cache.add(url).catch(err => console.warn('Cache falhou para:', url)))
            );
        })
    );
});

// Ativação - Limpa caches antigos automaticamente
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Network First (Prioriza internet para dados do Supabase)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
