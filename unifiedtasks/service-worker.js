/**
 * ECITT PWA Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'ecitt-adult-tasks-v1';

// Static assets that are safe to cache-first (images rarely change)
const STATIC_ASSETS = [
    '../graphics/buttons/button_dot.png',
    '../graphics/buttons/button_top.png',
    '../graphics/buttons/button_top_happy.png',
    '../graphics/buttons/button_mdl.png',
    '../graphics/buttons/button_mdl_happy.png',
    '../graphics/buttons/button_btm.png',
    '../graphics/buttons/button_btm_happy.png',
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
    './data.js'
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
    const isAppFile = APP_FILES.some(f => url.pathname.endsWith(f.replace('./', '')));

    if (isAppFile) {
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
        // Cache-first for images and other static assets
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
