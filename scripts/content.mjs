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
  sub: "There's a lot of bad training out there. For 11 years I've been building the alternative.",
};

export const about = {
  kicker: 'About',
  title: ['Nobody wakes up', 'wanting to take', 'a course.'],
  lede:
    "They wake up wanting to get something done. So I start from the job, not the curriculum — and I treat *learning as a product*.",
  body: [
    "I'm Drew — a learning experience designer and builder working at the seam between customer education, product, and customer success. Eleven years in, across enterprise software, staffing, manufacturing, and higher ed.",
    "My background is graphic design, which shows up in how I work more than in what I make. I shape things visually first, until the intent is unmistakable, and then build or hand off. Not a developer by training — but I ship real, deployed software anyway, using AI tooling as the bridge between design intent and working code.",
    "A lot of my work starts as an education problem and turns into a product, a workflow, an assistant, a dashboard, or an internal tool.",
  ],
  facts: [
    { n: '11', t: 'Years across customer education, enablement, and e-learning development' },
    { n: '4 yrs', t: 'Of Academy engagement exceeded in a single year — a record' },
    { n: '2,000+', t: 'Global operators enabled for a process automation rollout' },
  ],
  whatIDo: [
    {
      num: '01',
      title: 'Design the experience',
      body: "I start with the person, not the format. What do they need to understand? What's in their way? What would make this obvious? The answer isn't always a course.",
    },
    {
      num: '02',
      title: 'Build the thing',
      body: 'I prototype aggressively and ship real software. A working version exposes what\'s unclear far faster than a spec does — and a prototype that feels real gets built.',
    },
    {
      num: '03',
      title: 'Connect it to outcomes',
      body: "Learning doesn't live in its own reporting system. I connect education to adoption, implementation quality, and customer health so it's clear where it's helping and where to intervene earlier.",
    },
  ],
  traits: [
    ['Visual thinker', "Show me the diagram, the mock, the example. I'd rather look at the thing than read about the thing."],
    ['Skeptical of green checkmarks', 'The dashboard says fine, the data says otherwise, so go look.'],
    ['Comfortable outside my lane', '"I don\'t have that background" reads to me as a logistics problem, not a stop sign.'],
    ['Restless with inherited models', 'Why does this need to be a course? Why is certification multiple choice? Why do we call it enrollment?'],
  ],
};

export const approach = {
  kicker: 'How I think about it',
  title: 'Approach',
  principles: [
    ['Start with the problem, not the format.', "I don't assume the answer is a course, a video, or an LMS page. I work backward from what someone needs to understand or accomplish — sometimes that's an assistant, a diagnostic, a simulation, or a short explanation at the exact moment it matters."],
    ['Meet people at the moment of need.', 'The best learning experience appears inside the workflow — during troubleshooting, at adoption moments, before a consequential decision. It doesn\'t always look like learning.'],
    ['Adapt to intent.', 'Some people want a concept, some a walkthrough, some a sandbox, some just the answer. A good system recognizes the difference instead of routing everyone through the same sequence.'],
    ['Prototype to make the case.', "I'd rather build a rough working version and react to it than debate an abstract concept. Craft is part of the argument — a handoff that's complete and beautiful gets built."],
    ['Think in systems.', 'Where is it discovered? Why would someone choose it? What comes after? Can we tell if they applied it? That\'s why I\'m drawn to platforms and infrastructure over isolated assets.'],
    ['Let AI change what this can be.', 'Not primarily as a faster way to make content — as a way to redesign the experience itself: conversational, adaptive, context-aware, embedded in the workflow.'],
  ],
};

export const toolkit = {
  disciplines: [
    'Customer & product education',
    'Learning program strategy',
    'Learning analytics',
    'Applied AI in learning',
    'UI / UX',
    'Graphic design',
  ],
  tools: [
    'Claude Design',
    'Claude Code',
    'Figma',
    'Adobe Creative Cloud',
    'Supabase',
    'GitHub',
    'Vercel',
    'Articulate',
    'Captivate',
    'Google Sheets + Apps Script',
  ],
};

