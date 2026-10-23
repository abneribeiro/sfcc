// Gera assets/js/search-index.js (window.SFCC_INDEX) a partir das páginas de tema e dos dados do exame.
// Uma entrada por capítulo (introdução) e por subcapítulo <h3 id>; uma por flashcard e por questão.
// Uso: node scripts/build-search-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadManifest, loadExam, themeFile, toText, chapters, subsections } from './lib.mjs';

const MAX = 4000; // caracteres de texto por entrada (o snippet só usa um trecho)
const clean = (s) => toText(s.replace(/<\\\/script>/g, '</script>').replace(/<\\script/g, '<script')).slice(0, MAX);

const M = loadManifest();
const entries = [];

for (const t of M.themes) {
  const f = themeFile(t);
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf8');
  const href = `temas/${t.slug}.html`;
  for (const c of chapters(html)) {
    const kicker = `tema ${t.n} · ${t.title}`;
    const body = c.html.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '');
    for (const s of subsections(body)) {
      const text = clean(s.html.replace(/^<h3[^>]*>[\s\S]*?<\/h3>/, ''));
      if (!text) continue;
      if (s.id) entries.push({ h: `${href}#${s.id}`, t: `${c.title} › ${s.title}`, k: kicker, x: text });
      else entries.push({ h: `${href}#${c.id}`, t: c.title, k: kicker, x: text });
    }
  }
}

const exam = loadExam();
if (exam) {
  exam.cards.forEach((c, i) => entries.push({ h: `exame.html#fc-${i + 1}`, t: 'Flashcard · ' + toText(c.q), k: `flashcard · tema ${c.t}`, x: toText(c.q + ' ' + c.a) }));
  exam.questions.forEach((q, i) => entries.push({ h: `exame.html#q-${i + 1}`, t: `Questão ${i + 1} · ` + toText(q.q).slice(0, 90), k: `simulado · tema ${q.t}`, x: toText([q.q, ...q.o, q.e].join(' ')) }));
}

const out = '/* GERADO por scripts/build-search-index.mjs. Não edite à mão. */\nwindow.SFCC_INDEX = ' + JSON.stringify(entries) + ';\n';
fs.writeFileSync(path.join(ROOT, 'assets/js/search-index.js'), out);
console.log(`search-index.js: ${entries.length} entradas, ${(out.length / 1024).toFixed(0)} KB`);
