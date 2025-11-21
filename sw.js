// sw.js - Antelope Boyz (no push, only basic caching)

// Change this if you ever want to bust old caches
const CACHE_NAME = "antelope-boyz-static-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./splash_bg.png",
  "./manifest.json"
  // (optional: add your logo_*.png files if you want them cached)
];

// Install: cache basic files for offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for our static assets, fallback to network
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

// IMPORTANT: no 'push' or 'notificationclick' handlers here.
// Even if FCM tries to push, there is no listener to show notifications.
