const cacheName = "TELPort-test-v28";
const cacheFiles = [
    "/app/",
    "/app/imgs/call-button-send-cancel.svg",
    "/app/imgs/call-button-send.svg",
    "/app/imgs/call-button-tuning-cancel.svg",
    "/app/imgs/call-button-tuning.svg",
    "/app/imgs/call-file-icon-text.svg",
    "/app/imgs/call-file-icon.svg",
    "/app/imgs/call-mode-selector-file.svg",
    "/app/imgs/call-mode-selector-text.svg",
    "/app/imgs/call-text-send.svg",
    "/app/imgs/call-text-tuning.svg",
    "/app/imgs/interwindow-arrow.svg",
    "/app/imgs/listen-button-receive-cancel.svg",
    "/app/imgs/listen-button-receive.svg",
    "/app/imgs/listen-button-tuning.svg",
    "/app/imgs/listen-file-icon-nofile-text.svg",
    "/app/imgs/listen-file-icon-nofile.svg",
    "/app/imgs/listen-file-icon.svg",
    "/app/imgs/listen-icon-verified.svg",
    "/app/imgs/listen-mode-selector-file.svg",
    "/app/imgs/listen-mode-selector-text.svg",
    "/app/imgs/listen-slider-thumb.svg",
    "/app/imgs/listen-text-receive.svg",
    "/app/imgs/listen-text-tuning.svg",
    "/app/imgs/startup-call-icon.svg",
    "/app/imgs/startup-call-title-ja.svg",
    "/app/imgs/startup-listen-icon.svg",
    "/app/imgs/startup-listen-title-ja.svg",
    "/app/imgs/startup-swipe-arrow-call.svg",
    "/app/imgs/startup-swipe-arrow-listen.svg",
    "/app/icons/TELPort-icon-72.png",
    "/app/icons/TELPort-icon-128.png",
    "/app/icons/TELPort-icon-192.png",
    "/app/icons/TELPort-icon-384.png",
    "/app/icons/TELPort-icon-512.png",
    "/app/elements-manager.js",
    "/app/Inconsolata_SemiExpanded-Regular.ttf",
    "/app/index.html",
    "/app/Inter-Regular.ttf",
    "/app/manifest.json",
    "/app/recall-tester.js",
    "/app/src.js",
    "/app/style.css",
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
