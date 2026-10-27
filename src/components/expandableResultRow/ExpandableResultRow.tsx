'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { CaretRightIcon } from '../../icons/CaretRightIcon';
import { CheckIcon } from '../../icons/CheckIcon';
import { DotOutlineIcon } from '../../icons/DotOutlineIcon';
import { XIcon } from '../../icons/XIcon';
import { IconSlot } from '../iconSlot/IconSlot';
import './expandableResultRow.css';

export type ExpandableResultRowState = 'collapsed' | 'expanded';
export type ExpandableResultRowTone = 'success' | 'with-hints' | 'error' | 'neutral';

/** One key idea of the question, and whether the student's answer covered it. */
export type ExpandableResultRowKeyPoint = { text: string; covered: boolean };

export type ExpandableResultRowProps = {
  state?: ExpandableResultRowState;
  tone?: ExpandableResultRowTone;
  /** What the student said, word for word. Leave it out for a skipped question. */
  transcript?: string;
  /** The concept the row is about (Figma types it into the layer, so it has no property there). */
  label: string;
  /** The question that was asked, shown in the detail (also typed into the layer in Figma). */
  question: string;
  /**
   * The question's key ideas, each marked got it or missed, shown under what the student said (2026-10-27,
   * designer, from user testing). Code only: not in Figma's component yet. Leave it out to show no scorecard.
   */
  keyPoints?: ExpandableResultRowKeyPoint[];
  /** Called with the state the student asked for. The parent decides, so it can keep one row open at a time. */
  onToggle?: (nextState: ExpandableResultRowState) => void;
};

// The leading icon per tone, all drawn at Icon/200 (16px).
const toneIcon: Record<ExpandableResultRowTone, ReactNode> = {
  success: <CheckIcon />,
  'with-hints': <CheckIcon />,
  error: <XIcon />,
  neutral: <DotOutlineIcon />,
};

/**
 * One answer in a results list: tap it to show the question, what the student said and, when given, which key
 * ideas they got. The parent decides which row is open.
 */
export function ExpandableResultRow({
  state = 'collapsed',
  tone = 'success',
  transcript,
  label,
  question,
  keyPoints,
  onToggle,
}: ExpandableResultRowProps) {
  const detailId = useId();
  const isExpanded = state === 'expanded';

  return (
    <div className="expandableResultRow" data-state={state} data-tone={tone}>
      <button
        type="button"
        className="expandableResultRow__header"
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? detailId : undefined}
        onClick={() => onToggle?.(isExpanded ? 'collapsed' : 'expanded')}
      >
        <span className="expandableResultRow__icon">
          <IconSlot size="200">{toneIcon[tone]}</IconSlot>
        </span>
        <span className="expandableResultRow__label">{label}</span>
        <span className="expandableResultRow__arrow">
          <IconSlot size="250">
            <CaretRightIcon />
          </IconSlot>
        </span>
      </button>
      {isExpanded && (
        <div id={detailId} className="expandableResultRow__detail" role="region" aria-label={`${label}: your answer`}>
          <p className="expandableResultRow__detailLabel">Question</p>
          <p className="expandableResultRow__quote">{question}</p>
          <p className="expandableResultRow__detailLabel">You said</p>
          <p className="expandableResultRow__quote">{transcript ? `“${transcript}”` : 'Not answered.'}</p>
          {keyPoints && keyPoints.length > 0 && (
            <>
              <p className="expandableResultRow__detailLabel">Key ideas</p>
              <ul className="expandableResultRow__keyPoints">
                {keyPoints.map(({ text, covered }) => (
                  <li key={text} className="expandableResultRow__keyPoint" data-covered={covered}>
                    {/* The mark says got it or missed to a screen reader too, read before the idea. */}
                    <span className="expandableResultRow__mark" role="img" aria-label={covered ? 'Got it' : 'Missed'}>
                      <IconSlot size="200">{covered ? <CheckIcon /> : <XIcon />}</IconSlot>
                    </span>
                    <span className="expandableResultRow__quote">{text}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
