// POST /api/judge: judges one typed answer in a live session (docs/sprint-context.md › Real recall engine).
// The browser sends which question and what the student wrote; the key points are looked up here, so the
// browser never holds the API key or decides what counts as right.

import { isTopicId, questionCount, topicFor } from '../../../content/topics';
import { judgeAnswer } from '../../../lib/recallEngine/judge';

/** Longer than any honest answer; anything past it is cut before it's judged. */
const maxAnswerLength = 2000;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { topicId?: unknown; n?: unknown; answer?: unknown } | null;
  const n = Number(body?.n);
  const answer = typeof body?.answer === 'string' ? body.answer.trim().slice(0, maxAnswerLength) : '';
  // A missing topic is the default topic, as in an old saved session; an unknown one is a mistake.
  const topicOk = body?.topicId === undefined || isTopicId(body.topicId);
  if (!topicOk || !Number.isInteger(n) || n < 1 || n > questionCount || !answer) {
    return Response.json({ error: 'Send topicId, n (1 to 5) and a non-empty answer.' }, { status: 400 });
  }

  try {
    const question = topicFor(body?.topicId as string | undefined).questions[n - 1];
    const { take } = await judgeAnswer(question, answer);
    return Response.json({ take });
  } catch (error) {
    console.error('[judge]', error);
    return Response.json({ error: 'The judge is unavailable.' }, { status: 502 });
  }
}
