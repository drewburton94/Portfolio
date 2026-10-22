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
  resume: '/assets/Drew-Burton-Resume-Designed.pdf', // the Download resume buttons (the designed version)
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
    cover: '/assets/projects/cover-ai-tools.png',
    heroArt: 'cover', // card and header use the cover picture; screenshots sit beside each paragraph
    layout: 'staggered',
    problem: '',
    did: [
      "**Search health dashboard.** Customer success managers had no single place to see how all their customers were doing. They had to check one account at a time across several tools. This puts every customer in one view and flags which ones need attention first.",
      "**Journey check and health check skills.** Two AI skills that take on the first pass of a review. One walks through a customer's site like a shopper and checks that tracking works. The other scores an implementation against our checklist. People still make the call, but they start from a draft instead of a blank page.",
      "**Implementation skills library.** More and more customers build with AI coding assistants, and those assistants skip the things that make an implementation succeed. This open-source library teaches them those things, so customers start from a better place.",
      "**Global CS Library.** Good work was getting lost in downloads and chat threads. This is one shared place where the customer success team can find and reuse each other's skills and artifacts.",
      "Most of it is in pilot. Some is still being tested.",
    ],
    why: "I build a tool when people keep doing the same manual work, or hopping between places to find one answer. I start small, put a rough version in front of a few people, and let their feedback shape it. The goal is to automate the repetitive first pass and leave the judgment to people.",
    media: [
      { type: 'image', src: '/assets/projects/1-search-health-dashboard.png', alt: 'Screenshot of the search health dashboard.', caption: 'Four customers flagged, eleven indices quietly fine. A CSM sees where to look first.' },
      { type: 'image', src: '/assets/projects/2-health-check-skill.png', alt: 'Screenshot of the health check skill.', caption: 'A first-pass review with scores, evidence, and what still needs a human.' },
      { type: 'image', src: '/assets/projects/3-implementation-skills-library.png', alt: 'Screenshot of the implementation skills library.', caption: 'Pick where you are, drop it into your AI tool, ask.' },
      { type: 'image', src: '/assets/projects/4-global-cs-library.png', alt: 'Screenshot of the Global CS Library.', caption: 'Skills and artifacts built by and for Customer Success.' },
    ],
  },
  {
    id: 'academy',
    title: 'AI-Native LMS',
    short: 'A learning platform where you can ask for what you need, and where we learn what customers care about.',
    meta: 'learning platform · rebuild',
    type: 'AI-native learning platform',
    tools: 'Claude Design, Claude Code, Supabase, GitHub, Vercel',
    tags: ['Learning platform', 'AI search', 'Customer intelligence'],
    art: 'grid',
    problem: "People don't arrive wanting a course. Sometimes they want a quick overview. Sometimes the how-to. Sometimes practice, or just the video. Most learning platforms give all of them the same catalog and the same path, then hope they find the right thing.",
    did: [
      "**Built around search.** People type what they're trying to do and get courses, videos and docs together. An AI mode answers from course content, transcripts and docs, then suggests what to learn next. If someone just wants a video, they don't have to open a course, and transcripts jump to the right moment.",
      "**An AI tutor in every course.** Stuck on a lesson? Ask. The tutor answers from the course content, the documentation and best practices, so no one has to leave to go find help.",
      "**Four intents, not one path.** Each topic can be an overview, a how-to, practice, or the full experience, so people get the depth they came for. At sign-up, role and goals shape where to start, and they can always look outside it.",
      "**Practice that proves it.** Certifications are designed around hands-on scenarios, like a fake storefront or a broken setup, instead of a quiz at the end. If you already know it, you can test straight in.",
      "**A customer intelligence platform on the inside.** Because we own the platform, we can see what customers search, what they finish and where they go next, not just whether a course was opened. The goal is to give CSMs a view of what their accounts are curious about, so the next conversation starts from something real. I also specced a connected-apps feature, where a customer links their own app and the platform suggests features they haven't used yet.",
      "I designed it and built the front-end prototype. A colleague built the backend and course infrastructure, and I wrote down what each screen is for so the intent survived the handoff. It's in internal testing now, with a limited pilot next. Early feedback says some navigation is too hidden and results can feel overwhelming, and I'm working on both.",
    ],
    why: "People learn differently now. They ask a question, expect an answer, and want to get back to work. AI isn't bolted on here. Search, the tutor and the recommendations are the platform, and they point to the next step. Every search also tells us what someone cares about, which makes education a way to understand customers, not only teach them.",
    // The card shows the cover picture. The case study opens with the home-search GIF.
    cover: '/assets/projects/cover-ai-native-lms.png',
    media: [
      { type: 'image', src: '/assets/projects/1-lms-home-search.gif', alt: 'The platform home page, with a search box asking what you want to learn and floating suggested topics.', caption: 'Ask what you want to learn, in your own words.' },
      { type: 'image', src: '/assets/projects/2-lms-home-search.webp', alt: 'The platform home page, focused on search: a large search box with AI Mode, a list or live tiles toggle, and floating suggested topics.', caption: 'Search comes first, with AI Mode a click away.' },
      { type: 'image', src: '/assets/projects/3-lms-content-catalog.png', alt: 'The content catalog with product and topic filters and course cards.', caption: 'Or browse by topic, level and product.' },
    ],
  },
  {
    id: 'executive-path',
    title: 'Executive Learning Path',
    short: 'Learning for the people who approve the investment, not the people who implement it.',
    meta: 'learning path · executive audience',
    type: 'Learning path',
    tools: '',
    tags: ['Learning path', 'Executive audience', 'Enablement'],
    art: 'grid',
    problem: "Customer education usually teaches the people who use the product. But someone else decides whether to keep investing in it, and sets the priorities around it. Academy had nothing for those leaders, and Sales and CS had no easy resource to share with them.",
    did: [
      "**Start with the audience.** Executives don't need to know how to configure the product. They need to know what it enables, why it matters, and how it supports their priorities. So I built five short courses: what it is, why people choose it, what it's worth, where AI is taking it, and how to turn strategy into results.",
      "**Built to be shared.** Each course stands alone, so a CSM, an account exec or a customer champion can send one at the right moment. It teaches real capabilities and ties them to business outcomes. It's not a sales deck.",
      "It's useful from early evaluation through expansion and planning, and it's live now.",
    ],
    why: "The goal wasn't more content. It was the right content for an audience we weren't supporting. Adoption depends on more than the people clicking around in the product. The leaders who fund it need to understand it too, and education can help create that alignment.",
    media: [
      { type: 'image', src: '/assets/projects/1-executive-learning-path.png', alt: 'The five Executive Learning Path courses in order: What Is Algolia, Why Algolia, The Business Value of Search and Discovery, The Future of AI Search and Discovery, and Turning Strategy into Results.', caption: 'Five short courses. Take one or all five.' },
      { type: 'youtube', id: '_piTxcT-x5w', title: 'Executive Learning Path video', caption: '' },
    ],
  },
  {
    id: 'courses',
    title: 'Courses',
    short: 'A sampling of courses, built across many authoring tools and learning platforms.',
    meta: 'course design · interactive learning',
    type: 'Course design',
    tools: 'Articulate Rise, Articulate Storyline, Lectora, Adobe Captivate, WorkRamp, Bridge LMS, SAP SuccessFactors',
    tags: ['Course authoring', 'Learning platforms', 'Interactive learning'],
    art: 'grid',
    cover: '/assets/projects/cover-courses.png',
    heroArt: 'cover',
    problem: '',
    did: [
      "**Course authoring tools.** I've built courses in Articulate Rise, Articulate Storyline, Lectora and Adobe Captivate.",
      "**Learning platforms.** I've worked in WorkRamp, Bridge LMS and SAP SuccessFactors.",
      "**Dynamic Facets: Configuration.** A feature course that moves from an overview, to how it works, to hands-on practice, with realistic scenarios and feedback. You can click through it below.",
      "**A/B Testing learning path.** Four parts: why A/B testing matters, designing a strong experiment, launching and monitoring a test, and interpreting and optimizing the results.",
      "**Self-serve onboarding.** With a teammate, I rebuilt a seven-step customer learning path around the real stages of an implementation: planning, designing the UI, data and integrations, capturing events, front-end work, establishing relevance, and going live.",
      "**Executive learning path.** Five short courses for customer executives, each one able to stand on its own: what Algolia is, why people choose it, the business value of search and discovery, where AI search is going, and turning strategy into results.",
      "**Courses alongside product releases.** As part of the Customer Education team, I've built courses timed with launches, including Data Transformations, Crawler, Dynamic Re-Ranking, Advanced Personalization, Multi-Signal Ranking, Smart Groups, Recommend, Federated Search and NeuralSearch.",
      "**Certifications.** Hands-on certifications built around real scenarios and simulations, so people prove they can do the work instead of recalling facts.",
    ],
    why: "Having worked across this many tools means I can pick the one that fits the course, instead of fitting the course to the tool.",
    media: [],
    // Interactive preview shown under "Try it". The file lives in public/embeds/course-preview/.
    embed: {
      file: '/embeds/course-preview/index.html',
      title: 'Dynamic Facets: Configuration',
      intro: 'Click through a course I built, the way a learner would.',
      height: '820',
    },
  },
  {
    id: 'videos',
    title: 'Videos',
    short: 'Making complex ideas easier to understand through storytelling, visuals, and motion.',
    meta: 'video · motion design',
    type: 'Video and motion design',
    tools: 'After Effects, Premiere Pro, Illustrator',
    tags: ['Video production', 'Motion design', 'Visual storytelling'],
    art: 'grid',
    cover: '/assets/projects/cover-videos.png',
    heroArt: 'cover',
    problem: '',
    did: [
      "**One person, start to finish.** I write the script, design the visuals, edit the video and animate it. Because one person owns every step, the story, the look and the pacing fit together.",
      "**Script.** It starts with what someone should take away. I write the script first, and the voiceover sets the timing for everything that follows.",
      "**Design.** I design the visuals myself, from type and color to the layout of every scene, built from reusable pieces so the whole video holds together.",
      "**Edit.** I cut and assemble the video in Premiere Pro, with the visuals landing on the spoken word.",
      "**Animate.** I build the motion in After Effects so transitions guide attention and each scene makes one point.",
      "**Systems that scale.** Type, color, composition and pacing come from one reusable system, so a vertical cut comes from the same source. I also adapted an open-source tool that connects Claude Code to After Effects, and a scene that took about eight hours to animate by hand can now be automated.",
    ],
    why: "When one person owns the whole process, nothing gets lost between the idea and the finished video, and the result feels like one piece instead of parts handed from person to person.",
    // Captions are blank on purpose until Drew supplies them.
    media: [
      { type: 'youtube', id: '_piTxcT-x5w', title: '', caption: '' },
      { type: 'youtube', id: 'dli4ekL_GbQ', title: '', caption: '' },
      { type: 'youtube', id: 'nnf6iR9UkH0', title: '', caption: '' },
      { type: 'youtube', id: 'Vr2DAbjPzHw', title: '', caption: '' },
    ],
  },
];

