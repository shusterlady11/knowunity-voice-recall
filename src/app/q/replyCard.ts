// What Knowie's reply card says and looks like for a judged take. One copy, so the result screen and the typing
// screen (which keeps the reply in view for a retry) always agree.

import { timedOut, type Question } from '../../content/questions';
import { fillHint, type Feedback, type Verdict } from '../../lib/recallEngine';

export const cardState: Record<Verdict, 'answer-correct' | 'answer-partial' | 'answer-error' | 'answer-notcaught'> = {
  correct: 'answer-correct',
  partial: 'answer-partial',
  wrong: 'answer-error',
  notCaught: 'answer-notcaught',
};

// Why a take wasn't caught: nothing heard at all, or something the judge couldn't make out.
export const notCaughtReason = { silent: 'I didn’t hear anything.', unclear: 'I couldn’t understand that take.' };

/**
 * What the reply card says for a feedback: the hint, the correct line, the slow-take line or why a take wasn't
 * caught.
 */
export function replyMessage(question: Question, feedback: Feedback, covered: number[]): string | undefined {
  return feedback.kind === 'correct'
    ? question.correct
    : feedback.kind === 'hint'
      ? fillHint(question.hints[feedback.keyPoint - 1][feedback.level - 1], covered, question.keyPointNames, feedback.level)
      : feedback.kind === 'timedOut'
        ? timedOut
        : feedback.kind === 'notCaught'
          ? notCaughtReason[feedback.silent ? 'silent' : 'unclear']
          : undefined;
}
