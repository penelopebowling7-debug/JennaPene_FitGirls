# Upload to penelopebowling7-debug/JennaPene_FitGirls (branch: main)

Drop these files into the repo root, replacing the existing ones.

## Batch 20: train apart, record separately (26 Sep)
Pene: "I want us to be able to record separately." Needed for Week 18, with Pene in hotels and Jenna at home.

**Built**: a "Training:" switch under the day tabs on the Tracker, with three options, remembered per phone.
- **Together**: exactly how it has always worked, one shared session, both of you on screen.
- **Pene solo / Jenna solo**: that phone shows only your own rows, keeps your own ticks, warm up, cool down and timer, and has its own Finish Workout. Each solo record is saved to its own cloud field (progressJson_pene / progressJson_jenna) so two phones training at the same time never overwrite each other, and the other phone changing days never moves your screen.
- A day finished solo drops off the tabs only for that person. A day finished together still counts for both.
- Solo sessions are archived with who: 'pene' or 'jenna' (together sessions are who: 'both'). Progress counts each person's own sessions (together plus their own solo ones), Fun Stats history tags solo sessions ("Pene solo"), and both export-to-Claude features name them.

**Testing**: headless browser (Playwright): Together shows both people's rows, Pene solo shows only Pene's with a solo banner, a tick in Pene solo saves only to Pene's record (the together record stays untouched), Jenna solo shows none of Pene's ticks, finishing Monday as Pene solo archives who: 'pene' with only Pene's numbers and moves Pene on to Tuesday while Jenna and Together both stay on Monday, Fun Stats and Progress load with the new entry, zero page errors.

## Batch 19: Week 18 travel week, all bodyweight Pilates, yoga and running (26 Sep)
Pene: travelling for work in hotels that may or may not have a gym, Jenna at home with no gym. Wanted Pilates core (reverse plank leg lifts, plank hip twists, foam roller plank pike, plank to downward dog), yoga that runs on the phone, and a jog or run. No weights. Goal: lean, toned summer bodies.

**Week 18 (Mon 28, Tue 29 Sep, Thu 1 Oct)**, every block runs on the guided round timer:
- **Monday, Pilates Sculpt: Glutes & Core**: Pilates Lower Burn (squat pulses, reverse lunge to knee drive, single leg glute bridge left and right, side lying leg lifts left and right) plus Pilates Flat Tummy Core (reverse plank leg lifts, plank hip twists, plank pike with foam roller or towel slide, plank to downward dog, Pilates hundred). Quiet, no jumping, hotel friendly.
- **Tuesday, Bodyweight Upper + Yoga Flow**: push ups (full to knees), chair or bed edge tricep dips, superman Y-T-W, pike push ups, plank up downs, bear plank shoulder taps, then a 2 round timed yoga flow (downward dog, low lunge both sides, warrior 2 both sides, chair, boat, cobra).
- **Thursday, Run Intervals + Pilates Core**: 6 rounds of 1 min run plus 1 min recovery walk, then a Pilates core finisher (criss cross, toe taps, side plank hip lifts both sides, swimming, reverse plank leg lifts).
- Left and right sides are separate cards so the timer gives each side its own turn (same lesson as Batch 18).
- 25 new Exercise Library entries (PL001 to PL012, BW001 to BW006, YG001 to YG005, RN001, RN002).

**Testing**: headless browser (Playwright) against the real cloned repo: Week 18 tab renders with Monday, Tuesday, Thursday; all six round timer buttons render with the right exercise counts and timings; zero page errors (only the known optional audio file 404s).

## Batch 18 — Week 17 Tuesday: Single Arm Row timer fixed, EZ bar clash removed, two big circuits instead of four (22 Sep)
Pene, on the actual workout day: "There needs to be separation in the arm finisher, we can't both use the ez bar. Also the first section... no even split for us to rotate the exercises with the limited equipment... over the arm band pull... High knees and star jumps are fine but it feels like rather than one or two circuits we have multiple mini circuits." Followed up: the "no even split" complaint was actually about Single Arm Row — "the timer won't work if there are two exercises planned for that, as in left arm then right arm."

