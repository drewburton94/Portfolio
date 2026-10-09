# Everything the site assistant knows about Drew Burton

This file is the assistant's only source of truth. Edit it freely: add facts, fix wording,
delete anything you don't want it to say. Redeploy to update the assistant.

---

## Part 1: Portfolio copy (public site content)

# Drew — Portfolio Site Copy


**Site structure:**
1. Home
2. Work (index + 4 case studies)
3. Approach
4. About
5. Experience
6. Contact

---

# 1. Home

## Hero

**Tagline:**
> Designing learning experiences for adoption, not just consumption.

**Sub-line (one of these):**
- There's a lot of bad training out there. For 12+ years I've been building the alternative.
- I design and build the systems that help customers actually use the product — courses, tools, assistants, and everything in between.
- Learning experience design at the seam between customer education, product, and customer success.
- I find where people are operating without the information they need, and I build the thing that fixes it.

**CTA buttons:**
- `See the work` → /work
- `About me` → /about

---

## Intro block (below hero)

I'm a learning experience designer who builds. My background is in graphic design, which means I lead with clarity, craft, and how something feels to use. But I don't stop at the mock — I ship working software, using AI tooling to close the gap between design intent and deployed product.

Most of what I build starts as an education problem and turns into something else: a diagnostic tool, a dashboard, an assistant, a 3D simulation, an admin platform. The format is whatever the problem needs. The goal is always the same — make the product make sense, and make it easier to use well.

---

## "What I do" — three-column block

**Design the experience**
I start with the person, not the format. What do they need to understand? What's in their way? What would make this obvious? The answer isn't always a course.

**Build the thing**
I prototype aggressively and ship real software. A working version exposes what's unclear far faster than a spec does — and a prototype that feels real gets built.

**Connect it to outcomes**
Learning doesn't live in its own reporting system. I connect education to adoption, implementation quality, and customer health so it's clear where it's helping and where to intervene earlier.

---

## Featured work strip

Short teasers linking to full case studies.

**Algolia Academy LMS** — Rethinking the LMS as a customer learning layer, not a course repository.

**World of Search** — An interactive 3D experience that takes you backstage into how search actually works.

**Events Health Detector** — A monitoring tool that catches broken customer implementations before anyone notices.

**CSM Analytics Retention** — Persistent analytics history that makes year-over-year customer conversations possible.

---

# 2. Work — index page

## Page intro

Four projects, one throughline: someone is operating without information they need, and doesn't know it. A learner who doesn't know which course fits their setup. A team that can't see last year's numbers. A customer whose data has been quietly broken for months behind a green checkmark. A developer who's used search a thousand times without ever seeing inside it.

Every project closes one of those gaps.

---

## Case Study 1: Algolia Academy LMS

**Role:** Design lead, front-end build, product direction
**Type:** Learning platform redesign + extension
**Tools:** Claude Design, Claude Code, Supabase, GitHub, Vercel

### The problem

An LMS is usually treated as a place to store courses. Customers arrive, browse a library, pick something that looks close to their situation, and hope it applies. Nothing in the system knows anything true about them — their role, their implementation, what they've already configured, or where they're actually stuck.

### What I did

I redesigned an existing shell into a [~31-page] production-ready admin UI built against sample data, then packaged the entire thing as a [45-file] handoff for the engineer who owns the schema, auth, and repo.

The handoff led with an intent document rather than a requirements list. Every screen got a structured block: **its job, what it argues, and what would count as failure.** Most specs describe what a screen contains. This one described what it was supposed to do to the person looking at it.

I also specced a connected-apps feature: customers authenticate their own Algolia application so Academy can read their real configuration, analytics, and usage — and recommend based on their actual system rather than their self-reported level.

### Why it matters

The LMS stops being a content library and becomes a learning layer: content, paths, practice, recommendations, certification, learning history, and product signals in one place. Education personalized by what's actually true about the customer.

### What I'd highlight

- Design as specification, not decoration — the mock *was* the spec
- Intent-first documentation that survived handoff
- A proposal that reframes what a learning platform is for

---

## Case Study 2: World of Search

