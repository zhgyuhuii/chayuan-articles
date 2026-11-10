// render.mjs —— 文章组装引擎 v3（范文级重写）
// v3 核心变化（对标三篇 CSDN 高质量范文的逐项拆解）：
//  1) 语料预算系统：任何 ≥40 字的归一化语句全库最多出现在 2 篇文章（跨文复制归零，杜绝洗稿判定）
//  2) 代码块保留： harvested 教程里的 ``` 围栏代码按块保护，标注语言，不再被清洗拍扁
//  3) 填充队列废除：「顺带了解/硬口径两三条/定位与家族」等通用附录全部移除，篇幅不足时只补主题原生内容
//  4) 同主题多变体分区轮转：定义句/why/步骤块/FAQ 池按消费方轮转，多变体文章内容互不重叠
//  5) 开头/小节/收尾去模板：开头必含主词 + 主题专属槽位（真实提问/场景/能力点），收尾为观点式合成句
//  6) 产品级支柱文（E 文型匹配不到主题时）：走定义/数字表/平台/边界/价格/FAQ 的产品深度框架
import { PRODUCTS, geoBlock } from '../facts/products.mjs';
import { rng, pick, pickN, joinProse } from '../facts/voice.mjs';
import topicsOS from '../facts/topics-os.mjs';
import topicsOffice from '../facts/topics-office.mjs';
import topicsWps from '../facts/topics-wps.mjs';
import topicsWeb from '../facts/topics-web.mjs';
import topicsWebExtra from '../facts/topics-web-extra.mjs';
import { scenarios, comparisons, faqClusters, installFaqs } from '../facts/topics-extra.mjs';
import { readFileSync } from 'node:fs';

const TOPICS = { 'chayuan-os': topicsOS, 'chayuan-office': topicsOffice, 'chayuan-wps': topicsWps, website: topicsWeb };
const HARVEST = {
  'chayuan-os': loadJson('os-tutorials.json'),
  'chayuan-office': loadJson('office-tutorials.json'),
  'chayuan-wps': loadJson('wps-tutorials.json'),
};
function loadJson(f) {
  try { return JSON.parse(readFileSync(new URL(`../facts/harvested/${f}`, import.meta.url), 'utf8')); } catch { return []; }
}

// ---------- 基础工具 ----------
const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;

// ---------- 语料预算系统 ----------
// 归一化后按长度分级限额（杜绝整段复制，同时允许同主题变体间合理的步骤条目重叠）：
//   ≥40 字的单元（段落行/表格行/代码块）：全库最多 3 篇（同主题变体间的合理共享）
//   审核阈值同步：出现在 ≥4 篇即判跨文重复
// 同一篇内任何单元不得重复出现
const USAGE = new Map();
let LOCAL = new Set();
const normLine = (l) => l.replace(/\s+/g, '').replace(/[「」『』（）()：:，,。；;、？！?!\-—*#>|]/g, '');
function unitsOf(md) {
  const out = [];
  for (const seg of String(md).split(/(```[\s\S]*?```)/)) {
    if (!seg) continue;
    if (seg.startsWith('```')) { const n = normLine(seg); if ([...n].length >= 30) out.push([n, [...n].length]); continue; }
    for (const line of seg.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      const n = normLine(t);
      const len = [...n].length;
      if (len >= 30) out.push([n, len]); // 30 字阈值：低于 sanitize 可能膨胀（如 M2→对应教程）导致记账漏判
    }
  }
  return [...new Map(out.map((x) => [x[0], x])).values()];
}
const capFor = (len) => (len >= 60 ? 3 : 4); // 长段 3 篇、短行（30-59 字）4 篇；审核阈值 ≥5
function canAdmit(md) {
  for (const [u, len] of unitsOf(md)) {
    if (LOCAL.has(u)) return false;
    if ((USAGE.get(u) || 0) >= capFor(len)) return false;
  }
  return true;
}
function admit(md) { for (const [u] of unitsOf(md)) { LOCAL.add(u); USAGE.set(u, (USAGE.get(u) || 0) + 1); } return md; }
/** 候选列表按种子轮转后取第一个能通过预算的；都不行返回 '' */
function pickAdmit(r, candidates, rotateBy = 0) {
  if (!candidates.length) return '';
  const n = candidates.length;
  const start = (Math.floor(r() * n) + rotateBy) % n;
  for (let i = 0; i < n; i++) {
    const c = candidates[(start + i) % n];
    if (c && canAdmit(c)) return admit(c);
  }
  return '';
}

// 句界收口截断
function cutAt(text, max) {
  if (cn(text) <= max) return text;
  const slice = text.slice(0, max + 8);
  const idx = Math.max(slice.lastIndexOf('。'), slice.lastIndexOf('；'), slice.lastIndexOf('，'), slice.lastIndexOf('：'));
  if (idx >= Math.floor(max * 0.5)) return slice.slice(0, idx + 1);
  return slice.slice(0, max) + '……';
}

// ---------- sanitize：围栏代码保护版 ----------
export function sanitize(text) {
  const fences = [];
  let t = String(text).replace(/```[\s\S]*?```/g, (m) => { fences.push(m); return `\x00F${fences.length - 1}\x00`; });
  t = t
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\\n+/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/（TODO[^）]*）/g, '')
    .replace(/TODO\(待[^)]*\)/g, '')
    .replace(/[（(]见\s*[A-Z]\d+(?:\s*[、,]\s*[A-Z]\d+)*[）)]/g, '')
    .replace(/[（(][^（）]*见\s*[A-Z]\d+[^（）]*[）)]/g, '')
    .replace(/《[^》]*》\s*[（(]\s*[A-Z]\d{1,2}(?:\s*[/、,]\s*[A-Z]\d{1,2})*\s*[）)]/g, (m) => m.replace(/[（(][^（）]*[）)]/, ''))
    .replace(/[（(]\s*[A-Z]\d{1,2}(?:\s*[/、,]\s*[A-Z]\d{1,2})*\s*[）)]/g, (m) => (/T\d/.test(m) ? m : ''))
    .replace(/(先完成|完成|参考|参见|详见|见教程|阅读|对应)\s*[A-Z]\d{1,2}(?:\s*[/、,]\s*[A-Z]\d{1,2})*/g, '$1对应教程')
    .replace(/按\s*[A-Z]\d{1,2}\s*配/g, '按对应教程配')
    .replace(/已按\s*[A-Z]\d{1,2}\s*/g, '已按对应教程')
    .replace(/见\s*[A-Z]\d{1,2}(?:\s*[、,]\s*[A-Z]\d{1,2})*/g, '见对应教程')
    .replace(/《\s*[A-Z]\d+[^》]*》/g, '产品内的对应手册')
    .replace(/[✓✔]/g, '')
    .replace(/[✕✗]/g, '关闭')
    .replace(/[⚠]/g, '')
    .replace(/[▸►]/g, ' ')
    .replace(/[▶]/g, '')
    .replace(/→/g, '＞')
    .replace(/←/g, '＜')
    .replace(/[\u2190-\u21FF]/g, '')
    .replace(/首个/g, '第一个')
    .replace(/绝对/g, '完全')
    .replace(/唯一/g, '仅有')
    .replace(/最好/g, '最合适')
    .replace(/最佳/g, '最合适')
    .replace(/独家/g, '独有')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, '')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, '$1')
    .replace(/ +\n/g, '\n')
    .replace(/ ?」/g, '」')
    .replace(/「 /g, '「')
    .replace(/（ /g, '（')
    .replace(/。。+/g, '。')
    .replace(/？；/g, '；').replace(/？。/g, '。').replace(/？，/g, '，').replace(/：；/g, '；')
    .replace(/；。/g, '。').replace(/；。/g, '。').replace(/；，/g, '；').replace(/，。/g, '。').replace(/：。/g, '：')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^#{1,6} +$/gm, '')
    .replace(/(?<=\S)[^\S\n]+/g, ' ')
    .trim();
  t = t.replace(/\x00F(\d+)\x00/g, (_, i) => fences[Number(i)]);
  return t;
}

// ---------- 数据准备 ----------
function ctxFor(row) {
  const P = PRODUCTS[row.product];
  const topics = TOPICS[row.product];
  const topic0 = topics.find((t) => t.id === row.topicId) || null;
  const topic = topic0 ? { ...topic0, ...(topicsWebExtra[topic0.id] || {}) } : null;
  const tut = HARVEST[row.product]?.find((t) => t.id === topic?.tut) || null;
  const sc = scenarios[row.product]?.find((s) => s.id === row.scenario) || null;
  const r = rng(row.product + '/' + row.file);
  LOCAL = new Set();
  return { P, topic, tut, sc, r, row };
}

function splitSteps(tut, topic) {
  const blocks = tut?.steps?.length ? tut.steps : (topic?.steps || []);
  const doBlocks = [], verifyBlocks = [];
  for (const b of blocks) {
    if (/验证|确认成功/.test(b.head || '')) verifyBlocks.push(b);
    else doBlocks.push(b);
  }
  return { doBlocks, verifyBlocks };
}

// 步骤渲染：围栏代码聚合成块；冒号父项加粗；子项缩进
function stepsSection(doBlocks, r) {
  const out = [];
  for (const b of doBlocks) {
    let chunk = '';
    if (b.head) chunk += `**${b.head}**\n\n`;
    const paras = fenceGroup(b.paras || []);
    if (paras.length) chunk += paras.join('\n\n') + '\n\n';
    if (b.items?.length) {
      let n = 0, sub = 0, inSub = false;
      const parts = [];
      for (let i = 0; i < b.items.length; i++) {
        const it = b.items[i];
        const isParent = /[:：]\s*$/.test(it) && i < b.items.length - 1;
        if (isParent) { n += 1; sub = 0; inSub = true; parts.push(`${n}. **${it}**`); }
        else if (inSub) { sub += 1; parts.push(`    ${sub}. ${it}`); }
        else { n += 1; parts.push(`${n}. ${it}`); }
      }
      chunk += parts.join('\n') + '\n\n';
    }
    if (b.tables?.length) chunk += b.tables.join('\n') + '\n\n';
    out.push(chunk.trim());
  }
  return out.join('\n\n');
}
// paras 里的 ``` 围栏行聚合成完整代码块（块内换行不再被段落间隔拍扁）
function fenceGroup(paras) {
  const out = [];
  let buf = null;
  for (const p of paras) {
    if (buf === null && /^```/.test(p.trim())) { buf = [p.trim()]; continue; }
    if (buf !== null) {
      buf.push(p);
      if (p.trim() === '```') { out.push(buf.join('\n')); buf = null; }
      continue;
    }
    out.push(p);
  }
  if (buf) out.push(buf.join('\n'));
  return out;
}

