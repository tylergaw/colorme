// import the manifest object that react-scripts creates. We'll use the values
// to populate the urlsToCache in our service worker.
const manifest = require('../build/asset-manifest.json');
const fs = require('fs');
const swPath = 'build/service-worker.js';

// Build a CSV of the urls we want to cache from the generated manifest.
const urlsCSV = Object.keys(manifest)
  // We don't want to cache the sourcemaps so we filter them out.
  .filter(k => !k.includes('.map'))
  // map() because not ready to upgrade node to get Object.values()
  .map(k => manifest[k]);

fs.readFile(swPath, "utf8", (err, data) => {
  if (err) {
    return console.log("Error trying to read SW file", err);
  }

  // Replaces the special string in the service worker with the CSV.
  const result = data.replace("%MANIFESTURLS%", JSON.stringify(urlsCSV));

  fs.writeFile(swPath, result, "utf8", err => {
    if (err) {
      return console.log("Error trying to write SW file", err);
    }
  });
});
