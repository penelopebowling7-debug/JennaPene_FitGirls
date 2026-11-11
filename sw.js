// sw.js — keeps the app openable with no signal.
// HTML and JS are served NETWORK-FIRST with a cache fallback: an update to the
// app is picked up on the very next load instead of one load late, which is
// what left a phone showing an old tracker after a repo upload (fixed
// 2026-08-23). Everything else (CSS, manifest, icons) stays cache-first for
// speed; Firebase and anything cross-origin always goes straight to the
// network so live sync is never served from a stale cache.
const CACHE = 'pj-fitness-v31';
const SHELL = [
  'index.html', 'tracker.html', 'beast.html', 'tests.html', 'stats.html', 'progress.html',
  'styles.css', 'data.js', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'firebase-sync.js', 'app-shell.js', 'tabata.js', 'coach-voice.json', 'manifest.webmanifest'
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

// Batch 47 (11 Nov): every HTML/JS request now asks the server "has this
// changed?" (cache: 'no-cache'). Before, fetch() let the phone's own browser
// cache answer for up to 10 minutes (GitHub Pages sends max-age=600), so new
// workouts took 10 to 20 minutes to appear. The check is tiny (a 304 when
// nothing changed). If the network is slow (over 4 sec) the saved copy is
// shown so the gym never waits on bad signal; the fresh copy is still saved
// for next time.
const FRESH_TIMEOUT_MS = 4000;
function fetchFresh(url) {
  return fetch(url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
    if (res && res.status === 200) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(url, copy));
    }
    return res;
  });
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const fresh = e.request.mode === 'navigate' || /\.(html|js|json)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    const key = url.origin + url.pathname; // ignore ?fresh=... so the cache still matches
    e.respondWith((async () => {
      const net = fetchFresh(key);
      const cached = await caches.match(key);
      if (!cached) return net.catch(() => caches.match(e.request));
      const slow = new Promise(r => setTimeout(() => r(cached), FRESH_TIMEOUT_MS));
      return Promise.race([net.catch(() => cached), slow]);
    })());
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => {
      const live = fetch(e.request, { cache: 'no-cache' }).then(res => {
        if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || live;
    })
  );
});
