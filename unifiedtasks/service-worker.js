/**
 * ECITT PWA Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'ecitt-adult-tasks-v7';

// Static assets that are safe to cache-first (images rarely change)
const STATIC_ASSETS = [
    '../graphics/buttons/button_dot.png',
    '../graphics/buttons/button_left.png',
    '../graphics/buttons/button_left_happy.png',
    '../graphics/buttons/button_mdl.png',
    '../graphics/buttons/button_mdl_happy.png',
    '../graphics/buttons/button_right.png',
    '../graphics/buttons/button_right_happy.png',
    '../graphics/icons/icon-192.png',
    '../graphics/icons/icon-512.png',
    './manifest.json'
];

// App files that should always be fresh (network-first)
const APP_FILES = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data.js',
    './js/dev-flags.js',
    './js/zoom-guard.js',
    './js/task-configs.js',
    './js/task-sequences.js',
    './js/trial-sequence.js',
    './js/protocol-config.js',
    './js/timing-config.js',
    './js/app-state.js',
    './js/sprite-sheet.js',
    './js/media-helpers.js',
    './js/screens.js',
    './js/operator-controls.js',
    './js/session-setup.js',
    './js/task-loader.js',
    './js/trial-flow.js',
    './js/nirs-baseline.js',
    './js/block-flow.js',
    './js/calibration.js',
    './js/photocell.js',
    './js/recording.js',
    './js/reward-animation.js',
    './js/orientation.js',
    './js/debug-monitor.js',
    './js/debug-log.js'
];

// Install event - pre-cache everything
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app resources');
                return cache.addAll([...APP_FILES, ...STATIC_ASSETS]);
            })
            .catch(err => {
                console.error('[SW] Cache installation failed:', err);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network-first for app files, cache-first for static assets
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    // Exact match against the app files. (The old endsWith() test matched './' as '' and so
    // treated EVERY request as an app file, sending animation frames to the network each time.)
    const appPaths = APP_FILES.map(f => new URL(f, self.registration.scope).pathname);
    const isAppFile = appPaths.includes(url.pathname);
    // Only images are served cache-first. Audio/video stay network-first because Safari
    // requests them with Range headers, which a cached full response would break.
    const isImage = event.request.destination === 'image' || /\.(png|jpe?g|gif|webp|ico)$/i.test(url.pathname);

    if (isAppFile || !isImage) {
        // Network-first: always try to get fresh version, fall back to cache
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                    }
                    return response;
                })
                .catch(() => {
                    console.log('[SW] Network failed, serving from cache:', event.request.url);
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-first for images (button faces, reward animation frames, sprites)
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                        return response;
                    });
                })
                .catch(err => {
                    console.error('[SW] Fetch failed:', err);
                })
        );
    }
});

console.log('[SW] Service worker script loaded');
