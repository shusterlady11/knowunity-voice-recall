// Speech-to-text for a live session's spoken answers (docs/sprint-context.md › Real recall engine, phase 2):
// OpenAI gpt-transcribe, chosen by the designer 2026-10-26. Server only: it reads OPENAI_API_KEY, so only the
// /api/judge route imports it.

import OpenAI, { toFile } from 'openai';
import type { Question } from '../../content/questions';

let client: OpenAI | null = null;

/**
 * The terms worth spelling right: the question's bold words (e.g. "salutary neglect") and the concept's name.
 * Only the question's own vocabulary, never the key points, so a hint can't put the right answer in a
 * student's mouth.
 */
function keywordsFor(question: Question): string[] {
  const bold = [...question.prompt.matchAll(/\*\*(.+?)\*\*/g)].map((m) => m[1]).filter((term) => term !== 'Q:');
  // Keywords can't hold angle brackets or line breaks, or the whole request is rejected.
  return [...new Set([...bold, question.answer.title])].map((term) => term.replace(/[<>\r\n]/g, ' ').trim()).filter(Boolean);
}

/** The words in one recording, trimmed; empty when nothing was said. */
export async function transcribe(question: Question, audio: Blob, filename: string): Promise<string> {
  client ??= new OpenAI();
  const transcription = await client.audio.transcriptions.create({
    model: 'gpt-transcribe',
    file: await toFile(audio, filename, { type: audio.type }),
    prompt: `A high school student answers a study question out loud, in their own words: ${question.prompt.replaceAll('**', '')}`,
    keywords: keywordsFor(question),
    languages: ['en'],
  });
  return transcription.text.trim();
}
