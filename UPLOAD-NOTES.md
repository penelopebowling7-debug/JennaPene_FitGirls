# Upload to penelopebowling7-debug/JennaPene_FitGirls (branch: main)

Drop these files into the repo root, replacing the existing ones.

## Batch 3 — home page said "Offline" (23 Aug)
- **index.html** — it never loaded firebase-sync.js, so the home screen's pill was *always* "Offline — saved here" even when sync was fine. Now loads the Firebase SDK + firebase-sync.js like the other pages.
- **app-shell.js** — the pill now shows a visible ⟳ so the force-refresh is discoverable; label shortened to "Offline".

## Batch 2 — stale-cache fix + reachable days (23 Aug)
- **sw.js** — cache name bumped to `pj-fitness-v3` (old cache is purged on activate) and HTML/JS now load NETWORK-FIRST with cache fallback. This is what caused a phone to keep showing an old tracker after an upload.
- **app-shell.js** — tap the sync pill in the header to force-refresh: clears the offline cache, unregisters the service worker, reloads from the server. Logged workouts are untouched.
- **tracker.html** — the "n done ✓" chip in the day row now reveals finished days, so a day is never unreachable; a finished day you reopen shows a clear note that it's a blank copy and the real numbers are archived.

## Batch 1 — completed weeks & condensed history
- **tracker.html** — completed weeks drop off the week tabs; "n done ✓" chip reveals them; Close week / Reopen week; Weeks 11 & 12 closed once automatically.
- **stats.html** — history condensed to one collapsible row per week.
- **firebase-sync.js** — `CloudSync.setCompletedDays` so reopening a week syncs.

## Unchanged but included (complete, consistent app)
index.html, tests.html, progress.html, data.js, styles.css, manifest.webmanifest

## On the phone after uploading
Open the app and tap the sync pill in the header → Force refresh. (Or: close the installed app, reopen twice.) After this upload, future changes appear on the next load with no clearing needed.
