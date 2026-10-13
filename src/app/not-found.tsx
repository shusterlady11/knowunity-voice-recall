'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../components/button/Button';
import { MessageScreen } from './MessageScreen';

/**
 * Any address that isn't a screen (a mistyped link, or a question number outside 1 to 5): a message in the
 * app's own look, with a way back, instead of the framework's plain 404. The home address picks up where the
 * student was (or starts a fresh session), so the button says "Go back".
 */
export default function NotFound() {
  const router = useRouter();
  return (
    <MessageScreen
      expression="confused"
      title="This page doesn’t exist"
      caption="Check the link, or go back to where you were."
      actions={<Button variant="Primary" size="L" CTA="Go back" onClick={() => router.push('/')} />}
    />
  );
}
