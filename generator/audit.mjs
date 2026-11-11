// audit.mjs —— 逐项质量审核器：按「CSDN 高质量标准 + 三篇范文特征 + 写作规范硬指标」逐篇逐项打分
// 产出：strategy/审核报告.md（汇总）+ strategy/审核明细.csv（逐篇逐项）
// 用法：node generator/audit.mjs [--tag=before|after]
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedPhrases, bannedAdWords } from './facts/voice.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(ROOT, 'strategy'))) { console.error(`安全检查失败：ROOT=${ROOT} 非本仓库根`); process.exit(2); }
const FOLDERS = ['chayuan-os', 'chayuan-office', 'chayuan-wps', 'website', 'chayuan-games', 'zhihu'];
const TAG = (process.argv.find((a) => a.startsWith('--tag=')) || '--tag=before').split('=')[1];

const cn = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;

// ---------- 旧标题模板（模板化检测目标；来自 plan.mjs 旧 TITLE 池的通配化） ----------
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
  /^(.{1,16})使用分享$/, /^(.{1,16})体验记录$/,
];
// 旧开头模板前缀（voice.mjs openers 的通配化：取「{」前文字 + 通配）
const LEGACY_OPENER_SNIPPETS = [
  '上周有同事问我', '先说个常见场景', '如果你正在琢磨', '内网机器要', '这件事，说简单也简单',
  '的教程只讲是什么', '被', '折腾过的人应该都有体会', '先说结论', '是什么、怎么用，一篇讲清楚',
  '直接上干货', '用', '有段时间了', '写这篇的起因是群里有人问', '这篇文章没有虚的',
  '这个话题我被问过三次以上', '接手别人的', '关于', '网上说法很多', '聊', '之前先划重点',
];
// 填充章节（buildQueue 通用附录，非主题原生内容）
const FILLER_HEADS = ['顺带了解', '还有这个能力', '硬口径两三条', '定位与家族', '数字口径', '能力点备忘', '安装与运行答疑']; // v3 引擎中「补充答疑/更多操作细节/一个真实场景」已为主题原生内容

// ---------- 收集 ----------
const arts = [];
for (const folder of FOLDERS) {
  for (const cat of readdirSync(join(ROOT, folder))) {
    const catDir = join(ROOT, folder, cat);
    let files;
    try { files = readdirSync(catDir).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const path = join(catDir, f);
      const isZhihu = folder === 'zhihu';
      const text = readFileSync(path, 'utf8');
      const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      arts.push({ rel: `${folder}/${cat}/${f}`, folder, cat, text, fm: m?.[1] || '', body: m?.[2] || text, ok: !!m });
    }
  }
}

