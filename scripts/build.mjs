// Static site generator: `node scripts/build.mjs` writes index.html and work/*.html.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, hero, about, projects, workIntro, history, contact } from './content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const handSvg = readFileSync(join(root, 'assets/img/hand.inc.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// *italic-ish highlight* -> lime mark, **bold**, `code`
const rich = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="hl">$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

// ---- abstract placeholder art (swap for real screenshots later) ----------
const art = {
  grid: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-opacity=".5">${[...Array(9)].map((_, i) => `<path d="M0 ${i * 62.5}H800"/>`).join('')}${[...Array(14)].map((_, i) => `<path d="M${i * 61.5} 0V500"/>`).join('')}</g>
    <rect x="110" y="90" width="250" height="150" rx="14" fill="#07080a" stroke="currentColor"/>
    <rect x="390" y="90" width="300" height="70" rx="14" fill="#b6ff3d"/>
    <rect x="390" y="180" width="140" height="150" rx="14" fill="#07080a" stroke="currentColor"/>
    <rect x="550" y="180" width="140" height="150" rx="14" fill="#07080a" stroke="currentColor"/>
    <rect x="110" y="270" width="250" height="140" rx="14" fill="#07080a" stroke="currentColor"/>
    <g fill="currentColor" fill-opacity=".7"><rect x="130" y="112" width="120" height="8" rx="4"/><rect x="130" y="132" width="180" height="8" rx="4"/><rect x="130" y="292" width="150" height="8" rx="4"/></g>
  </svg>`,
  tunnel: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="currentColor">${[...Array(12)].map((_, i) => { const k = 1 - i / 12; const w = 760 * k * k + 30, h = 460 * k * k + 20; return `<rect x="${400 - w / 2}" y="${250 - h / 2}" width="${w}" height="${h}" rx="${10 + 20 * k}" stroke-opacity="${0.25 + 0.6 * (1 - k)}" ${i === 11 ? 'stroke="#b6ff3d" stroke-opacity="1"' : ''}/>`; }).join('')}</g>
    <g stroke="currentColor" stroke-opacity=".35">${[[0, 0, 340, 200], [800, 0, 460, 200], [0, 500, 340, 300], [800, 500, 460, 300]].map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}"/>`).join('')}</g>
    <circle cx="400" cy="250" r="9" fill="#b6ff3d"/>
  </svg>`,
  pulse: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-opacity=".3">${[...Array(7)].map((_, i) => `<path d="M0 ${70 + i * 60}H800"/>`).join('')}</g>
    <path d="M0 270H190L225 270 255 160 300 380 340 270H470L500 270 520 235 550 305 575 270H800" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M575 270H800" stroke="#b6ff3d" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>
    <circle cx="575" cy="270" r="9" fill="#b6ff3d"/><circle cx="575" cy="270" r="22" fill="none" stroke="#b6ff3d" stroke-opacity=".6"/>
  </svg>`,
  bars: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-opacity=".3">${[...Array(6)].map((_, i) => `<path d="M60 ${90 + i * 65}H740"/>`).join('')}</g>
    ${[...Array(12)].map((_, i) => { const a = [90, 130, 110, 170, 150, 210, 190, 240, 200, 260, 230, 290][i]; const x = 80 + i * 55; return `<rect x="${x}" y="${415 - a}" width="22" height="${a}" rx="4" fill="currentColor" fill-opacity=".55"/><rect x="${x + 25}" y="${415 - a * 1.22}" width="22" height="${a * 1.22}" rx="4" fill="${i > 5 ? '#b6ff3d' : 'currentColor'}" ${i > 5 ? '' : 'fill-opacity=".9"'}/>`; }).join('')}
  </svg>`,
};

// ---- shared chrome -------------------------------------------------------
const head = (title, desc, depth, extra = '') => {
  const p = depth ? '../' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#07080a">
<script>document.documentElement.classList.add('js')</script>
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="${p}assets/img/drew-head.webp" type="image/webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/css/site.css">
${extra}
</head>`;
};

