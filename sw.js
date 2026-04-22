const CACHE = "pwa-v1";

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>{
      return c.addAll([
        "./",
        "index.html",
        "login.html",
        "style.css",
        "app.js",
        "manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
