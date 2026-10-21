// The résumé page. Contact details and the AI line come from the site content, so edits
// made in /admin show up here. Everything else (summary, results, work history, skills)
// is the résumé's own copy, defined below.
//
// The page is a letter-size sheet that is also what prints. A "Plain" switch drops the
// decoration for applicant tracking systems.

const arr = (v) => (Array.isArray(v) ? v : []);
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
// *highlight* -> marker, **bold**
const rich = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="hl">$1</em>');
const safeUrl = (u) => {
  const s = String(u ?? '').trim();
  return /^(\/(?!\/)|https:\/\/|mailto:)/i.test(s) ? s : '';
};
const range = (s) => esc(String(s ?? '').replace(/\s*[—–]\s*/g, '–'));

export const RESUME = {
  roleLine: 'Customer Education | Learning Experience Design',
  portfolio: { url: 'https://www.DrewsBurton.com', label: 'www.DrewsBurton.com' },
  summary:
    "There's a lot of bad training out there. For over a decade I've built education programs with one goal: make learning clear, useful, and human. I design for adoption, not just consumption, and increasingly I build the systems themselves: learning platforms, diagnostic tools, and interactive experiences that help customers become confident, capable users of the product.",
  stats: [
    { n: 'Customer Engagement', t: 'In a single year, Academy engagement beat the previous four years combined.' },
    { n: 'Churn & Renewal', t: "Found that Academy activity looks like an early renewal signal. 91% of accounts where someone took a course in the past year renewed, versus 79% of those that didn't." },
  ],
  // Résumé work history. Kept here, apart from the site's History section, so the two can be worded differently.
  // A bullet with `plain` shows `text` on the designed page and `plain` on the plain (ATS) page.
  // The entry with `roles` is the "Earlier roles" group on the designed page and separate roles on the plain page.
  experience: [
    {
      role: 'Senior Instructional Designer', org: 'Algolia', when: '2024 - Present',
      bullets: [
        { text: 'Led customer education strategy and the design of courses and content across Academy, from onboarding to certification.' },
        {
          text: 'Rebuilt Academy around interactive, applied learning and launched technical paths and certifications that drove record engagement.',
          plain: 'Rebuilt Academy around interactive, applied learning and launched technical paths and certifications that drove record engagement. In a single year, engagement beat the previous four years combined.',
        },
        {
          text: 'Analyzed Academy activity against renewals and shared the findings with Customer Success. Now being integrated into health signals.',
          plain: "Analyzed Academy activity against renewals and shared the findings with Customer Success. Accounts where someone took a course in the past year renewed at 91%, versus 79% for those that didn't. Now being integrated into health signals.",
        },
        { text: 'Built AI tools for Customer Success and customers: a dashboard that flags broken implementations, first-pass review skills, and an open-source skills library for coding agents.' },
        { text: 'Built an AI-native learning platform with search, an in-course AI tutor and intent-based paths. In internal testing.' },
      ],
    },
    {
      role: 'Instructional Designer', org: 'Talkdesk', when: '2021 - 2024',
      bullets: [
        { text: 'Helped build the education function as the company scaled, setting standards for how learning is designed and delivered.' },
        { text: 'Owned global onboarding and manager resources.' },
        { text: 'Partnered with HR, leadership, and Sales Enablement on leadership development and sales skills.' },
      ],
    },
    {
      role: 'Instructional Designer', org: 'Kelly Services', when: '2018 - 2021',
      bullets: [
        { text: 'Built training for a process automation rollout, enabling adoption for 2,000+ global operators.' },
        { text: 'Designed interactive e-learning and assessments tied to operational goals.' },
      ],
    },
    {
      role: 'Earlier roles', org: '', when: '2015 - 2017',
      roles: [
        { title: 'Administrative Co-op', org: 'Dow Chemical', when: '2016 - 2017', text: 'Led a data archival project covering 2,000+ confidential records in a regulated environment.', short: 'Led a 2,000+ record data archival project in a regulated environment.' },
        { title: 'eLearning Developer', org: 'Delta College Corporate Services', when: '2015 - 2016', text: 'Developed e-learning modules and refined training content.' },
      ],
    },
  ],
  chat: { q: 'Where does AI fit in your work?' },
  toolkit: [
    { k: 'Focus', v: 'Customer education, onboarding, product training, certification, learning analytics, customer success enablement' },
    { k: 'Design & build', kPlain: 'Design and build', v: 'Claude, Codex, Figma, Adobe Premiere Pro, Adobe After Effects, Adobe Illustrator, Adobe Creative Cloud' },
    { k: 'Learning', v: 'LMS administration, Articulate, Captivate, video and motion' },
    { k: 'Data & infrastructure', kPlain: 'Data and infrastructure', v: 'Learning analytics, Supabase, GitHub, Vercel, Google Sheets and Apps Script' },
  ],
};

