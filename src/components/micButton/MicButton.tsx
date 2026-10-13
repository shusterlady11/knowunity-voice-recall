import type { ButtonHTMLAttributes } from 'react';
import { MicFilledIcon } from '../../icons/MicFilledIcon';
import { MicDisabledIcon } from '../../icons/MicDisabledIcon';
import { LoadingDots } from '../loadingDots/LoadingDots';
import './micButton.css';

export type MicButtonState =
  | { listeningState?: 'idle'; interactionState?: 'ready' | 'pressed' | 'disabled' | 'thinking' }
  // Figma has no listening + disabled variant: the button can't be listening and unavailable at once.
  | { listeningState: 'listening'; interactionState?: 'ready' | 'pressed' };

export type MicButtonProps = MicButtonState &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'>;

/** The mic the student taps to start and stop answering out loud. Thinking (three dots) shows while Knowie checks the answer; disabled is for a mic that can't be used right now, not for a blocked mic. */
export function MicButton({
  listeningState = 'idle',
  interactionState = 'ready',
  type = 'button',
  onClick,
  ...rest
}: MicButtonProps) {
  const isThinking = interactionState === 'thinking';
  // Thinking is also unavailable and busy: taps are ignored, and screen readers hear it as working.
  const isDisabled = interactionState === 'disabled' || isThinking;

  return (
    <button
      aria-label="Record answer"
      {...rest}
      type={type}
      className="micButton"
      data-listening-state={listeningState}
      data-interaction-state={interactionState}
      aria-pressed={listeningState === 'listening'}
      aria-disabled={isDisabled || undefined}
      aria-busy={isDisabled || undefined}
      onClick={isDisabled ? undefined : onClick}
    >
      <span className="micButton__face">
        {isThinking ? (
          <span aria-hidden="true">
            <LoadingDots />
          </span>
        ) : isDisabled ? (
          <MicDisabledIcon className="micButton__icon" />
        ) : (
          <MicFilledIcon className="micButton__icon" />
        )}
      </span>
    </button>
  );
}
