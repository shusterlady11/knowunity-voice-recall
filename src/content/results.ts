// The Results screen's headline and line under it, from Figma's three Results frames. PLACEHOLDER where
// Figma's copy names a concept: the mixed line uses the first concept the student got right on their own.
// "Right" here means right with no hint (2026-10-12): a concept answered after a hint is counted in its own
// card, not in the headline, the ring or the strongest area.

export const resultsCopy = {
  perfect: {
    headline: '5 out of 5!',
    line: 'Master status! You’ve fully grasped these topics.',
  },
  mixed: {
    headline: (correct: number, total: number) => `You got ${correct} of ${total} concepts`,
    line: (strongest: string) => `Great start—your strongest area is ${strongest}.`,
  },
  noneCorrect: {
    headline: 'Here’s how it went',
    line: 'It’s ok to still be getting familiar with the material. Gotta start somewhere.',
  },
};
