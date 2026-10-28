'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { AnswerCard } from '../../../../components/answerCard/AnswerCard';
import { ToggleGroup } from '../../../../components/toggleGroup/ToggleGroup';
import { ChatInput } from '../../../../components/chatInput/ChatInput';
import { bold } from '../../../../content/bold';
import { endQuestion, questionRecord, questionRoute, rememberRoute, updateSession, useSession, useTopic, type Session } from '../../../../lib/session';
import { announce } from '../../../../lib/announcer';
import { useQuestionEnter } from '../../../../lib/questionEnter';
import { cardState, replyMessage } from '../../replyCard';
import { ExitConfirm } from '../../ExitConfirm';
import '../../exitConfirm.css';
import './type.css';

type Status = 'Inactive' | 'Ready to send' | 'Long input';

/**
 * Typing: the keyboard way to answer, built around chatInput. The toggle row (back to voice, and Skip)
 * shows while the keyboard is down and hides while it's up. A sent answer goes to the same mock engine as
 * a spoken one, and its exact words become the take's transcript.
 */
export function TypeScreen({ n, startTyping }: { n: number; startTyping: boolean }) {
  const router = useRouter();
  const session = useSession();
  const { name: topic, intro, questions } = useTopic();
  const [leaving, setLeaving] = useState(false);
  const keepGoing = useCallback(() => setLeaving(false), []);
  const answerRef = useRef<HTMLDivElement>(null);
  const isLast = n === questions.length;
  const showIntro = n === 1 && session !== null && session.introSeen !== true;

  // A retry after a partial, wrong or not-caught take keeps Knowie's last reply under the question, so the
  // student can build on it while they type. Nothing on a question not yet answered, or a correct one.
  const last = session?.questions[n];
  const reply = last?.verdict && last.verdict !== 'correct' && last.feedback ? { verdict: last.verdict, message: replyMessage(questions[n - 1], last.feedback, last.covered ?? []) } : null;

  const replyText = reply?.message;

  // Remember the question: in keyboard mode, reopening it comes back here.
  // A new question rises into place; the same one shown again doesn't.
  const { animateIn, markShown } = useQuestionEnter(n);
  useEffect(() => {
    rememberRoute(`/q/${n}`);
    markShown();
    announce(`Question ${n} of ${questions.length}. ${questions[n - 1].prompt.replaceAll('**', '')} ${replyText ?? ''} Type your answer.`.replace('  ', ' '));
  }, [n, markShown, questions, replyText]);

  // Keep the screen above the iPhone keyboard. iOS doesn't shrink the page when the keyboard opens, so the
  // screen is cut down to the visible area (visualViewport): the question gets the room that is left, and the
  // typing bar grows into real space instead of over the question card. The page itself is kept from scrolling.
  // Check this on the iPhone.
  useEffect(() => {
    const viewport = window.visualViewport;
    const answer = answerRef.current;
    const screen = answer?.closest<HTMLElement>('.scaffold');
    if (!viewport || !answer || !screen) return;
    const follow = () => {
      const keyboard = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      // A real keyboard is over 100px; less is the browser's own toolbar moving, which dvh already follows.
      const up = keyboard > 100;
      answer.toggleAttribute('data-keyboard', up);
      if (up) {
        screen.style.setProperty('--type-visible-height', `${viewport.height}px`);
        screen.style.setProperty('--type-visible-top', `${viewport.offsetTop}px`);
      } else {
        screen.style.removeProperty('--type-visible-height');
        screen.style.removeProperty('--type-visible-top');
      }
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    follow();
    viewport.addEventListener('resize', follow);
    viewport.addEventListener('scroll', follow);
    return () => {
      viewport.removeEventListener('resize', follow);
      viewport.removeEventListener('scroll', follow);
      screen.style.removeProperty('--type-visible-height');
      screen.style.removeProperty('--type-visible-top');
    };
  }, []);

  // Anything that starts or ends answering retires the welcome card for good.
  const change = (edit: (s: Session) => void) =>
    updateSession((s) => {
      if (n === 1) s.introSeen = true;
      edit(s);
    });

  const onStatusChange = (next: Status) => {
    if (next !== 'Inactive') change(() => {});
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    change((s) => {
      questionRecord(s, n).typed = text.trim();
    });
    router.push(`/q/${n}/thinking`);
  };

  const toVoice = () => {
    change((s) => {
      s.inputMode = 'voice';
    });
    router.push(`/q/${n}`);
  };

  const skip = () => {
    change((s) => endQuestion(s, n, 'skipped'));
    router.push(isLast ? '/results' : questionRoute(n + 1));
  };

  // The row shows only while the keyboard is down, whatever is in the field (decided 2026-10-06): with the
  // keyboard up it would sit on the question card, and with it down the student can always get back to voice
  // or skip. The keyboard is up while the field has focus.
  const [keyboardUp, setKeyboardUp] = useState(startTyping);
  const showRow = !keyboardUp;

  // Arriving from a tap into the field puts the caret straight in it. That first focus isn't the student
  // starting to answer, so only focus after this point retires the welcome card.
  const settled = useRef(false);
  useEffect(() => {
    if (startTyping) answerRef.current?.querySelector('textarea')?.focus();
    settled.current = true;
  }, [startTyping]);

  return (
    <Scaffold
      topNavigation={
        <div inert={leaving}>
          <AppBar progress={((n - 1) / questions.length) * 100} xp={session?.xp ?? 0} onClose={() => setLeaving(true)} />
        </div>
      }
      middleContent={
        <div className="type__content" inert={leaving}>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={showIntro} animateIn={animateIn} />
          {reply && <AnswerCard state={cardState[reply.verdict]} message={reply.message} />}
        </div>
      }
      bottomContent={
        <div
          ref={answerRef}
          className="type__answer"
          inert={leaving}
          onFocus={(e) => {
            const inField = e.target instanceof HTMLTextAreaElement;
            setKeyboardUp(inField);
            // Tapping into the empty field starts answering, as it did when chatInput had a Typing status.
            if (inField && settled.current) change(() => {});
          }}
          onBlur={(e) => e.target instanceof HTMLTextAreaElement && setKeyboardUp(false)}
        >
          {showRow && (
            <ToggleGroup
              inputMode="keyboard"
              micBlocked={session?.micBlocked === true}
              onInputModeChange={(mode) => mode === 'voice' && toVoice()}
              onBlockedMicClick={() => router.push('/mic-blocked')}
              onSkip={skip}
            />
          )}
          <ChatInput status="Inactive" showLeadingButton={false} showMic={false} onSend={send} onStatusChange={onStatusChange} />
        </div>
      }
      showBottomSheetBackground={leaving}
      bottomSheetOnly={leaving ? <ExitConfirm onKeepGoing={keepGoing} /> : undefined}
    />
  );
}