const CSS = `
:root{--bg:#07080a;--ink:#101210;--sage:#a7c4a0;--paper:#fbfaf7;--mut:#555a55;--line:#d9d7d0;
--sans:'Manrope',system-ui,sans-serif;--disp:'Poppins','Manrope',system-ui,sans-serif;--mono:'DM Mono',ui-monospace,monospace}
*,*::before,*::after{box-sizing:border-box}
html{background:var(--bg);-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:9.8pt;line-height:1.5;
-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,p,ul,dl,dd{margin:0}ul{padding:0;list-style:none}a{color:inherit;text-decoration:none}
.mono{font-family:var(--mono)}
:focus-visible{outline:2px solid var(--sage);outline-offset:2px}

/* screen bar */
.bar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;
padding:12px 20px;background:rgba(7,8,10,.92);backdrop-filter:blur(8px);color:#fff;font-size:13px;border-bottom:1px solid rgba(255,255,255,.12)}
.bar a{color:#fff}.bar a:hover{color:var(--sage)}
.bar__right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.seg{display:inline-flex;border:1px solid rgba(255,255,255,.25);border-radius:100px;overflow:hidden}
.seg button{all:unset;cursor:pointer;padding:7px 14px;font:500 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:#fff}
.seg button[aria-pressed=true]{background:var(--sage);color:var(--bg)}
.seg button:focus-visible{outline:2px solid var(--sage);outline-offset:-4px}
.btn{all:unset;cursor:pointer;padding:8px 18px;border-radius:100px;background:var(--sage);color:var(--bg);font:700 13px var(--sans)}
.btn:hover{filter:brightness(1.08)}.btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.hint{width:100%;text-align:center;color:rgba(255,255,255,.62);font:400 12px var(--sans);padding:14px 20px 0}

/* the sheet */
.sheet{position:relative;width:8.5in;min-height:11in;margin:22px auto 60px;background:var(--paper);overflow:hidden;
box-shadow:0 30px 80px rgba(0,0,0,.55)}
.top{display:block;background:var(--bg);color:#fff;padding:.4in .6in .36in;position:relative}
.top::after{content:'';position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--sage)}
.top__kick{font:500 7.4pt var(--mono);letter-spacing:.24em;text-transform:uppercase;color:var(--sage);display:flex;align-items:center;gap:10px}
.top__kick::before{content:'';width:26px;height:3px;border-radius:9px;background:var(--sage)}
h1{font:800 31pt/1 var(--disp);letter-spacing:-.02em;margin:6px 0 4px}
.top__role{font:500 11pt var(--sans);color:rgba(255,255,255,.82)}
.contact{display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:9px;font:500 8.2pt var(--mono);color:rgba(255,255,255,.86)}
.contact a:hover{color:var(--sage)}
.sep{display:none}
.pl{display:none}
.contact a{display:inline-flex;align-items:center;gap:6px}
.ic{flex:none;width:11px;height:11px;color:var(--sage)}

.body{padding:.34in .6in .4in}
.summary{font-size:10.4pt;line-height:1.55;margin-bottom:.15in}
.hl{font-style:normal;font-weight:700;background:linear-gradient(transparent 60%,var(--sage) 60%,var(--sage) 95%,transparent 95%);padding:0 1px}

.cols{display:grid;grid-template-columns:1fr 2.3in;gap:0 .45in}
h2{display:flex;align-items:center;gap:9px;font:500 7.6pt var(--mono);letter-spacing:.22em;text-transform:uppercase;margin-bottom:.12in}
h2::before{content:'';flex:none;width:22px;height:3px;border-radius:9px;background:var(--ink)}
h2 .sub{letter-spacing:.06em;text-transform:none;color:var(--mut)}

/* the learning path */
.path{position:relative;display:flex;flex-direction:column;gap:.16in;padding-left:24px}
.path::before{content:'';position:absolute;left:5px;top:6px;bottom:10px;width:2px;background:repeating-linear-gradient(var(--ink) 0 5px,transparent 5px 9px)}
.mod{position:relative}
.mod::before{content:'';position:absolute;left:-22px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--paper);border:2.5px solid var(--ink)}
.mod--now::before{background:var(--sage);box-shadow:0 0 0 3px var(--paper),0 0 0 4.5px var(--ink)}
.mod__meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font:500 6.8pt var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}
.mod__role{font:700 10.4pt/1.25 var(--disp);margin-top:1px}
.mod__org{font-weight:600;color:var(--ink)}
.mod__list{margin-top:3px;display:flex;flex-direction:column;gap:3px}
.mod__list li{position:relative;padding-left:12px;font-size:8.8pt;line-height:1.45}
.mod__list li::before{content:'';position:absolute;left:0;top:.55em;width:4px;height:4px;border-radius:50%;background:var(--ink)}

/* sidebar */
.side{display:flex;flex-direction:column;gap:.17in}
.stats__list{display:flex;flex-direction:column;gap:9px}
.stat{background:var(--bg);color:#fff;border-radius:9px;padding:9px 13px 10px}
.stat b{display:block;font:800 11.6pt/1.15 var(--disp);white-space:nowrap;color:var(--sage);letter-spacing:-.01em}
.stat span{display:block;font-size:7.9pt;line-height:1.38;color:rgba(255,255,255,.82);margin-top:2px}
.tk dt{font:500 6.8pt var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin-top:6px}
.tk dt:first-child{margin-top:0}
.tk dd{font-size:8.4pt;line-height:1.4}

.main{display:flex;flex-direction:column}
.chat{margin-top:auto;border:1.5px solid var(--ink);border-radius:10px;overflow:hidden;background:#f3f1eb}
.chat__bar{display:flex;align-items:center;gap:5px;background:var(--ink);color:#fff;padding:4px 10px;font:500 6.8pt var(--mono);letter-spacing:.12em;text-transform:uppercase}
.chat__bar i{width:5px;height:5px;border-radius:50%;background:var(--sage)}
.chat__bar span{margin-left:3px}
.chat__log{display:flex;flex-direction:column;gap:5px;padding:7px 8px 6px}
.chat__input{display:flex;align-items:center;justify-content:space-between;gap:6px;margin:0 8px 8px;border:1px solid #b9b6ac;border-radius:100px;background:#fff;padding:3px 4px 3px 10px;font-size:7.4pt;color:var(--mut)}
.chat__send{flex:none;width:.19in;height:.19in;border-radius:50%;background:var(--ink);position:relative}
.chat__send::after{content:'';position:absolute;left:50%;top:50%;width:4px;height:4px;border-top:1.6px solid var(--sage);border-right:1.6px solid var(--sage);transform:translate(-65%,-50%) rotate(45deg)}
.chat__who{font:500 6.4pt var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}
.msg{display:flex;flex-direction:column;gap:3px;max-width:94%}
.msg--in{align-items:flex-start}
.msg--out{align-items:flex-end;align-self:flex-end}
.msg--out .chat__who{padding-right:4px}
.bubble{margin:0;font-size:8.4pt;line-height:1.38;padding:6px 11px 7px}
.msg--in .bubble{background:#fff;border:1px solid #d9d6cc;color:var(--ink);border-radius:14px 14px 14px 3px}
.msg--out .bubble{background:var(--sage);color:var(--ink);border-radius:14px 14px 3px 14px}
.bubble b{font:700 8.8pt var(--disp)}

/* plain: single column, standard headings, no graphics, for applicant tracking systems */
body.plain .cr{display:none}
body.plain .pl{display:revert}
body.plain .sep{display:inline}
.plain-only,.mod__line{display:none}
body.plain .plain-only{display:flex}
body.plain .mod__line{display:block;font:700 10.5pt/1.3 var(--sans)}
body.plain .pl .mod__line{margin-top:.1in}
body.plain .pl .mod__line:first-child{margin-top:0}
body.plain .mod__meta,body.plain .mod__role,body.plain .stats,body.plain .top__kick,
body.plain .chat,body.plain h2 .sub,body.plain .top::after{display:none}
body.plain{font-family:Arial,Helvetica,sans-serif}
body.plain *{font-family:Arial,Helvetica,sans-serif!important}
body.plain .top{display:block;background:none;color:var(--ink);padding:.5in .65in .06in}
body.plain h1{font-size:24pt;letter-spacing:0;margin:0 0 2px}
body.plain .top__role{color:var(--ink);font-size:11.5pt}
body.plain .contact{color:var(--ink);margin-top:5px;font-size:10pt;gap:4px 8px}
body.plain .contact a{display:inline}
body.plain .ic{display:none}
body.plain .body{padding:.12in .65in .5in}
body.plain h2{font-size:11pt;letter-spacing:.08em;border-bottom:1.5px solid var(--ink);padding-bottom:2px;margin:.14in 0 .06in;display:block}
body.plain h2::before{display:none}
body.plain .summary{font-size:10.5pt;margin:0}
body.plain .cols{display:flex;flex-direction:column;gap:0}
body.plain .side,body.plain .main{display:contents}
body.plain .exp{order:2}body.plain .tkw{order:3}
body.plain .path{padding-left:0;gap:.1in}body.plain .path::before,body.plain .mod::before{display:none}
body.plain .mod__list{margin-top:1px;gap:2px}
body.plain .mod__list li{font-size:10pt;line-height:1.4}
body.plain .mod__list li::before{content:'\\2022';width:auto;height:auto;top:0;left:2px;border-radius:0;background:none;line-height:inherit}
body.plain .tk dt{display:inline;font-size:10pt;letter-spacing:0;text-transform:none;font-weight:700;color:var(--ink);margin:0}
body.plain .tk dt::after{content:': '}
body.plain .tk dd{display:inline;font-size:10pt}
body.plain .tk dd::after{content:'';display:block;height:3px}
body.plain .hl{background:none;font-weight:400}
body.plain .sheet{box-shadow:0 30px 80px rgba(0,0,0,.55)}

@media screen and (max-width:8.9in){
  .sheet{width:calc(100% - 24px);min-height:0;margin:14px auto 40px}
  .top{padding:22px 20px}
  h1{font-size:28pt}
  .body{padding:16px 20px 24px}
  .cols{grid-template-columns:1fr;gap:24px}
  body{font-size:10.5pt}.mod__list li{font-size:10pt}.stat span,.tk dd{font-size:9.4pt}
}
@media screen and (prefers-reduced-motion:no-preference){
  .mod--now::before{animation:ping 2.4s ease-out infinite}
  @keyframes ping{0%{box-shadow:0 0 0 3px var(--paper),0 0 0 4.5px var(--ink),0 0 0 4.5px rgba(167,196,160,.9)}
  70%,100%{box-shadow:0 0 0 3px var(--paper),0 0 0 4.5px var(--ink),0 0 0 12px rgba(167,196,160,0)}}
}
@media print{
  @page{size:letter;margin:0}
  html,body{background:#fff}
  .sheet{background:#fff}
  .bar,.hint{display:none!important}
  .sheet{width:8.5in;height:11in;min-height:0;margin:0;box-shadow:none;overflow:hidden;break-inside:avoid;page-break-after:avoid}
  body.plain .sheet{height:auto;min-height:11in;overflow:visible}
  .mod--now::before{animation:none}
  a{text-decoration:none}
}
`;

