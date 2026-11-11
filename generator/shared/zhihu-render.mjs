// zhihu-render.mjs —— 知乎线渲染引擎
// 文风对标 zhuanlan 爆款（观点句小节标题 + 口语判断 + 具体细节 + 诚实边界），反 AI 味、反推广腔
// 事实来源：chayuan-harness/chayuan-office/chayuan-wps 官方教程 md 深挖（旧引擎未用过的段落）+ games 手写文 + website UI 文案
// 语料预算：与 CSDN 线共享 USAGE 池，且预载全库现有文章 → 知乎线只用「剩余额度」的事实，跨线不重复
import { PRODUCTS, geoBlock } from '../facts/products.mjs';
import { rng, pick, pickN } from '../facts/voice.mjs';
import {
  OPENERS, HOOK_LISTS, SECTION_LEADS, COMMENTS, TRANSITIONS, CLOSERS, FOOTERS,
  TITLE_PATTERNS, CONCESSIONS, PIT_FRAMES, NUMBER_LEADS,
} from '../facts/zhihu-voice.mjs';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { budgetCheck, budgetAdmit, sanitize } from './render.mjs';
import { ZHIHU_FACTS } from '../facts/zhihu-facts.mjs';

// 存量句子集合（norm key）：与 CSDN 线零重叠的保障
let EXISTING_NORMS = new Set();
export function setExistingNorms(set) { EXISTING_NORMS = set; }
const GLOBAL_USE = new Map(); // 存量句（CSDN 已用）在知乎线的全局额度：每句 ≤2 篇
function admitUnit(u) {
  const k = normKey(u);
  if (EXISTING_NORMS.has(k)) {
    if ((GLOBAL_USE.get(k) || 0) >= 2) return false;
    GLOBAL_USE.set(k, (GLOBAL_USE.get(k) || 0) + 1);
  }
  return true;
}

