'use client';

import { useEffect, useRef, useState } from 'react';
import { durationMs, tokenNumber } from '../../../../lib/motion';
import { unlockAudio } from '../../../../lib/microphone';
import { barHeight, barOpacity, gateIsOpen, rms, smooth, targetFor, type WaveformTuning } from '../../../../lib/waveform';
import './voiceWaveform.css';

/** Reduced motion redraws this often instead of every frame. */
const REDUCED_REFRESH_MS = 250;
/** A frame this late means the tab was throttled; the clock restarts instead of catching up in a burst. */
const STALL_MS = 500;

/**
 * The voice waveform: mirrored bars behind the mic that follow the live mic level and travel outward, fading as
 * they go. It listens to the recorder's own stream through an analyser (no second getUserMedia) and draws only
 * while `active`; when dictation ends, for any reason, it fades out and then stops drawing. It is decoration:
 * hidden from screen readers, which already hear "Listening for your answer."
 */
export function VoiceWaveform({ stream, active }: { stream: MediaStream | null; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ended, setEnded] = useState(false);
  // Drawing outlives `active` by the fade out, then stops.
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(false);
  const live = active && !ended && stream !== null;

  // The mic going away under us (permission pulled, device unplugged) ends dictation's waveform too.
  useEffect(() => {
    const track = stream?.getAudioTracks()[0];
    if (!track) return;
    const onEnded = () => setEnded(true);
    track.addEventListener('ended', onEnded);
    return () => track.removeEventListener('ended', onEnded);
  }, [stream]);

  // Fade in as listening starts; on any end, fade out, then let the draw loop stop.
  useEffect(() => {
    if (live) {
      const frame = requestAnimationFrame(() => {
        setRunning(true);
        setShown(true);
      });
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => setRunning(false), durationMs('--motion-duration-hintFadeOut'));
    return () => clearTimeout(timer);
  }, [live]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!stream || !running || !canvas) return;
    const ctx2d = canvas.getContext('2d');
    const audio = unlockAudio();
    if (!ctx2d || !audio) return;
    void audio.resume();

    const tuning: WaveformTuning = {
      gateOpen: tokenNumber('--motion-waveform-gateOpen'),
      gateClose: tokenNumber('--motion-waveform-gateClose'),
      fullScaleRms: tokenNumber('--motion-waveform-fullScaleRms'),
      curve: tokenNumber('--motion-waveform-curve'),
      attack: tokenNumber('--motion-waveform-attack'),
      release: tokenNumber('--motion-waveform-release'),
    };
    const barWidth = tokenNumber('--motion-waveform-barWidth');
    const pitch = barWidth + tokenNumber('--motion-waveform-barGap');
    const restHeight = tokenNumber('--motion-waveform-restHeight');
    const maxHeight = tokenNumber('--motion-waveform-maxHeight');
    const interval = durationMs('--motion-duration-waveformSample');
    const color = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-coral-bold').trim();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Listen to the recorder's stream; the analyser is never connected on to the speakers.
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0;
    source.connect(analyser);
    const block = new Float32Array(analyser.fftSize);

    let width = 0;
    let history: number[] = []; // newest first; all zeros to start, so the screen opens on a row of dots
    let fixedShape: number[] = []; // reduced motion: each bar's constant factor, set once
    const resize = () => {
      const frame = canvas.closest('.scaffold') ?? document.documentElement;
      width = frame.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(maxHeight * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${maxHeight}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      const length = Math.ceil(width / 2 / pitch) + 2;
      history = Array.from({ length }, (_, i) => history[i] ?? 0);
      fixedShape = Array.from({ length }, (_, i) => fixedShape[i] ?? 0.7 + Math.random() * 0.3);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.closest('.scaffold') ?? document.documentElement);
    resize();

    const bar = (x: number, h: number) => {
      ctx2d.beginPath();
      if (ctx2d.roundRect) ctx2d.roundRect(x - barWidth / 2, (maxHeight - h) / 2, barWidth, h, barWidth / 2);
      else ctx2d.rect(x - barWidth / 2, (maxHeight - h) / 2, barWidth, h);
      ctx2d.fill();
    };
    const draw = (travel: number, heightOf: (i: number) => number) => {
      ctx2d.clearRect(0, 0, width, maxHeight);
      ctx2d.fillStyle = color;
      const half = width / 2;
      for (let i = 0; i < history.length; i++) {
        const offset = (i + travel) * pitch + pitch / 2;
        const d = offset / half;
        if (d >= 1) break;
        const alpha = barOpacity(d);
        if (alpha === 0) continue;
        ctx2d.globalAlpha = alpha;
        const h = barHeight(heightOf(i), d, restHeight, maxHeight);
        bar(half + offset, h);
        bar(half - offset, h);
      }
      ctx2d.globalAlpha = 1;
    };

    let gate = false;
    let amplitude = 0;
    let last = performance.now();
    let lastPush = last;
    let lastRefresh = last;
    let frame = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      let dt = now - last;
      last = now;
      if (dt > STALL_MS) {
        lastPush = now;
        lastRefresh = now;
        dt = 16.7;
      }
      analyser.getFloatTimeDomainData(block);
      const level = rms(block);
      gate = gateIsOpen(gate, level, tuning);
      amplitude = smooth(amplitude, targetFor(level, gate, tuning), dt, tuning);

      if (reduced) {
        // No travel: a fixed shape whose height follows the level, refreshed four times a second.
        if (now - lastRefresh < REDUCED_REFRESH_MS) return;
        lastRefresh = now;
        draw(0, (i) => amplitude * fixedShape[i]);
        return;
      }
      if (now - lastPush >= interval) {
        history.unshift(amplitude);
        history.length -= 1;
        lastPush = now - ((now - lastPush) % interval);
      }
      draw((now - lastPush) / interval, (i) => history[i]);
    };
    // Dots straight away, before the first frame.
    draw(0, () => 0);
    frame = requestAnimationFrame(tick);

    // The recorder owns the stream: only detach from it, never stop it or close the shared audio context.
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      source.disconnect();
      analyser.disconnect();
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [stream, running]);

  return <canvas ref={canvasRef} className="voiceWaveform" data-visible={(shown && live) || undefined} aria-hidden="true" />;
}
