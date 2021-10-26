const cacheName = "TELPort-test-v28";
const cacheFiles = [
    "/TELPort-app/",
    "/TELPort-app/call-button-send-cancel.svg",
    "/TELPort-app/call-button-send.svg",
    "/TELPort-app/call-button-tuning-cancel.svg",
    "/TELPort-app/call-button-tuning.svg",
    "/TELPort-app/call-file-icon-text.svg",
    "/TELPort-app/call-file-icon.svg",
    "/TELPort-app/call-mode-selector-file.svg",
    "/TELPort-app/call-mode-selector-text.svg",
    "/TELPort-app/call-text-send.svg",
    "/TELPort-app/call-text-tuning.svg",
    "/TELPort-app/elements-manager.js",
    "/TELPort-app/Inconsolata_SemiExpanded-Regular.ttf",
    "/TELPort-app/index.html",
    "/TELPort-app/Inter-Regular.ttf",
    "/TELPort-app/interwindow-arrow.svg",
    "/TELPort-app/listen-button-receive-cancel.svg",
    "/TELPort-app/listen-button-receive.svg",
    "/TELPort-app/listen-button-tuning.svg",
    "/TELPort-app/listen-file-icon-nofile-text.svg",
    "/TELPort-app/listen-file-icon-nofile.svg",
    "/TELPort-app/listen-file-icon.svg",
    "/TELPort-app/listen-icon-verified.svg",
    "/TELPort-app/listen-mode-selector-file.svg",
    "/TELPort-app/listen-mode-selector-text.svg",
    "/TELPort-app/listen-slider-thumb.svg",
    "/TELPort-app/listen-text-receive.svg",
    "/TELPort-app/listen-text-tuning.svg",
    "/TELPort-app/manifest.json",
    "/TELPort-app/recall-tester.js",
    "/TELPort-app/src.js",
    "/TELPort-app/startup-call-icon.svg",
    "/TELPort-app/startup-call-title-ja.svg",
    "/TELPort-app/startup-listen-icon.svg",
    "/TELPort-app/startup-listen-title-ja.svg",
    "/TELPort-app/startup-swipe-arrow-call.svg",
    "/TELPort-app/startup-swipe-arrow-listen.svg",
    "/TELPort-app/style.css",
    "/TELPort-app/telport-logo-6-192x192-ios.png",
    "/TELPort-app/telport-logo-6-192x192-maskable.png",
    "/TELPort-app/telport-logo-6-192x192.png",
    "/TELPort-app/telport-logo-6-512x512-maskable.png",
    "/TELPort-app/telport-logo-6-512x512.png",
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
