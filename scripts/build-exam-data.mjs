// Gera assets/js/exam-data.js (window.SFCC_EXAM) a partir de scripts/exam-source.json.
// Uso: node scripts/build-exam-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadManifest } from './lib.mjs';

const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/exam-source.json'), 'utf8'));
const M = loadManifest();
const themes = new Set(M.themes.map((t) => t.n));

const errors = [];
src.cards.forEach((c, i) => { if (!themes.has(c.t)) errors.push(`card ${i + 1}: tema ${c.t}`); });
src.questions.forEach((q, i) => {
  if (!themes.has(q.t)) errors.push(`questão ${i + 1}: tema ${q.t}`);
  if (!(q.a >= 0 && q.a < q.o.length)) errors.push(`questão ${i + 1}: resposta ${q.a}`);
});
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// ordena por tema, mantendo a ordem relativa
const byTheme = (a, b) => a.t.localeCompare(b.t);
const cards = src.cards.map((c, i) => ({ ...c, _i: i })).sort((a, b) => byTheme(a, b) || a._i - b._i).map(({ _i, ...c }) => c);
const questions = src.questions.map((q, i) => ({ ...q, _i: i })).sort((a, b) => byTheme(a, b) || a._i - b._i).map(({ _i, ...q }) => q);

const out = '/* GERADO por scripts/build-exam-data.mjs a partir de scripts/exam-source.json. Não edite à mão. */\n' +
  'window.SFCC_EXAM = ' + JSON.stringify({ exam: src.exam, domains: src.domains, cards, questions }, null, 1) + ';\n';
fs.writeFileSync(path.join(ROOT, 'assets/js/exam-data.js'), out);
console.log(`exam-data.js: ${cards.length} flashcards, ${questions.length} questões`);
