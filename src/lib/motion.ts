'use client';

/**
 * A duration token in milliseconds, for timers in code. The CSS build can rewrite a token like 3000ms as 3s,
 * so the unit is read too.
 */
export function durationMs(token: string): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
}

/** A plain number or pixel token (0.7, 3px), for values read in code. */
export function tokenNumber(token: string): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(token));
}
