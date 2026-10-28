'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../../../components/scaffold/Scaffold';
import { AppBar } from '../../../../components/appBar/AppBar';
import { MiddleSection } from '../../../../components/middleSection/MiddleSection';
import { TapToAnswer } from '../../../../components/tapToAnswer/TapToAnswer';
import { RecordingGlow } from '../../../../components/recordingGlow/RecordingGlow';
import { MicButton } from '../../../../components/micButton/MicButton';
import { ButtonIcon } from '../../../../components/buttonIcon/ButtonIcon';
import { XIcon } from '../../../../icons/XIcon';
import { bold } from '../../../../content/bold';
import { announce } from '../../../../lib/announcer';
import { durationMs } from '../../../../lib/motion';
import { dropRecording, holdRecording, startRecording, type Recording } from '../../../../lib/microphone';
import { VoiceWaveform } from './VoiceWaveform';
import { getSession, isLive, questionRecord, rememberRoute, updateSession, useSession, useTopic } from '../../../../lib/session';
import { useQuestionEnter } from '../../../../lib/questionEnter';
import { sendBackOnLoad } from '../../sendBackOnLoad';
import './recording.css';

/**
 * Dictating: the question stays on screen while the mic listens; no transcript, no toggle, no Skip. In a live
 * session the mic really records (docs/sprint-context.md › Real recall engine); in a scripted one it's mocked.
 */
export function RecordingScreen({ n }: { n: number }) {
  const router = useRouter();
  // The same question as the screen before, so it stays put; it rises in only when opened fresh.
  const { animateIn, markShown } = useQuestionEnter(n);
  const [hint, setHint] = useState('Listening…');
  const [hintFading, setHintFading] = useState(false);
  const session = useSession();
  const { name: topic, intro, questions } = useTopic();
  const xp = session?.xp ?? 0;
  // The welcome card, if the student hasn't started answering before: it opens here still showing, then fades
  // while the question card slides up, once Knowie is listening (decided 2026-10-05).
  const showIntro = n === 1 && session !== null && session.introSeen !== true;

  // "Listening…" first, then "Tap to submit…" once the student has had time to start speaking. It's a timer
  // (motion.duration.listeningHint), not speech detection; only a tap stops it.
  // The old words fade out, then the new ones fade in; with reduced motion they just swap.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) setHint('Tap to submit…');
      else setHintFading(true);
    }, durationMs('--motion-duration-listeningHint'));
    return () => clearTimeout(timer);
  }, []);

  // Once "Listening…" has faded out, swap the words and fade back in.
  const onHintFaded = (e: React.TransitionEvent) => {
    if (!hintFading || e.propertyName !== 'opacity') return;
    setHint('Tap to submit…');
    setHintFading(false);
  };

  useEffect(() => {
    if (sendBackOnLoad(n, (route) => router.replace(route))) return;
    markShown();
    // Saved as the question itself: reopening the app mid-take returns there.
    rememberRoute(`/q/${n}`);
    announce('Listening for your answer. Tap the mic when you’re done.');
    // Let the card draw once, then retire it, so it animates out rather than vanishing.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() =>
        updateSession((s) => {
          if (n === 1) s.introSeen = true;
        }),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [n, router, markShown]);

  // The live recording, once the mic has opened; null in a scripted session or if it never started.
  const recording = useRef<Promise<Recording | null> | null>(null);
  const stopping = useRef(false);
  // The mic's stream for the waveform, and whether dictation has ended (the waveform fades out as it does).
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ended, setEnded] = useState(false);
  // Lets the waveform fade out (motion.duration.hintFadeOut) before the screen is replaced; without this the
  // route change would cut it off. Reduced motion has no fade, so no wait.
  const fadeOut = () => {
    setEnded(true);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();
    return new Promise<void>((resolve) => setTimeout(resolve, durationMs('--motion-duration-hintFadeOut')));
  };

  // Stopping submits the take to the processing screen, which judges and counts it. Both taps replace this
  // route, so going back never lands on a recording that has ended.
  const stop = useCallback(async () => {
    if (stopping.current) return;
    stopping.current = true;
    // A spoken take: clear any typed text left from a dropped typed take, so it isn't used as this one's words.
    updateSession((s) => {
      delete questionRecord(s, n).typed;
    });
    // Held for the processing screen to send. A recording that never started sends nothing: "didn't catch that".
    const live = await recording.current;
    const [take] = await Promise.all([live?.stop(), fadeOut()]);
    if (take) holdRecording(n, take);
    router.replace(`/q/${n}/thinking`);
  }, [n, router]);
  const cancel = async () => {
    announce('Recording cancelled.');
    await fadeOut();
    router.replace(`/q/${n}`);
  };

  // A live session opens the mic as the screen opens. If the browser refuses it, the student types instead:
  // keyboard mode with a slashed mic (docs/sprint-context.md › Decisions, OS mic denied). The recording
  // submits itself at motion.duration.recordingMax, a safety net a real answer never reaches.
  useEffect(() => {
    if (!isLive(getSession())) return;
    dropRecording();
    let closed = false;
    const started = startRecording().then(
      (r) => {
        if (closed) r.cancel();
        else setStream(r.stream);
        return closed ? null : r;
      },
      () => {
        if (closed) return null;
        updateSession((s) => {
          s.micBlocked = true;
          s.inputMode = 'keyboard';
        });
        announce('Your mic is blocked, so you can type your answer instead.');
        router.replace(`/q/${n}/type`);
        return null;
      },
    );
    recording.current = started;
    const cap = setTimeout(stop, durationMs('--motion-duration-recordingMax'));
    // Leaving by any route but stop (cancel, close, reload) throws the recording away; after stop it's already done.
    return () => {
      closed = true;
      clearTimeout(cap);
      started.then((r) => r?.cancel());
    };
  }, [n, router, stop]);

  return (
    <Scaffold
      // The app bar is hidden while listening but keeps its height (decided 2026-10-12), so the question card
      // doesn't jump when the student taps the mic. It fades back in with the result; the cancel X under the mic
      // is the way out, so the student is never stuck here.
      topNavigation={
        <div className="recording__appBar" aria-hidden="true">
          <AppBar progress={((n - 1) / questions.length) * 100} xp={xp} />
        </div>
      }
      middleContent={
        <div className="recording__content">
          <MiddleSection topic={topic} intro={intro} question={bold(questions[n - 1].prompt)} showIntro={showIntro} animateIn={animateIn} />
        </div>
      }
      bottomContent={
        <div className="recording__answer">
          <div className="recording__hint" data-fading={hintFading || undefined} onTransitionEnd={onHintFaded}>
            <TapToAnswer text={hint} />
          </div>
          <div className="recording__mic">
            <div className="recording__glow">
              <RecordingGlow />
            </div>
            <VoiceWaveform stream={stream} active={!ended} />
            <MicButton listeningState="listening" interactionState="ready" onClick={stop} />
          </div>
          <ButtonIcon variant="Secondary" size="S" icon={<XIcon />} aria-label="Cancel recording" onClick={cancel} />
        </div>
      }
    />
  );
}
