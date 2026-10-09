(function () {
  'use strict';

  var app = document.getElementById('app');
  var toastEl = document.getElementById('toast');
  var state = { session: null, content: null, defaults: null, saved: [], dirty: new Set(), page: 'overview', days: 30, analytics: null, media: null };
  var toastTimer;

  // ---------- tiny helpers ----------
  function h(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === false || v == null) return;
      if (k === 'class') el.className = v;
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { append(el, x); });
    else el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  // Like replaceChildren, but accepts nested arrays (lists of nodes).
  function rc(el) {
    el.replaceChildren();
    for (var i = 1; i < arguments.length; i++) append(el, arguments[i]);
  }
  function toast(msg, bad) {
    toastEl.textContent = msg;
    toastEl.className = 'toast' + (bad ? ' bad' : '');
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, bad ? 5000 : 2600);
  }
  function api(path, opts) {
    opts = opts || {};
    var isForm = opts.body instanceof FormData;
    var headers = { 'x-admin': '1' };
    if (opts.body !== undefined && !isForm) headers['content-type'] = 'application/json';
    return fetch(path, {
      method: opts.method || 'GET',
      headers: headers,
      credentials: 'same-origin',
      body: opts.body === undefined ? undefined : isForm ? opts.body : JSON.stringify(opts.body)
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        if (res.status === 401 && state.session && path.indexOf('/login') < 0) { state.session.signedIn = false; render(); }
        if (!res.ok) throw new Error((data && data.error) || 'Something went wrong.');
        return data;
      });
    });
  }
  function markDirty(key) { state.dirty.add(key); chrome(); }
  function move(arr, i, d) {
    var j = i + d;
    if (j < 0 || j >= arr.length) return;
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function num(n) { return Number(n || 0).toLocaleString('en-US'); }
  function ytId(input) {
    var s = String(input || '').trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    var m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : '';
  }

  // ---------- form fields bound to content ----------
  // Fields write straight into state.content[ck] and mark that section as changed.
  function fieldsFor(ck) {
    function wrap(label, control, hint) {
      return h('div', { class: 'field' }, h('label', {}, label), control, hint ? h('p', { class: 'hint' }, hint) : null);
    }
    function getset(o, k, opts) {
      return {
        get: opts.get || function () { var v = o[k]; return v == null ? '' : String(v); },
        set: opts.set || function (v) { o[k] = v; }
      };
    }
    return {
      text: function (label, o, k, opts) {
        opts = opts || {};
        var gs = getset(o, k, opts);
        var inp = h('input', { type: opts.type || 'text', value: gs.get(), placeholder: opts.placeholder || '', oninput: function () { gs.set(inp.value); markDirty(ck); } });
        return wrap(label, inp, opts.hint);
      },
      area: function (label, o, k, opts) {
        opts = opts || {};
        var gs = getset(o, k, opts);
        var ta = h('textarea', { rows: opts.rows || 4, oninput: function () { gs.set(ta.value); markDirty(ck); } });
        ta.value = gs.get();
        if (opts.mono) ta.style.fontFamily = 'var(--mono)';
        return wrap(label, ta, opts.hint);
      },
      select: function (label, o, k, options, opts) {
        opts = opts || {};
        var sel = h('select', { onchange: function () { o[k] = sel.value; markDirty(ck); } },
          options.map(function (op) { return h('option', { value: op[0], selected: String(o[k]) === op[0] }, op[1]); }));
        return wrap(label, sel, opts.hint);
      }
    };
  }

  // ---------- chrome (sidebar, save bar) ----------
  var PAGES = [
    ['overview', 'Overview', null],
    ['history', 'Work history', ['history']],
    ['projects', 'Projects', ['projects']],
    ['about', 'About page', ['about']],
    ['site', 'Hero & contact', ['hero', 'workIntro', 'contact', 'site']],
    ['stanley', "Stanley's knowledge", ['knowledge']],
    ['media', 'Image library', null]
  ];
  var saveBar, saveMsg, saveBtn;

  function chrome() {
    document.querySelectorAll('[data-nav]').forEach(function (b) {
      var keys = PAGES.filter(function (p) { return p[0] === b.getAttribute('data-nav'); })[0][2] || [];
      var dirty = keys.some(function (k) { return state.dirty.has(k); });
      var dot = b.querySelector('.dot');
      if (dirty && !dot) b.append(h('span', { class: 'dot', title: 'Unsaved changes' }));
      if (!dirty && dot) dot.remove();
    });
    if (saveBar) {
      var n = state.dirty.size;
      saveBar.hidden = n === 0;
      saveMsg.textContent = n === 1 ? 'You have unsaved changes.' : 'You have unsaved changes in ' + n + ' sections.';
    }
  }
  window.addEventListener('beforeunload', function (e) { if (state.dirty.size) { e.preventDefault(); e.returnValue = ''; } });

  function saveAll() {
    var keys = Array.from(state.dirty);
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    return Promise.all(keys.map(function (k) {
      return api('/api/admin/content?key=' + encodeURIComponent(k), { method: 'PUT', body: state.content[k] }).then(function () { state.dirty.delete(k); if (state.saved.indexOf(k) < 0) state.saved.push(k); });
    })).then(function () { toast('Saved. The live site is updated.'); })
      .catch(function (e) { toast(e.message, true); })
      .then(function () { saveBtn.disabled = false; saveBtn.textContent = 'Save changes'; chrome(); });
  }

  function resetButton(keys, label) {
    return h('button', {
      class: 'btn btn--sm btn--danger', type: 'button', onclick: function () {
        if (!confirm('Reset ' + label + ' to the original text? Your saved edits for it will be removed.')) return;
        Promise.all(keys.map(function (k) { return api('/api/admin/content?key=' + k, { method: 'DELETE' }); }))
          .then(function () { return loadContent(); })
          .then(function () { keys.forEach(function (k) { state.dirty.delete(k); }); toast('Reset to the original.'); render(); })
          .catch(function (e) { toast(e.message, true); });
      }
    }, 'Reset to original');
  }

  // ---------- pages ----------
  function pageHead(title, desc, right) {
    return h('div', { class: 'page__head' }, h('div', {}, h('h1', {}, title), desc ? h('p', {}, desc) : null), right || null);
  }

  // Work history
  function pageHistory() {
    var list = state.content.history, F = fieldsFor('history');
    var wrapEl = h('div', { class: 'page' });
    function draw() {
      rc(wrapEl, 
        pageHead('Work history', 'Shown in the History section of the site, newest first.', resetButton(['history'], 'work history')),
        list.map(function (r, i) {
          return h('details', { class: 'item', open: i === 0 && !r.role ? true : false },
            h('summary', {}, h('strong', {}, r.role || 'New role'), h('span', { class: 'dim' }, [r.org, r.when].filter(Boolean).join(' · ')), h('span', { class: 'chev' }, '›')),
            h('div', { class: 'item__body' },
              h('div', { class: 'grid3' }, F.text('Role', r, 'role'), F.text('Company', r, 'org'), F.text('Dates', r, 'when', { placeholder: '2024 — Now' })),
              F.area('What you did', r, 'body', { rows: 4 }),
              h('div', { class: 'row-actions' },
                h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(list, i, -1); markDirty('history'); draw(); } }, '↑ Move up'),
                h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(list, i, 1); markDirty('history'); draw(); } }, '↓ Move down'),
                h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { if (confirm('Delete this role?')) { list.splice(i, 1); markDirty('history'); draw(); } } }, 'Delete'))));
        }),
        h('div', {}, h('button', { class: 'btn', type: 'button', onclick: function () { list.unshift({ when: '', role: '', org: '', body: '' }); markDirty('history'); draw(); } }, '+ Add a role')));
    }
    draw();
    return wrapEl;
  }

  // Projects
  function pageProjects() {
    var list = state.content.projects, F = fieldsFor('projects');
    var wrapEl = h('div', { class: 'page' });
    function draw() {
      rc(wrapEl, 
        pageHead('Projects & case studies', 'Each project is a card on the site that opens a full case study. The first image you add becomes the card and header image; YouTube links and extra images appear below the story.', resetButton(['projects'], 'projects')),
        list.map(function (p, i) { return projectItem(p, i); }),
        h('div', {}, h('button', { class: 'btn', type: 'button', onclick: function () {
          list.push({ id: 'project-' + Math.random().toString(36).slice(2, 6), title: 'New project', short: '', meta: '', year: String(new Date().getFullYear()), role: '', type: '', tools: '', tags: [], art: 'grid', problem: '', did: [], why: '', highlights: [], media: [] });
          markDirty('projects'); draw();
        } }, '+ Add a project')));
    }
    function projectItem(p, i) {
      p.media = p.media || [];
      var det = h('details', { class: 'item' },
        h('summary', {}, h('strong', {}, p.title || 'Untitled'), h('span', { class: 'dim' }, p.meta || ''), h('span', { class: 'chev' }, '›')),
        h('div', { class: 'item__body' },
          h('div', { class: 'grid2' }, F.text('Title', p, 'title'), F.text('Short line (shown on the card)', p, 'short')),
          h('div', { class: 'grid3' }, F.text('Type of work (card label)', p, 'meta', { placeholder: 'learning platform · redesign' }), F.text('Year', p, 'year'), F.text('Link name', p, 'id', { hint: 'Used in the web address, e.g. #work/academy. Letters, numbers and dashes.', set: function (v) { p.id = slug(v) || p.id; } })),
          h('div', { class: 'grid2' }, F.text('Your role', p, 'role'), F.text('Project type', p, 'type')),
          h('div', { class: 'grid2' }, F.text('Tools', p, 'tools'),
            F.text('Tags', p, 'tags', { hint: 'Separate with commas.', get: function () { return (p.tags || []).join(', '); }, set: function (v) { p.tags = v.split(',').map(function (s) { return s.trim(); }).filter(Boolean); } })),
          F.select('Artwork when there is no image', p, 'art', [['grid', 'Grid'], ['tunnel', 'Tunnel'], ['pulse', 'Pulse'], ['bars', 'Bars']]),
          F.area('The problem', p, 'problem', { rows: 4, hint: 'Use *words* for a lime highlight and **words** for bold.' }),
          F.area('What I did', p, 'did', { rows: 7, hint: 'Leave a blank line between paragraphs.', get: function () { return (p.did || []).join('\n\n'); }, set: function (v) { p.did = v.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean); } }),
          F.area('Why it matters', p, 'why', { rows: 4 }),
          F.area("What I'd highlight", p, 'highlights', { rows: 4, hint: 'One per line.', get: function () { return (p.highlights || []).join('\n'); }, set: function (v) { p.highlights = v.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); } }),
          mediaEditor(p, function () { markDirty('projects'); }),
          h('div', { class: 'row-actions' },
            h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(list, i, -1); markDirty('projects'); draw(); } }, '↑ Move up'),
            h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(list, i, 1); markDirty('projects'); draw(); } }, '↓ Move down'),
            h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { if (confirm('Delete "' + (p.title || 'this project') + '"?')) { list.splice(i, 1); markDirty('projects'); draw(); } } }, 'Delete project'))));
      return det;
    }
    draw();
    return wrapEl;
  }

  function mediaEditor(p, changed) {
    var box = h('div', { class: 'field' });
    var status = h('p', { class: 'hint' });
    var fileInput = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif', multiple: true, hidden: true });
    var ytInput = h('input', { type: 'url', placeholder: 'Paste a YouTube link' });

    function addImages(files) {
      var arr = Array.from(files || []);
      if (!arr.length) return;
      status.textContent = 'Uploading ' + arr.length + (arr.length > 1 ? ' images…' : ' image…');
      arr.reduce(function (chain, f) {
        return chain.then(function () {
          var fd = new FormData(); fd.append('file', f);
          return api('/api/admin/upload', { method: 'POST', body: fd }).then(function (r) { p.media.push({ type: 'image', src: r.url, alt: '', caption: '' }); });
        });
      }, Promise.resolve()).then(function () { status.textContent = ''; changed(); draw(); toast('Uploaded.'); })
        .catch(function (e) { status.textContent = ''; toast(e.message, true); draw(); });
    }
    function draw() {
      var firstImg = p.media.findIndex(function (m) { return m.type === 'image'; });
      var grid = h('div', { class: 'media' }, p.media.map(function (m, i) {
        var thumb = m.type === 'youtube'
          ? h('div', { class: 'tile__img' }, h('img', { src: 'https://i.ytimg.com/vi/' + m.id + '/hqdefault.jpg', alt: '' }))
          : h('div', { class: 'tile__img' }, /^(\/|https:\/\/)/.test(m.src || '') ? h('img', { src: m.src, alt: '' }) : 'Invalid image link');
        return h('div', { class: 'tile' },
          thumb,
          i === firstImg ? h('span', { class: 'badge' }, 'Card + header') : h('span', { class: 'badge', style: 'background:var(--panel2);color:var(--mut)' }, m.type === 'youtube' ? 'YouTube' : 'Image'),
          h('input', { type: 'text', placeholder: m.type === 'youtube' ? 'Video title' : 'Describe the image (for screen readers)', value: (m.type === 'youtube' ? m.title : m.alt) || '', oninput: function (e) { if (m.type === 'youtube') m.title = e.target.value; else m.alt = e.target.value; changed(); } }),
          h('input', { type: 'text', placeholder: 'Caption (optional)', value: m.caption || '', oninput: function (e) { m.caption = e.target.value; changed(); } }),
          h('div', { class: 'row-actions' },
            h('button', { class: 'btn btn--sm', type: 'button', 'aria-label': 'Move earlier', onclick: function () { move(p.media, i, -1); changed(); draw(); } }, '←'),
            h('button', { class: 'btn btn--sm', type: 'button', 'aria-label': 'Move later', onclick: function () { move(p.media, i, 1); changed(); draw(); } }, '→'),
            h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { p.media.splice(i, 1); changed(); draw(); } }, 'Remove')));
      }));
      var drop = h('div', { class: 'drop' }, 'Drag images here, or use the buttons below.');
      ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
      drop.addEventListener('drop', function (e) { addImages(e.dataTransfer.files); });
      rc(box, 
        h('span', { class: 'lbl' }, 'Images & videos'),
        p.media.length ? grid : h('p', { class: 'empty' }, 'No images yet. The site shows the artwork until you add one.'),
        drop,
        h('div', { class: 'row-actions' },
          h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { fileInput.click(); } }, '+ Upload images'),
          h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { pickFromLibrary(function (url) { p.media.push({ type: 'image', src: url, alt: '', caption: '' }); changed(); draw(); }); } }, 'Choose from library')),
        h('div', { class: 'row-actions', style: 'align-items:center' },
          h('div', { style: 'flex:1;min-width:220px' }, ytInput),
          h('button', { class: 'btn btn--sm', type: 'button', onclick: function () {
            var id = ytId(ytInput.value);
            if (!id) { toast('That does not look like a YouTube link.', true); return; }
            p.media.push({ type: 'youtube', id: id, title: '', caption: '' }); ytInput.value = ''; changed(); draw();
          } }, '+ Add YouTube video')),
        status, fileInput);
    }
    fileInput.addEventListener('change', function () { addImages(fileInput.files); fileInput.value = ''; });
    draw();
    return box;
  }

  function pickFromLibrary(done) {
    var overlay = h('div', { style: 'position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.75);display:grid;place-items:center;padding:20px' });
    var panel = h('div', { class: 'card', style: 'width:min(860px,100%);max-height:86vh;overflow:auto' });
    overlay.append(panel);
    function close() { overlay.remove(); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    panel.append(h('div', { class: 'card__head' }, h('h2', {}, 'Image library'), h('button', { class: 'btn btn--sm', type: 'button', onclick: close }, 'Close')), h('p', { class: 'empty' }, 'Loading…'));
    document.body.append(overlay);
    api('/api/admin/media').then(function (r) {
      var body = r.items.length
        ? h('div', { class: 'media' }, r.items.map(function (it) {
          return h('button', { class: 'tile', type: 'button', style: 'cursor:pointer;text-align:left', onclick: function () { done(it.url); close(); } }, h('div', { class: 'tile__img' }, h('img', { src: it.url, alt: '' })), h('span', { class: 'hint mono' }, it.key.replace('uploads/', '')));
        }))
        : h('p', { class: 'empty' }, 'Nothing uploaded yet.');
      panel.lastChild.replaceWith(body);
    }).catch(function (e) { panel.lastChild.replaceWith(h('p', { class: 'err' }, e.message)); });
  }

  // About
  function pageAbout() {
    var a = state.content.about, F = fieldsFor('about');
    var wrapEl = h('div', { class: 'page' });
    function draw() {
      rc(wrapEl, 
        pageHead('About page', 'Everything in the About section of the home page.', resetButton(['about'], 'the About page')),
        h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Opening')),
          F.text('Section label', a, 'kicker'), F.area('Big headline', a, 'intro', { rows: 2 }), F.area('Line under it', a, 'me', { rows: 2 })),
        h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Numbers'), h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { a.facts.push({ n: 0, suffix: '', t: '' }); markDirty('about'); draw(); } }, '+ Add')),
          h('p', { class: 'hint' }, 'Numbers count up when scrolled into view. Use any symbol (like ∞) to show it as is.'),
          a.facts.map(function (f, i) {
            return h('div', { class: 'grid3', style: 'align-items:end' },
              F.text('Number', f, 'n', { set: function (v) { f.n = /^\d+$/.test(v.trim()) ? Number(v) : v; } }),
              F.text('After the number', f, 'suffix', { placeholder: '+' }),
              h('div', { style: 'display:flex;gap:8px;align-items:end' }, h('div', { style: 'flex:1;min-width:0' }, F.text('Label', f, 't')),
                h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { a.facts.splice(i, 1); markDirty('about'); draw(); } }, '×')));
          })),
        h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'How I think'), h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { a.think.rows.push({ old: '', now: '' }); markDirty('about'); draw(); } }, '+ Add a statement')),
          F.text('Section label', a.think, 'kicker'),
          h('p', { class: 'hint' }, 'Left is the default (gets crossed out). Right is your answer. Wrap words in *stars* to make them lime.'),
          a.think.rows.map(function (r, i) {
            return h('div', { class: 'item__body', style: 'border:1px solid var(--line);border-radius:14px;padding:14px' },
              F.text('The default', r, 'old'), F.area('What you do instead', r, 'now', { rows: 2 }),
              h('div', { class: 'row-actions' },
                h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(a.think.rows, i, -1); markDirty('about'); draw(); } }, '↑'),
                h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { move(a.think.rows, i, 1); markDirty('about'); draw(); } }, '↓'),
                h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { a.think.rows.splice(i, 1); markDirty('about'); draw(); } }, 'Delete')));
          })),
        h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Human first, AI enabled')),
          F.text('Section label', a.ai, 'kicker'),
          F.area('The big sentence', a.ai, 'line', { rows: 3 }),
          F.text('Part to highlight in lime', a.ai, 'key', { hint: 'Copy the exact words from the sentence above, including punctuation.' }),
          F.area('Line underneath', a.ai, 'note', { rows: 2 })));
    }
    draw();
    return wrapEl;
  }

  // Hero, contact, site
  function pageSite() {
    var C = state.content, Fh = fieldsFor('hero'), Fw = fieldsFor('workIntro'), Fc = fieldsFor('contact'), Fs = fieldsFor('site');
    return h('div', { class: 'page' },
      pageHead('Hero & contact', 'The first screen, the Work intro, the contact section and your links.', resetButton(['hero', 'workIntro', 'contact', 'site'], 'these sections')),
      h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Home screen')),
        Fh.text('Line under the headline', C.hero, 'sub'),
        Fw.area('Intro above the project cards', C, 'workIntro', { rows: 3 })),
      h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Contact section')),
        Fc.text('Heading', C.contact, 'heading'), Fc.area('Line under it', C.contact, 'body', { rows: 3 })),
      h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'You & your links')),
        h('div', { class: 'grid2' }, Fs.text('Name', C.site, 'name'), Fs.text('Title under your name', C.site, 'role')),
        h('div', { class: 'grid2' }, Fs.text('Email', C.site, 'email'), Fs.text('LinkedIn URL', C.site, 'linkedin', { type: 'url' })),
        h('div', { class: 'grid2' }, Fs.text('GitHub URL (optional)', C.site, 'github', { type: 'url' }), Fs.text('Résumé link (optional)', C.site, 'resume', { hint: 'Upload a PDF elsewhere, or add one to the site files, then paste its link.' })),
        Fs.text('Browser tab title', C.site, 'title'), Fs.area('Search and sharing description', C.site, 'description', { rows: 2 })));
  }

  // Stanley
  function pageStanley() {
    var F = fieldsFor('knowledge');
    var root = state.content, ta;
    var count = h('span', { class: 'hint mono' });
    function upd() { count.textContent = root.knowledge.length.toLocaleString('en-US') + ' characters'; }
    ta = h('textarea', { rows: 26, style: 'font-family:var(--mono);font-size:13.5px', oninput: function () { root.knowledge = ta.value; markDirty('knowledge'); upd(); } });
    ta.value = root.knowledge; upd();
    return h('div', { class: 'page' },
      pageHead("Stanley's knowledge", 'The chat assistant answers only from this text. Add facts, fix wording, or delete anything you do not want it to say. Changes apply to the next question.', resetButton(['knowledge'], "Stanley's knowledge")),
      !state.session.hasChatKey ? h('p', { class: 'err' }, 'The chat is not switched on yet: add ANTHROPIC_API_KEY as a secret in Cloudflare.') : null,
      h('div', { class: 'card' }, h('div', { class: 'field' }, h('label', {}, 'What Stanley knows'), ta, count)));
  }

  // Media library
  function pageMedia() {
    var wrapEl = h('div', { class: 'page' });
    var fileInput = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif', multiple: true, hidden: true });
    function load() {
      return api('/api/admin/media').then(function (r) { state.media = r.items; draw(); }).catch(function (e) { toast(e.message, true); });
    }
    function draw() {
      rc(wrapEl, 
        pageHead('Image library', 'Everything you have uploaded. Add images to a project from the Projects page.', h('button', { class: 'btn btn--lime', type: 'button', onclick: function () { fileInput.click(); } }, '+ Upload images')),
        state.media && state.media.length
          ? h('div', { class: 'media' }, state.media.map(function (it) {
            return h('div', { class: 'tile' }, h('div', { class: 'tile__img' }, h('img', { src: it.url, alt: '' })),
              h('span', { class: 'hint mono' }, it.key.replace('uploads/', '') + ' · ' + Math.round(it.size / 1024) + ' KB'),
              h('div', { class: 'row-actions' },
                h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { navigator.clipboard && navigator.clipboard.writeText(location.origin + it.url).then(function () { toast('Link copied.'); }); } }, 'Copy link'),
                h('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: function () { if (confirm('Delete this image? Any project using it will show a broken image.')) api('/api/admin/media?key=' + encodeURIComponent(it.key), { method: 'DELETE' }).then(load).catch(function (e) { toast(e.message, true); }); } }, 'Delete')));
          }))
          : h('p', { class: 'empty' }, state.media ? 'No images yet.' : 'Loading…'),
        fileInput);
    }
    fileInput.addEventListener('change', function () {
      var files = Array.from(fileInput.files); fileInput.value = '';
      files.reduce(function (c, f) { return c.then(function () { var fd = new FormData(); fd.append('file', f); return api('/api/admin/upload', { method: 'POST', body: fd }); }); }, Promise.resolve())
        .then(function () { toast('Uploaded.'); return load(); }).catch(function (e) { toast(e.message, true); });
    });
    draw(); load();
    return wrapEl;
  }

  // Analytics
  var SECTION_LABELS = { about: 'About', 'how-i-think': 'How I think', 'human-first': 'Human first', work: 'Work', history: 'History', contact: 'Contact' };
  var CLICK_LABELS = { email: 'Email button', linkedin: 'LinkedIn', github: 'GitHub', resume: 'Résumé', 'lets-talk': "Let's talk", 'chat-open': 'Opened Stanley chat', 'ask-stanley': '"or ask Stanley" link', 'video-play': 'Played a video' };

  function barList(items, labelFn, total) {
    if (!items || !items.length) return h('p', { class: 'empty' }, 'Nothing yet.');
    var max = Math.max.apply(null, items.map(function (i) { return i.n; })) || 1;
    return h('div', { class: 'bars' }, items.map(function (i) {
      var pct = Math.max(2, Math.round(i.n / (total || max) * 100));
      return h('div', { class: 'bar' }, h('span', { class: 'bar__name' }, labelFn ? labelFn(i.name) : (i.name || 'Unknown')), h('span', { class: 'bar__n' }, num(i.n)),
        h('div', { class: 'bar__track' }, h('div', { class: 'bar__fill', style: 'width:' + Math.min(100, pct) + '%' })));
    }));
  }

  function chartSvg(series) {
    var W = 900, H = 240, L = 44, R = 12, T = 14, B = 30;
    var max = Math.max.apply(null, series.map(function (s) { return s.views; }).concat([1]));
    var step = max <= 5 ? 1 : max <= 10 ? 2 : Math.pow(10, Math.floor(Math.log10(max))) * (max / Math.pow(10, Math.floor(Math.log10(max))) <= 2 ? 0.5 : max / Math.pow(10, Math.floor(Math.log10(max))) <= 5 ? 1 : 2);
    var top = Math.ceil(max / step) * step;
    var x = function (i) { return L + (i + 0.5) * ((W - L - R) / series.length); };
    var y = function (v) { return T + (1 - v / top) * (H - T - B); };
    var bw = Math.max(2, Math.min(22, (W - L - R) / series.length * 0.62));
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'chart'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Daily page views and visitors');
    function el(n, a, txt) { var e = document.createElementNS(NS, n); Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); }); if (txt != null) e.textContent = txt; svg.append(e); return e; }
    for (var v = 0; v <= top; v += step) {
      el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: 'rgba(255,255,255,.1)' });
      el('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', fill: 'rgba(255,255,255,.6)', 'font-size': 11, 'font-family': 'DM Mono, monospace' }, v);
    }
    series.forEach(function (s, i) {
      if (s.views) el('rect', { x: x(i) - bw / 2, y: y(s.views), width: bw, height: y(0) - y(s.views), rx: 2, fill: '#b6ff3d' });
    });
    var pts = series.map(function (s, i) { return x(i) + ',' + y(s.visitors); }).join(' ');
    el('polyline', { points: pts, fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-linejoin': 'round' });
    [0, Math.floor((series.length - 1) / 2), series.length - 1].forEach(function (i) {
      el('text', { x: x(i), y: H - 8, 'text-anchor': i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle', fill: 'rgba(255,255,255,.6)', 'font-size': 11, 'font-family': 'DM Mono, monospace' }, series[i].day.slice(5));
    });
    return svg;
  }

  function pageOverview() {
    var wrapEl = h('div', { class: 'page' });
    var range = h('select', { 'aria-label': 'Date range', style: 'width:auto', onchange: function () { state.days = Number(range.value); load(); } },
      [[7, 'Last 7 days'], [30, 'Last 30 days'], [90, 'Last 90 days']].map(function (o) { return h('option', { value: o[0], selected: o[0] === state.days }, o[1]); }));
    function load() {
      rc(wrapEl, pageHead('Overview', 'Who is visiting and what they look at. No cookies, no IP addresses stored.', range), h('p', { class: 'empty' }, 'Loading…'));
      api('/api/admin/analytics?days=' + state.days).then(function (a) { state.analytics = a; draw(); })
        .catch(function (e) { rc(wrapEl, pageHead('Overview', '', range), h('p', { class: 'err' }, e.message)); });
    }
    function draw() {
      var a = state.analytics;
      var contactClicks = (a.clicks || []).filter(function (c) { return ['email', 'linkedin', 'lets-talk', 'github', 'resume'].indexOf(c.name) > -1; }).reduce(function (s, c) { return s + c.n; }, 0);
      var contactSec = (a.sections || []).filter(function (s) { return s.name === 'contact'; })[0];
      rc(wrapEl, 
        pageHead('Overview', 'Who is visiting and what they look at. No cookies, no IP addresses stored.', range),
        h('div', { class: 'kpis' },
          kpi(num(a.views), 'Page views'), kpi(num(a.visitors), 'Visitors'), kpi(num(contactSec ? contactSec.people : 0), 'Reached contact'), kpi(num(contactClicks), 'Contact clicks'), kpi(num((a.chats || []).length) + ((a.chats || []).length >= 50 ? '+' : ''), 'Chat questions')),
        h('div', { class: 'card' }, h('div', { class: 'card__head' }, h('h2', {}, 'Traffic'), h('span', { class: 'hint mono' }, 'Bars: page views · Line: visitors')),
          a.views ? chartSvg(a.series) : h('p', { class: 'empty' }, 'No visits recorded yet. Open your live site in another tab and refresh this page.')),
        h('div', { class: 'lists' },
          h('div', { class: 'card' }, h('h2', {}, 'How far people scroll'), barList((a.sections || []).sort(function (x, y) { return Object.keys(SECTION_LABELS).indexOf(x.name) - Object.keys(SECTION_LABELS).indexOf(y.name); }).map(function (s) { return { name: s.name, n: s.people }; }), function (n) { return SECTION_LABELS[n] || n; }, a.visitors || null)),
          h('div', { class: 'card' }, h('h2', {}, 'Projects opened'), barList(a.projects, function (n) { var p = state.content.projects.filter(function (p) { return p.id === n; })[0]; return p ? p.title : n; })),
          h('div', { class: 'card' }, h('h2', {}, 'Clicks'), barList(a.clicks, function (n) { return CLICK_LABELS[n] || n; })),
          h('div', { class: 'card' }, h('h2', {}, 'Where they came from'), barList(a.referrers.length ? a.referrers : null, null)),
          h('div', { class: 'card' }, h('h2', {}, 'Countries'), barList(a.countries)),
          h('div', { class: 'card' }, h('h2', {}, 'Devices'), barList(a.devices))),
        h('div', { class: 'card' }, h('h2', {}, 'What people asked Stanley'),
          a.chats.length ? h('div', { class: 'qa' }, a.chats.map(function (c) { return h('div', {}, h('time', {}, new Date(c.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + (c.country ? ' · ' + c.country : '')), h('span', {}, c.name)); })) : h('p', { class: 'empty' }, 'No questions yet. This list shows the questions only, never who asked.')));
    }
    function kpi(v, label) { return h('div', { class: 'kpi' }, h('b', {}, v), h('span', {}, label)); }
    load();
    return wrapEl;
  }

  // ---------- shell / routing ----------
  function render() {
    saveBar = saveMsg = saveBtn = null;
    if (!state.session) { app.replaceChildren(h('p', { class: 'empty', style: 'padding:40px' }, 'Loading…')); return; }
    if (!state.session.signedIn) { app.replaceChildren(loginView()); return; }
    if (!state.content) { app.replaceChildren(h('p', { class: 'empty', style: 'padding:40px' }, 'Loading your content…')); return; }

    var main = h('main', { class: 'main', id: 'main' });
    var builders = { overview: pageOverview, history: pageHistory, projects: pageProjects, about: pageAbout, site: pageSite, stanley: pageStanley, media: pageMedia };
    main.append(builders[state.page]());

    saveMsg = h('span', {});
    saveBtn = h('button', { class: 'btn btn--lime', type: 'button', onclick: saveAll }, 'Save changes');
    saveBar = h('div', { class: 'savebar', hidden: true }, saveMsg, h('div', { class: 'row-actions' },
      h('button', { class: 'btn', type: 'button', onclick: function () { if (confirm('Discard all unsaved changes?')) { state.dirty.clear(); loadContent().then(render); } } }, 'Discard'), saveBtn));

    var side = h('nav', { class: 'side', 'aria-label': 'Admin' },
      h('div', { class: 'side__brand' }, 'Portfolio admin', h('span', {}, 'Drew Burton')),
      PAGES.map(function (p) {
        return h('button', { class: 'nav', type: 'button', 'data-nav': p[0], 'aria-current': state.page === p[0] ? 'page' : false, onclick: function () { state.page = p[0]; location.hash = p[0]; render(); } }, p[1]);
      }),
      h('div', { class: 'side__foot' },
        h('a', { href: '/', target: '_blank', rel: 'noopener' }, 'View live site ↗'),
        h('button', { class: 'btn btn--sm', type: 'button', onclick: function () { api('/api/admin/logout', { method: 'POST' }).then(function () { state.session.signedIn = false; state.content = null; render(); }); } }, 'Sign out')));

    app.replaceChildren(h('div', { class: 'shell' }, side, main), saveBar);
    chrome();
    window.scrollTo(0, 0);
  }

  function loginView() {
    var s = state.session;
    var pw = h('input', { type: 'password', id: 'pw', autocomplete: 'current-password', required: true, 'aria-label': 'Password' });
    var err = h('p', { class: 'err' });
    var form = h('form', { class: 'login__box', onsubmit: function (e) {
      e.preventDefault(); err.textContent = '';
      api('/api/admin/login', { method: 'POST', body: { password: pw.value } })
        .then(function () { state.session.signedIn = true; return loadContent(); }).then(render)
        .catch(function (x) { err.textContent = x.message; });
    } },
      h('h1', {}, 'Portfolio admin'),
      s.configured ? h('p', { class: 'dim' }, 'Sign in to edit your site and see analytics.') : h('p', { class: 'err' }, 'Setup needed: add ADMIN_PASSWORD and SESSION_SECRET as secrets in Cloudflare, then redeploy. The README has the steps.'),
      h('div', { class: 'field' }, h('label', { for: 'pw' }, 'Password'), pw), err,
      h('button', { class: 'btn btn--lime', type: 'submit', disabled: !s.configured }, 'Sign in'));
    return h('div', { class: 'login' }, form);
  }

  function loadContent() {
    return api('/api/admin/content').then(function (r) { state.content = r.content; state.defaults = r.defaults; state.saved = r.saved; });
  }

  var hash = location.hash.replace('#', '');
  if (PAGES.some(function (p) { return p[0] === hash; })) state.page = hash;
  fetch('/api/admin/session', { credentials: 'same-origin' }).then(function (r) { return r.json(); })
    .then(function (s) { state.session = s; render(); return s.signedIn ? loadContent().then(render) : null; })
    .catch(function () { state.session = { signedIn: false, configured: false }; render(); });
})();
