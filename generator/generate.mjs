// 察元产品线 2000 篇网文生成器
// 用法：node generator/generate.mjs  （在 chayuan-articles 目录下执行）
// 输出：chayuan-{wps,office,os} 与 website 四个产品文件夹（各含分类子目录）、README 索引、strategy/04-文章规划总表.csv
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wpsF from './facts/chayuan-wps.mjs';
import officeF from './facts/chayuan-office.mjs';
import osF from './facts/chayuan-os.mjs';
import webF from './facts/website.mjs';
import { TECH, RELEASE_EXTRA, FAQ_THEMES, RESOURCE_TOPICS } from './facts/tech-extra.mjs';
import {
  rng, pick, pickN, cjkCount, bullets, numbered, findBanned, hashStr, noDot,
  assemble, assembleXhs, descBuilder, frontmatter,
} from './shared/render.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = ROOT;
const FACTS = [wpsF, officeF, osF, webF];
const TARGETS = { 'chayuan-wps': 560, 'chayuan-office': 440, 'chayuan-os': 500, website: 500 };

const CATS = {
  wpsLike: ['00-关键词覆盖', '01-下载安装', '02-功能教程', '03-场景用例', '04-行业方案', '05-对比评测', '06-常见问题', '07-技术解析', '08-版本发布', '09-社区种草'],
  web: ['00-关键词覆盖', '01-上手指南', '02-板块教程', '03-资源盘点', '04-场景用例', '05-对比评测', '06-常见问题', '07-技术解析', '08-版本发布', '09-社区种草'],
};
const F_ANGLES = ['实操教程', '新手入门', '进阶技巧', '避坑指南', '速查手册', '案例拆解', '问答详解', '细节全解'];
const S_ANGLES = ['完整方案', '新手路线', '效率视角', '深度复盘', '清单式指南'];
const C_ANGLES = ['深度对比', '选型指南', '场景化推荐'];
const T_ANGLES = ['原理解析', '实操要点'];

const INDUSTRY_PAINS = [
  '文档量大、格式要求严，人工处理占用大量时间',
  '专业术语与口径需要全篇一致，人工核对容易漏',
  '多岗位协作时版本混乱、批注流转低效',
  '对外材料有保密与合规要求，外发前自检环节薄弱',
  '新人上手慢，经验沉淀在个人手里而非工具里',
  '跨部门数据与引用需要反复核对出处',
  '临时性、突击性材料多，加班赶稿是常态',
  '历史文档数字化程度低，检索与复用困难',
];

const EMOJIS = ['🔥', '✨', '💡', '🚀', '📌', '🎯', '🧩', '⭐'];

// ---------- 标题与 slug ----------
const titleRegistry = new Set();
function uniqueTitle(t) {
  if (!titleRegistry.has(t)) { titleRegistry.add(t); return t; }
  const vs = ['细节版', '2026 版', '实操版', '图文版', '收藏向', '保姆级', '思路版', '进阶篇', '基础篇', '补充篇'];
  for (const v of vs) {
    const c = `${t}（${v}）`;
    if (!titleRegistry.has(c)) { titleRegistry.add(c); return c; }
  }
  throw new Error(`标题无法去重：${t}`);
}
const slugReg = new Set();
function makeSlug(prefix, seed) {
  let cleaned = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (cleaned.replace(/-/g, '').length < 3) cleaned = hashStr(String(seed)).slice(0, 8);
  const base = `${prefix}-${cleaned}`.slice(0, 60);
  let s = base, i = 2;
  while (slugReg.has(s)) s = `${base}-${i++}`;
  slugReg.add(s);
  return s;
}

// ---------- 各类别构建器：返回 draft ----------
function kwFeatureMatch(F, kw, n) {
  const hit = F.features.filter((f) => (f.kw + f.name + f.what).includes(kw) || kw.includes(f.kw));
  return hit.length >= n ? hit.slice(0, n) : [...hit, ...F.features.filter((f) => !hit.includes(f))].slice(0, n);
}

function buildPillar(F, p, idx) {
  const r = rng(`pillar-${F.key}-${p.kw}`);
  const feats = kwFeatureMatch(F, p.kw, 4);
  const title = uniqueTitle(pick(r, [
    `${p.kw}怎么选：${F.short}完整指南`,
    `${p.kw}一文讲透：是什么、怎么用、边界在哪`,
    `什么是${p.kw}？从零到用起来的完整路径`,
    `${p.kw}全解析：${p.blurb}`,
    `${p.kw}避坑与选型：以${F.short}为例`,
  ]));
  const blurb = noDot(p.blurb);
  const lead = `${p.kw}这个方向，最近关注的人越来越多了。${blurb}。${F.name}是${F.tagline}。这篇文章从「${p.kw}」这个需求出发，把定义、能力对照、上手步骤与真实边界一次讲清，读完即可判断它是不是你要找的工具。`;
  const sections = [
    { h2: `「${p.kw}」到底在解决什么问题`, body: `${p.kw}方向的工具不少，用户需求却各不相同。判断任何一个这类工具，先看三个硬指标：一是错误类型或任务类型的覆盖面（能不能覆盖你的真实场景），二是结果如何落地（只给报告，还是能直接写回文档），三是数据安全边界（内容是否需要出你的机器）。三者都过关，再比较体验细节。` },
    { h2: `${F.name}能提供什么`, body: `${F.positioning}\n\n与「${p.kw}」最相关的几项能力：\n\n${feats.map((f) => `- **${f.name}**：${f.what}`).join('\n')}` },
    { h2: '从零开始的上手路径', body: numbered([
      `访问官网 ${F.site} 了解产品并获取安装包（${F.channels.map((c) => c.name).join('、')}等渠道均可）`,
      `按你的平台完成安装：${F.platforms.map((x) => `${x.os}（${x.pkg}）`).join('；')}`,
      '配置模型：云端供应商填 Key，内网/离线用户指向本地或内网端点',
      `跑通第一个任务：${feats[0] ? `试一次「${feats[0].name}」` : '从助手对话开始'}，验证链路后再铺开使用`,
    ]) },
    { h2: '适不适合你：条件式判断', body: bullets([
      `适合：${F.scenarios.map((s) => s.persona).slice(0, 4).join('、')}等场景的用户`,
      ...pickN(r, F.cons, 2).map((c) => `需要留意：${c}`),
      '建议先用免费额度验证高频场景，再决定是否长期使用或付费',
    ]) },
  ];
  return {
    type: 'pillar', catIdx: 0, title, primaryKw: p.kw, keywords: [p.kw, F.name, F.short, ...feats.slice(0, 2).map((f) => f.kw)],
    desc: descBuilder(F, p.kw, p.blurb), channel: 'CSDN/知乎/博客/公众号',
    lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('kw', `${idx}-${p.kw}`), r,
  };
}