**The Single Arm Row bug**: Batch 12 merged the Left/Right cards into one "(Alternating)" card to reduce clutter. That's exactly what broke the guided timer — the app gives each exercise card ONE timed work step per round (45 sec, in this block), so an alternating card was cramming both arms into a single 45-second window instead of giving each arm its own turn. Split back into two separate cards, **Single Arm Row (Left Arm)** and **Single Arm Row (Right Arm)**, same 9kg dumbbell, same tempo — now each arm gets its own full 45-second round timer step, properly.

**Built**:
- **Strength & Cardio** (merged, was "Strength" + "Cardio Burst"): Dumbbell Shoulder Press, Dumbbell Chest Fly, Dumbbell Pullover, Single Arm Row (Left Arm), Single Arm Row (Right Arm), High Knees, Star Jumps — 3 rounds, 45s/15s, one continuous circuit. Band Face Pulls dropped per Pene's "I'm over the arm band pull."
- **Arm & Ab Finisher** (merged, was "Arm Finisher" + "Ab Finisher"): EZ Bar Bicep Curl, Tricep Kick Backs, Plank Pull Through, Med Ball Slam, Bicycle Crunch — 2 rounds, 15 reps/20s rest between exercises. Skull Crusher swapped out for Tricep Kick Backs (5kg dumbbells, its old Week 11-13 identity) so the EZ bar is only needed for one exercise, not two — you're never both waiting on the single bar at once.
- Four blocks down to two, per Pene's pick of "two bigger circuits" over a single mega-circuit or just trimming the existing four.
- Two new Exercise Library entries: B008 Single Arm Row (Left Arm), B009 Single Arm Row (Right Arm).

