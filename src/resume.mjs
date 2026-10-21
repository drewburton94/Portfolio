// The résumé page. Rendered from the same content as the site (work history, contact,
// "How I think", AI line), so edits made in /admin show up here too. Everything that only
// exists on the résumé (summary, proof points, toolkit) is defined below.
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
  roleLine: 'Learning experience designer & builder',
  summary:
    "There's a lot of bad training out there. For 12+ years I've built education programs with one goal: make learning clear, useful, and human. I design for *adoption, not just consumption*, and increasingly I build the systems themselves: learning platforms, diagnostic tools, and interactive experiences that help customers become confident, capable users of the product.",
  stats: [
    { n: '4 yrs in 1', t: 'Record Academy engagement: more than the previous four years combined, in a single year' },
    { n: '91% vs 79%', t: 'Renewal rate where someone took a course versus where nobody did' },
    { n: '2,000+', t: 'Global operators enabled by a process automation rollout' },
  ],
  toolkit: [
    { plainOnly: true, k: 'Focus areas', v: 'Customer education, instructional design, e-learning development, learning program strategy, enablement, learning analytics, applied AI in learning design, project management' },
    { k: 'Design & build', v: 'Claude Design, Claude Code, Adobe Creative Cloud, Figma' },
    { k: 'Learning', v: 'LMS administration, Articulate, Captivate, video and motion' },
    { k: 'Data & infrastructure', v: 'Learning analytics, Supabase, GitHub, Vercel, Google Sheets and Apps Script' },
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
.top{display:grid;grid-template-columns:1fr auto;gap:6px 22px;align-items:center;background:var(--bg);color:#fff;padding:.4in .6in .36in;position:relative}
.top::after{content:'';position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--sage)}
.top__kick{font:500 7.4pt var(--mono);letter-spacing:.24em;text-transform:uppercase;color:var(--sage);display:flex;align-items:center;gap:10px}
.top__kick::before{content:'';width:26px;height:3px;border-radius:9px;background:var(--sage)}
h1{font:800 31pt/1 var(--disp);letter-spacing:-.02em;margin:6px 0 4px}
.top__role{font:500 11pt var(--sans);color:rgba(255,255,255,.82)}
.contact{display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:9px;font:500 8.2pt var(--mono);color:rgba(255,255,255,.86)}
.contact a:hover{color:var(--sage)}
.face{grid-column:2;grid-row:1/span 3;width:1.02in;height:1.02in;border-radius:50%;border:3px solid var(--sage);overflow:hidden;background:#15181a}
.face img{width:100%;height:100%;object-fit:cover;display:block}

.body{padding:.34in .6in .4in}
.summary{font-size:10.4pt;line-height:1.6;margin-bottom:.3in;max-width:6.4in}
.hl{font-style:normal;font-weight:700;background:linear-gradient(transparent 60%,var(--sage) 60%,var(--sage) 95%,transparent 95%);padding:0 1px}

.cols{display:grid;grid-template-columns:1fr 2.3in;gap:0 .45in}
h2{display:flex;align-items:center;gap:9px;font:500 7.6pt var(--mono);letter-spacing:.22em;text-transform:uppercase;margin-bottom:.16in}
h2::before{content:'';flex:none;width:22px;height:3px;border-radius:9px;background:var(--ink)}
h2 .sub{letter-spacing:.06em;text-transform:none;color:var(--mut)}

/* the learning path */
.path{position:relative;display:flex;flex-direction:column;gap:.2in;padding-left:24px}
.path::before{content:'';position:absolute;left:5px;top:6px;bottom:10px;width:2px;background:repeating-linear-gradient(var(--ink) 0 5px,transparent 5px 9px)}
.mod{position:relative}
.mod::before{content:'';position:absolute;left:-22px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--paper);border:2.5px solid var(--ink)}
.mod--now::before{background:var(--sage);box-shadow:0 0 0 3px var(--paper),0 0 0 4.5px var(--ink)}
.mod__meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font:500 6.8pt var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}
.here{background:var(--ink);color:var(--sage);border-radius:100px;padding:1px 8px;letter-spacing:.12em}
.mod__role{font:700 10.4pt/1.25 var(--disp);margin-top:1px}
.mod__org{font-weight:600;color:var(--mut)}
.mod__body{margin-top:3px;font-size:9.2pt;line-height:1.52}