function buildInstall(F, t, idx) {
  const r = rng(`install-${F.key}-${t.t}`);
  const plat = F.platforms.find((p) => t.payload === p.os);
  let focusSteps, focusBody, focusH2;
  if (plat) {
    focusH2 = `${plat.os} 安装步骤（${plat.pkg}）`;
    focusSteps = numbered(plat.steps);
    focusBody = `系统要求：${plat.req}。${plat.note || ''}`;
  } else if (t.kind === 'channel') {
    const ch = F.channels.find((c) => t.payload.startsWith(c.name)) || F.channels[0];
    focusH2 = `通过${ch.name}获取`;
    focusSteps = numbered([
      `打开 ${ch.url}`,
      `按平台选择安装包：${F.platforms.map((p) => `${p.os} 用 ${p.pkg}`).join('；')}`,
      '下载后先做完整性确认（有校验文件的包先校验）',
      '按对应平台的安装步骤完成安装',
    ]);
    focusBody = `${ch.note}。全部获取渠道：${F.channels.map((c) => `${c.name}（${c.note}）`).join('；')}。`;
  } else if (t.kind === 'trouble') {
    const q = F.installTroubles[t.payload];
    focusH2 = `问题定位与处理`;
    focusSteps = numbered([
      `症状确认：${q.q}`,
      `按官方口径处理：${q.a}`,
      '处理后在干净环境复现验证一次',
      '仍失败时收集系统版本与报错截图，通过官网支持渠道反馈',
    ]);
    focusBody = `安装类问题九成出在三个环节：安装包与系统架构不匹配、安装目录权限不足、安全软件拦截。先按这三条排查，再进入具体问题处理。`;
  } else {
    const p2 = F.platforms[idx % F.platforms.length];
    focusH2 = `通用流程（以 ${p2.os} 为例）`;
    focusSteps = numbered(p2.steps);
    focusBody = `${noDot(t.blurb)}`;
  }
  const title = uniqueTitle(pick(r, [
    `${t.t}｜${F.short}${t.kind === 'trouble' ? '故障处理' : '安装指南'}`,
    `${t.t}：${t.kw}完整指引`,
    `${t.kw}怎么做？${t.t}一次讲清`,
    `${t.t}（${F.short}）`,
  ]));
  const lead = `${noDot(t.blurb)}。本文以「${t.t}」为主题，给出${F.name}的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。`;
  const sections = [
    { h2: '下载渠道与系统要求', body: `官方渠道：${F.channels.map((c) => `${c.name} ${c.url}`).join('；')}。系统要求总览：${F.platforms.map((p) => `${p.os}——${p.req}`).join('；')}。` },
    { h2: focusH2, body: `${focusBody}\n\n${focusSteps}` },
    { h2: '安装后怎么验证', body: numbered([
      plat ? `重启宿主程序，确认功能入口已出现（${plat.os} 环境）` : '重启对应程序，确认功能入口已出现',
      '发起一次最小任务（如一句对话或一次校对），确认链路可用',
      '内网/离线环境：确认模型端点指向本地或内网服务',
      `更新与数据：${pick(r, ['升级采用覆盖安装方式，用户数据目录不受影响', '重跑安装器即可升级到最新版，配置保留'])}`,
    ]) },
    { h2: '相关报错速查', body: bullets(pickN(r, F.installTroubles, 3).map((q) => `${q.q}——${q.a}`)) },
  ];
  return {
    type: 'install', catIdx: 1, title, primaryKw: t.kw, keywords: [t.kw, F.name, '下载', '安装'],
    desc: descBuilder(F, t.kw, t.t), channel: 'CSDN/知乎/博客/公众号',
    lead, sections, faqs: pickN(r, F.installTroubles.concat(F.faqs.slice(0, 8)), 3), slug: makeSlug('install', `${idx}-${t.kw}`), r,
  };
}

