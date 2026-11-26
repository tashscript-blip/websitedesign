// Legacy Grove Codex — Quantumized build
// No external dependencies. All state is local to this page.
(function () {
  'use strict';

  // --- Quantum clock: live local time ---
  var clockEl = document.getElementById('quantum-clock');
  function tickClock() {
    if (!clockEl) return;
    var now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tickClock();
  setInterval(tickClock, 1000);

  // --- Four states ---
  var STATES = {
    '-inf': {
      label: '−∞ Archive', pill: '−∞ archive',
      desc: '−∞ ARCHIVE — preserved, not deleted. The previous Legacy Grove Codex site lives here.'
    },
    'wave': {
      label: '~ Wave', pill: '~ wave',
      desc: '~ WAVE — in progress, work in motion.'
    },
    'zero': {
      label: '0 Hold at Zero', pill: '0 zero',
      desc: '0 ZERO LOCK — the still point. Verified against the source and held — Zero is not empty, Zero is proven.'
    },
    'inf': {
      label: '+∞ Release', pill: '+∞ released',
      desc: '+∞ RELEASED — live, on the founder’s call alone. The only state that cannot be self-declared.'
    }
  };
  var currentState = 'zero';
  var pillEl = document.getElementById('state-pill');
  var descEl = document.getElementById('state-desc');
  var waveField = document.getElementById('wave-field');

  function setState(key) {
    if (!STATES[key]) return;
    currentState = key;
    if (pillEl) pillEl.textContent = STATES[key].pill;
    if (descEl) descEl.textContent = STATES[key].desc;
    document.querySelectorAll('[data-state]').forEach(function (el) {
      el.setAttribute('aria-pressed', el.getAttribute('data-state') === key ? 'true' : 'false');
    });
    if (waveField) waveField.setAttribute('data-state', key);
    // The brief is composed below; keep it in sync so the site state shown
    // in the brief is never stale. The work-order state itself stays ~ WAVE
    // (intake) — see composeBrief.
    if (typeof composeBrief === 'function') composeBrief();
  }
  document.querySelectorAll('[data-state]').forEach(function (el) {
    el.addEventListener('click', function () { setState(el.getAttribute('data-state')); });
  });
  setState('zero');

  // --- Films: captioned placeholders (original generated clips not available as files) ---
  // Each placeholder has a 10-second animated wave. Play/pause toggles the animation and timer.
  document.querySelectorAll('.film').forEach(function (film) {
    var btn = film.querySelector('.play-btn');
    var timer = film.querySelector('.film-timer');
    var visual = film.querySelector('.film-visual');
    var seconds = 0, interval = null, playing = false;
    function render() { if (timer) timer.textContent = '0:' + String(seconds).padStart(2, '0') + ' / 0:10'; }
    function stop() {
      playing = false;
      if (interval) { clearInterval(interval); interval = null; }
      if (btn) btn.textContent = '▶ Play';
      if (visual) visual.classList.add('paused');
    }
    if (btn) btn.addEventListener('click', function () {
      if (playing) { stop(); return; }
      playing = true;
      btn.textContent = '⏸ Pause';
      if (visual) visual.classList.remove('paused');
      interval = setInterval(function () {
        seconds += 1;
        if (seconds >= 10) { seconds = 0; stop(); return; }
        render();
      }, 1000);
    });
    render();
    if (visual) visual.classList.add('paused');
  });

  // --- Service Desk: tier pre-fill + live brief composer ---
  var workOrderNo = 'WG-001';
  var fields = {
    tier: document.getElementById('f-tier'),
    who: document.getElementById('f-who'),
    what: document.getElementById('f-what'),
    when: document.getElementById('f-when'),
    where: document.getElementById('f-where'),
    why: document.getElementById('f-why'),
    how: document.getElementById('f-how')
  };
  var briefEl = document.getElementById('brief-output');
  var routeMap = { 'wave': 'Absorb → Hold at Zero → Focus → Activate' };

  // Draft persistence: a half-written brief survives a reload or a trip
  // to Privacy/Terms and back. Stored in this browser only, never sent.
  var DRAFT_KEY = 'lgc-wg-brief-v1';
  function saveDraft() {
    try {
      var data = {};
      Object.keys(fields).forEach(function (k) { if (fields[k]) data[k] = fields[k].value; });
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) { /* storage unavailable — the brief still works, unsaved */ }
  }
  function restoreDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      Object.keys(fields).forEach(function (k) {
        if (fields[k] && typeof data[k] === 'string') fields[k].value = data[k];
      });
    } catch (e) { /* corrupt or unavailable draft — start blank */ }
  }
  restoreDraft();

  function val(el) { return el && el.value ? el.value.trim() : '—'; }
  function composeBrief() {
    if (!briefEl) return;
    // Work-order state is fixed at intake: a brief always starts at ~ WAVE.
    // The site console state is shown separately, so it is clear the console
    // does not release a work order — +∞ Release is on the founder's call only.
    var siteState = (typeof STATES !== 'undefined' && STATES[currentState]) ? STATES[currentState].pill : '—';
    briefEl.textContent =
      'WORK ORDER ' + workOrderNo + ' — LEGACY GROVE CODEX LLC\n' +
      'State: ~ WAVE (intake) · Route: ' + routeMap.wave + '\n' +
      'Site console state: ' + siteState + ' (does not change this work order)\n' +
      'Tier: ' + val(fields.tier) + '\n' +
      'Who: ' + val(fields.who) + '\n' +
      'What: ' + val(fields.what) + '\n' +
      'When: ' + val(fields.when) + '\n' +
      'Where: ' + val(fields.where) + '\n' +
      'Why: ' + val(fields.why) + '\n' +
      'How: ' + val(fields.how) + '\n' +
      'Send route: PLACEHOLDER — destination undecided. Do not send yet.';
  }
  Object.keys(fields).forEach(function (k) {
    if (fields[k]) fields[k].addEventListener('input', function () { composeBrief(); saveDraft(); });
  });
  // Save on every compose too, so tier pre-fill (which calls composeBrief)
  // is also kept across a reload.
  var _composeBrief = composeBrief;
  composeBrief = function () { _composeBrief(); saveDraft(); };
  composeBrief();

  // Tier links: scroll to Service Desk and pre-fill the tier.
  document.querySelectorAll('[data-tier]').forEach(function (link) {
    link.addEventListener('click', function (ev) {
      // Let the anchor scroll, then pre-fill.
      var tier = link.getAttribute('data-tier');
      setTimeout(function () {
        if (fields.tier) { fields.tier.value = tier; composeBrief(); fields.tier.focus(); }
      }, 50);
    });
  });

  // Copy the brief.
  var copyBtn = document.getElementById('copy-brief');
  var copyStatus = document.getElementById('copy-status');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = briefEl ? briefEl.textContent : '';
    function done() { if (copyStatus) copyStatus.textContent = 'Brief copied. Send route is still undecided — see the note below.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        if (copyStatus) copyStatus.textContent = 'Copy failed in this browser — select the brief text and copy it manually.';
      });
    } else if (copyStatus) {
      copyStatus.textContent = 'Clipboard not available in this browser — select the brief text and copy it manually.';
    }
  });

  // Clear the brief.
  var clearBtn = document.getElementById('clear-brief');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    Object.keys(fields).forEach(function (k) { if (fields[k]) fields[k].value = ''; });
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
    composeBrief();
    if (copyStatus) copyStatus.textContent = 'Brief cleared.';
  });

  // Prevent any accidental submit: there is no send destination yet.
  var form = document.getElementById('desk-form');
  if (form) form.addEventListener('submit', function (ev) { ev.preventDefault(); composeBrief(); });
})();
