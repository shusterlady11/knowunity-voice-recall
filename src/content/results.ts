// The Results screen's headline and line under it. The ring already shows the percent, so the words don't repeat
// a count: the headline says what the result means and the line names a concept (approved 2026-10-21, replacing
// the first Figma wording, which said the number three times). PLACEHOLDER where it names a concept: the mixed
// line uses the first concept right on its own and the first one that wasn't.
// "Right" here means right with no hint (2026-10-12): a concept answered after a hint is counted in its own
// card, not in the headline, the ring or the strongest area.

export const resultsCopy = {
  allUnaided: {
    headline: 'All five, no hints',
    line: 'You explained every one yourself.',
  },
  someUnaided: {
    headline: 'Good start',
    // Built without a verb that has to agree with the concept's name ("Enzymes were", "Photosynthesis was").
    line: (strong: string, weak: string) => `Solid on ${strong}. Take another look at ${weak}.`,
  },
  onlyHints: {
    headline: 'Hints helped',
    line: 'Try these again on your own.',
  },
  noneUnaided: {
    headline: 'How it went',
    line: 'Pick one to try first.',
  },
};
