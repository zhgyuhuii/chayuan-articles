// 生成后质检：扫描全部文章，统计字数不足与禁词命中
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cjkCount, findBanned } from './shared/render.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bad = [];
let total = 0, minCjk = Infinity, sumCjk = 0;
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.md') && !f.startsWith('README')) {
      const t = fs.readFileSync(p, 'utf8');
      const body = t.replace(/^---[\s\S]*?---\n/, '');
      const c = cjkCount(body);
      total++; sumCjk += c; minCjk = Math.min(minCjk, c);
      const b = findBanned(t);
      if (c < 1000 || b.length) bad.push({ p: p.replace(ROOT + '/', ''), c, b });
    }
  }
}
for (const d of ['chayuan-wps', 'chayuan-office', 'chayuan-os', 'website']) walk(path.join(ROOT, d));
const reasons = {};
for (const x of bad) { const k = x.b.length ? ('禁词:' + x.b.join('|')) : `字数不足(${Math.floor(x.c / 100) * 100}档)`; reasons[k] = (reasons[k] || 0) + 1; }
console.log(`文件总数 ${total}，中文字数：最小 ${minCjk} / 平均 ${Math.round(sumCjk / total)}，不达标 ${bad.length}`);
console.log(reasons);
console.log('--- 字数不足样本 ---');
bad.filter((x) => !x.b.length).slice(0, 10).forEach((x) => console.log(x.c, x.p));
console.log('--- 禁词分布 ---');
const byWord = {};
for (const x of bad.filter((x) => x.b.length)) for (const w of x.b) byWord[w] = (byWord[w] || 0) + 1;
console.log(byWord);
bad.filter((x) => x.b.length).slice(0, 5).forEach((x) => console.log(x.p, x.b));
