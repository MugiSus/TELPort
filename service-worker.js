const cacheName = "TELPort-test-v28";
const cacheFiles = [
    "/",
    "/call-button-send-cancel.svg",
    "/call-button-send.svg",
    "/call-button-tuning-cancel.svg",
    "/call-button-tuning.svg",
    "/call-file-icon-text.svg",
    "/call-file-icon.svg",
    "/call-mode-selector-file.svg",
    "/call-mode-selector-text.svg",
    "/call-text-send.svg",
    "/call-text-tuning.svg",
    "/elements-manager.js",
    "/Inconsolata_SemiExpanded-Regular.ttf",
    "/index.html",
    "/Inter-Regular.ttf",
    "/interwindow-arrow.svg",
    "/listen-button-receive-cancel.svg",
    "/listen-button-receive.svg",
    "/listen-button-tuning.svg",
    "/listen-file-icon-nofile-text.svg",
    "/listen-file-icon-nofile.svg",
    "/listen-file-icon.svg",
    "/listen-icon-verified.svg",
    "/listen-mode-selector-file.svg",
    "/listen-mode-selector-text.svg",
    "/listen-slider-thumb.svg",
    "/listen-text-receive.svg",
    "/listen-text-tuning.svg",
    "/manifest.json",
    "/recall-tester.js",
    "/src.js",
    "/startup-call-icon.svg",
    "/startup-call-title-ja.svg",
    "/startup-listen-icon.svg",
    "/startup-listen-title-ja.svg",
    "/startup-swipe-arrow-call.svg",
    "/startup-swipe-arrow-listen.svg",
    "/style.css",
    "/telport-logo-6-192x192-ios.png",
    "/telport-logo-6-192x192-maskable.png",
    "/telport-logo-6-192x192.png",
    "/telport-logo-6-512x512-maskable.png",
    "/telport-logo-6-512x512.png",
];

console.log(`[Service Worker] cacheName: ${cacheName}`);

self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log(`[Service Worker] Caching all: app shell and content`);
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetch');
    event.respondWith(
        caches.match(event.request).then(resource => {
            console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            return resource || fetch(event.request).then(async response => {
                return caches.open(cacheName).then(cache => {
                    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }),
    );
});
    
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key != cacheName) {
                        console.log(`[Service Worker] Deleting Cache: ${key}`)
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});