const chrome = (depth, active) => {
  const p = depth ? '../' : '';
  const home = depth ? '../index.html' : '';
  const nav = [
    ['Home', `${home}#top`, 'top'],
    ['About', `${home}#about`, 'about'],
    ['Work', `${home}#work`, 'work'],
    ['Contact', `${home}#contact`, 'contact'],
  ];
  return `<body class="${depth ? 'is-project' : 'is-home'}">
<a class="skip" href="#main">Skip to content</a>

<header class="brand">
  <a class="brand__name" href="${depth ? '../index.html' : '#top'}">${site.name}</a>
  <span class="brand__face" data-face><img src="${p}assets/img/drew-head.webp" alt="" width="48" height="48"></span>
  <span class="brand__ow" data-ow aria-hidden="true">Ow!</span>
</header>

<nav class="rail" aria-label="Sections">
  ${nav.map(([label, href, id]) => `<a class="rail__item" href="${href}" data-navdot="${id}" aria-label="${label}"><i></i><span class="rail__label">${[...label].map((c) => `<b>${c}</b>`).join('')}</span></a>`).join('\n  ')}
</nav>

<a class="cta cta--fixed" data-magnet data-onlime href="${depth ? '../index.html' : ''}#contact">Let's talk <span data-arrow aria-hidden="true">↗</span></a>
`;
};

const foot = (depth) => {
  const p = depth ? '../index.html' : '';
  return `
<footer class="foot">
  <div class="wrap foot__row">
    <div>${site.name} · ${site.role}</div>
    <nav class="foot__links" aria-label="Footer">
      <a href="${p}#work">Work</a><a href="${p}#about">About</a><a href="${p}#contact">Contact</a>
    </nav>
  </div>
</footer>

<div class="texture" data-texture aria-hidden="true">
  <div class="texture__grunge">${[1, 2, 3, 4, 5, 6].map((i) => `<i style="background-image:url(${depth ? '../' : ''}assets/img/grunge-${i}.webp);animation-delay:${(-(i - 1) * 0.125).toFixed(3)}s"></i>`).join('')}</div>
  <div class="texture__tooth">${[1, 2, 3, 4].map((i) => `<i style="background-image:url(${depth ? '../' : ''}assets/img/tex-${i}.webp);animation-delay:${(-(i - 1) * 0.0833).toFixed(4)}s"></i>`).join('')}</div>
  <div class="texture__vignette"></div>
</div>
<div class="blob" data-blob aria-hidden="true"><span>View</span></div>
<div class="chat" data-chat>
  <button class="chat__fab" type="button" data-chat-open data-magnet data-onlime aria-expanded="false" aria-controls="chat-panel"><img class="chat__face" src="${depth ? '../' : ''}assets/img/stanley.webp" alt="" width="38" height="38">Ask me about Drew</button>
  <section class="chat__panel" id="chat-panel" role="dialog" aria-label="Ask about Drew" hidden>
    <header class="chat__head">
      <div class="chat__who"><img src="${depth ? '../' : ''}assets/img/stanley.webp" alt="" width="44" height="44"><div><p class="chat__title">Stanley</p><p class="chat__sub mono">Drew's dog · AI assistant</p></div></div>
      <button class="chat__x" type="button" data-chat-close aria-label="Close chat">×</button>
    </header>
    <div class="chat__log" data-chat-log role="log" aria-live="polite"></div>
    <div class="chat__chips" data-chat-chips>
      <button type="button">What does Drew do?</button>
      <button type="button">Tell me about the Academy LMS</button>
      <button type="button">Where has Drew worked?</button>
    </div>
    <form class="chat__form" data-chat-form autocomplete="off">
      <label class="sr" for="chat-input">Your question</label>
      <input id="chat-input" name="q" type="text" maxlength="600" placeholder="Ask about Drew's work or background…" required>
      <button type="submit" aria-label="Send">↑</button>
    </form>
  </section>
</div>

<script src="${depth ? '../' : ''}assets/js/site.js" defer></script>
</body>
</html>
`;
};

const arrowLink = (href, label) => `<a class="pill" data-magnet href="${href}">${label} <span data-arrow aria-hidden="true">↗</span></a>`;