function buildFeature(F, f, angleIdx, idx, combo) {
  const r = rng(`feature-${F.key}-${f.id || f.t}-${angleIdx}`);
  const angle = F_ANGLES[angleIdx % F_ANGLES.length];
  const feats = combo ? combo.flow.map((id) => F.features.find((x) => x.id === id)).filter(Boolean) : [f];
  const main = feats[0];
  const kw = combo ? combo.kws[0] : f.kw;
  const title = uniqueTitle(combo
    ? pick(r, [`${combo.t}：${angle}`, `${combo.t}（${F.short}${angle}）`, `一文打通${combo.t}｜${kw}`])
    : pick(r, [
      `${f.name}怎么用：${F.short}${angle}`,
      `一文读懂${f.name}｜${angle}`,
      `${f.name}${angle}：从入口到完成的完整流程`,
      `${kw}攻略：${f.name}的关键点拆解`,
      `${F.short}${f.name}使用指南（${kw}）`,
    ]));
  const lead = combo
    ? `${noDot(combo.blurb)}。这套组合工作流把${feats.map((x) => x.name).join('→')}串成一条线，在${F.name}里一气呵成完成。本文按步骤拆解每个环节的做法与衔接点，并给出适用与不适用边界。`
    : `${kw}是${F.name}里使用频率很高的一项能力。它的「${f.name}」这样工作：${noDot(f.what)}。这篇${angle}从入口、步骤、场景讲到技巧与边界，新手照做能跑通，老手能查漏。`;
  const sections = [];
  if (combo) {
    sections.push({ h2: '这套工作流解决什么', body: `${noDot(combo.blurb)}。单点工具人人会用，难的是把多个能力串成不返工的流水线：前一步的产出正好是后一步的输入，中间不换软件、不倒格式。${F.name}的优势正是所有环节都在同一个体系内完成。` });
    sections.push({ h2: '分步拆解', body: feats.map((x, i) => `**第 ${i + 1} 步·${x.name}**：${x.what}\n\n${numbered(x.steps.slice(0, 3))}`).join('\n\n') });
    sections.push({ h2: '衔接点与易错处', body: bullets(feats.flatMap((x) => x.tips.slice(0, 2))) });
  } else {
    sections.push({ h2: `它是什么，解决什么问题`, body: `${f.what}\n\n从任务视角看，它对应的关键词是「${kw}」——也就是用户带着这个需求搜索时，最应该被满足的那类任务。` });
    sections.push({ h2: '操作步骤', body: numbered(f.steps) });
    if (angleIdx % 4 !== 2) sections.push({ h2: '适用场景', body: bullets(f.scenarios) });
    if (f.tips && f.tips.length) sections.push({ h2: angleIdx % 2 ? '进阶技巧' : '实用技巧', body: bullets(f.tips) });
    if (f.caveats && f.caveats.length) sections.push({ h2: '注意事项与边界', body: bullets(f.caveats.concat([pick(r, F.cons)])) });
    else sections.push({ h2: '注意事项与边界', body: bullets([pick(r, F.cons), '模型相关能力建议先在非关键文稿上试跑一次，确认输出风格符合预期']) });
  }
  const faqPool = F.faqs.filter((q) => (q.q + q.a).includes(kw.slice(0, 2)));
  return {
    type: 'feature', catIdx: 2, title, primaryKw: kw,
    keywords: combo ? combo.kws : [kw, F.name, F.short, main.name],
    desc: descBuilder(F, kw, combo ? combo.t : f.name), channel: 'CSDN/知乎/博客/公众号',
    lead, sections, faqs: pickN(r, faqPool.length >= 3 ? faqPool : F.faqs, 3),
    slug: makeSlug('feature', `${idx}-${f.id || f.t}`), r,
  };
}

function buildScenario(F, s, angleIdx, idx) {
  const r = rng(`scenario-${F.key}-${s.id}-${angleIdx}`);
  const angle = S_ANGLES[angleIdx % S_ANGLES.length];
  const title = uniqueTitle(pick(r, [
    `写给${s.persona}的${s.kw}指南：${angle}`,
    `${s.persona}的${s.kw}方案（${angle}）`,
    `${s.kw}${angle}：${s.persona}场景全拆解`,
    `${s.persona}提效实录路线：${s.kw}这样落地`,
  ]));
  const lead = `如果你是${s.persona}，下面这些场景大概率不陌生：${s.pains[0]}。${noDot(s.blurb)}。这篇${angle}以${F.short}为工具，把这个岗位的${s.kw}工作流从头到尾串一遍。`;
  const sections = [
    { h2: '这个岗位的三个真实痛点', body: bullets(s.pains) },
    { h2: `用${F.short}怎么解：工作流拆解`, body: numbered(s.flow) },
    { h2: '一天的使用节奏示例', body: `以一个工作日为例：早上到岗先处理积压材料，用「${s.flow[0].replace(/^[^：:]*[：:]\s*/, '')}」完成首轮处理；上午协作时段按流程推进；下班前把当天产出归档。${noDot(s.blurb)}。工具不改变职责边界，只是把重复劳动压缩掉。` },
    { h2: '边界与注意事项', body: bullets([s.caveat || '生成类结果需要人工确认后采用', pick(r, F.cons), '建议先在低风险材料上试跑，形成自己的使用习惯后再铺开']) },
  ];
  return {
    type: 'scenario', catIdx: F.key === 'website' ? 4 : 3, title, primaryKw: s.kw,
    keywords: [s.kw, s.persona, F.name, F.short],
    desc: descBuilder(F, s.kw, `${s.persona}场景`), channel: 'CSDN/知乎/小红书/公众号',
    lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('scenario', `${idx}-${s.id}`), r,
  };
}

function buildIndustry(F, ind, round, idx) {
  const r = rng(`industry-${F.key}-${ind}-${round}`);
  const pains = [INDUSTRY_PAINS[idx % 8], INDUSTRY_PAINS[(idx + 3) % 8], INDUSTRY_PAINS[(idx + 5) % 8]];
  const feats = pickN(r, F.features, 4);
  const sc = F.scenarios[idx % F.scenarios.length];
  const title = uniqueTitle(round === 0
    ? `${ind}行业怎么用${F.short}：从痛点到落地`
    : `${ind}场景落地方案：${F.short}行业指南（续）`);
  const lead = `${ind}行业的文档与信息工作有其固有节奏：${pains[0]}。${F.name}在${ind}场景下的定位，是把可标准化的环节交给工具、把判断留给从业者的「人机协同」。本文按痛点→能力→落地步骤→边界的顺序，给出${ind}行业的完整应用路径。`;
  const sections = [
    { h2: `${ind}行业的典型痛点`, body: bullets(pains) },
    { h2: `对应的能力组合`, body: feats.map((f) => `- **${f.name}**（${f.kw}）：${f.what}`).join('\n') },
    { h2: '落地四步', body: numbered([
      '盘点本岗位高频文书/信息任务，挑最耗时的两个作为切入口',
      `按${sc.persona}场景的工作流试跑一周，记录节省的环节`,
      '把常用任务固化为助手或规则模板，团队复用',
      '建立人工复核节点：工具产出 → 从业者裁决 → 定稿',
    ]) },
    { h2: '合规与边界', body: bullets(['涉密与敏感材料遵循本单位管理规定，必要时使用离线部署形态', pick(r, F.cons), '行业判断责任始终在人，工具输出作为参考']) },
  ];
  return {
    type: 'industry', catIdx: 4, title, primaryKw: `${ind}AI`,
    keywords: [`${ind}AI`, ind, F.name, F.short],
    desc: descBuilder(F, `${ind}AI`, `${ind}行业应用`), channel: 'CSDN/知乎/公众号',
    lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('industry', `${idx}-${ind}`), r,
  };
}

