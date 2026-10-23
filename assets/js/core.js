/* Shell compartilhado por todas as páginas (index, exame, temas/*).
   Cada página traz o esqueleto estático (header.topbar vazio, .shell > .layout > aside.rail + main)
   e o conteúdo; este arquivo preenche a barra, o índice lateral e transforma os blocos de autoria:
     <script type="text/plain" class="src" data-lang="js" data-file="…">  → bloco de código
     <script type="text/plain" class="mmd" data-caption="…">            → diagrama (diagrams.js)
     <aside class="callout" data-kind="exam|tip|warn|anti|verify|note|best"> → rótulo + ícone
     <section class="chap" id="…" data-k="…"><h2>…</h2>                   → capítulo no índice
   Depende de manifest.js (window.SFCC). */
(function () {
  'use strict';

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Toda a duração em JS passa por aqui (§4.3).
  function duration(ms) { return reduceMq.matches ? 0 : ms; }
  function scrollBehavior() { return reduceMq.matches ? 'auto' : 'smooth'; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } },
  };

  var body = document.body;
  var ROOT = body.getAttribute('data-root') || '.';
  var PAGE = body.getAttribute('data-page') || 'home';
  var THEME_N = body.getAttribute('data-tema');
  var M = window.SFCC || { items: [], themes: [] };
  var themeByN = {};
  M.themes.forEach(function (t) { themeByN[t.n] = t; });
  var itemById = {};
  M.items.forEach(function (i) { itemById[i.id] = i; });
  function themeHref(t) { return ROOT + '/temas/' + t.slug + '.html'; }

  /* ---------- ícones (traço 2px, 24×24) ---------- */
  function ic(paths, size) {
    size = size || 12;
    return '<svg class="ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var I = {
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    ok: '<path d="M5 12.5 10 17l9-10"/>',
    no: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    up: '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
    right: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    left: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    warn: '<path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/>',
    pin: '<path d="M12 17v4"/><path d="M8 3h8l-1 6 3 3v2H6v-2l3-3z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    zoom: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
  };

  /* ---------- barra superior ---------- */
  var topbar = $('header.topbar');
  if (topbar) {
    var onExam = PAGE === 'exame';
    topbar.innerHTML =
      '<div class="topbar-in">' +
        '<div class="search" role="search">' +
          '<label class="sr-only" for="q">pesquisar em todos os temas</label>' +
          '<span class="search-ic">' + ic(I.search, 14) + '</span>' +
          '<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="pesquisar classes, tags ISML, hooks, erros, conceitos…" aria-describedby="q-count" aria-controls="results">' +
          '<span class="search-kbd" aria-hidden="true"><kbd>/</kbd>ou<kbd>ctrl k</kbd></span>' +
        '</div>' +
        '<nav class="tabs" aria-label="seções do site">' +
          '<a class="nav-link text-label tab" href="' + ROOT + '/index.html"' + (onExam ? '' : ' aria-current="page"') + '><span class="tab-long">Guia por temas</span><span class="tab-short">guia</span></a>' +
          '<a class="nav-link text-label tab" href="' + ROOT + '/exame.html"' + (onExam ? ' aria-current="page"' : '') + '><span class="tab-long">Exame, flashcards &amp; simulado</span><span class="tab-short">exame</span></a>' +
        '</nav>' +
        '<div class="reading">' +
          '<button type="button" class="quiet-action text-label reading-btn" aria-expanded="false" aria-controls="reading-panel" aria-label="preferências de leitura">Aa</button>' +
          '<div class="panel" id="reading-panel" role="dialog" aria-label="preferências de leitura">' +
            '<div class="panel-row"><p class="text-label">tamanho do texto</p><p class="seg" data-pref="size"><button type="button" class="quiet-action text-meta" data-val="s">15px</button><button type="button" class="quiet-action text-meta" data-val="m">16px</button><button type="button" class="quiet-action text-meta" data-val="l">18px</button></p></div>' +
            '<div class="panel-row"><p class="text-label">largura das linhas</p><p class="seg" data-pref="measure"><button type="button" class="quiet-action text-meta" data-val="narrow">estreita</button><button type="button" class="quiet-action text-meta" data-val="normal">normal</button><button type="button" class="quiet-action text-meta" data-val="wide">larga</button></p></div>' +
            '<div class="panel-row"><p class="text-label">tema</p><p class="seg" data-pref="theme"><button type="button" class="quiet-action text-meta" data-val="paper">papel</button><button type="button" class="quiet-action text-meta" data-val="night">noite</button></p></div>' +
            '<div class="panel-row"><p class="text-label">atalhos</p><dl class="keys text-meta"><dt><kbd>/</kbd></dt><dd>pesquisar</dd><dt><kbd>j</kbd> <kbd>k</kbd></dt><dd>capítulo seguinte / anterior</dd><dt><kbd>[</kbd> <kbd>]</kbd></dt><dd>tema anterior / seguinte</dd><dt><kbd>esc</kbd></dt><dd>limpar pesquisa · fechar</dd></dl></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="progress" aria-hidden="true"><span></span></div>';
    var skip = document.createElement('a');
    skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'pular para o conteúdo';
    body.insertBefore(skip, body.firstChild);
    var fade = document.createElement('div');
    fade.className = 'top-fade'; fade.setAttribute('aria-hidden', 'true');
    body.insertBefore(fade, topbar);
  }
  var live = document.createElement('p');
  live.className = 'sr-only'; live.id = 'live'; live.setAttribute('aria-live', 'polite');
  body.appendChild(live);
  function announce(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, duration(50)); }

  var main = $('#main');

  /* ---------- realce de código monocromático (§1.3: sem matiz; peso e degraus de tinta) ---------- */
  var JS_KW = /^(?:var|let|const|function|return|if|else|for|while|new|module|exports|this|true|false|null|undefined|try|catch|finally|throw|typeof|instanceof|in|of|switch|case|break|continue|default|do|delete|void)$/;
  var RULES = {
    js: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|([A-Za-z_$][\w$]*)/g,
    markup: /(<!--[\s\S]*?-->|<iscomment>[\s\S]*?<\/iscomment>)|(=)("[^"\n]*"|'[^'\n]*')|(<\/?[A-Za-z][\w:.-]*|\/?>)/g,
    json: /(\/\/[^\n]*)|("(?:\\.|[^"\\\n])*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)/g,
    bash: /(#[^\n]*)|('[^'\n]*'|"(?:\\.|[^"\\\n])*")|(^\s*(?:\$ )?[a-z][\w-]*)/gm,
    props: /(^\s*#[^\n]*)|(^[^=\n#]+)(?==)/gm,
    css: /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('[^'\n]*'|"[^"\n]*")|(@[\w-]+|\$[\w-]+)/g,
  };
  var LANG = { js: 'js', javascript: 'js', ds: 'js', isml: 'markup', html: 'markup', xml: 'markup', json: 'json', bash: 'bash', sh: 'bash', shell: 'bash', properties: 'props', css: 'css', scss: 'css' };
  function tokenize(code, lang) {
    var kind = LANG[lang];
    var re = kind && RULES[kind];
    if (!re) return [{ c: '', t: code }];
    var out = [], last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      if (m.index > last) out.push({ c: '', t: code.slice(last, m.index) });
      var c = '';
      if (kind === 'js') c = m[1] ? 'tk-c' : m[2] ? 'tk-s' : (JS_KW.test(m[3]) ? 'tk-k' : '');
      else if (kind === 'markup') {
        if (m[2]) { out.push({ c: '', t: '=' }, { c: 'tk-s', t: m[3] }); last = re.lastIndex; continue; }
        c = m[1] ? 'tk-c' : 'tk-k';
      }
      else if (kind === 'json') {
        if (m[1]) c = 'tk-c';
        else if (m[2]) { out.push({ c: m[3] ? 'tk-k' : 'tk-s', t: m[2] }); if (m[3]) out.push({ c: '', t: m[3] }); last = re.lastIndex; continue; }
        else c = 'tk-k';
      }
      else if (kind === 'bash') c = m[1] ? 'tk-c' : m[2] ? 'tk-s' : 'tk-k';
      else if (kind === 'props') c = m[1] ? 'tk-c' : 'tk-k';
      else if (kind === 'css') c = m[1] ? 'tk-c' : m[2] ? 'tk-s' : 'tk-k';
      out.push({ c: c, t: m[0] });
      last = re.lastIndex;
    }
    if (last < code.length) out.push({ c: '', t: code.slice(last) });
    return out;
  }
  function highlight(code, lang) {
    var lines = [[]];
    tokenize(code, lang).forEach(function (tk) {
      tk.t.split('\n').forEach(function (part, i) {
        if (i > 0) lines.push([]);
        if (part) lines[lines.length - 1].push(tk.c ? '<span class="' + tk.c + '">' + esc(part) + '</span>' : esc(part));
      });
    });
    return lines.map(function (l) { return '<span data-line>' + (l.join('') || ' ') + '</span>'; }).join('');
  }
  function dedent(s) {
    s = s.replace(/^\s*\n/, '').replace(/\s+$/, '');
    var ind = null;
    s.split('\n').forEach(function (l) {
      if (!l.trim()) return;
      var n = l.match(/^[ \t]*/)[0].length;
      if (ind === null || n < ind) ind = n;
    });
    return ind ? s.split('\n').map(function (l) { return l.slice(ind); }).join('\n') : s;
  }
  var LANG_LABEL = { js: 'javascript', ds: 'javascript', isml: 'isml', html: 'html', xml: 'xml', json: 'json', bash: 'terminal', sh: 'terminal', properties: 'properties', css: 'css', scss: 'scss', text: 'texto' };
  function copyButton() {
    return '<button type="button" class="quiet-action text-meta copy" data-copy aria-label="copiar código"><span class="swap"><span class="swap-a">' + ic(I.copy) + '</span><span class="swap-b">' + ic(I.ok) + '</span></span><span class="copy-t">copiar</span></button>';
  }
  $$('script.src[type="text/plain"]').forEach(function (s) {
    var lang = s.getAttribute('data-lang') || 'text';
    var file = s.getAttribute('data-file');
    var note = s.getAttribute('data-note');
    // dentro de um bloco de autoria, "<\/script>" e "<\script" representam as tags literais
    // (escritas assim para não fechar nem confundir o <script type="text/plain"> que as contém)
    var code = dedent(s.textContent.replace(/<\\\/script>/g, '</script>').replace(/<\\script/g, '<script'));
    var fig = document.createElement('figure');
    fig.className = 'code-wrap';
    fig.innerHTML =
      (file ? '<figcaption class="text-label code-file">' + ic(I.file) + '<span>' + esc(file) + '</span><span class="code-lang">' + esc(LANG_LABEL[lang] || lang) + '</span></figcaption>' : '') +
      '<div class="code">' + copyButton() + '<pre><code>' + highlight(code, lang) + '</code></pre></div>' +
      (note ? '<figcaption class="code-note">' + note + '</figcaption>' : '');
    fig.querySelector('pre').setAttribute('data-raw', '');
    fig._raw = code;
    s.parentNode.replaceChild(fig, s);
  });

  /* ---------- diagramas: só a moldura; diagrams.js desenha ---------- */
  $$('script.mmd[type="text/plain"]').forEach(function (s) {
    var fig = document.createElement('figure');
    fig.className = 'diagram';
    fig.setAttribute('data-diagram', '');
    var cap = s.getAttribute('data-caption') || 'diagrama';
    fig.innerHTML = '<pre class="mermaid-src"></pre><div class="mermaid-out" hidden></div>' +
      '<figcaption><span class="text-label fig-k">' + esc(cap) + '</span><span class="fig-hint text-meta" hidden>deslize para ver o resto</span>' +
      '<button type="button" class="quiet-action text-meta" data-zoom hidden>' + ic(I.zoom) + 'ampliar</button></figcaption>';
    fig.querySelector('.mermaid-src').textContent = dedent(s.textContent);
    s.parentNode.replaceChild(fig, s);
  });

  /* ---------- callouts: variantes mudam ícone e rótulo, nunca cor ---------- */
  var CALLOUT = {
    exam: [I.target, 'pegadinha de prova'], tip: [I.bulb, 'dica'], warn: [I.warn, 'atenção'],
    anti: [I.no, 'anti-padrão'], verify: [I.search, 'verificar na fonte'], note: [I.pin, 'nota'], best: [I.check, 'boa prática'],
  };
  $$('aside.callout[data-kind]').forEach(function (a) {
    if ($('.callout-k', a)) return;
    var k = CALLOUT[a.getAttribute('data-kind')] || CALLOUT.note;
    var b = document.createElement('div');
    b.className = 'callout-b';
    while (a.firstChild) b.appendChild(a.firstChild);
    a.innerHTML = '<p class="text-label callout-k">' + ic(k[0]) + '<span>' + esc(a.getAttribute('data-label') || k[1]) + '</span></p>';
    a.appendChild(b);
  });

  /* ---------- tabelas: rolagem horizontal dentro da moldura ---------- */
  $$('.prose table').forEach(function (t) {
    if (t.parentNode.classList.contains('table-wrap')) return;
    var w = document.createElement('div');
    w.className = 'table-wrap';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });

  /* ---------- links externos ---------- */
  $$('a[href^="http"]').forEach(function (a) {
    a.target = '_blank'; a.rel = 'noopener';
    if (!$('.sr-only', a)) a.insertAdjacentHTML('beforeend', '<span class="sr-only"> (abre em nova aba)</span>');
  });

  /* ---------- progresso de estudo (por tema) ---------- */
  var DONE_KEY = 'sfcc-done-v2';
  var done = store.get(DONE_KEY) || {};
  function doneCount() { return M.themes.filter(function (t) { return done[t.n]; }).length; }

  /* ---------- página de tema: cabeçalho, capítulos, índice, paginação ---------- */
  var theme = THEME_N && themeByN[THEME_N];
  var chapters = [];
  if (theme) {
    var th = $('.theme-h');
    if (th) {
      var kicker = $('.text-label', th);
      if (kicker && !kicker.textContent.trim()) kicker.textContent = 'tema ' + theme.n + ' de ' + M.themes.length + ' · cobre ' + theme.covers.join(', ');
      var itemsEl = $('[data-items]', th);
      if (itemsEl) itemsEl.innerHTML = '<p class="text-label">o que o guia oficial do exame pede</p>' + theme.covers.map(function (id) {
        var it = itemById[id];
        return '<blockquote class="item" cite="https://trailhead.salesforce.com/credentials/b2ccommercedeveloper"><p class="text-label">' + id + (id[0] === 'O' ? ' · objetivo do exame' : ' · competência do candidato') + '</p><p class="item-en" lang="en">' + esc(it.en) + '</p><p class="item-pt">' + esc(it.pt) + '</p></blockquote>';
      }).join('');
      var metaEl = $('[data-meta]', th);
      if (metaEl) metaEl.innerHTML = '<span class="text-label">relacionados</span>' + theme.related.map(function (n) {
        var t = themeByN[n];
        return '<a class="text-link" href="' + themeHref(t) + '">' + t.n + ' · ' + esc(t.title) + '</a>';
      }).join('');
    }
    $$('section.chap').forEach(function (sec, i) {
      var h2 = $('h2', sec);
      if (!h2) return;
      var hd = document.createElement('header');
      hd.className = 'chap-h';
      hd.innerHTML = '<p class="text-label">' + esc(sec.getAttribute('data-k') || ('capítulo ' + (i + 1))) + '</p>';
      sec.insertBefore(hd, h2);
      hd.appendChild(h2);
      chapters.push({ id: sec.id, title: h2.textContent, n: i + 1, k: sec.getAttribute('data-k'), subs: $$('.prose > h3[id]', sec).map(function (h) { return { id: h.id, title: h.textContent }; }) });
    });
    // marcar como estudado + paginação
    var idx = M.themes.indexOf(theme);
    var prev = M.themes[idx - 1], next = M.themes[idx + 1];
    var tail = document.createElement('div');
    tail.innerHTML =
      '<div class="topic-done"><button type="button" class="quiet-action text-meta" data-done-toggle="' + theme.n + '" aria-pressed="false"><span class="swap"><span class="swap-a">' + ic(I.check, 14) + '</span><span class="swap-b">' + ic(I.ok, 14) + '</span></span><span class="done-t">marcar tema como estudado</span></button></div>' +
      '<nav class="pager" aria-label="tema anterior e seguinte">' +
        (prev ? '<a class="quiet-action" href="' + themeHref(prev) + '" data-pager="prev"><span class="text-label">' + ic(I.left) + ' tema ' + prev.n + '</span><span class="pager-t">' + esc(prev.title) + '</span></a>' : '<span></span>') +
        (next ? '<a class="quiet-action" href="' + themeHref(next) + '" data-pager="next"><span class="text-label">tema ' + next.n + ' ' + ic(I.right) + '</span><span class="pager-t">' + esc(next.title) + '</span></a>' : '<a class="quiet-action" href="' + ROOT + '/exame.html" data-pager="next"><span class="text-label">exame ' + ic(I.right) + '</span><span class="pager-t">Flashcards e simulado</span></a>') +
      '</nav>';
    while (tail.firstChild) main.appendChild(tail.firstChild);
    document.title = theme.n + ' · ' + theme.title + ' · Guia SFCC';
  }

  /* ---------- índice lateral ---------- */
  function themesNav(currentN) {
    return '<nav class="toc" aria-label="todos os temas"><ul>' + M.themes.map(function (t) {
      return '<li><a class="nav-link toc-a" href="' + themeHref(t) + '"' + (t.n === currentN ? ' aria-current="page"' : '') + '><span class="toc-n">' + t.n + '</span><span>' + esc(t.title) + '</span><span class="toc-done" data-done-mark="' + t.n + '">' + ic(I.ok) + '</span></a></li>';
    }).join('') + '</ul></nav>';
  }
  function chaptersNav() {
    return '<nav class="toc toc-theme" aria-label="capítulos deste tema"><ul>' + chapters.map(function (c) {
      // "cap. 3" vira "3"; capítulos de apoio (armadilhas, debug, revisão…) recebem um traço
      var m = c.k && c.k.match(/^cap\.\s*(\d+)/);
      var num = !c.k ? c.n : m ? m[1] : '–';
      return '<li><a class="nav-link toc-a" href="#' + c.id + '" data-nav="' + c.id + '"><span class="toc-n">' + num + '</span><span>' + esc(c.title) + '</span><span></span></a></li>';
    }).join('') + '</ul></nav>';
  }
  var progressHtml = '<p class="text-label rail-progress"><span data-progress>0</span> de ' + M.themes.length + ' temas estudados</p><div class="bar rail-bar"><span data-progress-bar style="width:0%"></span></div>';
  var rail = $('aside.rail');
  var railHtml = theme
    ? '<p class="text-label rail-progress">tema ' + theme.n + ' · capítulos</p>' + chaptersNav() + '<div class="rail-sep">' + progressHtml + '</div>' + themesNav(theme.n)
    : progressHtml + themesNav(null);
  if (rail) rail.innerHTML = railHtml;
  if (main && (theme || PAGE === 'home')) {
    var mob = document.createElement('details');
    mob.className = 'toc-mobile';
    mob.innerHTML = '<summary class="quiet-action text-label">' + (theme ? 'capítulos deste tema e todos os temas' : 'todos os temas') + '</summary>' + railHtml;
    main.insertBefore(mob, main.firstChild);
    mob.addEventListener('click', function (e) { if (e.target.closest('a')) mob.open = false; });
  }
  // entrada escalonada: o cabeçalho só sobe (pinta no primeiro frame), os blocos seguintes aparecem em sequência
  if (main) {
    var head = $('.theme-h, .page-h', main);
    if (head) head.classList.add('appear', 'rise');
    $$(':scope > :is(.module, .chap, .sec, .view, section)', main).slice(0, 6).forEach(function (el, i) {
      if (el === head) return;
      el.classList.add('appear');
      el.style.setProperty('--i', i + 1);
    });
  }

  function paintDone() {
    var n = doneCount();
    $$('[data-done-toggle]').forEach(function (b) {
      var on = !!done[b.getAttribute('data-done-toggle')];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('.done-t', b).textContent = on ? 'tema estudado' : 'marcar tema como estudado';
    });
    $$('[data-done-mark]').forEach(function (m) { m.setAttribute('data-on', done[m.getAttribute('data-done-mark')] ? 'true' : 'false'); });
    $$('[data-progress]').forEach(function (el) { el.textContent = n; });
    $$('[data-progress-bar]').forEach(function (el) { el.style.width = (n / M.themes.length) * 100 + '%'; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-done-toggle]');
    if (!b) return;
    var id = b.getAttribute('data-done-toggle');
    if (done[id]) delete done[id]; else done[id] = Date.now();
    store.set(DONE_KEY, done);
    paintDone();
    announce(done[id] ? 'tema marcado como estudado' : 'marca removida');
  });
  paintDone();

  /* ---------- scroll-spy dos capítulos + memória do último ponto de leitura ---------- */
  var LAST_KEY = 'sfcc-last-v2';
  if (theme && 'IntersectionObserver' in window) {
    var links = {};
    $$('[data-nav]').forEach(function (a) { var id = a.getAttribute('data-nav'); (links[id] = links[id] || []).push(a); });
    var active = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (active) active.forEach(function (a) { a.removeAttribute('data-active'); });
        active = links[id] || null;
        store.set(LAST_KEY, { n: theme.n, id: id, title: theme.title, chap: (chapters.filter(function (c) { return c.id === id; })[0] || {}).title });
        if (active) active.forEach(function (a) {
          a.setAttribute('data-active', 'true');
          var r = a.closest('.rail');
          if (!r) return;
          var ar = a.getBoundingClientRect(), rr = r.getBoundingClientRect();
          if (ar.top < rr.top + 24 || ar.bottom > rr.bottom - 24) r.scrollTop += ar.top - rr.top - rr.height / 3;
        });
      });
    }, { rootMargin: '-128px 0px -65% 0px' });
    chapters.forEach(function (c) { var el = document.getElementById(c.id); if (el) spy.observe(el); });
  }

  /* ---------- copiar código ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var fig = b.closest('.code-wrap');
    var code = fig && fig._raw != null ? fig._raw : b.parentNode.querySelector('pre').innerText;
    var t = $('.copy-t', b);
    var finish = function (ok) {
      b.setAttribute('data-done', ok ? 'true' : 'false');
      t.textContent = ok ? 'copiado' : 'falhou';
      announce(ok ? 'código copiado' : 'falha ao copiar');
      setTimeout(function () { b.removeAttribute('data-done'); t.textContent = 'copiar'; }, 2000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(function () { finish(true); }, function () { finish(false); });
    else finish(false);
  });

  /* ---------- preferências de leitura ---------- */
  var PREF_KEY = 'sfcc-reading-v1';
  var prefs = store.get(PREF_KEY) || {};
  var root = document.documentElement;
  var reading = $('.reading');
  var readingBtn = $('.reading-btn');
  function paintPrefs() {
    var cur = { size: prefs.size || 'm', measure: prefs.measure || 'normal', theme: prefs.theme || 'paper' };
    $$('[data-pref]').forEach(function (g) {
      var k = g.getAttribute('data-pref');
      $$('[data-val]', g).forEach(function (b) {
        var on = b.getAttribute('data-val') === cur[k];
        b.setAttribute('data-active', on ? 'true' : 'false');
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', cur.theme === 'night' ? '#0e0e0e' : '#ffffff');
  }
  function setPref(k, v) {
    var prevTheme = root.getAttribute('data-theme');
    prefs[k] = v;
    store.set(PREF_KEY, prefs);
    var def = { size: 'm', measure: 'normal', theme: 'paper' };
    if (v === def[k]) root.removeAttribute('data-' + k); else root.setAttribute('data-' + k, v);
    paintPrefs();
    document.dispatchEvent(new CustomEvent('sfcc:prefs', { detail: { key: k, themeChanged: k === 'theme' && prevTheme !== root.getAttribute('data-theme') } }));
  }
  function togglePanel(open) {
    reading.setAttribute('data-open', open ? 'true' : 'false');
    readingBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (reading) {
    readingBtn.addEventListener('click', function () { togglePanel(reading.getAttribute('data-open') !== 'true'); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pref] [data-val]');
      if (b) { setPref(b.closest('[data-pref]').getAttribute('data-pref'), b.getAttribute('data-val')); return; }
      if (!e.target.closest('.reading')) togglePanel(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && reading.getAttribute('data-open') === 'true') { togglePanel(false); readingBtn.focus(); }
    });
    paintPrefs();
  }

  /* ---------- barra de progresso de leitura e voltar ao topo ---------- */
  var bar = $('.progress > span');
  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'quiet-action text-meta to-top';
  toTop.hidden = true;
  toTop.innerHTML = ic(I.up) + 'topo';
  body.appendChild(toTop);
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, scrollY / max) : 0;
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    toTop.hidden = scrollY < 1200;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: scrollBehavior() }); main.focus({ preventScroll: true }); });

  /* ---------- atalhos: j/k capítulos, [ ] temas ---------- */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector('dialog[open]')) return;
    if ((e.key === '[' || e.key === ']') && theme) {
      var a = $('[data-pager="' + (e.key === '[' ? 'prev' : 'next') + '"]');
      if (a) location.href = a.href;
      return;
    }
    if (e.key !== 'j' && e.key !== 'k') return;
    var secs = $$('section.chap, section.module');
    if (!secs.length) return;
    var target = null;
    if (e.key === 'j') target = secs.filter(function (s) { return s.getBoundingClientRect().top > 140; })[0];
    else {
      var before = secs.filter(function (s) { return s.getBoundingClientRect().top < 100; });
      target = before.length > 1 ? before[before.length - 2] : before[0];
    }
    if (target) { e.preventDefault(); history.replaceState(null, '', '#' + target.id); target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); }
  });

  // âncora inicial: o conteúdo é transformado (e diagramas/fontes mudam a altura) depois do primeiro
  // scroll do navegador; mantém o alvo alinhado enquanto o layout assenta, até o usuário rolar.
  function keepAnchor(id, block) {
    var tgt = id && document.getElementById(id);
    if (!tgt) return;
    if (tgt.tagName === 'DETAILS') tgt.open = true;
    var stop = false;
    var align = function () { if (!stop) tgt.scrollIntoView({ block: block || 'start' }); };
    var quit = function () { stop = true; if (ro) ro.disconnect(); ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.removeEventListener(ev, quit, true); }); };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, quit, true); });
    var ro = 'ResizeObserver' in window && main ? new ResizeObserver(align) : null;
    if (ro) ro.observe(main);
    requestAnimationFrame(align);
    setTimeout(quit, 3000);
  }
  if (location.hash.length > 1) keepAnchor(decodeURIComponent(location.hash.slice(1)));

  // API mínima para search.js, diagrams.js e exam.js
  window.SFCCUI = { $: $, $$: $$, esc: esc, ic: ic, I: I, store: store, announce: announce, duration: duration, scrollBehavior: scrollBehavior, ROOT: ROOT, PAGE: PAGE, themeByN: themeByN, themeHref: themeHref, done: function () { return done; }, keepAnchor: keepAnchor };
})();
