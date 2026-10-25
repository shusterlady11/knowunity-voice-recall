'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/button/Button';
import { defaultCode } from '../../content/scripts';
import { clearAll, startSession } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

/**
 * Reset (SPEC.md › 5): clears the saved session and the "splash seen" flag between participants. Moderator
 * only. "Start" begins the tour at the topic picker (was the first-run splash, 2026-10-24), so nothing has to
 * be typed (decided 2026-10-07); a participant still starts from their own link.
 */
export default function ResetPage() {
  const router = useRouter();
  useEffect(() => clearAll(), []);

  const start = () => {
    startSession(defaultCode, '/pick');
    router.push('/pick');
  };

  return (
    <MessageScreen
      expression="standby"
      title="All cleared"
      caption="This phone is ready for the next participant. Open their link to start."
      actions={<Button variant="Primary" size="L" CTA="Start" onClick={start} />}
    />
  );
}