function buildCompare(F, c, angleIdx, idx, roundup) {
  const r = rng(`compare-${F.key}-${c ? c.t : 'roundup'}-${angleIdx}`);
  const angle = C_ANGLES[angleIdx % C_ANGLES.length];
  if (roundup) {
    const title = uniqueTitle(`${F.short}全部对比议题总览：怎么按场景选`);
    const lead = `选型前先看全景。${F.name}相关的常见对比议题有 ${F.comparisons.length} 组，本文把它们汇总成一张决策地图：每个议题一句话结论，再链接到各自的深度对比。`;
    const sections = [
      { h2: '决策地图', body: F.comparisons.map((x) => `- **${x.t}**：${x.verdict}`).join('\n') },
      { h2: '统一的选择原则', body: bullets(['数据敏感度优先：涉密与商业敏感场景一律本地/离线方案', '任务频率其次：高频任务值得为体验付费，低频任务免费额度即可', '能力边界第三：工具擅长的交给工具，责任节点留给人']) },
    ];
    return { type: 'compare', catIdx: F.key === 'website' ? 5 : 5, title, primaryKw: `${F.short}对比`, keywords: [`${F.short}对比`, '选型'], desc: descBuilder(F, '选型对比', '全部议题总览'), channel: 'CSDN/知乎/公众号', lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('compare', `${idx}-roundup`), r };
  }
  const rows = c.dims.map((d) => `| ${d.dim} | ${d.a} | ${d.b} | ${d.note} |`).join('\n');
  const title = uniqueTitle(pick(r, [`${c.t}（${angle}）`, `${c.t}：${angle}与条件式建议`, `${c.kw}决策指南：${c.t}`]));
  const lead = `${c.t}，是很多用户在选型阶段绕不开的问题。这篇${angle}不给「闭眼选谁」的答案，只给统一维度的对照表和条件式建议——你的场景条件不同，结论就不同。`;
  const sections = [
    { h2: '维度对照表', body: `| 维度 | 本方案（${F.short}） | 对照方案 | 说明 |\n|---|---|---|---|\n${rows}` },
    { h2: '逐项解读', body: c.dims.map((d) => `**${d.dim}**：${d.note}。${F.short}侧的做法是「${d.a}」，对照方案为「${d.b}」——差异的本质在于设计取向不同，而非优劣。`).join('\n\n') },
    { h2: '条件式建议', body: `${c.verdict}。再补三条判断线索：\n\n${bullets(['先明确你的硬约束（保密/预算/平台），硬约束直接淘汰不满足者', '拿真实任务各试三天，比看十篇评测有用', '考虑迁移成本：现有流程改动越小越好，渐进替换最稳'])}` },
    { h2: '什么情况下不选它', body: bullets(pickN(r, F.cons, 3)) },
  ];
  return {
    type: 'compare', catIdx: 5, title, primaryKw: c.kw, keywords: [c.kw, '对比', '选型', F.name],
    desc: descBuilder(F, c.kw, c.t), channel: 'CSDN/知乎/公众号',
    lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('compare', `${idx}-${c.kw}`), r,
  };
}

function buildFaq(F, kind, data, idx) {
  const r = rng(`faq-${F.key}-${kind}-${idx}`);
  if (kind === 'single') {
    const { q, a } = data;
    const title = uniqueTitle(q.length < 28 ? q : `${q.slice(0, 26)}…？`);
    const lead = `这个问题在被反复问到，这里给一个完整、可执行的回答。`;
    const sections = [
      { h2: '直接回答', body: a },
      { h2: '背景与原因', body: `理解这个问题的关键，是先知道${F.name}的整体设计：${F.positioning}` },
      { h2: '延伸操作', body: numbered(['按上文答案定位到对应设置或入口', '执行后做一次最小验证', '如涉及模型，先确认端点与密钥有效', '仍有问题时通过官网渠道反馈并附系统信息']) },
    ];
    return { type: 'faq', catIdx: 6, title, primaryKw: q.slice(0, 12), keywords: [q.slice(0, 12), F.name], desc: descBuilder(F, q.slice(0, 10), '常见问题解答'), channel: 'CSDN/知乎/百度知道', lead, sections, faqs: pickN(r, F.faqs.filter((x) => x.q !== q), 3), slug: makeSlug('faq', `${idx}-${q.slice(0, 8)}`), r };
  }
  const theme = data;
  const pool = [...F.faqs, ...F.installTroubles];
  const sel = [];
  for (let i = 0; i < 6; i++) sel.push(pool[(idx * 3 + i * 5) % pool.length]);
  const title = uniqueTitle(`${F.short}FAQ：${theme}`);
  const lead = `把${theme}相关的高频问题集中回答，一篇看完，省得一个个搜。每个回答都给到可操作的结论。`;
  const sections = [
    { h2: '快问快答', body: sel.map((x, i) => `**${i + 1}. ${x.q}**\n\n${x.a}`).join('\n\n') },
    { h2: '一条通用排查思路', body: '绝大多数问题出在三层：环境层（安装与版本）、配置层（模型端点与密钥）、用法层（入口与步骤）。先分层再定位，比盲目重装效率高得多。' },
  ];
  return { type: 'faq', catIdx: 6, title, primaryKw: `${F.short}FAQ`, keywords: [`${F.short}FAQ`, '常见问题'], desc: descBuilder(F, '常见问题', theme), channel: 'CSDN/知乎', lead, sections, faqs: pickN(r, pool, 3), slug: makeSlug('faq', `${idx}-${theme}`), r };
}

function techGenericBody(F, t, r) {
  const has = (...ws) => ws.some((w) => t.includes(w));
  if (has('遥测', '隐私', '安全', '内容安全')) return `这个话题的核心事实可以从产品声明逐条验证：\n\n${bullets(pickN(r, F.privacyPoints, 4))}`;
  if (has('授权', '激活', '商业化')) return `授权与费用的事实边界如下：${F.activation.model}。免费部分：${F.activation.free}。付费部分：${F.activation.paid || '见官网说明'}。所有声明都写成可验证的口径，而不是营销话术。`;
  if (has('版本', '上游', '演进', '更新')) return `版本演进的完整时间线：\n\n${bullets(F.versions.map((v) => `v${v.v}（${v.date}）：${v.highlights[0]}`))}\n\n版本策略的原则是行为变化写进更新说明、用户数据与版本解耦。`;
  if (has('打包', '构建', '部署', '安装')) return `交付形态覆盖：${F.platforms.map((p) => `${p.os}（${p.pkg}）`).join('；')}。跨平台打包的难点在架构矩阵与依赖就位，而不是功能本身——每个平台的安装步骤都在官方文档有逐条说明。`;
  if (has('性能', '容量', '内存')) return `性能与容量规划要面对的现实约束：\n\n${bullets(F.cons.slice(0, 3))}\n\n建议的策略是按硬件预算裁剪使用面，而不是无差别开满全部能力。`;
  return `${pick(r, F.offlineParas)}`;
}

