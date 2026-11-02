// harvest.mjs —— 从源项目真实教程中提取操作步骤/FAQ/场景，落到 generator/facts/harvested/
// 用法：node generator/harvest.mjs
// 源教程（六节结构：一句话说明/适用场景/前置条件/操作步骤(+验证)/常见问题/形态差异）：
//   chayuan-harness/docs/user-tutorials/*.md  (86 篇，察元AI OS)
//   chayuan-office/docs/user-tutorials/*.md   (47 篇，察元AI Office)
//   chayuan-wps/docs/user-tutorials/*.md      (44 篇，察元AI文档助手)
//   chayuan-wps/assistant-tutorials/**/*.md   (31 篇，助手用法短文)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/Users/zyh/work';
const OUT = new URL('./facts/harvested/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// ---------- 工具 ----------
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return { fm, body: m[2] };
}

function splitSections(body) {
  // 按 ## 切节；### 验证 保留在操作步骤内
  const out = {};
  const lines = body.split(/\r?\n/);
  let cur = '_pre';
  let buf = [];
  const flush = () => { out[cur] = (out[cur] || '') + buf.join('\n').trim(); buf = []; };
  for (const ln of lines) {
    const h = ln.match(/^##\s+(.*)$/);
    if (h) { flush(); cur = h[1].trim(); } else buf.push(ln);
  }
  flush();
  return out;
}

function stripToPlain(s) {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // md 链接→纯文本
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function parseBullets(s) {
  return s.split(/\r?\n/).map((l) => l.replace(/^\s*[-*]\s+/, '').trim()).filter(Boolean).map(stripToPlain);
}

function parseFAQ(s) {
  // **Q1：xxx** 换行 答案…… 或 **Q：xxx**\nA：xxx
  const faqs = [];
  const re = /\*\*(Q[^*]*?)\*\*\s*\r?\n?([\s\S]*?)(?=\r?\n\*\*Q|\r?\n##|$)/g;
  let m;
  while ((m = re.exec(s))) {
    const q = stripToPlain(m[1]).replace(/^Q\d*[：:]?\s*/, '').trim();
    let a = m[2].trim();
    if (/^A[：:]/.test(a)) a = a.replace(/^A[：:]\s*/, '');
    faqs.push({ q, a: stripToPlain(a) });
  }
  return faqs;
}

function parseSteps(sec) {
  // 把操作步骤节整理成有序的块：{head?, items[]}，保留原文步骤（含「在哪/做什么/看到什么」）
  const blocks = [];
  let cur = null;
  for (const raw of sec.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const h = line.match(/^(?:\*\*)?(第\s*[0-9一二三四五六七八九十]+\s*步[^*]*|步骤\s*\d+[^*]*|开?始之前|验证|小结|注意[^*]*)?(?:\*\*)?$/);
    if (/^#{3,4}\s+/.test(line) || /^\*\*[^*]+：?\*\*$/.test(line) || /^(第\s*[0-9一二三四五六七八九十]+\s*步|步骤\s*\d+)/.test(line)) {
      cur = { head: stripToPlain(line.replace(/^#{3,4}\s+/, '')), items: [], paras: [] };
      blocks.push(cur);
      const rest = line.replace(/^#{3,4}\s+/, '').replace(/^\*\*|\*\*$/g, '');
      if (!/^(第|步骤|验证|小结|注意)/.test(rest)) cur.head = rest;
      continue;
    }
    if (!cur) { cur = { head: '', items: [], paras: [] }; blocks.push(cur); }
    if (/^\s*(\d+\.|[-*])\s+/.test(line)) cur.items.push(stripToPlain(line.replace(/^\s*(\d+\.|[-*])\s+/, '')));
    else if (/^\|/.test(line)) { cur.tables = cur.tables || []; cur.tables.push(line); }
    else cur.paras.push(stripToPlain(line));
  }
  return blocks.filter((b) => b.items.length || b.paras.length || b.tables?.length);
}

function parseTutorialFile(path, source) {
  const text = readFileSync(path, 'utf8');
  const { fm, body } = parseFrontmatter(text);
  const secs = splitSections(body);
  const secName = (pred) => Object.keys(secs).find((k) => pred(k));
  const stepsKey = secName((k) => /操作步骤|怎么用|使用步骤/.test(k));
  const faqKey = secName((k) => /常见问题/.test(k));
  const oneKey = secName((k) => /一句话说明|一句话/.test(k));
  const sceneKey = secName((k) => /适用场景/.test(k));
  const preKey = secName((k) => /前置条件/.test(k));
  const diffKey = secName((k) => /形态差异/.test(k));
  const asks = [];
  if (sceneKey) {
    const m = secs[sceneKey].match(/典型提问[\s\S]*$/);
    if (m) for (const q of m[0].split(/\r?\n/)) { const t = q.replace(/^\s*[-*]\s+/, '').replace(/^[「"']|[」"']$/g, '').trim(); if (t && !/典型提问/.test(t)) asks.push(t); }
  }
  return {
    id: fm.id || '',
    title: (fm.title || '').trim(),
    entry: (fm.entry || '').trim(),
    level: fm.level || '',
    tags: (fm.tags || '').replace(/[[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean),
    source,
    file: relative(ROOT, path),
    one: oneKey ? stripToPlain(secs[oneKey]) : '',
    scenes: sceneKey ? parseBullets(secs[sceneKey].split(/典型提问/)[0]) : [],
    asks,
    prereq: preKey ? parseBullets(secs[preKey]) : [],
    steps: stepsKey ? parseSteps(secs[stepsKey]) : [],
    verifyInSteps: stepsKey && /###?\s*验证/.test(secs[stepsKey]),
    faqs: faqKey ? parseFAQ(secs[faqKey]) : [],
    diff: diffKey ? stripToPlain(secs[diffKey]) : '',
  };
}

function walk(dir, acc, filter) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc, filter);
    else if (filter.test(name)) acc.push(p);
  }
  return acc;
}

// ---------- 抽取 ----------
const jobs = [
  {
    out: 'os-tutorials.json',
    dirs: [`${ROOT}/chayuan-harness/docs/user-tutorials`],
    filter: /^[A-Z]\d+-.*\.md$/,
    source: 'chayuan-harness/docs/user-tutorials',
  },
  {
    out: 'office-tutorials.json',
    dirs: [`${ROOT}/chayuan-office/docs/user-tutorials`],
    filter: /^O\d+-.*\.md$/,
    source: 'chayuan-office/docs/user-tutorials',
  },
  {
    out: 'wps-tutorials.json',
    dirs: [`${ROOT}/chayuan-wps/docs/user-tutorials`],
    filter: /^W\d+-.*\.md$/,
    source: 'chayuan-wps/docs/user-tutorials',
  },
  {
    out: 'wps-assistant-guides.json',
    dirs: [`${ROOT}/chayuan-wps/assistant-tutorials`],
    filter: /\.md$/,
    source: 'chayuan-wps/assistant-tutorials',
    light: true, // 结构不同：标题+段落，按域组织
  },
];

for (const job of jobs) {
  const all = [];
  for (const dir of job.dirs) {
    let files = [];
    try { files = walk(dir, [], job.filter); } catch { console.log(`skip missing dir ${dir}`); continue; }
    for (const f of files.sort()) {
      try {
        if (job.light) {
          const text = readFileSync(f, 'utf8');
          const { fm, body } = parseFrontmatter(text);
          const secs = splitSections(body);
          const secsObj = {};
          for (const [k, v] of Object.entries(secs)) secsObj[k] = stripToPlain(v).slice(0, 1200);
          all.push({
            title: (fm.title || text.match(/^#\s+(.+)$/m)?.[1] || '').trim(),
            domain: relative(job.dirs[0], f).split('/')[0],
            file: relative(ROOT, f),
            sections: secsObj,
          });
        } else all.push(parseTutorialFile(f, job.source));
      } catch (e) { console.log(`parse fail ${f}: ${e.message}`); }
    }
  }
  writeFileSync(join(OUT, job.out), JSON.stringify(all, null, 1));
  const withSteps = all.filter((t) => t.steps?.length).length;
  const withFaqs = all.filter((t) => t.faqs?.length).length;
  console.log(`${job.out}: ${all.length} 篇 (含步骤 ${withSteps}, 含FAQ ${withFaqs})`);
}
console.log('harvest done →', OUT);
