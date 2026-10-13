// The mocked recall engine (SPEC.md › How the mocked recall behaves › The engine). Given a take, it says
// which key points the take covered, the same shape a real engine (speech recognition + an AI judge) would
// return, so a real one can replace `judgeTake` later without touching the screens. Everything else, the
// verdict, the covered count, the hint and XP, is worked out from that.

import type { Script } from '../../content/scripts';

/** What one take turned out to be. */
export type Take =
  | { kind: 'points'; points: number[] }
  | { kind: 'notCaught' }
  | { kind: 'idk' }
  | { kind: 'slow' };

export type Verdict = 'correct' | 'partial' | 'wrong' | 'notCaught';

const nothing: Take = { kind: 'points', points: [] };

/** Reads one take from a script chain: "1,2", "-" (covers nothing), "notCaught", "idk" or "slow". */
export function parseTake(text: string): Take {
  const t = text.trim();
  if (t === 'notCaught' || t === 'idk' || t === 'slow') return { kind: t };
  if (t === '-' || t === '') return nothing;
  return { kind: 'points', points: t.split(',').map((p) => Number(p.trim())) };
}

/** Reads a whole chain: takes separated by ">". */
export function parseChain(chain: string): Take[] {
  return chain.split('>').map(parseTake);
}

/**
 * The script's take for a question. `takeNumber` counts from 1. Pass 1 uses the first-pass chain, later
 * passes the later-pass chain. A take beyond the plan covers nothing new.
 */
export function judgeTake(script: Script, pass: number, question: number, takeNumber: number): Take {
  const chain = (pass === 1 ? script.firstPass : script.laterPass)[question];
  if (!chain) return nothing;
  return parseChain(chain)[takeNumber - 1] ?? nothing;
}

/** Key points covered so far on a question, adding this take's to the earlier ones. Sorted, no repeats. */
export function combine(covered: number[], take: Take): number[] {
  if (take.kind !== 'points') return covered;
  return [...new Set([...covered, ...take.points])].sort((a, b) => a - b);
}

/** The verdict from combined coverage: all key points correct, some partial, none wrong. */
export function verdictFor(covered: number[], keyPointCount: number): Verdict {
  if (covered.length >= keyPointCount) return 'correct';
  return covered.length > 0 ? 'partial' : 'wrong';
}

/** What the result card says, chosen when the take is judged. */
export type Feedback =
  | { kind: 'correct' }
  // The next hint for a key point the student hasn't covered. `level` 1 is the gentlest; each level after it is
  // more specific. `fresh` is false when every hint has been given and this one is the last, repeated.
  | { kind: 'hint'; keyPoint: number; level: number; fresh: boolean }
  | { kind: 'notCaught' }
  // The judge took too long and gave up (a slow take), so the audio wasn't the problem.
  | { kind: 'timedOut' };

/** How many hints each key point has, from gentle to specific. */
export const hintLevels = 3;

/**
 * The card's feedback for a verdict. A partial or wrong always gets another hint (2026-10-12; the fixed "You're
 * close" nudge is gone): first the gentlest hint for each key point the student hasn't covered, in order, then
 * the next level for each, and so on. `hintsUsed` lists the key point of every hint already shown, repeats
 * included. When every hint has been given, the most specific one for the first uncovered key point is shown again;
 * Reveal answer is the way out from there.
 */
export function feedbackFor(verdict: Verdict, covered: number[], hintsUsed: number[], keyPointCount: number): Feedback {
  if (verdict === 'correct') return { kind: 'correct' };
  if (verdict === 'notCaught') return { kind: 'notCaught' };
  const uncovered = Array.from({ length: keyPointCount }, (_, i) => i + 1).filter((keyPoint) => !covered.includes(keyPoint));
  const shown = (keyPoint: number) => hintsUsed.filter((used) => used === keyPoint).length;
  for (let level = 1; level <= hintLevels; level++) {
    for (const keyPoint of uncovered) {
      if (shown(keyPoint) < level) return { kind: 'hint', keyPoint, level, fresh: true };
    }
  }
  return { kind: 'hint', keyPoint: uncovered[0] ?? 1, level: hintLevels, fresh: false };
}

/** Fills a hint's {covered} and {total} with the covered count. */
export function fillHint(hint: string, covered: number[], keyPointCount: number): string {
  return hint.replace('{covered}', String(covered.length)).replace('{total}', String(keyPointCount));
}

/** XP for how a question ended (SPEC.md › How the mocked recall behaves › XP). */
export function xpFor(outcome: { kind: 'correct'; firstTry: boolean; revealed: boolean } | { kind: 'needsPractice' } | { kind: 'skipped' }): number {
  if (outcome.kind === 'skipped') return 0;
  if (outcome.kind === 'needsPractice') return 1;
  if (outcome.revealed) return 1;
  return outcome.firstTry ? 10 : 5;
}
