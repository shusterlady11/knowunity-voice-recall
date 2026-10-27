// The maths behind the dictating screen's voice waveform (the numbers are motion.waveform.* tokens, passed in).
// Kept apart from the canvas so the gate, the response curve and the bar shape can be tested without a browser.

export type WaveformTuning = {
  gateOpen: number;
  gateClose: number;
  fullScaleRms: number;
  curve: number;
  attack: number;
  release: number;
};

/** Root-mean-square level of a block of mic samples, 0 to 1. */
export function rms(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

/**
 * The noise gate with hysteresis: opens above gateOpen, closes below gateClose, and in between keeps whatever it
 * was, so room noise draws dots without fluttering.
 */
export function gateIsOpen(wasOpen: boolean, level: number, t: Pick<WaveformTuning, 'gateOpen' | 'gateClose'>): boolean {
  if (level > t.gateOpen) return true;
  if (level < t.gateClose) return false;
  return wasOpen;
}

/** The 0 to 1 target for a mic level: 0 while the gate is closed, otherwise the level scaled and curved. */
export function targetFor(level: number, open: boolean, t: Pick<WaveformTuning, 'gateClose' | 'fullScaleRms' | 'curve'>): number {
  if (!open) return 0;
  const raw = Math.min(1, Math.max(0, (level - t.gateClose) / (t.fullScaleRms - t.gateClose)));
  return Math.pow(raw, t.curve);
}

/** One frame of VU-meter ballistics: fast attack, slow release, the same at any frame rate. */
export function smooth(amplitude: number, target: number, dtMs: number, t: Pick<WaveformTuning, 'attack' | 'release'>): number {
  const rate = amplitude < target ? t.attack : t.release;
  return amplitude + (target - amplitude) * Math.min(1, rate * (dtMs / 16.7));
}

/** Height of the bar at distance d from the mic (0 at the mic, 1 at the screen edge) for a sample v of 0 to 1. */
export function barHeight(v: number, d: number, restHeight: number, maxHeight: number): number {
  return restHeight + v * (maxHeight - restHeight) * Math.pow(1 - d, 0.7);
}

/** Opacity of a bar or dot at distance d, or 0 when it is too faint to draw. */
export function barOpacity(d: number): number {
  const o = 0.9 * Math.pow(1 - d, 1.1);
  return o < 0.02 ? 0 : o;
}
