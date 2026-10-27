// Runs every sample answer through the real judge and checks it covers the key points the sample expects
// (eval/judge/samples.ts). It calls Claude once per sample, so it costs a little each run and isn't part of
// `npm run check`: run it with `npm run eval:judge` after changing the judge's prompt, model or the samples.

import { afterAll, describe, expect, test } from 'vitest';
import { topics } from '../../src/content/topics';
import type { TopicId } from '../../src/content/questions';
import { judgeAnswer, judgeModel } from '../../src/lib/recallEngine/judge';
import { samples } from './samples';

const timings: number[] = [];
let agreed = 0;
const tokens = { input: 0, output: 0 };
// Dollars per million input and output tokens (cached 2026-10-06; check current prices before relying on them).
const prices: Record<string, [number, number]> = {
  'claude-opus-5-5': [4, 20],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-5-5': [0.1, 0.5],
};

for (const [topicId, list] of Object.entries(samples) as [TopicId, (typeof samples)[TopicId]][]) {
  describe.concurrent(topics[topicId].name, () => {
    list.forEach((sample, i) => {
      test(`q${sample.q} #${i + 1}: ${sample.answer.slice(0, 60)}`, async () => {
        const started = performance.now();
        const { take, reason, usage } = await judgeAnswer(topics[topicId].questions[sample.q - 1], sample.answer);
        timings.push(performance.now() - started);
        tokens.input += usage.input;
        tokens.output += usage.output;
        const got = take.kind === 'idk' ? 'idk' : take.kind === 'points' ? take.points : take.kind;
        const want = sample.expect;
        expect(got, `judge's reason: ${reason}${sample.note ? `\nsample note: ${sample.note}` : ''}`).toEqual(want);
        agreed++;
      });
    });
  });
}

afterAll(() => {
  const total = Object.values(samples).flat().length;
  const sorted = [...timings].sort((a, b) => a - b);
  const at = (q: number) => (sorted.length ? (sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] / 1000).toFixed(1) : '-');
  const [inPrice, outPrice] = prices[judgeModel] ?? [NaN, NaN];
  const cost = (tokens.input * inPrice + tokens.output * outPrice) / 1e6;
  const per = (n: number) => Math.round(n / Math.max(timings.length, 1));
  console.log(`\n${judgeModel} agreed with ${agreed} of ${total} samples. Time per answer: median ${at(0.5)}s, 90th percentile ${at(0.9)}s.`);
  console.log(`Tokens per answer: ${per(tokens.input)} in, ${per(tokens.output)} out. This run: $${cost.toFixed(3)} (${((cost / Math.max(timings.length, 1)) * 100).toFixed(3)}¢ per answer).`);
});