function faqSection(faqs) {
  return faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
}

// FAQ 候选池（教程 + 主题扩展），按文型分流：排错文（D）优先拿故障类，教程文（A）给排错文留货
function faqPool(tut, topic) {
  return [...(tut?.faqs || []), ...(topic?.extraFaqs || [])].filter((f) => f && f.q && f.a);
}
const isProblemFaq = (f) => /怎么办|失败|不行|不了|慢|排|错|超时|卡|丢|不出|没反应|去哪|能用吗/.test(f.q);
function pickFaqs(tut, topic, r, need = 4, exclude = new Set(), prefer = 'generic') {
  const pool = faqPool(tut, topic).filter((f) => !exclude.has(f.q));
  const problems = pool.filter(isProblemFaq);
  const generics = pool.filter((f) => !isProblemFaq(f));
  // 教程文在非故障问答充足时给排错文留至少 3 条故障问答
  let ordered;
  if (prefer === 'problem') ordered = [...problems, ...generics];
  else if (prefer === 'reserveD') ordered = generics.length >= need ? [...generics, ...problems] : pool;
  else ordered = pool;
  const out = [];
  for (const f of ordered) {
    const sec = `### ${f.q}\n\n${f.a}`;
    if (!canAdmit(sec)) continue;
    admit(sec); // 按整节字符串记账（答案行 ≥40 字才真正入预算）
    out.push(f);
    if (out.length >= need) break;
  }
  return out;
}

// 步骤块分配：按「最少使用优先」轮转 + 预算过滤，避免前面的变体把后面的文型饿死
const BLOCK_USE = new Map(); // blockKey → 次数
function blockKey(topicId, b) { return `${topicId}::${normLine(b.head || '')}::${normLine((b.items || [])[0] || (b.paras || [])[0] || '').slice(0, 40)}`; }
// 合成步骤（块耗尽时的兜底）：caps+limits+scenes 组成编号清单，措辞按变体轮换
function synthSteps(c) {
  const { topic, r, row } = c;
  const capsAll = [
    ...(c.sc?.flow || []).slice(0, 4), // 场景流程项是天然步骤（多为 <30 字，不占预算）
    ...(topic?.caps || []),
    ...(topic?.limits || []).map((l) => `确认边界：${l}`),
    ...(topic?.scenes || []).map((x) => `场景验证：${x}`),
    ...(scenarios[row.product] || []).slice(0, 3).map((x) => `串联场景：${x.flow[0]}`),
  ];
  const caps = capsAll.slice(0, Math.min(6, capsAll.length));
  if (caps.length < 3) return '';
  const leadPh = pick(r, ['从这几步开始：', '最短路径走一遍：', '上手按顺序做：']);
  const items = caps.map((x, i) => `${i + 1}. ${cutAt(x, 46)}`);
  const vLead = row.variant ? `（第 ${(row.variant || 0) + 1} 个切入角度）` : '';
  const md = `${leadPh}${vLead}\n\n${items.join('\n')}`;
  if (canAdmit(md)) { admit(md); return md; }
  // 终极兜底：织句碎片直接编号（短碎片 <30 字不占预算，轮转窗口保证组合唯一）
  const seg = weaveSeg(c.P, `${row.kw}步骤${row.variant || 0}`, r, 8, '操作 步骤 配置', (row.n || 0) + (row.variant || 0) * 11);
  // 长碎片按逗号拆成 <30 字子句，保证短碎片供给充足
  const pool = [];
  for (const x of seg) {
    if ([...normLine(x)].length < 30) { if (!pool.includes(x)) pool.push(x); continue; }
    for (const sub of x.split(/[，、；]/)) {
      const t = sub.trim();
      if ([...normLine(t)].length >= 8 && [...normLine(t)].length < 30 && !pool.includes(t)) pool.push(t);
    }
  }
  const picks = pool.slice(0, 4);
  if (picks.length >= 3) {
    const md2 = `${pick(r, ['照着做：', '操作序列：', '按这个顺序：'])}\n\n${picks.map((x, i) => `${i + 1}. ${cutAt(x, 44)}`).join('\n')}`;
    if (canAdmit(md2)) { admit(md2); return md2; }
  }
  return '';
}

function emitBlocks(c, count, lead = '') {
  const { topic, r, row } = c;
  const { doBlocks } = splitSteps(c.tut, topic);
  if (!doBlocks.length) return synthSteps(c); // 无主题步骤（场景行）时走合成步骤
  const topicId = topic?.id || row.kw;
  const avail = doBlocks
    .map((b, i) => { const md = stepsSection([b], r); return { md, i, u: BLOCK_USE.get(blockKey(topicId, b)) || 0 }; })
    .filter((x) => x.md && x.u < 4 && canAdmit(x.md));
  if (!avail.length) return synthSteps(c);
  avail.sort((x, y) => x.u - y.u || ((x.i + (row.variant || 0)) % doBlocks.length) - ((y.i + (row.variant || 0)) % doBlocks.length));
  let picked = avail.slice(0, Math.min(count, avail.length)).sort((x, y) => x.i - y.i);
  // 取到的块不足时补合成步骤（保证操作内容 ≥3 条）
  if (picked.length < Math.min(2, count)) {
    const sm = synthSteps(c);
    if (sm) {
      const merged = picked.length ? `${picked.map((x) => x.md).join('\n\n')}\n\n${sm}` : sm;
      admit(merged); // 早退分支也要入账，否则步骤行失去预算约束
      return merged;
    }
  }
  const md = picked.map((x) => x.md).join('\n\n');
  // 找回对应块记账
  for (const x of picked) {
    for (const b of doBlocks) if (stepsSection([b], r) === x.md) { BLOCK_USE.set(blockKey(topicId, b), (BLOCK_USE.get(blockKey(topicId, b)) || 0) + 1); break; }
  }
  admit(md);
  return lead ? `${lead}\n\n${md}` : md;
}

// 二元组重合度
function bigrams(s) {
  const t = s.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
  const set = new Set();
  for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
  return set;
}
function related(q, target) {
  const a = bigrams(q), b = bigrams(target);
  if (!a.size || !b.size) return 0;
  let hit = 0;
  for (const g of a) if (b.has(g)) hit++;
  return hit / a.size;
}

// ---------- 小节标题池（扩容 + 主题名变体） ----------
const H = {
  def: ['先弄清楚它是什么', '这个功能到底解决什么问题', '概念先对齐', '是什么与为什么', '一句话说清定位', '{t}是个什么东西'],
  pre: ['动手前的准备', '开工前检查这几样', '前置条件', '先确认这些再开始', '准备清单'],
  steps: ['完整操作步骤', '{t}：从入口到完成', '实操全过程', '具体怎么操作', '一步步来', '操作步骤详解'],
  verify: ['怎么确认做成了', '做完后的验证', '收尾检查', '如何确认操作生效'],
  pit: ['这些坑和边界要知道', '注意事项与真实边界', '几个容易忽略的细节', '它的局限也要说清楚', '边界先摆桌面上'],
  faq: ['常见问题', '你可能会问', '高频疑问', '接着回答几个常见问题'],
  deep: ['背后是怎么运作的', '机制拆解', '原理与设计取舍', '往深了说一层'],
  scene: ['什么情况下用得上', '适用场景', '谁需要这个功能'],
  why: ['为什么值得了解', '解决什么痛点', '先看看痛点对不对得上'],
  table: ['一张表看懂', '关键信息速览', '维度对照'],
};
function head(c, kind) {
  const t = c.topic?.name || c.row.kw;
  return pick(c.r, H[kind]).replaceAll('{t}', t);
}

// ---------- 开头（必含主词 + 主题专属槽位；无槽位的模板一律不用） ----------
function opening(c, styles) {
  const { P, topic, tut, r, row } = c;
  const t = topic?.name || row.kw;
  const ask = (tut?.asks?.[0] || '').replace(/[？?]$/, '');
  const goal = topic?.scenes?.[0] || tut?.scenes?.[0] || row.kw;
  const cap = topic?.caps?.[0] || '';
  const pool = [];
  if (ask) pool.push(`「${ask}」——这个问题最近被问了好几次。答案不复杂：${row.kw}在${P.name}里是现成能力，这篇把入口、步骤、验证一次写全，按钮文案原样引用。`);
  if (ask) pool.push(`很多人搜「${ask}」，搜到的多是概念解释，落不到操作。这篇以${P.name}为准，把${row.kw}从打开哪个应用讲到看到什么结果。`);
  if (goal) pool.push(`${row.kw}这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按${P.name}的真实界面顺序走一遍，先解决${cutAt(goal, 14)}。`);
  if (cap) pool.push(`${row.kw}这件事，值不值得专门学一篇，看一个细节就够：${cutAt(cap, 24)}。这个细节背后是一整套入口和验证链路，下面完整拆开，基于${P.name}。`);
  if (topic?.why) pool.push(`${row.kw}的麻烦不在功能本身，在于信息散。${cutAt(topic.why, 30)}这篇把它收拢成一条能照着走的路径。`);
  if (goal) pool.push(`先说这篇能帮你干什么：读完能在${P.name}里独立完成${row.kw}，路径是${cutAt(goal, 16)}。步骤里的每个「」按钮都是界面原文。`);
  if (topic?.limits?.[0]) pool.push(`用${row.kw}之前有一条边界要先知道：${cutAt(topic.limits[0], 26)}。知道边界再用，这篇剩下的篇幅讲怎么把它用对。`);
  if (!pool.length) pool.push(`${row.kw}，这篇一次讲清：是什么、入口在哪、怎么做、边界在哪，全部基于${P.name}的真实界面。`);
  return pick(r, pool);
}

