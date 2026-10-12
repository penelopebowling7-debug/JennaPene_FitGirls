/* ==========================================================================
   FitGirls Tabata Player (Batch 27)
   Full screen Tabata mode: 10 sec get ready, big ring countdown, voice
   announcements, 3-2-1 beeps, interval dots, and a built in workout beat made
   live with Web Audio (no music files, nothing to download, no copyright).
   "My music" mode plays only beeps and voice, mixed over Spotify where the
   phone allows it. Loaded by tracker.html after its main script, so it uses
   that script's speak(), tone(), audioCtx, onRoundFullyComplete() and the
   guided timer context variables.
   ========================================================================== */
(function(){
  'use strict';

  const READY_SECONDS = 10;
  const MUSIC_KEY = 'pj-tabata-music-v1';
  let musicMode = 'beat';
  try{ musicMode = localStorage.getItem(MUSIC_KEY) || 'beat'; }catch(e){}

  // ---------------- Build the sequence ----------------
  let steps = [], idx = 0, running = false, endsAt = null, remainingMs = 0, loop = null;
  let ctx = null; // {block, bi, week, day, ds}
  let lastWhole = null, spokeHalf = false;

  function buildSteps(block){
    const base = buildSpecialSteps(block); // from tracker.html: work/rest steps with names
    const out = [{ kind: 'ready', seconds: READY_SECONDS, exName: base[0] ? base[0].exName : '' }];
    let interval = 0;
    base.forEach(s => {
      if(s.kind === 'work'){ interval++; out.push({ kind: 'work', seconds: s.seconds, exName: s.exName, interval }); }
      else out.push({ kind: 'rest', seconds: s.seconds, nextExName: s.nextExName, interval });
    });
    return out;
  }
  function totalIntervals(){ return steps.filter(s => s.kind === 'work').length; }
  function secondsLeftOverall(){
    let t = Math.ceil(remainingMs / 1000);
    for(let i = idx + 1; i < steps.length; i++) t += steps[i].seconds;
    return t;
  }

  // ---------------- Music: a live 128 BPM beat ----------------
  const BPM = 128, STEP_SEC = 60 / BPM / 4; // 16th notes
  const BASS = [45, 0, 45, 0, 48, 0, 45, 0, 43, 0, 43, 0, 40, 0, 43, 0]; // MIDI notes, A minor groove
  const CHORDS = [[57, 60, 64], [57, 60, 64], [55, 59, 62], [52, 55, 59]]; // Am, Am, G, Em per bar
  let mus = null; // {master, filter, nextTime, step, bar, timer, level}

  function ac(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function midi(n){ return 440 * Math.pow(2, (n - 69) / 12); }
  let noiseBuf = null;
  function noise(a){
    if(noiseBuf) return noiseBuf;
    noiseBuf = a.createBuffer(1, a.sampleRate * 0.5, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function kick(a, t, out){
    const o = a.createOscillator(), g = a.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(1.0, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.34);
  }
  function hat(a, t, out, vol){
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise(a); f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + 0.06);
  }
  function clap(a, t, out){
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise(a); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + 0.2);
  }
  function bass(a, t, out, note){
    const o = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = midi(note);
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(220, t + 0.16);
    g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(f); f.connect(g); g.connect(out); o.start(t); o.stop(t + 0.22);
  }
  function stab(a, t, out, notes){
    notes.forEach(n => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'square'; o.frequency.value = midi(n + 12);
      g.gain.setValueAtTime(0.045, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.16);
    });
  }
  // level: 'full' (work), 'soft' (rest), 'build' (get ready)
  function setMusicLevel(level){
    if(!mus) return;
    mus.level = level;
    const a = ac(), t = a.currentTime;
    const cut = level === 'full' ? 18000 : (level === 'build' ? 1200 : 700);
    const vol = level === 'full' ? 0.55 : (level === 'build' ? 0.4 : 0.32);
    mus.filter.frequency.cancelScheduledValues(t);
    mus.filter.frequency.setTargetAtTime(cut, t, level === 'full' ? 0.05 : 0.15);
    mus.master.gain.cancelScheduledValues(t);
    mus.master.gain.setTargetAtTime(mus.ducked ? vol * 0.35 : vol, t, 0.08);
    mus.vol = vol;
  }
  function duck(ms){
    if(!mus) return;
    const a = ac(), t = a.currentTime;
    mus.ducked = true;
    mus.master.gain.setTargetAtTime(mus.vol * 0.35, t, 0.05);
    clearTimeout(mus.duckTimer);
    mus.duckTimer = setTimeout(() => {
      if(!mus) return;
      mus.ducked = false;
      mus.master.gain.setTargetAtTime(mus.vol, ac().currentTime, 0.2);
    }, ms);
  }
  function startMusic(){
    if(musicMode !== 'beat' || mus) return;
    const a = ac();
    const master = a.createGain(); master.gain.value = 0.0001;
    const filter = a.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1200;
    filter.connect(master); master.connect(a.destination);
    mus = { master, filter, nextTime: a.currentTime + 0.05, step: 0, bar: 0, level: 'build', vol: 0.4, ducked: false };
    const schedule = () => {
      if(!mus) return;
      const now = ac().currentTime;
      while(mus.nextTime < now + 0.12){
        const t = mus.nextTime, s = mus.step, lv = mus.level;
        if(s % 4 === 0) kick(a, t, filter);
        if(lv !== 'soft' && (s === 4 || s === 12)) clap(a, t, filter);
        if(s % 2 === 1) hat(a, t, filter, lv === 'full' ? 0.22 : 0.12);
        if(lv === 'full' && s % 2 === 0) hat(a, t, filter, 0.08);
        if(BASS[s]) bass(a, t, filter, BASS[s] + (lv === 'soft' ? 0 : 0));
        if(lv === 'full' && (s === 2 || s === 10 || s === 14)) stab(a, t, filter, CHORDS[mus.bar % 4]);
        mus.nextTime += STEP_SEC;
        mus.step = (s + 1) % 16;
        if(mus.step === 0) mus.bar++;
      }
    };
    mus.timer = setInterval(schedule, 25);
    schedule();
    setMusicLevel('build');
  }
  function stopMusic(){
    if(!mus) return;
    const m = mus; mus = null;
    clearInterval(m.timer); clearTimeout(m.duckTimer);
    try{ m.master.gain.setTargetAtTime(0.0001, ac().currentTime, 0.1); }catch(e){}
    setTimeout(() => { try{ m.master.disconnect(); }catch(e){} }, 600);
  }

  // Let the phone play our sound alongside other apps (My music) or as main
  // playback even with the silent switch on (Beat). Safari 16.4+ only.
  let sessionTypeInUse = null;
  function setAudioSession(){
    const want = musicMode === 'mine' ? 'ambient' : 'playback';
    try{
      if(navigator.audioSession && navigator.audioSession.type !== want){
        navigator.audioSession.type = want;
        // Rebuild the sound engine so the new mixing rule applies to it.
        if(audioCtx && sessionTypeInUse && sessionTypeInUse !== want){
          stopMusic();
          try{ audioCtx.close(); }catch(e){}
          audioCtx = null;
        }
      }
    }catch(e){}
    sessionTypeInUse = want;
    if(musicMode === 'mine'){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  }

  // ---------------- Coach voice (Batch 28) ----------------
  // Recorded clips in voice/ (natural coach voice, made with an open neural
  // voice), played through Web Audio like any sound effect. That's what lets
  // them sit on top of Spotify in My music mode: the phone's built-in speech
  // voice always pauses other apps' audio on iPhone, so it's never used in
  // My music mode, and only as a fallback in Beat and Off modes for an
  // exercise that doesn't have a clip yet.
  const clips = {};          // key -> AudioBuffer | false (missing)
  function spokenName(n){ return String(n || '').replace(/\s*\(.*?\)/g, '').trim(); }
  function slug(n){ return spokenName(n).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  // All clips live in one file (coach-voice.json, base64 MP3s) so the whole
  // voice uploads to GitHub as a single file. Fetched once, then each clip is
  // decoded only when a Tabata that needs it is opened.
  let packPromise = null;
  function pack(){
    if(!packPromise) packPromise = fetch('coach-voice.json').then(r => r.ok ? r.json() : { clips: {} }).then(j => j.clips || {}).catch(() => ({}));
    return packPromise;
  }
  function loadClip(key){
    if(key in clips) return Promise.resolve(clips[key]);
    clips[key] = null;
    return pack().then(p => {
      if(!p[key]) throw new Error('missing');
      const bin = atob(p[key]), buf = new Uint8Array(bin.length);
      for(let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return new Promise((res, rej) => ac().decodeAudioData(buf.buffer, res, rej));
    }).then(b => (clips[key] = b)).catch(() => (clips[key] = false));
  }
  function preloadFor(list){
    const keys = ['count_3', 'count_2', 'count_1', 'tenmore_1', 'tenmore_2', 'tenmore_3', 'rest', 'complete', 'go_generic'];
    list.forEach(st => {
      if(!st.exName && !st.nextExName) return;
      const sl = slug(st.exName || st.nextExName);
      ['ready_', 'go_', 'half_', 'last_', 'next_'].forEach(pfx => keys.push(pfx + sl));
    });
    return Promise.all([...new Set(keys)].map(loadClip));
  }
  function playClip(key){
    const b = clips[key];
    if(!b) return false;
    try{
      const a = ac();
      const src = a.createBufferSource(), g = a.createGain();
      src.buffer = b; g.gain.value = 1.0;
      src.connect(g); g.connect(a.destination);
      src.start();
      duck(b.duration * 1000 + 250);
      return true;
    }catch(e){ return false; }
  }
  // key: clip to play. text: what to say if there's no clip (never in My music).
  function say(key, text, style){
    if(playClip(key)) return;
    if(musicMode === 'mine' || !text) return;
    duck(Math.min(4000, 800 + text.length * 75));
    speak(text, style || 'push');
  }
  function beep(sec){ playTick(sec); }
  function goTone(){ tone(1046, 0, 0.18, 0.28); tone(1318, 0.09, 0.22, 0.24); }
  function restTone(){ tone(523, 0, 0.25, 0.2); }
  function fanfare(){ [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.3, 0.22)); }

  // ---------------- Screen ----------------
  const el = {};
  function mount(){
    if(document.getElementById('tabataOverlay')) return;
    const wrap = document.createElement('div');
    wrap.id = 'tabataOverlay';
    wrap.className = 'tb-overlay';
    wrap.innerHTML = `
      <div class="tb-top">
        <div class="tb-title" id="tbTitle">Tabata</div>
        <button class="tb-close" id="tbClose" aria-label="Close">&times;</button>
      </div>
      <div class="tb-music" role="radiogroup" aria-label="Music">
        <button data-m="beat">🎵 Beat</button>
        <button data-m="mine">🎧 My music</button>
        <button data-m="off">🔇 Off</button>
      </div>
      <div class="tb-phase" id="tbPhase">Ready?</div>
      <div class="tb-ring-wrap">
        <svg class="tb-ring" viewBox="0 0 220 220" aria-hidden="true">
          <circle cx="110" cy="110" r="96" class="tb-ring-bg"/>
          <circle cx="110" cy="110" r="96" class="tb-ring-fg" id="tbRing"/>
        </svg>
        <div class="tb-count" id="tbCount">20</div>
      </div>
      <div class="tb-ex" id="tbEx"></div>
      <div class="tb-next" id="tbNext"></div>
      <div class="tb-dots" id="tbDots"></div>
      <div class="tb-left" id="tbLeft"></div>
      <div class="tb-controls">
        <button class="tb-btn tb-main" id="tbMain">▶ Start</button>
        <button class="tb-btn tb-ghost" id="tbRestart">↺</button>
      </div>
      <div class="tb-hint" id="tbHint">Turn your volume up. Beat mode plays even on silent.</div>
      <div class="tb-confetti" id="tbConfetti"></div>`;
    document.body.appendChild(wrap);
    ['tbTitle','tbClose','tbPhase','tbRing','tbCount','tbEx','tbNext','tbDots','tbLeft','tbMain','tbRestart','tbHint','tbConfetti'].forEach(id => el[id] = document.getElementById(id));
    el.overlay = wrap;
    el.tbClose.onclick = close;
    el.tbMain.onclick = () => running ? pause() : start();
    el.tbRestart.onclick = restart;
    wrap.querySelectorAll('.tb-music button').forEach(b => b.onclick = () => setMusicMode(b.dataset.m));
    paintMusic();
  }
  function paintMusic(){
    el.overlay.querySelectorAll('.tb-music button').forEach(b => b.classList.toggle('on', b.dataset.m === musicMode));
    el.tbHint.textContent = musicMode === 'beat' ? 'Turn your volume up. Beat mode plays even on silent.'
      : musicMode === 'mine' ? 'Start your playlist first, then press Start. Your coach talks over it. Turn the silent switch off.'
      : 'Voice and beeps only.';
  }
  function setMusicMode(m){
    musicMode = m;
    try{ localStorage.setItem(MUSIC_KEY, m); }catch(e){}
    setAudioSession();
    paintMusic();
    if(m === 'beat' && running){ startMusic(); setMusicLevel(levelFor(steps[idx])); }
    if(m !== 'beat') stopMusic();
  }
  function levelFor(s){ return !s ? 'soft' : s.kind === 'work' ? 'full' : s.kind === 'ready' ? 'build' : 'soft'; }

  function paint(){
    const s = steps[idx];
    const ov = el.overlay;
    ov.dataset.phase = !s ? 'done' : s.kind;
    const secs = Math.max(0, Math.ceil(remainingMs / 1000));
    el.tbCount.textContent = s ? secs : '🏆';
    const C = 2 * Math.PI * 96;
    const frac = s ? Math.max(0, Math.min(1, remainingMs / (s.seconds * 1000))) : 0;
    el.tbRing.style.strokeDasharray = C;
    el.tbRing.style.strokeDashoffset = C * (1 - frac);
    if(!s){
      el.tbPhase.textContent = 'Done!';
      el.tbEx.textContent = 'Tabata complete';
      el.tbNext.textContent = 'You smashed it 💪';
    } else if(s.kind === 'ready'){
      el.tbPhase.textContent = 'Get ready';
      el.tbEx.textContent = s.exName;
      el.tbNext.textContent = 'First up';
    } else if(s.kind === 'work'){
      el.tbPhase.textContent = 'Work!';
      el.tbEx.textContent = s.exName;
      const nxt = steps.slice(idx + 1).find(x => x.kind === 'work');
      el.tbNext.textContent = nxt ? 'Next: ' + nxt.exName : 'Last one, everything you have!';
    } else {
      el.tbPhase.textContent = 'Rest';
      el.tbEx.textContent = 'Breathe';
      el.tbNext.textContent = s.nextExName ? 'Next: ' + s.nextExName : '';
    }
    const n = totalIntervals();
    const cur = s ? (s.interval || 0) : n + 1;
    let dots = '';
    for(let i = 1; i <= n; i++){
      const cls = i < cur || (s && s.kind === 'rest' && i === cur) || !s ? 'done' : (i === cur && s.kind === 'work' ? 'now' : '');
      dots += '<span class="' + cls + '"></span>';
    }
    el.tbDots.innerHTML = dots;
    el.tbLeft.textContent = s ? (s.kind === 'ready' ? 'Round of ' + n + ' intervals' : 'Interval ' + (s.interval || 1) + ' of ' + n + '  ·  ' + fmt(secondsLeftOverall()) + ' left') : '';
  }
  function fmt(t){ return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }

  // ---------------- Announcements per step ----------------
  function announce(s){
    if(!s) return;
    if(s.kind === 'ready'){
      say('ready_' + slug(s.exName), 'Get ready! First up, ' + spokenName(s.exName) + '.', 'push');
      if(mus) setMusicLevel('build');
    } else if(s.kind === 'work'){
      goTone();
      const n = totalIntervals(), sl = slug(s.exName), nm = spokenName(s.exName);
      if(s.interval === n) say('last_' + sl, 'Last one! ' + nm + '! Everything you have got!', 'push');
      else if(s.interval === Math.ceil(n / 2) + 1) say('half_' + sl, 'Halfway there! ' + nm + '! Go!', 'push');
      else say('go_' + sl, nm + '! Go!', 'push');
      if(mus) setMusicLevel('full');
      if(navigator.vibrate) navigator.vibrate(150);
    } else {
      restTone();
      if(s.nextExName) say('next_' + slug(s.nextExName), 'And rest. Next up, ' + spokenName(s.nextExName) + '.', 'calm');
      else say('rest', 'And rest.', 'calm');
      if(mus) setMusicLevel('soft');
    }
    spokeHalf = false;
  }

  // ---------------- Clock ----------------
  function tick(){
    if(!running || endsAt == null) return;
    let guard = 0;
    while(running && Date.now() >= endsAt && guard++ < 50){
      const behind = Date.now() - endsAt;
      idx++;
      if(idx >= steps.length){ finish(); return; }
      endsAt = endsAt + steps[idx].seconds * 1000;
      lastWhole = null;
      if(behind < 1500) announce(steps[idx]);
    }
    remainingMs = Math.max(0, endsAt - Date.now());
    const whole = Math.ceil(remainingMs / 1000);
    const s = steps[idx];
    if(whole !== lastWhole){
      lastWhole = whole;
      if(whole <= 3 && whole >= 1){
        beep(whole);
        // Spoken count into the work, beeps only into rest.
        if(s.kind !== 'work' && steps[idx + 1] && steps[idx + 1].kind === 'work') say('count_' + whole, ['', 'One', 'Two', 'Three'][whole], 'count');
      }
      if(s.kind === 'work' && !spokeHalf && s.seconds >= 20 && whole === 10){ say('tenmore_' + (1 + Math.floor(Math.random() * 3)), 'Ten more! Keep pushing!', 'push'); spokeHalf = true; }
    }
    paint();
  }
  function start(){
    ac(); setAudioSession();
    if(idx >= steps.length) restart();
    running = true;
    if(window.KeepAwake) KeepAwake.request();
    const fresh = remainingMs === steps[idx].seconds * 1000;
    endsAt = Date.now() + remainingMs;
    if(musicMode === 'beat'){ startMusic(); setMusicLevel(levelFor(steps[idx])); }
    if(fresh) announce(steps[idx]);
    el.tbMain.textContent = '❚❚ Pause';
    clearInterval(loop); loop = setInterval(tick, 100);
    tick();
  }
  function pause(){
    running = false;
    remainingMs = Math.max(0, endsAt - Date.now()); endsAt = null;
    clearInterval(loop); loop = null;
    stopMusic();
    try{ window.speechSynthesis.cancel(); }catch(e){}
    if(window.KeepAwake) KeepAwake.release();
    el.tbMain.textContent = '▶ Resume';
    el.tbPhase.textContent = 'Paused';
  }
  function restart(){
    if(running) pause();
    idx = 0; remainingMs = steps[0].seconds * 1000; lastWhole = null;
    el.overlay.classList.remove('celebrate'); el.tbConfetti.innerHTML = '';
    el.tbMain.textContent = '▶ Start';
    paint();
  }
  function finish(){
    running = false; endsAt = null; remainingMs = 0;
    clearInterval(loop); loop = null;
    idx = steps.length;
    if(window.KeepAwake) KeepAwake.release();
    fanfare();
    say('complete', 'Tabata complete! You absolutely smashed it!', 'push');
    setTimeout(stopMusic, 2500);
    paint();
    confetti();
    el.tbMain.textContent = '▶ Again';
    // Tick this block's round on both records, same as the round timer does.
    try{
      guidedBlockIndex = ctx.bi;
      guidedDayCtx = { week: ctx.week, day: ctx.day, ds: ctx.ds };
      onRoundFullyComplete();
    }catch(e){}
  }
  function confetti(){
    el.overlay.classList.add('celebrate');
    const colors = ['#FFD60A', '#F72585', '#FFFFFF', '#7B2FF7', '#4CC9F0'];
    let html = '';
    for(let i = 0; i < 60; i++){
      const left = Math.random() * 100, delay = Math.random() * 0.8, dur = 2.2 + Math.random() * 1.6;
      const c = colors[i % colors.length], rot = Math.random() * 360, w = 6 + Math.random() * 6;
      html += `<i style="left:${left}%;background:${c};width:${w}px;height:${w * 1.6}px;animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${rot}deg)"></i>`;
    }
    el.tbConfetti.innerHTML = html;
  }
  function close(){
    if(running) pause();
    stopMusic();
    el.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openTabataPlayer = function(block, bi, week, day, ds){
    mount();
    ctx = { block, bi, week, day, ds };
    steps = buildSteps(block);
    setAudioSession();
    preloadFor(steps);
    el.tbTitle.textContent = block.name;
    restart();
    paintMusic();
    el.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') tick(); });
})();
