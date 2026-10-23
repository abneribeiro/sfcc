/* aplica as preferências de leitura antes da primeira pintura (evita flash); carregado no <head> */
(function () { try { var p = JSON.parse(localStorage.getItem('sfcc-reading-v1')) || {}; var r = document.documentElement;
  if (p.size) r.setAttribute('data-size', p.size); if (p.measure) r.setAttribute('data-measure', p.measure); if (p.theme) r.setAttribute('data-theme', p.theme);
} catch (e) {} })();
