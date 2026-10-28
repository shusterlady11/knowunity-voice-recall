// POST /api/judge: judges one answer in a live session (docs/sprint-context.md › Real recall engine).
// A typed answer comes as JSON { topicId, n, answer }; a spoken one as form data { topicId, n, audio }, which is
// transcribed here first, so the student waits through one request, not two. The key points are looked up
// here, so the browser never holds an API key or decides what counts as right. Recordings aren't kept.

import { isTopicId, questionCount, topicFor } from '../../../content/topics';
import type { Take } from '../../../lib/recallEngine';
import { judgeAnswer } from '../../../lib/recallEngine/judge';
import { transcribe } from '../../../lib/recallEngine/transcribe';

/** Longer than any honest answer; anything past it is cut before it's judged. */
const maxAnswerLength = 2000;
/** A 3-minute recording at the recorder's bitrate is about 1.5 MB; this leaves room and stays under hosting limits. */
const maxAudioBytes = 4 * 1024 * 1024;

/** Sounds that aren't an attempt: a transcript of only these is treated as nothing heard. */
const fillers = new Set(['um', 'uh', 'uhm', 'er', 'erm', 'hmm', 'hm', 'mm', 'ah', 'oh']);

function words(transcript: string): string[] {
  return transcript.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function heardNothing(transcript: string): boolean {
  return words(transcript).every((word) => fillers.has(word));
}

export async function POST(request: Request) {
  const spoken = request.headers.get('content-type')?.startsWith('multipart/form-data') ?? false;
  let topicId: unknown;
  let n: number;
  let answer = '';
  let audio: File | null = null;
  if (spoken) {
    const form = await request.formData().catch(() => null);
    topicId = form?.get('topicId') ?? undefined;
    n = Number(form?.get('n'));
    const file = form?.get('audio');
    audio = file instanceof File && file.size > 0 && file.size <= maxAudioBytes ? file : null;
  } else {
    const body = (await request.json().catch(() => null)) as { topicId?: unknown; n?: unknown; answer?: unknown } | null;
    topicId = body?.topicId;
    n = Number(body?.n);
    answer = typeof body?.answer === 'string' ? body.answer.trim().slice(0, maxAnswerLength) : '';
  }
  // A missing topic is the default topic, as in an old saved session; an unknown one is a mistake.
  const topicOk = topicId === undefined || isTopicId(topicId);
  if (!topicOk || !Number.isInteger(n) || n < 1 || n > questionCount || (spoken ? !audio : !answer)) {
    return Response.json({ error: 'Send topicId, n (1 to 5) and a non-empty answer or audio file.' }, { status: 400 });
  }

  try {
    const question = topicFor(topicId as string | undefined).questions[n - 1];
    if (audio) {
      const transcript = (await transcribe(question, audio, audio.name)).slice(0, maxAnswerLength);
      // For telling a silent recording from an unclear one in the host's logs: sizes and counts, never the words.
      console.log('[judge] audio', { bytes: audio.size, type: audio.type, words: words(transcript).length });
      // Silence or only "um" is "didn't catch that", not a wrong answer. No words at all is silent ("I didn't hear
      // anything"); only fillers is something heard but not understood.
      if (heardNothing(transcript)) {
        const take = { kind: 'notCaught', ...(words(transcript).length === 0 && { silent: true }) } satisfies Take;
        return Response.json({ take, transcript: '' });
      }
      const { take } = await judgeAnswer(question, transcript);
      return Response.json({ take, transcript });
    }
    const { take } = await judgeAnswer(question, answer);
    return Response.json({ take });
  } catch (error) {
    console.error('[judge]', error);
    return Response.json({ error: 'The judge is unavailable.' }, { status: 502 });
  }
}
