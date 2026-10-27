'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { defaultCode } from '../../content/scripts';
import type { EndedBy } from '../../lib/session';
import { getSession, rememberRoute, reopenSession, startSession, useSession } from '../../lib/session';
import { announce } from '../../lib/announcer';
import { MessageScreen } from '../MessageScreen';

// One message for each way in (SPEC.md › 9), split into a headline and the line under it.
const messages: Record<EndedBy, { title: string; caption: string }> = {
  finished: { title: 'Nice work.', caption: 'You’re done.' },
  left: { title: 'Progress saved.', caption: 'Come back any time.' },
  optedOut: { title: 'No problem.', caption: 'Maybe next time.' },
};

/**
 * End screen (SPEC.md › 9): Knowie and one message, chosen by how the student got here, which the button
 * that led here saved in the session (was D3). No Figma frame; composed like the other message screens.
 * A student who left gets "Keep going", back to their question, and "Start over" (2026-10-24), a new
 * session at the topic picker; one who opted out gets "Go back", to Mic skipped. A student who finished gets "New topic" (2026-10-21, replacing 2026-10-07's "nothing to tap"): the
 * home address starts a fresh session at the topic picker (2026-10-24; with one topic it was the splash).
 */
export default function DonePage() {
  const router = useRouter();
  const endedBy = useSession()?.endedBy ?? 'finished';

  const backTo = (route: string) => {
    reopenSession(route);
    router.push(route);
  };
  const keepGoing = () => backTo(getSession()?.route ?? '/q/1');
  // A new session on the same script, at the topic picker: the saved place is dropped (2026-10-24).
  const startOver = () => {
    const previous = getSession();
    startSession(previous?.code ?? defaultCode, '/pick', undefined, previous?.live);
    router.push('/pick');
  };

  // A finished or opted-out session reopens on this message; one the student left resumes where they were.
  useEffect(() => {
    if (getSession()?.endedBy !== 'left') rememberRoute('/done');
  }, []);

  // Said once when the message shows: the headline and the line under it.
  const { title, caption } = messages[endedBy];
  useEffect(() => announce(`${title} ${caption}`), [title, caption]);

  const actions =
    endedBy === 'left' ? (
      <ButtonGroup variant="Vertical" size="L">
        <Button variant="Primary" size="L" CTA="Keep going" onClick={keepGoing} />
        <Button variant="Secondary" size="L" CTA="Start over" onClick={startOver} />
      </ButtonGroup>
    ) : endedBy === 'optedOut' ? (
      <Button variant="Primary" size="L" CTA="Go back" onClick={() => backTo('/mic-off')} />
    ) : (
      // The home address sees a finished session and starts a new one at the topic picker.
      <Button variant="Primary" size="L" CTA="New topic" onClick={() => router.push('/')} />
    );

  return (
    <MessageScreen
      expression="approving"
      title={messages[endedBy].title}
      caption={messages[endedBy].caption}
      actions={actions}
    />
  );
}
