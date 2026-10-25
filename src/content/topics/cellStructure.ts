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
    hints: [
      [
        'You’ve got {covered} of {total} key ideas. Think about what a phospholipid looks like and which way it faces.',
        'You’ve got {covered} of {total} key ideas. Each phospholipid has a head that likes water and tails that avoid it. How do they line up in two layers?',
        'You’ve got {covered} of {total} key ideas. The heads face the water on both sides, and the tails face inward. Say what that makes the membrane.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about what else is in the membrane besides lipids.',
        'You’ve got {covered} of {total} key ideas. Large molecules are scattered through the bilayer. What are they, and what do they do?',
        'You’ve got {covered} of {total} key ideas. They’re proteins, and they carry out jobs like transport and signaling. Say how they sit in the bilayer.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about the words fluid and mosaic.',
        'You’ve got {covered} of {total} key ideas. Fluid is about movement, and mosaic is about the pattern of parts. What do they say about the membrane?',
        'You’ve got {covered} of {total} key ideas. The parts can drift sideways, and the proteins are scattered among the lipids. Say how that fits the name.',
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
    hints: [
      [
        'You’ve got {covered} of {total} key ideas. Think about which way molecules move on their own.',
        'You’ve got {covered} of {total} key ideas. On their own, molecules spread out from where there are lots of them. In which direction is that?',
        'You’ve got {covered} of {total} key ideas. They move down the concentration gradient, from high to low. Say what kind of transport that is.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about moving molecules the other way.',
        'You’ve got {covered} of {total} key ideas. A cell sometimes needs to collect something that is already scarce inside. Which direction does that go?',
        'You’ve got {covered} of {total} key ideas. It moves against the gradient, from low to high. Say what kind of transport does that.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about what it costs the cell.',
        'You’ve got {covered} of {total} key ideas. Pushing molecules uphill takes work. What does the cell spend, and what carries out the job?',
        'You’ve got {covered} of {total} key ideas. Active transport uses ATP and protein pumps. Say what passive transport uses instead.',
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
    hints: [
      [
        'You’ve got {covered} of {total} key ideas. Think about which way the water moves.',
        'You’ve got {covered} of {total} key ideas. Pure water has no solutes, and the cell has some. Which way does the water go, and what is that process called?',
        'You’ve got {covered} of {total} key ideas. Water moves into the cell by osmosis, toward the higher solute concentration. Say what that does to the cell.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about what holds an animal cell in.',
        'You’ve got {covered} of {total} key ideas. An animal cell has only a thin membrane around it. What happens as more water comes in?',
        'You’ve got {covered} of {total} key ideas. It swells and can burst, because it has no cell wall. Say why that is different for a plant.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about what a plant cell has that an animal cell doesn’t.',
        'You’ve got {covered} of {total} key ideas. The cell wall pushes back as water comes in. What is a plant cell that is full and firm called?',
        'You’ve got {covered} of {total} key ideas. It’s turgid, and the wall keeps it from bursting. Say why that is good for the plant.',
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
    hints: [
      [
        'You’ve got {covered} of {total} key ideas. Think about where the protein is built.',
        'You’ve got {covered} of {total} key ideas. The rough ER looks bumpy because of what is attached to it. What are they, and what do they do?',
        'You’ve got {covered} of {total} key ideas. Ribosomes on the rough ER build the protein, and it enters the ER. Say where it goes next.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about the stop after the ER, which works like a post office.',
        'You’ve got {covered} of {total} key ideas. One organelle finishes the protein and gets it ready to ship. What is it called?',
        'You’ve got {covered} of {total} key ideas. It’s the Golgi apparatus, which modifies, sorts and packages the protein. Say how the protein leaves it.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about how the protein travels between organelles.',
        'You’ve got {covered} of {total} key ideas. Small membrane bubbles carry it along. What are they called, and where do they take it?',
        'You’ve got {covered} of {total} key ideas. Vesicles carry it to the plasma membrane. Say what happens to the protein there.',
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
    hints: [
      [
        'You’ve got {covered} of {total} key ideas. Think about what happens to the surface and the inside as a cell gets bigger.',
        'You’ve got {covered} of {total} key ideas. Picture doubling the size of a cube. Which grows faster, the outside or the inside?',
        'You’ve got {covered} of {total} key ideas. Volume increases faster than surface area. Say what that does to the ratio.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about the job the membrane does for the whole cell.',
        'You’ve got {covered} of {total} key ideas. Everything the cell takes in and sends out crosses its surface. What happens when the surface is small compared with the inside?',
        'You’ve got {covered} of {total} key ideas. The ratio falls, and the membrane can’t exchange materials fast enough. Say what that means for the cell.',
      ],
      [
        'You’ve got {covered} of {total} key ideas. Think about how a cell can keep its ratio high.',
        'You’ve got {covered} of {total} key ideas. A cell can stay small, or it can fold its membrane to gain surface. What are the small folds in the gut lining called?',
        'You’ve got {covered} of {total} key ideas. They’re microvilli, and they add surface area. Say why that helps the cell.',
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