function buildTech(F, t, angleIdx, idx, generic) {
  const r = rng(`tech-${F.key}-${t}-${angleIdx}`);
  const angle = T_ANGLES[angleIdx % 2];
  const tech = TECH[F.key];
  const spec = generic ? null : tech.specific.find((x) => x.t === t) || tech.specific[idx % tech.specific.length];
  const kw = spec ? spec.kw : t;
  const title = uniqueTitle(spec
    ? pick(r, [`${spec.t}（${angle}）`, `技术解析：${spec.t}`, `${F.short}架构课｜${spec.t}`])
    : `${t}：${F.short}的${angle}`);
  const lead = spec
    ? `这是「${F.short}技术解析」系列的一篇。${spec.t}是理解这款产品设计哲学的关键切面——看完你会明白它为什么这样设计、这样设计换来了什么、代价是什么。`
    : `${t}常被用户问到。这篇${angle}从${F.name}的实际实现出发，讲清楚设计取舍与使用层面的意义。`;
  const body = spec ? spec.body : techGenericBody(F, t, r);
  const sections = [
    { h2: '一句话结论', body },
    { h2: '为什么这样设计', body: `这个设计的动机可以概括为三点：把风险控制在机制而不是纪律里（靠制度约束人的行为总会失效，靠架构约束才稳定）；把复杂度封装起来（用户不需要理解内部实现，只需要理解行为边界）；把可验证性留给用户（声明的能力都能在产品里实际验证）。软件工程里没有免费的设计——每一条这样的取舍都是在「体验、安全、性能、成本」之间做的显式权衡，约束变了，结论就可能反转。` },
    { h2: '对使用者意味着什么', body: bullets(pickN(r, F.privacyPoints, 3).concat([`相关能力以官网 ${F.site} 最新版本为准`])) },
    { h2: '动手验证', body: numbered(['带着本文结论去产品里找到对应入口', '构造一个最小场景验证行为是否符合描述', '观察边界情况的表现（断网、权限、并发）', '把验证结论沉淀进团队内部文档']) },
  ];
  return {
    type: 'tech', catIdx: 7, title, primaryKw: kw, keywords: [kw, F.name, '技术解析'],
    desc: descBuilder(F, kw, spec ? spec.t : t), channel: 'CSDN/掘金/知乎',
    lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('tech', `${idx}-${kw}`), r,
  };
}

function buildRelease(F, kind, data, idx) {
  const r = rng(`release-${F.key}-${kind}-${idx}`);
  if (kind === 'version') {
    const v = data;
    const title = uniqueTitle(pick(r, [
      `${F.short} v${v.v} 更新解读：${v.highlights[0]}`,
      `升级到 v${v.v} 前必读的几件事`,
      `v${v.v} 发布要点：${v.highlights.slice(0, 2).join('；')}`,
    ]));
    const lead = `v${v.v}（${v.date}）带来了 ${v.highlights.length} 项主要更新。这篇解读把每项更新「翻译」成使用层面的变化，并给出升级建议。`;
    const sections = [
      { h2: '本版主要更新', body: bullets(v.highlights) },
      { h2: '值得展开说的一处', body: `以「${v.highlights[0]}」为例：它解决的是此前用户反馈集中的场景。升级后建议第一时间验证这个场景——如果它正是你的痛点，这一版就值得升；如果你的工作流不涉及，也可以观望一个补丁版本再升。` },
      { h2: '升级建议', body: numbered(['升级前备份用户数据目录（各产品数据目录见官方文档）', `从官网 ${F.site} 或对应发布渠道获取新版安装包`, '覆盖安装，完成后验证常用链路', '如有问题，用备份目录回滚到旧版']) },
    ];
    return { type: 'release', catIdx: 8, title, primaryKw: `${F.short}更新`, keywords: [`${F.short} v${v.v}`, '更新日志', '升级'], desc: descBuilder(F, '版本更新', `v${v.v} 解读`), channel: 'CSDN/公众号', lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('release', `${idx}-${v.v}`), r };
  }
  const t = data;
  const title = uniqueTitle(`${t}（${F.short}演进笔记）`);
  const lead = `${t}。版本号背后是产品重心的迁移，这篇笔记沿着时间线梳理这条演进线索，帮你判断「现在上车」处在什么阶段。`;
  const sections = [
    { h2: '时间线', body: F.versions.map((v) => `- **v${v.v}（${v.date}）**：${v.highlights.join('；')}`).join('\n') },
    { h2: '演进主线', body: `从时间线可以看出，${F.short}的重心在「能力广度→工程深度→规模化形态」之间稳步推进：早期铺功能，中期补安全与体验，近期重心在部署形态与生态联动。这也意味着现在的版本进入相对成熟区间，适合作为主力工具评估。` },
    { h2: '升级与版本策略建议', body: bullets(['生产环境跟随稳定版，滞后一两个小版本', '每次升级阅读更新说明中的行为变化', '重要节点（大版本）升级前做全量备份']) },
  ];
  return { type: 'release', catIdx: 8, title, primaryKw: `${F.short}版本`, keywords: [`${F.short}版本`, '演进', t], desc: descBuilder(F, '版本演进', t), channel: 'CSDN/公众号', lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('release', `${idx}-note`), r };
}

