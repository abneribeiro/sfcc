/* Diagramas Mermaid na rampa de tinta, desenhados sob demanda a tamanho natural (texto a 14px).
   core.js já transformou cada <script class="mmd"> em figure[data-diagram]. */
(function () {
  'use strict';
  var U = window.SFCCUI;
  var $ = U.$, $$ = U.$$;
  var figs = $$('[data-diagram]');
  if (!figs.length) return;

  // espelhos hex dos tokens de cada tema (o Mermaid não lê variáveis CSS)
  var PALETTES = {
    paper: { s: '#ffffff', s2: '#f6f6f6', s3: '#efefef', h: '#e0e0e0', ink: '#0e0e0e', ink2: '#545454', ink3: '#767676', ink4: '#9a9a9a' },
    night: { s: '#0e0e0e', s2: '#171717', s3: '#1f1f1f', h: '#2a2a2a', ink: '#ffffff', ink2: '#b0b0b0', ink3: '#7c7c7c', ink4: '#5c5c5c' },
  };
  function themeName() { return document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'paper'; }
  function mermaidConfig() {
    var c = PALETTES[themeName()];
    var vars = {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontSize: '14px', darkMode: themeName() === 'night',
      background: c.s, primaryColor: c.s2, primaryTextColor: c.ink, primaryBorderColor: c.ink4,
      secondaryColor: c.s3, secondaryTextColor: c.ink, secondaryBorderColor: c.ink4,
      tertiaryColor: c.s, tertiaryTextColor: c.ink, tertiaryBorderColor: c.h,
      lineColor: c.ink3, textColor: c.ink2, mainBkg: c.s2, nodeBorder: c.ink4,
      clusterBkg: c.s, clusterBorder: c.h, titleColor: c.ink, edgeLabelBackground: c.s,
      actorBkg: c.s2, actorBorder: c.ink4, actorTextColor: c.ink, actorLineColor: c.ink4,
      signalColor: c.ink2, signalTextColor: c.ink2, labelBoxBkgColor: c.s2, labelBoxBorderColor: c.ink4,
      labelTextColor: c.ink, loopTextColor: c.ink2, noteBkgColor: c.s3, noteBorderColor: c.h,
      noteTextColor: c.ink2, activationBkgColor: c.s3, activationBorderColor: c.ink4, sequenceNumberColor: c.s,
    };
    [c.s, c.s2, c.s3, c.h].forEach(function (g, i) {
      for (var k = i; k < 12; k += 4) { vars['cScale' + k] = g; vars['cScaleLabel' + k] = c.ink; vars['cScalePeer' + k] = c.ink4; }
    });
    return {
      startOnLoad: false, theme: 'base', securityLevel: 'strict', themeVariables: vars,
      flowchart: { curve: 'basis', htmlLabels: true, useMaxWidth: false, padding: 12, nodeSpacing: 40, rankSpacing: 48 },
      sequence: { mirrorActors: false, useMaxWidth: false, actorFontSize: 14, messageFontSize: 14, noteFontSize: 14, boxMargin: 8 },
      state: { useMaxWidth: false },
      mindmap: { useMaxWidth: false, padding: 12 },
    };
  }
  var mermaidP = null, configuredFor = null;
  function loadMermaid() {
    if (!mermaidP) mermaidP = import('https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs').then(function (m) { return m.default; });
    return mermaidP.then(function (mm) {
      if (configuredFor !== themeName()) { mm.initialize(mermaidConfig()); configuredFor = themeName(); }
      return mm;
    });
  }

  // mede o tamanho natural. Fluxogramas: viewBox recalculado pelo conteúdo (o do Mermaid fica curto
  // quando as métricas da fonte mudam). Sequência: mantém o viewBox, que corta as lifelines de 2000px.
  function sizeSvg(s) {
    s.removeAttribute('style');
    var w, h;
    if (s.getAttribute('aria-roledescription') === 'sequence') {
      var vb = s.viewBox.baseVal;
      w = Math.ceil(vb.width); h = Math.ceil(vb.height);
    } else {
      var bb = s.getBBox();
      if (!bb.width || !bb.height) return null;
      w = Math.ceil(bb.width + 16); h = Math.ceil(bb.height + 16);
      s.setAttribute('viewBox', (bb.x - 8) + ' ' + (bb.y - 8) + ' ' + w + ' ' + h);
    }
    s.setAttribute('data-w', w);
    s.setAttribute('data-h', h);
    return { w: w, h: h };
  }
  // encaixa na coluna encolhendo no máximo até o texto ficar a 12px; abaixo disso rola na moldura
  var MIN_SCALE = 12 / 14;
  function updateOverflow(fig) {
    var out = $('.mermaid-out', fig);
    var s = $('svg', out);
    if (!s || !s.getAttribute('data-w')) return;
    var w = +s.getAttribute('data-w'), h = +s.getAttribute('data-h');
    var avail = out.clientWidth - 32;
    if (avail <= 0) return;
    var scale = Math.max(MIN_SCALE, Math.min(1, avail / w));
    s.setAttribute('width', Math.round(w * scale));
    s.setAttribute('height', Math.round(h * scale));
    $('.fig-hint', fig).hidden = w * scale <= avail + 1;
  }

  var uid = 0;
  function renderDiagram(fig) {
    if (fig.getAttribute('data-done')) return;
    fig.setAttribute('data-done', '1');
    var src = $('.mermaid-src', fig).textContent;
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([loadMermaid(), fontsReady]).then(function (r) {
      return r[0].render('mmd-' + (++uid), src);
    }).then(function (r) {
      var out = $('.mermaid-out', fig);
      var before = fig.offsetHeight;
      var above = fig.getBoundingClientRect().bottom < 128;
      out.innerHTML = r.svg;
      out.hidden = false;
      $('.mermaid-src', fig).hidden = true;
      var s = $('svg', out);
      if (s) {
        s.setAttribute('role', 'img');
        s.setAttribute('aria-label', $('.fig-k', fig).textContent);
        try { sizeSvg(s); } catch (e) { /* SVG sem geometria: mantém o original */ }
        $('[data-zoom]', fig).hidden = false;
        updateOverflow(fig);
      }
      // mantém a posição de leitura quando um diagrama acima do viewport muda de altura
      if (above) window.scrollBy(0, fig.offsetHeight - before);
    }).catch(function () {
      fig.removeAttribute('data-done');
      $('.fig-k', fig).textContent += ' · fonte mermaid (render indisponível offline)';
    });
  }
  var io = null;
  function observeDiagrams() {
    if (!('IntersectionObserver' in window)) { figs.forEach(renderDiagram); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); renderDiagram(en.target); } });
    }, { rootMargin: '600px 0px' });
    figs.forEach(function (f) { if (!f.getAttribute('data-done')) io.observe(f); });
  }
  observeDiagrams();

  document.addEventListener('sfcc:prefs', function (e) {
    if (e.detail.themeChanged) {
      figs.forEach(function (f) {
        if (!f.getAttribute('data-done')) return;
        f.removeAttribute('data-done');
        $('.mermaid-out', f).hidden = true;
        $('.mermaid-src', f).hidden = false;
      });
      observeDiagrams();
    } else {
      figs.forEach(function (f) { if (f.getAttribute('data-done')) updateOverflow(f); });
    }
  });
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { figs.forEach(function (f) { if (f.getAttribute('data-done')) updateOverflow(f); }); }).observe($('#main'));
  }

  /* ---------- visualizador ampliado ---------- */
  var viewer = document.createElement('dialog');
  viewer.className = 'viewer';
  viewer.setAttribute('aria-label', 'diagrama ampliado');
  viewer.innerHTML =
    '<div class="viewer-bar"><p class="text-label">diagrama</p>' +
    '<p class="seg"><button type="button" class="quiet-action text-meta" data-vz="out" aria-label="diminuir">−</button><span class="text-meta vz-v" data-vz-v>100%</span><button type="button" class="quiet-action text-meta" data-vz="in" aria-label="aumentar">+</button><button type="button" class="quiet-action text-meta" data-vz="fit">ajustar</button><button type="button" class="quiet-action text-meta" data-vz="1">1:1</button><button type="button" class="quiet-action text-meta" data-vz="close">fechar</button></p></div>' +
    '<div class="viewer-body" tabindex="0"></div>';
  document.body.appendChild(viewer);
  var vBody = $('.viewer-body', viewer);
  var vZoom = 1, vSvg = null;
  function applyZoom() {
    if (!vSvg) return;
    vSvg.setAttribute('width', Math.round(+vSvg.getAttribute('data-w') * vZoom));
    vSvg.setAttribute('height', Math.round(+vSvg.getAttribute('data-h') * vZoom));
    $('[data-vz-v]', viewer).textContent = Math.round(vZoom * 100) + '%';
  }
  function fitZoom() {
    var w = vBody.clientWidth - 48, h = vBody.clientHeight - 48;
    return Math.max(0.25, Math.min(2, w / +vSvg.getAttribute('data-w'), h / +vSvg.getAttribute('data-h')));
  }
  document.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zoom]');
    if (z) {
      var s = $('.mermaid-out svg', z.closest('.diagram'));
      if (!s || !viewer.showModal) return;
      // o CSS do Mermaid está preso ao id do SVG: o clone recebe id próprio e o <style> é reescrito
      vSvg = s.cloneNode(true);
      var oldId = s.id;
      vSvg.id = 'mmd-viewer';
      $$('style', vSvg).forEach(function (st) { st.textContent = st.textContent.split('#' + oldId).join('#mmd-viewer'); });
      vBody.innerHTML = '';
      vBody.appendChild(vSvg);
      viewer.showModal();
      vZoom = Math.min(1.5, fitZoom());
      applyZoom();
      vBody.focus();
      return;
    }
    var b = e.target.closest('[data-vz]');
    if (!b) return;
    var a = b.getAttribute('data-vz');
    if (a === 'close') { viewer.close(); return; }
    if (a === 'in') vZoom = Math.min(3, vZoom * 1.25);
    if (a === 'out') vZoom = Math.max(0.25, vZoom / 1.25);
    if (a === 'fit') vZoom = fitZoom();
    if (a === '1') vZoom = 1;
    applyZoom();
  });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === '+' || e.key === '=') { vZoom = Math.min(3, vZoom * 1.25); applyZoom(); }
    if (e.key === '-') { vZoom = Math.max(0.25, vZoom / 1.25); applyZoom(); }
    if (e.key === '0') { vZoom = fitZoom(); applyZoom(); }
  });
  viewer.addEventListener('close', function () { vBody.innerHTML = ''; vSvg = null; });
})();
