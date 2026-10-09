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
      el.__t = ease(clamp((vh - r.top) / (vh * 1.8)));
      el.__top = r.top;
      el.__mid = r.top + r.height / 2;
      if (el.__p === undefined) el.__p = el.__t;
    });
  }
  function growPaint() {
    var vh = window.innerHeight, busy = false;
    grow.forEach(function (el) {
      var d = el.__t - el.__p;
      if (Math.abs(d) > 0.0004) { el.__p += d * 0.07; busy = true; } else { el.__p = el.__t; }
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
})();
