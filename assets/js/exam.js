/* Página exame.html: ficha do exame, pesos por domínio, flashcards e simulado.
   Dados: exam-data.js (window.SFCC_EXAM). Depende de core.js (window.SFCCUI) e manifest.js. */
(function () {
  'use strict';
  var U = window.SFCCUI, X = window.SFCC_EXAM, M = window.SFCC;
  if (!U || !X) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, ic = U.ic, I = U.I;
  var themeByN = U.themeByN;

  function themeLink(n) {
    var t = themeByN[n];
    return t ? '<a class="text-link" href="' + U.themeHref(t) + '">' + t.n + ' · ' + esc(t.title) + '</a>' : n;
  }
  function themeOptions() {
    var used = {};
    X.cards.concat(X.questions).forEach(function (x) { used[x.t] = true; });
    return '<option value="all">todos os temas</option>' + M.themes.filter(function (t) { return used[t.n]; }).map(function (t) {
      return '<option value="' + t.n + '">' + t.n + ' · ' + esc(t.title) + '</option>';
    }).join('');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* ---------- ficha e pesos ---------- */
  var facts = $('[data-exam-facts]');
  if (facts) {
    var e = X.exam;
    facts.innerHTML =
      '<dl class="facts">' +
        '<div><dt class="text-label">questões</dt><dd>' + esc(e.questions) + '</dd></div>' +
        '<div><dt class="text-label">tempo</dt><dd>' + esc(e.time) + '</dd></div>' +
        '<div><dt class="text-label">aprovação</dt><dd>' + esc(e.passing) + '</dd></div>' +
        '<div><dt class="text-label">taxa</dt><dd>' + esc(e.fee) + '</dd></div>' +
      '</dl>';
  }
  var doms = $('[data-exam-domains]');
  if (doms) {
    doms.innerHTML = X.domains.map(function (d) {
      var nq = X.questions.filter(function (q) { return q.d === d.id; }).length;
      return '<div class="domain" id="dom-' + d.id + '">' +
        '<div class="domain-top"><div><p class="text-label">domínio</p><h3>' + esc(d.name) + '</h3></div>' +
        '<p class="kpi"><span class="kpi-n">' + d.w + '%</span><span class="text-meta kpi-s">≈ ' + Math.round(d.w * 0.6) + ' de 60 questões</span></p></div>' +
        '<div class="bar" role="img" aria-label="' + d.w + '% do exame"><span style="width:' + d.w + '%"></span></div>' +
        '<ul>' + d.themes.map(function (n) { return '<li>' + themeLink(n) + '</li>'; }).join('') + '</ul>' +
        '<p class="domain-links"><button type="button" class="quiet-action text-meta" data-quiz-domain="' + d.id + '">praticar este domínio (' + nq + ' questões)' + ic(I.right) + '</button></p>' +
      '</div>';
    }).join('');
  }

  /* ---------- flashcards ---------- */
  var cardsEl = $('[data-cards]');
  if (cardsEl) {
    cardsEl.innerHTML = X.cards.map(function (c, i) {
      return '<details class="card" id="fc-' + (i + 1) + '" data-t="' + c.t + '">' +
        '<summary><span class="card-n text-label">tema ' + c.t + '</span><span class="card-q">' + c.q + '</span></summary>' +
        '<div class="card-a">' + c.a + '</div></details>';
    }).join('');
    var cardFilter = $('[data-card-filter]');
    var cardCount = $('[data-card-count]');
    cardFilter.innerHTML = themeOptions();
    function paintCards() {
      var v = cardFilter.value, n = 0;
      $$('.card', cardsEl).forEach(function (c) {
        var on = v === 'all' || c.getAttribute('data-t') === v;
        c.hidden = !on; if (on) n++;
      });
      cardCount.textContent = n + (n === 1 ? ' flashcard' : ' flashcards');
    }
    cardFilter.addEventListener('change', paintCards);
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-cards-act]');
      if (!b) return;
      var act = b.getAttribute('data-cards-act');
      var visible = $$('.card', cardsEl).filter(function (c) { return !c.hidden; });
      if (act === 'open') visible.forEach(function (c) { c.open = true; });
      if (act === 'close') visible.forEach(function (c) { c.open = false; });
      if (act === 'shuffle') { shuffle($$('.card', cardsEl)).forEach(function (c) { cardsEl.appendChild(c); }); U.announce('flashcards embaralhados'); }
    });
    paintCards();
  }

  /* ---------- simulado ---------- */
  var quizEl = $('[data-quiz]');
  if (!quizEl) return;
  var LETTERS = 'abcdefgh';
  var domName = {};
  X.domains.forEach(function (d) { domName[d.id] = d.name; });
  quizEl.innerHTML = X.questions.map(function (q, i) {
    return '<fieldset class="q" id="q-' + (i + 1) + '" data-t="' + q.t + '" data-d="' + q.d + '" data-answer="' + q.a + '">' +
      '<legend><span class="text-label">questão ' + (i + 1) + ' · tema ' + q.t + ' · ' + esc((domName[q.d] || q.d).toLowerCase()) + '</span><span class="q-t">' + q.q + '</span></legend>' +
      '<div class="opts">' + q.o.map(function (o, j) {
        return '<button type="button" class="opt" data-opt="' + j + '"><span class="opt-l text-label">' + LETTERS[j] + '</span><span class="opt-t">' + o + '</span><span class="opt-s text-label" aria-hidden="true"></span></button>';
      }).join('') + '</div>' +
      '<p class="q-e" hidden><span class="text-label q-v"></span> ' + q.e + ' <span class="text-meta">Aprofunde: ' + themeLink(q.t) + '</span></p>' +
    '</fieldset>';
  }).join('');

  var themeSel = $('[data-quiz-theme]');
  var domSel = $('[data-quiz-dom]');
  var scoreEl = $('[data-score]');
  themeSel.innerHTML = themeOptions();
  domSel.innerHTML = '<option value="all">todos os domínios</option>' + X.domains.map(function (d) {
    return '<option value="' + d.id + '">' + esc(d.name) + ' · ' + d.w + '%</option>';
  }).join('');

  function visibleQs() { return $$('.q', quizEl).filter(function (q) { return q.getAttribute('data-hide') !== 'true'; }); }
  function paintScore() {
    var vis = visibleQs();
    var answered = vis.filter(function (q) { return q.hasAttribute('data-done'); });
    var right = answered.filter(function (q) { return q.getAttribute('data-done') === 'right'; });
    var pct = answered.length ? Math.round((right.length / answered.length) * 100) : 0;
    scoreEl.textContent = right.length + ' de ' + answered.length + ' corretas (' + pct + '%) · ' + vis.length + ' questões no filtro';
  }
  function applyFilter() {
    var t = themeSel.value, d = domSel.value;
    $$('.q', quizEl).forEach(function (q) {
      var on = (t === 'all' || q.getAttribute('data-t') === t) && (d === 'all' || q.getAttribute('data-d') === d);
      q.setAttribute('data-hide', on ? 'false' : 'true');
    });
    paintScore();
  }
  themeSel.addEventListener('change', applyFilter);
  domSel.addEventListener('change', applyFilter);

  function resetQ(q) {
    q.removeAttribute('data-done');
    $$('.opt', q).forEach(function (o) { o.disabled = false; o.removeAttribute('data-state'); $('.opt-s', o).innerHTML = ''; });
    $('.q-e', q).hidden = true;
  }

  quizEl.addEventListener('click', function (ev) {
    var b = ev.target.closest('.opt');
    if (!b || b.disabled) return;
    var q = b.closest('.q');
    var ans = +q.getAttribute('data-answer');
    var pick = +b.getAttribute('data-opt');
    var ok = pick === ans;
    $$('.opt', q).forEach(function (o) {
      o.disabled = true;
      var j = +o.getAttribute('data-opt');
      if (j === ans) { o.setAttribute('data-state', 'correct'); $('.opt-s', o).innerHTML = ic(I.ok) + ' correta'; }
      else if (j === pick) { o.setAttribute('data-state', 'wrong'); $('.opt-s', o).innerHTML = ic(I.no) + ' sua escolha'; }
    });
    q.setAttribute('data-done', ok ? 'right' : 'wrong');
    var ex = $('.q-e', q);
    $('.q-v', ex).textContent = ok ? 'correto ·' : 'resposta: ' + LETTERS[ans] + ' ·';
    ex.hidden = false;
    U.announce(ok ? 'resposta correta' : 'resposta incorreta; a correta é ' + LETTERS[ans]);
    paintScore();
  });

  document.addEventListener('click', function (ev) {
    var r = ev.target.closest('[data-quiz-reset]');
    if (r) { $$('.q', quizEl).forEach(resetQ); paintScore(); U.announce('simulado reiniciado'); return; }
    var s = ev.target.closest('[data-quiz-shuffle]');
    if (s) { shuffle($$('.q', quizEl)).forEach(function (q) { quizEl.appendChild(q); }); U.announce('questões embaralhadas'); return; }
    var dm = ev.target.closest('[data-quiz-domain]');
    if (dm) {
      domSel.value = dm.getAttribute('data-quiz-domain'); themeSel.value = 'all'; applyFilter();
      var sim = document.getElementById('simulado');
      if (sim) sim.scrollIntoView({ behavior: U.scrollBehavior(), block: 'start' });
    }
  });
  applyFilter();

  // âncora inicial: flashcards e questões foram gerados depois do scroll do navegador
  if (location.hash.length > 1) {
    var id = decodeURIComponent(location.hash.slice(1));
    U.keepAnchor(id, /^(fc|q)-\d+$/.test(id) ? 'center' : 'start');
  }
})();