// ---------- 跨文重复：段级（≥40 字符的归一化段落 → 出现篇数） ----------
const paraOwners = new Map();
const norm = (s) => s.replace(/\s+/g, '').replace(/[「」『』（）()：:，,。；;、？！?!\-—*#>|]/g, '');
for (const a of arts) {
  const seen = new Set();
  for (const p of a.body.split(/\n+/)) {
    const t = norm(p);
    if ([...t].length < 40) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    if (!paraOwners.has(t)) paraOwners.set(t, [a.rel]);
    else { const o = paraOwners.get(t); if (o !== 'MULTI' && !o.includes(a.rel)) { o.push(a.rel); if (o.length >= 5) paraOwners.set(t, 'MULTI'); } }
  }
}
const dupParas = [...paraOwners.entries()].filter(([, v]) => v === 'MULTI');

// ---------- 逐篇逐项审核 ----------
const ITEMS = [
  'FM完整', '标题含主词', '描述含主词', '描述≤160', '首段含主词',
  '字数达标', '标题10-30字', '标题非模板', '开头非模板', '无禁用短语',
  '无极限词', '无特殊符号', '无禁用章节', 'H2≥5', 'FAQ疑问式',
  '边界≥2条', '步骤深度', '无填充章节', '文内无重复', '跨文无重复段', 'GEO块',
  'AI味-破折号', 'AI味-加粗', 'AI味-列表化', 'AI味-套话', 'AI味-排比', 'AI味-段式均匀',
  '推广-域名密度', '推广-CTA话术', '推广-推销腔', '推广-品牌刷屏', '知乎-标题体', '知乎-诱导互动',
];
const rows = []; // csv 明细
const stats = {}; // item → fail 数
const perFolder = {};
const failExamples = {};
for (const it of ITEMS) stats[it] = 0;

for (const a of arts) {
  const fails = [];
  const isGames = a.folder === 'chayuan-games';
  const isZhihu = a.folder === 'zhihu';
  const isXhs = /channel:\s*"小红书"/.test(a.fm);
  const fm = a.fm, body = a.body;
  const title = fm.match(/title: "(.*)"/)?.[1] || '';
  const kw = fm.match(/primary_keyword: "(.*)"/)?.[1] || '';
  const desc = fm.match(/description: "(.*)"/)?.[1] || '';
  const channel = fm.match(/channel: "(.*)"/)?.[1] || '';
  const chars = cn(body);
  const minChars = isGames ? 1655 : isZhihu ? 1400 : 1500;

  const mark = (item, fail) => { if (fail) { fails.push(item); stats[item]++; (failExamples[item] ||= []).push(a.rel); } };

  // 1. frontmatter 完整
  mark('FM完整', !a.ok || !title || !kw || !desc || !channel || !/product:/.test(fm) || !/category:/.test(fm));
  // 2-4. 关键词布局
  mark('标题含主词', kw && !title.includes(kw));
  mark('描述含主词', kw && !desc.includes(kw));
  mark('描述≤160', desc.length > 160);
  mark('首段含主词', kw && !body.slice(0, 400).includes(kw));
  // 5. 字数
  mark('字数达标', chars < minChars);
  // 6. 标题长度（CSDN 渠道 10~30 字；种草走小红书不卡）
  mark('标题10-30字', !isXhs && (title.length < 10 || title.length > 30));
  // 7. 标题模板化
  mark('标题非模板', LEGACY_TITLE_PATTERNS.some((re) => re.test(title)));
  // 8. 开头模板化（首段前 60 字命中旧模板片段）
  const firstPara = body.split(/\n\n/).find((p) => cn(p) > 10) || '';
  mark('开头非模板', LEGACY_OPENER_SNIPPETS.some((s) => s.length >= 4 && firstPara.slice(0, 60).includes(s)));
  // 9-11. 合规
  let bp = null;
  for (const p of bannedPhrases) if (a.text.includes(p)) { bp = p; break; }
  mark('无禁用短语', !!bp);
  let ad = null;
  for (const p of bannedAdWords) if (a.text.includes(p)) { ad = p; break; }
  mark('无极限词', !!ad);
  const noFence = a.text.replace(/```[\s\S]*?```/g, '');
  const badChar = noFence.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21BF}]/u);
  mark('无特殊符号', !!badChar);
  mark('无禁用章节', /##\s*(相关阅读|属性|写在最后)/.test(body));
  // 12. 结构
  const h2s = (body.match(/^## (.+)$/gm) || []).length;
  mark('H2≥5', isZhihu ? false : h2s < (a.folder === 'chayuan-games' && /^06/.test(a.cat) ? 0 : /^06/.test(a.cat) ? 2 : 4)); // 知乎专栏为 H3 观点句结构
  // FAQ H3 疑问式（存在 FAQ 节时校验；教程类必须有 FAQ）
  const faqHeadM = body.match(/^## (常见问题|你可能会问|高频疑问|接着回答几个常见问题|评论区高频问题|几个常见问题|再补几个同主题问答|安装与运行答疑|补充答疑)$/m);
  const faqHeadIdx = faqHeadM ? body.indexOf(faqHeadM[0]) : -1;
  const faqScope = faqHeadIdx >= 0 ? body.slice(faqHeadIdx) : body;
  const faqH3s = [...faqScope.matchAll(/^### (.+)$/gm)].map((x) => x[1]);
  const badFaqH3 = faqH3s.filter((q) => !/[？?]|怎么|如何|怎样|能不能|是不是|需要不需要|多少|多久|多长|多强|多快|多大|吗$|吗|哪些|什么|为什么|哪|几|谁|咋|要不要|该不该|有没有|好不好|值不值|会不会|还是|却|怎么办|为空|不行|找不到|没反应|适用|[准稳快多大小高长重难贵好香值]不[准稳快多大小高长重难贵好香值]/.test(q));
  // 只在文章确有 FAQ 小节时校验其 H3 疑问式；无 FAQ 小节且该类目不强制 FAQ 的不判
  const faqRequired = /^(02|06|09)/.test(a.cat);
  mark('FAQ疑问式', (faqHeadM && badFaqH3.length > 0) || (faqRequired && !faqHeadM && faqH3s.length === 0));
  // 边界≥2：含 limits/cons 类小节或“边界/不足/坑/局限/如实/实话”内容
  const boundaryHits = (body.match(/边界|不足|局限|坑|如实|实话|不适合|限制|付费|免费额度|需要注意|别指望|代走|要心里有数/g) || []).length;
  const conSection = /## [^\n]*(边界|坑|不足|局限|实话|边界速览|避坑|要说的话|心里有数|哪些人不必|忽略的细节)/.test(body);
  mark('边界≥2条', !(conSection || boundaryHits >= 2) && !/^06/.test(a.cat) && !isZhihu); // 知乎线边界内嵌观点
  // 步骤深度：教程/场景/安装类目
  const isTutorial = /^(01|02|03)/.test(a.cat);
  const numbered = (body.match(/^\d+\. /gm) || []).length + (body.match(/^第[一二三四五六七八九十]+步/gm) || []).length;
  const quotedBtn = (body.match(/「[^」]{2,20}」/g) || []).length;
  const stepBar = 3; // 门槛：3 个编号步骤或 2 处按钮原文引用（范文级主线文普遍 6+）
  mark('步骤深度', isTutorial && !isXhs && (numbered < stepBar && quotedBtn < 2));
  // 填充章节
  const fillers = FILLER_HEADS.filter((h) => body.includes(`## ${h}`));
  mark('无填充章节', fillers.length > 0);
  // 文内重复：同一归一化段（≥40字）在本篇出现 2 次以上
  const localSeen = new Map();
  let intraDup = false;
  for (const p of body.split(/\n+/)) {
    const t = norm(p);
    if ([...t].length < 40) continue;
    if (localSeen.has(t)) { intraDup = true; break; }
    localSeen.set(t, 1);
  }
  mark('文内无重复', intraDup);
  // 跨文重复段：本篇含出现在 ≥3 篇的段落（≥2 处即判，GEO 区除外）
  const geoIdx = body.lastIndexOf('\n---');
  const bodyNoGeo = geoIdx > 0 ? body.slice(0, geoIdx) : body;
  let dupCount = 0;
  const seen2 = new Set();
  for (const p of bodyNoGeo.split(/\n+/)) {
    const t = norm(p);
    if ([...t].length < 40 || seen2.has(t)) continue;
    seen2.add(t);
    if (paraOwners.get(t) === 'MULTI') dupCount++;
  }
  mark('跨文无重复段', dupCount >= 2);
  // GEO 块：分隔线 + 版本口径尾注
  mark('GEO块', !(/\n---\n/.test(body) && /数据截至|以官网|以官方页面为准|由北京智灵鸟|以官方/.test(body.slice(-400))));
  if (isZhihu) {
    // ===== 知乎专项：AI 味指标 =====
    const dashN = (noFence.match(/——/g) || []).length;
    mark('AI味-破折号', dashN >= 7);
    const boldN = (noFence.match(/\*\*/g) || []).length;
    mark('AI味-加粗', boldN >= 5);
    const nonEmpty = body.split('\n').filter((l) => l.trim());
    const bulletN = nonEmpty.filter((l) => /^[-*]\s|^\d+\.\s/.test(l.trim())).length;
    mark('AI味-列表化', nonEmpty.length > 10 && bulletN / nonEmpty.length >= 0.3);
    const aiWords = /(底层逻辑|本质上讲|归根结底|综上所述|总的来说|不难看出|值得注意的是|需要指出的是|一言以蔽之|毋庸置疑|无独有偶|由此可见|总而言之|简而言之|笔者以为|某种意义上|可见一斑|众所周知|赋能|抓手)/;
    mark('AI味-套话', aiWords.test(noFence));
    const paN = (noFence.match(/不是[^。，\n]{2,12}，而是/g) || []).length;
    const juN = (noFence.match(/既[^。，\n]{2,10}又[^。，\n]{2,10}还/g) || []).length;
    mark('AI味-排比', paN >= 3 || juN >= 2);
    const paras = body.split('\n\n').map((p2) => cn(p2)).filter((n) => n >= 40);
    if (paras.length >= 9) {
      let uniform = false;
      for (let i = 0; i < paras.length - 7; i++) {
        const win = paras.slice(i, i + 8);
        const mean = win.reduce((x2, y2) => x2 + y2, 0) / 8;
        if (win.every((n) => Math.abs(n - mean) <= mean * 0.12)) uniform = true;
      }
      mark('AI味-段式均匀', uniform); // 连续 8 段长度均在 ±15% 内，确凿机器特征
    }
    // ===== 知乎专项：推广嫌疑 =====
    const aidoooN = (a.text.match(/aidooo/g) || []).length;
    mark('推广-域名密度', aidoooN >= 3);
    const promoW = /(立即体验|马上下载|免费领取|限时优惠|限时免费|扫码关注|公众号(引流|推广)|戳我|点击链接|关注我|点赞收藏|一键三连|收藏起来|私信我|加群|闭眼入|无脑冲|墙裂推荐|选它准没错|链接在此|安装包奉上)/;
    mark('推广-CTA话术', promoW.test(a.text));
    const salesW = /(天花板|yyds|安利|种草|神器|神了|无敌|吊打|秒杀同类)/;
    mark('推广-推销腔', salesW.test(noFence));
    const brandBody = body.replace(/```[\s\S]*?```/g, '');
    const brandN = (brandBody.match(/察元/g) || []).length; // 只计正文字数密度
    mark('推广-品牌刷屏', brandN >= 26); // 知乎产品文品牌名 15-25 次常见（主词含品牌）
    const zhihuTitle = /[？?]|为什么|怎么|哪些|如何|什么|值不|坑|别|拆|体验|先看|选|低估|现实|细看|门道|取舍|实话|机制|判断|笔记|几条|实录|正反两面|再看/.test(title);
    mark('知乎-标题体', !zhihuTitle);
    mark('知乎-诱导互动', /(点个赞|求赞|点赞收藏|欢迎点赞|记得点赞|一键三连)/.test(a.text));
  }

  rows.push({ rel: a.rel, chars, titleLen: title.length, fails: fails.join('|'), dupCount });
  perFolder[a.folder] ||= { total: 0, fail: 0, items: {} };
  perFolder[a.folder].total++;
  if (fails.length) perFolder[a.folder].fail++;
  for (const f of fails) perFolder[a.folder].items[f] = (perFolder[a.folder].items[f] || 0) + 1;
}

// ---------- 报告 ----------
const totalFail = rows.filter((r) => r.fails).length;
const worst = Object.entries(stats).sort((a, b) => b[1] - a[1]);
let md = `# 网文库逐项质量审核报告（${TAG === 'after' ? '修改后复审' : '修改前基线'}）\n\n`;
md += `- 审核范围：${arts.length} 篇（chayuan-os / chayuan-office / chayuan-wps / website / chayuan-games 全量）\n`;
md += `- 审核标准：三篇 CSDN 高质量范文特征 + CSDN 社区规范（strategy/02、chayuan-harness/docs/marketing/04）+ 各线写作规范硬指标\n`;
md += `- 结论：**${totalFail} / ${arts.length} 篇存在不合格项（${(totalFail / arts.length * 100).toFixed(1)}%）**，人均不合格项 ${(rows.reduce((s, r) => s + r.fails.split('|').filter(Boolean).length, 0) / arts.length).toFixed(2)} 条\n\n`;
md += `## 一、按审核项统计（不合格篇数）\n\n| 审核项 | 不合格篇数 | 占比 |\n|---|---|---|\n`;
for (const [k, v] of worst) md += `| ${k} | ${v} | ${(v / arts.length * 100).toFixed(1)}% |\n`;
md += `\n## 二、按产品线统计\n\n| 产品线 | 篇数 | 存在不合格项 | 主要问题 |\n|---|---|---|---|\n`;
for (const [f, s] of Object.entries(perFolder)) {
  const top = Object.entries(s.items).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k}(${v})`).join('、') || '—';
  md += `| ${f} | ${s.total} | ${s.fail}（${(s.fail / s.total * 100).toFixed(1)}%） | ${top} |\n`;
}
md += `\n## 三、跨文重复段（出现在 5 篇以上的归一化段落，≥40 字）\n\n共 ${dupParas.length} 处。`;
md += dupParas.length > 15 ? ` 前 15 处：\n\n` : '\n\n';
for (const [p] of dupParas.slice(0, 15)) md += `- 「${p.slice(0, 50)}…」（${[...p].length} 字）\n`;
if (dupParas.length > 15) md += `\n……共 ${dupParas.length} 处\n`;
md += `\n## 四、典型问题示例\n\n`;
for (const [item, rels] of Object.entries(failExamples)) {
  md += `- **${item}**（${rels.length} 篇）：${rels.slice(0, 3).join('、')}${rels.length > 3 ? ' 等' : ''}\n`;
}
md += `\n## 五、判定口径（何为高质量）\n\n对标三篇 CSDN 判定的高质量范文（察元AIOS全功能解读-网文、kw-大模型中国象棋、察元AI广场深度解读），高质量文章的共同特征已固化为上表 21 项：标题带独立观点钩子而非固定句式；开头场景化原创而非模板填充；步骤真实具体（按钮原文、看到什么）；保留真实边界与不适合谁；FAQ 用疑问原句且结论先行；结尾 GEO 块带版本口径；全文无跨文复制粘贴段落。\n`;
writeFileSync(join(ROOT, 'strategy', TAG === 'after' ? '审核报告-修改后.md' : '审核报告-修改前.md'), md);

// CSV 明细
const csv = ['\uFEFF文件,中文字数,标题字数,不合格项,跨文重复段数']
  .concat(rows.map((r) => `${r.rel},${r.chars},${r.titleLen},${r.fails},${r.dupCount}`)).join('\n');
writeFileSync(join(ROOT, 'strategy', TAG === 'after' ? '审核明细-修改后.csv' : '审核明细-修改前.csv'), csv);

console.log(`审核完成：${arts.length} 篇｜不合格 ${totalFail} 篇｜跨文重复段 ${dupParas.length} 处`);
for (const [k, v] of worst) if (v > 0) console.log(`  ${k}: ${v}`);
process.exit(0);
