// Econ 101, Monopolies, five concepts under one topic. Drafted 2026-10-24 for a family usability test; it has
// not been reviewed for accuracy yet. The transcripts are canned: participants are told the words shown are
// placeholders (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold. Each answer.title is also the concept's name in Results, lowercased in
// "your strongest area is …", so it reads well in lowercase.

import type { Question, Topic } from '../questions';

const questions: Question[] = [
  {
    prompt: '**Q:** What makes a firm a **monopoly**?',
    keyPoints: [
      'It is the only seller in its market',
      'There are no close substitutes for what it sells',
      'Barriers to entry keep other firms out, so it can set its own price',
    ],
    keyPointNames: [
      'being the only seller',
      'having no close substitutes',
      'barriers to entry',
    ],
    hints: [
      [
        'Think about how many sellers there are.',
        'In perfect competition there are many sellers. How many are there in a monopoly?',
        'There is only one seller in the market. Say what that means for buyers.',
      ],
      [
        'Think about what a buyer can switch to.',
        'If the product has close alternatives, the firm has competition. What does a monopoly’s product lack?',
        'It has no close substitutes. Say why that matters for the price.',
      ],
      [
        'Think about why no one else can enter the market.',
        'Something stops new firms from entering. What do economists call that, and what can the firm do because of it?',
        'Barriers to entry keep others out, so the firm is a price maker. Say what that means.',
      ],
    ],
    correct: 'Exactly: one seller, no close substitutes, and barriers that keep competitors out.',
    answer: {
      title: 'Monopoly',
      heading: 'One seller sets the terms',
      body: 'A monopoly is the only seller in its market, selling a product with no close substitutes. Barriers to entry keep other firms out, so the monopolist is a price maker: it can choose its price instead of taking the market price.',
    },
    transcripts: {
      correct: 'A monopoly is the only seller in a market with no close substitutes. Barriers to entry keep other firms out, so it’s a price maker.',
      partial: 'It’s when there’s only one company selling a product.',
      wrong: 'It’s when a lot of firms agree to charge the same price.',
    },
  },
  {
    prompt: '**Q:** What are the main **barriers to entry** that can create a monopoly?',
    keyPoints: [
      'Legal barriers, such as patents and government licenses',
      'Control of a key resource that competitors can’t get',
      'Economies of scale, where one large firm can serve the market at the lowest cost (a natural monopoly)',
    ],
    keyPointNames: [
      'legal barriers like patents',
      'control of a key resource',
      'economies of scale',
    ],
    hints: [
      [
        'Think about what the law can do to protect one seller.',
        'A drug company is the only one allowed to sell a new medicine for years. What protects it?',
        'Patents and government licenses are legal barriers. Say how they keep competitors out.',
      ],
      [
        'Think about owning something no one else can get.',
        'If one firm owns the only source of an input, what can other firms not do?',
        'Control of a key resource blocks competitors. Say how that makes one firm the only seller.',
      ],
      [
        'Think about costs falling as a firm gets larger.',
        'Some industries, like water pipes, are cheapest with one big firm. What are these cost advantages called?',
        'They’re economies of scale, and they can create a natural monopoly. Say why a second firm would struggle.',
      ],
    ],
    correct: 'You got it: the law, a key resource, or costs that make one big firm cheapest.',
    answer: {
      title: 'Barriers to entry',
      heading: 'Why no one else gets in',
      body: 'Monopolies last because new firms can’t enter. The barriers are legal, like patents and licenses; control of a key resource that competitors can’t get; and economies of scale, where one large firm can serve the whole market at the lowest cost. That last case is called a natural monopoly.',
    },
    transcripts: {
      correct: 'There are legal barriers like patents and licenses, control of a key resource, and economies of scale, where one big firm has the lowest cost, which is a natural monopoly.',
      partial: 'Patents are one, and owning a key resource is another.',
      wrong: 'The main barrier is that customers don’t like new brands.',
    },
  },
  {
    prompt: '**Q:** Why is a monopolist’s **marginal revenue** less than its **price**?',
    keyPoints: [
      'A monopolist faces the downward-sloping market demand curve',
      'To sell one more unit it must lower the price',
      'It lowers the price on all its units, not just the new one, so marginal revenue falls below price',
    ],
    keyPointNames: [
      'the downward-sloping demand curve',
      'lowering the price to sell more',
      'the lower price on every unit',
    ],
    hints: [
      [
        'Think about the demand curve a monopolist faces.',
        'A monopoly is the only seller, so it faces the whole market’s demand. Which way does that curve slope?',
        'It slopes downward. Say what that means for the quantity buyers want at a higher price.',
      ],
      [
        'Think about what it takes to sell more.',
        'If demand slopes down, how does the firm get buyers to take one more unit?',
        'It has to lower the price. Say who gets that lower price.',
      ],
      [
        'Think about the units it was already selling.',
        'The new, lower price applies to every unit sold. What happens to the revenue from the old units?',
        'It lowers the price on all its units, so marginal revenue is less than price. Say how that compares with a competitive firm.',
      ],
    ],
    correct: 'Spot on: to sell one more it cuts the price on every unit, so marginal revenue sits below price.',
    answer: {
      title: 'Marginal revenue',
      heading: 'The price-cut penalty',
      body: 'A monopolist faces the downward-sloping market demand curve, so to sell one more unit it must lower its price. That lower price applies to all the units it sells, not just the new one, so the extra revenue from one more unit is less than the price. Marginal revenue is below price.',
    },
    transcripts: {
      correct: 'The monopolist faces a downward-sloping demand curve, so to sell more it has to lower the price on every unit, not just the last one. That’s why marginal revenue is less than price.',
      partial: 'It has to lower the price to sell more.',
      wrong: 'Marginal revenue is less than price because of the cost of making the extra unit.',
    },
  },
  {
    prompt: '**Q:** How does a monopolist choose its **profit-maximizing** output and price?',
    keyPoints: [
      'It produces up to the quantity where marginal revenue equals marginal cost',
      'It then reads the price from the demand curve at that quantity',
      'That price is above marginal cost, unlike in perfect competition',
    ],
    keyPointNames: [
      'setting marginal revenue equal to marginal cost',
      'reading the price off the demand curve',
      'price staying above marginal cost',
    ],
    hints: [
      [
        'Think about when making one more unit stops adding profit.',
        'Each extra unit adds revenue and adds cost. When should the firm stop? Compare the two.',
        'It stops where marginal revenue equals marginal cost. Say what happens if it makes more or less.',
      ],
      [
        'Think about where the price comes from.',
        'Once the firm knows the quantity, buyers decide what they’ll pay. Which curve shows that?',
        'It reads the price from the demand curve at that quantity. Say why it isn’t the marginal revenue curve.',
      ],
      [
        'Think about how the price compares with marginal cost.',
        'In perfect competition, price equals marginal cost. What is different for a monopolist?',
        'The monopolist’s price is above marginal cost. Say where its extra profit comes from.',
      ],
    ],
    correct: 'Exactly: find where marginal revenue meets marginal cost, then charge what demand allows.',
    answer: {
      title: 'Profit maximization',
      heading: 'Quantity first, then price',
      body: 'A monopolist produces up to the quantity where marginal revenue equals marginal cost. It then reads the price from the demand curve at that quantity. Because marginal revenue is below price, that price ends up above marginal cost, which is how a monopolist earns a profit that a competitive firm would not.',
    },
    transcripts: {
      correct: 'It produces where marginal revenue equals marginal cost, then goes up to the demand curve to find the price. The price ends up higher than marginal cost.',
      partial: 'It produces where marginal revenue equals marginal cost.',
      wrong: 'It produces as much as possible, so it sells to every customer at the lowest price.',
    },
  },
  {
    prompt: '**Q:** Why does a monopoly cause a **deadweight loss**, and what can the government do about it?',
    keyPoints: [
      'A monopoly produces less and charges more than a competitive market would',
      'Some trades that would benefit buyers and sellers never happen: that lost value is the deadweight loss',
      'The government can regulate the price, as with a price cap, or use antitrust law to break up or block monopolies',
    ],
    keyPointNames: [
      'less output at a higher price',
      'the lost trades behind deadweight loss',
      'the government’s remedies',
    ],
    hints: [
      [
        'Think about how a monopoly compares with a competitive market.',
        'Compared with competition, does a monopolist make more or less, and charge more or less?',
        'It produces less and charges more. Say what that does to buyers who wanted to buy.',
      ],
      [
        'Think about trades that never happen.',
        'Some buyers would pay more than the cost of making the good, but the monopoly doesn’t sell to them. What do we call that lost value?',
        'It’s the deadweight loss: value that nobody gets. Say why it is a loss for society.',
      ],
      [
        'Think about the tools a government has.',
        'A government can limit what a monopoly charges, or limit how big a firm gets. What are those called?',
        'It can set a price cap or use antitrust law to break up or block monopolies. Say how a price cap would help.',
      ],
    ],
    correct: 'You nailed it: less output, a higher price, lost trades, and the government can step in.',
    answer: {
      title: 'Deadweight loss',
      heading: 'The trades that never happen',
      body: 'A monopoly produces less and charges more than a competitive market would. Trades that would have benefited both buyers and sellers never happen, and that lost value is the deadweight loss. Governments respond by regulating the price, for example with a price cap, or by using antitrust law to break up or block monopolies.',
    },
    transcripts: {
      correct: 'A monopoly makes less and charges more, so some trades that would help both sides don’t happen, and that’s the deadweight loss. The government can use a price cap or antitrust law.',
      partial: 'A monopoly charges a higher price and produces less than a competitive market.',
      wrong: 'Deadweight loss is the tax the monopoly pays to the government.',
    },
  },
];

export const monopolies: Topic = {
  id: 'monopolies',
  name: 'Monopolies',
  intro: 'Welcome! Let’s test your knowledge of monopolies.',
  questions,
};
