'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { ProgressMeter } from '../../components/progressMeter/ProgressMeter';
import { ResultsSummary, type ResultsSummaryProps } from '../../components/resultsSummary/ResultsSummary';
import { BottomCTA } from '../../components/bottomCTA/BottomCTA';
import { HeadlineBlock } from '../../components/headlineBlock/HeadlineBlock';
import { topicFor } from '../../content/topics';
import { resultsCopy } from '../../content/results';
import { announce } from '../../lib/announcer';
import { categoryFor } from '../../lib/resultsGroups';
import { endSession, getSession, rememberRoute, startNextPass, useSession, type Session } from '../../lib/session';
import './results.css';

type Category = NonNullable<ResultsSummaryProps['category']>;
type Row = ResultsSummaryProps['rows'][number];

/**
 * Results (SPEC.md › 8): how the latest pass went. The score ring and a headline, then one card per group
 * (good explanations, explained with hints, needs practice, skipped), each row holding that concept's question
 * and every take, joined. Only answers right with no hint count in the ring and the headline (decided
 * 2026-10-12). No app bar, as in Figma's Results frames.
 */
export default function ResultsPage() {
  const router = useRouter();
  const session = useSession();
  // Opened with nothing saved (a typed address, or a reload after /reset): there is nothing to show, so go to
  // the home address, which starts a fresh session. Checked in an effect, since the session is read after the
  // first render.
  useEffect(() => {
    if (!getSession()) router.replace('/');
  }, [router]);
  return session ? <ResultsView session={session} /> : null;
}

function ResultsView({ session }: { session: Session }) {
  const router = useRouter();
  const { questions } = topicFor(session.topicId);
  // One row open at a time, across all the cards.
  const [open, setOpen] = useState<{ category: Category; row: number } | null>(null);

  useEffect(() => rememberRoute('/results'), []);

  // Group each question by how it ended. A question left without an outcome (the student left mid-way)
  // counts as skipped.
  const groups: Record<Category, Row[]> = { 'good-explanations': [], 'with-hints': [], 'needs-practice': [], 'skipped-questions': [] };
  questions.forEach((q, i) => {
    const record = session.questions[i + 1];
    // Right after a hint goes in its own card; right with no hint is the only kind that counts as a good explanation.
    const category: Category = categoryFor(record);
    // Every take, joined. The canned transcripts repeat for takes with the same verdict, so each line shows
    // once, in order; a real engine's takes would all differ.
    const takes = [...new Set(record?.transcripts ?? [])];
    const transcript = takes.length ? takes.join(' ') : undefined;
    groups[category].push({ label: q.answer.title, question: q.prompt.replaceAll('**', ''), transcript });
  });

  // Right with no hint: this is what the ring, the headline and the strongest area count.
  const correct = groups['good-explanations'].length;
  const total = questions.length;
  const hinted = groups['with-hints'].length;
  const copy =
    correct === total
      ? resultsCopy.allUnaided
      : correct > 0
        ? {
            headline: resultsCopy.someUnaided.headline,
            // The first concept right on its own, and the first one that wasn't, in question order. The names sit
            // inside a sentence, so they're lowercased (sentence case); none of the concepts is a proper noun.
            line: resultsCopy.someUnaided.line(
              groups['good-explanations'][0].label.toLowerCase(),
              (questions.map((q) => q.answer.title).find((t) => !groups['good-explanations'].some((r) => r.label === t)) ?? '').toLowerCase(),
            ),
          }
        : hinted > 0
          ? resultsCopy.onlyHints
          : resultsCopy.noneUnaided;

  // With nothing right on its own, the hints card leads, then skipped, then needs practice (Figma's Results
  // frame 15850:9628, 2026-10-12); otherwise good, hints, needs practice, skipped.
  const order: Category[] =
    correct === 0
      ? ['with-hints', 'skipped-questions', 'needs-practice', 'good-explanations']
      : ['good-explanations', 'with-hints', 'needs-practice', 'skipped-questions'];

  // Said once when the page opens: the headline and the line under it.
  const spoken = `${copy.headline} ${copy.line}`;
  useEffect(() => announce(spoken), [spoken]);

  const reviewAll = () => {
    startNextPass();
    router.push('/q/1');
  };

  return (
    <Scaffold
      showTopNavSlot={false}
      middleContent={
        <div className="results__content">
          <div className="results__header">
            {/* Hidden at 0 correct, so the results stay encouraging. */}
            {correct > 0 && <ProgressMeter score={correct as 1 | 2 | 3 | 4 | 5} />}
            {/* HeadlineBlock doesn't choose a heading level, so the screen marks it as the page heading. */}
            <div role="heading" aria-level={1} className="results__heading">
              <HeadlineBlock title={copy.headline} body={copy.line} bodyStyle="bodyM" />
            </div>
          </div>
          <div className="results__cards">
            {order.map((category) => (
              <ResultsSummary
                key={category}
                category={category}
                rows={groups[category]}
                openRow={open?.category === category ? open.row : null}
                onOpenRowChange={(row) => setOpen(row === null ? null : { category, row })}
              />
            ))}
          </div>
        </div>
      }
      bottomContent={
        <div className="results__bar">
          <BottomCTA layout="Two button drawer" leftCTA="Review all" rightCTA="Continue" onLeftClick={reviewAll} onRightClick={() => {
            endSession('finished');
            router.push('/done');
          }} />
        </div>
      }
    />
  );
}
