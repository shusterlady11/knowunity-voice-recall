// The shape of a topic's content, plus the lines every topic shares. The topics themselves live in
// src/content/topics/ (one file each), and src/content/topics/index.ts is the list the picker offers.

export type Question = {
  /** The question card's text. */
  prompt: string;
  /** The 3 ideas a good answer covers (the scripts assume 3). Scripts refer to them by number, from 1. */
  keyPoints: string[];
  /**
   * A short name for each key point, in the same order, said back to the student in a hint: "You got the
   * active site fit." Lowercase unless a proper noun, since it sits inside a sentence (2026-10-27).
   */
  keyPointNames: string[];
  /**
   * A ladder of hints per key point, in the same order, each one more specific than the last (2026-10-12: the
   * fixed "You're close" nudge is gone; every retry gets a new hint). The engine puts the names of the key
   * points already covered in front (fillHint).
   */
  hints: string[][];
  /** Knowie's line on a correct answer. */
  correct: string;
  /**
   * The Reveal answer and More info sheet: the concept's name in the sheet's bar, a short heading, then the
   * answer and context.
   */
  answer: { title: string; heading: string; body: string };
  /**
   * What the student "said", canned for each kind of take (participants are told the words are
   * placeholders). Shown only in the Results rows, every take joined.
   */
  transcripts: { correct: string; partial: string; wrong: string };
};

export type TopicId = 'cellularEnergetics' | 'cellStructure' | 'monopolies' | 'americanRevolution';

/** One topic a session can run on: five questions, the name on the topic pill and the intro card. */
export type Topic = {
  id: TopicId;
  /** The topic pill's text and the picker's option. */
  name: string;
  /** The intro card, shown above question 1 only. */
  intro: string;
  /** Exactly 5: the scripts and the progress meter assume it. */
  questions: Question[];
};

/** The transcript for an "I don't know" take. */
export const idkTranscript = 'I don’t know.';

/** What the result card says when a slow take gave up waiting (2026-10-12): the delay was ours, not the student's audio. */
export const timedOut = 'That took longer than it should. Let’s try again.';
