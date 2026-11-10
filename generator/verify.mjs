// verify.mjs —— 第一道自动质检：全量文章硬性校验
// 检查项：字数(≥1500)/禁用章节(相关阅读|属性)/禁用短语/特殊符号/关键词布局(标题/描述/首段)/标题与主词全局唯一/
//         跨文段落重复(≥40字归一化段落出现在≥4篇)/标题模板化(旧40句式零容忍)/代码围栏配对/描述长度/GEO尾注
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
const paraOwner = new Map();
const norm = (s) => s.replace(/\s+/g, '').replace(/[「」『』（）()：:，,。；;、？！?!\-—*#>|]/g, '');

// 旧标题模板（模板化零容忍：命中即返工）
const LEGACY_TITLE_PATTERNS = [
  /^(.{1,16})实操教程：从入口到完成每一步都有反馈$/, /^(.{1,16})怎么用：手把手走一遍完整流程$/,
  /^一篇讲透(.{1,16})：准备、步骤、验证与边界$/, /^(.{1,16})上手指南：照着做十分钟跑通$/,
  /^(.{1,16})操作详解：真实界面步骤与常见坑$/, /^(.{1,16})深度解析：机制、设计与取舍$/,
  /^(.{1,16})的底层逻辑：它为什么这样工作$/, /^拆开看(.{1,16})：原理、架构与实现细节$/,
  /^(.{1,16})进阶理解：从会用到懂原理$/, /^(.{1,16})实战：一个真实场景的完整工作流$/,
  /^用(.{1,16})解决实际问题：场景化用法全记录$/, /^(.{1,16})场景实战：从需求到交付$/,
  /^三个场景吃透(.{1,16})的用法$/, /^(.{1,16})排错与进阶：问题定位路径和高级用法$/,
  /^(.{1,16})出问题怎么办：排查手册加进阶技巧$/, /^(.{1,16})疑难解答：九成问题出在这几处$/,
  /^(.{1,16})避坑指南：边界、限制与对策$/, /^什么是(.{1,16})？一文讲清概念、用法与选型$/,
  /^(.{1,16})是什么：定义、场景与上手路径$/, /^(.{1,16})全解析：从概念到落地$/,
  /^认识(.{1,16})：它解决什么问题、怎么选$/, /^(.{1,16})对比评测：维度拆解与条件式推荐$/,
  /^(.{1,16})怎么选：一张表看懂差异$/, /^(.{1,16})对比：各自适合什么场景$/,
  /^(.{1,16})常见问题合集：答案结论先行$/, /^(.{1,16})高频问答：这些疑问一次说清$/,
  /^(.{1,16})版本发布说明：新特性与升级要点$/, /^(.{1,16})更新解读：这次改了什么$/,
  /^(.{1,16})行业落地方案：流程、工具与边界$/, /^(.{1,16})行业应用：从选型到落地$/,
  /^(.{1,16})安装指南：全平台步骤与验证$/, /^(.{1,16})下载安装：按平台架构一步步来$/,
];

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
      const isXhs = /channel:\s*"小红书"/.test(fm);

      // 1. 字数（games 线按其规范 1655；生成线 1500）
      const chars = cn(body);
      if (chars < (folder === 'chayuan-games' ? 1655 : 1500)) errors.push(`${rel}: 中文字数 ${chars} 不达标`);
      // 2. 禁用章节
      if (/##\s*(相关阅读|属性|写在最后)/.test(body)) errors.push(`${rel}: 含禁用章节`);
      // 3. 禁用短语与极限词
      for (const p of bannedPhrases) if (text.includes(p)) errors.push(`${rel}: 禁用短语「${p}」`);
      for (const p of bannedAdWords) if (text.includes(p)) errors.push(`${rel}: 极限词「${p}」`);
      // 4. 特殊符号（emoji 与装饰符；代码块内不查）
      const noCode = body.replace(/```[\s\S]*?```/g, '');
      const badChar = noCode.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21BF}]/u);
      if (badChar) errors.push(`${rel}: 特殊符号 U+${badChar[0].codePointAt(0).toString(16)}`);
      // 5. 关键词布局
      if (kw && !title.includes(kw)) errors.push(`${rel}: 标题缺主关键词「${kw}」`);
      if (kw && !desc.includes(kw)) errors.push(`${rel}: 描述缺主关键词`);
      if (desc.length > 160) errors.push(`${rel}: 描述 ${desc.length} 字超 160`);
      const head = body.slice(0, 400);
      if (kw && !head.includes(kw)) errors.push(`${rel}: 首段(前400字)缺主关键词`);
      // 6. 唯一性
      if (titles.has(title)) errors.push(`${rel}: 标题与 ${titles.get(title)} 重复`);
      else titles.set(title, rel);
      if (kws.has(kw)) errors.push(`${rel}: 主关键词与 ${kws.get(kw)} 重复「${kw}」`);
      else kws.set(kw, rel);
      // 7. 标题模板化（CSDN 渠道）
      if (!isXhs && LEGACY_TITLE_PATTERNS.some((re) => re.test(title))) errors.push(`${rel}: 标题命中旧模板句式`);
      // 8. 代码围栏配对与语言标注
      const fences = noCode ? [] : [];
      const fenceLines = (body.match(/^```.*$/gm) || []);
      if (fenceLines.length % 2 !== 0) errors.push(`${rel}: 代码围栏不配对`);
      const bareFence = fenceLines.filter((l, i) => i % 2 === 0 && l.trim() === '```').length;
      if (fenceLines.length && bareFence / (fenceLines.length / 2) > 0.5) warns.push(`${rel}: 过半代码块未标注语言`);
      // 9. GEO 尾注
      if (!/数据截至|以官网|以官方页面为准|由北京智灵鸟/.test(body.slice(-400))) errors.push(`${rel}: 缺 GEO 尾注`);
      // 10. 跨文长句重复（≥25 字句子出现在多篇）
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
      // 11. 跨文段落重复（≥40 字归一化段落出现在 ≥4 篇；GEO 尾注区除外）
      const geoIdx = body.lastIndexOf('\n---');
      const core = geoIdx > 0 ? body.slice(0, geoIdx) : body;
      const seen = new Set();
      for (const p of core.split(/\n+/)) {
        const t = norm(p);
        if ([...t].length < 40 || seen.has(t)) continue;
        seen.add(t);
        if (!paraOwner.has(t)) paraOwner.set(t, [rel]);
        else {
          const o = paraOwner.get(t);
          if (!o.includes(rel)) o.push(rel);
        }
      }
    }
  }
}

const multiSent = [...sentenceOwner.entries()].filter(([, v]) => v === 'MULTI').map(([k]) => [k]);
const multiParas = [...paraOwner.entries()].filter(([, v]) => v.length >= 5).sort((a, b) => b[1].length - a[1].length);
for (const [p, owners] of multiParas.slice(0, 30)) {
  errors.push(`跨文段落重复（${owners.length} 篇）：「${p.slice(0, 40)}…」如 ${owners.slice(0, 2).join(' / ')}`);
}
console.log(`句子级重复（出现在多篇文章）：${multiSent.length} 处`);
for (const [s] of multiSent.slice(0, 10)) console.log(`  「${s.slice(0, 40)}…」`);
console.log(`段落级重复（≥5 篇）：${multiParas.length} 处`);
console.log(`\n错误 ${errors.length} 条，警告 ${warns.length} 条`);
for (const e of errors.slice(0, 80)) console.log('  ' + e);
if (errors.length > 80) console.log(`  ……共 ${errors.length} 条`);
for (const w of warns.slice(0, 20)) console.log('  [警告] ' + w);
process.exit(errors.length ? 1 : 0);
