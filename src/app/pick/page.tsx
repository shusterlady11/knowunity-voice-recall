'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { defaultCode } from '../../content/scripts';
import { topicList } from '../../content/topics';
import type { TopicId } from '../../content/questions';
import { announce } from '../../lib/announcer';
import { getSession, hasSeenSplash, rememberRoute, startSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

const title = 'What are you studying?';
const caption = 'Pick a topic to explain out loud.';

/**
 * Topic picker (SPEC.md › 12): the first screen a student sees, so the session runs on a topic they know.
 * No Figma frame; composed like the other message screens. Each option starts a new session on that topic,
 * keeping the script code of the session before it, and goes on to the first-run splash, or to question 1
 * once this phone has seen the splash, as the entry link does.
 */
export default function PickPage() {
  const router = useRouter();

  // Opened with no session yet (a typed address), there's nothing to remember until a topic is picked.
  useEffect(() => rememberRoute('/pick'), []);
  useEffect(() => announce(`${title} ${caption}`), []);

  const pick = (id: TopicId, name: string) => {
    announce(`${name} selected.`);
    const route = hasSeenSplash() ? '/q/1' : '/start';
    startSession(getSession()?.code ?? defaultCode, route, id);
    router.push(route);
  };

  return (
    <MessageScreen
      expression="standby"
      title={title}
      caption={caption}
      actions={
        <ButtonGroup variant="Vertical" size="L">
          {topicList.map(({ id, name }) => (
            <Button key={id} variant="Secondary" size="L" CTA={name} onClick={() => pick(id, name)} />
          ))}
        </ButtonGroup>
      }
    />
  );
}