// ---- home ----------------------------------------------------------------
const heroWords = hero.headline
  .map((w) => {
    const hl = w.startsWith('*');
    const m = w.match(/^\*?([^*,.]+)\*?([,.]*)$/);
    const word = hl ? m[1] : w.replace(/[,.]$/, '');
    const punct = hl ? m[2] : (w.match(/[,.]$/) || [''])[0];
    const inner = hl
      ? `<span class="hero__adopt" data-adopt><span class="w"><span data-heroword class="lime">${word}</span></span><svg class="squiggle" data-underline viewBox="0 0 300 24" preserveAspectRatio="none" fill="none" aria-hidden="true"><path data-squiggle d="M1 12 L299 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></span>${punct ? `<span class="w"><span data-heroword>${punct}</span></span>` : ''}`
      : `<span class="w"><span data-heroword>${word}${punct}</span></span>`;
    return inner;
  })
  .join(' ');

const projectCard = (p, i) => `
        <a class="card" data-card data-grow data-project="${p.id}" href="#work/${p.id}">
          <div class="card__shot" data-shot><div class="art art--${p.art}">${art[p.art]}</div></div>
          <div class="card__meta">
            <div>
              <h3>${p.title}</h3>
              <p class="card__sub">${esc(p.short)}</p>
              <p class="mono card__tags">${p.meta}</p>
            </div>
            <span class="mono card__year">${p.year}</span>
          </div>
        </a>`;

const index = `${head(site.title, site.description, 0)}
${chrome(0)}
<main id="main" class="view">

<section id="top" class="hero">
  <div class="wrap hero__in">
    <p class="hero__hi"><span class="w"><span data-heroword class="hi">Hi!${handSvg}</span></span></p>
    <h1 class="hero__h1">${heroWords}</h1>
    <p class="hero__sub" data-herofade>${esc(hero.sub)}</p>
    <div class="hero__cue mono" data-herofade>Want to find out more?
      <svg viewBox="0 0 24 34" fill="none" aria-hidden="true"><path d="M12 2V30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 21L12 31L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>
</section>

<section id="about" class="about">
  <div class="wrap">
    <p class="kicker">${about.kicker}</p>

    <div class="intro">
      <div>
        <h2 class="intro__h" data-intro aria-label="${esc(about.intro)}">${about.intro.split(' ').map((w) => `<span class="pw" aria-hidden="true">${esc(w)}</span>`).join(' ')}</h2>
        <p class="intro__me" data-reveal>${esc(about.me)}</p>
      </div>
      <figure class="portrait" data-reveal><div data-portrait><img src="assets/img/drew-portrait.jpg" alt="Portrait of Drew Burton" width="900" height="1341" loading="lazy"></div></figure>
    </div>

    <div class="how">
      <p class="kicker">${about.think.kicker}</p>
      <ul class="how__rows">
        ${about.think.rows.map((r) => `<li class="how__row" data-reveal>
          <p class="how__old"><span class="mono">The default</span><s>${esc(r.old)}</s></p>
          <p class="how__now">${rich(r.now)}</p>
        </li>`).join('')}
      </ul>
    </div>

    <div class="ai" data-ai>
      <p class="kicker">${about.ai.kicker}</p>
      <p class="sr">${esc(about.ai.line)}</p>
      <p class="ai__line" aria-hidden="true">${(() => {
        const ws = about.ai.line.split(' ');
        const start = about.ai.line.indexOf(about.ai.key);
        const k0 = start < 0 ? -1 : about.ai.line.slice(0, start).split(' ').length - 1;
        const k1 = k0 + about.ai.key.split(' ').length;
        return ws.map((w, i) => `<span class="aw${i >= k0 && i < k1 && k0 >= 0 ? ' key' : ''}">${esc(w)}</span>`).join(' ');
      })()}</p>
      <div class="ai__ctl">
        <span class="mono" aria-hidden="true">Machine</span>
        <input id="ai-range" class="ai__range" type="range" min="0" max="100" value="0" aria-label="From machine to human">
        <span class="mono" aria-hidden="true">Human</span>
      </div>
      <p class="ai__note" data-reveal>${esc(about.ai.note)}</p>
    </div>

    <div class="stan" data-stan data-reveal>
      <p class="stan__note mono">${esc(about.stanley.note)}<svg viewBox="0 0 90 50" fill="none" aria-hidden="true"><path d="M3 8 C 35 2, 70 14, 84 42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M70 38 L85 44 L89 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
      <button class="stan__dog" type="button" data-stanley aria-label="Say hi to Stanley, Drew's dog"><img src="assets/img/stanley-lg.webp" alt="" width="240" height="242" loading="lazy"></button>
    </div>
  </div>
</section>

<section id="work" class="work" data-light data-notexture>
  <div class="wrap">
    <h2 class="display work__h" data-reveal>Selected<br>works</h2>
    <p class="work__intro" data-reveal>${esc(workIntro)}</p>
    <div class="cards">${projects.map(projectCard).join('')}
    </div>
  </div>
</section>

<section id="history" class="history">
  <div class="wrap stack">
    <div class="history__head">
      <div class="stack stack--tight"><p class="kicker">The receipts</p><h2 class="display display--sm">History</h2></div>
      ${site.resume ? arrowLink(site.resume, 'Download résumé').replace('href=', 'download href=') : ''}
    </div>
    <div class="timeline">
      ${history.map((h) => `<div class="timeline__row" data-reveal><div class="mono lime-t">${h.when}</div><div><h3>${h.role}</h3><p class="mono dim">${h.org}</p><p class="timeline__body">${esc(h.body)}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section id="contact" class="contact">
  <div class="wrap stack">
    <h2 class="display display--xl">${esc(contact.heading)}</h2>
    <p class="lede lede--plain" data-reveal>${esc(contact.body)}</p>
    <div class="pills">
      ${arrowLink('mailto:' + site.email, 'Email')}
      ${site.linkedin ? arrowLink(site.linkedin, 'LinkedIn') : ''}
      ${site.github ? arrowLink(site.github, 'GitHub') : ''}
    </div>
    <p class="mono dim">${site.email} · <button class="linkish" type="button" data-ask-stanley>or ask Stanley</button></p>
  </div>
