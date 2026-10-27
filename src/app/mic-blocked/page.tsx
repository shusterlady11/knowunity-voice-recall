'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { announce } from '../../lib/announcer';
import { requestMic } from '../../lib/microphone';
import { getSession, questionRoute, updateSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

const title = 'Turn on your mic';
const steps = 'open Settings › Apps › Safari › Microphone and choose Allow. Then tap Try again.';
const firstCaption = `To answer out loud, ${steps}`;
const stillOffCaption = `It’s still off. To answer out loud, ${steps}`;

/**
 * Mic blocked (2026-10-26, designer): opened by tapping the slashed mic when the browser has refused it in a
 * live session. No Figma frame; composed like the other message screens. Try again asks the browser once
 * more and, if allowed, goes back to answering out loud; Keep typing goes back to where the student was.
 * Not remembered as a route, so reopening the app resumes the question, not this.
 */
export default function MicBlockedPage() {
  const router = useRouter();
  const [stillOff, setStillOff] = useState(false);
  const caption = stillOff ? stillOffCaption : firstCaption;

  useEffect(() => announce(`${title}. ${firstCaption}`), []);

  // The question or result the student came from, in the current input mode.
  const back = () => {
    const route = getSession()?.route ?? '/';
    const n = Number(route.match(/^\/q\/(\d+)/)?.[1]);
    router.replace(route.endsWith('/result') || !n ? route : questionRoute(n));
  };

  const tryAgain = async () => {
    if (!(await requestMic())) {
      setStillOff(true);
      announce(stillOffCaption);
      return;
    }
    updateSession((s) => {
      s.micBlocked = false;
      s.inputMode = 'voice';
    });
    announce('Mic on. You can answer out loud.');
    back();
  };

  return (
    <MessageScreen
      expression="standby"
      title={title}
      caption={caption}
      actions={
        <ButtonGroup variant="Vertical" size="L">
          <Button variant="Primary" size="L" CTA="Try again" onClick={tryAgain} />
          <Button variant="Secondary" size="L" CTA="Keep typing" onClick={back} />
        </ButtonGroup>
      }
    />
  );
}
