// Service worker disabled - app runs without caching (Feb 2026)
// The application now operates without service worker to eliminate cache dependency.
// Cache functionality removed to focus on reliability over offline capability.

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
