// Projects taken off the site. Not used anywhere; kept so the text isn't lost.
// To bring one back, paste it into the `projects` list in defaults.mjs.
export const archivedProjects = [
  {
    id: 'events-health',
    title: 'Events Health Detector',
    short: 'A monitoring tool that catches broken customer implementations before anyone notices.',
    meta: 'diagnostic tool',
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
    title: 'CSM Analytics Retention',
    short: 'Persistent analytics history that makes year-over-year customer conversations possible.',
    meta: 'data pipeline · internal tool',
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
