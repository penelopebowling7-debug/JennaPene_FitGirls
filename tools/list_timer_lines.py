import json, sys, subprocess, time
from playwright.sync_api import sync_playwright
repo = sys.argv[1]; out = sys.argv[2]
srv = subprocess.Popen(['python3','-m','http.server','8765','-d',repo], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
JS = r"""
() => {
  const lines = new Set(); const perWeek = {};
  const add = (t, wk) => { if(!t) return; lines.add(t); (perWeek[wk] = perWeek[wk] || new Set()).add(t); };
  const modes = ['together','pene','jenna'];
  const saved = trainingMode;
  SITE_DATA.tracker.weeks.forEach(w => w.days.forEach(d => (d.blocks||[]).forEach(b => {
    if(b.timer && b.timer.type === 'tabata') return;
    const timing = parseTempo(b.tempo);
    if(!b.timer && !(timing.active || timing.rest)) return;
    modes.forEach(m => {
      trainingMode = m;
      buildRoundSteps(b, timing).forEach(s => {
        if(s.say){ add(s.say, w.id); return; }
        if(s.kind === 'work' && !s.isFirst) add('Next up! ' + s.exName + '. Go!', w.id);
        if(s.kind === 'rest' && s.isBetweenRounds && !s.needsManualStart) add('Round done! Bigger rest. ' + s.seconds + ' seconds.', w.id);
      });
    });
  })));
  trainingMode = saved;
  Object.values(CUES).forEach(a => a.forEach(t => add(t, 'cues')));
  add("Nice work! Tap start when you're ready to rest.", 'cues');
  const pw = {}; Object.keys(perWeek).forEach(k => pw[k] = [...perWeek[k]]);
  return { lines: [...lines], perWeek: pw, weeks: SITE_DATA.tracker.weeks.map(w => w.id + ' ' + w.label) };
}
"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto('http://localhost:8765/tracker.html'); pg.wait_for_timeout(1500)
    r = pg.evaluate(JS); b.close()
srv.terminate()
json.dump(r, open(out,'w'), indent=1)
