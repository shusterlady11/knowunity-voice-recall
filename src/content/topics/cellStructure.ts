// AP Biology, Unit 2 (Cell structure and function), five concepts under one topic. Drafted 2026-10-24 for a
// family usability test; it has not been reviewed for accuracy yet. The transcripts are canned: participants
// are told the words shown are placeholders (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold. Each answer.title is also the concept's name in Results, lowercased in
// "your strongest area is …", so it reads well in lowercase.

import type { Question, Topic } from '../questions';

const questions: Question[] = [
  {
    prompt: '**Q:** What is the structure of the **plasma membrane**, and why is it called a **fluid mosaic**?',
    keyPoints: [
      'It is a bilayer of phospholipids: hydrophilic heads face the water, hydrophobic tails face inward',
      'Proteins are embedded in or attached to the bilayer, and they do jobs like transport and signaling',
      'The parts can move sideways (fluid) and are scattered like a mosaic',
    ],
    keyPointNames: [
      'the phospholipid bilayer',
      'the embedded proteins',
      'why it’s a fluid mosaic',
    ],
    hints: [
      [
        'Think about what a phospholipid looks like and which way it faces.',
        'Each phospholipid has a head that likes water and tails that avoid it. How do they line up in two layers?',
        'The heads face the water on both sides, and the tails face inward. Say what that makes the membrane.',
      ],
      [
        'Think about what else is in the membrane besides lipids.',
        'Large molecules are scattered through the bilayer. What are they, and what do they do?',
        'They’re proteins, and they carry out jobs like transport and signaling. Say how they sit in the bilayer.',
      ],
      [
        'Think about the words fluid and mosaic.',
        'Fluid is about movement, and mosaic is about the pattern of parts. What do they say about the membrane?',
        'The parts can drift sideways, and the proteins are scattered among the lipids. Say how that fits the name.',
      ],
    ],
    correct: 'Exactly: a phospholipid bilayer with proteins scattered through it, and all of it able to move.',
    answer: {
      title: 'Plasma membrane',
      heading: 'A fluid mosaic',
      body: 'The plasma membrane is a bilayer of phospholipids, with hydrophilic heads facing the watery surroundings and hydrophobic tails facing inward. Proteins are embedded in it or attached to it. The parts can move sideways and are scattered like tiles in a mosaic, which is why it is called a fluid mosaic.',
    },
    transcripts: {
      correct: 'It’s a phospholipid bilayer with the hydrophilic heads facing out and the tails facing in. Proteins are scattered through it, and everything can move around, so it’s a fluid mosaic.',
      partial: 'It’s a double layer of phospholipids with proteins in it.',
      wrong: 'It’s a rigid wall made of cellulose that holds the cell’s shape.',
    },
  },
  {
    prompt: '**Q:** How is **passive transport** different from **active transport** across a membrane?',
    keyPoints: [
      'Passive transport moves molecules down their concentration gradient, from high to low',
      'Active transport moves molecules against the gradient, from low to high',
      'Active transport needs energy (ATP) and a protein pump; passive transport needs no energy',
    ],
    keyPointNames: [
      'passive transport going down the gradient',
      'active transport going against the gradient',
      'the energy active transport needs',
    ],
    hints: [
      [
        'Think about which way molecules move on their own.',
        'On their own, molecules spread out from where there are lots of them. In which direction is that?',
        'They move down the concentration gradient, from high to low. Say what kind of transport that is.',
      ],
      [
        'Think about moving molecules the other way.',
        'A cell sometimes needs to collect something that is already scarce inside. Which direction does that go?',
        'It moves against the gradient, from low to high. Say what kind of transport does that.',
      ],
      [
        'Think about what it costs the cell.',
        'Pushing molecules uphill takes work. What does the cell spend, and what carries out the job?',
        'Active transport uses ATP and protein pumps. Say what passive transport uses instead.',
      ],
    ],
    correct: 'You got it: passive goes downhill for free, and active goes uphill and costs ATP.',
    answer: {
      title: 'Membrane transport',
      heading: 'Downhill and uphill',
      body: 'Passive transport, like diffusion, moves molecules down their concentration gradient, from high to low, with no energy from the cell. Active transport moves molecules against the gradient, from low to high, so it needs energy from ATP and a protein pump.',
    },
    transcripts: {
      correct: 'Passive transport moves molecules from high to low concentration and needs no energy. Active transport goes from low to high, so it needs ATP and a protein pump.',
      partial: 'Active transport uses energy and passive transport doesn’t.',
      wrong: 'Passive transport is when the cell pushes molecules in, and active transport is when they just float in.',
    },
  },
  {
    prompt: '**Q:** What happens to an **animal cell** and a **plant cell** when each is put in **pure water**?',
    keyPoints: [
      'Water moves by osmosis into the cell, toward the higher solute concentration',
      'An animal cell swells and can burst, because it has no cell wall',
      'A plant cell becomes turgid, because the cell wall resists and keeps it from bursting',
    ],
    keyPointNames: [
      'osmosis pulling water in',
      'the animal cell bursting',
      'the plant cell turning turgid',
    ],
    hints: [
      [
        'Think about which way the water moves.',
        'Pure water has no solutes, and the cell has some. Which way does the water go, and what is that process called?',
        'Water moves into the cell by osmosis, toward the higher solute concentration. Say what that does to the cell.',
      ],
      [
        'Think about what holds an animal cell in.',
        'An animal cell has only a thin membrane around it. What happens as more water comes in?',
        'It swells and can burst, because it has no cell wall. Say why that is different for a plant.',
      ],
      [
        'Think about what a plant cell has that an animal cell doesn’t.',
        'The cell wall pushes back as water comes in. What is a plant cell that is full and firm called?',
        'It’s turgid, and the wall keeps it from bursting. Say why that is good for the plant.',
      ],
    ],
    correct: 'Spot on: water rushes in, the animal cell can burst, and the plant cell just gets firm.',
    answer: {
      title: 'Osmosis',
      heading: 'Where the water goes',
      body: 'Water moves by osmosis toward the higher solute concentration, which is into the cell. An animal cell has no cell wall, so it swells and can burst. A plant cell becomes turgid: the cell wall pushes back and keeps it from bursting, and the firm cells help hold the plant up.',
    },
    transcripts: {
      correct: 'Water moves into both cells by osmosis. The animal cell swells and can burst because it has no cell wall, but the plant cell becomes turgid and the wall keeps it from bursting.',
      partial: 'Water goes into the cell and the animal cell could burst.',
      wrong: 'The water leaves both cells, so they shrivel up.',
    },
  },
  {
    prompt: '**Q:** How do the **endomembrane system** organelles work together to make and ship a **protein**?',
    keyPoints: [
      'Ribosomes on the rough ER build the protein, which enters the ER',
      'The Golgi apparatus modifies, sorts and packages the protein',
      'Vesicles carry it to the plasma membrane, where it is secreted out of the cell',
    ],
    keyPointNames: [
      'ribosomes on the rough ER',
      'the Golgi’s packaging',
      'vesicles carrying the protein out',
    ],
    hints: [
      [
        'Think about where the protein is built.',
        'The rough ER looks bumpy because of what is attached to it. What are they, and what do they do?',
        'Ribosomes on the rough ER build the protein, and it enters the ER. Say where it goes next.',
      ],
      [
        'Think about the stop after the ER, which works like a post office.',
        'One organelle finishes the protein and gets it ready to ship. What is it called?',
        'It’s the Golgi apparatus, which modifies, sorts and packages the protein. Say how the protein leaves it.',
      ],
      [
        'Think about how the protein travels between organelles.',
        'Small membrane bubbles carry it along. What are they called, and where do they take it?',
        'Vesicles carry it to the plasma membrane. Say what happens to the protein there.',
      ],
    ],
    correct: 'Exactly: built on the rough ER, packaged in the Golgi, and shipped out in a vesicle.',
    answer: {
      title: 'Endomembrane system',
      heading: 'A protein’s journey',
      body: 'Ribosomes on the rough ER build the protein and feed it into the ER. It moves to the Golgi apparatus, which modifies, sorts and packages it. Vesicles then carry it to the plasma membrane, where it is secreted out of the cell.',
    },
    transcripts: {
      correct: 'Ribosomes on the rough ER make the protein, then the Golgi modifies and packages it. A vesicle carries it to the plasma membrane and it gets secreted.',
      partial: 'The protein is made on the rough ER and then goes to the Golgi.',
      wrong: 'The mitochondria make the protein and the nucleus ships it out.',
    },
  },
  {
    prompt: '**Q:** Why are most cells **small**, and what does the **surface area to volume ratio** have to do with it?',
    keyPoints: [
      'As a cell grows, its volume increases faster than its surface area',
      'So the ratio falls, and the membrane can’t exchange materials fast enough for the whole cell',
      'Cells stay small or add folds, like microvilli, to keep a high ratio',
    ],
    keyPointNames: [
      'volume growing faster than surface area',
      'the falling ratio slowing exchange',
      'how cells keep the ratio high',
    ],
    hints: [
      [
        'Think about what happens to the surface and the inside as a cell gets bigger.',
        'Picture doubling the size of a cube. Which grows faster, the outside or the inside?',
        'Volume increases faster than surface area. Say what that does to the ratio.',
      ],
      [
        'Think about the job the membrane does for the whole cell.',
        'Everything the cell takes in and sends out crosses its surface. What happens when the surface is small compared with the inside?',
        'The ratio falls, and the membrane can’t exchange materials fast enough. Say what that means for the cell.',
      ],
      [
        'Think about how a cell can keep its ratio high.',
        'A cell can stay small, or it can fold its membrane to gain surface. What are the small folds in the gut lining called?',
        'They’re microvilli, and they add surface area. Say why that helps the cell.',
      ],
    ],
    correct: 'You nailed it: the inside outgrows the surface, so cells stay small or fold their membrane.',
    answer: {
      title: 'Surface area to volume ratio',
      heading: 'Why cells stay small',
      body: 'As a cell grows, its volume increases faster than its surface area, so the ratio falls. The membrane then can’t move nutrients and wastes fast enough for the whole cell. Cells stay small or fold their membrane, like the microvilli in the gut, to keep a high ratio.',
    },
    transcripts: {
      correct: 'Volume grows faster than surface area, so the ratio drops. Then the membrane can’t exchange materials fast enough, so cells stay small or have folds like microvilli.',
      partial: 'As a cell gets bigger, it has less surface area compared to its volume.',
      wrong: 'Cells are small because they run out of DNA when they get big.',
    },
  },
];

export const cellStructure: Topic = {
  id: 'cellStructure',
  name: 'Cell structure',
  intro: 'Welcome! Let’s test your knowledge of cell structure and function.',
  questions,
};