/* sidebar */
.side{display:flex;flex-direction:column;gap:.3in}
.stats{display:flex;flex-direction:column;gap:12px}
.stat{background:var(--bg);color:#fff;border-radius:9px;padding:11px 14px 12px}
.stat b{display:block;font:800 15pt/1.05 var(--disp);color:var(--sage);letter-spacing:-.01em}
.stat span{display:block;font-size:8.2pt;line-height:1.4;color:rgba(255,255,255,.82);margin-top:2px}
.tk dt{font:500 6.8pt var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin-top:10px}
.tk dt:first-child{margin-top:0}
.tk dd{font-size:8.8pt;line-height:1.45}

.main{display:flex;flex-direction:column}
.foot{margin-top:.26in;display:flex;flex-direction:column;gap:1px;font-size:8.8pt;background:var(--sage);border-radius:8px;padding:10px 14px}
.foot b{font:700 9.4pt var(--disp)}
.foot span{color:var(--ink)}

/* plain: single column, standard headings, no graphics, for applicant tracking systems */
.plain-only,.mod__line{display:none}
body.plain .plain-only{display:flex}
body.plain .mod__line{display:block;font:700 10pt/1.3 var(--sans)}
body.plain .mod__meta,body.plain .mod__role,body.plain .top__kick,body.plain .face,
body.plain .foot,body.plain .here,body.plain h2 .sub,body.plain .top::after{display:none}
body.plain{font-family:Arial,Helvetica,sans-serif}
body.plain *{font-family:Arial,Helvetica,sans-serif!important}
body.plain .top{display:block;background:none;color:var(--ink);padding:.5in .65in .06in}
body.plain h1{font-size:24pt;letter-spacing:0;margin:0 0 2px}
body.plain .top__role{color:var(--ink);font-size:11pt}
body.plain .contact{color:var(--ink);margin-top:5px;font-size:9.5pt}
body.plain .body{padding:.12in .65in .5in}
body.plain h2{font-size:10pt;letter-spacing:.08em;border-bottom:1.5px solid var(--ink);padding-bottom:2px;margin:.14in 0 .06in;display:block}
body.plain h2::before{display:none}
body.plain .summary{font-size:10pt;margin:0}
body.plain .cols{display:flex;flex-direction:column;gap:0}
body.plain .side,body.plain .main{display:contents}
body.plain .stats{order:1}body.plain .exp{order:2}body.plain .tkw{order:3}
body.plain .stats__list{display:block}
body.plain .stat{background:none;color:var(--ink);padding:0 0 3px 14px;border-radius:0;position:relative}
body.plain .stat::before{content:'\\2022';position:absolute;left:3px}
body.plain .stat b,body.plain .stat span{display:inline;font-size:9.6pt;line-height:1.4;color:var(--ink)}
body.plain .stat b{font-weight:700}
body.plain .stat span::before{content:': '}
body.plain .path{padding-left:0;gap:.1in}body.plain .path::before,body.plain .mod::before{display:none}
body.plain .mod__body{font-size:9.6pt;margin-top:1px}
body.plain .tk dt{display:inline;font-size:9.6pt;letter-spacing:0;text-transform:none;font-weight:700;color:var(--ink);margin:0}
body.plain .tk dt::after{content:': '}
body.plain .tk dd{display:inline;font-size:9.6pt}
body.plain .tk dd::after{content:'';display:block;height:3px}
body.plain .hl{background:none;font-weight:400}
body.plain .sheet{box-shadow:0 30px 80px rgba(0,0,0,.55)}

@media screen and (max-width:8.9in){
  .sheet{width:calc(100% - 24px);min-height:0;margin:14px auto 40px}
  .top{grid-template-columns:1fr;padding:22px 20px}.face{grid-column:1;grid-row:auto;width:84px;height:84px;order:-1}
  h1{font-size:28pt}
  .body{padding:16px 20px 24px}
  .cols{grid-template-columns:1fr;gap:24px}
  .foot{flex-direction:column;gap:4px}.foot span{text-align:left}
  body{font-size:10.5pt}.mod__body{font-size:10pt}.stat span,.tk dd{font-size:9.4pt}
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
  const history = arr(content.history);
  const ai = (content.about && content.about.ai) || {};
  const R = RESUME;

  const email = String(site.email || '').trim();
  const linkedin = safeUrl(site.linkedin);
  const github = safeUrl(site.github);
  const contactItems = [
    email && `<a href="mailto:${esc(email)}">${esc(email)}</a>`,
    linkedin && `<a href="${esc(linkedin)}">${esc(linkedin.replace(/^https:\/\/(www\.)?/, ''))}</a>`,
    github && `<a href="${esc(github)}">${esc(github.replace(/^https:\/\/(www\.)?/, ''))}</a>`,
  ].filter(Boolean);

  const modules = history
    .map((h, i) => {
      const n = history.length - i;
      const now = i === 0;
      return `<li class="mod${now ? ' mod--now' : ''}">
        <p class="mod__line">${esc(h.role)}${h.org ? `, ${esc(h.org)}` : ''} | ${range(h.when)}</p>
        <div class="mod__meta"><span>Module ${String(n).padStart(2, '0')}</span><span>${range(h.when)}</span>${now ? '<span class="here">You are here</span>' : ''}</div>
        <h3 class="mod__role">${esc(h.role)}${h.org ? ` <span class="mod__org">· ${esc(h.org)}</span>` : ''}</h3>
        <p class="mod__body">${esc(h.body)}</p>
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
      <div class="contact">${contactItems.join('')}</div>
    </div>
    <div class="face"><img src="/assets/img/drew-head.webp" alt="" width="200" height="200"></div>
  </header>

  <div class="body">
    <h2 class="plain-only">Summary</h2>
    <p class="summary">${rich(R.summary)}</p>

    <div class="cols">
      <div class="main"><section class="exp" aria-labelledby="exp">
        <h2 id="exp">Experience <span class="sub">as a learning path</span></h2>
        <ol class="path" style="list-style:none;margin:0">${modules}</ol>
      </section>
      <div class="foot"><b>${esc(ai.kicker || 'Human first. AI enabled.')}</b><span>${esc(ai.line || '')}</span></div>
      </div>

      <aside class="side">
        <section class="stats" aria-labelledby="res"><h2 id="res" class="plain-only">Key results</h2><div class="stats__list">${R.stats.map((s) => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.t)}</span></div>`).join('')}</div></section>
        <section class="tkw" aria-labelledby="tk"><h2 id="tk">Skills</h2><dl class="tk">${R.toolkit.map((t) => `<dt${t.plainOnly ? ' class="plain-only"' : ''}>${esc(t.k)}</dt><dd${t.plainOnly ? ' class="plain-only"' : ''}>${esc(t.v)}</dd>`).join('')}</dl></section>
      </aside>
    </div>
  </div>
</main>
<script>${JS}</script>
</body>
</html>`;
}
