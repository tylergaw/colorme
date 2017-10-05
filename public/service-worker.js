var cacheName = "colorme-cache-v1";
var urlsToCache = [
  ".",
  "index.html",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log("opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});
