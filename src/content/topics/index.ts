// Every topic a session can run on, in the order the picker lists them. The first is the one an old saved
// session, or an entry link with no topic, falls back to.

import type { Topic, TopicId } from '../questions';
import { americanRevolution } from './americanRevolution';
import { cellularEnergetics } from './cellularEnergetics';
import { cellStructure } from './cellStructure';
import { monopolies } from './monopolies';

export const topics: Record<TopicId, Topic> = { cellularEnergetics, cellStructure, monopolies, americanRevolution };

/** The topics in the order the picker shows them. */
export const topicList: Topic[] = [monopolies, cellStructure, americanRevolution, cellularEnergetics];

export const defaultTopicId: TopicId = 'cellularEnergetics';

/** Every topic has this many questions; the question routes are built from it. */
export const questionCount = 5;

export function isTopicId(value: unknown): value is TopicId {
  return typeof value === 'string' && value in topics;
}

/** The topic for a saved id; anything missing or unknown (an old session) is the default topic. */
export function topicFor(id: string | undefined): Topic {
  return isTopicId(id) ? topics[id] : topics[defaultTopicId];
}
