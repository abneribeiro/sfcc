/* Página inicial: mapa dos temas, matriz item do guia → tema e "continuar de onde parei".
   Depende de manifest.js (window.SFCC) e core.js (window.SFCCUI). */
(function () {
  'use strict';
  var U = window.SFCCUI, M = window.SFCC;
  if (!U || !M) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, ic = U.ic, I = U.I;
  var done = U.done();

  /* ---------- continuar de onde parei ---------- */
  var resume = $('[data-resume]');
  var last = U.store.get('sfcc-last-v2');
  var lastTheme = last && U.themeByN[last.n];
  if (resume) {
    if (lastTheme) {
      resume.innerHTML = '<a class="quiet-action text-meta" href="' + U.themeHref(lastTheme) + '#' + esc(last.id) + '">' +
        'continuar: tema ' + lastTheme.n + ' · ' + esc(lastTheme.title) + (last.chap ? ' › ' + esc(last.chap) : '') + ' ' + ic(I.right) + '</a>';
    } else {
      var first = M.themes[0];
      resume.innerHTML = '<a class="quiet-action text-meta" href="' + U.themeHref(first) + '">começar pelo tema 01 · ' + esc(first.title) + ' ' + ic(I.right) + '</a>';
    }
  }

  /* ---------- mapa dos temas ---------- */
  var list = $('[data-themes]');
  if (list) {
    list.innerHTML = M.themes.map(function (t) {
      return '<li><a class="theme-row list-row" href="' + U.themeHref(t) + '">' +
        '<span class="t-n">' + t.n + '</span>' +
        '<span class="t-t">' + esc(t.title) + '</span>' +
        '<span class="t-c">' + t.covers.map(function (id) { return '<span class="badge">' + id + '</span>'; }).join(' ') +
          ' <span class="badge" data-done-badge="' + t.n + '" data-on="' + (done[t.n] ? 'true' : 'false') + '">' + (done[t.n] ? ic(I.ok) + ' estudado' : 'a estudar') + '</span></span>' +
        '<span class="t-s">' + esc(t.summary) + '</span>' +
      '</a></li>';
    }).join('');
  }

  /* ---------- matriz: item do guia → temas ---------- */
  var matrix = $('[data-matrix]');
  if (matrix) {
    var byItem = {};
    M.themes.forEach(function (t) { t.covers.forEach(function (id) { (byItem[id] = byItem[id] || []).push(t); }); });
    var rows = function (kind) {
      return M.items.filter(function (it) { return kind === 'all' || it.id[0] === kind; }).map(function (it) {
        return '<tr><td>' + it.id + '</td><td><span lang="en">' + esc(it.en) + '</span><br><span class="text-meta">' + esc(it.pt) + '</span></td><td>' +
          (byItem[it.id] || []).map(function (t) { return '<a class="text-link" href="' + U.themeHref(t) + '">' + t.n + ' · ' + esc(t.title) + '</a>'; }).join('<br>') +
        '</td></tr>';
      }).join('');
    };
    var paint = function (kind) {
      matrix.innerHTML = '<div class="table-wrap"><table class="matrix"><thead><tr><th>item</th><th>texto do guia oficial</th><th>tema</th></tr></thead><tbody>' + rows(kind) + '</tbody></table></div>';
    };
    paint('all');
    var sel = $('[data-matrix-filter]');
    if (sel) sel.addEventListener('change', function () { paint(sel.value); });
  }

  // atualiza os selos quando o progresso muda (core.js grava ao clicar em "marcar como estudado")
  window.addEventListener('storage', function (e) {
    if (e.key !== 'sfcc-done-v2') return;
    var d = U.store.get('sfcc-done-v2') || {};
    $$('[data-done-badge]').forEach(function (b) {
      var n = b.getAttribute('data-done-badge');
      b.setAttribute('data-on', d[n] ? 'true' : 'false');
      b.innerHTML = d[n] ? ic(I.ok) + ' estudado' : 'a estudar';
    });
  });
})();
