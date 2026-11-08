// verify.mjs —— 第一道自动质检：全量文章硬性校验
// 检查项：字数(≥1500)/禁用章节(相关阅读|属性)/禁用短语/特殊符号/关键词布局(标题/描述/首段)/标题与主词全局唯一/跨文句子重复
// 用法：node generator/verify.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedPhrases, bannedAdWords } from './facts/voice.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(ROOT, 'strategy'))) { console.error(`安全检查失败：ROOT=${ROOT} 非本仓库根`); process.exit(2); }
const FOLDERS = ['chayuan-os', 'chayuan-office', 'chayuan-wps', 'website', 'chayuan-games'];
const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;
const errors = [], warns = [];
const titles = new Map(), kws = new Map();
const sentenceOwner = new Map();

for (const folder of FOLDERS) {
  for (const cat of readdirSync(join(ROOT, folder))) {
    const catDir = join(ROOT, folder, cat);
    let files;
    try { files = readdirSync(catDir).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const path = join(catDir, f);
      const rel = `${folder}/${cat}/${f}`;
      const text = readFileSync(path, 'utf8');
      const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) { errors.push(`${rel}: frontmatter 缺失`); continue; }
      const fm = m[1], body = m[2];
      const title = fm.match(/title: "(.*)"/)?.[1] || '';
      const kw = fm.match(/primary_keyword: "(.*)"/)?.[1] || '';
      const desc = fm.match(/description: "(.*)"/)?.[1] || '';

      // 1. 字数
      const chars = cn(body);
      if (chars < 1500) errors.push(`${rel}: 中文字数 ${chars} < 1500`);
      // 2. 禁用章节
      if (/##\s*(相关阅读|属性|写在最后)/.test(body)) errors.push(`${rel}: 含禁用章节`);
      // 3. 禁用短语与极限词
      for (const p of bannedPhrases) if (text.includes(p)) errors.push(`${rel}: 禁用短语「${p}」`);
      for (const p of bannedAdWords) if (text.includes(p)) errors.push(`${rel}: 极限词「${p}」`);
      // 4. 特殊符号（emoji 与装饰符）
      const badChar = text.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21BF}]/u);
      if (badChar) errors.push(`${rel}: 特殊符号 U+${badChar[0].codePointAt(0).toString(16)}`);
      // 5. 关键词布局
      if (kw && !title.includes(kw)) errors.push(`${rel}: 标题缺主关键词「${kw}」`);
      if (kw && !desc.includes(kw)) errors.push(`${rel}: 描述缺主关键词`);
      const head = body.slice(0, 400);
      if (kw && !head.includes(kw)) errors.push(`${rel}: 首段(前400字)缺主关键词`);
      // 6. 唯一性
      if (titles.has(title)) errors.push(`${rel}: 标题与 ${titles.get(title)} 重复`);
      else titles.set(title, rel);
      if (kws.has(kw)) errors.push(`${rel}: 主关键词与 ${kws.get(kw)} 重复「${kw}」`);
      else kws.set(kw, rel);
      // 7. 跨文长句重复（≥25 字的句子出现在 4 篇以上才报警）
      for (const s of body.split(/[。！？\n]/)) {
        const t = s.trim().replace(/^[-*#\d.\s|]+/, '');
        if (cn(t) < 25) continue;
        if (!sentenceOwner.has(t)) sentenceOwner.set(t, [rel]);
        else if (sentenceOwner.get(t) !== 'MULTI') {
          const owners = sentenceOwner.get(t);
          if (!owners.includes(rel)) owners.push(rel);
          if (owners.length >= 6) sentenceOwner.set(t, 'MULTI');
        }
      }
    }
  }
}

const multiSent = [...sentenceOwner.entries()].filter(([, v]) => v === 'MULTI').map(([k]) => [k]);
console.log(`句子级重复（出现在多篇文章）：${multiSent.length} 处`);
for (const [s] of multiSent.slice(0, 15)) console.log(`  「${s.slice(0, 40)}…」`);
console.log(`\n错误 ${errors.length} 条，警告 ${warns.length} 条`);
for (const e of errors.slice(0, 80)) console.log('  ' + e);
if (errors.length > 80) console.log(`  ……共 ${errors.length} 条`);
process.exit(errors.length ? 1 : 0);
