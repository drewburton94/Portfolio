// All site copy lives here. Edit, then run `node scripts/build.mjs`.

export const site = {
  name: 'Drew Burton',
  role: 'Customer Education',
  title: 'Drew Burton — Learning experience designer & builder',
  description:
    'Drew Burton — learning experience designer and builder. I design and ship the systems that help customers actually adopt and use the product.',
  email: 'Burton.Andrew@icloud.com',
  linkedin: 'https://www.linkedin.com/in/DrewSBurton',
  github: '', // add your GitHub URL to show it on the contact row
  resume: '', // add e.g. 'assets/drew-burton-resume.pdf' to show the download button
};

export const hero = {
  headline: ['I', 'design', 'learning', 'systems', 'for', '*adoption*,', 'not', 'just', 'consumption.'],
  sub: "There's a lot of bad training out there. For 12+ years I've been building the alternative.",
};

export const about = {
  kicker: 'About',
  facts: [
    { n: 15, suffix: '+', t: 'Years in design' },
    { n: 12, suffix: '+', t: 'Years in learning & development' },
    { n: '∞', suffix: '', t: "Curiosity about what's possible" },
  ],
  intro: "I'm curious how things work. Even more curious how they could work better.",
  me: "I'm Drew. A designer, a problem-solver, and someone who has a hard time leaving a good idea alone.",
  think: {
    kicker: 'How I think',
    rows: [
      { old: 'Create more content.', now: "The goal isn't more learning. *It's helping people do more.*" },
      { old: 'Make sure everything is included.', now: 'Make the complicated feel simple. *Not the other way around.*' },
      { old: 'Create a course.', now: '*Create an experience.* One people can try, practice, and apply.' },
      { old: 'Start building the solution right away.', now: "*Share early. Collaborate often.* Build on what's already there." },
    ],
  },
  ai: {
    kicker: 'Human first. AI enabled.',
    line: "The more we can do with AI, the more important it is to remember who we're doing it for.",
    key: "who we're doing it for.",
    note: "AI has changed what I'm able to create, but not why I create it.",
  },
};

