// Which Results card a question lands in (SPEC.md › 8). Only an answer that was right with no hint counts as a
// good explanation, and so as part of the ring and the headline (decided 2026-10-12); one that was right after
// a hint goes in its own card. A reveal already moves a concept to needs practice (decided 2026-10-06).

import type { QuestionRecord } from './session';

export type ResultsCategory = 'good-explanations' | 'with-hints' | 'needs-practice' | 'skipped-questions';

/** The card for one question's record. A question left without an outcome (the student left mid-way) counts as skipped. */
export function categoryFor(record: QuestionRecord | undefined): ResultsCategory {
  switch (record?.outcome) {
    case 'correct':
      // A hint was shown on the way to this answer, so it wasn't answered on its own.
      return (record.hintsUsed?.length ?? 0) > 0 ? 'with-hints' : 'good-explanations';
    case 'needsPractice':
      return 'needs-practice';
    default:
      return 'skipped-questions';
  }
}
