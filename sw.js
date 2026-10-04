// Offline cache for the mushaf (all pages of both riwayat).
const CACHE = "mushaf-flat-255ab6772c83";
const FILES = ["./", "index.html", "warsh.json.txt", "warsh.glyphs.txt", "warsh.words.txt", "warsh.search.txt", "shubah.json.txt", "shubah.glyphs.txt", "shubah.words.txt", "shubah.search.txt", "hafs.ttf.txt", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "manifest.webmanifest"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  })));
});
