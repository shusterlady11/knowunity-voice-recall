'use client';

import { useEffect, useState } from 'react';

// The one visually hidden live region that tells screen-reader users every state change in a full sentence
// (SPEC.md › Screen-reader announcements; docs/recordingglow-listening-spec.md §7). It sits in the root
// layout, so a message said just before a route change ("Recording cancelled.") is still heard after it.

let setMessage: ((message: string) => void) | null = null;

// A sentence said within this long after another is read after it, so a screen that opens right after another
// ("Recording cancelled." then the question) doesn't cut the first one off. Only the one before is carried, so
// the region never piles up.
const QUEUE_WINDOW_MS = 800;
// The same sentence again this soon is one event reported twice (React runs effects twice in development), not
// a second announcement.
const DUPLICATE_WINDOW_MS = 100;
let last = { message: '', time: 0 };

/** Says a sentence to screen-reader users. The same sentence twice in a row, a moment apart, is said twice. */
export function announce(message: string) {
  const now = Date.now();
  if (message === last.message && now - last.time < DUPLICATE_WINDOW_MS) return;
  const text = now - last.time < QUEUE_WINDOW_MS ? `${last.message} ${message}` : message;
  last = { message, time: now };
  setMessage?.('');
  requestAnimationFrame(() => setMessage?.(text));
}

export function Announcer() {
  const [message, setOwnMessage] = useState('');
  useEffect(() => {
    setMessage = setOwnMessage;
    return () => {
      setMessage = null;
    };
  }, []);
  return (
    <div className="announcer" role="status" aria-live="polite">
      {message}
    </div>
  );
}
