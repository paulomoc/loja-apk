var CACHE_NAME = 'apk-store-v6'; // Versão alterada para forçar refresh
var ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './favicon.ico',
    './favicon.png',
    './apple-touch-icon.png'
];

// Instalação - Estratégia Tolerante (ES5 para TV Box)
self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Tenta adicionar um por um para não quebrar se um arquivo faltar
            var promises = [];
            for (var i = 0; i < ASSETS.length; i++) {
                (function (url) {
                    promises.push(
                        cache.add(url).catch(function (err) {
                            console.warn('Cache falhou para:', url);
                        })
                    );
                })(ASSETS[i]);
            }
            return Promise.all(promises);
        })
    );
});

// Ativação - Limpa caches antigos automaticamente
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            var deletePromises = [];
            for (var i = 0; i < cacheNames.length; i++) {
                if (cacheNames[i] !== CACHE_NAME) {
                    deletePromises.push(caches.delete(cacheNames[i]));
                }
            }
            return Promise.all(deletePromises);
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// Fetch - Network First (Prioriza internet para dados do Supabase)
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});