const JS = `
(function(){
  var b=document.body,btns=document.querySelectorAll('[data-mode]');
  function set(m){b.classList.toggle('plain',m==='plain');btns.forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.mode===m))});
    try{history.replaceState(null,'',m==='plain'?'?plain':location.pathname)}catch(e){}}
  btns.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.mode)})});
  var p=document.getElementById('print');if(p)p.addEventListener('click',function(){window.print()});
  set(/[?&]plain\\b/.test(location.search)?'plain':'creative');
})();
`;

export function renderResume(content) {
  const site = content.site || {};
  const ai = (content.about && content.about.ai) || {};
  const R = RESUME;

  const email = String(site.email || '').trim();
  const linkedin = safeUrl(site.linkedin);
  const github = safeUrl(site.github);
  const ICON_MAIL = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>';
  const ICON_IN = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  const ICON_WEB = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>';
  const portfolio = safeUrl(R.portfolio && R.portfolio.url);
  const contactItems = [
    email && `<a href="mailto:${esc(email)}">${ICON_MAIL}${esc(email)}</a>`,
    linkedin && `<a href="${esc(linkedin)}">${ICON_IN}${esc(linkedin.replace(/^https:\/\/(www\.)?/, ''))}</a>`,
    portfolio && `<a href="${esc(portfolio)}">${ICON_WEB}${esc(R.portfolio.label)}</a>`,
    github && `<a href="${esc(github)}">${esc(github.replace(/^https:\/\/(www\.)?/, ''))}</a>`,
  ].filter(Boolean);

  const modules = R.experience
    .map((h, i) => {
      const n = R.experience.length - i;
      const now = i === 0;
      const dual = (b) => (b.plain ? `<span class="cr">${esc(b.text)}</span><span class="pl">${esc(b.plain)}</span>` : esc(b.text));
      let body;
      if (h.roles) {
        const roleName = (r) => `${r.title}, ${r.org} | ${r.when}`;
        const crItems = h.roles.map((r) => `<li><strong>${esc(roleName(r))}:</strong> ${esc(r.short || r.text)}</li>`).join('');
        const plRoles = h.roles.map((r) => `<p class="mod__line">${esc(roleName(r))}</p><ul class="mod__list"><li>${esc(r.text)}</li></ul>`).join('');
        body = `<div class="mod__meta"><span>Module ${String(n).padStart(2, '0')}</span><span>${esc(h.when)}</span></div>
        <h3 class="mod__role">${esc(h.role)}</h3>
        <ul class="mod__list cr">${crItems}</ul>
        <div class="pl">${plRoles}</div>`;
      } else {
        const items = h.bullets.map((b) => `<li>${dual(b)}</li>`).join('');
        body = `<p class="mod__line">${esc(h.role)}${h.org ? `, ${esc(h.org)}` : ''} | ${esc(h.when)}</p>
        <div class="mod__meta"><span>Module ${String(n).padStart(2, '0')}</span><span>${esc(h.when)}</span></div>
        <h3 class="mod__role">${esc(h.role)}${h.org ? ` <span class="mod__org">· ${esc(h.org)}</span>` : ''}</h3>
        <ul class="mod__list">${items}</ul>`;
      }
      return `<li class="mod${now ? ' mod--now' : ''}">
        ${body}
      </li>`;
    })
    .join('');

  const title = `${site.name || 'Drew Burton'} | Résumé`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(`${site.name || 'Drew Burton'}, ${R.roleLine.toLowerCase()}. Printable résumé.`)}">