**Role:** Concept, design, build
**Type:** Interactive 3D learning experience

### The problem

Search is one of those systems people use constantly and understand vaguely. You can read a description of tokenization or an inverted index and still have no working mental model of what happens between typing a query and seeing results.

### What I did

Built an interactive 3D experience that starts somewhere familiar — a mock storefront called Aurora Audio — and then warp-tunnels backstage into the machinery. Tokenization, inverted index lookup, ranking. Abstract concepts made spatial and walkable.

Brand tokens and narration rules live in a persistent context file so the voice and visual language stay coherent across the whole experience.

### Why it matters

The bet is that people learn how a system works by moving through its structure, not by reading a description of it. Start where the learner already is — the surface they recognize — then tunnel inward.

### What I'd highlight

- Understanding as spatial, not textual
- Familiar surface first, mechanism second
- Learning that doesn't look like learning

---

## Case Study 3: Events Health Detector

**Role:** Concept, design, build
**Type:** Internal diagnostic / monitoring tool

### The problem

A dashboard reports that all events are healthy. Meanwhile add-to-cart, purchase, and conversion rates sit near zero. Manual debugging shows missing `queryID`s and `userToken`s — the implementation has been quietly broken for months, and the green checkmark says otherwise.

Nobody catches it, because catching it requires technical debugging that the people closest to the customer aren't always equipped to do, across [10–15] accounts each.

### What I did

Built a scheduled tool that flags customers whose event tracking is silently broken. Credentials get entered once; the tool does the watching. Designed specifically for non-technical users — the constraint wasn't technically interesting, it was just true.

### Why it matters

This is the clearest version of a principle that runs through all my work: **the gap usually isn't knowledge, it's visibility.** People aren't missing information they could go get — they can't see the problem at all. Build the window, and the rest largely takes care of itself.

It also blurs a line I don't think is real. A course recommender and a broken-events detector are the same kind of tool: something that helps a person understand their own system better.

### What I'd highlight

- Skepticism as a design instinct — the dashboard says fine, so go look
- Built around the human using it, not the interesting technical problem
- Education as infrastructure, even when nobody calls it education

---

## Case Study 4: CSM Analytics Retention Tool

**Role:** Concept, build, validation
**Type:** Data pipeline / internal tool

### The problem

Algolia's analytics retention window is short. That makes year-over-year comparison — the backbone of a serious quarterly business review — effectively impossible. The data simply isn't there anymore when you need it.

### What I did

Built a persistence layer that captures and stores analytics over time, including a full [364-day] backfill for a pilot customer. Google Sheets and Apps Script as the surface, because the tool needed to live where its non-technical users already were.

Then I validated it aggressively against an existing QBR deck rather than trusting the pipeline. Nearly every bug I caught came from that check: a data-destruction bug from over-wide lookback windows, a row-capacity wall, stale headers, a no-click rate with the wrong denominator, an AOV using search-attributed purchase counts instead of actual transactions.

When a colleague turned out to have an architecturally better version of the same tool, I stopped developing mine and contributed my denominator fixes to theirs.

### Why it matters

Numbers that are wrong and confident are worse than no numbers. Validating against reality — not against whether the code ran — is the whole job when the output is going in front of a customer.

### What I'd highlight

- Rigorous validation against ground truth
- Meeting users where they already work
- Knowing when to kill your own work

---

# 3. Approach

## Page intro

A few things I keep coming back to.

---

### Start with the problem, not the format

I don't assume the answer is a course, a video, an article, or an LMS page. I start with what someone needs to understand or accomplish and work backward into the right experience. Sometimes that's traditional content. Often it's an assistant, a guided workflow, a diagnostic, a simulation, or a short explanation surfaced at the exact moment it matters.

### Learning should meet people at the moment of need

Traditional education asks people to leave their work, go somewhere else, complete something, and come back. I'm more interested in learning that appears inside the workflow — during troubleshooting, at adoption moments, when someone is about to make a consequential decision. The best learning experience doesn't always look like learning.

### Adapt to intent

Not everyone needs the same depth. Some people want a conceptual explanation. Some want a walkthrough. Some want a sandbox. Some just want the answer. A good system recognizes those different intents instead of routing everyone through the same sequence.

