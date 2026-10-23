// Valida a estrutura do site: manifest ↔ arquivos, cobertura dos itens do exame,
// seções obrigatórias em cada tema, blocos de autoria bem fechados e links internos.
// Uso: node scripts/check.mjs            (falha com exit 1 se houver erro)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadManifest, loadExam, themeFile, chapters } from './lib.mjs';

const M = loadManifest();
const errors = [];
const warns = [];
const REQUIRED = ['conceitos', 'anti', 'troubleshooting', 'checklist', 'fixacao', 'referencias'];

// todos os itens do guia cobertos por pelo menos um tema
for (const it of M.items) {
  if (!M.themes.some((t) => t.covers.includes(it.id))) errors.push(`item ${it.id} sem tema`);
}

const ids = {}; // arquivo → Set(ids)
const pages = [path.join(ROOT, 'index.html'), path.join(ROOT, 'exame.html')];
const rows = [];
for (const t of M.themes) {
  const f = themeFile(t);
  if (!fs.existsSync(f)) { warns.push(`tema ${t.n} ainda não existe (${path.relative(ROOT, f)})`); continue; }
  pages.push(f);
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes(`data-tema="${t.n}"`)) errors.push(`${t.slug}: data-tema diferente de ${t.n}`);
  for (const r of t.related) if (!M.themes.some((x) => x.n === r)) errors.push(`${t.slug}: related ${r} inexistente`);
  const chs = chapters(html);
  const chIds = chs.map((c) => c.id);
  for (const r of REQUIRED) if (!chIds.includes(r)) errors.push(`${t.slug}: falta a seção #${r}`);
  const numbered = chs.filter((c) => /^cap\. \d+$/.test(c.k)).length;
  if (numbered < 5) errors.push(`${t.slug}: só ${numbered} capítulos numerados (mínimo 5)`);
  // blocos <script> de autoria: aberturas e fechamentos precisam bater (um "</script>" literal num exemplo fecharia o bloco)
  const opens = (html.match(/<script\b/g) || []).length;
  const closes = (html.match(/<\/script>/g) || []).length;
  if (opens !== closes) errors.push(`${t.slug}: ${opens} <script> abertos e ${closes} fechados`);
  for (const m of html.matchAll(/<script type="text\/plain" class="src"([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/<script\b/i.test(m[2])) errors.push(`${t.slug}: "<script" dentro de um bloco de código (escreva <\\script ou divida o exemplo)`);
  }
  const drills = (html.match(/<details class="answer">/g) || []).length;
  if (drills < 5) errors.push(`${t.slug}: só ${drills} questões de fixação (mínimo 5)`);
  rows.push({ n: t.n, kb: Math.round(Buffer.byteLength(html) / 1024), caps: numbered, code: (html.match(/class="src"/g) || []).length, mmd: (html.match(/class="mmd"/g) || []).length, q: drills });
}

// ids e links internos
for (const f of pages) {
  if (!fs.existsSync(f)) { errors.push(`falta ${path.relative(ROOT, f)}`); continue; }
  const html = fs.readFileSync(f, 'utf8');
  ids[f] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}
const exam = loadExam();
if (exam) {
  const ex = ids[path.join(ROOT, 'exame.html')];
  if (ex) { exam.cards.forEach((c, i) => ex.add('fc-' + (i + 1))); exam.questions.forEach((q, i) => ex.add('q-' + (i + 1))); }
  for (const c of exam.cards) if (!M.themes.some((t) => t.n === c.t)) errors.push(`flashcard com tema inválido: ${c.t}`);
  for (const q of exam.questions) {
    if (!M.themes.some((t) => t.n === q.t)) errors.push(`questão com tema inválido: ${q.t}`);
    if (!(q.a >= 0 && q.a < q.o.length)) errors.push(`questão sem resposta válida: ${q.q.slice(0, 60)}`);
  }
}
for (const f of pages) {
  if (!ids[f]) continue;
  const html = fs.readFileSync(f, 'utf8').replace(/<script type="text\/plain"[\s\S]*?<\/script>/g, '');
  for (const m of html.matchAll(/href="([^"#:]*?)(?:#([^"]*))?"/g)) {
    const [, file, hash] = m;
    if (/^(https?|mailto)/.test(file)) continue;
    const target = file ? path.resolve(path.dirname(f), file) : f;
    if (file && !fs.existsSync(target)) {
      if (target.includes(`${path.sep}temas${path.sep}`)) warns.push(`${path.relative(ROOT, f)} → ${file} (tema ainda não escrito)`);
      else errors.push(`${path.relative(ROOT, f)}: link quebrado ${file}`);
      continue;
    }
    if (hash && ids[target] && !ids[target].has(hash)) errors.push(`${path.relative(ROOT, f)}: âncora inexistente ${file}#${hash}`);
  }
}

console.table(rows);
if (warns.length) console.log('avisos:\n  ' + [...new Set(warns)].join('\n  '));
if (errors.length) { console.error('ERROS:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('ok');