</section>

</main>
${foot(0)}`;

const caseDialog = `
<dialog class="case" id="case" aria-label="Case study">
  <button class="case__x" type="button" data-case-close aria-label="Close case study">×</button>
  ${projects.map((p, i) => {
    const next = projects[(i + 1) % projects.length];
    const meta = [['Role', p.role], ['Type', p.type], ['Year', p.year], p.tools ? ['Tools', p.tools] : null].filter(Boolean);
    return `<article class="case__art wrap stack stack--lg proj" id="case-${p.id}" data-title="${esc(p.title)}" hidden>
    <button class="back mono" type="button" data-case-close><span>←</span> All work</button>
    <header class="stack stack--tight">
      <p class="mono lime-t">${p.num} / ${String(projects.length).padStart(2, '0')}</p>
      <h2 class="proj__title">${p.title}</h2>
      <p class="proj__short">${esc(p.short)}</p>
      <ul class="chips">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
    </header>
    <div class="proj__hero"><div class="art art--${p.art}">${art[p.art]}</div></div>
    <div class="proj__body">
      <dl class="proj__meta">${meta.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <div class="stack stack--lg">
        <section class="proj__sec"><h3 class="kicker lime-t">The problem</h3><p class="proj__lead">${rich(p.problem)}</p></section>
        <section class="proj__sec"><h3 class="kicker lime-t">What I did</h3>${p.did.map((d) => `<p class="proj__lead">${rich(d)}</p>`).join('')}</section>
        <section class="proj__sec"><h3 class="kicker lime-t">Why it matters</h3><p class="proj__lead">${rich(p.why)}</p></section>
        <section class="proj__sec"><h3 class="kicker lime-t">What I'd highlight</h3><ul class="hlist">${p.highlights.map((h) => `<li>${rich(h)}</li>`).join('')}</ul></section>
      </div>
    </div>
    <button class="next" type="button" data-case-open="${next.id}">
      <span><span class="mono dim">Next project</span><span class="next__t">${next.title}</span></span>
      <span class="next__a" data-arrow aria-hidden="true">→</span>
    </button>
  </article>`;
  }).join('\n  ')}
</dialog>
`;

writeFileSync(join(root, 'index.html'), index.replace('</main>\n', '</main>\n' + caseDialog));
rmSync(join(root, 'work'), { recursive: true, force: true });
console.log('built index.html (single page, ' + projects.length + ' case studies in-page)');
