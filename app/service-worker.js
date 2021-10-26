const cacheName = "TELPort-test-v28";
const cacheFiles = [
    "/app/",
    "/app/call-button-send-cancel.svg",
    "/app/call-button-send.svg",
    "/app/call-button-tuning-cancel.svg",
    "/app/call-button-tuning.svg",
    "/app/call-file-icon-text.svg",
    "/app/call-file-icon.svg",
    "/app/call-mode-selector-file.svg",
    "/app/call-mode-selector-text.svg",
    "/app/call-text-send.svg",
    "/app/call-text-tuning.svg",
    "/app/elements-manager.js",
    "/app/Inconsolata_SemiExpanded-Regular.ttf",
    "/app/index.html",
    "/app/Inter-Regular.ttf",
    "/app/interwindow-arrow.svg",
    "/app/listen-button-receive-cancel.svg",
    "/app/listen-button-receive.svg",
    "/app/listen-button-tuning.svg",
    "/app/listen-file-icon-nofile-text.svg",
    "/app/listen-file-icon-nofile.svg",
    "/app/listen-file-icon.svg",
    "/app/listen-icon-verified.svg",
    "/app/listen-mode-selector-file.svg",
    "/app/listen-mode-selector-text.svg",
    "/app/listen-slider-thumb.svg",
    "/app/listen-text-receive.svg",
    "/app/listen-text-tuning.svg",
    "/app/manifest.json",
    "/app/recall-tester.js",
    "/app/src.js",
    "/app/startup-call-icon.svg",
    "/app/startup-call-title-ja.svg",
    "/app/startup-listen-icon.svg",
    "/app/startup-listen-title-ja.svg",
    "/app/startup-swipe-arrow-call.svg",
    "/app/startup-swipe-arrow-listen.svg",
    "/app/style.css",
    "/app/telport-logo-6-192x192-ios.png",
    "/app/telport-logo-6-192x192-maskable.png",
    "/app/telport-logo-6-192x192.png",
    "/app/telport-logo-6-512x512-maskable.png",
    "/app/telport-logo-6-512x512.png",
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
