'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../../../components/micButton/MicButton';
import { ButtonIcon } from '../../../../components/buttonIcon/ButtonIcon';
import { XIcon } from '../../../../icons/XIcon';
import { idkTranscript } from '../../../../content/questions';
import { bold } from '../../../../content/bold';
import { defaultCode, scripts } from '../../../../content/scripts';
import { combine, feedbackFor, judgeTake, verdictFor, xpFor, type Take, type Verdict } from '../../../../lib/recallEngine';
import { announce } from '../../../../lib/announcer';
import { heldRecording, recordingFileName } from '../../../../lib/microphone';
import { durationMs } from '../../../../lib/motion';
import { getSession, questionRecord, questionRoute, updateSession, useSession, useTopic } from '../../../../lib/session';
import { useQuestionEnter } from '../../../../lib/questionEnter';
import { sendBackOnLoad } from '../../sendBackOnLoad';
import './thinking.css';

/**
 * Processing: the mic shows three dots while Knowie judges, for at least motion.duration.thinkingMin, then the
 * result. A slow take shows "Taking a moment…" above the mic at slowNotice and gives up at slowTimeout, with a
 * result that says the wait was too long. The X under the mic throws the take away and goes back to the question. An "I don't know"
 * take counts as a skip and goes straight to the next question, with no result screen.
 */
