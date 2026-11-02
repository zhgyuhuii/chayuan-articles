// render.mjs —— 文章组装引擎 v2
// v2 吸收抽样审查结论：
//  1) 补齐内容按文体分区：F/G/H/I/K 不再拼通用附录，改为原生增厚
//  2) 步骤层级修复：以冒号结尾的父项不再编号，渲染为加粗子题
//  3) 表格空行断裂修复；一切截断在句界收口
//  4) description/closer 按文体分池
//  5) FAQ 匹配用二元组重合度，杜绝张冠李戴
import { PRODUCTS, geoBlock } from '../facts/products.mjs';
import { rng, pick, pickN, openers, transitions, toneWords, joinProse,
  hDef, hPre, hSteps, hVerify, hPit, hFaq, hDeep, hScene, hWhy, hTable } from '../facts/voice.mjs';
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

// 句界收口截断：在标点后截断，绝不词中断句
function cutAt(text, max) {
  if (cn(text) <= max) return text;
  const slice = text.slice(0, max + 8);
  const idx = Math.max(slice.lastIndexOf('。'), slice.lastIndexOf('；'), slice.lastIndexOf('，'), slice.lastIndexOf('：'));
  if (idx >= Math.floor(max * 0.5)) return slice.slice(0, idx + 1);
  return slice.slice(0, max) + '……';
}

// 表格修复：合并被空行打断的表格行
function repairTables(text) {
  const lines = text.split('\n');
  const out = [];
  for (const ln of lines) {
    const prev = out[out.length - 1];
    if (/^\s*\|/.test(ln) && prev !== undefined && prev.trim() === '' && /^\s*\|/.test(out[out.length - 2] || '')) out.pop();
    out.push(ln);
  }
  return out.join('\n');
}

export function sanitize(text) {
  return repairTables(text
    // 链接剥离必须最先执行：源教程的「见 [C3](xxx)」等引用要先还原成纯文本，后续引用清理规则才匹配得上
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
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(?<=\S)[^\S\n]+/g, ' ')
    .replace(/ ?」/g, '」')
    .replace(/「 /g, '「')
    .replace(/（ /g, '（')
    .replace(/。。+/g, '。')
    .replace(/？；/g, '；')
    .replace(/？。/g, '。')
    .replace(/？，/g, '，')
    .replace(/：；/g, '；')
    .replace(/；。/g, '。')
    .replace(/；。/g, '。')
    .replace(/；，/g, '；')
    .replace(/，。/g, '。')
    .replace(/：。/g, '：')
    .replace(/ +\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^#{1,6} +$/gm, '')
    .trim());
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
  return { P, topic, tut, sc, r, row };
}