// website 专属：资源盘点
function buildResource(F, topic, idx) {
  const r = rng(`resource-${F.key}-${topic.t}-${idx}`);
  const refs = (topic.refs || []).map((id) => F.features.find((f) => f.id === id)).filter(Boolean);
  const feats = refs.length ? refs : pickN(r, F.features, 3);
  const title = uniqueTitle(pick(r, [`${topic.t}`, `${topic.t}：资源怎么找怎么选`, `能力广场专题｜${topic.t}`]));
  const lead = `${topic.t}。察元AI 能力广场（${F.site}）把这类资源做了结构化收录：条目统一字段、带安装命令或配置片段、标注可用性状态。这篇专题按「怎么找→怎么选→怎么用→怎么避坑」四步给出完整路径。`;
  const sections = [
    { h2: '这个专题解决什么', body: `找资源难的不是「没有」，而是散落各处、质量不均、无法比较。能力广场用统一结构收敛这类问题：${feats.map((f) => `${f.name}（${f.kw}）`).join('、')}等板块按统一字段维护，搜索与筛选组合使用。` },
    { h2: '相关板块怎么用', body: feats.map((f) => `**${f.name}**：${f.what}\n\n${numbered(f.steps.slice(0, 3))}`).join('\n\n') },
    { h2: '选择清单', body: numbered(['先看 health 状态，优先 active 条目', 'MCP 类看 scopes 风险分级，权限最小化原则', '排序数据可参考，但不迷信单一指标', '复制安装命令执行后做一次冒烟验证', '好用的资源收藏沉淀，失效的反馈上报']) },
    { h2: '避坑提示', body: bullets(pickN(r, F.cons, 3)) },
  ];
  return { type: 'resource', catIdx: 3, title, primaryKw: topic.kw, keywords: [topic.kw, 'AI资源', F.name], desc: descBuilder(F, topic.kw, topic.t), channel: 'CSDN/知乎/小红书', lead, sections, faqs: pickN(r, F.faqs, 3), slug: makeSlug('res', `${idx}-${topic.kw}`), r };
}

function buildXhs(F, src, kind, idx) {
  const r = rng(`xhs-${F.key}-${kind}-${idx}`);
  let title, lead, sections;
  if (kind === 'scenario') {
    const s = src;
    title = uniqueTitle(`${pick(r, EMOJIS)}${s.persona}自救指南：${s.kw}这么干`);
    lead = `刷到这篇的${s.persona}先别划走👀 如果你也有「${s.pains[0]}」的困扰，这篇直接抄作业。`;
    sections = [
      { h2: '痛点自查', body: s.pains.map((p) => `· ${p}`).join('\n') },
      { h2: '解法工作流', body: s.flow.map((p, i) => `${i + 1}️⃣ ${p}`).join('\n') },
      { h2: '为什么值得试', body: `${F.tagline}。而且${pick(r, F.offlineParas).slice(0, 120)}…` },
      { h2: '适合谁 / 先别冲', body: `✅ 适合：${s.persona}、${F.scenarios[(idx + 1) % F.scenarios.length].persona}\n❌ 先别冲：${pick(r, F.cons)}` },
    ];
  } else if (kind === 'feature') {
    const f = src;
    title = uniqueTitle(`${pick(r, EMOJIS)}${f.name}隐藏用法｜${f.kw}一次讲清`);
    lead = `用过${F.short}的宝子看过来，${f.name}这个功能很多人没用到极致👇`;
    sections = [
      { h2: '它能干嘛', body: f.what },
      { h2: '三步用起来', body: f.steps.slice(0, 3).map((s, i) => `${i + 1}️⃣ ${s}`).join('\n') },
      { h2: '什么场景最香', body: f.scenarios.map((s) => `· ${s}`).join('\n') },
      { h2: '避坑提醒', body: `⚠️ ${(f.caveats && f.caveats[0]) || pick(r, F.cons)}` },
    ];
  } else {
    const c = src;
    title = uniqueTitle(`${pick(r, EMOJIS)}${c.t}，一篇给你说透`);
    lead = `${noDot(c.blurb)}。这条组合工作流的思路分享，建议先收藏再看📌`;
    sections = [
      { h2: '工作流拆解', body: c.flow.map((id, i) => {
        const f = F.features.find((x) => x.id === id);
        return `${i + 1}️⃣ ${f ? f.name : id}：${f ? f.what.slice(0, 80) : ''}…`;
      }).join('\n') },
      { h2: '衔接要点', body: c.flow.map((id) => {
        const f = F.features.find((x) => x.id === id);
        return f && f.tips[0] ? `· ${f.tips[0]}` : '';
      }).filter(Boolean).join('\n') },
      { h2: '适合谁 / 先别冲', body: `✅ 适合：${F.scenarios[idx % F.scenarios.length].persona}\n❌ 先别冲：${pick(r, F.cons)}` },
    ];
  }
  return { type: 'xhs', catIdx: 9, title, primaryKw: kind === 'feature' ? src.kw : src.kw, keywords: [src.kw, F.name], desc: descBuilder(F, src.kw, '小红书版'), channel: '小红书/抖音图文', lead, sections, faqs: pickN(r, F.faqs, 2), slug: makeSlug('xhs', `${idx}-${src.kw}`), r };
}

