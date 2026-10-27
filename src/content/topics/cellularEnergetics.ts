// AP Biology, Unit 3 (Cellular energetics), five concepts under one topic. Drafted 2026-10-07 and approved by
// the designer (replaces the D12 placeholders). The transcripts are canned: participants are told the words
// shown are placeholders (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold, as Figma bolds "Q:" and the key terms. Each answer.title is also the
// concept's name in Results, lowercased in "your strongest area is …", so it reads well in lowercase.

import type { Question, Topic } from '../questions';

const questions: Question[] = [
  {
    prompt: '**Q:** How do **enzymes** speed up chemical reactions in a cell?',
    keyPoints: [
      'They lower the activation energy a reaction needs to start',
      'The substrate binds to the enzyme’s active site, which fits its shape',
      'The enzyme isn’t used up, so it can be used again and again',
    ],
    keyPointNames: [
      'lowering activation energy',
      'the active site fit',
      'enzymes being reusable',
    ],
    hints: [
      [
        'Think about the energy a reaction needs to get started.',
        'Picture a hill the reaction has to climb. What do enzymes do to the height of that hill?',
        'Enzymes lower something called the activation energy. Say what that means for the reaction.',
      ],
      [
        'Think about where the substrate attaches to the enzyme.',
        'The enzyme has a special spot with a shape made for its substrate. What is that spot called?',
        'It’s the active site. Say how the substrate fits into it.',
      ],
      [
        'Think about what happens to the enzyme after the reaction.',
        'After the reaction, is the enzyme used up like a battery, or does it come out the same?',
        'It comes out unchanged. Say what that lets it do next.',
      ],
    ],
    correct: 'Exactly: enzymes lower the activation energy, and they’re ready to work again right after.',
    answer: {
      title: 'Enzymes',
      heading: 'Lowering the hill',
      body: 'Enzymes are proteins that lower the activation energy of a reaction. The substrate fits into the enzyme’s active site, the reaction happens faster, and the enzyme comes out unchanged, ready to be used again.',
    },
    transcripts: {
      correct: 'Enzymes lower the activation energy. The substrate fits into the active site, and afterwards the enzyme can be used again.',
      partial: 'They lower the activation energy so the reaction happens faster.',
      wrong: 'Enzymes add extra energy to the reaction so it goes faster.',
    },
  },
  {
    prompt: '**Q:** What happens to an **enzyme** when the **temperature** or **pH** goes too far from its ideal range?',
    keyPoints: [
      'Each enzyme works best in an optimal range of temperature and pH',
      'Outside that range, the enzyme denatures: its shape changes',
      'The active site no longer fits the substrate, so the reaction slows or stops',
    ],
    keyPointNames: [
      'the optimal range',
      'denaturing',
      'the active site losing its fit',
    ],
    hints: [
      [
        'Think about the conditions where an enzyme works best.',
        'Each enzyme has a sweet spot for temperature and pH. What do we call that sweet spot?',
        'It’s the optimal range. Say what happens when conditions leave it.',
      ],
      [
        'Think about what heat or acid does to a protein’s shape.',
        'Too much heat or acid can unfold a protein. What is that unfolding called?',
        'It’s called denaturing: the enzyme’s shape changes. Say what that does to the enzyme.',
      ],
      [
        'Think about whether the substrate can still bind.',
        'If the enzyme’s shape changes, what happens to its active site?',
        'The active site no longer fits the substrate. Say what that means for the reaction.',
      ],
    ],
    correct: 'You got it: change the shape, and the substrate can’t fit anymore.',
    answer: {
      title: 'Enzyme activity',
      heading: 'Shape is everything',
      body: 'Every enzyme has an optimal temperature and pH. Too far outside them, the enzyme denatures: its shape changes, the active site no longer fits the substrate, and the reaction slows or stops.',
    },
    transcripts: {
      correct: 'Enzymes have an ideal temperature and pH. If it’s too hot or the pH is off, the enzyme denatures and changes shape, so the substrate can’t bind to the active site.',
      partial: 'The enzyme denatures and changes shape.',
      wrong: 'The enzyme just works faster when it’s hotter.',
    },
  },
  {
    prompt: '**Q:** What happens in the **light reactions** and the **Calvin cycle** of photosynthesis?',
    keyPoints: [
      'The light reactions capture light energy and store it in ATP and NADPH',
      'Water is split in the light reactions, releasing oxygen',
      'The Calvin cycle uses that ATP and NADPH to turn carbon dioxide into sugar',
    ],
    keyPointNames: [
      'the light reactions storing energy',
      'splitting water for oxygen',
      'the Calvin cycle making sugar',
    ],
    hints: [
      [
        'Think about what the light reactions make from sunlight.',
        'The light reactions turn light energy into two energy-carrying molecules. What are they?',
        'They’re ATP and NADPH. Say what the light reactions do to store light energy in them.',
      ],
      [
        'Think about where the oxygen comes from.',
        'The oxygen a plant gives off comes from a molecule the light reactions break apart. Which one?',
        'It’s water: the light reactions split it. Say what that releases.',
      ],
      [
        'Think about what the Calvin cycle builds, and from what.',
        'The Calvin cycle builds sugar. What gas does it take in, and what powers it?',
        'It takes in carbon dioxide, powered by the ATP and NADPH from the light reactions. Say how it turns them into sugar.',
      ],
    ],
    correct: 'Spot on: light energy goes in, and the Calvin cycle turns it into sugar.',
    answer: {
      title: 'Photosynthesis',
      heading: 'Two stages',
      body: 'In the light reactions, chlorophyll captures light energy and stores it in ATP and NADPH, splitting water and releasing oxygen. In the Calvin cycle, the plant uses that ATP and NADPH to turn carbon dioxide into sugar.',
    },
    transcripts: {
      correct: 'The light reactions use sunlight to make ATP and NADPH and split water, which gives off oxygen. Then the Calvin cycle uses the ATP and NADPH to make sugar from carbon dioxide.',
      partial: 'The light reactions use sunlight to make energy, and the Calvin cycle makes sugar.',
      wrong: 'The Calvin cycle is when the plant breathes in oxygen at night.',
    },
  },
  {
    prompt: '**Q:** Where does a cell make **most of its ATP** during **cellular respiration**, and how?',
    keyPoints: [
      'Most ATP is made in the electron transport chain, in the mitochondria',
      'The chain pumps protons, and their flow back through ATP synthase makes ATP',
      'Oxygen is the final electron acceptor, forming water',
    ],
    keyPointNames: [
      'the electron transport chain',
      'ATP synthase',
      'oxygen as the final electron acceptor',
    ],
    hints: [
      [
        'Think about which stage makes the most ATP.',
        'It’s the last stage, a chain of proteins in the mitochondria. What is it called?',
        'It’s the electron transport chain. Say where in the cell it sits.',
      ],
      [
        'Think about how ATP synthase is powered.',
        'The chain pumps something across a membrane, and its flow back makes ATP. What is it?',
        'Protons flow back through ATP synthase. Say what that flow does.',
      ],
      [
        'Think about why the cell needs oxygen.',
        'Electrons reach the end of the chain, and something has to take them. What does?',
        'Oxygen takes them, and forms a product. Say what it forms.',
      ],
    ],
    correct: 'Exactly right: the proton gradient powers ATP synthase, and oxygen keeps the chain moving.',
    answer: {
      title: 'Cellular respiration',
      heading: 'The big payoff',
      body: 'Most ATP is made in the electron transport chain in the mitochondria. Electrons from glucose move down the chain, which pumps protons across the membrane. As they flow back through ATP synthase, it makes ATP. Oxygen takes the electrons at the end, forming water.',
    },
    transcripts: {
      correct: 'In the electron transport chain in the mitochondria. It pumps protons, and they flow back through ATP synthase, which makes ATP. Oxygen takes the electrons at the end and makes water.',
      partial: 'Most of it comes from the electron transport chain in the mitochondria.',
      wrong: 'Most ATP comes from glycolysis, when glucose gets broken in half.',
    },
  },
  {
    prompt: '**Q:** How is **fermentation** different from **aerobic respiration**?',
    keyPoints: [
      'Fermentation happens without oxygen',
      'It recycles NAD+ so glycolysis can keep running',
      'It makes far less ATP: 2 per glucose, instead of about 30',
    ],
    keyPointNames: [
      'fermentation needing no oxygen',
      'recycling NAD+',
      'the smaller ATP yield',
    ],
    hints: [
      [
        'Think about what fermentation does without.',
        'Aerobic respiration needs a gas to finish the job, and fermentation works when it’s missing. Which gas?',
        'It’s oxygen. Say when a cell has to rely on fermentation.',
      ],
      [
        'Think about what keeps glycolysis going.',
        'Glycolysis needs a molecule recycled so it can keep running. Which one?',
        'It’s NAD+. Say what recycling it lets glycolysis keep doing.',
      ],
      [
        'Think about how much ATP each one makes.',
        'Compare the ATP counts: fermentation makes just a handful per glucose. How many, against about 30?',
        'Fermentation makes 2 ATP per glucose. Say how that compares with aerobic respiration.',
      ],
    ],
    correct: 'You nailed it: no oxygen, NAD+ recycled, and a lot less ATP.',
    answer: {
      title: 'Fermentation',
      heading: 'Plan B for energy',
      body: 'When there’s no oxygen, cells use fermentation. It recycles NAD+ so glycolysis can keep making a little ATP, about 2 per glucose instead of the roughly 30 from aerobic respiration. Its products are lactic acid in muscles, or ethanol and carbon dioxide in yeast.',
    },
    transcripts: {
      correct: 'Fermentation happens without oxygen. It recycles NAD+ so glycolysis keeps going, but it only makes 2 ATP instead of about 30.',
      partial: 'It happens when there’s no oxygen, like in your muscles when you run.',
      wrong: 'Fermentation makes more ATP because it’s faster.',
    },
  },
];

export const cellularEnergetics: Topic = {
  id: 'cellularEnergetics',
  name: 'Cellular energetics',
  /** The intro card, shown above question 1 only. */
  intro: 'Welcome! Let’s test your knowledge of cellular energetics.',
  questions,
};