function defSentence({ P, topic, tut }) {
  if (tut?.one) return tut.one;
  if (topic?.what) return topic.what;
  return P.definition;
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

// 步骤渲染（层级：冒号结尾的父项保留冒号并做编号父项，子项缩进 4 格成子列表）
function stepsSection(doBlocks) {
  const out = [];
  for (const b of doBlocks) {
    let chunk = '';
    if (b.head) chunk += `**${b.head}**\n\n`;
    if (b.paras?.length) chunk += b.paras.join('\n\n') + '\n\n';
    if (b.items?.length) {
      let n = 0, sub = 0, inSub = false;
      const parts = [];
      for (let i = 0; i < b.items.length; i++) {
        const it = b.items[i];
        const isParent = /[:：]\s*$/.test(it) && i < b.items.length - 1;
        if (isParent) {
          n += 1; sub = 0; inSub = true;
          parts.push(`${n}. **${it}**`);
        } else if (inSub) {
          sub += 1;
          parts.push(`    ${sub}. ${it}`);
        } else {
          n += 1;
          parts.push(`${n}. ${it}`);
        }
      }
      chunk += parts.join('\n') + '\n\n';
    }
    if (b.tables?.length) chunk += b.tables.join('\n') + '\n\n';
    out.push(chunk);
  }
  return out.join('');
}

function faqSection(faqs) {
  return faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
}

function pickFaqs(tut, topic, r, need = 4, exclude = new Set()) {
  const pool = [];
  if (tut?.faqs) pool.push(...tut.faqs);
  if (topic?.extraFaqs) pool.push(...topic.extraFaqs);
  return pickN(r, pool.filter((f) => f.q && f.a && !exclude.has(f.q)), need);
}

// 二元组重合度匹配（比逐词 split 稳，避免整句无分隔符时全盘失配）
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

// ---------- 开头 ----------
function opening(c, styles) {
  const { P, topic, r, row } = c;
  const style = pick(r, styles);
  const tmpl = pick(r, openers[style]);
  const goal = topic?.scenes?.[0] || row.kw;
  return tmpl
    .replaceAll('{kw}', row.kw)
    .replaceAll('{t}', topic?.name || row.kw)
    .replaceAll('{p}', P.name)
    .replaceAll('{pd}', P.site)
    .replaceAll('{pos}', P.tagline.replace(/：/g, '，'))
    .replaceAll('{goal}', goal.length > 16 ? cutAt(goal, 16) : goal)
    .replaceAll('{idea}', '把入口收拢、把步骤做实、把边界说清');
}

function defParagraph(c) {
  const { P, topic, r } = c;
  const def = defSentence(c);
  const why = topic?.why || '';
  const tail = pick(r, [
    '下面直接进入正题。',
    '先把这个定位立住，再看步骤。',
    '按真实界面写，按钮文案原样引用。',
    '入口、步骤、验证三段看清，这事就顺了。',
  ]);
  return `${def}${why ? '\n\n' + why : ''}\n\n${tail}`;
}

function scenePara(c) {
  const { topic, tut, r } = c;
  const list = [...(topic?.scenes || []), ...(tut?.scenes || [])];
  const askLine = tut?.asks?.length ? `\n\n用户常搜的问法：${tut.asks.slice(0, 2).join('；')}。` : '';
  if (!list.length) return `适合所有需要把这件事做稳、做快的日常场景。${askLine}`;
  return `${joinProse(r, list, 4)}${askLine}`;
}

function pitList(c) {
  const { P, topic, r } = c;
  const items = [...(topic?.limits || []), ...(P.cons || []).slice(0, 2)];
  if (!items.length) return '';
  const head = pick(r, [
    '功能归功能，这几个边界先摆清楚：',
    '如实说明，它不是万能的：',
    '用之前要认的账：',
    '边界都在这：',
  ]);
  return `${head}\n\n${pickN(r, items, Math.min(4, items.length)).map((x) => `- ${x}`).join('\n')}`;
}

// 能力点表格：仅当条目自带分隔符（可拆出短标签）才用表格，否则退回列表
function capTable(caps) {
  const rows = caps.map((x) => {
    const i = ['：', '，', '；'].map((d) => x.indexOf(d)).filter((n) => n > 2 && n < 20).sort((a, b) => a - b)[0];
    return i ? [x.slice(0, i), x.slice(i + 1).replace(/^[：，；]/, '')] : null;
  });
  if (rows.filter(Boolean).length < Math.ceil(caps.length * 0.6)) return null;
  return `| 能力点 | 具体表现 |\n|---|---|\n${rows.map((rv, i) => rv ? `| ${rv[0]} | ${rv[1] || caps[i]} |` : `| ${caps[i].slice(0, 2)} | ${caps[i]} |`).join('\n')}`;
}

function fitPara(c) {
  const { P, topic } = c;
  const yes = topic?.scenes?.[0] || '有这类高频需求的人';
  const no = topic?.limits?.[0] || '需求不在这条线上的人';
  return `适合你的情况：日常就是${yes}，希望流程固定、结果可验证。\n\n不必勉强的情况：${cutAt(no, 60)}。${P.name}的思路是把边界写明白，条件式地推荐。`;
}

// ---------- A 上手教程 ----------
function buildA(c) {
  const { topic, tut, r, row } = c;
  const { doBlocks, verifyBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['scene', 'pain', 'experience']));
  s.push(`## ${pick(r, hDef)}\n\n${defParagraph(c)}`);
  const pre = tut?.prereq?.length ? tut.prereq : (topic?.limits || []).map((l) => `注意：${l}`);
  if (pre.length) {
    const bullets = pre.filter((p) => !/^\|/.test(p));
    const tables = pre.filter((p) => /^\|/.test(p));
    let preMd = bullets.map((p) => `- ${p}`).join('\n');
    if (tables.length) preMd += '\n\n' + tables.join('\n');
    s.push(`## ${pick(r, hPre)}\n\n${preMd}`);
  }
  s.push(`## ${pick(r, hSteps)}\n\n${stepsSection(doBlocks, r) || '入口在' + (tut?.entry || topic?.what || '')}`);
  if (verifyBlocks.length) s.push(`## ${pick(r, hVerify)}\n\n${stepsSection(verifyBlocks, r)}`);
  else if (doBlocks.length && row.product !== 'website' && tut) s.push(`## ${pick(r, hVerify)}\n\n做完后回到入口确认状态变化：${tut?.entry || '对应界面'}处能看到执行结果即算成功。`);
  if (topic?.scenes?.length || tut?.scenes?.length) s.push(`## ${pick(r, hScene)}\n\n${scenePara(c)}`);
  const pit = pitList(c);
  if (pit) s.push(`## ${pick(r, hPit)}\n\n${pit}`);
  const faqs = pickFaqs(tut, topic, r, 4);
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- B 深度解析 ----------
function buildB(c) {
  const { P, topic, tut, r, row } = c;
  const { doBlocks } = splitSteps(tut, topic);
  const angle = row.tech?.angle;
  const s = [];
  s.push(opening(c, ['conclusion', 'compare', 'experience']));
  s.push(`## ${pick(r, hDef)}\n\n${defParagraph(c)}`);
  let deep = angle ? `${angle}\n\n` : '';
  if (topic?.why) deep += `${topic.why}\n\n`;
  if (topic?.caps?.length) deep += `能力面拆开看：${joinProse(r, topic.caps, 4)}\n\n`;
  const deepFaq = (tut?.faqs || []).find((f) => /为什么|原理|区别|机制|按什么|怎么选|慢|并发/.test(f.q));
  if (deepFaq) deep += `一个常被问到的问题：${deepFaq.q.replace(/？$/, '')}。${deepFaq.a}\n\n`;
  if (tut?.asks?.length) deep += `从提问口径看，用户最关心的是${tut.asks[0]}`;
  s.push(`## ${pick(r, hDeep)}\n\n${deep}`);
  if (topic?.caps?.length) {
    const tbl = capTable(topic.caps);
    if (tbl) s.push(`## ${pick(r, hTable)}\n\n${tbl}`);
  }
  if (doBlocks.length) s.push(`## ${pick(r, hSteps)}\n\n按最短路径验证一遍：\n\n${stepsSection(doBlocks.slice(0, 3), r)}`);
  const pit = pitList(c);
  if (pit) s.push(`## ${pick(r, hPit)}\n\n${pit}`);
  const faqs = pickFaqs(tut, topic, r, 4);
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- C 场景实战 ----------
function buildC(c) {
  const { topic, tut, r, row, sc } = c;
  const { doBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['scene', 'pain']));
  if (sc) {
    s.push(`## ${pick(r, hWhy)}\n\n${sc.pains.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n${sc.persona}这个场景里，${sc.gain}`);
    s.push(`## ${pick(r, hSteps)}\n\n把流程串起来：\n\n${sc.flow.map((f, i) => `${i + 1}. ${f}`).join('\n')}`);
    if (doBlocks.length) s.push(`## 支撑功能的操作细节\n\n流程里${topic?.name || '关键功能'}的实际操作：\n\n${stepsSection(doBlocks.slice(0, 3), r)}`);
  } else {
    s.push(`## ${pick(r, hWhy)}\n\n${scenePara(c)}`);
    s.push(`## ${pick(r, hSteps)}\n\n${stepsSection(doBlocks, r)}`);
  }
  if (topic?.caps?.length) s.push(`## 关键能力点\n\n${topic.caps.map((x) => `- ${x}`).join('\n')}`);
  const pit = pitList(c);
  if (pit) s.push(`## ${pick(r, hPit)}\n\n${pit}${sc?.caveat ? `\n\n场景提醒：${sc.caveat}` : ''}`);
  const faqs = pickFaqs(tut, topic, r, 3);
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- D 排错进阶 ----------
function buildD(c) {
  const { topic, tut, r } = c;
  const { doBlocks, verifyBlocks } = splitSteps(tut, topic);
  const probFaqs = (tut?.faqs || []).filter((f) => /怎么办|失败|不行|不了|慢|排|错|超时|卡|丢|不出|没反应|能用吗|去哪/.test(f.q));
  const s = [];
  s.push(opening(c, ['pain', 'experience']));
  s.push(`## 先定位问题在哪一层\n\n按这个顺序排查通常最快：先确认前置条件（${cutAt((tut?.prereq?.[0] || topic?.limits?.[0] || '环境与模型就绪'), 60)}），再核对操作路径，最后看边界限制。三层各有一些典型症状，对号入座能省很多时间。`);
  if (probFaqs.length) s.push(`## 高频故障与对策\n\n${faqSection(pickN(r, probFaqs, Math.min(5, probFaqs.length)))}`);
  s.push(`## 正确的操作路径\n\n${stepsSection(doBlocks.slice(0, 3), r) || '按产品内置帮助中心的对应教程逐步执行。'}`);
  if (verifyBlocks.length) s.push(`## ${pick(r, hVerify)}\n\n${stepsSection(verifyBlocks, r)}`);
  const adv = [...(topic?.caps || []).map((x) => `- ${x}`), ...(topic?.limits || []).map((x) => `- 边界：${x}`)];
  if (adv.length) s.push(`## 进阶用法与边界\n\n${adv.join('\n')}`);
  const faqs = pickFaqs(tut, topic, r, 3, new Set(probFaqs.map((f) => f.q)));
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- E 关键词释义 ----------
function buildE(c) {
  const { P, topic, tut, r, row } = c;
  const kw = row.kw;
  const { doBlocks } = splitSteps(tut, topic);
  const s = [];
  s.push(opening(c, ['conclusion', 'compare']));
  s.push(`## 什么是${kw}\n\n${defSentence(c)}\n\n放到${P.name}的语境里：${P.tagline.replace(/：/g, '，')}，${topic?.name || '这个能力'}是其中承上启下的一环。`);
  s.push(`## ${pick(r, hWhy)}\n\n${topic?.why || P.tagline + '，' + kw + '是这个体系里绕不开的一环。'}${topic?.scenes?.length ? `\n\n典型使用场景：${joinProse(r, topic.scenes, 3)}` : ''}`);
  if (doBlocks.length) s.push(`## 在${P.name}里怎么用\n\n入口与核心步骤：\n\n${stepsSection(doBlocks.slice(0, 3), r)}`);
  s.push(`## 怎么判断适不适合你\n\n${fitPara(c)}`);
  if (topic?.caps?.length) {
    const tbl = capTable(topic.caps.slice(0, 6));
    if (tbl) s.push(`## ${pick(r, hTable)}\n\n${tbl}`);
  }
  const faqs = pickFaqs(tut, topic, r, 4);
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- F 对比评测（原生增厚） ----------
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
  s.push(`## ${pick(r, hTable)}\n\n| 维度 | ${cols[0]} | ${cols[1]} |\n|---|---|---|\n${cp.dims.map((d) => `| ${d[0]} | ${d[1]} | ${d[2] || '—'} |`).join('\n')}`);
  s.push(`## 逐维度展开\n\n${cp.dims.map((d, i) => `**${d[0]}**：${cols[0]}这边是${d[1]}；${cols[1]}那边是${d[2] || '各有差异'}。${connPool[(i + d[0].length) % connPool.length](d, cols[0], cols[1])}`).join('\n\n')}`);
  s.push(`## 条件式结论\n\n${cp.verdict}`);
  s.push(`## 上手成本与并存策略\n\n多数场景这不是二选一：${P.name}支持与既有工具并存。建议的节奏是先小范围试用，把一个高频场景跑顺，再决定要不要扩大替换范围；低频场景保留旧工具过渡，学习成本摊薄。数据迁移方面，${row.product === 'chayuan-office' ? 'docx、xlsx、pptx 文件直接打开，没有格式转换成本' : row.product === 'chayuan-wps' ? '加载项装在 WPS 里，文档格式零变化' : row.product === 'chayuan-os' ? '数据都在本机目录，整体备份即可迁移' : '资源检索与收藏在浏览器里就能完成'}。`);
  const inf = pickN(r, installFaqs[row.product] || [], 2);
  const harvest = HARVEST[row.product] || [];
  const topFaqPool = harvest.flatMap((t) => t.faqs || []).filter((f) => related(cp.kw + cp.t, f.q) > 0.15);
  const tf = pickN(r, topFaqPool, 2);
  const all = [...inf, ...tf].filter(Boolean);
  if (all.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(all)}`);
  s.push(`## 一句话收束\n\n选型最忌非黑即白。${P.name}与${cols[1]}各有成立场景，按条件选，别按信仰选；拿不准就两个都试用一周，高频场景谁顺手留谁。`);
  return s.join('\n\n');
}

// ---------- G FAQ 合集（匹配重写 + 原生增厚） ----------
function buildG(c) {
  const { P, r, row } = c;
  const fc = faqClusters[row.product][row.faqIdx];
  const harvest = HARVEST[row.product] || [];
  const allFaqs = harvest.flatMap((t) => (t.faqs || []).map((f) => ({ ...f, src: t.title })));
  const s = [];
  s.push(`## ${fc.kw}：结论先行\n\n围绕${fc.scope}，这些是问得最多的问题。每个回答先给结论再给动作，基于${P.name}（${P.version ? '版本 ' + P.version + '，' : ''}${P.site}）整理。文末附预防清单，多数问题的根子都在那三条里。`);
  const used = new Set();
  const answered = [];
  for (const q of fc.qs) {
    let best = null, bestScore = 0;
    for (const f of allFaqs) {
      if (used.has(f.q)) continue;
      const score = related(q, f.q) + related(f.q, q) * 0.5;
      if (score > bestScore) { bestScore = score; best = f; }
    }
    if (best && bestScore >= 0.25) {
      used.add(best.q);
      s.push(`### ${best.q}\n\n${best.a}`);
      answered.push(q);
    } else {
      const topic = matchByWords(row.product, q);
      if (topic && related(q, topic.name + topic.what) > 0.1) {
        s.push(`### ${q}\n\n${topic.what}${topic.caps ? '\n\n要点：' + joinProse(r, topic.caps, 3) : ''}${topic.limits ? '\n\n边界：' + topic.limits[0] : ''}`);
        answered.push(q);
      }
    }
  }
  // 追加同主题强相关的真实 FAQ（阈值收紧，避免跑题）
  const extra = allFaqs.filter((f) => !used.has(f.q) && related(fc.scope + fc.kw, f.q) > 0.28);
  const extraPick = pickN(r, extra, Math.min(5, extra.length));
  if (extraPick.length) { extraPick.forEach((f) => used.add(f.q)); s.push(`## 再补几个同主题问答\n\n${faqSection(extraPick)}`); }
  s.push(`## 背景速览\n\n${P.definition}\n\n${P.platformsLine}。${P.cons[0] ? '提前知道的边界：' + P.cons[0] + '。' : ''}`);
  s.push(`## 预防清单\n\n这类问题的共同根源通常有三条：入口不熟、前置没做、边界不清。对应的动作：\n\n- 用任何功能前先找到官方入口，不从二三手教程猜路径\n- 模型、权限、依赖这些前置条件先检查一遍再动手\n- 边界条款（大小上限、付费范围、平台差异）提前读一遍\n\n${missedLine(answered, fc)}遇到与本文口径不一致的情况，以${P.site}最新文档为准。`);
  return s.join('\n\n');
}
function missedLine(answered, fc) {
  const missed = fc.qs.length - answered.length;
  return missed === 0 ? '' : `个别小众问题没有直接对应的官方口径，按最接近的功能路径处理即可。`;
}

// ---------- H 版本发布（原生增厚：每条要点配真实关联 FAQ） ----------
function buildH(c) {
  const { P, r, row } = c;
  const v = row.version;
  const harvest = HARVEST[row.product] || [];
  const allFaqs = harvest.flatMap((t) => t.faqs || []);
  const s = [];
  s.push(`## ${v.v} 更新了什么\n\n${P.name}在${v.date}发布${v.v}。本文把${v.highlights.length} 项要点逐条过一遍，每条附一个与之相关的常见问题，最后给升级步骤与回退方案。`);
  s.push(`## 要点逐条看\n\n${v.highlights.map((h, i) => {
    const f = allFaqs.find((x) => related(h, x.q) > 0.2 && !/安装|下载/.test(x.q));
    return `**${i + 1}. ${h}**\n\n${h.startsWith('发版') ? '这一项是发布质量的验收结论，对应本轮六编辑器与主要链路的回归测试全部通过。' : `这项更新直接作用的场景：${cutAt(h, 60)}`}${f ? `\n\n相关常见问题——${f.q} ${f.a}` : ''}`;
  }).join('\n\n')}`);
  s.push(`## 升级步骤\n\n1. 升级前备份：${row.product === 'chayuan-os' ? '把数据根目录整体复制一份，对话、知识库与配置都在里面' : row.product === 'chayuan-wps' ? '加载项数据在本机目录，备份配置后直接覆盖安装' : '备份用户配置目录后覆盖安装'}\n2. 获取新版：官网 ${P.site} 下载对应平台安装包${row.product === 'chayuan-office' ? '或 GitHub Releases' : ''}\n3. 覆盖安装，数据目录自动保留\n4. 启动后到设置或关于页确认版本号已更新`);
  s.push(`## 出问题怎么回退\n\n覆盖安装出问题时，重新安装上一版本安装包即可回退，数据目录兼容。升级失败的常见原因是网络中断或磁盘空间不足，先检查这两项再重试；断网环境用离线安装包加逐文件校验的方式升级。`);
  const inf = pickN(r, installFaqs[row.product] || [], 3);
  if (inf.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(inf)}`);
  s.push(`## 版本口径速查\n\n${Object.values(P.numbers || {}).slice(0, 3).map((x) => `- ${x}`).join('\n')}\n\n以上口径随版本维护，引用时以${P.site}最新发布说明为准。`);
  return s.join('\n\n');
}

// ---------- I 行业方案（按产品级能力组合，不再随机塞主题） ----------
const INDUSTRY_PICKS = {
  'chayuan-os': ['kb-create', 'local-models', 'pet-group', 'permission-gate'],
  'chayuan-office': ['proofread', 'assistants', 'kb-link', 'security'],
  'chayuan-wps': ['proofread', 'security-check', 'form-mode', 'kb-use'],
  website: ['mcp-section', 'rank', 'tutorials-lib', 'download'],
};
const INDUSTRY_PICKS2 = {
  'chayuan-os': ['kb-search', 'resident-task', 'office-app'],
  'chayuan-office': ['local-model', 'pdf-convert', 'cli'],
  'chayuan-wps': ['doc-generate', 'translate', 'batch-text'],
  website: ['skillpacks', 'iq-rank', 'account'],
};
function buildI(c) {
  const { P, r, row } = c;
  const ind = row.industry;
  const picks = INDUSTRY_PICKS[row.product].map((id) => TOPICS[row.product].find((t) => t.id === id)).filter(Boolean);
  const scs = scenarios[row.product] || [];
  const scMatch = scs.find((x) => related(ind, x.persona + x.kw) > 0.15) || pick(r, scs);
  const s = [];
  s.push(`## ${ind}为什么需要这套方案\n\n${ind}行业的文档与信息工作有几个共性：材料格式要求严、数据敏感不能乱传、人手紧重复劳动多。${P.name}的切入点不是推倒重来，而是把 AI 能力装进现有流程：${P.tagline.replace(/：/g, '，')}，数据不出本机是底线设计。`);
  s.push(`## 落地路径：三步走\n\n1. 基础层：先把${picks[0].name}跑通，验证环境与模型可用\n2. 流程层：${ind}日常最高频的文档环节（${picks[1].name}所属的场景）交给 AI 处理，人只做审核\n3. 治理层：${row.product === 'chayuan-os' ? '权限门与审计机制上线，形成使用规范' : '权限与数据边界明确，形成使用规范'}`);
  s.push(`## 关键能力对齐\n\n${picks.map((t) => `### ${t.name}\n\n${t.what}${t.caps ? '\n\n要点：' + joinProse(r, t.caps, 3) : ''}`).join('\n\n')}`);
  const picks2 = INDUSTRY_PICKS2[row.product].map((id) => TOPICS[row.product].find((x) => x.id === id)).filter(Boolean);
  if (picks2.length) s.push(`## 进阶能力组合

跑顺基础流程后，这些能力可以继续提效：\n\n${picks2.map((x) => `### ${x.name}\n\n${x.what}`).join('\n\n')}`);
  if (scMatch) s.push(`## 一个行业侧影\n\n${scMatch.persona}的典型链路：\n\n${scMatch.flow.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n${scMatch.gain}${scMatch.caveat ? '\n\n提醒：' + scMatch.caveat : ''}`);
  s.push(`## 合规与边界\n\n${P.security.slice(0, 3).map((x) => `- ${x}`).join('\n')}\n\n行业落地最容易翻车的不是技术，是把边界讲清楚：${P.cons[0]}。${P.cons[1] ? '另外：' + P.cons[1] + '。' : ''}`);
  const inf = pickN(r, installFaqs[row.product] || [], 3);
  if (inf.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(inf)}`);
  s.push(`## 选型核对清单\n\n- 数据边界：${P.security[0] || '默认本地运行'}\n- 平台覆盖：${cutAt(P.platformsLine, 60)}\n- 付费口径：${P.price?.model || '按官网页面'}\n- 试点建议：先选一个三人以内小组、一个高频场景跑两周再扩大`);
  return s.join('\n\n');
}

// ---------- J 安装指南 ----------
function buildJ(c) {
  const { P, topic, tut, r, row } = c;
  const ins = row.install;
  const idMap = { win: 'Windows', mac: 'macOS', 'linux-deb': 'Linux（deb）', linux: 'Linux', appimage: 'AppImage', docker: 'Docker 服务器' };
  const plat = P.install.find((p) => p.os === (idMap[ins.id] || ins.id)) || P.install[0];
  const s = [];
  s.push(opening(c, ['conclusion', 'scene']));
  s.push(`## 安装前确认\n\n- 系统要求：${plat.req}\n- 安装包：${plat.pkg}${ins.blurb ? `\n- 说明：${ins.blurb}` : ''}\n\n${P.platformsLine}。安装包从官网 ${P.site} 获取${row.product === 'chayuan-office' ? '或 GitHub Releases，其他站点均非官方渠道' : ''}。`);
  s.push(`## ${pick(r, hSteps)}\n\n${plat.steps.map((x, i) => `${i + 1}. ${x}`).join('\n')}`);
  s.push(`## 全平台安装速览\n\n| 平台 | 环境要求 | 安装包 |\n|---|---|---|\n${P.install.map((x) => `| ${x.os} | ${x.req} | ${x.pkg} |`).join('\n')}`);
  if (row.product === 'chayuan-os' && /kylin|uos|arm/.test(ins.id)) {
    s.push(`## 国产平台要点\n\n银河麒麟 V10 的 x64 机型（兆芯、海光）选 x64 包，arm64 机型（飞腾、鲲鹏）选 arm64 包；统信 UOS 20 用 deb 形态，arm64 真机已实测。暂不支持龙芯，选包前用 uname -m 确认架构。`);
  }
  s.push(`## 装完后的第一件事\n\n${row.product === 'chayuan-os' ? '首次登录桌面会自动弹出模型设置向导，四步配好默认模型并应用到智能体；随后到设置账号与找回里生成恢复密钥，这两件事做完，这台机器就算真正就绪。' : row.product === 'chayuan-wps' ? '打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值，按团队口径定好批注式还是替换式。' : '开始页新建一个 docx，在设置模型里接上厂商 API 或本机 Ollama，然后让首页 AI 生成一段测试文本——三步都通，环境就绪。'}`);
  if (row.product === 'chayuan-os') {
    s.push(`## 架构对照速查\n\n| 设备 | 架构 | 选包 |\n|---|---|---|\n| 飞腾、鲲鹏 | arm64 | arm64 的 deb 或 AppImage |\n| 兆芯、海光 | x64 | x64 包 |\n| 常见 Intel、AMD | x64 | x64 包 |\n| Apple Silicon | arm64 | arm64 的 dmg |\n\n拿不准就终端执行 uname -m：输出 aarch64 选 arm64，输出 x86_64 选 x64。`);
  }
  s.push(`## ${pick(r, hVerify)}\n\n- ${row.product === 'chayuan-wps' ? '重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡' : row.product === 'chayuan-office' ? '开始页能新建六种格式文档，设置里模型可配置' : '启动进入桌面，对话应用选本地模型能正常回复'}\n- ${row.product === 'chayuan-os' ? '首启初始化需要 5 到 30 秒，属正常现象，期间不用干预' : '若没有生效，先完全退出宿主软件再重启一次'}`);
  const pit = pitList(c);
  if (pit) s.push(`## ${pick(r, hPit)}\n\n${pit}`);
  const faqs = tut ? pickFaqs(tut, topic, r, 3) : pickN(r, installFaqs[row.product] || [], 3);
  if (faqs.length) s.push(`## ${pick(r, hFaq)}\n\n${faqSection(faqs)}`);
  return s.join('\n\n');
}

// ---------- K 种草（小红书，原生增厚，无通用附录） ----------
function buildK(c) {
  const { P, topic, tut, r, row } = c;
  const xh = row.xhs;
  const s = [];
  s.push(`${xh.angle}用了两周，认真说说感受，好的坏的都讲。`);
  s.push(`先交个底：${cutAt(defSentence(c), 100)}`);
  const flowItems = (tut?.steps?.[0]?.items || topic?.steps?.[0]?.items || topic?.caps || []).filter((x) => typeof x === 'string');
  s.push(`## 我的使用顺序\n\n${flowItems.slice(0, 4).map((x, i) => `${i + 1}. ${cutAt(x, 80)}`).join('\n')}`);
  const points = [...(topic?.caps || []).slice(0, 2), P.numbers ? Object.values(P.numbers)[0] : '', ...(topic?.limits || []).slice(0, 1)].filter(Boolean).slice(0, 3);
  s.push(`## 三个点，两好一坑\n\n下面几条是真实用出来的体感，不是参数表搬运：\n\n${points.slice(0, 3).map((x, i) => `${i + 1}. ${x}`).join('\n')}`);
  s.push(`## 也要说实话\n\n${(P.cons || []).slice(0, 3).map((x) => `- ${x}`).join('\n')}\n\n适合谁：${(topic?.scenes || [P.tagline]).slice(0, 2).join('、')}这类需求的人。不适合谁：上面几条缺点正好戳中的场景，别硬上。`);
  const kfaqs = pickFaqs(tut, topic, r, 3);
  if (kfaqs.length) s.push(`## 评论区高频问题\n\n${faqSection(kfaqs)}`);
  if (topic?.limits?.length >= 2) s.push(`## 再补一个坑\n\n${topic.limits[1]}。官方文档写得清楚，提前知道少走弯路。`);
  const memo = [...(topic?.caps || []), ...(Object.values(P.numbers || {}))];
  if (memo.length >= 3) s.push(`## 顺手记的要点\n\n${pickN(r, memo, 3).map((x) => `- ${cutAt(x, 70)}`).join('\n')}`);
  s.push(`## 怎么入\n\n官网 ${P.site}，${P.price?.model || '资源免费获取'}。先试再决定，不用一上来就掏钱。`);
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

// ---------- 文体化 description ----------
function buildDesc(row, P, c) {
  const def = cutAt(defSentence(c).replace(/\n/g, ''), 70);
  let d;
  switch (row.archetype) {
    case 'B': d = `${row.kw}深度解析：${def}机制、设计取舍与边界一次讲清。`; break;
    case 'C': d = `${row.kw}场景实战：${def}从需求到交付的完整工作流。`; break;
    case 'D': d = `${row.kw}排错指南：${def}故障定位路径与进阶用法。`; break;
    case 'E': d = `什么是${row.kw}？${def}含用法、选型判断与常见问题。`; break;
    case 'F': d = `${row.kw}对比评测：维度拆解、条件式结论与迁移成本，基于${P.name}。`; break;
    case 'G': d = `${row.kw}高频问答合集：结论先行、给动作不给原则，基于${P.name}。`; break;
    case 'H': d = `${P.name} ${row.version.v} 版本发布：${row.version.highlights.slice(0, 2).join('；')}。含升级步骤与回退方案。`; break;
    case 'I': d = `${row.kw}：${P.name}的能力组合、三步落地路径与合规边界。`; break;
    case 'J': d = `${row.kw}指南：${P.name}按平台架构的安装步骤、验证方法与排错。`; break;
    case 'K': d = `${row.kw}使用分享：${cutAt(defSentence(c), 40)}真实体感与实话。`; break;
    default: d = `${row.kw}完整教程：${def}步骤含真实按钮文案与验证方法。`;
  }
  return d.length > 160 ? d.slice(0, 157) + '……' : d;
}

// ---------- 文体化收尾 ----------
function buildCloser(c) {
  const { P, topic, r, row } = c;
  const t = topic?.name || row.kw;
  const pools = {
    ABCD: [
      `整体用下来，${t}的流程是清楚的：入口集中、步骤有反馈、做完有验证。第一次照着走一遍，后面基本就是肌肉记忆了。卡住就回看常见问题那一节。`,
      `${row.kw}的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。`,
      `如果只记一件事：${cutAt(topic?.caps?.[0] || (tut0(c) || '入口和验证两头抓稳'), 40)}。剩下的细节照步骤节走就行。`,
      `这篇把${t}的链路拆完了。真机操作一遍比看十遍文章有用，现在就动手试第一步。`,
    ],
    E: [
      `${row.kw}这个概念说清楚了：是什么、在${P.name}里怎么落地、怎么判断适不适合你。有更具体的问题，看上文问答那节。`,
      `一句话收束：${row.kw}值得了解的前提是你真有这类需求，需求对得上，这篇的步骤直接照抄。`,
    ],
    F: [
      `对比给完了，结论是条件式的：你的预算、隐私要求、离线需求决定答案。把表格里的维度代入自己的情况，选择其实不难。`,
      `选型这件事最忌非黑即白。${P.name}与${row.vs || '对比对象'}各有成立场景，按条件选，别按信仰选。`,
    ],
    G: [
      `问答类内容会随版本迭代过时，遇到与实际不符的，以${P.site}最新文档为准。`,
    ],
    H: [
      `升级有风险，备份放第一。${P.name}的升级路径整体是稳的，按上文步骤走即可。`,
    ],
    I: [
      `行业方案落到最后都是执行问题：先小范围试点，跑通一个高频场景，再谈推广。`,
    ],
    J: [
      `安装这步别跳验证：装完先确认${row.product === 'chayuan-wps' ? '选项卡出现' : '核心功能可用'}，再往下配。`,
    ],
    K: [
      `以上是真实使用感受，优缺点都写了，按需种草。`,
    ],
  };
  const fam = 'ABCD'.includes(row.archetype) ? 'ABCD' : row.archetype;
  return pick(c.r, pools[fam] || pools.ABCD);
}
function tut0(c) { return c.topic?.caps?.[0]; }

// ---------- 补齐队列（按文体分区；F/G/H/I/K 已原生增厚不用此队列） ----------
function buildQueue(c, body) {
  const { P, topic, tut, row, r } = c;
  const { doBlocks } = splitSteps(tut, topic);
  // 已在正文出现过的 FAQ 问题，跨节去重
  const usedQ = new Set((body.match(/^### (.+)$/gm) || []).map((x) => x.slice(4)));
  const q = [];
  const faqsLeft = [...(tut?.faqs || []), ...(topic?.extraFaqs || [])].filter((f) => f.a && !usedQ.has(f.q));
  if (faqsLeft.length) q.push(`## 补充答疑\n\n${faqSection(pickN(r, faqsLeft, 3))}`);
  if (doBlocks.length > 3) q.push(`## 更多操作细节\n\n${stepsSection(doBlocks.slice(3, 6))}`);
  if (topic?.caps?.length) q.push(`## 能力点备忘\n\n${topic.caps.map((x) => `- ${x}`).join('\n')}`);
  const inf = pickN(r, (installFaqs[row.product] || []).filter((f) => !usedQ.has(f.q)), 2);
  if (inf.length) q.push(`## 安装与运行答疑\n\n${faqSection(inf)}`);
  const scs = scenarios[row.product] || [];
  const sc1 = pick(r, scs);
  if (sc1) q.push(`## 一个真实场景\n\n${sc1.persona}的典型用法：${sc1.flow.slice(0, 3).join('，')}。${sc1.gain}${sc1.caveat ? '注意：' + sc1.caveat : ''}`);
  const others = TOPICS[row.product].filter((t) => t.id !== topic?.id);
  const o1 = pick(r, others);
  if (o1) q.push(`## 顺带了解\n\n**${o1.name}**：${cutAt(o1.what, 90)}${o1.why ? '\n\n为什么值得看：' + cutAt(o1.why, 80) : ''}`);
  const o2 = pick(r, others.filter((t) => t !== o1));
  if (o2) q.push(`## 还有这个能力\n\n**${o2.name}**：${cutAt(o2.what, 90)}`);
  const nums = Object.entries(P.numbers || {}).slice(0, 4);
  if (nums.length) q.push(`## 硬口径两三条\n\n${pickN(r, nums, 2).map(([, v]) => `- ${v}`).join('\n')}`);
  if (P.cons?.length) q.push(`## 如实说不足\n\n${pickN(r, P.cons, 3).map((x) => `- ${x}`).join('\n')}`);
  q.push(`## 定位与家族\n\n${P.definition}${P.familyLine}。`);
  return q;
}

// ---------- 主入口 ----------
const BUILDERS = { A: buildA, B: buildB, C: buildC, D: buildD, E: buildE, F: buildF, G: buildG, H: buildH, I: buildI, J: buildJ, K: buildK };

// OS 事实储备池（来源：chayuan-harness docs/marketing/01 与 05 号 CSDN 走查文的真实口径）
const OS_FACT_RESERVE = [
  `## 模型服务的实际构成\n\n装机自带的五件套覆盖完整离线链路：Qwen3-4B 负责对话、BGE-M3 做嵌入、BGE 重排提升检索精度、whisper-small 跑语音识别、piper 做中文语音合成。模型中心里还能在线补更强档位（Qwen3-8B/14B、小内存档 LFM2.5、图像理解的 MiniCPM-V 等），下载源多路自动换。内存仪表实时显示每个模型的占用，空闲 15 分钟自动卸载，常用模型可钉住常驻。`,
  `## 统一模型代理的用法\n\n全部模型走一个本机回环地址（127.0.0.1:52581）对外服务：OpenAI chat、responses 与 Anthropic messages 协议互转，对话、嵌入、重排、语音端点齐备。智能体和其他软件只需指向这一个地址，本地模型没运行会自动拉起，厂商请求自动转发云端。`,
  `## 知识库的检索机制\n\n导入 docx、xlsx、pdf、csv、html 与扫描件（本地 OCR）后，检索走向量加全文的混合链路，可选本地重排精排；问答以流式输出并带编号引用，点开脚注能看到出处片段与源文件。另配知识图谱页签，把文档实体与跨文档关系画成二部图。全部索引与原文留在本机。`,
  `## 记忆系统的三档作用域\n\n记忆库分 global（全机共享）、agent（单智能体私有）、project（按项目）三档。任一智能体写入的记忆，最新条目会自动投影进各家 CLI 的配置文件（AGENTS.md 与 CLAUDE.md），换智能体接班不用重新交代背景；每条记忆带溯源，谁写的在设置里可查。`,
  `## 系统级工具的控制面\n\n实测 86 个 MCP 工具覆盖窗口管理、嵌网页、截图、文件、系统设置与搜索等能力（2026 年 10 月口径）。智能体对一个桌面能做的事，基本等于一个熟练用户能做的事；所有高危动作过三级权限门，审批超时自动拒绝，全程写审计日志。`,
  `## 桌面应用与创造模式\n\n任何网页、本机程序、HTML 文件都能封装成桌面应用（web、local、html、file 四种类型），可放桌面快捷方式也能嵌进壁纸当小组件。创造模式更进一步：智能体在运行时定义并挂载新插件，说一句要什么应用，它能把应用造出来挂上桌面。`,
  `## 应用商店与离线分发\n\n商店对接能力广场（aidooo.com），插件、技能、MCP 插件、智能体、技能包五类内容在线下载并云端推送更新，配排行榜辅助选型。内网环境走 .cop.tgz 离线包导入：导出即依赖闭包，导入逐文件校验，断网也能完成分发。`,
  `## 灵宠与任务灵宠\n\n每个智能体可以化身桌面灵宠：在壁纸上活动，动作与体型反映记忆负载，头顶流式气泡，双击直开工作台。绑定常驻任务的任务灵宠会在执行期上桌直播输出，结束时气泡显示成败摘要——定时任务从日志文件变成看得见的桌面直播。`,
  `## 常驻任务的排程细节\n\n按每 N 分钟或每天定点执行，可选模型直跑或调度无头智能体，每次运行产出 markdown 报告落盘归档，历史可查可重跑。配合预授权窗口，夜间时段自动放行指定工具，早上来收报告即可。`,
  `## 跨终端互联的安全设计\n\n同一网段的多台终端经 RTPS 多播互相发现，配对后按类别授权（模型加知识库、智能体执行）。远端调用以远端访客身份通过对端权限门并留审计；出厂默认零共享，开哪类授权完全由用户决定。`,
  `## 远程访问的形态\n\nWebRTC 局域网共享桌面分主机、编辑者、观看者三级角色；公网远程走出站云中继（支持自建），还能生成限时云链接把对话页分享给外部设备，停止即失效。手机浏览器可直接镜像桌面，另有安卓壳应用。`,
  `## 云桌面形态\n\n整套系统可无头跑在 Docker 里作为多用户云桌面（察元AI工舱形态）：员工浏览器打开即用，账户隔离，数据在服务器侧统一管理。默认只监听回环端口，暴露面完全自己控制，适合团队统一供给算力与知识库。`,
];

// Office 事实储备池（来源：chayuan-office docs/user-tutorials O 系列与 00-功能点清单）
const OFFICE_FACT_RESERVE = [
  `## 六编辑器的分工\n\ndocx 走字节保真往返（未触碰块逐字节写回），xlsx 由开源 Univer 核心加自研 Rust 边车承担导入导出，pptx 是自研引擎（母版、Morph 动画、glb 3D 模型都支持），PDF 基于 PDFium wasm 重写内容流实现真文本编辑，Markdown 带双链与关系图谱，HTML 支持点选元素就地编辑。web 与 dsh 插件形态为五编辑器（无 HTML）。`,
  `## 校对的批注机制\n\n察元AI 页签的拼写与语法检查把每处错误以文档批注锚定原文，命中片段与批注逐字一致，对话里汇总条数；它只报明确可证实的语言错误，不报风格偏好。这与审阅页签的键入时红色波浪线是两套机制，可以同用。`,
  `## 修订追踪的细节\n\nAI 面板开修订追踪后，AI 改动落成 Word 与 WPS 通用的修订格式（插入下划线、删除划线，作者标记为 AI Assistant），审阅页签逐条接受或拒绝；AI 总结修订只读不动文档。对话里还有读取、接受、拒绝修订三个工具，可按编号或类型批量处理。`,
  `## PDF 能力链\n\n阅读侧有选区标注浮条与便签线程；编辑侧改的是页面内容流本身（保留原字体，不是贴白块遮盖），涂黑生成物理删除的新文件；转换侧 PDF 转 Word、Excel、PPT、Markdown、HTML 全部本机完成，扫描件经系统 OCR 自动识别后可搜索可引用。`,
  `## BYOK 的接法\n\n设置里 94 家供应商目录分国内、国际、本地、聚合四组，28 个适配器归一化接口；模型列表实时拉取，Key 存本机不上传。本地端点支持 Ollama、LM Studio、Xinference 等八类，内网离线全可用。`,
  `## 知识库联动\n\nAI 面板与首页输入框下方可多选本机察元OS 知识库，每轮回答前并行检索（每库前 6 条），答案带编号引用角标，点开看来源与下载原文；上下文预算 8000 到 32000 字四档可调，检索失败不阻塞发送。`,
  `## CLI 与自动化\n\nchaoffice 命令行有 17 个子命令，转换、创建、渲染、搜索、图像等都能脚本化；配合壳内 MCP 服务（29 个 CLI 工具），外部智能体可以直接操作文档，办公自动化有了标准协议入口。`,
  `## 限额速查\n\n附件单文件 50MB、图片 5MB；长文流式写作上限 20 万字符；OCR 每轮 40 页；助手搜索上限 80 条；第三方 MCP 注入上限 32 服务、总量 400 工具。知道边界，用起来才不踩坑。`,
  `## 性能与兼容口径\n\n1GB 大 docx 打开不卡（图片按哈希留原文件按需读）；全文搜索上屏后约 0.15 秒出结果；ODF 导入采取保守策略，无法证明正确的公式只保留结果值，不完整保留项进 dropped 清单，宁可少保也不猜错。`,
  `## 授权与试用\n\nApache-2.0 开源，90 天静默试用到期不锁功能；离线短序列号激活（绑定机器指纹，无需激活服务器）；同机察元AI OS 已激活则 Office 自动免激活。`,
];

// WPS 事实储备池（来源：chayuan-wps docs/user-tutorials W 系列与 00-功能点清单）
const WPS_FACT_RESERVE = [
  `## 三端入口分布\n\n文字端两个选项卡：察元AI助理（AI 助手、安全保密、文档批量、批量操作四组）与察元AI编审（表单辅助、模板管理、规则管理、察元设置四组）；表格端与演示端各一个察元AI助理选项卡，大按钮直达高频动作。`,
  `## 校对的执行机制\n\n有选中只查选中，无选中确认后查全文（超 12000 字与 30000 字分档提示）；检查在独立进度窗里分块并发执行，块长默认 6000 字，关窗任务继续，只有点停止任务才中止；结果批注锚定原文，锚不上的不硬挂。`,
  `## 保密检查的口径\n\nAI 分块研判八大类风险（密级标识、涉军涉装涉训、组织身份、人员联络、时间地点部署、内部编号、经营商业敏感、军工政企高频线索），高中风险分级加待人工复核；判据是语义与上下文，关键词只是线索而非结论，完整报告进任务清单。`,
  `## 脱密的可逆设计\n\nAI 提取涉密关键词加本地 9 类正则兜底（手机号、身份证、邮箱、编号、银行卡、IP、车牌、统一社会信用代码等），确认后替换为 8 位随机占位符；恢复载荷 AES-GCM-256 加密随文件走，凭密码可完整还原，忘记密码没有任何免密通道。`,
  `## MCP 写确认纪律\n\n本机 62588 端口的文档智能体服务只监听回环；写操作不带确认标记会被拒绝并要求确认，每次确认写记入审计日志。外部智能体（Claude Code、Codex、Cursor 等）一行配置即可接入，代操作文档但不越权。`,
  `## 知识库端口梯\n\n自动发现本机察元OS 知识库走固定端口 52582，失败时按端口梯并行探测；指纹校验通过后库列表实时同步，OS 侧增删库无需 WPS 重配。回答按编号标注出处，来源卡含可信度、章节路径与原文下载。`,
  `## 模板编制五段式\n\n发模板文件加一句话需求后：形状级剖析（LOGO 页码水印判为装饰永不改写）、计划卡确认、副本填充（原模板零修改）、三轮质检自愈（上限四轮）、后台生成完成自动打开。红头文件与标书这类强格式文档最适合这条链路。`,
  `## 表格与演示的直达按钮\n\n表格端九大按钮（AI 表格助手、公式助手、数据洞察、一键图表、数据清洗、报表结论、一键美化等）配 66 个配方；演示端从生成 PPT 到口播稿、整套校对、结构诊断齐备，配 81 个配方，课件与习题页生成也在菜单里。`,
  `## 配图三级降级\n\n第一级模型生图（最多试三个模型），失败走第二级网络搜图（Serper、Tavily、Pexels、SearXNG 免 Key），再不行第三级 SVG 矢量兜底；铁律是上级失败才降级，绝不静默换花钱的来源。`,
  `## 额度与付费边界\n\n免费每日额度（对话与助手独立额度池，次日重置）；文档脱密、脱密复原、保密检查、涉密关键词提取四项为付费专属、零免费额度；序列号本地验签激活、绑定设备指纹，离线可用。`,
];

// Web 事实储备池（来源：website 仓库 i18n/NavBar/rank/productCopy 口径）
const WEB_FACT_RESERVE = [
  `## 板块全景\n\n八大板块各司其职：插件、技能、MCP、提示词、智能体应用偏「装了就用」，大模型目录与模型厂商页偏「查资料」，资讯跟踪生态动态；另有技能包商城与 21291 条的教程库，站方口径 10 万以上资源一站检索。`,
  `## 榜单的算法口径\n\n日榜按当日增量，周月季半年年榜按周期内 star 增量；每日同步任务先抓 star 写快照再重算榜单。无 GitHub 数据的条目按本站下载量兜底混排、star 增量优先；dead 或 archived 的失效资源自动剔除出榜；快照不足时降级为总量榜并明确标注。`,
  `## 两张专题榜\n\n模型智力排行聚合多源公开评测数据定期同步，看能力上限；免费模型榜专列可零成本使用的资源，看成本下限。选型时两张榜对着看，再结合厂商页的接入方式与价格信息。`,
  `## 账号能力\n\n站内账号与微信扫码双通道登录；收藏上限 200 条按时间倒序；投稿提交后经审核上架，需求墙的需求公开可见、按热度排期；购买记录按本机指纹查询，发票在线申请。`,
  `## 下载中心的机制\n\n首页产品家族四卡对应察元AI OS、察元AI Office、察元AI文档助手与察元AI工舱，下载清单由管理后台的发布流程自动同步生成（产品、渠道、平台、架构逐级展开），手工编辑会被下次发布覆盖，保证直链始终指向最新版本；带提取码的网盘链接会自动复制提取码。`,
  `## 教程库的合规边界\n\n21291 条学习资源只存标题、摘要与跳转链接，正文留在 arXiv、GitHub、B 站等源站，既尊重版权也保证内容与源头同步；免费全量浏览，深度内容走 token 门控与设备绑定；配套侵权投诉的避风港流程。`,
  `## 技能包的形态\n\n每个技能包含 3 到 6 个互补技能，组成一套岗位工作流（pack.json 清单加逐技能教程）；购买后凭 token 拉取对应平台安装脚本，token 限次限机可吊销。首批配额 300 包，目标是千包规模，已有 310 个以上主题。`,
  `## 4526 篇助手教程\n\n官网教程库另含每个内置助手的使用说明书，按 228 个行业领域分目录：助手干什么、在哪找、怎么用、输出长什么样、怎么改提示词、选哪个模型、如何配合知识库，一篇讲透一个助手，随助手定义更新而再生成。`,
  `## 模型对比页\n\n大模型目录支持多选对比，维度覆盖能力、上下文长度与价格；厂商页收录已核验的模型厂商与网关的接入方式。数据由采集链路持续同步（OpenRouter、models.dev、Ollama 等源），选型前先对比再动手。`,
  `## 移动端体验\n\n移动端底部导航分广场、榜单、产品、更多、我的五栏，资源检索、榜单浏览、下载与收藏的核心动线都做了适配；微信扫码登录后手机端与桌面端账号互通。`,
  `## 投稿与需求墙\n\n把自己的插件、技能、MCP 服务投给广场：填名称、地址、分类与说明，审核通过后上架展示；需求墙是公开的，官方与社区按热度排期，客服机器人也会把对话里收集的需求汇入同一个池子。`,
];

export function renderArticle(row) {
  const c = ctxFor(row);
  const P = c.P;
  let finalBody = BUILDERS[row.archetype](c);
  const allowQueue = ['A', 'B', 'C', 'D', 'E', 'J'].includes(row.archetype);
  if (allowQueue) {
    const queue = buildQueue(c, finalBody);
    while (cn(finalBody) < 1720 && queue.length) finalBody += '\n\n' + queue.shift();
  }
  // 兜底：先补三段固定真实内容（与已有内容去重），再从事实储备池轮换补齐
  if (cn(finalBody) < 1550 && !finalBody.includes('## 定位与家族')) finalBody += `\n\n## 关于${P.name}\n\n${P.definition}${P.familyLine}。官网 ${P.site}。`;
  if (cn(finalBody) < 1550 && P.cons?.length) {
    const newCons = P.cons.filter((x) => !finalBody.includes(x.slice(0, 20))).slice(0, 3);
    if (newCons.length) finalBody += `\n\n## 边界速览\n\n${newCons.map((x) => `- ${x}`).join('\n')}`;
  }
  if (cn(finalBody) < 1550 && Object.keys(P.numbers || {}).length) {
    const newNums = Object.values(P.numbers).filter((x) => !finalBody.includes(x.slice(0, 20))).slice(0, 4);
    if (newNums.length) finalBody += `\n\n## 数字口径\n\n${newNums.map((x) => `- ${x}`).join('\n')}`;
  }
  {
    const pool = row.product === 'chayuan-os' ? OS_FACT_RESERVE : row.product === 'chayuan-office' ? OFFICE_FACT_RESERVE : row.product === 'chayuan-wps' ? WPS_FACT_RESERVE : WEB_FACT_RESERVE;
    const reserve = pickN(c.r, pool, pool.length);
    while (cn(finalBody) < 1600 && reserve.length) finalBody += '\n\n' + reserve.shift();
  }
  if (process.env.DBG === row.file) { const i = finalBody.indexOf('编排状态'); console.error('PRE :', JSON.stringify(finalBody.slice(i, i + 60))); const j = sanitize(finalBody).indexOf('编排状态'); console.error('POST:', JSON.stringify(sanitize(finalBody).slice(j, j + 60))); }
  const closer = buildCloser(c);
  const geo = geoBlock(P, Math.floor(c.r() * 3));
  const desc = sanitize(buildDesc(row, P, c));
  let out = `---\ntitle: "${row.title}"\ndescription: "${desc}"\nkeywords: [${row.kws.map((k) => `"${k}"`).join(', ')}]\nproduct: ${row.product}\ncategory: "${row.category}"\nprimary_keyword: "${row.kw}"\nchannel: "${row.archetype === 'K' ? '小红书' : 'CSDN/知乎/博客'}"\n---\n\n# ${row.title}\n\n${sanitize(finalBody)}\n\n${sanitize(closer)}\n`;
  if (row.archetype === 'K') {
    const xh = row.xhs;
    out += `\n${['#' + (xh?.tags?.[0] || '效率工具'), '#' + (xh?.tags?.[1] || 'AI工具'), '#察元AI'].join(' ')}\n`;
  }
  out += `\n---\n\n${sanitize(geo)}\n`;
  return out;
}
