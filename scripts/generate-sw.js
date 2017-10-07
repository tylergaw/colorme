// import the manifest object that react-scripts creates. We'll use the values
// to populate the urlsToCache in our service worker.
const manifest = require("../build/asset-manifest.json");
const fs = require("fs");
const swPath = "build/service-worker.js";

fs.readFile(swPath, "utf8", (err, data) => {
  if (err) {
    return console.log("Error trying to read SW file", err);
  }

  // Find our special strings and replace them with their matching values
  // from the asset-manifest.
  // This isn't flexible, we'd have to add another string to the sw.js and and
  // the replacement here, but that's OK for the purposes of this project.
  let result = data.replace("%MAINJS%", manifest["main.js"])
    .replace("%MAINCSS%", manifest["main.css"])
    .replace("%BGIMG%", manifest["static/media/bgTransparent.svg"]);

  fs.writeFile(swPath, result, "utf8", err => {
    if (err) {
      return console.log("Error trying to write SW file", err);
    }
  });
});
