var cacheName = "colorme-cache-v1";
var urlsToCache = [
  "/manifest.json",
  "/launcher-icon-48x48.png",
  "/launcher-icon-96x96.png",
  "/launcher-icon-192x192.png",
  "/launcher-icon-256x256.png",
  "/launcher-icon-384x384.png",
  "/launcher-icon-512x512.png",
  "/",
  "/index.html",
  "/index.html?utm_source=homescreen",
  "/?utm_source=homescreen",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700",
  "%MAINJS%",
  "%MAINCSS%",
  "%BGIMG%"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
