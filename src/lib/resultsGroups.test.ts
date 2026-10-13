import { describe, expect, it } from 'vitest';
import { categoryFor } from './resultsGroups';

describe('which Results card a question lands in', () => {
  it('puts a correct answer with no hint in good explanations', () => {
    expect(categoryFor({ takes: 1, outcome: 'correct' })).toBe('good-explanations');
    expect(categoryFor({ takes: 1, outcome: 'correct', hintsUsed: [] })).toBe('good-explanations');
  });

  it('puts a correct answer after a hint in its own card', () => {
    expect(categoryFor({ takes: 2, outcome: 'correct', hintsUsed: [3] })).toBe('with-hints');
    expect(categoryFor({ takes: 3, outcome: 'correct', hintsUsed: [3, 1] })).toBe('with-hints');
  });

  it('counts a correct retry after "didn’t catch that" as unaided, since no hint was shown', () => {
    expect(categoryFor({ takes: 2, outcome: 'correct', hintsUsed: [] })).toBe('good-explanations');
  });

  it('keeps a revealed or missed concept in needs practice, even after a hint', () => {
    expect(categoryFor({ takes: 2, outcome: 'needsPractice', hintsUsed: [1], revealed: true })).toBe('needs-practice');
    expect(categoryFor({ takes: 1, outcome: 'needsPractice' })).toBe('needs-practice');
  });

  it('puts skipped and unfinished questions in skipped', () => {
    expect(categoryFor({ takes: 0, outcome: 'skipped' })).toBe('skipped-questions');
    expect(categoryFor({ takes: 0 })).toBe('skipped-questions');
    expect(categoryFor(undefined)).toBe('skipped-questions');
  });
});
