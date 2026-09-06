# Upload to penelopebowling7-debug/JennaPene_FitGirls (branch: main)

Drop these files into the repo root, replacing the existing ones.

## Batch 9 — Arm Finisher never had a timer or explicit reps (6 Sep)
Pene noticed Tuesday's Arm Finisher block has no timer and doesn't tell you how many reps to do. Real bug, not a design choice — it's been like this since Week 11.

**Root cause**: every other timed block's tempo string looks like "40 sec active / 20 sec rest" or, for the old rep-based Push Up Block, "10 reps, 20 sec rest" — both formats the app's tempo parser understands, so it shows a working "▶ Start Round Timer" button. Arm Finisher's tempo has only ever said "15 reps" — no rest value — which the parser doesn't recognize as anything, so the button never appeared for this block, in any week, ever. On top of that, the "15 reps" figure only ever showed as a small label next to the block's name; the individual exercise cards themselves just said "2 rounds" with no rep count at all, easy to miss.

**Fixed, across every week (11 through 16)**:
- Arm Finisher's tempo is now "15 reps, 20 sec rest between exercises" — the same format Push Up Block used successfully, so the guided timer now works properly: "▶ Start Round Timer — 4 exercises (20s rest)", walking through each exercise at your own pace and cueing the 20-second rest between them.
- Every rep-based exercise in the block (Hammer Curls/Tricep Kick Backs in Weeks 11-13, EZ Bar Bicep Curl/Skull Crusher in Weeks 14-16, and Plank Pull Through throughout) now states its own qty as "2 rounds, 15 reps" directly on the card, not just in the small block header. Plank Hold is untouched since it's a timed hold, not reps — "Beat last week's time" already covers it.

**Testing**: confirmed via Playwright that the "Start Round Timer" button now renders for Arm Finisher in both Week 15 and Week 16 with the correct exercise count and rest time, confirmed every affected exercise card now shows its rep count explicitly, and ran the full 5-page regression — zero unexpected console errors.

## Batch 8 — Week 16 holds steady, doesn't progress (6 Sep)
Pene's call right after Batch 7 shipped: "I think week 16 should not progress higher weights, we didn't manage to complete everything in week 14. That's the sort of stuff I want you to be looking at and making adjustments so that our progress is steady not unsuccessful."

