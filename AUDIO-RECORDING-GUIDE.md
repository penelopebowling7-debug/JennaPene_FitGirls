# Recording your own trainer cues (optional)

The app already reads cues with the phone's voice, now with per-moment delivery
(fast and bright on "go", slower on rest), a 3-2-1 tick before every change, and
a chord when a round finishes. If you'd rather hear your own voices, drop MP3s
into an `audio/` folder in the repo root — the app uses any it finds and falls
back to the phone voice for the rest. No code changes needed.

## Filenames

| File | When it plays | Say something like |
| --- | --- | --- |
| `audio/start-1.mp3` … `-3.mp3` | first work interval of a round | "Let's go! Come on!" |
| `audio/warn-1.mp3` … `-3.mp3` | 10 seconds of work left | "Ten seconds, push!" |
| `audio/rest-1.mp3` … `-3.mp3` | a rest interval starts | "And rest. Great work." |
| `audio/complete-1.mp3` … `-3.mp3` | the whole round finishes | "Round done! You crushed it." |

Record up to three variants of each (`-1`, `-2`, `-3`); the app picks one at
random so it doesn't repeat. One variant is fine — just name it `-1`.

## How to record

1. Voice Memos on the phone is enough. Quiet room, phone ~20 cm away.
2. **Keep each clip under 2 seconds** — longer and it's still talking when the
   next interval starts.
3. Trim the silence at both ends, then export/share as MP3 (or convert an m4a
   with any free online converter).
4. Record them all in one sitting at the same distance and volume, so no clip
   is suddenly louder than the others.
5. Say it like you'd say it in the gym — the whole point is the energy the robot
   voice can't do.

## Uploading

Create a folder called `audio` in the GitHub repo, upload the MP3s into it, and
hard-refresh the app on each phone (tap the sync pill → Force refresh).

If a clip sounds wrong, replace the file with the same name — nothing else
changes.
