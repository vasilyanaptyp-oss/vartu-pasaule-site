/* Vārtu pasaule - progressive enhancement only.
   Nothing here is required to read the site: reveals are handled inline
   with a hard failsafe, and every section renders without JavaScript. */
(function () {
  'use strict';

  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile drawer ---------- */
  var burger = d.getElementById('burger');
  var mnav = d.getElementById('mnav');

  function closeNav() {
    if (!burger || !mnav) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Atvērt izvēlni');
    mnav.hidden = true;
    d.body.style.overflow = '';
  }
  function openNav() {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Aizvērt izvēlni');
    mnav.hidden = false;
    d.body.style.overflow = 'hidden';
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') closeNav(); else openNav();
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        closeNav();
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1060) closeNav();
    });
  }

  /* ---------- counters ---------- */
  var nums = Array.prototype.slice.call(d.querySelectorAll('.num'));
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    var run = function (el) {
      var to = parseFloat(el.getAttribute('data-to'));
      if (isNaN(to)) return;
      var dur = 1000, t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = to;
      };
      requestAnimationFrame(step);
    };
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); nio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { nio.observe(n); });
  }

  /* ======================================================================
     Gate-type preselection.
     A "Pieteikums šim veidam" button can live on any page. If the form is
     on the same page we set the select directly; if it is on another page
     we carry the type in the URL hash query and read it on arrival.
     ====================================================================== */
  var veids = d.getElementById('f-veids');

  function selectType(want) {
    if (!veids || !want) return false;
    for (var i = 0; i < veids.options.length; i++) {
      var o = veids.options[i];
      if (o.value === want || o.text === want) { veids.selectedIndex = i; return true; }
    }
    return false;
  }

  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-veids]');
    if (!a) return;
    var want = a.getAttribute('data-veids');
    var href = a.getAttribute('href') || '';
    var samePage = href.charAt(0) === '#';

    if (samePage && veids) {
      selectType(want);
      updateSummary();
      var w = d.getElementById('f-w');
      if (w) setTimeout(function () { w.focus({ preventScroll: true }); }, 520);
      return;
    }
    // Cross-page: append the type so the target page can preselect it.
    if (!samePage) {
      e.preventDefault();
      var base = href.split('#')[0];
      var frag = href.split('#')[1] || 'pieteikums';
      window.location.href = base + '#' + frag + '?veids=' + encodeURIComponent(want);
    }
  });

  // On load, read the type out of the hash if it is there.
  (function readHash() {
    if (!veids) return;
    var h = window.location.hash || '';
    var q = h.indexOf('?veids=');
    if (q === -1) return;
    var want = decodeURIComponent(h.slice(q + 7));
    if (selectType(want)) {
      // Clean the URL so the query does not stay in the address bar.
      var clean = h.slice(0, q);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + clean);
      }
      var target = d.getElementById(clean.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 0);
    }
  })();

  /* ---------- live summary ---------- */
  var summary = d.getElementById('summary');
  var fW = d.getElementById('f-w');
  var fH = d.getElementById('f-h');

  function updateSummary() {
    if (!summary) return;
    var v = veids && veids.value ? veids.value : '';
    var w = fW && fW.value ? parseInt(fW.value, 10) : null;
    var h = fH && fH.value ? parseInt(fH.value, 10) : null;
    var parts = [];
    parts.push(v ? v : 'veids nav izvēlēts');
    if (w && h) parts.push(w + ' × ' + h + ' mm');
    else if (w) parts.push('platums ' + w + ' mm');
    else if (h) parts.push('augstums ' + h + ' mm');
    summary.textContent = 'Pieteikums: ' + parts.join(', ');
  }
  [veids, fW, fH].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', updateSummary);
    el.addEventListener('change', updateSummary);
  });
  updateSummary();

  /* ---------- form validation ---------- */
  var frm = d.getElementById('frm');
  var done = d.getElementById('done');
  var again = d.getElementById('again');
  var status = d.getElementById('frm-status');

  function setErr(input, errEl, bad) {
    if (!input || !errEl) return;
    if (bad) { input.setAttribute('aria-invalid', 'true'); errEl.hidden = false; }
    else { input.removeAttribute('aria-invalid'); errEl.hidden = true; }
  }

  if (frm) {
    var name = d.getElementById('f-name');
    var tel = d.getElementById('f-tel');
    var mail = d.getElementById('f-mail');
    var gdpr = d.getElementById('f-gdpr');
    var eName = d.getElementById('e-name');
    var eTel = d.getElementById('e-tel');
    var eMail = d.getElementById('e-mail');
    var eGdpr = d.getElementById('e-gdpr');
    var mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var telOk = function (v) { return v.replace(/\D/g, '').length >= 8; };

    var checks = [
      [name, eName, function () { return !name.value.trim(); }],
      [tel, eTel, function () { return !telOk(tel.value); }],
      [mail, eMail, function () { return mail.value.trim() !== '' && !mailRe.test(mail.value.trim()); }],
      [gdpr, eGdpr, function () { return !gdpr.checked; }]
    ];

    checks.forEach(function (c) {
      if (!c[0]) return;
      var ev = c[0].type === 'checkbox' ? 'change' : 'blur';
      c[0].addEventListener(ev, function () { setErr(c[0], c[1], c[2]()); });
      c[0].addEventListener('input', function () {
        if (c[0].getAttribute('aria-invalid') === 'true') setErr(c[0], c[1], c[2]());
      });
    });

    frm.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      checks.forEach(function (c) {
        if (!c[0]) return;
        var bad = c[2]();
        setErr(c[0], c[1], bad);
        if (bad && !first) first = c[0];
      });
      if (first) {
        if (status) status.textContent = 'Formā ir kļūdas. Pārbaudiet atzīmētos laukus.';
        first.focus();
        return;
      }
      frm.hidden = true;
      if (status) status.textContent = 'Pieteikums aizpildīts pareizi. Skatiet atbildi zemāk.';
      if (done) {
        done.hidden = false;
        done.setAttribute('tabindex', '-1');
        done.focus({ preventScroll: true });
      }
    });
  }

  if (again && frm && done) {
    again.addEventListener('click', function () {
      done.hidden = true;
      frm.hidden = false;
      frm.reset();
      if (status) status.textContent = '';
      updateSummary();
      var n = d.getElementById('f-name');
      if (n) n.focus();
    });
  }
})();
