// AP US History, the American Revolution (roughly 1754-1783), five concepts under one topic. Drafted 2026-10-26
// for a family usability test; it has not been reviewed for accuracy yet. The transcripts are canned:
// participants are told the words shown are placeholders (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold. Each answer.title is also the concept's name in Results, lowercased in
// "your strongest area is …", so the titles are common nouns that still read well in lowercase.

import type { Question, Topic } from '../questions';

const questions: Question[] = [
  {
    prompt: '**Q:** What was **salutary neglect**, and why did it start to end after 1763?',
    keyPoints: [
      'Britain loosely enforced its trade laws and let the colonies largely govern themselves',
      'Colonists grew used to self-government through their own assemblies',
      'After the French and Indian War, Britain was deep in debt and tightened control with new taxes and rules',
    ],
    keyPointNames: [
      'the loose enforcement of trade laws',
      'colonial self-government',
      'Britain’s war debt',
    ],
    hints: [
      [
        'Think about how closely Britain watched the colonies before 1763.',
        'Britain had trade laws, but did it enforce them strictly? And who ran day-to-day government in the colonies?',
        'Britain enforced its trade laws loosely and let the colonies largely govern themselves. Say what that did to the colonists’ habits.',
      ],
      [
        'Think about what colonists expected after decades of being left alone.',
        'Colonial assemblies made many of the decisions. How would colonists feel about losing that?',
        'They grew used to self-government through their own assemblies. Say why new British rules would clash with that.',
      ],
      [
        'Think about what the French and Indian War left Britain with.',
        'The war was won, but it was expensive. What did Britain do about the money it owed?',
        'Britain was deep in debt, so it tightened control with new taxes and rules. Say how that ended salutary neglect.',
      ],
    ],
    correct: 'Exactly: loose control let colonial self-government grow, and the war debt made Britain tighten the reins.',
    answer: {
      title: 'Salutary neglect',
      heading: 'Left alone, then reined in',
      body: 'For decades Britain loosely enforced its trade laws and let the colonies largely govern themselves, so colonists grew used to making their own decisions through their assemblies. After the French and Indian War ended in 1763, Britain was deep in debt and began tightening control with new taxes and rules, which the colonists resented.',
    },
    transcripts: {
      correct: 'Salutary neglect was when Britain barely enforced its trade laws and let the colonies govern themselves, so they got used to self-government. After the French and Indian War, Britain had a huge debt and started tightening control with taxes.',
      partial: 'Britain didn’t enforce its laws strictly, and then after 1763 it started to.',
      wrong: 'It was when Britain sent a large army to rule the colonies directly.',
    },
  },
  {
    prompt: '**Q:** Why did colonists object to the **Stamp Act**, and how did they **protest** it?',
    keyPoints: [
      'Parliament taxed the colonists directly, and they had no elected representatives in it: "no taxation without representation"',
      'Colonists organized protests and boycotts, through groups like the Sons of Liberty and the Stamp Act Congress',
      'Britain repealed the Stamp Act but passed the Declaratory Act, still claiming the right to make laws for the colonies',
    ],
    keyPointNames: [
      'no taxation without representation',
      'the colonial boycotts',
      'the Declaratory Act',
    ],
    hints: [
      [
        'Think about who was taxing the colonists, and whether they had a say.',
        'Parliament passed the tax, but the colonists had no members in Parliament. What slogan came from that?',
        'The slogan was "no taxation without representation." Say why a direct tax from Parliament felt like a problem.',
      ],
      [
        'Think about how colonists made their anger felt.',
        'Groups like the Sons of Liberty and a meeting called the Stamp Act Congress pushed back. What did colonists do to Britain’s goods?',
        'They organized protests and boycotts. Say how that put pressure on British merchants and Parliament.',
      ],
      [
        'Think about how Britain responded, and what it refused to give up.',
        'Britain backed down on the Stamp Act, but a second law said Parliament could still make laws for the colonies. What was it called?',
        'The Stamp Act was repealed, and the Declaratory Act kept Parliament’s claim to make laws for the colonies. Say why that left the conflict unsettled.',
      ],
    ],
    correct: 'You got it: taxed with no say, they protested and boycotted, and Britain gave in on the tax but not on the principle.',
    answer: {
      title: 'Colonial protest',
      heading: 'No say, no tax',
      body: 'The Stamp Act of 1765 was a direct tax from Parliament, where the colonists had no elected representatives, so they argued there should be no taxation without representation. They protested and boycotted British goods, through groups like the Sons of Liberty and the Stamp Act Congress. Britain repealed the Stamp Act, but the Declaratory Act still claimed Parliament’s right to make laws for the colonies.',
    },
    transcripts: {
      correct: 'Parliament taxed the colonists directly and they had no representatives there, so it was taxation without representation. They protested and boycotted through the Sons of Liberty and the Stamp Act Congress. Britain repealed it but passed the Declaratory Act.',
      partial: 'They were taxed by Parliament without having representatives, so they protested.',
      wrong: 'The Stamp Act banned colonists from printing newspapers, so they rebelled.',
    },
  },
  {
    prompt: '**Q:** How did the **Boston Tea Party** lead to the **First Continental Congress**?',
    keyPoints: [
      'In 1773 colonists dumped British tea into Boston Harbor to protest the Tea Act and the tax on tea',
      'Britain punished Massachusetts with the Coercive Acts, which the colonists called the Intolerable Acts, closing Boston’s port and limiting self-government',
      'The other colonies united in support, and the First Continental Congress met in 1774 to coordinate a response, including a boycott',
    ],
    keyPointNames: [
      'the Boston Tea Party',
      'the Intolerable Acts',
      'the First Continental Congress',
    ],
    hints: [
      [
        'Think about what the colonists did in Boston Harbor, and why.',
        'In 1773, colonists destroyed a shipment of British goods to protest a law and a tax. What was the cargo?',
        'They dumped British tea into the harbor to protest the Tea Act and the tax on tea. Say how Britain reacted.',
      ],
      [
        'Think about how Britain punished Massachusetts.',
        'Britain passed harsh laws that closed Boston’s port and limited self-government in Massachusetts. What did colonists call them?',
        'They were the Coercive Acts, called the Intolerable Acts by the colonists. Say how the other colonies reacted.',
      ],
      [
        'Think about what the other colonies did when Massachusetts was punished.',
        'Delegates from the colonies met together in 1774. What was that meeting called, and what did it organize?',
        'The colonies united, and the First Continental Congress met in 1774 and coordinated a response, including a boycott. Say why that mattered.',
      ],
    ],
    correct: 'Spot on: the tea protest brought harsh punishment, and the punishment pulled the colonies together.',
    answer: {
      title: 'Road to war',
      heading: 'Punishment that united',
      body: 'In 1773 colonists dumped British tea into Boston Harbor to protest the Tea Act and the tax on tea. Britain answered with the Coercive Acts, which the colonists called the Intolerable Acts, closing Boston’s port and limiting self-government in Massachusetts. The other colonies rallied behind Massachusetts, and in 1774 the First Continental Congress met to coordinate a response, including a boycott of British goods.',
    },
    transcripts: {
      correct: 'Colonists dumped tea into Boston Harbor in 1773 to protest the Tea Act. Britain punished Massachusetts with the Coercive Acts, which the colonists called the Intolerable Acts, and then the colonies united and met in the First Continental Congress in 1774.',
      partial: 'They threw tea into the harbor, and Britain punished Boston with harsh laws.',
      wrong: 'The Boston Tea Party was when the colonies declared independence from Britain.',
    },
  },
  {
    prompt: '**Q:** How did **Enlightenment** ideas shape the **Declaration of Independence**?',
    keyPoints: [
      'Enlightenment thinkers like John Locke argued that people have natural rights to life, liberty and property, and the Declaration states them as life, liberty and the pursuit of happiness',
      'Government gets its power from the consent of the governed, and people can change a government that does not protect their rights',
      'The Declaration lists grievances against King George III to justify breaking away',
    ],
    keyPointNames: [
      'Locke’s natural rights',
      'consent of the governed',
      'the grievances against the king',
    ],
    hints: [
      [
        'Think about what the Declaration says every person is born with.',
        'Thinkers like John Locke believed people have rights that no government gave them. What famous phrase in the Declaration lists them?',
        'They are natural rights: life, liberty and the pursuit of happiness. Say whose idea this came from.',
      ],
      [
        'Think about where a government gets its power, and what people can do if it fails.',
        'The Declaration says power comes from the people. What is that idea called, and what can people do about a government that violates their rights?',
        'Government gets its power from the consent of the governed, and people can change a government that doesn’t protect their rights. Say how the Declaration uses that.',
      ],
      [
        'Think about the long list in the middle of the document.',
        'The Declaration lists complaints about one person in particular. Who, and what was the list for?',
        'It lists grievances against King George III to justify breaking away. Say why the colonists felt they needed to justify it.',
      ],
    ],
    correct: 'You nailed it: natural rights, consent of the governed, and a list of grievances to prove why.',
    answer: {
      title: 'Natural rights',
      heading: 'Why they could break away',
      body: 'Enlightenment thinkers like John Locke argued that people have natural rights to life, liberty and property, and the Declaration of Independence states them as life, liberty and the pursuit of happiness. It says a government gets its power from the consent of the governed, so people can change one that does not protect their rights. It then lists grievances against King George III to justify breaking away.',
    },
    transcripts: {
      correct: 'The Declaration used John Locke’s idea of natural rights, life, liberty and the pursuit of happiness. It says government gets its power from the consent of the governed, and it lists grievances against King George III to justify independence.',
      partial: 'It talks about life, liberty and the pursuit of happiness, which came from Enlightenment thinkers.',
      wrong: 'The Declaration set up the structure of the new government, with a president and a Congress.',
    },
  },
  {
    prompt: '**Q:** Why were the colonists able to **win independence** against the strongest military in the world?',
    keyPoints: [
      'The victory at Saratoga in 1777 was a turning point that convinced France to ally with the Americans',
      'French money, troops and navy were decisive, especially at the final victory at Yorktown in 1781',
      'Washington’s army survived, and Britain faced long supply lines and a hard-to-control population',
    ],
    keyPointNames: [
      'the turning point at Saratoga',
      'French help at Yorktown',
      'Washington’s army surviving',
    ],
    hints: [
      [
        'Think about the battle in 1777 that changed how other countries saw the Americans.',
        'After one major American victory in New York, a European power agreed to ally with the colonists. Which battle, and which country?',
        'The victory at Saratoga convinced France to ally with the Americans. Say what France then provided.',
      ],
      [
        'Think about what the French alliance gave the Americans.',
        'France sent money, troops and ships. At which final battle in 1781 did they trap the British army?',
        'French money, troops and navy were decisive, especially at Yorktown. Say why the navy mattered there.',
      ],
      [
        'Think about the difficulties of fighting a war across an ocean.',
        'Britain had to ship troops and supplies across the Atlantic, and Washington’s army never gave up. Why was that a problem for Britain?',
        'Washington’s army survived, and Britain faced long supply lines and a population it could not control. Say how that wore Britain down.',
      ],
    ],
    correct: 'Exactly: Saratoga won them France, France won them Yorktown, and Britain couldn’t outlast them.',
    answer: {
      title: 'Winning independence',
      heading: 'Allies and endurance',
      body: 'The American victory at Saratoga in 1777 was a turning point that convinced France to ally with the Americans. French money, troops and navy proved decisive, especially at the final victory at Yorktown in 1781. Washington’s army survived hard defeats, while Britain struggled with long supply lines and a population it could not control.',
    },
    transcripts: {
      correct: 'The victory at Saratoga convinced France to join as an ally, and French money, troops and ships helped win at Yorktown. Also, Washington’s army survived, and Britain had long supply lines and couldn’t control the colonists.',
      partial: 'The French helped them after Saratoga.',
      wrong: 'The colonists won because Britain was fighting a war with Spain and withdrew its troops.',
    },
  },
];

export const americanRevolution: Topic = {
  id: 'americanRevolution',
  name: 'American Revolution',
  intro: 'Welcome! Let’s test your knowledge of the American Revolution.',
  questions,
};
