/* Pesquisa global. O índice (search-index.js, gerado por scripts/build-search-index.mjs)
   só é carregado no primeiro foco do campo, via <script>, para funcionar também em file://. */
(function () {
  'use strict';
  var U = window.SFCCUI;
  var $ = U.$, $$ = U.$$, esc = U.esc;
  var input = $('#q');
  var main = $('#main');
  if (!input || !main) return;

  var results = document.createElement('section');
  results.id = 'results';
  results.className = 'results';
  results.hidden = true;
  results.setAttribute('aria-label', 'resultados da pesquisa');
  results.innerHTML = '<header class="module-h"><p class="text-label">pesquisa em todos os temas</p><p class="text-meta" id="q-count" aria-live="polite"></p></header><ul class="result-list"></ul>';
  main.insertBefore(results, main.firstChild);
  var countEl = $('#q-count');
  var list = $('.result-list', results);

  function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  var index = null, loading = null;
  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = U.ROOT + '/assets/js/search-index.js';
      s.onload = function () {
        index = (window.SFCC_INDEX || []).map(function (e) { return { h: e.h, t: e.t, k: e.k, x: e.x, n: norm(e.x), nt: norm(e.t) }; });
        resolve(index);
      };
      s.onerror = function () { index = []; resolve(index); };
      document.head.appendChild(s);
    });
    return loading;
  }

  // Regex insensível a acentos e maiúsculas para realçar o texto original.
  var ACC = { a: 'aáàâãä', e: 'eéèêë', i: 'iíìîï', o: 'oóòôõö', u: 'uúùûü', c: 'cç', n: 'nñ' };
  function termRe(terms) {
    var parts = terms.map(function (t) {
      return t.split('').map(function (ch) {
        if (ACC[ch]) return '[' + ACC[ch] + ']';
        return ch.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
      }).join('');
    });
    return new RegExp('(' + parts.join('|') + ')', 'gi');
  }
  function markHtml(text, re) { return esc(text).replace(re, '<mark>$1</mark>'); }
  function snippet(e, terms) {
    var pos = e.n.indexOf(terms[0]);
    var start = Math.max(0, pos - 60);
    var s = e.x.slice(start, start + 200);
    return (start > 0 ? '… ' : '') + s + (start + 200 < e.x.length ? ' …' : '');
  }

  var hiddenKids = [];
  function showResults() {
    if (!results.hidden) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    hiddenKids = Array.prototype.filter.call(main.children, function (c) { return c !== results && !c.hidden; });
    hiddenKids.forEach(function (c) { c.hidden = true; });
    results.hidden = false;
  }
  function hideResults() {
    if (results.hidden) return;
    results.hidden = true;
    hiddenKids.forEach(function (c) { c.hidden = false; });
    hiddenKids = [];
  }

  var lastQuery = '';
  function search(raw) {
    var q = norm(raw.trim());
    lastQuery = raw.trim();
    if (!q) { hideResults(); return; }
    loadIndex().then(function (idx) {
      if (lastQuery !== raw.trim()) return;
      var terms = q.split(/\s+/).filter(Boolean);
      var hits = [];
      idx.forEach(function (e) {
        for (var i = 0; i < terms.length; i++) if (e.n.indexOf(terms[i]) < 0 && e.nt.indexOf(terms[i]) < 0) return;
        var score = 0;
        terms.forEach(function (t) {
          if (e.nt.indexOf(t) >= 0) score += 10;
          score += Math.min(e.n.split(t).length - 1, 8);
        });
        hits.push({ e: e, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      var re = termRe(terms);
      var shown = hits.slice(0, 80);
      list.innerHTML = shown.map(function (h) {
        return '<li><a class="list-row result-row" href="' + esc(U.ROOT + '/' + h.e.h) + '">' +
          '<span class="result-t">' + markHtml(h.e.t, re) + '</span>' +
          '<span class="text-label result-k">' + esc(h.e.k) + '</span>' +
          '<span class="result-s">' + markHtml(snippet(h.e, terms), re) + '</span></a></li>';
      }).join('');
      if (!hits.length) list.innerHTML = '<li class="empty">nenhum resultado para “' + esc(raw.trim()) + '”</li>';
      countEl.textContent = (hits.length === 1 ? '1 resultado' : hits.length + ' resultados') + (hits.length > shown.length ? ' · a mostrar ' + shown.length : '');
      showResults();
    });
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { search(input.value); }, U.duration(80) || 0);
  });
  input.addEventListener('focus', function () { loadIndex(); if (input.value.trim()) search(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; search(''); input.blur(); }
    if (e.key === 'Enter') { var first = $('.result-row', results); if (first) first.click(); }
    if (e.key === 'ArrowDown') { var f = $('.result-row', results); if (f) { e.preventDefault(); f.focus(); } }
  });
  results.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var rows = $$('.result-row', results);
    var i = rows.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === 'ArrowDown' && rows[i + 1]) rows[i + 1].focus();
    if (e.key === 'ArrowUp') (rows[i - 1] || input).focus();
  });
  // leva o termo para a página de destino, que o realça
  results.addEventListener('click', function (e) {
    var a = e.target.closest('.result-row');
    if (!a) return;
    try { sessionStorage.setItem('sfcc-hl', lastQuery); } catch (err) { /* sem storage: só navega */ }
    var here = location.pathname.split('/').pop();
    var dest = a.getAttribute('href').split('#');
    if (dest[0].split('/').pop() === here && dest[1]) {
      e.preventDefault();
      hideResults();
      input.value = '';
      location.hash = dest[1];
      var el = document.getElementById(dest[1]);
      if (el) { if (el.tagName === 'DETAILS') el.open = true; el.scrollIntoView({ block: 'start' }); markIn(el, lastQuery); }
    }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  // realça os termos no destino depois de escolher um resultado
  function markIn(root, raw) {
    var terms = norm(raw).split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length || !root) return;
    var re = termRe(terms);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      var n = walker.currentNode;
      if (n.parentNode.closest('.mermaid-out, script, style, mark')) continue;
      re.lastIndex = 0;
      if (re.test(n.nodeValue)) nodes.push(n);
    }
    nodes.slice(0, 300).forEach(function (n) {
      var frag = document.createDocumentFragment();
      var last = 0, txt = n.nodeValue, m;
      re.lastIndex = 0;
      while ((m = re.exec(txt))) {
        if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        var mk = document.createElement('mark');
        mk.textContent = m[0];
        frag.appendChild(mk);
        last = m.index + m[0].length;
      }
      if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }
  var hl = null;
  try { hl = sessionStorage.getItem('sfcc-hl'); sessionStorage.removeItem('sfcc-hl'); } catch (err) { /* nada a realçar */ }
  if (hl && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) markIn(target, hl);
  }
})();
