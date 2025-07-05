const CACHE_NAME = "daily-assist-cache-v1";
const urlsToCache = [
  "/daily-assist/",
  "/daily-assist/index.html",
  "/daily-assist/style.css",
  "/daily-assist/script.js",
  "/daily-assist/lang.js",
  "/daily-assist/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
