(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  // ---- hero entrance + squiggle length -----------------------------------
  $('[data-heroword]').forEach(function (w, i) { w.style.setProperty('--i', i); });
  $('.squiggle path').forEach(function (p) { p.setAttribute('pathLength', '1'); });
  requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('ready'); }); });

  // ---- scroll reveals -----------------------------------------------------
  var revealEls = $('[data-reveal]');
  revealEls.forEach(function (el, i) { el.style.setProperty('--d', (i % 3) * 90 + 'ms'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $('.hl', e.target).forEach(function (h) { h.classList.add('in'); });
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- scroll spy for the dot rail ---------------------------------------
  var dots = $('[data-navdot]');
  var ids = ['top', 'about', 'work', 'history', 'contact'];
  function spy() {
    if (document.body.classList.contains('is-project')) return;
    var mid = window.pageYOffset + window.innerHeight * 0.38, cur = 'top';
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.pageYOffset <= mid) cur = id;
    });
    if (cur === 'history') cur = 'work';
    dots.forEach(function (d) { d.classList.toggle('is-on', d.getAttribute('data-navdot') === cur); });
  }
  var spyQueued = false;
  window.addEventListener('scroll', function () {
    if (spyQueued) return;
    spyQueued = true;
    requestAnimationFrame(function () { spyQueued = false; spy(); maskTexture(); });
  }, { passive: true });
  spy();

  // ---- texture: knock a hole where the white work section is -------------
  var tex = document.querySelector('[data-texture]');
  var zone = document.querySelector('[data-notexture]');
  var lastMask = '';
  function maskTexture() {
    if (!tex || !zone) return;
    var r = zone.getBoundingClientRect();
    var top = Math.max(0, r.top), bot = Math.min(window.innerHeight, r.bottom), mask = 'none';
    if (bot > top) {
      mask = 'linear-gradient(to bottom,#000 0 ' + top.toFixed(1) + 'px,transparent ' + top.toFixed(1) + 'px ' + bot.toFixed(1) + 'px,#000 ' + bot.toFixed(1) + 'px 100%)';
    }
    if (mask === lastMask) return;
    lastMask = mask;
    tex.style.webkitMaskImage = mask;
    tex.style.maskImage = mask;
  }
  maskTexture();
  window.addEventListener('resize', maskTexture);

  // ---- project cards grow and settle as they scroll in -------------------
  var grow = $('[data-grow]');
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  // Scroll sets a target for each card; the card eases toward it, so the growth
  // trails the scroll a little and feels slower and smoother.
  function growTargets() {
    var vh = window.innerHeight;
    grow.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.__t = ease(clamp((vh - r.top) / (vh * 1.5)));
      el.__top = r.top;
      el.__mid = r.top + r.height / 2;
      if (el.__p === undefined) el.__p = el.__t;
    });
  }
  function growPaint() {
    var vh = window.innerHeight, busy = false;
    grow.forEach(function (el) {
      var d = el.__t - el.__p;
      if (Math.abs(d) > 0.0004) { el.__p += d * 0.12; busy = true; } else { el.__p = el.__t; }
      var p = el.__p;
      el.style.transform = 'translate3d(0,' + ((1 - p) * 40).toFixed(1) + 'px,0) rotateX(' + ((1 - p) * 6).toFixed(2) + 'deg) scale(' + (0.5 + 0.5 * p).toFixed(4) + ')';
      el.style.opacity = (0.15 + 0.85 * clamp(p * 1.6)).toFixed(3);
      var art = el.querySelector('.art');
      if (art) art.style.transform = 'scale(' + (1.3 - 0.3 * p).toFixed(4) + ') translateY(' + ((el.__top - vh / 2) * -0.06).toFixed(1) + 'px)';
      el.style.setProperty('--g', (1 - 0.85 * clamp(1 - Math.abs(el.__mid - vh / 2) / (vh * 0.45))).toFixed(2));
    });
    return busy;
  }
  var growRaf = 0;
  function growLoop() {
    growRaf = 0;
    growTargets();
    if (growPaint()) growRaf = requestAnimationFrame(growLoop);
  }
  function growKick() { if (!growRaf) growRaf = requestAnimationFrame(growLoop); }
  if (grow.length && !reduce) {
    window.addEventListener('scroll', growKick, { passive: true });
    window.addEventListener('resize', growKick);
    growLoop();
  } else {
    grow.forEach(function (el) { el.style.opacity = 1; });
  }

  // ---- arrows bob --------------------------------------------------------
  if (!reduce) $('[data-arrow]').forEach(function (el, i) { el.style.animation = 'bob 2.8s ease-in-out ' + (i % 4) * 0.25 + 's infinite'; });

  // ---- header face follows the cursor ------------------------------------
  var face = document.querySelector('[data-face]');
  var ow = document.querySelector('[data-ow]');
  if (face && fine && !reduce) {
    var img = face.firstElementChild;
    window.addEventListener('mousemove', function (e) {
      var r = face.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy);
      if (d > 190) { face.style.transform = ''; img.style.transform = ''; img.style.filter = ''; return; }
      var k = 1 - d / 190, ux = dx / (d || 1), uy = dy / (d || 1);
      face.style.transform = 'translate(' + (ux * 7 * k).toFixed(2) + 'px,' + (uy * 7 * k).toFixed(2) + 'px) rotate(' + (ux * 11 * k).toFixed(2) + 'deg) scale(' + (1 + 0.14 * k).toFixed(3) + ')';
      img.style.transform = 'translate(' + (ux * 5 * k).toFixed(2) + 'px,' + (uy * 5 * k).toFixed(2) + 'px) scale(' + (1 + 0.08 * k).toFixed(3) + ')';
      img.style.filter = 'saturate(' + (1 + 0.5 * k).toFixed(2) + ')';
    });
    face.addEventListener('mouseenter', function () { ow.classList.remove('pop'); void ow.offsetWidth; ow.classList.add('pop'); });
    face.addEventListener('mouseleave', function () { ow.classList.remove('pop'); ow.style.opacity = 0; });
  }

  // ---- custom cursor + magnetic buttons (fine pointers only) -------------
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    var blob = document.querySelector('[data-blob]');
    var S = { x: 0, y: 0, mx: 0, my: 0, in: false, card: false };
    var mags = $('[data-magnet]').map(function (el) {
      var m = { el: el, x: 0, y: 0, tx: 0, ty: 0 };
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        m.tx = (e.clientX - (r.left + r.width / 2)) * 0.26;
        m.ty = (e.clientY - (r.top + r.height / 2)) * 0.32;
      });
      el.addEventListener('mouseleave', function () { m.tx = 0; m.ty = 0; });
      return m;
    });
    window.addEventListener('mousemove', function (e) {
      S.mx = e.clientX; S.my = e.clientY;
      if (!S.in) { S.x = S.mx; S.y = S.my; }
      S.in = true;
      var t = e.target, c = t.closest ? t : t.parentElement;
      S.card = !!c.closest('[data-card]');
      blob.classList.toggle('is-card', S.card);
      blob.classList.toggle('is-cta', !S.card && !!c.closest('[data-magnet]'));
      blob.classList.toggle('on-light', !!c.closest('[data-light]'));
      blob.classList.toggle('on-lime', !!c.closest('[data-onlime]'));
    });
    document.addEventListener('mouseleave', function () { S.in = false; });
    (function tick() {
      var ease = S.card ? 0.2 : 0.42;
      S.x = lerp(S.x, S.mx, ease); S.y = lerp(S.y, S.my, ease);
      blob.style.transform = 'translate3d(' + S.x.toFixed(1) + 'px,' + S.y.toFixed(1) + 'px,0)';
      blob.style.opacity = S.in ? '1' : '0';
      mags.forEach(function (m) {
        m.x = lerp(m.x, m.tx, 0.14); m.y = lerp(m.y, m.ty, 0.14);
        m.el.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px,0)';
      });
      requestAnimationFrame(tick);
    })();
  }

  // ---- about: intro words lift toward the pointer -----------------------
  var intro = document.querySelector('[data-intro]');
  if (intro && !reduce) {
    var pws = $('.pw', intro), pwRaf = 0, pwX = 0, pwY = 0, pwTimer = 0;
    var pwPaint = function (on) {
      pwRaf = 0;
      pws.forEach(function (w) {
        if (!on) { w.style.setProperty('--k', 0); return; }
        var r = w.getBoundingClientRect();
        var d = Math.hypot(pwX - (r.left + r.width / 2), pwY - (r.top + r.height / 2));
        w.style.setProperty('--k', clamp(1 - d / 170).toFixed(2));
      });
    };
    var pwMove = function (e) {
      pwX = e.clientX; pwY = e.clientY;
      clearTimeout(pwTimer);
      if (!pwRaf) pwRaf = requestAnimationFrame(function () { pwPaint(true); });
      if (e.pointerType !== 'mouse') pwTimer = setTimeout(function () { pwPaint(false); }, 900);
    };
    intro.addEventListener('pointermove', pwMove);
    intro.addEventListener('pointerdown', pwMove);
    intro.addEventListener('pointerleave', function () { pwPaint(false); });
  }

  // ---- about: numbers count up once ---------------------------------------
  var counters = $('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', t0 = performance.now(), dur = 1500;
        (function step(now) {
          var k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
          el.textContent = fmt(v) + suf;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = '0' + (el.getAttribute('data-suffix') || ''); cio.observe(el); });
  }

  // ---- about: statements animate with the scroll, top to bottom ----------
  var seq = $('[data-seq]');
  if (seq.length && !reduce) {
    var paintSeq = function () {
      var vh = window.innerHeight;
      seq.forEach(function (el) {
        var top = el.getBoundingClientRect().top;
        var p = clamp((vh * 1.0 - top) / (vh * 0.32));
        el.style.setProperty('--s', clamp(p / 0.3).toFixed(3));
        el.style.setProperty('--n', clamp((p - 0.25) / 0.45).toFixed(3));
        el.style.setProperty('--h', clamp((p - 0.7) / 0.3).toFixed(3));
      });
    };
    var seqQueued = false;
    var kickSeq = function () { if (seqQueued) return; seqQueued = true; requestAnimationFrame(function () { seqQueued = false; paintSeq(); }); };
    window.addEventListener('scroll', kickSeq, { passive: true });
    window.addEventListener('resize', kickSeq);
    paintSeq();
  }

  // ---- about: from machine to human --------------------------------------
  var ai = document.querySelector('[data-ai]');
  if (ai) {
    var aws = $('.aw', ai), range = ai.querySelector('.ai__range'), manual = false;
    var paintAi = function (v) {
      var n = aws.length;
      aws.forEach(function (w, i) {
        var t = clamp((v - (i / n) * 0.72) / 0.28);
        w.classList.toggle('warm', t > 0.5);
        w.style.transform = t > 0.5 && !reduce ? 'translateY(' + (((i % 2) ? -1 : 1) * t * 3).toFixed(1) + 'px) rotate(' + (((i % 3) - 1) * t * 2.2).toFixed(2) + 'deg)' : '';
      });
    };
    var scrollAi = function () {
      if (manual || reduce) return;
      var r = ai.querySelector('.ai__line').getBoundingClientRect();
      var v = clamp((window.innerHeight * 0.92 - r.top) / (window.innerHeight * 0.55));
      range.value = Math.round(v * 100);
      paintAi(v);
    };
    range.addEventListener('input', function () { manual = true; paintAi(range.value / 100); });
    if (reduce) { range.value = 100; paintAi(1); } else {
      window.addEventListener('scroll', function () { requestAnimationFrame(scrollAi); }, { passive: true });
      scrollAi();
    }
  }

  // ---- Stanley: click to chat --------------------------------------------
  function askStanley() {
    var fabBtn = document.querySelector('[data-chat-open]'), pnl = document.querySelector('.chat__panel');
    if (fabBtn && pnl && pnl.hidden) fabBtn.click();
    else if (pnl) { var inp = pnl.querySelector('input'); if (inp) inp.focus(); }
  }
  $('[data-ask-stanley]').forEach(function (b) { b.addEventListener('click', askStanley); });

  // ---- case studies open in place (single page) --------------------------
  var dlg = document.getElementById('case');
  if (dlg) {
    var arts = $('.case__art', dlg), baseTitle = document.title;
    var showCase = function (id, push) {
      var hit = false;
      arts.forEach(function (a) { var on = a.id === 'case-' + id; a.hidden = !on; if (on) { hit = true; document.title = a.getAttribute('data-title') + ' · Drew Burton'; } });
      if (!hit) return;
      if (!dlg.open) { dlg.showModal(); document.body.classList.add('case-open'); }
      dlg.scrollTop = 0;
      if (push) window.history.pushState(null, '', '#work/' + id);
      if (window.__track) window.__track('project', id);
    };
    var hideCase = function (fromHash) {
      if (dlg.open) dlg.close();
      document.body.classList.remove('case-open');
      document.title = baseTitle;
      if (!fromHash && location.hash.indexOf('#work/') === 0) window.history.replaceState(null, '', '#work');
    };
    dlg.addEventListener('close', function () { hideCase(false); });
    dlg.addEventListener('click', function (e) {
      var c = e.target.closest('[data-case-close]'), n = e.target.closest('[data-case-open]');
      if (c) hideCase(false);
      else if (n) showCase(n.getAttribute('data-case-open'), true);
    });
    $('[data-project]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showCase(a.getAttribute('data-project'), true); });
    });
    var fromHash = function () {
      var m = location.hash.match(/^#work\/([\w-]+)$/);
      if (m) showCase(m[1], false); else if (dlg.open) hideCase(true);
    };
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('popstate', fromHash);
    fromHash();
  }

  // ---- cookie-free analytics (no cookies, no IP stored; respects Do Not Track) --
  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  function track(type, name, extra) {
    if (dnt) return;
    try {
      var body = { type: type, name: name || null };
      if (extra) for (var k in extra) body[k] = extra[k];
      fetch('/api/collect', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(function () {});
    } catch (e) { /* ignore */ }
  }
  window.__track = track;
  track('pageview', location.pathname, { ref: document.referrer });
  if ('IntersectionObserver' in window) {
    var secIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        track('section', e.target.getAttribute('data-track'));
        secIo.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    [['#about', 'about'], ['.how', 'how-i-think'], ['.ai', 'human-first'], ['#work', 'work'], ['#history', 'history'], ['#contact', 'contact']].forEach(function (s) {
      var el = document.querySelector(s[0]);
      if (el) { el.setAttribute('data-track', s[1]); secIo.observe(el); }
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a, button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) track('click', 'email');
    else if (/linkedin\.com/i.test(href)) track('click', 'linkedin');
    else if (/github\.com/i.test(href)) track('click', 'github');
    else if (a.hasAttribute('download')) track('click', 'resume');
    else if (a.classList.contains('cta--fixed')) track('click', 'lets-talk');
    else if (a.hasAttribute('data-chat-open')) track('click', 'chat-open');
    else if (a.hasAttribute('data-ask-stanley')) track('click', 'ask-stanley');
  });

  // ---- YouTube: load the player only when asked (no third-party requests until click) --
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-yt]');
    if (!b) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.getAttribute('data-yt')) + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.title = b.getAttribute('aria-label') || 'Video';
    b.replaceWith(f);
    track('click', 'video-play');
  });

  // ---- chat assistant ----------------------------------------------------
  var chat = document.querySelector('[data-chat]');
  if (chat) {
    var fab = chat.querySelector('[data-chat-open]');
    var panel = chat.querySelector('.chat__panel');
    var log = chat.querySelector('[data-chat-log]');
    var form = chat.querySelector('[data-chat-form]');
    var input = form.querySelector('input');
    var send = form.querySelector('button');
    var chips = chat.querySelector('[data-chat-chips]');
    var history = [];
    var busy = false;

    function add(text, cls) {
      var d = document.createElement('div');
      d.className = 'msg ' + cls;
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    function setOpen(open) {
      panel.hidden = !open;
      chat.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        panel.classList.remove('open'); void panel.offsetWidth; panel.classList.add('open');
        if (!log.children.length) add("Hi! I'm Stanley, Drew's dog. Ask me questions about Drew (my owner): his work, his projects, his background.", 'msg--bot');
        input.focus();
      } else { fab.focus(); }
    }
    fab.addEventListener('click', function () { setOpen(panel.hidden); });
    chat.querySelector('[data-chat-close]').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });

    function ask(q) {
      if (busy || !q) return;
      busy = true; send.disabled = true; chips.hidden = true;
      add(q, 'msg--me');
      history.push({ role: 'user', content: q });
      var typing = add('···', 'msg--bot msg--typing');
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; });
      }).then(function (res) {
        typing.remove();
        if (res.ok && res.d.reply) {
          history.push({ role: 'assistant', content: res.d.reply });
          add(res.d.reply, 'msg--bot');
        } else {
          history.pop();
          add(res.d.error || "The assistant isn't available on this preview. It runs on the live site.", 'msg--bot msg--err');
        }
      }).catch(function () {
        typing.remove(); history.pop();
        add("The assistant couldn't be reached. Please try again, or email Drew directly.", 'msg--bot msg--err');
      }).then(function () { busy = false; send.disabled = false; input.focus(); });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      input.value = '';
      ask(q);
    });
    chips.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') ask(e.target.textContent);
    });
  }
})();
