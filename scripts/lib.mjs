// Utilitários compartilhados pelos scripts de build e validação (Node, sem dependências).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Carrega assets/js/manifest.js num sandbox e devolve window.SFCC. */
export function loadManifest() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/manifest.js'), 'utf8'), ctx);
  return ctx.window.SFCC;
}

/** Carrega assets/js/exam-data.js (window.SFCC_EXAM), se existir. */
export function loadExam() {
  const f = path.join(ROOT, 'assets/js/exam-data.js');
  if (!fs.existsSync(f)) return null;
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(f, 'utf8'), ctx);
  return ctx.window.SFCC_EXAM;
}

export const themeFile = (t) => path.join(ROOT, 'temas', t.slug + '.html');

const ENT = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&amp;': '&' };
/** HTML → texto corrido (mantém o conteúdo dos blocos de código de autoria). */
export function toText(html) {
  return html
    .replace(/<script\b(?![^>]*\bclass="(?:src|mmd)")[^>]*>[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(lt|gt|quot|#39|nbsp|amp);/g, (m) => ENT[m])
    .replace(/\s+/g, ' ')
    .trim();
}

/** Seções de capítulo de uma página de tema: [{ id, k, title, html }] */
export function chapters(html) {
  const out = [];
  const re = /<section class="chap" id="([^"]+)"(?: data-k="([^"]*)")?>([\s\S]*?)<\/section>\s*(?=<!--|<section|<\/main>)/g;
  let m;
  while ((m = re.exec(html))) {
    const h2 = m[3].match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    out.push({ id: m[1], k: m[2] || '', title: h2 ? toText(h2[1]) : m[1], html: m[3] });
  }
  return out;
}

/** Divide o HTML de um capítulo em blocos por <h3 id>: [{ id, title, html }] (o primeiro é a introdução) */
export function subsections(chapHtml) {
  const parts = chapHtml.split(/(?=<h3 id=")/);
  return parts.map((p, i) => {
    const h = p.match(/^<h3 id="([^"]+)"[^>]*>([\s\S]*?)<\/h3>/);
    return h ? { id: h[1], title: toText(h[2]), html: p } : { id: null, title: null, html: p, intro: i === 0 };
  });
}
