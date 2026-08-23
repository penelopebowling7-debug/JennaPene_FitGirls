// sw.js — keeps the app openable with no signal.
// HTML and JS are served NETWORK-FIRST with a cache fallback: an update to the
// app is picked up on the very next load instead of one load late, which is
// what left a phone showing an old tracker after a repo upload (fixed
// 2026-08-23). Everything else (CSS, manifest, icons) stays cache-first for
// speed; Firebase and anything cross-origin always goes straight to the
// network so live sync is never served from a stale cache.
const CACHE = 'pj-fitness-v3';
const SHELL = [
  'index.html', 'tracker.html', 'tests.html', 'stats.html', 'progress.html',
  'styles.css', 'data.js', 'firebase-sync.js', 'app-shell.js', 'manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const fresh = e.request.mode === 'navigate' || /\.(html|js)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => {
      const live = fetch(e.request).then(res => {
        if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || live;
    })
  );
});