export const projects = [
  {
    id: 'learning-data',
    title: 'Learning Data and Renewal Signals',
    short: 'Does customer education show up in who renews and who leaves?',
    meta: 'analysis · customer success',
    type: 'Research and analysis',
    tools: '',
    tags: ['Learning analytics', 'Customer success', 'Retention'],
    art: 'bars',
    problem: "Education teams usually report completions. The business cares about renewals. I wanted to know if the two were connected. It started with a conversation about churn, not a request for a report.",
    did: [
      "**The finding.** I compared a year of Academy activity against a full quarter of renewal decisions. Accounts where someone took a course renewed about 91% of the time, against 79% where nobody did. Grouping accounts into four tiers by recent activity showed the same slope, from 96% at the top to 78% at the bottom, against 82% overall. The typical lost renewal had gone quiet in Academy about 20 months earlier. It held at every deal size, in both regions, and on long-standing accounts, and a separate year-long analysis found the same pattern.",
      "**How I got to something I'd trust.** I kept asking whether it was real or just a proxy. Was it big accounts, account age, one region? I checked each. I caught duplicate rows and partner accounts skewing the results, and I checked the data against the analytics team's own numbers before anyone relied on it. The findings held. I also wrote down where education can't help, like pricing decisions and downgrades, and framed it as a way to decide who to look at first, not a churn predictor.",
      "**Where it went.** It's now being integrated into the customer success platform and into how the company thinks about churn and renewal, so Academy activity sits next to the other signals CSMs use. I reshaped it for each reader, executives, CSM leaders and the Academy team, because the same finding lands differently for each.",
    ],
    why: "Completions tell you who clicked. Renewals tell you who stayed. Education earns its place when it connects to what customers do and what the business needs. It's why I connect courses to feature adoption, and why I work with the product design team on learning inside the product, so help shows up where people are already working.",
    highlights: [
      'Kept asking whether the pattern was real or a proxy',
      'Plain language for every reader, caveats kept in the data',
      "Said plainly where education can't help",
    ],
    media: [
      { type: 'image', src: '/assets/projects/1-academy-engagement-tiers.png', alt: 'Bar chart of renewal rate by Academy activity tier: 96% strong, 88% some, 81% lapsed, 78% cold.', caption: 'The more an account learned, the more it renewed.' },
      { type: 'image', src: '/assets/projects/2-academy-courses-vs-none.png', alt: 'Bar chart of renewal rate: 91% where someone took a course, 79% where nobody did.', caption: 'Where someone took a course, renewal ran 12 points higher.' },
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools for Customer Success',
    short: "A sampling of tools I've built, and how I decide what's worth automating.",
    meta: 'ai tools · customer success',
    type: 'Internal tools and customer-facing skills',
    tools: 'Claude, Claude Code, Supabase, Vercel',
    tags: ['Customer success', 'Diagnostics', 'AI agents'],
    art: 'pulse',
    problem: '',
    did: [
      "**Search health dashboard.** Customer success managers had no single place to see how all their customers were doing. They had to check one account at a time across several tools. This puts every customer in one view and flags which ones need attention first.",
      "**Journey check and health check skills.** Two AI skills that take on the first pass of a review. One walks through a customer's site like a shopper and checks that tracking works. The other scores an implementation against our checklist. People still make the call, but they start from a draft instead of a blank page.",
      "**Implementation skills library.** More and more customers build with AI coding assistants, and those assistants skip the things that make an implementation succeed. This open-source library teaches them those things, so customers start from a better place.",
      "**Global CS Library.** Good work was getting lost in downloads and chat threads. This is one shared place where the customer success team can find and reuse each other's skills and artifacts.",
      "Most of it is in pilot. Some is still being tested.",
    ],
    why: "I build a tool when people keep doing the same manual work, or hopping between places to find one answer. I start small, put a rough version in front of a few people, and let their feedback shape it. The goal is to automate the repetitive first pass and leave the judgment to people.",
    highlights: [
      'Start with a friction point, not a technology',
      'Automate the first pass. People make the call.',
      'Pilot small, learn, then scale',
    ],
    media: [
      { type: 'image', src: '/assets/projects/1-search-health-dashboard.png', alt: 'Screenshot of the search health dashboard.', caption: 'Four customers flagged, eleven indices quietly fine. A CSM sees where to look first.' },
      { type: 'image', src: '/assets/projects/2-health-check-skill.png', alt: 'Screenshot of the health check skill.', caption: 'A first-pass review with scores, evidence, and what still needs a human.' },
      { type: 'image', src: '/assets/projects/3-implementation-skills-library.png', alt: 'Screenshot of the implementation skills library.', caption: 'Pick where you are, drop it into your AI tool, ask.' },
      { type: 'image', src: '/assets/projects/4-global-cs-library.png', alt: 'Screenshot of the Global CS Library.', caption: 'Skills and artifacts built by and for Customer Success.' },
    ],
  },
  {
    id: 'academy',
    title: 'Next-generation Academy LMS',
    short: 'Rethinking the LMS as a customer learning layer, not a course repository.',
    meta: 'learning platform · redesign',
    type: 'Learning platform redesign + extension',
    tools: 'Claude Design, Claude Code, Supabase, GitHub, Vercel',
    tags: ['Learning platform', 'Information architecture', 'Handoff'],
    art: 'grid',
    problem:
      "An LMS is usually treated as a place to store courses. Customers arrive, browse a library, pick something that looks close to their situation, and hope it applies. Nothing in the system knows anything true about them — their role, their implementation, what they've already configured, or where they're actually stuck.",
    did: [
      'I redesigned an existing shell into a ~31-page production-ready admin UI built against sample data, then packaged the entire thing as a 45-file handoff for the engineer who owns the schema, auth, and repo.',
      'The handoff led with an intent document rather than a requirements list. Every screen got a structured block: **its job, what it argues, and what would count as failure.** Most specs describe what a screen contains. This one described what it was supposed to do to the person looking at it.',
      "I also specced a connected-apps feature: customers authenticate their own Algolia application so Academy can read their real configuration, analytics, and usage — and recommend based on their actual system rather than their self-reported level.",
    ],
    why: 'The LMS stops being a content library and becomes a learning layer: content, paths, practice, recommendations, certification, learning history, and product signals in one place. Education personalized by what\'s actually true about the customer.',
    highlights: [
      'Design as specification, not decoration — the mock *was* the spec',
      'Intent-first documentation that survived handoff',
      'A proposal that reframes what a learning platform is for',
    ],
  },
];

export const workIntro =
  "Four projects, one throughline: someone is operating without information they need, and doesn't know it. Every project closes one of those gaps.";

export const history = [
  {
    when: '2024 — Now',
    role: 'Instructional Designer',
    org: 'Algolia',
    body: 'Own customer education across onboarding, product training, and technical learning. Redesigned Algolia Academy around interactive and applied experiences, and built technical learning paths and certifications that drove record engagement — more than the previous four years combined in a single year.',
  },
  {
    when: '2020 — 2024',
    role: 'Instructional Designer',
    org: 'Talkdesk',
    body: 'Helped build and shape the education function as the company scaled. Owned internal onboarding for a global workforce and partnered with HR, leadership, and Sales Enablement on leadership development and sales enablement.',
  },
  {
    when: '2018 — 2020',
    role: 'Instructional Designer',
    org: 'Kelly Services',
    body: 'Designed interactive e-learning and assessments tied to operational goals. Built the training behind a large-scale process automation rollout, enabling adoption for 2,000+ global operators.',
  },
  {
    when: '2016 — 2017',
    role: 'Administrative Co-op',
    org: 'Dow Chemical',
    body: 'Led a data archival project covering 2,000+ confidential records in a highly regulated environment.',
  },
  {
    when: '2015 — 2016',
    role: 'eLearning Developer',
    org: 'Delta College Corporate Services',
    body: 'Developed e-learning modules and supported evaluation and refinement of training content.',
  },
];

export const contact = {
  heading: 'Imagine what we could create together.',
  body: "I'm always excited to meet people who care about making things better. If that sounds like your team, I'd love to talk.",
};