export const workIntro =
  "Four projects, one throughline: someone is operating without information they need, and doesn't know it. Every project closes one of those gaps.";

export const history = [
  {
    when: '2024 - Present',
    role: 'Senior Instructional Designer',
    org: 'Algolia',
    body: [
      'Led customer education strategy and the design of courses and content across Academy, from onboarding to certification.',
      'Rebuilt Academy around interactive, applied learning and launched technical paths and certifications that drove record engagement. In a single year, engagement beat the previous four years combined.',
      "Analyzed Academy activity against renewals and shared the findings with Customer Success. Accounts where someone took a course in the past year renewed at 91%, versus 79% for those that didn't. Now being integrated into health signals.",
      'Built AI tools for Customer Success and customers: a dashboard that flags broken implementations, first-pass review skills, and an open-source skills library for coding agents.',
      'Built an AI-native learning platform with search, an in-course AI tutor and intent-based paths. In internal testing.',
    ].join('\n'),
  },
  {
    when: '2021 - 2024',
    role: 'Instructional Designer',
    org: 'Talkdesk',
    body: [
      'Helped build the education function as the company scaled, setting standards for how learning is designed and delivered.',
      'Owned global onboarding and manager resources.',
      'Partnered with HR, leadership, and Sales Enablement on leadership development and sales skills.',
    ].join('\n'),
  },
  {
    when: '2018 - 2021',
    role: 'Instructional Designer',
    org: 'Kelly Services',
    body: [
      'Built training for a process automation rollout, enabling adoption for 2,000+ global operators.',
      'Designed interactive e-learning and assessments tied to operational goals.',
    ].join('\n'),
  },
  {
    when: '2016 - 2017',
    role: 'Administrative Co-op',
    org: 'Dow Chemical',
    body: 'Led a data archival project covering 2,000+ confidential records in a regulated environment.',
  },
  {
    when: '2015 - 2016',
    role: 'eLearning Developer',
    org: 'Delta College Corporate Services',
    body: 'Developed e-learning modules and refined training content.',
  },
];

export const contact = {
  heading: 'Imagine what we could create together.',
  body: "I'm always excited to meet people who care about making things better. If that sounds like your team, I'd love to talk.",
};
