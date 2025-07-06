// service-worker.js
const cacheName = 'vasiverse-cache-v1';
const assets = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/early-access.html',
  '/privacy.html',
  '/terms.html',
  '/style.css',
  '/script.js',
  '/vault/vault.html',
  '/vault-gr.png',
  '/vasiverse-insider-qr.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))
    )
  );
});