const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;
let LOCAL = new Set(); // 当前文章已用单元（归一化 key）
const normKey = (u) => u.replace(/\s+/g, '').replace(/[「」『』（）()：:，,。；;、？！?!\-—*#>|`]/g, '');

// ---------- 深度素材：官方教程 md / games 文 / website UI 文案 → 片段池 ----------
const SRC_DIRS = {
  'chayuan-os': '/Users/zyh/work/chayuan-harness/docs/user-tutorials',
  'chayuan-office': '/Users/zyh/work/chayuan-office/docs/user-tutorials',
  'chayuan-wps': '/Users/zyh/work/chayuan-wps/docs/user-tutorials',
};
const CLEAN_RULES = [
  /!\[[^\]]*\]\([^)]*\)/g,
  /\[([^\]]*)\]\(([^)]*)\)/g,
  /（见\s*[A-Z]\d+(?:[、,]\s*[A-Z]\d+)*）/g,
  /（见教程\s*[A-Z]\d+[^）]*）/g,
  /（详见[^）]*）/g,
  /《[^》]*》\s*[（(]\s*[A-Z]\d{1,2}[^）]*）/g,
  /[（(]\s*[A-Z]\d{1,2}(?:\s*[/、,]\s*[A-Z]\d{1,2})*\s*）/g,
  /→/g, /←/g, /[✓✔✕✗⚠▸►▶]/g,
];
function cleanText(t) {
  let out = t;
  for (const re of CLEAN_RULES) out = out.replace(re, (m, a1) => (typeof a1 === 'string' ? a1 : ''));
  out = out.replace(/\*\*/g, '').replace(/^\s*\*?Q\d+[：:]\s*/gm, '').replace(/\*/g, '');
  return out.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').replace(/[ \t]+/g, ' ').trim();
}
// 脏行过滤：代码/模板/样式/URL 一律不进语料池；含域名推广嫌疑的行剔除
const DIRTY = /(\{\{|\}\}|=>|function\s|const\s|let\s|var\s|return\s|import\s|export\s|require\(|<\/[a-z]|<[a-z]+[ >]|\.\w+\s*\{|--\w+\s*:|^\s*[.#][\w-]+\s*\{|window\.|document\.|useI18n|v-if|v-for|@click|background|margin|padding|font-size|color\s*:|border|display\s*:|grid|flex|nginx|SPA|域名|部署|路径|placeholder|thumbnail)/;
const PROMO = /(aidooo|官网|点击|下载页|立即|限时|扫码|公众号|http|担当|六大?编辑器|Word \.|\bdocx\b)/;
function isDirtyLine(l) {
  const t = l.trim();
  if (!t) return true;
  if (DIRTY.test(t)) return true;
  if (PROMO.test(t)) return true;
  const cjkN = (t.match(/[\u4e00-\u9fa5]/g) || []).length;
  if (cjkN < 6) return true;
  if (/^[-*#>|\d.)\s]+$/.test(t)) return true;
  return false;
}
// 一篇 md → { units: 预算句池, shorts: 短事实池, code: 代码块池, meta: {title} }
function mdToPool(text) {
  const units = [], shorts = [], codes = [];
  text = text.replace(/^---\n[\s\S]*?\n---\n/, ''); // 剥 frontmatter
  text = text.replace(/`([^`]*)`/g, '$1'); // 剥行内反引号（代码路径行多数会被后续过滤淘汰）
  const segs = text.split(/(```[\s\S]*?```)/);
  for (const seg of segs) {
    if (!seg) continue;
    if (seg.startsWith('```')) {
      const first = seg.split('\n')[0].replace(/^```/, '').trim();
      const body = seg.split('\n').slice(1, -1).join('\n');
      if (body.trim().length > 10 && codes.length < 4) codes.push({ lang: first || '', body: body.replace(/\s+$/, '') });
      continue;
    }
    const t = cleanText(seg);
    if (!t) continue;
    for (const line of t.split('\n')) {
      const l = line.trim().replace(/^#{1,6}\s*/, '').replace(/^[-*]\s*/, '').replace(/^\d+[.、)]\s*/, '').replace(/^\|/, '').replace(/\|$/, '').replace(/^\s*>\s*/, '').trim();
      if (!l || l.length < 10) continue;
      if (/^\|[-\s|:]+\|$/.test(l)) continue;
      const clean = l.replace(/\|/g, '；');
      if (isDirtyLine(clean) || /[A-Z_]{5,}/.test(clean) || /\w+\.(js|ts|vue|jsx|json|md|mjs|py)\b/i.test(clean)) continue;
      if (cn(clean) + (clean.match(/[a-zA-Z0-9]/g) || []).length < 10) continue;
      if (clean.length <= 90) { if (!units.includes(clean) && !/^[0-9.:]/.test(clean)) units.push(clean); }
      else for (const sen of clean.split(/(?<=[。！？；])/)) {
        const st = sen.trim();
        if (st.length >= 14 && st.length <= 110 && !units.includes(st) && !/^[0-9.:]/.test(st) && /[\u4e00-\u9fa5]/.test(st)) units.push(st);
      }
      for (const sub of clean.split(/[，、；。：]/)) {
        const st = sub.trim().replace(/^[，。；：\s]+/, '');
        const len = [...st].length;
        if (len >= 6 && len <= 28 && !shorts.includes(st) && /[\u4e00-\u9fa5]/.test(st)) shorts.push(st);
      }
    }
  }
  return { units, shorts, codes };
}
const poolCache = new Map();
function mergePool(base, extra) {
  for (const u of extra.units) if (!base.units.includes(u) && base.units.length < 400) base.units.push(u);
  for (const u of extra.shorts) if (!base.shorts.includes(u) && base.shorts.length < 300) base.shorts.push(u);
  for (const c of extra.codes) if (base.codes.length < 4) base.codes.push(c);
  return base;
}
function sourcePool(product, srcId, srcId2 = '') {
  const key = product + '/' + srcId + '/' + srcId2;
  if (poolCache.has(key)) return poolCache.get(key);
  let pool = { units: [], shorts: [], codes: [] };
  if (SRC_DIRS[product] && srcId) {
    const dir = SRC_DIRS[product];
    if (existsSync(dir)) {
      const all = readdirSync(dir).filter((x) => x.endsWith('.md')).sort();
      const idx = all.findIndex((x) => x.startsWith(srcId + '-'));
      const main = all[idx >= 0 ? idx : 0];
      if (main) pool = mdToPool(readFileSync(`${dir}/${main}`, 'utf8'));
      // （产品级事实改由 ZHIHU_FACTS 提供，此处不再混入 CSDN 线已用的口径句）
    }
  } else if (product === 'chayuan-games' && srcId) {
    const dir = '/Users/zyh/work/chayuan-articles/chayuan-games/02-功能教程';
    const all = readdirSync(dir).filter((x) => x.startsWith('feature-') && x.endsWith('.md')).sort();
    const mainF = `feature-${srcId}.md`;
    const idx = all.indexOf(mainF);
    if (idx >= 0 && existsSync(`${dir}/${mainF}`)) pool = mdToPool(readFileSync(`${dir}/${mainF}`, 'utf8'));
    const sibF = all[(idx + 1 + all.length) % all.length];
    if (sibF && sibF !== mainF && existsSync(`${dir}/${sibF}`)) {
      const sp = mdToPool(readFileSync(`${dir}/${sibF}`, 'utf8'));
      mergePool(pool, { units: sp.units.slice(0, 35), shorts: sp.shorts.slice(0, 20), codes: [] });
    }
  } else if (product === 'website' && srcId) {
    const dir = '/Users/zyh/work/website/src/views';
    if (existsSync(dir)) {
      const f = readdirSync(dir).find((x) => x === srcId);
      if (f) pool = mdToPool(readFileSync(`${dir}/${f}`, 'utf8').replace(/<[^>]+>/g, '\n'));
    }
  }
  // 产品级兜底素材（README/口径表/技术解析通用池）
  if (product === 'chayuan-games') {
    const extra = mdToPool(readFileSync('/Users/zyh/work/chayuan-game/README.zh.md', 'utf8'));
    mergePool(pool, { units: extra.units.slice(0, 30), shorts: extra.shorts.slice(0, 30), codes: [] });
    const llms = mdToPool(readFileSync('/Users/zyh/work/chayuan-game/llms.txt', 'utf8'));
    mergePool(pool, llms);
    const techDir = '/Users/zyh/work/chayuan-articles/chayuan-games/07-技术解析';
    if (existsSync(techDir)) {
      for (const f of readdirSync(techDir).filter((x) => x.endsWith('.md')).slice(0, 5)) {
        const tp = mdToPool(readFileSync(`${techDir}/${f}`, 'utf8'));
        mergePool(pool, { units: tp.units.slice(0, 30), shorts: tp.shorts.slice(0, 20), codes: [] });
      }
    }
    const kwDir2 = '/Users/zyh/work/chayuan-articles/chayuan-games/00-关键词覆盖';
    if (existsSync(kwDir2)) {
      for (const f of readdirSync(kwDir2).filter((x) => x.endsWith('.md')).slice(0, 4)) {
        const kp = mdToPool(readFileSync(`${kwDir2}/${f}`, 'utf8'));
        mergePool(pool, { units: kp.units.slice(0, 25), shorts: kp.shorts.slice(0, 20), codes: [] });
      }
    }
  }
  if (product === 'website') {
    try {
      const webPool = mdToPool(readFileSync('/Users/zyh/work/website/README.md', 'utf8'));
      mergePool(pool, { units: webPool.units.slice(0, 30), shorts: webPool.shorts.slice(0, 30), codes: [] });
    } catch { /* 无 README 跳过 */ }
    const kwDir = '/Users/zyh/work/chayuan-articles/website/00-关键词覆盖';
    if (existsSync(kwDir)) {
      for (const f of readdirSync(kwDir).filter((x) => x.endsWith('.md')).slice(0, 16)) {
        mergePool(pool, mdToPool(readFileSync(`${kwDir}/${f}`, 'utf8')));
      }
    }
    const scDir = '/Users/zyh/work/chayuan-articles/website/03-场景用例';
    if (existsSync(scDir)) {
      for (const f of readdirSync(scDir).filter((x) => x.endsWith('.md')).slice(0, 6)) {
        mergePool(pool, mdToPool(readFileSync(`${scDir}/${f}`, 'utf8')));
      }
    }
  }
  if (srcId2) {
    const dir2 = product === 'website' ? '/Users/zyh/work/website/src/views' : null;
    if (dir2 && existsSync(dir2)) {
      const f2 = readdirSync(dir2).find((x) => x === srcId2);
      if (f2) mergePool(pool, mdToPool(readFileSync(`${dir2}/${f2}`, 'utf8').replace(/<[^>]+>/g, '\n')));
    }
  }
  // 过滤与存量文章重叠的句子（知乎线全新表述）
  if (EXISTING_NORMS.size) {
    pool.units = pool.units.filter((u) => !EXISTING_NORMS.has(normKey(u)));
    pool.shorts = pool.shorts.filter((u) => !EXISTING_NORMS.has(normKey(u)));
  }
  // 追加知乎线专属事实（全新措辞）
  const zf = ZHIHU_FACTS[product];
  if (zf) {
    const zp = mdToPool(zf.join('\n'));
    mergePool(pool, { units: zp.units.slice(0, 16), shorts: zp.shorts.slice(0, 30), codes: [] });
  }
  poolCache.set(key, pool);
  return pool;
}

// 预算内取一条新鲜句（用过的不重复；都耗尽返回 ''）
function freshUnit(pool, r, minLen = 18, maxLen = 110, skipQ = true) {
  const cands = pool.units.filter((u) => {
    const L = [...u.replace(/\s+/g, '')].length;
    if (skipQ && /[？?]$/.test(u.trim())) return false; // 问句留给 askPara
    return L >= minLen && L <= maxLen;
  });
  if (!cands.length) return '';
  const start = Math.floor(r() * cands.length);
  for (let i = 0; i < cands.length; i++) {
    const u = cands[(start + i) % cands.length];
    if (LOCAL.has(normKey(u))) continue; // 归一化判重（标点变体也拦）
    if (!admitUnit(u)) continue; // 存量句全局额度
    if (budgetCheck(u, LOCAL)) { budgetAdmit(u, LOCAL); LOCAL.add(normKey(u)); return u; }
  }
  return '';
}
const SHORT_USE = new Map();
function freshShort(pool, r) {
  if (!pool.shorts.length) return '';
  const start = Math.floor(r() * pool.shorts.length);
  for (let i = 0; i < pool.shorts.length; i++) {
    const u = pool.shorts[(start + i) % pool.shorts.length];
    const key = 'S:' + u;
    if ((SHORT_USE.get(key) || 0) >= 6) continue;
    if (LOCAL.has('S:' + u) || LOCAL.has(u)) continue;
    SHORT_USE.set(key, (SHORT_USE.get(key) || 0) + 1);
    LOCAL.add(key);
    return u;
  }
  return '';
}
// 数字事实句（含具体数字的完整句，知乎文的可信度来源）
function freshNumbered(pool, r) {
  const cands = pool.units.filter((u) => /\d/.test(u) && [...u.replace(/\s+/g, '')].length >= 18 && [...u.replace(/\s+/g, '')].length <= 90);
  if (!cands.length) return '';
  const start = Math.floor(r() * cands.length);
  for (let i = 0; i < cands.length; i++) {
    const u = cands[(start + i) % cands.length];
    if (budgetCheck(u, LOCAL)) { budgetAdmit(u, LOCAL); return u; }
  }
  return '';
}

// ---------- 组句单元 ----------
function ensureEnd(s) { return /[。！？？」]$/.test(s.trim()) ? s : s + '。'; }
let LOCAL_COMMENTS = new Set();
function pickComment(r) {
  const start = Math.floor(r() * COMMENTS.length);
  for (let i = 0; i < COMMENTS.length; i++) {
    const cm = COMMENTS[(start + i) % COMMENTS.length];
    if (!LOCAL_COMMENTS.has(cm)) { LOCAL_COMMENTS.add(cm); return cm; }
  }
  return '';
}
function factPara(pool, r, kind, count = 1) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const frag = i === 0 && kind === 'number' ? freshNumbered(pool, r) : freshUnit(pool, r);
    if (!frag) continue;
    const lead = i === 0 ? pick(r, SECTION_LEADS[kind] || SECTION_LEADS.doc) : '';
    const comment = r() < 0.55 ? ' ' + pickComment(r) : '';
    out.push(`${lead}${ensureEnd(frag)}${comment}`);
  }
  if (!out.length) {
    const sh = freshShort(pool, r);
    if (sh) out.push(`${pick(r, SECTION_LEADS[kind] || SECTION_LEADS.doc)}细节在${sh}这层，文档里有对应说明。${pickComment(r) || ''}`);
  }
  return out.join('\n\n');
}
// 叙述段（2-3 句：引入 + 事实 + 评语），知乎文的主体形态
function narrPara(pool, r, row, kind, opts = {}) {
  const parts = [];
  if (opts.lead) parts.push(opts.lead);
  // 段长随机三档（反 AI 味：段落节奏错落）
  // 段长随机四档（反 AI 味：段落节奏大错落）
  const mode = r();
  const wantTwo = mode > 0.12, wantAll = mode > 0.4, wantFour = mode > 0.6;
  if (wantFour && r() < 0.7) {
    const ln = pick(r, LONG_NARRS).replaceAll('{kw}', row.kw);
    if (LOCAL.has(normKey(ln))) return '';
    budgetAdmit(ln, LOCAL); LOCAL.add(normKey(ln));
    return ln;
  }
  if (wantFour && r() < 0.6) {
    const so = pick(r, SHORT_OBS);
    return so; // 短观察段（<40 字，节奏隔断）
  }
  let frag = opts.number ? freshNumbered(pool, r) : freshUnit(pool, r);
  if (!frag) frag = freshNumbered(pool, r);
  if (frag) parts.push(ensureEnd(frag));
  let frag2 = wantTwo ? freshUnit(pool, r) : '';
  if (!frag2) {
    const sh2 = freshShort(pool, r);
    if (sh2) frag2 = `具体到操作面，${sh2}这条在手册里写得很细`;
  }
  if (frag2) parts.push(ensureEnd(frag2));
  const frag3 = wantAll ? freshUnit(pool, r) : '';
  if (frag3) parts.push(ensureEnd(frag3));
  if (parts.length <= (opts.lead ? (wantAll ? 3 : 2) : 1)) {
    if (r() < 0.35) parts.push(pick(r, SHORT_OBS));
    const sh = freshShort(pool, r);
    parts.push(sh ? `这层的细节落在${sh}上，手册里有对应条目。` : pick(r, PURE_VIEWS));
  }
  if (r() < 0.65) { const cm = pickComment(r); if (cm) parts.push(cm); }
  return parts.join('');
}
// 长叙述模板段（120-180 字，{kw} 槽位；打破段落长度趋同的 AI 味）
const LONG_NARRS = [
  '把{kw}放进真实使用场景里看，判断会变得非常具体：你每周有多少时间花在这类事情上、现在的做法卡在哪一步、换一种方式要重新学多少东西。这三个数字摆在一起，值不值得几乎不用讨论。多数人纠结工具好坏，其实是这三个数字没算清，情绪替理性做了决定。',
  '它真正值得说的不是功能列表，而是面对麻烦情况时的处理方式。用{kw}的人迟早会遇到这一刻：功能谁都会堆，难的是出问题那一刻的表现：是悄悄降级让你无感，还是直接报错让你干等，或者干脆丢数据。这三种选择的差距，用一次就知道，而这一次的经验比十篇导购文都可靠。',
  '从更实际的角度看，{kw}这类工具的成本从来不在价格上，而在你的注意力上。学会它的关键是能否嵌进你已有的习惯里，而不是要你为它重建一套流程。凡是需要重建流程的工具，留存率都很低，不是因为不好用，而是因为改变习惯这件事本身反人性。',
  '还有一个判断角度常被忽略：看{kw}失败的时候是什么样子。顺的时候大家都差不多，差别全在出问题的那一刻，报错信息是否说人话、能不能原地重试、数据会不会丢。这些细节官方文档很少写，但恰恰是它们决定你用一个月之后还愿不愿意继续用。',
  '很多人关心{kw}和同类产品的区别。我的看法是：同一档价位里，功能重合度通常超过七成，真正拉开差距的是那些不出现在参数表上的东西，比如响应速度的稳定性、边界情况的兜底、更新日志的诚意。这些东西要长期用才能感觉到，但一旦感觉到，就很难回去了。',
  '回到{kw}的实际使用，我的建议是分两步走。第一步只跑主链路，把最核心的那件事从头到尾做通，不做任何定制；第二步才是按自己的习惯调配置。顺序反过来的人，大多数卡在半路就放弃了，然后得出一个「不好用」的结论，其实是学习路径错了。',
  '关于{kw}的适用边界，有一个简单的自测方法：把你要解决的问题写成一句话，越短越好。如果写出来发现要三个从句才能说清，说明需求还没收敛，这时候上任何工具都是浪费。先收敛需求，再挑工具，顺序不能反。',
  '另外值得一提的细节是{kw}的默认值设计。默认值好不好，直接决定第一次上手的心情：默认值激进，新手容易翻车；默认值保守，老手嫌啰嗦。能在两拨人之间找到平衡点的产品不多，这也算一个可以观察的细节，判断团队的用心程度。',
  '最后补充一个视角：把{kw}放在更长的时间尺度上看。一周的新鲜感谁都有，一个月后的留存才说明问题，而判断留存的一个土办法是看你遇到问题时第一反应是去翻它的文档还是去问别的工具。第一反应是前者，说明它已经进了你的工作流；后者，说明它还只是个尝试。这个判断不需要任何评测数据，自己就能做，而且基本不会错。',
  '还有一层是生态视角。单独看{kw}是好是坏意义有限，关键是它周围有没有一圈东西在生长：文档是不是在更新、社区是不是在讨论、配套工具是不是在出现。有生长迹象的产品，小毛病会被时间修掉；没有的，再精致也会慢慢荒掉。这也是我愿意给这一类产品一些耐心的原因，赌的不是当下，是趋势。',
];
const SHORT_OBS = [
  '说到底，工具是拿来用的，不是拿来评测的。',
  '这一层值得单独点名，做得确实讲究。',
  '顺带一句，别被参数表带偏了判断。',
  '这个细节小，但耐看。',
];
if (false) {}
// 纯观点句池（事实耗尽时的兜底；短句不占预算，句式多样）
const PURE_VIEWS = [
  '这一层没有捷径，照文档走一遍比看任何转述都快。',
  '它不是那种需要反复调教的东西，配好之后基本不用再碰。',
  '我的感受是：把它当工具别当玩具，预期放对，体验就是顺的。',
  '多数人不缺功能，缺的是把一件事从头到尾跑通的耐心。',
  '这里的取舍能看出做产品的态度：宁可少说，不说满话。',
  '如果你只打算花十分钟，花在这层最值。',
  '到这里其实已经能做判断了，剩下的都是细节。',
  '细节多不代表难用，反而说明边界都想过了。',
  '这步做完，后面的事情基本是水到渠成。',
  '我没在这里看到任何需要碰运气的环节。',
];
// 自问自答段（知乎体自然形态：从池里的真问句取材）
function askPara(pool, r) {
  const qs = pool.units.filter((u) => /[？?]$/.test(u.trim()) && [...u.replace(/\s+/g, '')].length >= 10 && [...u.replace(/\s+/g, '')].length <= 40);
  let q = '';
  if (qs.length) {
    const start = Math.floor(r() * qs.length);
    for (let i = 0; i < qs.length; i++) {
      const cand = qs[(start + i) % qs.length];
      if (LOCAL.has(normKey(cand))) continue;
      if (!admitUnit(cand)) continue;
      if (budgetCheck(cand, LOCAL)) { budgetAdmit(cand, LOCAL); LOCAL.add(normKey(cand)); q = cand; break; }
    }
  }
  if (!q) return '';
  const a = freshUnit(pool, r) || freshShort(pool, r);
  const lead = pick(r, ['这个问题后台问得不少：', '评论区肯定有人想问：', '一个绕不开的问题：', '顺带回答一个高频问题：']);
  return a ? `${lead}${q} ${ensureEnd(a)}` : `${lead}${q}`;
}
// 小节标题：固定朴素池轮换（事实内容随机，标题不锚事实，避免语义错位）
const SECTION_TITLES = {
  stance: ['先看它的定位', '它做对的那件事', '代价与边界', '和同类工具的分野', '一处被低估的设计', '上手路径', '费用这笔账', '争议与共识'],
  pit: ['第一个坑：预期错位', '第二个坑：路径依赖', '第三个坑：费用与额度', '装完才懂的前提', '文档没强调的一步', '别在这省时间', '隐性成本'],
  deep: ['它面对的真问题', '链路第一层：入口收敛', '链路第二层：执行与反馈', '链路第三层：兜底与回退', '为什么这样设计', '一个反直觉的细节', '工程上的取舍'],
  decide: ['维度一：解决你的问题吗', '维度二：成本你付得起吗', '维度三：退出成本高不高', '一个容易忽略的维度：数据归属', '隐性成本这笔账', '切换的代价'],
};
function sectionTitle(c, r, styleIdx, vi = 0) {
  const poolT = SECTION_TITLES[c.row.style];
  return poolT[(styleIdx * 2 + vi) % poolT.length];
}

// ---------- 四种文型 ----------
function buildStance(c) {
  const { P, pool, r, row } = c;
  const s = [];
  const answer = c.answerShort;
  s.push(pick(r, OPENERS.stance).replaceAll('{answer}', answer).replaceAll('{kw}', row.kw));
  // 背景两段：问题来源 + 现状
  s.push(`先把背景交代清楚。${narrPara(pool, r, row, 'practice', { lead: '这个问题的来源很实际。' })}`);
  s.push(narrPara(pool, r, row, 'doc', { lead: '要判断它，得先知道它的底细：' }));
  s.push(narrPara(pool, r, row, 'surprise', { lead: '有一个观感上的误区要先拆掉：' }));
  // 论点 1-3：小节，每节 3 段
  for (let i = 0; i < 3; i++) {
    s.push(`### ${sectionTitle(c, r, 0, i)}\n\n${narrPara(pool, r, row, i === 0 ? 'doc' : i === 1 ? 'detail' : 'number')}`);
    s.push(narrPara(pool, r, row, i === 1 ? 'why' : 'practice'));
    s.push(narrPara(pool, r, row, 'detail'));
    if (r() < 0.6) s.push(askPara(pool, r));
  }
  // 让步段
  s.push(`${pick(r, CONCESSIONS)}${narrPara(pool, r, row, 'pit', { lead: '' })}`);
  s.push(narrPara(pool, r, row, 'detail'));
  const lim = freshUnit(pool, r, 12, 70) || freshShort(pool, r);
  const limMd = `它的边界也得摆出来。${lim ? ensureEnd(lim) : '具体限制以官方手册为准。'}${pickComment(r) || ''}`;
  if (budgetCheck(limMd, LOCAL)) { budgetAdmit(limMd, LOCAL); s.push(limMd); }
  else s.push(`它的边界也得摆出来：${row.kw}的限制条件以官方手册为准，动手前先核一遍自己的环境。`);
  s.push(narrPara(pool, r, row, 'number', { lead: '费用与版本这笔账也要算：' }));
  s.push(narrPara(pool, r, row, 'practice', { lead: '最后给一个折中做法：' }));
  s.push(pick(r, CLOSERS.stance));
  return s;
}

function buildPit(c) {
  const { P, pool, r, row } = c;
  const s = [];
  s.push(pick(r, OPENERS.pit).replaceAll('{kw}', row.kw));
  s.push(narrPara(pool, r, row, 'practice', { lead: '先把预期摆正：' }));
  // 三个坑：现象→原因→绕法，每坑两段
  for (let i = 0; i < 3; i++) {
    const sym = freshUnit(pool, r, 14, 80);
    s.push(`### ${sectionTitle(c, r, 1, i)}\n\n${sym ? `${pick(r, PIT_FRAMES.symptom)}${ensureEnd(sym)}` : narrPara(pool, r, row, 'pit')}`);
    s.push(narrPara(pool, r, row, 'doc'));
    s.push(narrPara(pool, r, row, 'detail'));
    const cause = freshUnit(pool, r, 12, 70);
    if (cause) s.push(`${pick(r, PIT_FRAMES.cause)}${ensureEnd(cause)}${r() < 0.5 ? ' ' + pickComment(r) : ''}`);
    const work = freshUnit(pool, r, 10, 70);
    if (work) s.push(`${pick(r, PIT_FRAMES.work)}${ensureEnd(work)}`);
    else s.push(`绕法很朴素：照手册的对应条目走一遍，别自己发明流程。${pickComment(r) || ''}`);
    if (r() < 0.4) s.push(askPara(pool, r));
  }
  // 什么人该用
  s.push(`### 什么人该用，什么人别碰\n\n${narrPara(pool, r, row, 'why', { lead: '说了这么多坑，也得给结论：' })}`);
  s.push(narrPara(pool, r, row, 'practice'));
  s.push(narrPara(pool, r, row, 'number', { lead: '最后的账再算一遍：' }));
  s.push(pick(r, CLOSERS.pit));
  return s;
}

function buildDeep(c) {
  const { P, pool, r, row } = c;
  const s = [];
  s.push(pick(r, OPENERS.deep).replaceAll('{scene}', c.scene || '日常使用').replaceAll('{goal}', c.goal || row.kw).replaceAll('{kw}', row.kw));
  s.push(narrPara(pool, r, row, 'doc', { lead: '从哪说起呢，先看它面对的问题。' }));
  if (r() < 0.6) {
    const hooks = pick(r, HOOK_LISTS).map((h) => '- ' + h.replaceAll('{loc}', c.loc || '文档里').replaceAll('{core}', c.core || '数据不出本机'));
    s.push(hooks.join('\n'));
  }
  // 机制 3 节，每节 2-3 段
  const secs = 3;
  for (let i = 0; i < secs; i++) {
    s.push(`### ${sectionTitle(c, r, 2, i)}\n\n${narrPara(pool, r, row, i === 0 ? 'doc' : i === 1 ? 'detail' : 'why', { lead: i === 0 ? '一层一层看：' : '' })}`);
    s.push(narrPara(pool, r, row, i === 1 ? 'number' : 'surprise', {}));
    s.push(narrPara(pool, r, row, 'practice'));
    if (r() < 0.5) s.push(askPara(pool, r));
  }
  // 设计取舍段
  s.push(`### 这套设计的代价\n\n${narrPara(pool, r, row, 'pit', { lead: '没有只有好处的设计。' })}`);
  // 代码块
  const code = pool.codes.length && r() < 0.5 ? pick(r, pool.codes) : null;
  if (code && code.body.split('\n').length <= 18) {
    s.push(`手册里给的操作可以直接抄：\n\n\`\`\`${code.lang || 'bash'}\n${code.body}\n\`\`\``);
  }
  // 适合谁
  s.push(`### 它不是给所有人的\n\n${narrPara(pool, r, row, 'practice', { lead: '老规矩，说清楚适用面：' })}`);
  s.push(narrPara(pool, r, row, 'why'));
  s.push(narrPara(pool, r, row, 'number', { lead: '版本与成本的提醒放在结尾：' }));
  s.push(pick(r, CLOSERS.deep));
  return s;
}

function buildDecide(c) {
  const { P, pool, r, row } = c;
  const s = [];
  s.push(pick(r, OPENERS.decide).replaceAll('{answer}', c.answerShort).replaceAll('{goal}', c.goal || row.kw).replaceAll('{kw}', row.kw));
  s.push(narrPara(pool, r, row, 'practice', { lead: '开始之前，先把你自己的情况想清楚，下面每一条都要对着填。' }));
  s.push(narrPara(pool, r, row, 'doc', { lead: '先把要判断的对象交代清楚。' }));
  // 三个判断维度，每维度三段
  for (let i = 0; i < 3; i++) {
    s.push(`### ${sectionTitle(c, r, 3, i)}\n\n${narrPara(pool, r, row, i === 1 ? 'number' : i === 0 ? 'doc' : 'practice')}`);
    s.push(narrPara(pool, r, row, i === 2 ? 'why' : 'detail'));
    s.push(narrPara(pool, r, row, 'surprise'));
    if (r() < 0.5) s.push(askPara(pool, r));
  }
  // 我的倾向
  const leanAlts = [
    `### 我的倾向，以及它的前提\n\n${row.kw}的偏好放在台面上：如果我坐在你的位置，先问它是否解决一个你每周都会遇到的具体问题，再看费用与退出成本。这两关都过了，才值得往下配。理由不新鲜，但管用：高频刚需才养得起学习成本。`,
    `### 我的倾向，以及它的前提\n\n把${row.kw}的倾向摆在台面上：我更看重它能不能进你的日常动线，而不是功能列表有多长。能进动线，学习成本摊到每一天就薄；进不了，再强也是摆设。${pickComment(r) || ''}`,
    `### 我的倾向，以及它的前提\n\n关于${row.kw}我的倾向很直接：先小范围试两周，把它塞进一个真实的高频场景里跑。跑得动就留，跑不动就卸，比任何评测都准。${pickComment(r) || ''}`,
  ];
  s.push(pick(r, leanAlts));
  const lim = freshUnit(pool, r, 12, 70);
  if (lim) s.push(`${row.kw}的前提要念清楚：${ensureEnd(lim)}前提变了，倾向跟着变。`);
  s.push(narrPara(pool, r, row, 'practice'));
  s.push(narrPara(pool, r, row, 'number', { lead: '动手前的最后一遍核对：' }));
  s.push(pick(r, CLOSERS.decide));
  return s;
}

const BUILDERS = { stance: buildStance, pit: buildPit, deep: buildDeep, decide: buildDecide };

// ---------- 主入口 ----------
export function renderZhihuArticle(row, ctxExtra = {}) {
  const P = PRODUCTS[row.product];
  LOCAL = new Set();
  LOCAL_COMMENTS = new Set();
  const r = rng('zhihu/' + row.file);
  const pool = sourcePool(row.product, row.srcId, row.srcId2 || '');
  const c = {
    P, pool, r, row,
    kw: row.kw,
    answerShort: ensureEnd(ctxExtra.answer || row.answer || `${row.kw}是认真做的东西，但只对合适的人认真`),
    scene: ctxExtra.scene || row.scene, goal: ctxExtra.goal || row.goal,
    loc: ctxExtra.loc || '文档里', core: ctxExtra.core || row.core,
  };
  const sections = BUILDERS[row.style](c);
  // 破折号治理（AI 味指标之一）：正文内替换多余 —— 为逗号结构
  let body = sections.filter(Boolean).join('\n\n');
  const dashTrim = () => { let n = (body.match(/——/g) || []).length; while (n > 3) { body = body.replace(/——/, '，'); n--; } };
  // topUp：不足 1520 字时补细节清单段（shorts 组装，不占主预算）
  let ti = 0;
  while (cn(body) < 1520 && ti < 5) {
    const picks = [];
    for (let k = 0; k < 4; k++) {
      const sh = freshShort(pool, r);
      if (sh && !picks.includes(sh)) picks.push(sh);
    }
    if (picks.length < 2) break;
    const lead = pick(r, ['顺手记几条细节，省得你翻文档。', '几个容易忽略的点，一并放在这里。', '补充几条边角信息。', '动手前把这几条过一眼。']);
    const list = picks.map((x, i2) => `${ensureEnd(x)}${i2 < picks.length - 1 ? '另外，' : ''}`).join('');
    const sec = `### ${pick(r, ['补充细节清单', '边角信息', '动手前速览', '顺带的几条'])}\n\n${lead}${list}`;
    if (budgetCheck(sec, LOCAL)) { budgetAdmit(sec, LOCAL); body += '\n\n' + sec; }
    else break;
    ti++;
  }
  // topUp 阶段 2：含主题词的扩写段（渲染后 norm 唯一，无供给上限）
  const PAD_PARAS = [
    `把${'{t}'}放进日常里检验，最好的办法是挑一个下周肯定要做的活儿，全程用它跑一遍。跑顺了留，跑不顺卸，两三天就有结论，比看任何评测都可靠。`,
    `${'{t}'}和你现有工具的关系不是替代，是拼接。先找到那个最顺的接缝——通常是某个高频的小环节——把接缝跑通了，再决定要不要扩大使用面。`,
    `还有一层值得交代：${'{t}'}的学习成本主要在前两天。头两天别赶进度，照文档把关键路径走一遍，之后基本不需要再回来查。`,
    `判断${'{t}'}值不值，还有一个反向指标：如果你说不出它能替掉哪一步人工，多半是需求没对上，这时候别硬装，先放着。`,
    `${'{t}'}这类工具的常见误区是一上来就求全。先把一条主链路跑熟，边角功能用到再学，顺序反过来只会把自己劝退。`,
    `最后提一下节奏问题。${'{t}'}适合先窄后宽：范围收得越窄，反馈越快，判断越准。铺开之前先让一条最小链路稳定跑上一周。`,
    `有用户担心${'{t}'}的维护成本。从设计看，它把状态都收在明面上，出问题时定位路径短，日常维护量不大。`,
    `如果团队里多人共用${'{t}'}，建议第一周就约定好基线：哪些默认值不动、谁负责改配置。这些约定比工具本身更影响体验。`,
    `${'{t}'}的边界还有一个用法上的讲究：把它当专职工具用，别当万能工具用。专才专用的收益，在这类产品上特别明显。`,
    `回到最初的那个问题——${'{t}'}值不值得花时间。答案取决于你有没有一个具体的场景等着它；有，这篇的路径可以直接照走；没有，先收藏，等场景出现再说。`,
    `还有一点经验之谈：${'{t}'}相关的设置不要一次改太多。每改一处，跑一遍主流程确认没坏，再改下一处。出问题时你能立刻知道是哪一步引入的，这种排障效率比任何技巧都值钱。`,
    `如果把${'{t}'}介绍给同事，别发文档链接，当面演示一遍最短路径。工具的口碑一半在功能，一半在第一印象，而第一印象取决于你带别人走的那条路。`,
    `${'{t}'}的文档值得通读一遍，不是客气话。很多设计意图只写在文档的角落里，看懂了这些意图，你就能预判它在哪些场景下会有什么表现，遇到异常也不慌。`,
    `顺手提醒一句：${'{t}'}这类工具的版本节奏比较快，隔几个月回来看一眼更新日志，经常能发现已经把你之前的痛点解决了。保持关注比一次性研究透更划算。`,
    `如果拿不准${'{t}'}适不适合团队，先让最挑剔的那个同事试用。他过关了，其他人基本没有障碍；反过来推则大概率流产。这个小技巧省下的沟通成本，比任何选型会议都多。`,
    `${'{t}'}处理边界情况的思路值得留意：先保证不丢数据，再保证能回退，最后才是自动化。这三层顺序在它的多处设计里反复出现，看懂了这个优先级，很多行为就变得可以理解了。`,
    `有人在意的另一个问题是迁移成本。${'{t}'}的数据和配置都收在明确的目录里，换机器就是拷目录的事，这也是我愿意长期投入的原因之一：数据是我的，不是它的。`,
    `再补一个冷知识：${'{t}'}的很多快捷操作藏在右键菜单和长按里，界面上不显眼。把这些隐藏入口翻一遍，日常效率至少提升一个档次，而且不需要学任何新东西。`,
    `关于${'{t}'}的稳定表现，我的观察是它在高负载下的退化是渐进的，而不是突然崩掉。这意味着你能提前感知到压力并做取舍，对长期挂着跑的场景很友好。`,
    `最后一个观察：${'{t}'}对错误信息的态度。它不把报错当丢人的事藏起来，而是尽量把上下文给全，让你能自己判断下一步。这种坦诚在工具里是稀缺品质，也是信任感的来源。`,
    `如果你已经读到这里的犹豫点，那大概率是预算问题。${'{t}'}的免费部分能跑通主链路，付费项是锦上添花，按需决策就好，别被任何人的「必买」话术带着走。`,
    `写到这里可以收了。${'{t}'}不是那种改变命运的工具，但把它放在合适的环节里，每天能省几分钟到几十分钟，一年下来是一笔可观的时间账。工具的价值就是这么朴素。`,
    `最后的最后的最后，把判断权还给你：${'{t}'}这篇给的是事实、机制和边界，结论应该由你的场景来做。如果哪一条和你的实际体验对不上，以你的体验为准，工具是用来服务的，不是用来信仰的。`,
  ];
  let pi = 0;
  while (cn(body) < 1560 && pi < 6) {
    const para = PAD_PARAS[(row.n + pi) % PAD_PARAS.length].replaceAll('{t}', row.kw.startsWith(P.short) ? row.kw.slice(P.short.length) : row.kw);
    if (!body.includes(para)) body += '\n\n' + para;
    pi++;
  }
  body = body.replaceAll('{t}', row.kw.startsWith(P.short) ? row.kw.slice(P.short.length) : row.kw).replaceAll('{kw}', row.kw).replaceAll('{scene}', c.scene || '').replaceAll('{goal}', c.goal || '').replaceAll('{loc}', c.loc || '文档里').replaceAll('{core}', c.core || '').replaceAll('{answer}', row.answer || '');
  // 品牌密度治理：≥26 次时后半段改用主题短词
  body = body.replace(/关注我|点赞收藏|一键三连|加群|私信我/g, '');
  const brandN = (body.match(/察元/g) || []).length;
  if (brandN >= 26) {
    const themeShort0 = row.kw.startsWith(P.short) ? row.kw.slice(P.short.length) : row.kw;
    const head = body.indexOf('\n\n##', 400);
    const cutAt2 = head > 0 ? head : Math.floor(body.length * 0.35);
    let tail = body.slice(cutAt2).split(row.kw).join(themeShort0);
    const brandFull = [P.name, P.short].filter((x) => x && x !== row.kw);
    for (const bf of brandFull) {
      const bn = (tail.match(new RegExp(bf, 'g')) || []).length;
      if (bn > 3) tail = tail.split(bf).join(themeShort0);
    }
    body = body.slice(0, cutAt2) + tail;
  }
  dashTrim();
  // 破窗：段落均匀命中时注入长叙述段
  {
    const parasLens = () => body.split('\n\n').map((p2) => cn(p2)).filter((n) => n >= 40);
    for (let attempt = 0; attempt < 6; attempt++) {
      const ps = parasLens();
      if (ps.length < 9) break;
      let hit = false;
      for (let i2 = 0; i2 < ps.length - 7; i2++) {
        const win = ps.slice(i2, i2 + 8);
        const mean = win.reduce((x2, y2) => x2 + y2, 0) / 8;
        if (win.every((n) => Math.abs(n - mean) <= mean * 0.12)) { hit = true; break; }
      }
      if (!hit) break;
      const ln = pick(r, LONG_NARRS).replaceAll('{kw}', row.kw);
      if (!budgetCheck(ln, LOCAL)) break;
      budgetAdmit(ln, LOCAL);
      // 插到命中窗口的中间段后（追加尾部无法破窗）
      const blocks = body.split('\n\n');
      let hitIdx = -1;
      const psAll = [];
      for (let i2 = 0; i2 < blocks.length; i2++) psAll.push({ len: cn(blocks[i2]), idx: i2 });
      const q = psAll.filter((x) => x.len >= 40);
      for (let i2 = 0; i2 < q.length - 7; i2++) {
        const win = q.slice(i2, i2 + 8);
        const mean = win.reduce((x2, y2) => x2 + y2.len, 0) / 8;
        if (win.every((x) => Math.abs(x.len - mean) <= mean * 0.12)) { hitIdx = win[4].idx; break; }
      }
      if (hitIdx < 0) break;
      const ln2 = attempt > 0 ? pick(r, LONG_NARRS) : ln;
      blocks.splice(hitIdx + 1, 0, ln2);
      body = blocks.join('\n\n');
    }
  }
  // 尾注（≤1 次域名）
  const date = P.versionDate || '2026 年 10 月';
  const pver = P.version ? P.version : '当前版本';
  const footer = pick(r, FOOTERS).replaceAll('{date}', date).replaceAll('{pname}', P.name).replaceAll('{pver}', pver);
  const desc = buildDesc(row, c);
  return `---\ntitle: "${sanitize(row.title)}"\ndescription: "${sanitize(desc)}"\nkeywords: [${row.kws.map((k) => `"${k}"`).join(', ')}]\nproduct: ${row.product}\ncategory: "${row.category}"\nprimary_keyword: "${row.kw}"\nchannel: "知乎"\n---\n\n# ${sanitize(row.title)}\n\n${sanitize(body)}\n\n---\n\n${sanitize(footer)}\n`;
}

function buildDesc(row, c) {
  const hooks = {
    stance: `结论先行：${cut(c.answerShort, 46)}`,
    pit: `先泼冷水再讲绕法：${row.kw}的坑、原因与对策，装前看能省一晚上`,
    deep: `不谈好不好用，只拆机制：${cut(c.goal || row.kw, 30)}是怎么做实的`,
    decide: `不给答案给框架：${row.kw}的三条判断维度与条件式倾向`,
  };
  const d = `${row.kw}：${hooks[row.style]}。基于官方文档与实际使用整理，含边界说明。`;
  return d.length > 160 ? d.slice(0, 157) + '……' : d;
}
function cut(s, n) { return [...String(s)].length > n ? [...String(s)].slice(0, n).join('') + '…' : s; }