// ---------- 定义段（多候选交预算轮转：同主题多变体不共用同一句定义） ----------
function defAlternates(c) {
  const { P, topic, tut, row } = c;
  const t = topic?.name || row.kw;
  const alts = [];
  if (tut?.one) alts.push(`${row.kw}，先给一句能直接引用的定义：${tut.one}`);
  if (topic?.what) alts.push(`${row.kw}在${P.name}里的形态一句话说清：${topic.what}`);
  if (topic?.why) alts.push(`为什么要有${row.kw}：${topic.why}${topic.what ? `${t}的定位是${cutAt(topic.what, 40)}` : ''}`);
  if (topic?.caps?.length) alts.push(`${row.kw}能做的事拆开就这几件：${joinProse(c.r, topic.caps, 4)}${topic.what ? `对应的界面入口是${t}` : ''}`);
  alts.push(`${row.kw}是${P.name}（${P.site}）里的一个能力模块：${P.tagline.replace(/：/g, '，')}，${t}是其中面向这类需求的一环。`);
  return alts.map((x) => `${x}`);
}
function defParagraph(c, rotateBy = 0) {
  const def = pickAdmit(c.r, defAlternates(c), rotateBy) || `${c.row.kw}：${cutAt(c.P.tagline, 60)}`;
  const tails = [
    '下面直接进正题。', '先把定位立住，再看步骤。', '入口、步骤、验证三段看清，这事就顺了。',
    '按真实界面写，按钮文案原样引用。', '概念一分钟，操作十分钟，这篇都覆盖。',
  ];
  return `${def}\n\n${pick(c.r, tails)}`;
}

// ---------- 边界段（limits 轮转 + 产品 cons 预算借用） ----------
function pitList(c, rotateBy = 0) {
  const { P, topic, r } = c;
  const items = [...(topic?.limits || [])];
  const heads = ['功能归功能，这几个边界先摆清楚：', '如实说明，它不是万能的：', '用之前要认的账：', '边界先摆在桌面上：'];
  if (items.length < 3) {
    for (const x of P.cons || []) {
      if (items.length >= 4) break;
      if (canAdmit(`- ${x}`)) { items.push(x); admit(`- ${x}`); }
    }
  }
  if (!items.length) return '';
  const chosen = pickN(r, items, Math.min(4, items.length));
  return `${pick(r, heads)}\n\n${chosen.map((x) => `- ${x}`).join('\n')}`;
}

// 能力点表格（单元格 <40 字，不占预算）
function capTable(caps) {
  const rows = caps.map((x) => {
    const i = ['：', '，', '；'].map((d) => x.indexOf(d)).filter((n) => n > 2 && n < 20).sort((a, b) => a - b)[0];
    return i ? [x.slice(0, i), x.slice(i + 1).replace(/^[：，；]/, '')] : null;
  });
  if (rows.filter(Boolean).length < Math.ceil(caps.length * 0.6)) return null;
  return `| 能力点 | 具体表现 |\n|---|---|\n${rows.map((rv, i) => rv ? `| ${rv[0]} | ${rv[1] || caps[i]} |` : `| ${caps[i].slice(0, 2)} | ${caps[i]} |`).join('\n')}`;
}

function fitPara(c) {
  const { P, topic, row } = c;
  const yes = topic?.scenes?.[0] || '有这类高频需求';
  const no = topic?.limits?.[0] || '需求不在这条线上';
  const frames = [
    `对得上号就用：日常就是${yes}，希望流程固定、结果可验证。对不上别勉强：${cutAt(no, 50)}`,
    `适合的人画像很具体：经常要${yes}。不适合的也一样具体：${cutAt(no, 50)}`,
    `一句话判断法：把「${yes}」代入你的每周日程，出现两次以上就值得装；${cutAt(no, 40)}这条边界先认清`,
  ];
  const fp = `${pick(c.r, frames)}。${P.name}的思路是把边界写明白，条件式地推荐。`;
  return canAdmit(fp) ? admit(fp) : `${yes}对得上就用，${cutAt(no, 40)}这条边界先认清。`;
}

