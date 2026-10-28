'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { defaultCode } from '../../content/scripts';
import { clearAll, startSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

/**
 * Reset (SPEC.md › 5): clears the saved session and the "splash seen" flag between participants. Moderator
 * only. Either button begins the tour at the topic picker (was the first-run splash, 2026-10-24), so nothing
 * has to be typed (decided 2026-10-07): "Start live session" listens to spoken answers and judges them and
 * typed ones, "Start scripted session" keeps every verdict scripted (2026-10-26). Every other way in, a
 * participant's link included, is live (2026-10-28).
 */
export default function ResetPage() {
  const router = useRouter();
  useEffect(() => clearAll(), []);

  const start = (live: boolean) => {
    startSession(defaultCode, '/pick', undefined, live);
    router.push('/pick');
  };

  return (
    <MessageScreen
      expression="standby"
      title="All cleared"
      caption="This phone is ready for the next participant. Open their link, or start a session here."
      actions={
        <ButtonGroup variant="Vertical" size="L">
          <Button variant="Primary" size="L" CTA="Start live session" onClick={() => start(true)} />
          <Button variant="Secondary" size="L" CTA="Start scripted session" onClick={() => start(false)} />
        </ButtonGroup>
      }
    />
  );
}
