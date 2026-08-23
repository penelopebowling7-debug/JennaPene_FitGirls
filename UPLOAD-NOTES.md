# Upload to penelopebowling7-debug/JennaPene_FitGirls (branch: main)

Drop these files into the repo root, replacing the existing ones.

## Changed in this batch
- **tracker.html** — completed weeks drop off the week tabs; "n done ✓" chip to reveal them; Close week / Reopen week buttons; Weeks 11 & 12 closed once automatically; next-day finder skips closed weeks.
- **stats.html** — completed workout history condensed to one collapsible row per week (workouts, minutes, date span), newest week open.
- **firebase-sync.js** — added CloudSync.setCompletedDays so reopening a week syncs the removal to the other phone.

## Unchanged but included (so the folder is a complete, consistent app)
index.html, tests.html, progress.html, data.js, styles.css, app-shell.js, sw.js, manifest.webmanifest

## After uploading
Bump nothing else — sw.js caches by name, so hard-refresh once on each phone (or close and reopen the installed app twice) to pick up the new tracker.html and stats.html.
