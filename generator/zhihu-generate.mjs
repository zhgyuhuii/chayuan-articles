// zhihu-generate.mjs —— 知乎线主生成器：预载全库语料额度 → 生成 500 篇 → 产出索引
// 用法：node generator/zhihu-generate.mjs
import { buildZhihuPlan } from './zhihu-plan.mjs';
import { renderZhihuArticle } from './shared/zhihu-render.mjs';
import { budgetUnits, budgetPreload, budgetCheck, budgetAdmit } from './shared/render.mjs';
import { setExistingNorms } from './shared/zhihu-render.mjs';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(ROOT, 'strategy'))) { console.error(`安全检查失败：ROOT=${ROOT} 非本仓库根`); process.exit(2); }

// ---------- 1. 预载：现有文章的每个 ≥30 字单元记 1 次使用（知乎线只能用剩余额度） ----------
const FOLDERS = ['chayuan-os', 'chayuan-office', 'chayuan-wps', 'website', 'chayuan-games'];
const existingKws = new Set(), existingTitles = new Set();
const existingNorms = new Set();
let preloaded = 0;
for (const folder of FOLDERS) {
  for (const cat of readdirSync(join(ROOT, folder))) {
    const catDir = join(ROOT, folder, cat);
    let files;
    try { files = readdirSync(catDir).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const text = readFileSync(join(catDir, f), 'utf8');
      const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (m) {
        existingTitles.add(m[1].match(/title: "(.*)"/)?.[1] || '');
        existingKws.add(m[1].match(/primary_keyword: "(.*)"/)?.[1] || '');
      }
      budgetPreload(budgetUnits(text));
      for (const u of budgetUnits(text)) existingNorms.add(u);
      preloaded++;
    }
  }
}

setExistingNorms(existingNorms);

// ---------- 2. 规划 + 渲染 ----------
const plan = buildZhihuPlan([...existingKws], [...existingTitles]);
console.log(`预载 ${preloaded} 篇现有文章｜知乎线规划 ${plan.length} 篇`);
if (plan.length !== 500) console.log(`警告：规划 ${plan.length} 篇 ≠ 500`);

const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;
const byProduct = new Map();
let min = Infinity, total = 0;
for (const row of plan) {
  const dir = join(ROOT, 'zhihu', row.product);
  mkdirSync(dir, { recursive: true });
  const art = renderZhihuArticle(row, { answer: row.answer, goal: row.goal, scene: row.scene, loc: row.loc, core: row.core });
  writeFileSync(join(dir, row.file), art);
  const n = cn(art);
  min = Math.min(min, n); total += n;
  if (!byProduct.has(row.product)) byProduct.set(row.product, { rows: [], chars: 0 });
  byProduct.get(row.product).rows.push(row);
  byProduct.get(row.product).chars += n;
}

// ---------- 3. 索引 ----------
const CAT = { stance: '立场问答', pit: '劝退与坑', deep: '机制拆解', decide: '决策框架' };
let md = `# 察元AI 知乎线网文库\n\n> 面向知乎平台的 500 篇：立场问答 / 劝退与坑 / 机制拆解 / 决策框架四体。文风对标知乎专栏高赞（观点句小节、口语判断、诚实边界），反 AI 味、反推广腔；产品只作为案例出现，不做推销。\n\n- 官网：https://aidooo.com｜出品：北京智灵鸟科技中心｜共 ${plan.length} 篇，平均 ${Math.round(total / plan.length)} 中文字/篇\n`;
for (const [pk, { rows, chars }] of byProduct) {
  md += `\n## ${rows[0].category === 'zhihu' ? '' : ''}${pk}（${rows.length} 篇，平均 ${Math.round(chars / rows.length)} 字）\n\n| 文件 | 标题 | 主关键词 | 文体 |\n|---|---|---|---|\n`;
  for (const r of rows) md += `| ${pk}/${r.file} | ${r.title} | ${r.kw} | ${CAT[r.style]} |\n`;
  md += '\n';
}
writeFileSync(join(ROOT, 'zhihu', 'README.md'), md);

console.log(`生成完成：${plan.length} 篇｜最小 ${min} 字｜平均 ${Math.round(total / plan.length)} 字`);
for (const [pk, { rows, chars }] of byProduct) console.log(`  ${pk}: ${rows.length} 篇 (avg ${Math.round(chars / rows.length)})`);