This was a real miss worth naming plainly: Week 14 wasn't fully completed, and Week 15 (built on top of it) hadn't even been attempted yet when Week 16 stacked a further round of load increases on top — three weeks of progression queued up with no real-world check that any of them actually landed. That's backwards. **Week 16 has been rebuilt to hold every weight and tempo exactly at Week 15's numbers** — no increases anywhere — so there's one full week to actually execute successfully at the current loads before pushing further. Every exercise across Monday, Tuesday, and Thursday now matches Week 15's Monday/Tuesday/Friday numbers exactly (just Thursday instead of Friday, since there's no travel this time). Day notes explain why: the priority is a completed week at these loads, not another jump.

**Going forward**: progression isn't automatic week-to-week anymore by default — it should reflect whether the previous week was actually completed. When real completion/execution data isn't available (skipped rounds, difficulty ratings, notes), the safer default is to hold rather than assume readiness to progress.

**Testing**: confirmed programmatically that Week 16's Monday/Tuesday exactly match Week 15's Monday/Tuesday, and Week 16's Thursday exactly matches Week 15's Friday, weight-for-weight and tempo-for-tempo. Re-ran the full Playwright regression — zero unexpected console errors across all 5 pages, Week 16 shows exactly Monday/Tuesday/Thursday with no Friday, and every weight input renders the held-steady number correctly in both Pene's and Jenna's boxes.

## Batch 7 — light bar plates confirmed, Week 15 finalized, Week 16 built (6 Sep)
Pene confirmed the two things Week 15 was waiting on: the EZ bar and "light bar" plates are both matched pairs (not singles), and there's no Wed/Thu work travel in the coming week, so Week 16 is a rest-of-Friday normal week.

- **Week 15 finalized**: the light bar (used for Romanian Deadlift and Barbell Deadlift) is confirmed at ~1kg empty with matched-pair plates (2.5/1.25/5kg each side) — loaded with everything available, that's **18.5kg total, the max this bar can currently hold**. Both lifts are now set to that number (previously held at Week 14's 20kg / 18-20kg, which turns out not to have been achievable on this bar). Both day notes updated to drop the "still confirming plate count" language since it's resolved.
- **Week 16 built (Mon 14, Tue 15, Thu 17 Sep)** — back to the normal Mon/Tue/Thu split, no Friday, since the travel that shifted Week 15 to Friday doesn't recur:
  - **Monday**: Goblet Squat to 15kg, Bulgarian Split Squat to a 10kg pair, Single Leg Glute Bridge to a 7kg dumbbell. Romanian Deadlift stays at the light bar's 18.5kg max — progressing via tempo (4 sec lower + 2 sec pause) instead of load, since the bar's maxed out.
  - **Tuesday**: Shoulder Press to a 10kg pair, Floor Press to 12.5kg, Overhead Tricep Extension and both Single Arm Rows to 10kg, Band Face Pulls up a band level to 18.2kg. First real added load on both EZ bar moves now the plates are confirmed pairs — Bicep Curl to a 1.5kg plate each side (~16kg total), and Skull Crusher gets its first plate too (0.5kg each side, ~14kg total). Plank Pull Through to a 9kg pair.
  - **Thursday** (built from Week 15's Friday Conditioning content, back in its normal slot): kept at 3 rounds per Pene's own "felt like enough" feedback, progressing via load instead — Renegade Row to a 9kg pair, Farmer Carry to 2 x 15kg, Goblet Squat to 10kg. Kettlebell Swing stays at the only kettlebell owned (4kg), progressing via continuous reps instead of load. Barbell Deadlift is the same light bar as Monday, so it's at the same 18.5kg max.

**Testing**: re-ran the full Playwright regression — confirmed Week 15's Monday and Friday both show the finalized 18.5kg bar weight in both input boxes; confirmed Week 16 shows exactly Monday/Tuesday/Thursday tabs with no Friday; confirmed every Week 16 exercise renders its correct progressed weight in both Pene's and Jenna's input boxes; confirmed the Progress page's export still builds without errors with Week 16 in the data; confirmed zero unexpected console errors across all 5 pages.

## Batch 6b — correction: all dumbbells are pairs, RDL bar is ~1kg (6 Sep)
Pene corrected two things right after Batch 6 went out: every dumbbell weight is actually a matching PAIR (the 5kg set alone is two pairs, four dumbbells), not singles as first assumed — and the straight bar used for RDL/Deadlift weighs only about 1kg, much lighter than assumed. Week 15 updated accordingly:
- **Monday**: Bulgarian Split Squat back to a normal bilateral hold, now a real 9kg pair (was wrongly rebuilt as a single-dumbbell goblet-style hold in Batch 6).
- **Tuesday**: Shoulder Press (9kg pair) and Floor Press (10kg pair) both back to normal bilateral holds (were wrongly rebuilt as single-arm in Batch 6). Plank Pull Through bumped to a real 7kg pair.
- **Friday**: Renegade Row bumped to a real 7kg pair. Farmer Carry back to a normal two-hand carry at 2 x 12.5kg (was wrongly rebuilt as a single-arm Suitcase Carry in Batch 6).
- Romanian Deadlift and Barbell Deadlift weight labels now say "~1kg bar + plates" for clarity, still holding at Week 14's totals (20kg / 18-20kg) pending confirmation of exactly how many plates of each size she has for that bar — the 1kg bar figure alone doesn't say whether 20kg total is achievable or how much further it could go.
- The single-arm exercise variants added in Batch 6 (S006, C006, CD014) are left in the Exercise Library in case they're useful for deliberate unilateral variety later, they're just not used in Week 15 anymore.

**Testing**: re-ran the same Playwright checks — confirmed every corrected exercise now shows the right bilateral weight in both input boxes, confirmed zero unexpected console errors across all 5 pages.

## Batch 6 — Week 15 built from your real equipment list (6 Sep)
- **data.js** — Week 15 added (Mon 7, Tue 8, Fri 11 Sep — Wed/Thu moved to Friday for this week's work travel). Built directly from your real dumbbell/kettlebell/EZ bar/band list rather than round-number guesses:
  - Monday: Goblet Squat up to 12.5kg. Bulgarian Split Squat rebuilt as a single-dumbbell goblet-style hold at 9kg (it was written as a bilateral two-dumbbell hold, but the only matching PAIR you own is the 5kg set — this fix also means it can keep progressing past a 5kg-per-hand ceiling). Athletic Circuit and Core both add a round.
  - Tuesday: Push Up Block removed for good, per your call — Strength stays at 3 rounds rather than adding volume elsewhere to compensate. Shoulder Press and Floor Press rebuilt as single-arm (alternating each rep) for the same matched-pair reason as Monday's split squat — lets you use a real heavier dumbbell per rep. **Real correction worth knowing**: your EZ bar weighs about 13kg empty, more than the "10kg total" this block assumed for two weeks — so you've been lifting more than the app said. Numbers now start from that real baseline.
  - Friday (was Thursday): Conditioning Circuit deliberately 3 rounds, not 4 — your own note said the 4th round got cut for time but felt like enough anyway, so this matches your real capacity rather than being a step back. Farmer Carry rebuilt as a single-arm Suitcase Carry (swap arms each round) — the old "2 x 12kg" wasn't a weight or a pair you actually own; this version uses a real 15kg dumbbell. Renegade Row keeps its two-dumbbell hold, capped at your 5kg pair, progressing via a paused tempo instead of more load.
  - Band Face Pulls, Russian Twist, and Plank Pull Through now reference your actual band set (13.6kg) and Med Ball (4kg) instead of generic placeholders.
  - Three new exercise library entries added (S006, C006, CD014) for the single-arm variants.
- **Still pending your confirmation**: Romanian Deadlift (Monday) and Barbell Deadlift (Friday) both hold at their Week 14 numbers rather than progressing, because they depend on your "light bar"'s own unloaded weight, which wasn't in your equipment list — tell Claude that number and these get corrected precisely.
- **Week 16 not built yet** — depends on whether the Wed/Thu travel is just this week or recurs.

**Testing**: headless-browser (Playwright) against the real cloned repo — confirmed Week 15 shows Monday/Tuesday/Friday tabs (no Wednesday/Thursday); confirmed every redesigned exercise (goblet-style split squat, single-arm shoulder press and floor press, single-arm Suitcase Carry) renders with its correct weight in both Pene's and Jenna's input boxes; confirmed the Push Up Block is completely gone from Tuesday; confirmed the EZ bar correction note and real starting loads render; confirmed zero unexpected console errors across all 5 pages; confirmed the Progress page's export still builds correctly with Week 15 in the data.

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
