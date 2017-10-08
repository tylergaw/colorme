/* global clients */
const STATIC_CACHE_NAME = "colorme-v3";
const STATIC_URLS = [
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
  // NOTE: These %FOO% are special strings to be replaced with our build script
  // See: scripts/generate-sw.js.
  "%MAINJS%",
  "%MAINCSS%",
  "%BGIMG%"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(STATIC_URLS))
  );
});

self.addEventListener("activate", event => {
  if (self.clients && clients.claim) {
    clients.claim();
  }

  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log("On Activate the caches are", cacheNames);
      return Promise.all(
        cacheNames
          // If the cache name is a ColorMe cache and it's not the one we just
          // created oninstall...
          .filter(name => name.includes("colorme") && name !== STATIC_CACHE_NAME)
          // then delete it.
          .map(name => {
            console.log("Deleting cache named", name);
            return caches.delete(name);
          })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