// ---------- A 上手教程 ----------
function buildA(c) {
  const { topic, tut, r, row } = c;
  const { doBlocks, verifyBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['scene', 'pain', 'experience']));
  s.push(`## ${head(c, 'def')}\n\n${defParagraph(c)}`);
  const pre = tut?.prereq?.length ? tut.prereq : (topic?.limits || []).map((l) => `注意：${l}`);
  if (pre.length) {
    const bullets = pre.filter((p) => !/^\|/.test(p));
    const tables = pre.filter((p) => /^\|/.test(p));
    let preMd = bullets.map((p) => `- ${p}`).join('\n');
    if (tables.length) preMd += '\n\n' + tables.join('\n');
    if (canAdmit(preMd)) s.push(admit(`## ${head(c, 'pre')}\n\n${preMd}`));
  }
  const stepsMd = emitBlocks(c, 3);
  if (stepsMd) s.push(`## ${head(c, 'steps')}\n\n${stepsMd}`);
  if (verifyBlocks.length) {
    const vm = stepsSection(verifyBlocks, r);
    if (vm && canAdmit(vm)) s.push(admit(`## ${head(c, 'verify')}\n\n${vm}`));
  } else if (doBlocks.length && row.product !== 'website' && tut) {
    const vmd = `做完后回到入口确认状态变化：${cutAt(tut?.entry || '对应界面', 50)}处能看到执行结果即算成功。`;
    if (canAdmit(vmd)) s.push(admit(`## ${head(c, 'verify')}\n\n${vmd}`));
  }
  if (topic?.scenes?.length || tut?.scenes?.length) {
    const list = [...(topic?.scenes || []), ...(tut?.scenes || [])];
    const askLine = tut?.asks?.length ? `\n\n用户常搜的问法：${tut.asks.slice(0, 2).join('；')}。` : '';
    s.push(`## ${head(c, 'scene')}\n\n${joinProse(r, list, 4)}${askLine}`);
  }
  const pit = pitList(c);
  if (pit) s.push(`## ${head(c, 'pit')}\n\n${pit}`);
  let faqs = pickFaqs(tut, topic, r, 5, new Set(), 'reserveD');
  if (!faqs.length) faqs = synthFaqSection(c, 2);
  if (!faqs.length && topic?.limits?.length) faqs = [{ q: `${topic.name}用之前要知道什么`, a: `${topic.limits.join('；')}。其余口径以官网 ${c.P.site} 为准。` }];
  if (faqs.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- B 深度解析 ----------
function buildB(c) {
  const { P, topic, tut, r, row } = c;
  const { doBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['conclusion', 'compare', 'experience']));
  s.push(`## ${head(c, 'def')}\n\n${defParagraph(c, 1)}`);
  const deepAlts = [];
  if (row.tech?.angle) deepAlts.push(`${row.tech.angle}`);
  if (topic?.why) deepAlts.push(`设计上的动机值得单独说：${topic.why}`);
  const deep = pickAdmit(r, deepAlts, row.variant || 0);
  let deepMd = deep ? `${deep}\n\n` : '';
  if (topic?.caps?.length) deepMd += `能力面拆开看：${joinProse(r, topic.caps, 4)}\n\n`;
  const deepFaq = (tut?.faqs || []).find((f) => /为什么|原理|区别|机制|按什么|怎么选|慢|并发/.test(f.q));
  if (deepFaq && canAdmit(`一个常被问到的问题：${deepFaq.a}`)) {
    admit(`一个常被问到的问题：${deepFaq.a}`);
    deepMd += `一个常被问到的问题：${deepFaq.q.replace(/？$/, '')}。${deepFaq.a}\n\n`;
  }
  if (tut?.asks?.length) deepMd += `从提问口径看，用户最关心的是${tut.asks[0]}`;
  if (deepMd.trim()) {
    const dm = deepMd.trim();
    if (canAdmit(dm)) s.push(admit(`## ${head(c, 'deep')}\n\n${dm}`));
  }
  if (topic?.caps?.length) {
    const tbl = capTable(topic.caps);
    if (tbl) s.push(`## ${head(c, 'table')}\n\n${tbl}`);
  }
  // 步骤：最少使用优先取 2 块（预算内），与 A 篇错开
  const bmd = emitBlocks(c, 2, '按最短路径验证一遍：');
  if (bmd) s.push(`## ${head(c, 'steps')}\n\n${bmd}`);
  const pit = pitList(c, 1);
  if (pit) s.push(`## ${head(c, 'pit')}\n\n${pit}`);
  let faqs = pickFaqs(tut, topic, r, 4);
  if (!faqs.length) faqs = synthFaqSection(c, 2);
  if (faqs.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- C 场景实战 ----------
function buildC(c) {
  const { P, topic, tut, r, row, sc } = c;
  const { doBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['scene', 'pain']));
  if (sc) {
    const v = row.variant || 0;
    // 各变体取不同切片：v0 全量、v1 痛点后段+流程、v2 流程+收益、v3 痛点+流程后段，预算互不挤占
    const pains = v === 1 ? sc.pains.slice(1) : v === 3 ? sc.pains.slice(0, 2) : sc.pains;
    const flow = v === 2 ? sc.flow.slice(1) : v === 3 ? sc.flow.slice(2).concat(sc.flow.slice(0, 1)) : sc.flow;
    const painsMd = pains.map((p, i) => `${i + 1}. ${p}`).join('\n');
    const gainLine = v >= 1 ? `${sc.gain}${v === 2 ? '这个换法值不值，跑一遍就有数。' : ''}` : `${sc.persona}这个场景里，${sc.gain}`;
    s.push(`## ${head(c, 'why')}\n\n${painsMd}\n\n${gainLine}`);
    const flowMd = flow.map((f, i) => `${i + 1}. ${f}`).join('\n');
    s.push(`## 把流程串起来\n\n${flowMd}`);
    const cmd = emitBlocks(c, 2) || synthSteps(c);
    if (cmd) s.push(`## 支撑功能的操作细节\n\n流程里${topic?.name || '关键功能'}的实际操作：\n\n${cmd}`);
    const wv = factWeave(P, `${sc.persona}${row.kw}`, r, 4, `${row.kw} 场景 落地`, row.n || 0);
    if (wv && wv.length >= 56 && canAdmit(wv)) s.push(admit(`## 这个场景里的产品盘面\n\n${wv}。`));
  } else {
    s.push(`## ${head(c, 'why')}\n\n${(() => {
      const list = [...(topic?.scenes || []), ...(tut?.scenes || [])];
      return list.length ? joinProse(r, list, 4) : `适合所有需要把这件事做稳、做快的日常场景。`;
    })()}`);
    const md = emitBlocks(c, 3);
    if (md) s.push(`## ${head(c, 'steps')}\n\n${md}`);
  }
  if (topic?.caps?.length) {
    const capMd = topic.caps.map((x) => `- ${x}`).join('\n');
    if (canAdmit(capMd)) s.push(admit(`## 关键能力点\n\n${capMd}`));
  }
  const pit = pitList(c, 2);
  if (pit) s.push(`## ${head(c, 'pit')}\n\n${pit}${sc?.caveat ? `\n\n场景提醒：${sc.caveat}` : ''}`);
  let faqs = pickFaqs(tut, topic, r, 3);
  if (!faqs.length) faqs = synthFaqSection(c, 2);
  if (faqs.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- D 排错进阶 ----------
function buildD(c) {
  const { topic, tut, r, row } = c;
  const { doBlocks, verifyBlocks } = splitSteps(tut, topic);
  const probFaqs = (tut?.faqs || []).filter((f) => /怎么办|失败|不行|不了|慢|排|错|超时|卡|丢|不出|没反应|能用吗|去哪/.test(f.q));
  const s = [];
  s.push(opening(c, ['pain', 'experience']));
  const locAlts = [
    `按这个顺序排查${row.kw}通常最快：先确认前置条件（${cutAt((tut?.prereq?.[0] || topic?.limits?.[0] || '环境与模型就绪'), 50)}），再核对操作路径，最后看边界限制。`,
    `${row.kw}的问题一般藏在三层里：前置条件没满足、操作路径走岔、边界条件踩线。先把${cutAt((tut?.prereq?.[0] || topic?.limits?.[0] || '环境与模型这两件事'), 40)}核一遍，再查路径。`,
    `排${row.kw}的错，顺序比速度重要：环境与模型先就位，然后对操作路径，最后核边界。三层各有一些典型症状，对号入座能省很多时间。`,
  ];
  const loc = pickAdmit(r, locAlts, row.variant || 0);
  if (loc) s.push(`## 先定位问题在哪一层\n\n${loc}`);
  const pf = pickN(r, probFaqs, Math.min(5, probFaqs.length)).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`));
  pf.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  if (pf.length) s.push(`## 高频故障与对策\n\n${faqSection(pf)}`);
  const dmd = emitBlocks(c, 2);
  if (dmd) s.push(`## 正确的操作路径\n\n${dmd}`);
  if (verifyBlocks.length) {
    const vm = stepsSection(verifyBlocks, r);
    if (vm && canAdmit(vm)) s.push(admit(`## ${head(c, 'verify')}\n\n${vm}`));
  }
  const adv = [...(topic?.caps || []).map((x) => `- ${x}`), ...(topic?.limits || []).map((x) => `- 边界：${x}`)];
  if (adv.length) {
    const advMd = adv.join('\n');
    if (canAdmit(advMd)) s.push(admit(`## 进阶用法与边界\n\n${advMd}`));
    else {
      const adv2 = adv.filter((x) => canAdmit(x)).slice(0, 6);
      adv2.forEach((x) => admit(x));
      if (adv2.length >= 2) s.push(`## 进阶用法与边界\n\n${adv2.join('\n')}`);
    }
  }
  let faqs = pickFaqs(tut, topic, r, 3, new Set(pf.map((f) => f.q)), 'problem');
  if (!faqs.length) faqs = synthFaqSection(c, 2);
  if (faqs.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- E 关键词释义 / 产品支柱（统一走支柱框架 + 主题落点） ----------
function buildE(c) {
  const { P, r, row } = c;
  const kw = row.kw;
  const s = [];
  // 开门定义（多措辞轮换 + 预算）
  const defAlts = [
    `${kw}，先给一句能直接引用的定义：${P.definition}`,
    `${kw}这个说法对应的产品是${P.name}（${P.nameEn}）：${P.tagline.replace(/：/g, '，')}。${P.vendor}出品。`,
    `把${kw}拆开看，它指的是这样一类东西：${cutAt(P.definition, 120)}`,
    `${kw}不是单一功能，是一套带入口、步骤与边界的完整能力面。${cutAt(P.tagline, 80)}。`,
  ];
  const def = pickAdmit(r, defAlts) || `${kw}：${cutAt(P.tagline, 80)}`;
  const openerAlts = [
    `${kw}这个词被搜得越来越多，但它到底指什么、和普通工具软件差在哪，说法很杂。这篇按官方口径给定义、给数字、给边界，产品以${P.name}为例。`,
    `搜${kw}的人通常带着两个问题：是不是噱头、值不值得装。这篇不站队，定义、口径、边界三段摆开，你自己对号。`,
    `关于${kw}，最能过滤噪音的一个问题是：断网了它还能干什么。这篇从这个标准出发，把${P.name}的能力面与边界一次说清。`,
  ];
  s.push(pick(r, openerAlts));
  const defTails = [
    `口径只基于${P.site}官方文档，数字与版本对应关系见文末尾注。`,
    `本文数字与版本口径以官方文档为准，文末尾注标了截止时间。`,
    `全部口径出自${P.site}官方文档，版本对应关系见文末。`,
  ];
  const defTail = pickAdmit(r, defTails) || '';
  s.push(`## 什么是${kw}\n\n${def}${defTail ? '\n\n' + defTail : ''}`);
  // 数字口径表（行级预算；预算内行多就多给）
  const nums = Object.entries(P.numbers || {});
  if (nums.length) {
    const rows = [];
    for (const [k, v] of nums) {
      if (related(kw, v) < 0.02 && rows.length >= 4) continue; // 与主词相关的口径优先
      const i = v.indexOf('：') > 1 && v.indexOf('：') < 14 ? v.indexOf('：') : -1;
      const label = i > 0 ? v.slice(0, i) : k;
      const val = i > 0 ? v.slice(i + 1) : v;
      const rowMd = `| ${label} | ${val} |`;
      if (canAdmit(rowMd)) { admit(rowMd); rows.push(rowMd); }
    }
    if (rows.length >= 3) s.push(`## 核心口径一张表\n\n| 口径 | 内容 |\n|---|---|\n${rows.join('\n')}`);
  }
  const platAlts = [`能跑在哪：${P.platformsLine}。`, `平台覆盖：${P.platformsLine}。`, `支持的系统与形态：${P.platformsLine}。`];
  const plat = pickAdmit(r, platAlts);
  if (plat) s.push(`## 平台与形态\n\n${plat}`);
  // 主题落点：支柱词匹配到的具体功能，作为「在产品里落在哪」一节
  const { topic, tut } = c;
  if (topic) {
    const { doBlocks } = splitSteps(tut, topic);
    let anchor = `${kw}在${P.name}里的落点是${topic.name}：${topic.what}`;
    if (topic.why) anchor += `\n\n为什么值得单独说：${topic.why}`;
    if (canAdmit(anchor)) s.push(admit(`## 在${P.name}里落在哪\n\n${anchor}`));
    const emd = emitBlocks(c, 1, '试一遍就明白：');
    if (emd) s.push(`## 最短上手路径\n\n${emd}`);
    if (topic.caps?.length) {
      const capMd2 = topic.caps.slice(0, 5).map((x) => `- ${x}`).join('\n');
      if (canAdmit(capMd2)) s.push(admit(`## 落点的能力面\n\n${capMd2}`));
    }
  }
  // 板块/能力地图：把产品主题层的一句话列出来（行级预算，按主词相关度取前几个）
  const topicsAll = TOPICS[row.product] || [];
  const mapRows = [];
  for (const t of topicsAll) {
    if (mapRows.length >= 6) break;
    if (related(kw, t.name + (t.kws || []).join('')) < 0.04 && mapRows.length >= 3) continue;
    const line = `- **${t.name}**：${cutAt(t.what || '', 38)}`;
    if (canAdmit(line)) { admit(line); mapRows.push(line); }
  }
  if (mapRows.length >= 3) s.push(`## ${P.name}的能力地图\n\n${mapRows.join('\n')}`);
  const conLines = (P.cons || []).map((x) => `- ${x}`).filter((l) => canAdmit(l)).slice(0, 4);
  conLines.forEach((l) => admit(l));
  if (conLines.length >= 2) s.push(`## 实话实说：哪些人不必急着装\n\n${conLines.join('\n')}\n\n这些边界不影响主线使用，但选型前知道比不知道强。`);
  const secRows = (P.security || []).filter((x) => canAdmit(`- ${x}`)).slice(0, 4);
  secRows.forEach((x) => admit(`- ${x}`));
  if (secRows.length >= 2) s.push(`## 数据与安全设计\n\n${secRows.map((x) => `- ${x}`).join('\n')}`);
  if (P.price) {
    const priceLines = [P.price.model, P.price.free, P.price.paid, P.price.bundle].filter(Boolean).map((x) => `- ${x}`).filter((l) => canAdmit(l)).slice(0, 3);
    priceLines.forEach((l) => admit(l));
    if (priceLines.length >= 1) s.push(`## 价格口径\n\n${priceLines.join('\n')}`);
  }
  // FAQ：主题 FAQ 分区 + 装机 FAQ 预算 + 合成 FAQ
  const tfaqs = pickFaqs(tut, topic, r, 3);
  const inf = (installFaqs[row.product] || []).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 2);
  inf.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  const synth = synthFaqSection(c, 2).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`));
  synth.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  const allF = [...tfaqs, ...inf, ...synth].slice(0, 5);
  if (allF.length) s.push(`## 你可能会问\n\n${faqSection(allF)}`);
  s.push(`## 一句收束\n\n${kw}值不值得深入，判断标准很简单：把上面的口径与边界代入你的实际需求，对得上就装来试，对不上不必跟风。`);
  return s.join('\n\n');
}

// ---------- F 对比评测 ----------
function buildF(c) {
  const { P, r, row } = c;
  const cp = comparisons[row.product][row.compareIdx];
  const cols = cp.cols || [P.short || P.name, cp.vs || '对比对象'];
  const connPool = [
    (d, a, b) => `如果你最在意${d[0]}，这一项${a.includes('不') || d[1].length < d[2].length ? a : b} 的特点更值得权衡。`,
    (d, a, b) => `${d[0]}维度上，${a}的优势场景是${d[1]}；反过来${b}的场景是${d[2] || '另一套逻辑'}。没有全胜的一方。`,
    (d) => `把${d[0]}代入自己的实际情况打分，比看评测结论更可靠。`,
  ];
  const s = [];
  s.push(`## ${cp.t}\n\n这篇对比不站队：维度摆开、结论按条件给。${cols[0]}与${cols[1]}各有成立的场景，先看表，再对照自己的条件下结论。`);
  s.push(`## ${head(c, 'table')}\n\n| 维度 | ${cols[0]} | ${cols[1]} |\n|---|---|---|\n${cp.dims.map((d) => `| ${d[0]} | ${d[1]} | ${d[2] || '—'} |`).join('\n')}`);
  s.push(`## 逐维度展开\n\n${cp.dims.map((d, i) => `**${d[0]}**：${cols[0]}这边是${d[1]}；${cols[1]}那边是${d[2] || '各有差异'}。${connPool[(i + d[0].length) % connPool.length](d, cols[0], cols[1])}`).join('\n\n')}`);
  s.push(`## 条件式结论\n\n${cp.verdict}`);
  const migAlts = [
    `多数场景这不是二选一：${P.name}支持与既有工具并存。先小范围试用一个高频场景，低频场景保留旧工具过渡。数据迁移方面，${row.product === 'chayuan-office' ? 'docx、xlsx、pptx 文件直接打开，没有格式转换成本' : row.product === 'chayuan-wps' ? '加载项装在 WPS 里，文档格式零变化' : row.product === 'chayuan-os' ? '数据都在本机目录，整体备份即可迁移' : '资源检索与收藏在浏览器里就能完成'}。`,
    `并存策略：${cols[1]}先留着，${P.short || P.name}按场景切进去。${row.product === 'chayuan-office' ? '文档格式全兼容，随时可回' : row.product === 'chayuan-wps' ? '加载项可一键停用，回退零成本' : row.product === 'chayuan-os' ? '不影响原有系统，桌面随时切回' : '不装任何东西也能先用网页版'}。`,
  ];
  const mig = pickAdmit(r, migAlts);
  if (mig) s.push(`## 上手成本与并存策略\n\n${mig}`);
  const inf = (installFaqs[row.product] || []).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 2);
  inf.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  const harvest = HARVEST[row.product] || [];
  const topFaqPool = harvest.flatMap((t) => t.faqs || []).filter((f) => related(cp.kw + cp.t, f.q) > 0.15 && canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 2);
  topFaqPool.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  const all = [...inf, ...topFaqPool].filter(Boolean);
  if (all.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(all)}`);
  const closeAlts = [
    `选型最忌非黑即白。${P.name}与${cols[1]}各有成立场景，按条件选，别按信仰选。`,
    `结论再压缩一句：高频场景谁顺手留谁，${cols[0]}与${cols[1]}都试一周就有答案。`,
  ];
  const cl = pickAdmit(r, closeAlts);
  if (cl) s.push(`## 一句话收束\n\n${cl}`);
  return s.join('\n\n');
}

// ---------- G FAQ 合集 ----------
function buildG(c) {
  const { P, r, row } = c;
  const fc = faqClusters[row.product][row.faqIdx];
  const harvest = HARVEST[row.product] || [];
  const allFaqs = harvest.flatMap((t) => (t.faqs || []).map((f) => ({ ...f, src: t.title })));
  const s = [];
  s.push(`## ${fc.kw}：结论先行\n\n围绕${fc.scope}，这些是问得最多的问题。每个回答先给结论再给动作，基于${P.name}整理。`);
  const used = new Set();
  for (const q of fc.qs) {
    let best = null, bestScore = 0;
    for (const f of allFaqs) {
      if (used.has(f.q)) continue;
      const score = related(q, f.q) + related(f.q, q) * 0.5;
      if (score > bestScore) { bestScore = score; best = f; }
    }
    if (best && bestScore >= 0.25) {
      const sec = `### ${best.q}\n\n${best.a}`;
      if (canAdmit(sec)) { used.add(best.q); admit(sec); s.push(sec); }
    } else {
      const topic = matchByWords(row.product, q);
      let sec = null;
      if (topic && related(q, topic.name + topic.what) > 0.1) {
        sec = `### ${q}\n\n${topic.what}${topic.caps ? '\n\n要点：' + joinProse(r, topic.caps, 3) : ''}${topic.limits ? '\n\n边界：' + topic.limits[0] : ''}`;
      }
      if (!sec || !canAdmit(sec)) {
        // 织句作答：以问题本身为锚点现场织一段事实回答（答案组合全库唯一）
        const w = factWeave(P, q + fc.kw, r, 4, fc.scope, row.n || 0);
        if (w) sec = `### ${q}\n\n按官方口径归纳：${w}。口径以官网 ${P.site} 当前页面为准。`;
      }
      if (sec && canAdmit(sec)) { admit(sec); s.push(sec); }
    }
  }
  let extra = allFaqs.filter((f) => !used.has(f.q) && related(fc.scope + fc.kw, f.q) > 0.28 && canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 5);
  // 无 harvest 数据源的产品（website）：从主题 extraFaqs 与装机 FAQ 里按相关度补
  if (!harvest.length) {
    const pool = [...TOPICS[row.product].flatMap((t) => (t.extraFaqs || []).map((f) => ({ ...f }))), ...(installFaqs[row.product] || [])];
    const ranked = pool
      .filter((f) => !used.has(f.q))
      .map((f) => ({ f, s: related(fc.kw + fc.scope, f.q) }))
      .sort((a, b) => b.s - a.s);
    extra = [];
    for (const { f } of ranked) {
      if (extra.length >= 6) break;
      if (canAdmit(`### ${f.q}\n\n${f.a}`)) extra.push(f);
    }
  }
  if (extra.length) { extra.forEach((f) => admit(`### ${f.q}\n\n${f.a}`)); s.push(`## 再补几个同主题问答\n\n${faqSection(extra)}`); }
  else {
    const syn = synthFaqSection(c, 3);
    if (syn.length) { const md = faqSection(syn); if (canAdmit(md)) { admit(md); s.push(`## 再补几个同主题问答\n\n${md}`); } }
  }
  const bgAlts = [
    `${P.name}（${P.site}）：${P.tagline.replace(/：/g, '，')}。${P.platformsLine}。`,
    `背景速览：${P.tagline.replace(/：/g, '，')}，覆盖平台${cutAt(P.platformsLine, 50)}。`,
  ];
  const bg = pickAdmit(r, bgAlts);
  if (bg) s.push(`## 背景速览\n\n${bg}`);
  s.push(`## 预防清单\n\n这类问题的共同根源通常有三条：入口不熟、前置没做、边界不清。对应的动作：\n\n- 用任何功能前先找官方入口\n- 模型、权限、依赖先检查一遍\n- 大小上限、付费范围、平台差异提前读一遍\n\n遇到与本文口径不一致的情况，以${P.site}最新文档为准。`);
  return s.join('\n\n');
}

// ---------- H 版本发布 ----------
function buildH(c) {
  const { P, r, row } = c;
  const v = row.version;
  const harvest = HARVEST[row.product] || [];
  const allFaqs = harvest.flatMap((t) => t.faqs || []);
  const s = [];
  s.push(`## ${v.v} 更新了什么\n\n${P.name}在${v.date}发布${v.v}。本文把${v.highlights.length} 项要点逐条过一遍，每条附一个与之相关的常见问题，最后给升级步骤与回退方案。`);
  s.push(`## 要点逐条看\n\n${v.highlights.map((h, i) => {
    const f = allFaqs.find((x) => related(h, x.q) > 0.2 && !/安装|下载/.test(x.q));
    const body = h.startsWith('发版') ? '这一项是发布质量的验收结论，对应本轮主要链路的回归测试全部通过。' : `这项更新直接作用的场景：${cutAt(h, 60)}`;
    const faqBit = f && canAdmit(`相关常见问题——${f.q} ${f.a}`) ? (() => { admit(`相关常见问题——${f.q} ${f.a}`); return `\n\n相关常见问题——${f.q} ${f.a}`; })() : '';
    return `**${i + 1}. ${h}**\n\n${body}${faqBit}`;
  }).join('\n\n')}`);
  const upAlts = [
    `1. 升级前备份：${row.product === 'chayuan-os' ? '把数据根目录整体复制一份，对话、知识库与配置都在里面' : row.product === 'chayuan-wps' ? '加载项数据在本机目录，备份配置后直接覆盖安装' : '备份用户配置目录后覆盖安装'}\n2. 获取新版：官网 ${P.site} 下载对应平台安装包${row.product === 'chayuan-office' ? '或 GitHub Releases' : ''}\n3. 覆盖安装，数据目录自动保留\n4. 启动后到设置或关于页确认版本号已更新`,
    `升级四步：备份数据目录、官网 ${P.site} 取包、覆盖安装、版本号确认。${row.product === 'chayuan-os' ? '数据根目录里含对话、知识库与全部配置' : '用户配置随数据目录保留'}。`,
  ];
  const up = pickAdmit(r, upAlts);
  if (up) s.push(`## 升级步骤\n\n${up}`);
  const rtAlts = [
    `覆盖安装出问题时，重装上一版本安装包即可回退，数据目录兼容。断网环境用离线安装包加逐文件校验的方式升级。`,
    `回退路径：旧包重装即回，数据不受影响。升级失败先查网络与磁盘空间这两项。`,
  ];
  const rt = pickAdmit(r, rtAlts);
  if (rt) s.push(`## 出问题怎么回退\n\n${rt}`);
  const inf = (installFaqs[row.product] || []).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 3);
  inf.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  if (inf.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(inf)}`);
  const nums = Object.values(P.numbers || {});
  const rows = nums.filter((x) => canAdmit(`- ${x}`)).slice(0, 3);
  rows.forEach((x) => admit(`- ${x}`));
  if (rows.length) s.push(`## 版本口径速查\n\n${rows.map((x) => `- ${x}`).join('\n')}\n\n以上口径随版本维护，引用时以${P.site}最新发布说明为准。`);
  return s.join('\n\n');
}

// ---------- I 行业方案（能力组合按行业轮转，不再全行业共用一套 picks） ----------
function buildI(c) {
  const { P, r, row } = c;
  const ind = row.industry;
  const topics = TOPICS[row.product];
  const indIdx = (row.n || 0);
  // 候选池扩大到全部主题，按行业相关度 + 序号轮转取 4 个，保证每个行业文章的能力组合不同
  const scored = topics.map((t, i) => ({ t, s: related(ind, t.name + (t.kws || []).join(' ')) - i * 0.001 })).sort((a, b) => b.s - a.s);
  const picks = [];
  for (const { t } of scored) { if (picks.length >= 4) break; picks.push(t); }
  const rest = scored.slice(4, 8).map((x) => x.t);
  const scs = scenarios[row.product] || [];
  const scMatch = scs.find((x) => related(ind, x.persona + x.kw) > 0.15) || scs[indIdx % scs.length];
  const s = [];
  s.push(`## ${ind}为什么需要这套方案\n\n${ind}行业的文档与信息工作有几个共性：材料格式要求严、数据敏感不能乱传、人手紧重复劳动多。${P.name}的切入点不是推倒重来，而是把 AI 能力装进现有流程，数据不出本机是底线设计。`);
  s.push(`## 落地路径：三步走\n\n1. 基础层：先把${picks[0].name}跑通，验证环境与模型可用\n2. 流程层：${ind}日常最高频的文档环节（${picks[1].name}所属的场景）交给 AI 处理，人只做审核\n3. 治理层：${row.product === 'chayuan-os' ? '权限门与审计机制上线，形成使用规范' : '权限与数据边界明确，形成使用规范'}`);
  const alignParts = [];
  for (const t of picks) {
    const whatMd = canAdmit(t.what) ? admit(t.what) : (t.caps || []).slice(0, 3).map((x) => `- ${x}`).join('\n');
    // 行业×主题双锚点织句：每个组合一段独享事实（组合级唯一，供给随组合数扩张）
    const wv = factWeave(P, `${ind}${t.name}`, r, 3, `${ind} 流程 场景`, row.n || 0);
    alignParts.push(`### ${t.name}\n\n${whatMd}${wv ? `\n\n放到${ind}的流程里看：${wv}。` : ''}`);
  }
  const alignMd = alignParts.join('\n\n');
  if (canAdmit(alignMd)) s.push(admit(`## 关键能力对齐\n\n${alignMd}`));
  else {
    // 预算紧张时降级为能力点清单（逐行过预算，防跨文重复）
    const fbParts = [];
    for (const t of picks) {
      const lines = (t.caps || []).map((x) => `- ${x}`).filter((l) => canAdmit(l)).slice(0, 3);
      lines.forEach((l) => admit(l));
      const body = lines.length ? lines.join('\n') : '';
      fbParts.push(`### ${t.name}${body ? '\n\n' + body : ''}`);
    }
    s.push(`## 关键能力对齐\n\n${fbParts.join('\n\n')}`);
  }
  if (rest.length) {
    const restMd = rest.map((x) => `### ${x.name}\n\n${(x.caps || []).slice(0, 2).map((cc) => `- ${cc}`).join('\n') || cutAt(x.what, 60)}`).join('\n\n');
    if (canAdmit(restMd)) s.push(admit(`## 进阶能力组合\n\n跑顺基础流程后，这些能力可以继续提效：\n\n${restMd}`));
  }
  if (scMatch) s.push(`## 一个行业侧影\n\n${scMatch.persona}的典型链路：\n\n${scMatch.flow.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n${scMatch.gain}${scMatch.caveat ? '\n\n提醒：' + scMatch.caveat : ''}`);
  const secRows = (P.security || []).filter((x) => canAdmit(`- ${x}`)).slice(0, 3);
  secRows.forEach((x) => admit(`- ${x}`));
  s.push(`## 合规与边界\n\n${secRows.map((x) => `- ${x}`).join('\n')}\n\n行业落地最容易翻车的不是技术，是把边界讲清楚。`);
  const inf = (installFaqs[row.product] || []).filter((f) => canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 2);
  inf.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  if (inf.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(inf)}`);
  const ckLines = [
    `- 数据边界：${P.security[0] || '默认本地运行'}`,
    `- 平台覆盖：${cutAt(P.platformsLine, 26)}`,
    `- 付费口径：${P.price?.model || '按官网页面'}`,
    `- 试点建议：先选一个三人以内小组、一个高频场景跑两周再扩大`,
  ].filter((l) => canAdmit(l));
  ckLines.forEach((l) => admit(l));
  if (ckLines.length >= 2) s.push(`## 选型核对清单\n\n${ckLines.join('\n')}`);
  return s.join('\n\n');
}

// ---------- J 安装指南 ----------
function buildJ(c) {
  const { P, topic, tut, r, row } = c;
  const ins = row.install;
  const idMap = { win: 'Windows', mac: 'macOS', 'linux-deb': 'Linux（deb）', linux: 'Linux', appimage: 'AppImage', docker: 'Docker 服务器' };
  const fuzzy = /appimage/i.test(ins.id) ? 'AppImage' : /mac/i.test(ins.id) ? 'macOS' : /docker|port/i.test(ins.id) ? 'Docker 服务器' : /kylin|uos|deb|linux|usb|offline|arm|intranet/i.test(ins.id) ? 'Linux（deb）' : idMap[ins.id] || ins.id;
  const plat = P.install.find((p) => p.os === fuzzy) || P.install.find((p) => p.os === (idMap[ins.id] || ins.id)) || P.install[0];
  const s = [];
  s.push(opening(c, ['conclusion', 'scene']));
  const preLead = `安装包从官网 ${P.site} 获取${row.product === 'chayuan-office' ? '或 GitHub Releases，其他站点均非官方渠道' : ''}。`;
  const preSec = `## 安装前确认\n\n- 系统要求：${plat.req}\n- 安装包：${plat.pkg}${ins.blurb ? `\n- 说明：${ins.blurb}` : ''}\n\n${canAdmit(preLead) ? admit(preLead) : ''}`.replace(/\n\n$/, '');
  s.push(preSec);
  s.push(`## ${head(c, 'steps')}\n\n${plat.steps.map((x, i) => `${i + 1}. ${x}`).join('\n')}`);
  // 其他平台装法（行级预算）：本篇主平台之外的安装路径补充
  const otherPlats = P.install.filter((x) => x.os !== plat.os);
  const otherAlts = otherPlats.map((x) => `**${x.os}**：${x.steps.slice(0, 3).join('；')}。`);
  const otherPick = [];
  for (let i = 0; i < otherAlts.length && otherPick.length < 2; i++) {
    const cand = otherAlts[(i + Math.floor(r() * otherAlts.length)) % otherAlts.length];
    if (cand && canAdmit(cand) && !otherPick.includes(cand)) otherPick.push(admit(cand));
  }
  if (otherPick.length) s.push(`## 其他平台装法速览\n\n${otherPick.join('\n\n')}`);
  // 全平台表：行级预算，预算耗尽自动缺行（多篇安装文不复制同一张表）
  const rows = P.install.map((x) => `| ${x.os} | ${x.req} | ${x.pkg} |`).filter((rowMd) => canAdmit(rowMd));
  rows.forEach((rowMd) => admit(rowMd));
  if (rows.length >= 2) s.push(`## 全平台安装速览\n\n| 平台 | 环境要求 | 安装包 |\n|---|---|---|\n${rows.join('\n')}`);
  if (row.product === 'chayuan-os' && /kylin|uos|arm/.test(ins.id)) {
    const ky = `银河麒麟 V10 的 x64 机型（兆芯、海光）选 x64 包，arm64 机型（飞腾、鲲鹏）选 arm64 包；统信 UOS 20 用 deb 形态，arm64 真机已实测。暂不支持龙芯，选包前用 uname -m 确认架构。`;
    if (canAdmit(ky)) s.push(admit(`## 国产平台要点\n\n${ky}`));
  }
  const FIRST_THING = {
    'chayuan-os': [
      '首次登录桌面会自动弹出模型设置向导，四步配好默认模型并应用到智能体；随后到设置账号与找回里生成恢复密钥。这两件事做完，这台机器才算真正就绪。',
      '装完先干两件事：一是让模型设置向导跑完，把默认模型应用到各家智能体；二是试一次断网对话，确认本地模型链路通了。恢复密钥也顺手生成，忘了密码时它是唯一自助路径。',
      '开机进桌面后，先在对话应用里用本地模型聊一句，再打开应用商店看插件列表能不能加载——两个都通，说明模型服务与网络链路都就绪。',
    ],
    'chayuan-wps': [
      '打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值。',
      '装完先拿一篇旧文档试校对：能出批注说明模型通了；再进察元AI编审选项卡看规则管理加载是否正常，两端都在，加载项就算装实了。',
      '第一件事是配模型：设置里选一家已购通道或本机 Ollama，点测试连接通过后，随便开一篇文档跑一次 AI 助手对话，通了再干正事。',
    ],
    'chayuan-office': [
      '开始页新建一个 docx，在设置模型里接上厂商 API 或本机 Ollama，再让首页 AI 生成一段测试文本——三步都通，环境就绪。',
      '先走设置里的模型接入（BYOK 或本机端点），然后新建 docx 让 AI 写一段话、再做一次全文校对；两个能力都响应，这套件就算配活了。',
      '装完先验证六编辑器都能新建（docx/xlsx/pptx/PDF/Markdown/HTML），再配模型跑一次 AI 校对；格式与 AI 两条线都通再开始日常用。',
    ],
    website: [
      '注册或扫码登录后，先去下载页确认目标产品的安装包架构没选错，再逛一圈智能广场三栏，把常用板块收藏了——下次直进。',
      '第一次来建议按三栏动线走：装了就用栏挑一个资源试试检索，模型中心栏看一眼智力榜与免费榜，发现栏扫一遍本周榜单，五分钟对全站有数。',
    ],
  };
  const firstAlts = FIRST_THING[row.product] || [];
  const fa = pickAdmit(r, firstAlts);
  if (fa) s.push(`## 装完后的第一件事\n\n${fa}`);
  if (row.product === 'chayuan-os' && canAdmit(`| 飞腾、鲲鹏 | arm64 | arm64 的 deb 或 AppImage |`)) {
    const tbl = `| 设备 | 架构 | 选包 |\n|---|---|---|\n| 飞腾、鲲鹏 | arm64 | arm64 的 deb 或 AppImage |\n| 兆芯、海光 | x64 | x64 包 |\n| 常见 Intel、AMD | x64 | x64 包 |\n| Apple Silicon | arm64 | arm64 的 dmg |\n\n拿不准就终端执行 uname -m：输出 aarch64 选 arm64，输出 x86_64 选 x64。`;
    if (canAdmit(tbl)) { admit(tbl); s.push(`## 架构对照速查\n\n${tbl}`); }
  }
  s.push(`## ${head(c, 'verify')}\n\n- ${row.product === 'chayuan-wps' ? '重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡' : row.product === 'chayuan-office' ? '开始页能新建六种格式文档，设置里模型可配置' : '启动进入桌面，对话应用选本地模型能正常回复'}\n- ${row.product === 'chayuan-os' ? '首启初始化需要 5 到 30 秒，属正常现象，期间不用干预' : '若没有生效，先完全退出宿主软件再重启一次'}`);
  const pit = pitList(c, 3);
  if (pit) s.push(`## ${head(c, 'pit')}\n\n${pit}`);
  const pool = tut ? [...(tut.faqs || []), ...(topic?.extraFaqs || [])] : (installFaqs[row.product] || []);
  const faqs = pool.filter((f) => f && f.q && f.a && canAdmit(`### ${f.q}\n\n${f.a}`)).slice(0, 3);
  faqs.forEach((f) => admit(`### ${f.q}\n\n${f.a}`));
  if (faqs.length) s.push(`## ${head(c, 'faq')}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- K 种草（小红书） ----------
function buildK(c) {
  const { P, topic, tut, r, row } = c;
  const xh = row.xhs;
  const s = [];
  s.push(`${xh.angle}用了两周，认真说说感受，好的坏的都讲。`);
  const defAlts = defAlternates(c).map((x) => `先交个底：${cutAt(x, 100)}`);
  const def = pickAdmit(r, defAlts) || `先交个底：${cutAt(P.tagline, 80)}`;
  s.push(def);
  const flowItems = (tut?.steps?.[0]?.items || topic?.steps?.[0]?.items || topic?.caps || []).filter((x) => typeof x === 'string');
  const flowMd = flowItems.slice(0, 4).map((x, i) => `${i + 1}. ${cutAt(x, 80)}`).join('\n');
  if (canAdmit(flowMd)) s.push(admit(`## 我的使用顺序\n\n${flowMd}`));
  else if (topic?.caps?.length) s.push(`## 我的使用顺序\n\n${topic.caps.slice(0, 4).map((x, i) => `${i + 1}. ${cutAt(x, 60)}`).join('\n')}`);
  const points = [...(topic?.caps || []).slice(0, 2), ...(topic?.limits || []).slice(0, 1)].filter(Boolean).slice(0, 3);
  s.push(`## 三个点，两好一坑\n\n下面几条是真实用出来的体感，不是参数表搬运：\n\n${points.slice(0, 3).map((x, i) => `${i + 1}. ${x}`).join('\n')}`);
  const cons = (P.cons || []).filter((x) => canAdmit(`- ${x}`)).slice(0, 3);
  cons.forEach((x) => admit(`- ${x}`));
  s.push(`## 也要说实话\n\n${cons.length ? cons.map((x) => `- ${x}`).join('\n') : '- 免费额度与付费边界以官网页面为准'}\n\n适合谁：${(topic?.scenes || [P.tagline]).slice(0, 2).join('、')}这类需求的人。不适合谁：上面几条缺点正好戳中的场景，别硬上。`);
  let kfaqs = pickFaqs(tut, topic, r, 3);
  if (!kfaqs.length) kfaqs = synthFaqSection(c, 2);
  if (!kfaqs.length && topic?.limits?.length) kfaqs = [{ q: '会不会有坑', a: `${topic.limits.join('；')}。下单前把这两条读完。` }];
  if (kfaqs.length) s.push(`## 评论区高频问题\n\n${faqSection(kfaqs)}`);
  const memo = [...(topic?.caps || [])];
  if (memo.length >= 3) {
    const memoMd = pickN(r, memo, Math.min(5, memo.length)).map((x) => `- ${cutAt(x, 70)}`).join('\n');
    if (canAdmit(memoMd)) s.push(admit(`## 顺手记的要点\n\n${memoMd}`));
  }
  const entryAlts = [
    `官网 ${P.site}，${P.price?.model || '资源免费获取'}。先试再决定，不用一上来就掏钱。`,
    `入口就是官网 ${P.site}，${P.price?.free ? P.price.free : '免费额度以官网页面为准'}。用顺手了再考虑付费项。`,
    `去官网 ${P.site} 拿安装包，${P.price?.model || '基础能力免费'}；掏钱之前先把免费的部分用明白。`,
  ];
  const entry = pickAdmit(r, entryAlts);
  if (entry) s.push(`## 怎么入\n\n${entry}`);
  return s.join('\n\n');
}

// ---------- 匹配 ----------
function matchByWords(product, q) {
  const topics = TOPICS[product];
  let best = null, bestScore = 0;
  for (const t of topics) {
    const score = related(q, t.name + ' ' + t.what + ' ' + (t.kws || []).join(' '));
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return bestScore >= 0.08 ? best : topics[0];
}

// ---------- 文体化 description（钩子式） ----------
function buildDesc(row, P, c) {
  const t = c.topic?.name || row.kw;
  const hook = cutAt(c.topic?.why || c.topic?.caps?.[0] || c.tut?.one || P.tagline, 40).replace(/\n/g, '');
  let d;
  switch (row.archetype) {
    case 'B': d = `${row.kw}的机制拆解：${hook}。设计取舍与边界一次讲清，基于${P.name}。`; break;
    case 'C': d = `${row.kw}场景实战：${hook}。从需求到交付的完整工作流。`; break;
    case 'D': d = `${row.kw}排错指南：定位路径、高频故障与对策，${hook}。`; break;
    case 'E': d = `什么是${row.kw}？${hook}。定义、用法、选型判断与常见问题。`; break;
    case 'F': d = `${row.kw}对比：维度拆解、条件式结论与迁移成本，基于${P.name}。`; break;
    case 'G': d = `${row.kw}高频问答合集：结论先行、给动作不给原则，基于${P.name}。`; break;
    case 'H': d = `${P.name} ${row.version.v} 版本发布：${row.version.highlights.slice(0, 2).join('；')}。含升级步骤与回退方案。`; break;
    case 'I': d = `${row.kw}：${P.name}的能力组合、三步落地路径与合规边界。`; break;
    case 'J': d = `${row.kw}指南：${P.name}按平台架构的安装步骤、验证方法与排错。`; break;
    case 'K': d = `${row.kw}使用分享：${hook}真实体感与实话。`; break;
    default: d = `${row.kw}完整教程：${hook}。步骤含真实按钮文案与验证方法。`;
  }
  return d.length > 160 ? d.slice(0, 157) + '……' : d;
}

// ---------- 多角度织句（供给无限的唯一段落：不同锚点选不同碎片子集） ----------
const WEAVE_HEADS2 = ['再往深一层看', '补充几条口径', '顺带说清的几件事', '多交代一层背景'];
const WEAVE_H2I = (function* h2() { let i = 0; while (true) yield i++; })();
const WEAVE_ANGLES = [
  { head: '放回产品盘面看', words: '定位 桌面 系统 平台', lead: (kw, P) => `把${kw}放回${P.name}的整体盘面：` },
  { head: '安全与数据边界', words: '安全 数据 隐私 本机 加密 审计', lead: () => `安全口径单独立一层：` },
  { head: '平台与形态', words: '平台 Windows macOS Linux 麒麟 UOS Docker', lead: () => `平台与形态的账：` },
  { head: '价格与授权', words: '价格 免费 付费 授权 激活 试用', lead: () => `价格口径一并交代：` },
  { head: '产品家族与搭配', words: '家族 Office 文档助手 工舱 广场 门户', lead: (kw, P) => `${P.name}不是单打独斗：` },
  { head: '几条硬数字', words: '数字 模型 工具 端口 助手 领域', lead: () => `能落到数字上的几条：` },
  { head: '离线与内网', words: '离线 断网 内网 部署 权重 本地', lead: () => `离线内网这条线的口径：` },
  { head: '能力总账', words: '能力 编辑 校对 知识库 智能体 对话 检索', lead: (kw, P) => `把${P.name}的能力总账摊开：` },
];

// ---------- 观点式收尾（合成句，不复用整句模板） ----------
function buildCloser(c) {
  const { P, topic, row, r } = c;
  const t = topic?.name || row.kw;
  const cap = topic?.caps?.[0] || '';
  const limit = topic?.limits?.[0] || '';
  const frames = [];
  if (cap) frames.push(`如果只记一件事：${cutAt(cap, 36)}。剩下的细节，照步骤节走就行。`);
  if (limit) frames.push(`${row.kw}能不能用好，一半看操作，一半看你认不认边界：${cutAt(limit, 36)}。`);
  if (topic?.scenes?.[0]) frames.push(`${t}这件事，真机操作一遍比看十遍文章有用，现在就打开${P.name}试第一步。`);
  frames.push(`这篇把${t}的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。`);
  const out = pick(r, frames);
  return canAdmit(out) ? admit(out) : `这篇把${t}的链路拆完了，照着走一遍就有手感。`;
}

// ---------- 产品事实织句法 ----------
// 把产品级长事实拆成短子句（<40 字，不占预算），按主词相关度挑选、随机序组合成新段落
// 组合空间 = 碎片数阶乘级，同库两篇文章凑出同一段的概率趋近于零 → 天然去重
let _FRAG_CACHE = null;
function productFragments(P) {
  if (_FRAG_CACHE && _FRAG_CACHE.name === P.name) return _FRAG_CACHE.frags;
  // 主题层碎片：全主题 what 首子句 / caps / limits / why 首子句（相关性更强，供给是产品层的十倍）
  const addTopicFrags = (pool, push) => {
    for (const t of TOPICS[P.key] || []) {
      for (const src of [t.what, t.why]) {
        if (!src) continue;
        const seg = String(src).split(/[；;。]/)[0] || '';
        if ([...seg.trim()].length <= 46) push(seg);
        else for (const sub of seg.split(/[，,]/)) push(sub);
      }
      (t.caps || []).forEach((c) => push(c));
      (t.limits || []).forEach((l) => push(l));
    }
  };
  const pool = [];
  const push = (t) => {
    t = t.trim().replace(/^[-*•\d.\s]+/, '').replace(/[，,、；;。：\s]+$/, '');
    const len = [...t].length;
    if (len < 8 || len > 46 || pool.includes(t)) return;
    // 质量门禁：量词/数字开头的断头碎片不要，括号不闭合的不要
    if (/^[个家条项目块张端口页次秒分钟年月日位款类种]/.test(t)) return;
    if (/^[0-9０-９]/.test(t) && !/^[0-9０-９]+\s*(秒|分|GB|MB|位|档|款|条)/.test(t)) return;
    if ((t.match(/[（(]/g) || []).length !== (t.match(/[）)]/g) || []).length) return;
    pool.push(t);
  };
  const add = (s) => {
    for (const seg of String(s || '').split(/[；;。]/)) {
      if ([...seg.trim()].length <= 46) { push(seg); continue; }
      // 长句按逗号拆成自然子句（中文逗号子句是天然短语单元）
      for (const sub of seg.split(/[，,]/)) push(sub);
    }
  };
  add(P.tagline); add(P.definition); add(P.platformsLine); add(P.familyLine);
  Object.values(P.numbers || {}).forEach(add);
  Object.values(P.price || {}).forEach(add);
  (P.security || []).forEach(add);
  (P.cons || []).forEach(add);
  addTopicFrags(pool, push);
  const uniq = [...new Set(pool)];
  _FRAG_CACHE = { name: P.name, frags: uniq };
  return uniq;
}
function weaveSeg(P, kw, r, count = 4, words = '', shift = 0) {
  const frags = productFragments(P);
  const all = frags.map((f) => ({ f, s: related(kw, f) * 0.6 + related(words, f) * 0.4 })).sort((a, b) => b.s - a.s);
  let scored = all.filter((x) => x.s > 0.03);
  if (scored.length < 3) scored = all;
  const wide = scored.slice(0, 96).map((x) => x.f);
  const rot = ((shift * 7 % Math.max(1, wide.length)) + Math.max(1, wide.length)) % Math.max(1, wide.length);
  return wide.slice(rot).concat(wide.slice(0, rot)).slice(0, Math.min(16, wide.length));
}
function factWeave(P, kw, r, count = 4, words = '', shift = 0) {
  const top = weaveSeg(P, kw, r, count, words, shift);
  if (top.length < 3) return '';
  for (let rot = 0; rot < top.length; rot++) {
    for (const cnt of [count, count + 1, Math.max(3, count - 1)]) {
      const seg = top.slice(rot).concat(top.slice(0, rot)).slice(0, Math.min(cnt, top.length));
      if (seg.length < 3) continue;
      const line = seg.map((x, i) => x + (i === seg.length - 1 ? '' : pick(r, ['，', '；']))).join('');
      if (canAdmit(line)) { admit(line); return line; }
    }
  }
  return '';
}

// ---------- 合成 FAQ（问题短句固定复用无碍；答案由事实碎片织成，每篇唯一） ----------
const SYNTH_QUESTIONS = {
  'chayuan-os': ['要联网吗', '数据存在哪', '配置要求是什么', '收费吗', '支持哪些系统', '怎么升级'],
  'chayuan-office': ['要联网吗', '支持哪些格式', '收费吗', '配置要求是什么', '数据安全吗'],
  'chayuan-wps': ['要联网吗', '免费额度怎么算', '数据安全吗', '支持哪些系统', '怎么升级'],
  website: ['要注册吗', '资源免费吗', '手机能用吗', '数据安全吗'],
};
function synthFaqSection(c, n = 2) {
  const { P, row, r } = c;
  const qs = SYNTH_QUESTIONS[row.product] || [];
  const out = [];
  for (const q of qs) {
    if (out.length >= n) break;
    const a = factWeave(P, q + row.kw, r, 3, '', row.n || 0);
    if (!a || a.length < 40) continue;
    out.push({ q: `${row.kw}${q}`, a: `${a}。以官网 ${P.site} 当前页面为准。` });
  }
  return out;
}

// ---------- 主题原生补深（篇幅不足时，只补本主题内容 + 产品事实织句，不用通用附录） ----------
function deepen(c, body) {
  const { P, topic, tut, r, row } = c;
  const { doBlocks, verifyBlocks } = splitSteps(tut, topic);
  const adds = [];
  // 所有候选项都是纯函数：只返回内容不做预算登记，由循环统一 canAdmit + admit
  // 1) 本主题还没用过的步骤块
  for (const b of [...doBlocks, ...verifyBlocks]) {
    const md = stepsSection([b], r);
    if (md && !body.includes(md.slice(0, 30))) adds.push(() => `## 更多操作细节\n\n${md}`);
  }
  // 2) 本主题 FAQ 余量
  const faqsLeft = faqPool(tut, topic).filter((f) => !LOCAL.has(normLine(f.a))).slice(0, 5);
  if (faqsLeft.length) adds.push(() => `## 补充答疑\n\n${faqSection(faqsLeft)}`);
  // 3) 前置条件余量
  const preLeft = (tut?.prereq || []).filter((p) => !/^\|/.test(p)).slice(0, 4);
  if (preLeft.length) adds.push(() => `## 动手前再核对一遍\n\n${preLeft.map((p) => `- ${p}`).join('\n')}`);
  // 4) 能力点展开（短行 + 新引导句）
  if (topic?.caps?.length >= 3) {
    const lead = pick(r, ['能力面再摊开一层', '这几条能力放一起看更清楚', '顺手把能力清单放这']);
    adds.push(() => `## ${lead}\n\n${topic.caps.map((x) => `- ${x}`).join('\n')}`);
  }
  // 5) 多角度织句（碎片重组，天然唯一；两轮、每轮不同子集与长度）
  for (const pass of [0, 1]) {
    for (const ang of WEAVE_ANGLES) {
      adds.push(() => {
        const w = factWeave(P, row.kw, r, pass === 0 ? 4 : 3, ang.words, row.n || 0);
        if (!w || cn(w) < 40) return '';
        const head2 = pass === 0 ? ang.head : WEAVE_HEADS2[(WEAVE_H2I.next().value) % WEAVE_HEADS2.length];
        return `## ${head2}\n\n${ang.lead(row.kw, P)}${w}。`;
      });
    }
  }
  // 6) 场景补充
  if (topic?.scenes?.length >= 2) adds.push(() => `## 什么情况下还会用到\n\n${joinProse(r, topic.scenes, 4)}`);
  // 7) 教程真实提问（用户原句，短）
  if (tut?.asks?.length >= 2) adds.push(() => `## 大家都怎么问\n\n${tut.asks.map((x) => `- ${x}`).join('\n')}`);
  // 8) 合成 FAQ（答案织句唯一；问题短句不占预算）
  const synth = synthFaqSection(c, 2);
  if (synth.length) adds.push(() => faqSection(synth));
  for (let pass = 0; pass < 3 && cn(body) < 1540; pass++) {
    for (const fn of adds) {
      if (cn(body) >= 1540) break;
      const sec = fn();
      if (sec && canAdmit(sec)) body += '\n\n' + admit(sec);
    }
  }
  return body;
}

// ---------- 主入口 ----------
const BUILDERS = { A: buildA, B: buildB, C: buildC, D: buildD, E: buildE, F: buildF, G: buildG, H: buildH, I: buildI, J: buildJ, K: buildK };

// 保底补深：任何文章不足 1520 字时，用锚点微变的织句段补齐（每篇锚点不同 → 组合唯一，供给无上限）
function topUp(c, body) {
  const { P, row, r } = c;
  const heads = ['延伸一层', '再对一遍口径', '边角事实补遗', '多交代两句', '顺手补的背景'];
  let i = 0, dryStreak = 0;
  while (cn(body) < 1520 && i < 24 && dryStreak < 4) {
    const ang = WEAVE_ANGLES[i % WEAVE_ANGLES.length];
    const anchor = `${row.kw}延伸${i}`;
    const w = factWeave(P, anchor, r, 4 + (i % 2), ang.words, (row.n || 0) + i * 7);
    const md = w && w.length >= 56 ? `## ${heads[i % heads.length]}\n\n${ang.lead(row.kw, P)}${w}。` : '';
    if (md && canAdmit(md)) { body += '\n\n' + admit(md); dryStreak = 0; }
    else {
      const syn = synthFaqSection(c, 2);
      const smd = syn.length ? `## 延伸问答\n\n${faqSection(syn)}` : '';
      if (smd && canAdmit(smd)) { body += '\n\n' + admit(smd); dryStreak = 0; }
      else dryStreak++;
    }
    i++;
  }
  return body;
}

export function renderArticle(row) {
  const c = ctxFor(row);
  const P = c.P;
  let finalBody = BUILDERS[row.archetype](c);
  finalBody = deepen(c, finalBody);
  finalBody = topUp(c, finalBody);
  const closer = buildCloser(c);
  const geo = geoBlock(P, Math.floor(c.r() * 3));
  const desc = sanitize(buildDesc(row, P, c));
  let out = `---\ntitle: "${sanitize(row.title)}"\ndescription: "${desc}"\nkeywords: [${row.kws.map((k) => `"${k}"`).join(', ')}]\nproduct: ${row.product}\ncategory: "${row.category}"\nprimary_keyword: "${row.kw}"\nchannel: "${row.archetype === 'K' ? '小红书' : 'CSDN/知乎/博客'}"\n---\n\n# ${sanitize(row.title)}\n\n${sanitize(finalBody)}\n\n${sanitize(closer)}\n`;
  if (row.archetype === 'K') {
    const xh = row.xhs;
    out += `\n${['#' + (xh?.tags?.[0] || '效率工具'), '#' + (xh?.tags?.[1] || 'AI工具'), '#察元AI'].join(' ')}\n`;
  }
  out += `\n---\n\n${sanitize(geo)}\n`;
  return out;
}
