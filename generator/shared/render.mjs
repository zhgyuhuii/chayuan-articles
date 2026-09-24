// 渲染引擎：确定性随机、字数统计、禁词校验、文章组装
import crypto from 'node:crypto';

export function hashStr(s) {
  return crypto.createHash('sha1').update(s).digest('hex');
}
export function rng(seedStr) {
  let h = 0;
  for (const c of String(seedStr)) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }
  let a = h || 1;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];
export function pickN(r, arr, n) {
  const pool = [...arr]; const out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return out;
}
export const cjkCount = (t) => (String(t).match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
export const noDot = (s) => String(s).replace(/[。．;；\s]+$/, '');
export const fmtList = (arr) => arr.map((x) => String(x).replace(/^[-•]\s*/, '').trim()).filter(Boolean);

// 广告法极限词与虚假宣称黑名单（含项目自身口径红线）
export const BANNED = ['世界首个', '世界首款', '全球首个', '全球首款', '国际首个', '首个', '首款', '最好', '最强', '最优', '最全', '最大', '最先进', '最专业', '最牛', '最值得', '最靠谱', '最推荐', '最划算', '最低价', '最便宜', '第一名', '排名第一', '绝对', '顶级', '完美', '100%', '百分之百', '国家级', '世界级', '史上', '无人能及', '天花板', '王者', '独家', '唯一', '全网最', '销量第一', '遥遥领先', '领先业界', '闭眼入', 'yyds', 'world\'s first', "World's First", 'chatoffice.ai', 'genoffice.ai', '治愈', '疗效', '包治'];
export function findBanned(text) {
  const hits = [];
  for (const w of BANNED) if (text.includes(w)) hits.push(w);
  return hits;
}

// 段落渲染：无序列表 / 有序列表 / 纯段
export function bullets(items) { return fmtList(items).map((x) => `- ${x}`).join('\n'); }
export function numbered(items) { return fmtList(items).map((x, i) => `${i + 1}. ${x}`).join('\n'); }

export function leadIn(r) {
  return pick(r, [
    '先说结论：', '直接上干货。', '这篇文章不绕弯子。', '写在前面的三句话：', '从实际使用出发，',
    '如果你正被这个问题困扰，往下看。', '先把整体思路摆出来：', '用一个真实的工作场景开场：',
  ]);
}
export function closingPool(r, F) {
  return pick(r, [
    `${F.name}的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。`,
    `工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给${F.short}，其余环节保持原样，增量收益最容易看出来。`,
    `这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。`,
    `选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。`,
  ]);
}

// FAQ 渲染
export function faqSection(faqs) {
  const parts = ['## 常见问题'];
  for (const { q, a } of faqs) { parts.push(`### ${q}`, '', a, ''); }
  return parts.join('\n');
}

export function relatedSection(links) {
  return ['## 相关阅读', '', links.map((l) => `- [${l.title}](${l.path})`).join('\n')].join('\n');
}

export function frontmatter(o) {
  const esc = (s) => String(s).replace(/"/g, '”');
  return [
    '---',
    `title: "${esc(o.title)}"`,
    `alt-titles: ${JSON.stringify(o.altTitles.map(esc))}`,
    `description: "${esc(o.desc)}"`,
    `keywords: ${JSON.stringify(o.keywords)}`,
    `product: ${o.product}`,
    `category: "${o.category}"`,
    `primary_keyword: "${esc(o.primaryKw)}"`,
    `channel: "${o.channel}"`,
    '---',
    '',
  ].join('\n');
}

export function footer(F, altTitles) {
  return [
    '---',
    '',
    `> 信息整理截至 2026-09。${F.name}迭代较快，功能细节以官网 ${F.site} 最新版本为准。出品：${F.vendor}。`,
    `> 跨平台发布备选标题：《${altTitles[0]}》《${altTitles[1]}》。`,
    '<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->',
    '',
  ].join('\n');
}

// 组装完整文章（含字数兜底补段）
export function assemble({ F, title, altTitles, desc, keywords, primaryKw, channel, lead, sections, faqs, related, r }) {
  const sharedPool = [
    { h2: '离线运行与部署形态', render: () => pick(r, F.offlineParas) },
    { h2: '数据安全与隐私边界', render: () => bullets(pickN(r, F.privacyPoints, Math.min(4, F.privacyPoints.length))) },
    { h2: '费用与授权的边界（如实说明）', render: () => `${F.activation.model}。免费部分：${F.activation.free}。付费部分：${F.activation.paid || ''}${F.activation.how ? '；' + F.activation.how : ''}` },
    { h2: '如实说说它的不足', render: () => bullets(pickN(r, F.cons, Math.min(3, F.cons.length))) },
    { h2: '产品家族与生态位', render: () => `${F.name}属于察元AI 产品家族，家族成员包括：${F.family.map((x) => `${x.name}（${x.desc}）`).join('；')}。同一账号体系与官网 ${F.site} 承载全部产品的下载、激活与更新。` },
    { h2: '快速安装回顾', render: () => `安装渠道：${F.channels.map((c) => c.name).join('、')}。平台支持：${F.platforms.map((p) => `${p.os}（${p.pkg}）`).join('；')}。详细步骤见各平台安装指南。` },
    { h2: '版本速览', render: () => bullets(F.versions.slice(0, 4).map((v) => `v${v.v}（${v.date}）：${v.highlights[0]}`)) },
  ];
  const usedH2 = new Set(sections.map((s) => s.h2));
  const bodySections = [...sections];
  const renderAll = () => {
    const parts = [`# ${title}`, '', lead, ''];
    for (const s of bodySections) {
      parts.push(`## ${s.h2}`, '');
      parts.push(typeof s.body === 'string' ? s.body : s.body());
      parts.push('');
    }
    parts.push(faqSection(faqs), '');
    if (related && related.length) parts.push(relatedSection(related), '');
    parts.push('## 写在最后', '', closingPool(r, F), '');
    parts.push(footer(F, altTitles));
    return parts.join('\n');
  };
  let md = renderAll();
  let guard = 0;
  while (cjkCount(md) < 1120 && guard++ < 8) {
    const cand = sharedPool.find((s) => !usedH2.has(s.h2));
    if (!cand) break;
    usedH2.add(cand.h2);
    bodySections.push({ h2: cand.h2, body: cand.render() });
    md = renderAll();
  }
  return { md, cjk: cjkCount(md) };
}

// 小红书版组装
export function assembleXhs({ F, title, altTitles, desc, keywords, primaryKw, lead, sections, faqs, r }) {
  const emoji = ['✅', '🔍', '💡', '📌', '🛠️', '⚠️', '🎯', '📝', '🧩', '🚀'];
  const parts = [`# ${title}`, '', lead, ''];
  sections.forEach((s, i) => {
    parts.push(`${emoji[i % emoji.length]} **${s.h2}**`, '', s.body, '');
  });
  parts.push('❓ **常见疑问快答**', '');
  for (const { q, a } of faqs) parts.push(`问：${q}`, `答：${a}`, '');
  parts.push('🏷️ ' + fmtList(pickN(r, F.xhsTags, 8)).map((t) => `${t}`).join(' '), '');
  parts.push('📷 首图建议：一张竖版 3:4 的界面截图 + 大字标题（突出本文主关键词），第二张放步骤图，第三张放效果对比。', '');
  parts.push('💬 评论区预埋：①「支持什么系统？」→ 三平台都支持，国产化环境也有安装包；②「要付费吗？」→ 有免费额度，付费项文里写清楚了；③「和 XX 什么区别？」→ 看文末家族说明。', '');
  parts.push('---', '', `> 信息整理截至 2026-09，以官网 ${F.site} 最新版本为准。`, `> 备选标题：《${altTitles[0]}》《${altTitles[1]}》。`, '<!-- 合规自查：已过滤极限词；未虚构使用体验与数据；保留“不适合谁”说明。 -->', '');
  const md = parts.join('\n');
  return { md, cjk: cjkCount(md) };
}

export function descBuilder(F, primaryKw, extra) {
  const base = `${primaryKw}相关指南：${F.name}（${F.site}）`;
  return `${base}。${noDot(extra)}。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。`.slice(0, 180);
}
