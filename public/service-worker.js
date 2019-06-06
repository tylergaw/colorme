/* global clients */
const STATIC_CACHE_NAME = "colorme-v8";
const BASE_STATIC_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700"
];

// Builds the full array of static urls to cache. the %FOO% is replaced with
// a JSON.stringify'd array of urls pulled from the generated asset-manifest.
// See: scripts/generate-sw.js.
const STATIC_URLS = BASE_STATIC_URLS.concat(JSON.parse('%MANIFESTURLS%'));

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      // These aren't critical to the app
      // (not 100% sure I even need to cache the icons)
      cache.addAll([
        "/launcher-icon-48x48.png",
        "/launcher-icon-96x96.png",
        "/launcher-icon-192x192.png",
        "/launcher-icon-256x256.png",
        "/launcher-icon-384x384.png",
        "/launcher-icon-512x512.png"
      ]);

      // STATIC_URLS are mission critical.
      return cache.addAll(STATIC_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          // If the cache name is a ColorMe cache and it's not the one we just
          // created oninstall...
          .filter(name => name.includes("colorme") && name !== STATIC_CACHE_NAME)
          // then delete it.
          .map(name => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