export function ThinkingScreen({ n }: { n: number }) {
  const router = useRouter();
  // The same question as the screen before, so it stays put; it rises in only when opened fresh.
  const { animateIn, markShown } = useQuestionEnter(n);
  const xp = useSession()?.xp ?? 0;
  const { name: topic, questions } = useTopic();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const isLast = n === questions.length;

  // Set when the student cancels, so a judge that finishes during the move doesn't count the take.
  const cancelledRef = useRef(false);

  // Where to go once judged. There is no exit confirm here any more (the app bar is hidden while Knowie
  // thinks), so nothing holds the move.
  const goTo = useCallback((route: string) => router.replace(route), [router]);

  useEffect(() => {
    if (sendBackOnLoad(n, (route) => router.replace(route))) return;
    markShown();
    announce('Thinking.');

    const session = getSession();
    const script = scripts[session?.code ?? defaultCode] ?? scripts[defaultCode];
    // This take is the next one in the question's chain. It's only counted once judged, so a take dropped
    // by a reload doesn't use up a step of the script.
    const takeNumber = (session?.questions[n]?.takes ?? 0) + 1;
    const typed = session?.questions[n]?.typed;
    // A live session sends what was typed, or the recording, to the real judge (docs/sprint-context.md › Real
    // recall engine); a scripted one reads the script. `heard` is the transcript of a live spoken take.
    const live = session?.live === true;
    const audio = live && !typed ? heldRecording(n) : null;
    let heard: string | undefined;

    // Saves the verdict and the card's feedback for the result screen, then goes there. Choosing the hint
    // here, once per take, means reopening the result doesn't use up another. A correct answer ends the
    // question, so its XP is awarded now and the counter shows it on the result.
    const keyPointCount = questions[n - 1].keyPoints.length;
    // The take's canned transcript, by how much this take covered on its own; nothing for a take that
    // wasn't caught, since nothing was heard.
    const transcriptFor = (take: Take): string | null => {
      // A typed take shows exactly what was typed (SPEC.md › 8); a live spoken one, what was heard.
      if (typed) return typed;
      if (live) return heard || null;
      if (take.kind === 'idk') return idkTranscript;
      if (take.kind !== 'points') return null;
      const own = verdictFor(take.points, keyPointCount);
      return questions[n - 1].transcripts[own === 'notCaught' ? 'wrong' : own];
    };
    const addTranscript = (record: { transcripts?: string[]; typed?: string }, take: Take) => {
      const transcript = transcriptFor(take);
      if (transcript) record.transcripts = [...(record.transcripts ?? []), transcript];
      delete record.typed;
    };
    const finish = (take: Take, verdict: Verdict, covered: number[], timedOut = false) => {
      if (cancelledRef.current) return;
      updateSession((s) => {
        const record = questionRecord(s, n);
        record.takes = takeNumber;
        addTranscript(record, take);
        record.covered = covered;
        record.verdict = verdict;
        const hintsUsed = record.hintsUsed ?? [];
        record.feedback = timedOut ? { kind: 'timedOut' } : feedbackFor(verdict, covered, hintsUsed, keyPointCount);
        // Only a hint the student hasn't seen is counted; the last one repeated, once they're all used, is not.
        if (record.feedback.kind === 'hint' && record.feedback.fresh) record.hintsUsed = [...hintsUsed, record.feedback.keyPoint];
        if (verdict === 'correct' && !record.outcome) {
          const revealed = record.revealed === true;
          record.outcome = revealed ? 'needsPractice' : 'correct';
          s.xp += xpFor({ kind: 'correct', firstTry: takeNumber === 1, revealed });
        }
      });
      goTo(`/q/${n}/result`);
    };
    // The judge took too long (or failed): a result that says the wait was ours, with nothing new covered.
    const giveUp = () => finish({ kind: 'slow' }, 'notCaught', session?.questions[n]?.covered ?? [], true);
    // Moves on from a judged take, the same for a scripted and a real one.
    const resolve = (take: Take) => {
      if (cancelledRef.current) return;
      if (take.kind === 'idk') {
        // "I don't know" is treated as Skip: no result, straight to the next question.
        updateSession((s) => {
          const record = questionRecord(s, n);
          record.takes = takeNumber;
          addTranscript(record, take);
          record.outcome = 'skipped';
        });
        return goTo(isLast ? '/results' : `/q/${n + 1}`);
      }
      if (take.kind === 'notCaught') return finish(take, 'notCaught', session?.questions[n]?.covered ?? []);
      if (take.kind === 'slow') return giveUp();
      const covered = combine(session?.questions[n]?.covered ?? [], take);
      finish(take, verdictFor(covered, keyPointCount), covered);
    };
    const showSlowNotice = () => {
      setMessage('Taking a moment…');
      announce('Taking a moment.');
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    // A live spoken take whose recording never started has nothing to judge: "didn't catch that".
    if (live && !typed && !audio) {
      timers.push(setTimeout(() => resolve({ kind: 'notCaught' }), durationMs('--motion-duration-thinkingMin')));
      return () => timers.forEach(clearTimeout);
    }
    if (live) {
      // The judge's answer is held until thinkingMin has passed, so a fast reply doesn't flash the dots. It
      // gets the slow take's notice and limit: "Taking a moment…" at slowNotice, giving up at slowTimeout.
      const controller = new AbortController();
      let judged: Take | null = null;
      let minPassed = false;
      let settled = false;
      const settle = (then: () => void) => {
        if (settled) return;
        settled = true;
        timers.forEach(clearTimeout);
        then();
      };
      const settleIfReady = () => {
        const take = judged;
        if (take && minPassed) settle(() => resolve(take));
      };
      timers.push(
        setTimeout(() => {
          minPassed = true;
          settleIfReady();
        }, durationMs('--motion-duration-thinkingMin')),
        setTimeout(showSlowNotice, durationMs('--motion-duration-slowNotice')),
        setTimeout(() => settle(() => {
          controller.abort();
          giveUp();
        }), durationMs('--motion-duration-slowTimeout')),
      );
      // Typed words go as JSON; a recording as form data, transcribed on the server before it's judged.
      let request: RequestInit;
      if (audio) {
        const form = new FormData();
        if (session?.topicId) form.set('topicId', session.topicId);
        form.set('n', String(n));
        form.set('audio', audio, recordingFileName(audio));
        request = { body: form };
      } else {
        request = { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topicId: session?.topicId, n, answer: typed }) };
      }
      fetch('/api/judge', { method: 'POST', ...request, signal: controller.signal })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`judge ${response.status}`))))
        .then((body: { take: Take; transcript?: string }) => {
          heard = body.transcript;
          judged = body.take;
          settleIfReady();
        })
        .catch(() => {
          // Leaving the screen aborts the request; that isn't a failure to report.
          if (!controller.signal.aborted) settle(giveUp);
        });
      return () => {
        timers.forEach(clearTimeout);
        controller.abort();
      };
    }

    const take = judgeTake(script, session?.pass ?? 1, n, takeNumber);
    if (take.kind === 'slow') {
      timers.push(
        setTimeout(showSlowNotice, durationMs('--motion-duration-slowNotice')),
        setTimeout(giveUp, durationMs('--motion-duration-slowTimeout')),
      );
    } else {
      timers.push(setTimeout(() => resolve(take), durationMs('--motion-duration-thinkingMin')));
    }
    return () => timers.forEach(clearTimeout);
  }, [n, isLast, router, goTo, markShown, questions]);

  // Throws the take away and goes back to the question (or the typing screen, in keyboard mode). Nothing is
  // counted: the take is only counted once judged.
  const cancel = () => {
    cancelledRef.current = true;
    announce('Answer cancelled.');
    router.replace(questionRoute(n));
  };

  return (
    <Scaffold
      // Hidden while Knowie thinks, but it keeps its height (decided 2026-10-12) so the question card doesn't
      // move; it fades back in with the result.
      topNavigation={
        <div className="thinking__appBar" aria-hidden="true">
          <AppBar progress={((n - 1) / questions.length) * 100} xp={xp} />
        </div>
      }
      middleContent={
        <div className="thinking__content">
          {/* No intro card once the student has answered, so Knowie's reply fits (decided 2026-10-04). */}
          <MiddleSection topic={topic} question={bold(questions[n - 1].prompt)} showIntro={false} animateIn={animateIn} />
        </div>
      }
      bottomContent={
        <div className="thinking__answer">
          {/* The line where the other states put their hint: empty until a slow take shows "Taking a moment…". */}
          <div className="thinking__hint" data-visible={message ? '' : undefined}>
            <TapToAnswer text={message ?? '\u00A0'} />
          </div>
          {/* Not tappable while Knowie judges the take; the dots on the button show it's working. */}
          <div className="thinking__mic">
            <MicButton listeningState="idle" interactionState="thinking" />
          </div>
          <ButtonIcon variant="Secondary" size="S" icon={<XIcon />} aria-label="Cancel answer" onClick={cancel} />
        </div>
      }
    />
  );
}
