/**
 * ECITT PWA Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'ecitt-adult-tasks-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data.js',
    './manifest.json',
    '../graphics/buttons/button_dot.png',
    '../graphics/buttons/button_top.png',
    '../graphics/buttons/button_top_happy.png',
    '../graphics/buttons/button_mdl.png',
    '../graphics/buttons/button_mdl_happy.png',
    '../graphics/buttons/button_btm.png',
    '../graphics/buttons/button_btm_happy.png',
    '../graphics/icons/icon-192.png',
    '../graphics/icons/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app resources');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('[SW] Cache installation failed:', err);
            })
    );
});

// Activate event - clean up old caches
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
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request).then(response => {
                    // Cache new resources
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
            .catch(err => {
                console.error('[SW] Fetch failed:', err);
            })
    );
});

console.log('[SW] Service worker script loaded');