**Testing**: headless-browser (Playwright) against the real cloned repo (which turned out to already be at Batch 17, five batches ahead of the project doc's last note at Batch 11 — same "clone first" lesson from earlier in this project, applied again). Confirmed both round timer buttons render correctly ("7 exercises (45s work / 15s rest)" and "5 exercises (20s rest)"), confirmed Band Face Pulls and EZ Bar Skull Crusher are gone from the rendered page, confirmed every other exercise (including both new Single Arm Row cards) renders correctly for both Pene and Jenna, confirmed zero console errors, visually confirmed via screenshot.

**Delivered**: a corrected 14-file zip (supersedes the Batch 17 zip) via the usual manual upload workflow.

## Batch 17 — Week 17 Tuesday Strength: variety swapped in (20 Sep)
Pene: "The Tuesday the upper body first strength circuit is the same and I'm looking for variety." Fair — Week 17's Tuesday Strength block was carrying over the same 5 moves from Week 16, just at eased weights.

**Swapped in Week 17's Tuesday Strength**:
- Dumbbell Floor Press → **Dumbbell Chest Fly** (chest, shoulders) — 5kg pair, deliberately not the same weight as Shoulder Press (7kg), so both bilateral pair exercises don't compete for the same dumbbells mid-circuit (the exact clash from Batch 13).
- Overhead Tricep Extension → **Dumbbell Pullover** (lats, chest, triceps) — a fresh hybrid move, single dumbbell at 9kg, same weight as Single Arm Row but that's fine since both are single-implement (one pair covers two people).
- Shoulder Press, Single Arm Row, Band Face Pulls unchanged.

Day note rewritten in the short format from Batch 16 — one line per new exercise, muscle group only.

**Delivered**: a corrected 14-file zip (supersedes the Batch 16 zip) via the usual manual upload workflow.

## Batch 16 — Week 17 Monday: Goblet Squat and RDL swapped, day notes now short (20 Sep)
Pene: "I want to change out the goblet squat and rdl on the Monday. Let's do some new things." Plus a standing instruction for every future new exercise: the day note should briefly name the muscle group or benefit, not run long the way notes have been.

**Swapped in Week 17's Monday Strength Circuit**:
- Goblet Squat → **Kettlebell Sumo Squat** (glutes, inner thighs, quads) — first time the kettlebell's been used for a squat rather than just swings.
- Romanian Deadlift → **Single Leg RDL** (hamstrings, glutes, balance) — a dumbbell unilateral variant, sidesteps the light bar's maxed-out 18.5kg ceiling entirely.
- Curtsy Lunge and Step Up onto Block unchanged.

**Day notes are now short by default going forward** — one line per new exercise naming the muscle group or benefit, nothing more. Monday's note is now 5 short lines instead of a paragraph. Applying this format to all new exercises from here on, not just this one.

**Delivered**: a corrected 14-file zip (supersedes the Batch 15 zip) via the usual manual upload workflow.

## Batch 15 — real cardio added, core coverage confirmed, Week 16 and Week 17 (15 Sep)
Pene: "Can we make sure we work our core, I would like more aerobic or cardio, get our bodies moving. I'm not sure but I feel like we have just been doing weights?" A fair read of the program as it stood — worth checking properly rather than just reassuring her.

**What was actually true**: Monday already covers this well (Athletic Circuit is bodyweight cardio-style work — Skipping Rope, Broad Jump, Lateral Bound, Mountain Climbers — plus a dedicated Core block). Thursday had a Core Finisher and a cardio finisher, but that finisher was marked **optional**, so it was easy to skip past exactly when time got tight — which, given the recent "ran out of time" pattern, it probably was. Tuesday was the real gap: Strength, Arm Finisher, and a small Ab Finisher at the end, but genuinely zero dedicated cardio beyond the 2-minute warmup jog.

**Fixed, applied to both Week 16 Thursday (still upcoming) and Week 17 (all three days)**:
- **Thursday's cardio finisher is no longer optional.** Renamed "Cardio Finisher," bumped from 5 to 6-8 minutes, and it's now just part of the session rather than a bonus that's easy to drop.
- **Tuesday gets a new "Cardio Burst" block**: 2 rounds of High Knees and Star Jumps, about 4 minutes total, placed right after Strength and before Arm Finisher. Star Jumps is a new Exercise Library entry (CD019); High Knees already existed (CD006).
- **Monday needed nothing added** — its existing Athletic Circuit and Core block already do what Pene's asking for, noted directly in Monday's day note so it's clear that side of the program was already covered, not overlooked.
- Tuesday's estimated time nudged up slightly (50-55 min) to reflect the added block, still well under the pre-trim 60-65 min sessions from before Batch 12.

**Testing**: same Node-level structural validation as recent batches — every week's blocks/exercises still follow the same schema, `data.js` syntax verified, both Week 16 and Week 17's Thursday and Tuesday blocks confirmed to contain the new content. Full in-browser Playwright regression still not run this session, same honest caveat as recent batches.

**Delivered**: a corrected 14-file zip (supersedes the Batch 14 zip) via the usual manual upload workflow.

## Batch 14 — Week 16 Thursday refreshed too, same boredom fix, brought forward (15 Sep)
Pene: "Can we change the Thursday for week 16 too. I'm bored and I don't feel like working out because I'm bored with it." Week 16's Thursday session hasn't happened yet and comes before Week 17 does, so the same freshness fix built for Week 17 Thursday is brought forward onto this one now rather than making her wait a week for it.

**Built** — Week 16 Thursday gets the identical treatment Week 17 Thursday already got:
- Conditioning Circuit trimmed from 8 exercises to 5 (Renegade Row, the extra Goblet Squat and Plank Jacks rest this week, not deleted).
- Core Finisher swaps Mountain Climber Twist for Flutter Kicks.
- New optional "Fun Cardio Finisher" block added: 5 minutes of easy jog or skipping rope, entirely optional.
- **Weights untouched** — this is purely a variety and session-length fix, not a load change; Week 16 was already holding steady at Week 15's numbers per Batch 8, and that stays exactly as it was.

**Testing**: same Node-level structural validation as Batch 12 — every week's blocks/exercises still follow the same schema, `data.js` syntax verified. Full in-browser Playwright regression still not run this session, same honest caveat as Batch 12.

**Delivered**: a corrected 14-file zip (supersedes the Batch 13 zip) via the usual manual upload workflow.

## Batch 13 — Week 17 Tuesday: real dumbbell clash fixed before it happens again (15 Sep)
Pene, straight after completing Week 16 Tuesday in full: "we had to move the overhead tricep extension dumbbell shoulder press and dumbbell floor press back to 7kg because the arm rows used the 9kg. Which felt just right today, we didn't feel very strong but got everything done." Week 16 Tuesday and Monday are both now marked complete for the first time in a while — genuinely good news, worth noting.

**The real issue**: you and Jenna train side by side at the same time, but only one pair exists of most dumbbell weights (5kg is the only weight with two owned pairs). When two exercises in the same session both call for 9kg, only one 9kg pair is actually available between the two of you, so something has to give. Today that was Shoulder Press, Floor Press and Overhead Tricep Extension all easing to 7kg while Single Arm Row kept the 9kg — and it worked, felt right, everything got done.

**Fixed directly in Week 17's Tuesday** (before it gets uploaded and hits the same clash): Dumbbell Shoulder Press, Dumbbell Floor Press and Overhead Tricep Extension all set to 7kg to match what you just proved works, Single Arm Row (Alternating) stays at 9kg. Tuesday's day note explains why.

**Worth flagging as a standing thing to watch**: any future week that clusters multiple exercises at the same dumbbell weight in one session risks this same clash, since you only own one pair per weight outside of 5kg. Worth checking for this the same deliberate way progression and variety already get checked.

**Delivered**: a corrected 14-file zip (supersedes the Batch 12 zip) via the usual manual upload workflow.

## Batch 12 — Week 17 built: trimmed, varied, and genuinely new (15 Sep)
Pene: "I'm so bored with our workouts and we aren't completing them properly." The real signal behind this: the app's own export showed the same block of exercises being skipped across three sessions running (Goblet Squat, both Bulgarian Split Squats, Romanian Deadlift, both Glute Bridges, all of Athletic Circuit, all of Core, Russian Twist, Bicycle Crunch), Tuesday sessions running 57-60 min with a note saying "Ran out of time to do core finisher," and loads sitting flat since Week 14. Boredom and incompletion are the same problem here, not two — the sessions are too long and too repetitive, so the tail keeps getting cut.

**Week 17 built (Mon 21, Tue 22, Thu 24 Sep)**, trimmed and refreshed rather than just re-run at bigger numbers:
- **Monday**: Strength Circuit cut from 6 exercises to 4 (Bulgarian Split Squat's Left/Right pair merged into one flowing Curtsy Lunge card, one of the two Glute Bridge sides replaced by Step Up onto Block — first time the stepping block's actually been used). Athletic Circuit cut from 5 exercises to 4, swapping in Skipping Rope, Broad Jump and Lateral Bound for Lateral Lunges, Bear Crawl and Skater Jumps — skipping rope has never featured in the program despite Pene owning one. Core swaps Hollow Hold and both Side Planks for Ab Wheel Rollout (ab roller, also never used until now) and a Band Pallof Press. Rounds trimmed 4→3 and 3→2 across the board.
- **Tuesday**: the two Single Arm Row cards merged into one alternating card (same total reps, one less thing to track). Plank Hold dropped from Arm Finisher (redundant with the Fitness Test). Ab Finisher swaps Russian Twist for Med Ball Slam. EZ Bar Curl/Skull Crusher keep sharing one weight, same reasoning as Batch 11.
- **Thursday**: Conditioning Circuit cut from 8 exercises to 5 (Renegade Row, the second Goblet Squat and Plank Jacks rested this week, not deleted — they'll rotate back). Core Finisher swaps Mountain Climber Twist for Flutter Kicks so it doesn't repeat Monday's new Mountain Climbers. New optional "Fun Cardio Finisher" block at the end — 5 minutes of easy jog or skipping rope, entirely optional — directly off Pene's own note that the short jog she added after Week 15 Monday "felt nice."
- **All weights held at Week 16's numbers, nothing progressed** — same "hold steady until a week's actually completed successfully" principle as Batch 8, now also applied to the brand new exercises (they get a session to find their feet before any load gets added).
- **9 new Exercise Library entries added**: L012 Curtsy Lunge, L013 Step Up onto Block, CD015 Skipping Rope, CD016 Broad Jump, CD017 Lateral Bound, CR010 Ab Wheel Rollout, CR011 Band Pallof Press, B007 Single Arm Row (Alternating), CR012 Med Ball Slam, CR013 Flutter Kicks, CD018 Easy Jog or Skipping Rope Intervals.
- Push Up Block was deliberately **not** brought back into Week 17 — trimming for time and reintroducing a whole block in the same week would work against each other. Worth bringing back once the trimmed structure is finishing comfortably.

**Testing**: the new week loads and parses correctly (Node-level structural check against every week's blocks/exercises, `data.js` syntax verified), and every block/exercise/day object follows the exact same schema every other week already uses successfully. **Not done this round**: the full in-browser Playwright regression that earlier batches ran couldn't complete in this session (the headless browser didn't come up in time) — the data itself is verified sound, but the live rendering in a real browser hasn't been re-confirmed the way Batches 1-11 were. Worth a quick look on your end after uploading, particularly the new "Fun Cardio Finisher" block (it won't show a guided round timer, since it's one continuous 5-minute block rather than a work/rest circuit — that's expected, not a bug).

**Delivered**: a corrected 14-file zip (supersedes the Batch 11 zip) via the usual manual upload workflow.

## Batch 11 — EZ bar exercises share one weight, Core Finisher refreshed (6 Sep)
Pene: "let's vary the core finisher some how. Also having the ez bar and the ez bar skull crusher won't work by having different weights - there is not enough time to take the plates off between an exercise in the same circuit."

**1. EZ Bar Bicep Curl and EZ Bar Skull Crusher now share one weight (Week 15 and Week 16, Tuesday's Arm Finisher)**. Real problem, not a nitpick: both exercises sit in the same circuit with only 20 seconds rest between them, and up to now they were set at different plate loads — no realistic way to add or remove plates from an EZ bar in 20 seconds. Fixed by matching Curl DOWN to Skull Crusher's current bar-alone setup ("EZ bar alone (~13 kg), no added plates yet") rather than loading Skull Crusher up to match Curl — same "hold steady, don't guess a progression" logic as everywhere else in this program. Same bar, same setup, zero plate changes needed, for both exercises, for both Pene and Jenna. Once that feels comfortable across a full session, plates can go on for both together next time — not just one of them. Tuesday's day note explains the change.

**2. Core Finisher refreshed (Week 16 Thursday)**. It had been the exact same 4 exercises — Russian Twist, Hollow Hold, Superman Hold, Mountain Climber Twist — since Week 11, with only the Russian Twist's med ball getting heavier over time. Swapped two out: Russian Twist → **Bicycle Crunch** (dynamic rotation instead of a loaded static one) and Hollow Hold → **Plank Shoulder Taps** (anti-rotation stability) — chosen so this block doesn't just repeat what Monday's Core block already covers (Hollow Hold, Deadbug, Side Planks). Superman Hold and Mountain Climber Twist stay, they're still doing distinct work. Thursday's day note explains the swap and suggests rotating this block's exercises every few weeks going forward so it doesn't go stale again — happy to set up a rotation if that's useful rather than doing it ad hoc.

**Testing**: confirmed via Playwright that both EZ Bar exercises now show the identical weight string for both people in Week 15 and Week 16, ran the full 5-page regression (zero unexpected console errors), and confirmed the Core Finisher's guided timer still renders correctly ("▶ Start Round Timer — 4 exercises (30s work)") with the new exercise names showing on the cards.

**Delivered**: a corrected 14-file zip (supersedes the Batch 10 zip) via the usual manual upload workflow.

## Batch 10 — Monday eased back, and "results" now reflect combined weight (6 Sep)
Pene: "I want to goblet squat at 10kg, no progression yet. Especially tomorrow, we've had a big weekend, poor sleep too much alcohol and not feeling well. Bulgarian split squat keep at 7kg dumbell set, which should then show its 14 kg in our results. I see the exercise tracker as the equipment instruction, but our progress should acurately record the weight we worked out so if an exercise uses a set, it should calculate the combined weight."

Two separate things here — a day-specific ease-back, and a genuine calculation bug in how "progress" gets worked out.

**1. Monday eased back (Week 15 and Week 16)**: rough weekend, poor sleep, alcohol, not feeling well — no shame in that, and no progression either.
- Goblet Squat: down to **10 kg dumbbell** (was 12.5kg in Week 15, 15kg in Week 16).
- Bulgarian Split Squat (both sides): back to a **7 kg dumbbell pair** (was 9kg in Week 15, 10kg in Week 16).
- Monday's day note now explains why, and reminds that the in-app skip/round-chip tools are there live on the day if more needs to come off.

**2. The real bug — "results" were reporting per-dumbbell weight, not combined weight**. The exercise card itself is correctly just an equipment instruction ("7 kg dumbbells" tells you which dumbbells to pick up) and that display text is untouched. But everywhere the app calculates a number from that — the Progress page's charts, Personal Bests, the "★ new best" badges on exercise cards, and both export-to-Claude features — was quietly using only ONE dumbbell's weight for any exercise using a matched pair. So a 7kg pair (14kg of actual load, one in each hand) was being charted and exported as "7kg." Bulgarian Split Squat, Dumbbell Shoulder Press, Dumbbell Floor Press, Renegade Row, and Plank Pull Through were all affected.

**Fixed** in both `progress.html` and `tracker.html` (they each keep their own copy of the parsing function): a plural "X kg dumbbells" with no explicit count is now treated as a matched set and doubled for results (7 kg dumbbells → 14kg tracked); an explicit "2 x 12 kg dumbbells" is now correctly multiplied out (24kg, not 12kg); and a weight string that already states its own combined total in brackets (the EZ bar and light bar composite strings from Batch 7, e.g. "...18.5 kg total") now correctly pulls that stated total instead of the first number it happens to contain (that one was a pre-existing bug too — light bar sets were charting as "1kg"). Singular "X kg dumbbell" (Goblet Squat, Overhead Tricep Extension, Single Arm Row, and the "on hips" Single Leg Glute Bridge variant, all one implement) are correctly left alone, not doubled.

**Testing**: audited every distinct weight string across all 6 weeks against the new logic and confirmed each parses correctly (singular vs. plural dumbbells, explicit "N x M", EZ bar/light bar stated totals, barbells, kettlebells, bands, Med Ball, bodyweight). Ran the full 5-page Playwright regression — zero unexpected console errors. Confirmed Monday's Goblet Squat and Bulgarian Split Squat inputs render the eased-back numbers correctly in both Week 15 and Week 16, for both Pene and Jenna. Confirmed directly in the browser that `parseLoad('7 kg dumbbells')` now returns 14, `parseLoad('10 kg dumbbell')` still returns 10, and the EZ bar / light bar total-stated strings return their correct totals.

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