export const projects = [
  {
    id: 'academy',
    num: '01',
    title: 'Algolia Academy LMS',
    short: 'Rethinking the LMS as a customer learning layer, not a course repository.',
    meta: 'learning platform · redesign',
    year: '2024',
    role: 'Design lead, front-end build, product direction',
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
  {
    id: 'world-of-search',
    num: '02',
    title: 'World of Search',
    short: 'An interactive 3D experience that takes you backstage into how search actually works.',
    meta: 'interactive 3D',
    year: '2025',
    role: 'Concept, design, build',
    type: 'Interactive 3D learning experience',
    tools: '',
    tags: ['Interactive', '3D', 'Concept'],
    art: 'tunnel',
    problem:
      'Search is one of those systems people use constantly and understand vaguely. You can read a description of tokenization or an inverted index and still have no working mental model of what happens between typing a query and seeing results.',
    did: [
      'Built an interactive 3D experience that starts somewhere familiar — a mock storefront called Aurora Audio — and then warp-tunnels backstage into the machinery. Tokenization, inverted index lookup, ranking. Abstract concepts made spatial and walkable.',
      'Brand tokens and narration rules live in a persistent context file so the voice and visual language stay coherent across the whole experience.',
    ],
    why: 'The bet is that people learn how a system works by moving through its structure, not by reading a description of it. Start where the learner already is — the surface they recognize — then tunnel inward.',
    highlights: [
      'Understanding as spatial, not textual',
      'Familiar surface first, mechanism second',
      "Learning that doesn't look like learning",
    ],
  },
  {
    id: 'events-health',
    num: '03',
    title: 'Events Health Detector',
    short: 'A monitoring tool that catches broken customer implementations before anyone notices.',
    meta: 'diagnostic tool',
    year: '2025',
    role: 'Concept, design, build',
    type: 'Internal diagnostic / monitoring tool',
    tools: '',
    tags: ['Internal tool', 'Diagnostics', 'Data'],
    art: 'pulse',
    problem:
      'A dashboard reports that all events are healthy. Meanwhile add-to-cart, purchase, and conversion rates sit near zero. Manual debugging shows missing `queryID`s and `userToken`s — the implementation has been quietly broken for months, and the green checkmark says otherwise. Nobody catches it, because catching it requires technical debugging that the people closest to the customer aren\'t always equipped to do, across 10–15 accounts each.',
    did: [
      'Built a scheduled tool that flags customers whose event tracking is silently broken. Credentials get entered once; the tool does the watching. Designed specifically for non-technical users — the constraint wasn\'t technically interesting, it was just true.',
    ],
    why: "This is the clearest version of a principle that runs through all my work: **the gap usually isn't knowledge, it's visibility.** People aren't missing information they could go get — they can't see the problem at all. Build the window, and the rest largely takes care of itself. It also blurs a line I don't think is real: a course recommender and a broken-events detector are the same kind of tool — something that helps a person understand their own system better.",
    highlights: [
      'Skepticism as a design instinct — the dashboard says fine, so go look',
      'Built around the human using it, not the interesting technical problem',
      'Education as infrastructure, even when nobody calls it education',
    ],
  },
  {
    id: 'csm-retention',
    num: '04',
    title: 'CSM Analytics Retention',
    short: 'Persistent analytics history that makes year-over-year customer conversations possible.',
    meta: 'data pipeline · internal tool',
    year: '2025',
    role: 'Concept, build, validation',
    type: 'Data pipeline / internal tool',
    tools: 'Google Sheets, Apps Script',
    tags: ['Data pipeline', 'Validation', 'Internal tool'],
    art: 'bars',
    problem:
      "Algolia's analytics retention window is short. That makes year-over-year comparison — the backbone of a serious quarterly business review — effectively impossible. The data simply isn't there anymore when you need it.",
    did: [
      'Built a persistence layer that captures and stores analytics over time, including a full 364-day backfill for a pilot customer. Google Sheets and Apps Script as the surface, because the tool needed to live where its non-technical users already were.',
      'Then I validated it aggressively against an existing QBR deck rather than trusting the pipeline. Nearly every bug I caught came from that check: a data-destruction bug from over-wide lookback windows, a row-capacity wall, stale headers, a no-click rate with the wrong denominator, an AOV using search-attributed purchase counts instead of actual transactions.',
      'When a colleague turned out to have an architecturally better version of the same tool, I stopped developing mine and contributed my denominator fixes to theirs.',
    ],
    why: 'Numbers that are wrong and confident are worse than no numbers. Validating against reality — not against whether the code ran — is the whole job when the output is going in front of a customer.',
    highlights: [
      'Rigorous validation against ground truth',
      'Meeting users where they already work',
      'Knowing when to kill your own work',
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
  heading: "Let's talk about making your product teachable",
  body: "I'm interested in work where customer education is treated as a product problem — where the goal is customer capability, not content volume, and where there's room to build the system, not just fill it.",
};
