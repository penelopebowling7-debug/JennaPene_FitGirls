// app-shell.js — shared across every page of the Fitness Hub.
// Three jobs, none of them load-bearing (every page still works if this fails):
//   1. Install support: registers the service worker so the site can be added
//      to the home screen and still opens with no signal in the gym.
//   2. A sync status pill in the header, so a broken cloud connection is
//      visible instead of silently no-op'ing.
//   3. KeepAwake — the Screen Wake Lock, so the phone doesn't sleep mid-set.
// It also carries HOWTO: plain-language coaching notes and easier/harder
// versions for the movements in the program, matched on the exercise name.
(function () {
  'use strict';

  // ---------------- Service worker / install ----------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Offline support unavailable:', err);
      });
    });
  }

  // ---------------- Sync status pill ----------------
  var pill, dot, text;
  var status = 'connecting';

  function paint() {
    if (!pill) return;
    var online = navigator.onLine;
    var s = !online ? 'offline' : status;
    var map = {
      connecting: ['#FFD60A', 'Connecting'],
      live: ['#0ca30c', 'Synced'],
      offline: ['#B5179E', 'Offline — saved here'],
      error: ['#B5179E', 'Sync problem']
    };
    var conf = map[s] || map.connecting;
    dot.style.background = conf[0];
    text.textContent = conf[1];
    pill.title = s === 'live'
      ? 'Changes are syncing between your devices.'
      : 'Everything is still being saved on this device and will sync when the connection is back.';
  }

  function mountPill() {
    var host = document.querySelector('.site-header-top');
    if (!host) return;
    pill = document.createElement('div');
    pill.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;color:#fff;opacity:0.9;background:rgba(255,255,255,0.14);padding:5px 10px;border-radius:999px;white-space:nowrap;';
    dot = document.createElement('span');
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#FFD60A;flex:0 0 auto;';
    text = document.createElement('span');
    pill.appendChild(dot);
    pill.appendChild(text);
    host.appendChild(pill);
    paint();
  }

  window.addEventListener('online', paint);
  window.addEventListener('offline', paint);

  function bindSync() {
    if (!window.CloudSync) { status = 'offline'; paint(); return; }
    window.CloudSync.onStatus = function (s) { status = s; paint(); };
    if (window.CloudSync.status) status = window.CloudSync.status;
    paint();
  }

  // ---------------- Keep the screen awake ----------------
  var lock = null;
  var wanted = false;
  var listeners = [];

  function notify() {
    var state = !('wakeLock' in navigator) ? 'unsupported' : (lock ? 'on' : 'off');
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }

  var KeepAwake = {
    supported: 'wakeLock' in navigator,
    onChange: function (fn) { listeners.push(fn); fn(this.supported ? (lock ? 'on' : 'off') : 'unsupported'); },
    request: function () {
      wanted = true;
      if (!('wakeLock' in navigator)) { notify(); return; }
      if (lock) return;
      navigator.wakeLock.request('screen').then(function (l) {
        lock = l;
        l.addEventListener('release', function () { lock = null; notify(); });
        notify();
      }).catch(function () { lock = null; notify(); });
    },
    release: function () {
      wanted = false;
      if (lock) { try { lock.release(); } catch (e) {} lock = null; }
      notify();
    }
  };
  // iOS drops the lock whenever the tab is backgrounded — take it again on return.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && wanted && !lock) KeepAwake.request();
  });
  window.KeepAwake = KeepAwake;

  // ---------------- How-to coaching notes ----------------
  // Matched on the exercise name, most specific pattern first. Every entry is
  // three plain steps, the one thing to watch for, and easier/standard/harder
  // versions so Pene and Jenna can each pick their own without leaving the set.
  var LIB = [
    { re: /scapular push/i, name: 'Scapular Push Up', steps: ['Get into a push up position with straight arms.', 'Without bending your elbows, let your chest sink between your shoulder blades.', 'Push the floor away so your upper back rounds slightly.'], watch: 'bending the elbows — this one is all shoulder blades.', variants: ['On a wall', 'On your knees', 'On your toes'] },
    { re: /push up to shoulder tap/i, name: 'Push Up to Shoulder Tap', steps: ['Do one push up with your body in a straight line.', 'At the top, tap your left hand to your right shoulder.', 'Next rep, tap the other side. Keep your hips still.'], watch: 'hips rocking side to side — widen your feet to steady it.', variants: ['Shoulder taps only, no push up', 'Push up on knees + tap', 'Full push up + tap'] },
    { re: /inchworm/i, name: 'Inchworm to Push Up', steps: ['From standing, hinge and walk your hands out to a plank.', 'Do one push up.', 'Walk your hands back and stand up tall.'], watch: 'letting your hips sag in the plank.', variants: ['Walk out, no push up', 'Push up on knees', 'Full push up'] },
    { re: /push up/i, name: 'Push Up', steps: ['Hands under your shoulders, body in one straight line from head to heels.', 'Lower until your chest is about a fist off the floor.', 'Push the floor away and squeeze your chest at the top.'], watch: 'hips dropping first — swap to the knee version the moment that happens.', variants: ['Hands on a bench or wall', 'On your knees', 'Full push up'] },
    { re: /goblet squat/i, name: 'Goblet Squat', steps: ['Hold the weight at your chest, feet slightly wider than your hips.', 'Sit down and back like you are reaching for a low chair.', 'Drive through your whole foot and stand tall, squeezing your glutes.'], watch: 'heels lifting — go less deep rather than tipping forward.', variants: ['Bodyweight squat to a chair', 'Goblet squat', 'Goblet squat with a 2s pause at the bottom'] },
    { re: /jump squat/i, name: 'Jump Squat', steps: ['Squat down to about half depth.', 'Jump up, reaching tall.', 'Land soft, knees bending straight away into the next rep.'], watch: 'landing stiff-legged or noisy — land quietly.', variants: ['Fast bodyweight squats', 'Small jump squats', 'Full jump squats'] },
    { re: /prisoner squat|air squat|deep squat hold/i, name: 'Bodyweight Squat', steps: ['Feet hip width, hands where the exercise asks.', 'Sit back and down, chest proud.', 'Stand up and squeeze at the top.'], watch: 'knees caving in — push them out over your toes.', variants: ['Squat to a chair', 'Bodyweight squat', 'Slow 3s lower'] },
    { re: /split squat/i, name: 'Bulgarian Split Squat', steps: ['Back foot on a bench or chair, front foot a big step forward.', 'Lower straight down until your front thigh is near parallel.', 'Drive through the front heel to stand.'], watch: 'wobbling — hold a wall with one hand, it still counts.', variants: ['Split squat, both feet on the floor', 'Back foot elevated, bodyweight', 'Back foot elevated, holding weight'] },
    { re: /lunge/i, name: 'Lunge', steps: ['Step forward (or sideways) into a long stride.', 'Bend both knees, back knee tracking towards the floor.', 'Push off the front foot to return.'], watch: 'front knee sliding past your toes — take a longer step.', variants: ['Hold a wall for balance', 'Bodyweight lunge', 'Holding dumbbells'] },
    { re: /romanian deadlift|barbell deadlift|deadlift/i, name: 'Deadlift', steps: ['Weight close to your legs, soft knees, back flat.', 'Push your hips back, letting the weight slide down your thighs.', 'Squeeze your glutes to stand up tall.'], watch: 'rounding your lower back — stop the rep before that happens.', variants: ['Hip hinge with no weight', 'Light dumbbells', 'Barbell'] },
    { re: /kettlebell swing/i, name: 'Kettlebell Swing', steps: ['Hinge at the hips and hike the bell back between your legs.', 'Snap your hips forward — the bell floats up, your arms are just rope.', 'Let it swing back and hinge again.'], watch: 'squatting instead of hinging, or lifting with the arms.', variants: ['Hip hinge, no bell', 'Swing to chest height', 'Swing to eye height'] },
    { re: /glute bridge|hip thrust/i, name: 'Glute Bridge', steps: ['Lie on your back, knees bent, feet flat and close to your bum.', 'Press through your heels and lift your hips.', 'Squeeze at the top, lower slowly.'], watch: 'arching your lower back at the top — squeeze the glutes instead.', variants: ['Both feet, bodyweight', 'March at the top', 'Single leg'] },
    { re: /renegade row/i, name: 'Renegade Row', steps: ['Start in a plank with a hand on each dumbbell, feet wide.', 'Row one dumbbell to your ribs while the rest of you stays still.', 'Lower it and swap sides.'], watch: 'hips twisting — go lighter and widen your feet.', variants: ['Plank hold only', 'Row from your knees', 'Full plank row'] },
    { re: /row/i, name: 'Row', steps: ['Hinge forward with a flat back, weight hanging down.', 'Pull to your ribs, elbow brushing past your side.', 'Lower all the way and feel the stretch.'], watch: 'shrugging — keep your shoulders away from your ears.', variants: ['Supported on a bench', 'Standing single arm row', 'Heavier, 3s lower'] },
    { re: /shoulder press|floor press/i, name: 'Press', steps: ['Weights at shoulder height, palms forward, ribs down.', 'Press straight up until your arms are long.', 'Lower under control back to the start.'], watch: 'leaning back — brace your stomach and keep your ribs down.', variants: ['One arm at a time', 'Both arms', 'Slower lower / heavier'] },
    { re: /tricep/i, name: 'Triceps', steps: ['Set your upper arm still — only the elbow moves.', 'Straighten the arm fully.', 'Return slowly to the stretch.'], watch: 'the elbow drifting — pin it in place.', variants: ['Lighter weight, more reps', 'As written', 'Slower 3s lower'] },
    { re: /curl/i, name: 'Curl', steps: ['Stand tall, weights at your sides, elbows tucked.', 'Curl up without swinging.', 'Lower all the way down — the lower is the work.'], watch: 'rocking your body to get the weight up.', variants: ['Lighter, more reps', 'As written', '3s lower'] },
    { re: /face pull|pull apart/i, name: 'Band Pull', steps: ['Hold the band at chest or eye height, arms long.', 'Pull it apart, leading with your elbows.', 'Squeeze your shoulder blades, then return slowly.'], watch: 'shrugging up — keep your neck long.', variants: ['Longer grip (easier band tension)', 'As written', 'Shorter grip, hold 2s'] },
    { re: /plank jack/i, name: 'Plank Jacks', steps: ['Start in a strong plank, feet together.', 'Jump your feet wide, then back together.', 'Keep your hips level the whole time.'], watch: 'your bum rising — slow the jumps down.', variants: ['Step feet out one at a time', 'Small jumps', 'Full jacks'] },
    { re: /plank pull through/i, name: 'Plank Pull Through', steps: ['Plank with a weight beside one hand, feet wide.', 'Reach under with the opposite hand and drag it across.', 'Alternate sides, staying square.'], watch: 'hips rotating — widen your feet.', variants: ['Plank hold, no drag', 'Knees down, drag', 'Full plank drag'] },
    { re: /side plank/i, name: 'Side Plank', steps: ['On your side, elbow under your shoulder.', 'Lift your hips so your body is a straight line.', 'Breathe steadily and hold.'], watch: 'hips sinking — drop to knees and hold well instead.', variants: ['Knees bent', 'Full side plank', 'Top arm reaching up'] },
    { re: /plank/i, name: 'Plank Hold', steps: ['Elbows under shoulders, feet hip width.', 'Squeeze your glutes and stomach so your body is one line.', 'Breathe — hold until your form starts to slip, then stop.'], watch: 'hips sagging or rising. Quality beats a longer time.', variants: ['On your knees', 'On your toes', 'On your toes, shoulder taps'] },
    { re: /hollow hold/i, name: 'Hollow Hold', steps: ['Lie on your back, press your lower back into the floor.', 'Lift your shoulders and legs a few inches.', 'Hold that dish shape and breathe.'], watch: 'your lower back arching — bend your knees or raise your legs higher.', variants: ['Knees bent, tucked', 'Legs bent 90°', 'Legs long, arms overhead'] },
    { re: /deadbug|dead bug/i, name: 'Dead Bug', steps: ['On your back, arms up, knees over hips.', 'Lower one arm and the opposite leg slowly.', 'Return and swap, keeping your back flat.'], watch: 'your back lifting off the floor — go slower and smaller.', variants: ['Legs only', 'Opposite arm and leg', 'Holding a weight or ball'] },
    { re: /bird dog/i, name: 'Bird Dog', steps: ['On hands and knees, back flat.', 'Reach one arm forward and the opposite leg back.', 'Pause, then return without letting your hips rock.'], watch: 'twisting — imagine balancing a glass on your lower back.', variants: ['Arm or leg only', 'Opposite arm and leg', 'Pause 3s each rep'] },
    { re: /russian twist/i, name: 'Russian Twist', steps: ['Sit with knees bent, lean back to about 45°.', 'Rotate your ribs (not just your arms) side to side.', 'Keep your chest lifted the whole time.'], watch: 'rounding your back — sit taller, lean back less.', variants: ['Feet down, no weight', 'Feet down, with weight', 'Feet lifted'] },
    { re: /bicycle crunch/i, name: 'Bicycle Crunch', steps: ['On your back, hands light behind your head.', 'Bring one knee in and rotate the opposite shoulder towards it.', 'Switch slowly — this is not a race.'], watch: 'yanking on your neck.', variants: ['Slow, feet high', 'As written', 'Legs low and long'] },
    { re: /superman/i, name: 'Superman Hold', steps: ['Lie face down, arms out in front.', 'Lift your chest, arms and legs a few inches.', 'Hold, then lower with control.'], watch: 'craning your neck — look at the floor.', variants: ['Arms only', 'Arms and legs', 'Hold 3s at the top of each rep'] },
    { re: /mountain climber/i, name: 'Mountain Climbers', steps: ['Start in a strong plank.', 'Drive one knee towards your chest, then swap.', 'Keep your hips low and level.'], watch: 'your bum popping up as you speed up.', variants: ['Slow, hands on a bench', 'On the floor, steady', 'Fast, or with the twist'] },
    { re: /bear crawl/i, name: 'Bear Crawl', steps: ['Hands and knees, knees hovering an inch off the floor.', 'Move opposite hand and foot together.', 'Keep your hips low and quiet.'], watch: 'hips swinging — take smaller steps.', variants: ['Hover hold only', 'Crawl forward and back', 'Add a shoulder tap'] },
    { re: /skater/i, name: 'Skater Jumps', steps: ['Bound sideways onto one foot.', 'Let the other leg swing behind you.', 'Stick the landing, then bound back.'], watch: 'landing hard — land soft and quiet.', variants: ['Step side to side', 'Small bounds', 'Big bounds, stick 1s'] },
    { re: /lateral shuffle/i, name: 'Lateral Shuffle', steps: ['Get into a low athletic stance.', 'Shuffle sideways, feet quick, chest up.', 'Change direction on the call.'], watch: 'standing up tall as you tire — stay low.', variants: ['Side steps', 'Shuffle', 'Shuffle with a touch down'] },
    { re: /jumping jack|ankle bounce|jog in place|treadmill/i, name: 'Cardio Warm Up', steps: ['Start easy and build over the time.', 'Breathe through your nose if you can.', 'You should be warm and talking, not gasping.'], watch: 'going too hard too early — this is the warm up.', variants: ['Low impact (step, no jump)', 'As written', 'Faster pace'] },
    { re: /stretch|cat-cow|opener|figure 4|twist$|circles|rolls|slides|swings/i, name: 'Mobility', steps: ['Ease into the position until you feel a gentle stretch.', 'Breathe out and settle a little deeper.', 'Never push into sharp pain — stretch, not strain.'], watch: 'holding your breath.', variants: ['Smaller range', 'As written', 'Hold longer'] }
  ];

  window.HOWTO = {
    lookup: function (name) {
      if (!name) return null;
      for (var i = 0; i < LIB.length; i++) if (LIB[i].re.test(name)) return LIB[i];
      return null;
    },
    generic: {
      name: 'This movement',
      steps: ['Set up slowly and find a position you can hold well.', 'Move at a steady pace — no rushing, no bouncing.', 'Stop the set when your form changes, not when it hurts.'],
      watch: 'rushing. Beginners get more out of slow, clean reps than extra ones.',
      variants: ['Easier version', 'As written', 'Harder version']
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mountPill(); bindSync(); });
  } else { mountPill(); bindSync(); }
})();
