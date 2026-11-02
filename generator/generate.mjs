// generate.mjs —— 主生成器：构建规划 → 渲染全部文章 → 清理旧文 → 产出索引与总表
// 用法：node generator/generate.mjs [--keep]   (--keep 保留旧文件，仅覆盖同名)
import { buildPlan } from './plan.mjs';
import { renderArticle } from './shared/render.mjs';
import { PRODUCTS } from './facts/products.mjs';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// 防误写保护：ROOT 必须是本仓库根（含 strategy 目录），否则立即终止
if (!existsSync(join(ROOT, 'strategy'))) {
  console.error(`安全检查失败：ROOT=${ROOT} 不是 chayuan-articles 仓库根，拒绝写入。`);
  process.exit(2);
}
const keep = process.argv.includes('--keep');

const plan = buildPlan();
const byProduct = new Map();
let min = Infinity, total = 0;
const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;

for (const row of plan) {
  const P = PRODUCTS[row.product];
  const dir = join(ROOT, P.folder, row.category);
  mkdirSync(dir, { recursive: true });
  const article = renderArticle(row);
  const target = join(dir, row.file);
  writeFileSync(target, article);
  const n = cn(article);
  min = Math.min(min, n);
  total += n;
  if (!byProduct.has(row.product)) byProduct.set(row.product, { rows: [], chars: 0 });
  byProduct.get(row.product).rows.push(row);
  byProduct.get(row.product).chars += n;
}

// 清理旧文件（不在新计划里的 md）
if (!keep) {
  for (const [pk, { rows }] of byProduct) {
    const P = PRODUCTS[pk];
    const valid = new Set(rows.map((r) => r.file));
    for (const cat of readdirSync(join(ROOT, P.folder))) {
      const catDir = join(ROOT, P.folder, cat);
      try {
        if (!catDir.endsWith('.md')) for (const f of readdirSync(catDir)) {
          if (f.endsWith('.md') && !valid.has(f)) rmSync(join(catDir, f));
        }
      } catch { /* 非目录跳过 */ }
    }
  }
}

// 产品 README 索引
const CAT_LABEL = {
  '00-关键词覆盖': '关键词覆盖', '01-下载安装': '下载安装', '02-功能教程': '功能教程', '03-场景用例': '场景用例',
  '04-行业方案': '行业方案', '05-对比评测': '对比评测', '06-常见问题': '常见问题', '07-技术解析': '技术解析',
  '08-版本发布': '版本发布', '09-社区种草': '社区种草',
};
for (const [pk, { rows, chars }] of byProduct) {
  const P = PRODUCTS[pk];
  const cats = {};
  for (const r of rows) (cats[r.category] = cats[r.category] || []).push(r);
  let md = `# ${P.name}网文库\n\n> ${P.definition}\n\n- 官网：${P.siteUrl}｜出品：${P.vendor}｜${P.version ? `版本基线 ${P.version}｜` : ''}共 ${rows.length} 篇，平均 ${Math.round(chars / rows.length)} 中文字/篇\n\n`;
  for (const [cat, list] of Object.entries(cats)) {
    md += `## ${CAT_LABEL[cat] || cat}（${list.length} 篇）\n\n| 文件 | 标题 | 主关键词 |\n|---|---|---|\n`;
    for (const r of list) md += `| ${cat}/${r.file} | ${r.title} | ${r.kw} |\n`;
    md += '\n';
  }
  writeFileSync(join(ROOT, P.folder, 'README.md'), md);
}

// 总表 CSV
const csv = ['\uFEFF序号,产品,类别,文件,标题,主关键词,关键词,文型\n']
  .concat(plan.map((r) => `${r.n},${PRODUCTS[r.product].name},${r.category},${PRODUCTS[r.product].folder}/${r.category}/${r.file},"${r.title}","${r.kw}","${r.kws.join(' ')}",${r.archetype}`))
  .join('\n');
mkdirSync(join(ROOT, 'strategy'), { recursive: true });
writeFileSync(join(ROOT, 'strategy', '04-文章规划总表.csv'), csv);

console.log(`生成完成：${plan.length} 篇｜最小 ${min} 字｜平均 ${Math.round(total / plan.length)} 字`);
for (const [pk, { rows, chars }] of byProduct) {
  const cats = {};
  for (const r of rows) cats[r.category] = (cats[r.category] || 0) + 1;
  console.log(`  ${PRODUCTS[pk].name}: ${rows.length} 篇 (avg ${Math.round(chars / rows.length)} 字) ${Object.entries(cats).map(([k, v]) => `${k.slice(3)}:${v}`).join(' ')}`);
}
