'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { AppBar } from '../../components/appBar/AppBar';
import { MiddleSection } from '../../components/middleSection/MiddleSection';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { TapToAnswer } from '../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../components/micButton/MicButton';
import { BottomSheet } from '../../components/bottomSheet/BottomSheet';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { Button } from '../../components/button/Button';
import { HeadlineBlock } from '../../components/headlineBlock/HeadlineBlock';
import { bold } from '../../content/bold';
import { rememberRoute, updateSession, useTopic } from '../../lib/session';
import { useQuestionEnter } from '../../lib/questionEnter';
import '../q/[n]/question.css';
import './mic.css';

/** Mic primer (SPEC.md › 2): a sheet asking to turn on the mic, over question 1 behind a scrim. */
export default function MicPage() {
  const router = useRouter();
  const { name: topic, intro, questions } = useTopic();

  // Question 1 behind the sheet is the first question shown, so it doesn't rise in, and "Turn on" keeps it
  // still too.
  const { animateIn, markShown } = useQuestionEnter(1);
  useEffect(() => {
    rememberRoute('/mic');
    markShown();
  }, [markShown]);

  // Either answer leads to the first question, so the welcome card shows there again, until the student first
  // taps the mic; a leftover "intro seen" from an earlier run can't hide it.
  const answer = (inputMode: 'voice' | 'keyboard', route: string) => {
    updateSession((session) => {
      session.inputMode = inputMode;
      session.introSeen = false;
    });
    router.push(route);
  };

  // Question 1 behind the sheet, drawn like the question screen. `inert` keeps taps and screen readers in
  // the sheet: the scrim already blocks taps, but not a screen reader.
  return (
    <Scaffold
      topNavigation={
        <div inert>
          <AppBar progress={0} xp={0} />
        </div>
      }
      middleContent={
        <div className="mic__question" inert>
          <MiddleSection topic={topic} intro={intro} question={bold(questions[0].prompt)} animateIn={animateIn} />
        </div>
      }
      bottomContent={
        // The question screen's own layout (its stylesheet is imported above), so the mic sits exactly where it does
        // there, 128px from the bottom, as in Figma's PERMISSION-MIC.
        <div className="question__answer" inert>
          <TapToAnswer text="Tap to dictate" />
          <div className="question__mic">
            <MicButton />
          </div>
        </div>
      }
      showBottomSheetBackground
      bottomSheetOnly={
        <BottomSheet
          appBar={{ type: 'Default' }}
          label="Turn on your microphone"
          middleSection={
            <>
              <MascotSlot size="3XL" expression="approving" />
              <HeadlineBlock
                showTitle={false}
                body="Turn on your microphone to start practicing. You’ll explain each answer out loud."
                bodyStyle="headlineS"
                bodyEmphasis="primary"
              />
            </>
          }
          bottomSection={
            <ButtonGroup variant="Vertical" size="L">
              {/* No browser prompt: the mic is mocked (docs/sprint-context.md). Not now puts the student in keyboard mode. */}
              <Button variant="Primary" size="L" CTA="Turn on" onClick={() => answer('voice', '/q/1')} />
              <Button variant="Secondary" size="L" CTA="Not now" onClick={() => answer('keyboard', '/mic-off')} />
            </ButtonGroup>
          }
        />
      }
    />
  );
}
