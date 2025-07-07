const CACHE_NAME = "vasiverse-cache-v1";
const OFFLINE_URL = "/offline.html"; // optional fallback page

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  OFFLINE_URL, // only if you create an offline fallback page
];

// Install — cache all required assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate — cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve cached assets, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // If offline and can't fetch, return fallback page (optional)
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        })
      );
    })
  );
});
