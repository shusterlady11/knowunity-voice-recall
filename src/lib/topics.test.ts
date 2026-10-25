import { describe, expect, it } from 'vitest';
import { scripts } from '../content/scripts';
import { questionCount, topicFor, topicList, topics } from '../content/topics';
import { hintLevels, parseChain } from './recallEngine';

// The scripts, the progress meter and the hint ladder all assume the same shape for every topic, so a topic
// that drifts from it breaks a screen only when someone picks it. These tests catch that at once.
describe.each(topicList)('topic $id', (topic) => {
  it('has the five questions the routes are built from', () => {
    expect(topic.questions).toHaveLength(questionCount);
  });

  it.each(topic.questions.map((q, i) => [i + 1, q] as const))('question %i has the full shape', (_, q) => {
    expect(q.keyPoints).toHaveLength(3);
    expect(q.hints).toHaveLength(q.keyPoints.length);
    q.hints.forEach((ladder) => {
      expect(ladder).toHaveLength(hintLevels);
      ladder.forEach((hint) => expect(hint).toContain('{covered} of {total}'));
    });
    expect(q.prompt).toMatch(/^\*\*Q:\*\* .*\*\*[^*]+\*\*/);
    expect(q.correct).not.toBe('');
    expect(q.answer.title).not.toBe('');
    expect(q.answer.title).toBe(q.answer.title[0].toUpperCase() + q.answer.title.slice(1).toLowerCase());
    expect(q.answer.body).not.toBe('');
    expect(q.transcripts.correct && q.transcripts.partial && q.transcripts.wrong).toBeTruthy();
  });

  it('gives each concept its own name for Results', () => {
    const titles = topic.questions.map((q) => q.answer.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('scripts against every topic', () => {
  it.each(topicList)('only name key points that exist in $id', (topic) => {
    for (const [code, script] of Object.entries(scripts)) {
      for (const chain of [script.firstPass, script.laterPass]) {
        for (const [n, text] of Object.entries(chain)) {
          const keyPointCount = topic.questions[Number(n) - 1].keyPoints.length;
          for (const take of parseChain(text)) {
            if (take.kind === 'points') take.points.forEach((p) => expect(p, `${code} question ${n}`).toBeLessThanOrEqual(keyPointCount));
          }
        }
      }
    }
  });
});

describe('finding a topic', () => {
  it('falls back to the default for a missing or unknown id (a session saved before topics)', () => {
    expect(topicFor(undefined)).toBe(topics.cellularEnergetics);
    expect(topicFor('nope')).toBe(topics.cellularEnergetics);
    expect(topicFor('monopolies')).toBe(topics.monopolies);
  });
});