<meta name="theme-color" content="#07080a">
<link rel="icon" href="/assets/img/drew-head.webp" type="image/webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<div class="bar">
  <a href="/">← Back to the portfolio</a>
  <div class="bar__right">
    <div class="seg" role="group" aria-label="Résumé version">
      <button type="button" data-mode="creative" aria-pressed="true">Creative</button>
      <button type="button" data-mode="plain" aria-pressed="false">Plain</button>
    </div>
    <button class="btn" id="print" type="button">Print or save as PDF</button>
  </div>
  <p class="hint">Creative is one letter-size page. Plain drops the design for applicant tracking systems. In the print dialog, turn on "Background graphics" so the colors print.</p>
</div>

<main class="sheet" id="sheet">
  <header class="top">
    <div>
      <p class="top__kick">Course catalog · Customer education</p>
      <h1>${esc(site.name || 'Drew Burton')}</h1>
      <p class="top__role">${esc(R.roleLine)}</p>
      <div class="contact">${contactItems.join('<span class="sep" aria-hidden="true">|</span>')}</div>
    </div>
  </header>

  <div class="body">
    <h2 class="plain-only">Summary</h2>
    <p class="summary">${rich(R.summary)}</p>

    <div class="cols">
      <div class="main"><section class="exp" aria-labelledby="exp">
        <h2 id="exp">Experience <span class="sub">as a learning path</span></h2>
        <ol class="path" style="list-style:none;margin:0">${modules}</ol>
      </section>
      </div>

      <aside class="side">
        <section class="stats" aria-label="Results"><div class="stats__list">${R.stats.map((s) => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.t)}</span></div>`).join('')}</div></section>
        <section class="tkw" aria-labelledby="tk"><h2 id="tk">Skills</h2><dl class="tk">${R.toolkit.map((t) => `<dt>${t.kPlain ? `<span class="cr">${esc(t.k)}</span><span class="pl">${esc(t.kPlain)}</span>` : esc(t.k)}</dt><dd>${esc(t.v)}</dd>`).join('')}</dl></section>
        <div class="chat" role="group" aria-label="Chat">
          <div class="chat__bar"><i></i><span>Ask Drew</span></div>
          <div class="chat__log">
            <div class="msg msg--in"><p class="bubble">${esc(R.chat.q)}</p></div>
            <div class="msg msg--out"><span class="chat__who">Drew</span><p class="bubble"><b>${esc(ai.kicker || 'Human first. AI enabled.')}</b><br>${esc(ai.line || '')}</p></div>
          </div>
          <div class="chat__input" aria-hidden="true"><span>Type a message</span><span class="chat__send"></span></div>
        </div>
      </aside>
    </div>
  </div>
</main>
<script>${JS}</script>
</body>
</html>`;
}
