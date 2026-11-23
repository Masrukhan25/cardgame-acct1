// Synthesized sound for TIDECALL DUEL: WebAudio oscillators only, no audio files.
// Each effect is a short tone pattern; the mute toggle silences everything.

let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function audio() {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, dur, type = 'sine', vol = 0.12, when = 0) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  click() { tone(660, 0.06, 'triangle', 0.08); },
  draw() { tone(520, 0.09, 'sine', 0.1); tone(780, 0.09, 'sine', 0.08, 0.05); },
  play() { tone(440, 0.12, 'triangle', 0.12); tone(660, 0.12, 'triangle', 0.1, 0.07); },
  damage() { tone(160, 0.22, 'sawtooth', 0.14); tone(110, 0.25, 'square', 0.1, 0.03); },
  bigHit() { tone(120, 0.35, 'sawtooth', 0.18); tone(80, 0.4, 'square', 0.14, 0.05); tone(240, 0.15, 'triangle', 0.1, 0.02); },
  heal() { tone(523, 0.12, 'sine', 0.1); tone(659, 0.12, 'sine', 0.1, 0.08); tone(784, 0.16, 'sine', 0.1, 0.16); },
  shield() { tone(330, 0.15, 'triangle', 0.1); tone(415, 0.15, 'triangle', 0.08, 0.06); },
  turn() { tone(392, 0.1, 'sine', 0.09); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, i * 0.12)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.28, 'sine', 0.11, i * 0.14)); },
};
