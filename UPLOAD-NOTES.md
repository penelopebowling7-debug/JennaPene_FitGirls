# Upload to penelopebowling7-debug/JennaPene_FitGirls (branch: main)

Drop these files into the repo root, replacing the existing ones.

## Batch 5 — full export feature + 7kg dumbbell fix (6 Sep)
- **progress.html** — new "Export everything for Claude" card at the top: a "📋 Copy everything" button and a "⬇️ Download as file" button, both producing the same document — equipment, notes, every fitness test result (merged with anything logged live), a per-week completed-workout summary, full per-exercise last/best history for both of you, modified versions in use, anything kept getting skipped, and your last 8 sessions. This replaces re-typing things into a Claude chat by hand. Equipment/notes now also update live on this page (previously only visible on the Tracker), and fitness test entries logged live are pulled in too, not just the ones baked into data.js.
- **data.js** — every "7.5 kg dumbbells" reference (Bulgarian Split Squat, Overhead Tricep Extension, Plank Pull Through, Renegade Row, and two week notes) corrected to "7 kg" — the actual dumbbell you have, not 7.5kg. This was wrong in Week 11 through Week 14.
- **progress.html / tracker.html** — fixed a real bug in `parseLoad()`: a weight written as "2 x 12 kg dumbbells" (e.g. Farmer Carry) was being read as "2" instead of "12" for personal-best tracking and the export/charts, since the old pattern grabbed the first number in the string rather than the actual per-item load. Now matches the "N x M kg" shape first.
- **tracker.html** — the Equipment & Notes panel's disclaimer now points to the new full export on the Progress page for the complete history and test results, and keeps its own quick "Copy for Claude" button for a fast equipment + recent-sessions brief mid-week.
- **stats.html** — added a one-line pointer to the new Progress export at the top of Fun Stats.

**Testing**: headless-browser (Playwright) verification — built the export text against seeded sample data (an archive entry with a "2 x 12 kg dumbbells" weight, confirmed it now reads 12kg not 2kg), confirmed the Copy button's clipboard content matches the built text exactly, confirmed the Download button triggers a real file download with the expected filename, confirmed no stale "7.5 kg" text remains anywhere on the Tracker page, and ran a full regression pass across all 5 pages (index/tracker/tests/progress/stats) confirming zero unexpected console errors (only the expected offline-Firebase noise and the optional audio files that don't exist yet, both already-documented and harmless).

## Batch 4 — Jenna in theme pink + energetic audio (23 Aug)
- **styles.css / tests.html** — Jenna's colour moved off amber (#C98500) to the theme's bright pink #F72585 (--coral-500). Still separates from Pene's purple on both hue and lightness, so charts stay readable.
- **tracker.html** — voice cues now have per-moment delivery profiles (hype / push / calm / count) and are read in beats rather than one flat line; 3-2-1 rising ticks before every phase change; the round-complete blip replaced with a rising chord; one shared AudioContext so iOS doesn't go silent mid-workout; bigger cue phrase pools.
- **Optional:** drop MP3s in an `audio/` folder and your own voice replaces the robot — see AUDIO-RECORDING-GUIDE.md in this zip.

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
