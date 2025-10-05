// file: sw.js
const CACHE_NAME = "myapp-cache-v11";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 🆕 Tambahan: kirim nama cache saat diminta
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GET_CACHE_NAME") {
    event.source.postMessage({
      type: "CACHE_NAME",
      value: CACHE_NAME
    });
  }
});