### Prototype to make the case

I'd rather build a rough working version and react to it than debate an abstract concept. The prototype exposes what's unclear, and a tangible artifact creates cross-functional pull in a way a proposal doesn't. Craft is part of that argument — a handoff that's complete and beautiful gets built.

### Think in systems

A course isn't just a course. Where is it discovered? Why would someone choose it? What comes after? Can we tell if they applied it? Does that behavior correlate with adoption or renewal? That's why I'm usually drawn toward platforms and infrastructure rather than isolated assets.

### AI changes what this can be

Not primarily as a faster way to make content. The bigger opportunity is redesigning the experience itself — conversational, adaptive, context-aware, diagnostic, embedded in the workflow. It also expands who education serves: customers, internal teams, developers, executives, and increasingly the AI agents acting on their behalf.

### Connect learning to outcomes

Education shouldn't live in an isolated reporting system. I want to understand how it relates to adoption, implementation maturity, time to value, support demand, and renewal — not to claim education caused everything, but to find where it's helping and where it should intervene earlier.

---

## Principles (short-form list block)

1. Start with the user's problem, not the content format.
2. Make learning useful at the moment someone needs it.
3. Reduce friction wherever possible.
4. Give people the depth they need, not the depth the system wants to deliver.
5. Favor practice and real decisions over passive consumption.
6. Treat learning experiences like products.
7. Use AI to redesign the experience, not just produce content faster.
8. Build prototypes early and learn from them.
9. Let customer education extend beyond the LMS.
10. Build systems that help both customers and the people supporting them.

---

# 4. About

## Short version (for the top of the page)

I'm Drew — a learning experience designer and builder working at the seam between customer education, product, and customer success. 12+ years in, across enterprise software, staffing, manufacturing, and higher ed. Graphic design background. Not a developer by training — but shipping real, deployed software anyway, using AI tooling as the bridge between design intent and working code.

---

## Longer version

There's a lot of bad training out there. That's most of what got me here.

12+ years across customer education, internal enablement, and e-learning development — Algolia, Talkdesk, Kelly Services, Dow Chemical, Delta College — and the through-line has been the same the whole time: make learning clear, useful, and human. Early on that meant building modules and assessments. It increasingly means building systems, tools, and product experiences.

My role sits in customer education, but the way I approach it is broader than instructional design. I rarely think only in terms of courses or content. I think about the full system around learning: what the customer is actually trying to do, what would help them move forward fastest, what information should appear at the moment they need it, and how any of it connects to whether they successfully adopt the product.

A lot of my work starts as an education problem and turns into a product, a workflow, an assistant, a dashboard, or an internal tool.

I came to this from graphic design, which shows up in how I work more than in what I make. I shape things visually first, until the intent is unmistakable, and then build or hand off. The design isn't decoration in that process — it's the specification. I care a lot about naming, hierarchy, button labels, and whether an interface exposes complexity that should have stayed hidden. Those details usually reveal whether the underlying idea is sound.

I move between "what should customer education become?" and "what exact word goes on this button?" pretty constantly, and I don't experience those as different activities.

---

## Personality block (optional, adds warmth)

**Visual thinker.** Show me the diagram, the mock, the example. I'd rather look at the thing than read about the thing.

**Skeptical of green checkmarks.** The dashboard says fine, the data says otherwise, so go look. That instinct has caught more bugs than any process I've followed.

**Comfortable outside my lane.** Not a developer, shipping software. Not an engineer, writing instrumentation specs. "I don't have that background" reads to me as a logistics problem, not a stop sign.

**Restless with inherited models.** Why does this need to be a course? Why does it live in an LMS? Why is certification multiple choice? Why do we call it *enrollment*? Most of my projects started as one of those questions.

**Ambitious in scope, disciplined in delivery.** Big surface area, but it lands in shippable packages rather than sprawl.

---

## Toolkit (light touch — keep it brief)

**Design & build:** Claude Design, Claude Code, Adobe Creative Cloud, Figma
**Learning:** LMS administration, Articulate, Captivate, video production
**Data & infrastructure:** Learning analytics and reporting, Supabase, GitHub, Vercel, Google Sheets + Apps Script

