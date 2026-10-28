import { describe, expect, it } from 'vitest';
import { barHeight, barOpacity, gateIsOpen, rms, smooth, targetFor } from './waveform';

const t = { gateOpen: 0.025, gateClose: 0.015, fullScaleRms: 0.25, curve: 0.7, attack: 0.18, release: 0.08 };

describe('waveform maths', () => {
  it('measures the level of a block of samples', () => {
    expect(rms(new Float32Array([0, 0, 0]))).toBe(0);
    expect(rms(new Float32Array([0.5, -0.5, 0.5, -0.5]))).toBeCloseTo(0.5);
  });

  it('keeps the gate where it was between the two thresholds', () => {
    expect(gateIsOpen(false, 0.02, t)).toBe(false);
    expect(gateIsOpen(true, 0.02, t)).toBe(true);
    expect(gateIsOpen(false, 0.03, t)).toBe(true);
    expect(gateIsOpen(true, 0.01, t)).toBe(false);
  });

  it('draws nothing while the gate is closed and caps at 1 when it is loud', () => {
    expect(targetFor(0.2, false, t)).toBe(0);
    expect(targetFor(1, true, t)).toBe(1);
    expect(targetFor(0.1, true, t)).toBeGreaterThan(0.4);
  });

  it('climbs faster than it falls, whatever the frame rate', () => {
    const up = smooth(0, 1, 16.7, t);
    const down = 1 - smooth(1, 0, 16.7, t);
    expect(up).toBeGreaterThan(down);
    const twoFast = smooth(smooth(0, 1, 8.35, t), 1, 8.35, t);
    expect(twoFast).toBeCloseTo(up, 1);
  });

  it('shapes bars from a dot at the edge to full height at the mic', () => {
    expect(barHeight(0, 0, 3, 200)).toBe(3);
    expect(barHeight(1, 0, 3, 200)).toBe(200);
    expect(barHeight(1, 1, 3, 200)).toBe(3);
    expect(barOpacity(0)).toBeCloseTo(0.9);
    expect(barOpacity(0.999)).toBe(0);
  });
});
