"""Builds timer-voice.json: the coach's recorded lines for the Round Timer,
EMOM, AMRAP, Partner and Race timers (Tabata has its own coach-voice.json).

Same voice as the Tabata coach: Kokoro, 65% af_heart + 35% af_bella, speed 1.12,
compressed for punch, 24 kHz mono MP3 at 48 kbps.

Usage: python3 make_timer_voice.py lines.json timer-voice.json MODEL_DIR
lines.json is {"lines": [...]} (every line the timers can say, exactly as the
app writes it). Lines already in an existing timer-voice.json are kept, so a
new batch only records what's new.
"""
import json, sys, os, re, base64, subprocess, tempfile
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

lines_path, out_path, model_dir = sys.argv[1:4]
lines = json.load(open(lines_path))['lines']
old = {}
if os.path.exists(out_path):
    old = json.load(open(out_path)).get('clips', {})

def key(t):  # must match timerVoiceKey() in tracker.html
    return re.sub(r'[^a-z0-9]+', ' ', t.lower()).strip()

def spoken(t):  # how to say it (the app's text was written for the phone voice)
    t = t.replace('E MOM', 'E-mom').replace('A M RAP', 'Am-rap')
    return t

k = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))
voice = 0.65 * k.get_voice_style('af_heart') + 0.35 * k.get_voice_style('af_bella')
clips = {}
tmp = tempfile.mkdtemp()
for i, t in enumerate(lines):
    kk = key(t)
    if kk in clips: continue
    if kk in old: clips[kk] = old[kk]; continue
    audio, sr = k.create(spoken(t), voice=voice, speed=1.12, lang='en-us')
    wav = os.path.join(tmp, 'c.wav'); mp3 = os.path.join(tmp, 'c.mp3')
    sf.write(wav, audio, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav,
        '-af', 'acompressor=threshold=-20dB:ratio=4:attack=5:release=60:makeup=4,loudnorm=I=-14:TP=-1.0:LRA=7',
        '-ar', '24000', '-ac', '1', '-b:a', '48k', mp3], check=True)
    clips[kk] = base64.b64encode(open(mp3, 'rb').read()).decode()
    print(f'{i+1}/{len(lines)}', t, flush=True)
json.dump({'voice': 'Coach (af_heart 65% + af_bella 35%, Kokoro, speed 1.12)', 'clips': clips},
          open(out_path, 'w'), separators=(',', ':'))
print('clips', len(clips), 'bytes', os.path.getsize(out_path))