// ---------- 规划器 ----------
function planProduct(F, target) {
  const isWeb = F.key === 'website';
  const plans = [];
  const tech = TECH[F.key];
  // 00 关键词覆盖
  F.pillars.forEach((p, i) => plans.push({ builder: () => buildPillar(F, p, i) }));
  // 01 安装/上手
  F.installTopics.forEach((t, i) => plans.push({ builder: () => buildInstall(F, t, i) }));
  // 02 功能/板块
  const featurePlans = [];
  F.features.forEach((f) => { for (let a = 0; a < 4; a++) featurePlans.push(() => buildFeature(F, f, a, F.features.indexOf(f))); });
  F.combos.forEach((c, i) => featurePlans.push(() => buildFeature(F, c, 4, i, c)));
  // website 03 资源盘点
  const resourcePlans = [];
  if (isWeb) {
    const kindAngles = ['怎么找与怎么筛', '值得关注的细分方向', '怎么选出适合自己的', '安装与上手', '避坑与常见误区'];
    F.features.filter((f) => ['plugin', 'skill', 'mcp', 'prompt', 'agent', 'model', 'vendor', 'news'].includes(f.id)).forEach((f) => {
      kindAngles.forEach((ang, ai) => resourcePlans.push(() => buildResource(F, { t: `${f.name.replace(/板块$/, '')}${ang}`, kw: f.kw, refs: [f.id] }, resourcePlans.length)));
    });
    RESOURCE_TOPICS.forEach((t, i) => resourcePlans.push(() => buildResource(F, { ...t, refs: t.refs }, 100 + i)));
  }
  // 场景
  const scenarioPlans = [];
  F.scenarios.forEach((s) => { for (let a = 0; a < 5; a++) scenarioPlans.push(() => buildScenario(F, s, a, F.scenarios.indexOf(s))); });
  // 行业
  const industryPlans = [];
  if (!isWeb) F.industries.forEach((ind, i) => industryPlans.push(() => buildIndustry(F, ind, 0, i)));
  // 对比
  const comparePlans = [];
  F.comparisons.forEach((c, i) => { for (let a = 0; a < 3; a++) comparePlans.push(() => buildCompare(F, c, a, i)); });
  comparePlans.push(() => buildCompare(F, null, 0, 99, true));
  // FAQ
  const faqPlans = [];
  const singles = [...F.faqs.map((q) => ({ kind: 'single', data: q })), ...F.installTroubles.map((q) => ({ kind: 'single', data: q }))];
  singles.forEach((s, i) => faqPlans.push(() => buildFaq(F, 'single', s.data, i)));
  FAQ_THEMES[F.key].forEach((theme, i) => faqPlans.push(() => buildFaq(F, 'digest', theme, 100 + i)));
  // 技术
  const techPlans = [];
  tech.specific.forEach((t, i) => {
    techPlans.push(() => buildTech(F, t.t, 0, i, false));
    techPlans.push(() => buildTech(F, t.t, 1, i, false));
  });
  tech.generic.forEach((g, i) => techPlans.push(() => buildTech(F, g, i % 2, 200 + i, true)));
  // 版本
  const releasePlans = [];
  F.versions.forEach((v, i) => {
    releasePlans.push(() => buildRelease(F, 'version', v, i));
    releasePlans.push(() => buildRelease(F, 'version', v, i + 50));
  });
  RELEASE_EXTRA[F.key].forEach((t, i) => releasePlans.push(() => buildRelease(F, 'note', t, 300 + i)));
  // 种草
  const xhsPlans = [];
  F.scenarios.forEach((s, i) => xhsPlans.push(() => buildXhs(F, s, 'scenario', i)));
  F.features.slice(0, isWeb ? 26 : (F.key === 'chayuan-office' ? 13 : F.key === 'chayuan-os' ? 17 : 24)).forEach((f, i) => xhsPlans.push(() => buildXhs(F, f, 'feature', 100 + i)));
  F.combos.slice(0, 3).forEach((c, i) => xhsPlans.push(() => buildXhs(F, c, 'combo', 200 + i)));

  // 组装顺序：plans(kw+install), feature, resource(web), scenario, industry, compare, faq, tech, release, xhs, extraFeature
  const ordered = [
    plans, featurePlans, resourcePlans, scenarioPlans, industryPlans, comparePlans, faqPlans, techPlans, releasePlans, xhsPlans,
  ];
  // 计算已有数量并用进阶角度的功能文补齐到目标篇数
  const current = ordered.reduce((s, g) => s + g.length, 0);
  let extras = Math.max(0, target - current);
  const extraFeature = [];
  let ai = 4, fi = 0;
  while (extras-- > 0) {
    const fIdx = fi % F.features.length, ang = ai, seq = fi;
    extraFeature.push(() => buildFeature(F, F.features[fIdx], ang, 500 + seq));
    fi++; if (fi % F.features.length === 0) ai++;
  }
  const groupCat = [null, 2, isWeb ? 3 : 2, isWeb ? 4 : 3, isWeb ? 5 : 4, 5, 6, 7, 8, 9];
  const flat = [];
  ordered.forEach((g, gi) => {
    if (gi === 0) flat.push(...g);
    else g.forEach((fn) => flat.push({ builder: fn, catOverride: groupCat[gi] }));
  });
  extraFeature.forEach((fn) => flat.push({ builder: fn, catOverride: 2 }));
  return flat;
}