---

# 5. Experience

*A condensed version of the résumé — enough for someone to place you without leaving the site. Link a PDF download at the bottom.*

## Current

**Instructional Designer — Algolia** · 2024–Present
Own customer education across onboarding, product training, and technical learning for both high-touch and self-serve segments. Redesigned Algolia Academy around interactive and applied experiences — demos, scenarios, guided practice, and personalized chat-based learning. Built and scaled technical learning paths and certifications that drove record engagement, exceeding the previous four years combined in a single year. Improved learning measurement by prioritizing meaningful signals and delivering automated reports that helped Customer Success connect learning to adoption.

## Previously

**Instructional Designer — Talkdesk** · 2020–2024
Helped build and shape the education function as the company scaled, defining standards for how learning was designed, delivered, and used. Owned internal onboarding for a global workforce and manager-facing resources that set clear expectations. Partnered with HR, leadership, and Sales Enablement on leadership development, manager effectiveness, and core sales enablement.

**Instructional Designer — Kelly Services** · 2018–2020
Designed interactive e-learning and assessments tied to operational goals. Built the training behind a large-scale process automation rollout, enabling adoption for 2,000+ global operators. Translated complex processes into clear, usable learning alongside stakeholders and SMEs.

**Administrative Co-op — Dow Chemical** · 2016–2017
Led a data archival project covering 2,000+ confidential records in a highly regulated environment — timelines, documentation, stakeholder communication, and quality checks. Built tracking systems to manage competing priorities and keep the project on schedule.

**eLearning Developer — Delta College Corporate Services** · 2015–2016
Developed e-learning modules and supported evaluation and refinement of training content for clarity and effectiveness.

## Focus areas

Customer & product education · Learning program strategy and ownership · Enablement and performance improvement · Learning analytics and measurement · Applied AI in learning design and personalization · Cross-functional collaboration · Project management

`Download résumé (PDF)` → [link]

---

# 6. Contact

## Heading options

- Let's talk.
- Get in touch.
- Working on something like this?

## Body

I'm interested in work where customer education is treated as a product problem — where the goal is customer capability, not content volume, and where there's room to build the system, not just fill it.

If that's the kind of thing your team is thinking about, I'd like to hear from you.

**Email:** Burton.Andrew@icloud.com
**LinkedIn:** linkedin.com/in/DrewSBurton
**GitHub:** [link]

---

# Reusable snippets

## Meta description
Drew Burton — learning experience designer and builder. I design and ship the systems that help customers actually adopt and use the product.

## LinkedIn headline
Customer Education @ Algolia · Designing learning experiences for adoption, not just consumption

## Resume summary (revised)
There's a lot of bad training out there. For 12+ years I've built education programs with one goal: make learning clear, useful, and human. I design learning experiences for adoption, not just consumption — connecting education to product enablement, implementation quality, and retention. Increasingly that means building the systems themselves: learning platforms, diagnostic tools, and interactive experiences that help customers become confident, capable product champions.

## One-liner (for bios, intros, speaker cards)
Drew designs learning experiences for adoption, not just consumption — and usually ends up building them too.

## Proof points worth surfacing
- 12+ years across customer education, enablement, and e-learning development
- Drove record Academy engagement — exceeding the previous four years combined in one year
- Enabled a process automation rollout for 2,000+ global operators (Kelly Services)
- Redesigned Algolia Academy around interactive, applied, and personalized experiences


---

## Part 2: How Drew works (extra background)

## How I work

**Design-led, then hand off.** The pattern is consistent: shape the thing visually first, get it to the point where the intent is unmistakable, then hand implementation to engineering collaborators or to Claude Code. On the Academy LMS I redesigned an existing shell into a ~31-page production-ready admin UI against sample data — then packaged the whole thing as a 45-file handoff for the coworker who owns the schema, auth, and repo. Design isn't decoration in this workflow; it's the specification.

**Intent documents over requirement lists.** The LMS handoff led with a `00-intent.md` using structured "job / what it argues / failed if" blocks for every screen. That's a distinctive move. Most specs describe what a screen contains. Mine describe what it's supposed to *do to the person looking at it*, and what would count as failure. That framing shows up again in the World of Search work, where a `CLAUDE.md` holds brand tokens and narration rules as persistent context.

**Iterative, one decision at a time.** I don't specify everything upfront and then build. I clarify as I go, resolving the next open question rather than pre-resolving all of them. This means my projects tend to accumulate structure rather than start with it.

**Validate against reality, aggressively.** The CSM analytics tool is the clearest case. Nearly every bug I caught came from checking output against an existing QBR deck rather than trusting the pipeline: a data-destruction bug from over-wide lookback windows, a Sheets row-capacity wall, stale headers, a no-click rate with the wrong denominator, an AOV using search-attributed purchase counts instead of actual transactions. I don't assume my numbers are right because the code ran.

**Willing to kill my own work.** When a colleague turned out to have an architecturally better version of the same analytics tool, the reasonable move was to stop developing mine and contribute my denominator fixes to theirs. Sunk cost doesn't seem to have much grip on me.

**Tooling stack.** Claude Design for visual work → Claude Code (Plan mode) for maintained repo work → handoff via intent docs and zip packages. Supabase, GitHub, Vercel for hosting; Artifacts for quick prototypes; Google Sheets + Apps Script when the users are non-technical and the tool needs to live where they already are. Remote control (`/rc`) for mobile notifications mid-task, because I'd rather not sit and watch a build.

---

## What I build

A pattern worth naming: **I build for the person who isn't technical enough to help themselves, and I build the thing that makes the invisible visible.**

- **Algolia Academy LMS** — admin UI redesign and extension, with an instrumentation spec and a proposed connected-apps feature where customers authenticate their own Algolia apps so Academy can read their real configuration, analytics, and usage and recommend courses accordingly. Education personalized by the learner's actual system, not their self-reported level.
- **World of Search** — an interactive 3D learning experience. A mock storefront ("Aurora Audio") that warp-tunnels backstage into the machinery: tokenization, inverted index lookup, ranking. Abstract concepts made spatial and walkable.
- **CSM Analytics Retention Tool** — a persistence layer to work around Algolia's short analytics retention window so CSMs can actually do year-over-year QBR comparisons. Full 364-day backfill for a pilot customer.
- **Health Issue Detector / Events Health** — a scheduled tool that flags customers whose event tracking is quietly broken. Born from a real frustration: the dashboard reports all events healthy while add-to-cart, purchase, and conversion rates sit near zero, and manual debugging shows missing queryIDs and userTokens. Built for CSMs who aren't very technical and own 10–15 accounts each, so credentials get entered once and the tool does the watching.

The common thread across all four: **someone is operating without the information they need, and doesn't know it.** A learner who doesn't know which course fits their setup. A CSM who can't see last year's numbers. A CSM whose customer's data has been broken for months while a green checkmark says otherwise. A developer who's used search without ever seeing what happens inside it. Every project closes one of those gaps.

---

## Personality (as it reads from the work)

- **Visual thinker, low tolerance for prose.** Show me the diagram, the mock, the example. I'd rather look at the thing than read about the thing.
- **Practitioner-empathetic.** Constraints in my projects are almost always about the human using the tool — not technically interesting, just true. "Some CSMs aren't very technical." "Many own 10–15 accounts." "Enter credentials once." That's the voice of someone who's watched people struggle and took it personally.
- **Skeptical of green checkmarks.** A recurring instinct: the dashboard says fine, the data says otherwise, so go look. This is the same reflex as validating the analytics tool against a QBR deck.
- **Comfortable outside my lane.** Not a developer, shipping software. Not an engineer, writing instrumentation specs. I treat "I don't have that background" as a logistics problem rather than a stop sign.
- **Ambitious in scope, disciplined in delivery.** 31 pages, 45-file handoffs, 364-day backfills, warp-tunnel cutscenes. But the ambition lands in shippable packages rather than sprawl.

---



---

## Part 3: Quick facts

- 15+ years in design.
- 12+ years in learning and development.
- Endless curiosity about what's possible.