// ---------- 主流程 ----------
async function main() {
  const all = [];
  for (const F of FACTS) {
    const flat = planProduct(F, TARGETS[F.key]);
    const cats = F.key === 'website' ? CATS.web : CATS.wpsLike;
    const drafts = [];
    for (const item of flat) {
      const d = item.builder();
      if (item.catOverride !== undefined && item.catOverride !== null) d.catIdx = item.catOverride;
      d.F = F; d.cat = cats[d.catIdx] || cats[2];
      drafts.push(d);
      if (drafts.length > TARGETS[F.key]) break;
    }
    drafts.length = TARGETS[F.key];
    all.push({ F, cats, drafts });
  }

  // 相关阅读链接分配
  const byProductFolder = {};
  for (const { F, drafts } of all) byProductFolder[F.folder] = drafts;
  for (let pi = 0; pi < all.length; pi++) {
    const { F, drafts } = all[pi];
    const other = all[(pi + 1) % all.length];
    drafts.forEach((d, i) => {
      const same = drafts.filter((x, j) => j !== i && x.cat === d.cat);
      const others = drafts.filter((x, j) => j !== i && x.cat !== d.cat);
      const picks = [...pickN(rng(`rel-${F.key}-${i}`), same, 3), ...pickN(rng(`rel2-${F.key}-${i}`), others, 2)];
      d.related = picks.map((p) => ({ title: p.title, path: `../${encodeURIComponent(p.cat)}/${p.slug}.md` }));
      const od = other.drafts[(i * 3) % other.drafts.length];
      d.related.push({ title: `${od.F.name}｜${od.title}`, path: `../../${od.F.folder}/${encodeURIComponent(od.cat)}/${od.slug}.md` });
    });
  }

  // 写文件
  const stats = { total: 0, byProduct: {}, minCjk: Infinity, fail: [] };
  const csv = [['序号', '产品', '类别', '文件', '标题', '主关键词', '关键词', '渠道'].join(',')];
  for (const { F, cats, drafts } of all) {
    const pStats = {};
    for (const d of drafts) {
      const dir = path.join(OUT, F.folder, d.cat);
      fs.mkdirSync(dir, { recursive: true });
      let md, cjk;
      if (d.type === 'xhs') {
        d.altTitles = [
          `${d.primaryKw}真的有用吗？我的判断标准`,
          `别再硬扛了｜${d.primaryKw}的省事路线`,
        ];
        const buildXhsMd = () => assembleXhs({ F, title: d.title, altTitles: d.altTitles, desc: d.desc, keywords: d.keywords, primaryKw: d.primaryKw, lead: d.lead, sections: d.sections, faqs: d.faqs, r: d.r });
        // 小红书版字数兜底：逐段补内容直至达标
        let out = buildXhsMd();
        const padPool = [
          { h2: '更多它擅长的事', body: pickN(d.r, F.features, 3).map((f) => `· **${f.name}**：${f.what}`).join('\n') },
          { h2: '断网也能用？这点很关键', body: pick(d.r, F.offlineParas) },
          { h2: '数据安全要知道的', body: F.privacyPoints.slice(0, 3).map((p) => `· ${p}`).join('\n') },
          { h2: '免费还是要花钱', body: `${F.activation.model}。免费部分：${F.activation.free}。` },
          { h2: '说点大实话（缺点）', body: F.cons.slice(0, 3).map((p) => `· ${p}`).join('\n') },
          { h2: '延伸了解', body: `${F.positioning}` },
          ...F.features.slice(4, 12).reduce((acc, f, i) => {
            if (i % 2 === 0) acc.push({ h2: `还有这些能力（${Math.floor(i / 2) + 1}）`, body: `· **${f.name}**：${f.what}${F.features[i + 5] ? `\n· **${F.features[i + 5].name}**：${F.features[i + 5].what}` : ''}` });
            return acc;
          }, []),
        ];
        while (out.cjk < 1120 && padPool.length) {
          d.sections.push(padPool.shift());
          out = buildXhsMd();
        }
        md = frontmatter({ title: d.title, altTitles: d.altTitles, desc: d.desc, keywords: d.keywords, product: F.key, category: d.cat, primaryKw: d.primaryKw, channel: d.channel }) + out.md;
        cjk = out.cjk;
      } else {
        // 生成两个备选标题
        d.altTitles = [
          `${d.primaryKw}｜${F.short}${pick(d.r, ['经验帖', '上手笔记', '干货合集'])}`,
          `关于${d.primaryKw}，看这一篇就够（${F.name}）`,
        ];
        ({ md, cjk } = assemble({ F, title: d.title, altTitles: d.altTitles, desc: d.desc, keywords: d.keywords, primaryKw: d.primaryKw, channel: d.channel, lead: d.lead, sections: d.sections, faqs: d.faqs, related: d.related, r: d.r }));
        md = frontmatter({ title: d.title, altTitles: d.altTitles, desc: d.desc, keywords: d.keywords, product: F.key, category: d.cat, primaryKw: d.primaryKw, channel: d.channel }) + md;
      }
      const banned = findBanned(md);
      if (banned.length) stats.fail.push({ file: `${F.folder}/${d.cat}/${d.slug}.md`, banned });
      if (cjk < 1000) stats.fail.push({ file: `${F.folder}/${d.cat}/${d.slug}.md`, cjk });
      stats.minCjk = Math.min(stats.minCjk, cjk);
      fs.writeFileSync(path.join(dir, `${d.slug}.md`), md);
      stats.total++; pStats[d.cat] = (pStats[d.cat] || 0) + 1;
      csv.push([stats.total, F.name, d.cat, `${F.folder}/${d.cat}/${d.slug}.md`, `"${d.title.replace(/"/g, '”')}"`, d.primaryKw, `"${d.keywords.join(', ')}"`, d.channel].join(','));
    }
    // 产品 README 索引
    const lines = [`# ${F.name} 网文库索引`, '', `> 定位：${F.tagline}`, `> 官网：${F.site}｜出品：${F.vendor}`, '', `共 ${drafts.length} 篇，按类别分目录。`, ''];
    for (const c of cats) {
      const inCat = drafts.filter((d) => d.cat === c);
      if (!inCat.length) continue;
      lines.push(`## ${c}（${inCat.length} 篇）`, '');
      for (const d of inCat) lines.push(`- [${d.title}](${encodeURIComponent(c)}/${d.slug}.md)｜主词：${d.primaryKw}`);
      lines.push('');
    }
    fs.writeFileSync(path.join(OUT, F.folder, 'README.md'), lines.join('\n'));
    stats.byProduct[F.name] = { total: drafts.length, cats: pStats };
  }
  fs.writeFileSync(path.join(OUT, 'strategy', '04-文章规划总表.csv'), '\ufeff' + csv.join('\n'));

  // 相似度抽样（12 字 shingle Jaccard）
  const files = [];
  for (const { F, drafts } of all) for (const d of drafts) files.push({ p: path.join(OUT, F.folder, d.cat, `${d.slug}.md`), d });
  const shingles = (t) => { const s = new Set(); const c = (t.match(/[\u4e00-\u9fff]/g) || []).join(''); for (let i = 0; i + 12 <= c.length; i += 6) s.add(c.slice(i, i + 12)); return s; };
  let maxJ = 0, pairFound = '';
  const rr = rng('sim-check');
  for (let k = 0; k < 300; k++) {
    const a = files[Math.floor(rr() * files.length)], b = files[Math.floor(rr() * files.length)];
    if (!a || !b || a === b || a.d.F.key !== b.d.F.key) continue;
    const sa = shingles(fs.readFileSync(a.p, 'utf8')), sb = shingles(fs.readFileSync(b.p, 'utf8'));
    let inter = 0; for (const x of sa) if (sb.has(x)) inter++;
    const j = inter / (sa.size + sb.size - inter || 1);
    if (j > maxJ) { maxJ = j; pairFound = `${a.p} vs ${b.p}`; }
  }

  console.log(JSON.stringify({ total: stats.total, minCjk: stats.minCjk, byProduct: stats.byProduct, failCount: stats.fail.length, failSample: stats.fail.slice(0, 10), simMax: maxJ.toFixed(3), simPair: pairFound }, null, 2));
  if (stats.fail.length) { console.error('存在不达标文章，见 failSample'); process.exitCode = 1; }
}
main();
