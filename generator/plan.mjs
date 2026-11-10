// plan.mjs —— 文章规划器：产出全库文章清单（产品/类别/文件名/标题/主关键词/文型/主题引用）
// 文型（archetype）轮转保证同主题多篇变体结构互不相同：
//   A=上手教程 B=深度解析 C=场景实战 D=排错进阶 E=关键词释义 F=对比评测 G=FAQ合集 H=版本发布 I=行业方案 J=安装指南 K=种草
import { PRODUCTS } from './facts/products.mjs';
import topicsOS from './facts/topics-os.mjs';
import topicsOffice from './facts/topics-office.mjs';
import topicsWps from './facts/topics-wps.mjs';
import topicsWeb from './facts/topics-web.mjs';
import { scenarios, comparisons, industries, pillars, faqClusters } from './facts/topics-extra.mjs';

const TOPICS = { 'chayuan-os': topicsOS, 'chayuan-office': topicsOffice, 'chayuan-wps': topicsWps, website: topicsWeb };
const PRODUCT_NAME = { 'chayuan-os': '察元AI OS', 'chayuan-office': '察元AI Office', 'chayuan-wps': '察元AI文档助手', website: '察元AI 能力广场' };

// ---------- 标题系统 v3：角度驱动（对标范文「主词 + 冒号 + 观点钩子」句式） ----------
// 钩子从主题真实数据（教程定义句/why/能力点/场景/提问）提炼，同主题各变体取不同钩子源，
// 彻底废除「40 个固定句式轮换」的模板化标题（CSDN 同质化判定主因）。
import { readFileSync as _rf } from 'node:fs';
function _loadJson(f) {
  try { return JSON.parse(_rf(new URL(`./facts/harvested/${f}`, import.meta.url), 'utf8')); } catch { return []; }
}
const _HARVEST = {
  'chayuan-os': _loadJson('os-tutorials.json'),
  'chayuan-office': _loadJson('office-tutorials.json'),
  'chayuan-wps': _loadJson('wps-tutorials.json'),
};
const _cjk = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;
// 短语化：优先取完整子句（首个句读前的部分），超长时宁可弃用也不腰斩
function _phrase(s, max) {
  let t = String(s || '').replace(/^[-*\d.\s]+/, '').trim();
  const stop = [':', '：', '，', '；', '。', '？', '！', '—', '（', '('].map((c) => t.indexOf(c)).filter((n) => n > 4).sort((a, b) => a - b)[0];
  if (stop !== undefined) t = t.slice(0, stop);
  if ([...t].length > max) {
    const slice = [...t].slice(0, max).join('');
    const idx = Math.max(slice.lastIndexOf('、'), slice.lastIndexOf('，'));
    t = idx > 8 ? [...t].slice(0, idx).join('') : null; // 找不到自然边界就弃用该钩子
  }
  return t ? t.replace(/[，。；：、！？\s]+$/, '') : '';
}
// 主词与钩子的相关度（二元组重合），防「钩子讲的是别的事」
function _rel(a, b) {
  const f = (s) => { const t = String(s || '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''); const set = new Set(); for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2)); return set; };
  const A = f(a), B = f(b);
  if (!A.size || !B.size) return 0;
  let hit = 0; for (const g of A) if (B.has(g)) hit++;
  return hit / A.size;
}
// 某行文章语境（主题/教程/场景/对比/版本/安装/种草引用）能提供的钩子池
function hookPool(ctx, strict = true) {
  const { topic, tut, sc, cp, v, ind, ins, xh, tech, kw, P } = ctx;
  const anchor = `${kw}${topic?.name || ''}`;
  const pool = [];
  const push = (s, n, needRel = 0.05) => {
    const p = _phrase(s, n);
    if (_cjk(p) < 5 || pool.includes(p)) return;
    if (strict && needRel > 0 && _rel(p, anchor) < needRel) return;
    pool.push(p);
  };
  // 顺序即优先级：教程定义句 > why（观点钩子）> 真实提问 > 场景 > 产品定位 > 能力点/边界
  if (tut?.one) push(tut.one, 20, 0.08);
  if (topic?.why) push(topic.why, 16, 0.08);
  if (tut?.asks?.[0]) push(tut.asks[0].replace(/[？?]$/, ''), 16, 0.08);
  if (sc?.pains?.[0]) push(sc.pains[0], 14, 0.06);
  if (sc?.gain) push(sc.gain, 16, 0.06);
  if (P?.tagline) push(P.tagline, 16, 0.05);
  // 产品级钩子（支柱词匹配不到主题时的主力；数字口径/边界的第一子句都是好钩子）
  Object.values(P?.numbers || {}).slice(0, 6).forEach((n) => push(n, 14, 0.03));
  (P?.cons || []).slice(0, 3).forEach((n) => push(n, 14, 0.03));
  if (topic?.what) push(topic.what, 18, 0.1);
  if (cp?.t) push(cp.t, 16, 0.05);
  if (v?.highlights?.[0]) push(v.highlights[0], 16, 0.04);
  if (ins?.blurb) push(ins.blurb, 14, 0.04);
  if (xh?.angle) push(xh.angle, 16, 0.04);
  if (tech?.angle) push(tech.angle, 18, 0.04);
  if (ind) push(`${ind}里最吃重的那段流程`, 12, 0);
  (topic?.scenes || []).slice(0, 2).forEach((c) => push(c, 14, 0.06));
  (topic?.caps || []).slice(0, 4).forEach((c) => push(c, 12, 0.06));
  (topic?.limits || []).slice(0, 1).forEach((c) => push(c, 14, 0.06));
  if (!pool.length) push(`${kw}的完整链路`, 12, 0);
  return pool;
}
// 连接句式池：{kw}=主关键词 {h}=钩子。钩子可缺席的句式以 {h?} 标注
const TITLE = {
  A: ['{kw}：{h}', '{kw}实操，{h}', '{h}：{kw}完整走法', '{kw}怎么做：{h}', '从入口到验证：{kw}', '{kw}：{h}，一次走通'],
  B: ['{kw}：{h}', '拆开看{kw}：{h}', '{kw}的设计取舍：{h}', '{h}：{kw}的底层逻辑', '{kw}为什么这样工作：{h}'],
  C: ['{kw}实战：{h}', '{h}：用{kw}跑通一个真实场景', '{kw}落地记：{h}', '从需求到交付：{kw}', '{kw}场景拆解：{h}'],
  D: ['{kw}排错：{h}', '{kw}出问题先看这：{h}', '{h}：{kw}的坑与对策', '{kw}排查路径：{h}', '{kw}：{h}，别再瞎试'],
  E: ['{kw}：{h}', '一文分清{kw}：{h}', '{kw}是什么：{h}', '{h}：{kw}概念与上手', '{kw}入门指南：{h}'],
  F: ['{kw}对比：{h}', '{kw}怎么选：{h}', '{h}：{kw}逐维度对比', '{kw}评测：{h}'],
  G: ['{kw}高频问答：{h}', '{kw}：{h}，一次说清', '关于{kw}：{h}'],
  H: ['{kw}更新：{h}', '{kw}发布解读：{h}', '{kw}：{h}，这次改了什么'],
  I: ['{kw}：{h}', '{kw}落地：{h}', '{h}：{kw}路径与边界'],
  J: ['{kw}：{h}', '{kw}安装：{h}', '{kw}装机指南：{h}'],
  K: ['{kw}：{h}', '{kw}两周记录：{h}', '{kw}：{h}，说实话'],
};
function _hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function buildTitle(ar, kw, ctx, salt) {
  const pool = hookPool(ctx).filter((h) => !h.includes(kw) && !kw.includes(h));
  const pats = TITLE[ar];
  const seed = _hash(kw + (salt || '') + (ctx.topic?.id || ''));
  const maxLen = ar === 'K' ? 22 : 30; // 小红书笔记标题 ≤20 字上下
  const minLen = ar === 'K' ? 6 : 10;
  const pat = pats[seed % pats.length];
  // 钩子按种子轮转取，同主题多变体天然错开
  const hook = pool.length ? pool[(seed >> 3) % pool.length] : '';
  let t = pat.replaceAll('{kw}', kw).replaceAll('{h}', hook);
  // 长度治理
  if ([...t].length > maxLen) {
    const fresh = hookPool(ctx).filter((h) => !h.includes(kw) && !kw.includes(h) && [...h].length <= maxLen - [...kw].length - 1);
    t = fresh.length ? `${kw}：${fresh[seed % fresh.length]}` : `${kw}`.slice(0, maxLen);
    if ([...t].length > maxLen) t = [...t].slice(0, maxLen).join('');
  }
  t = t.replace(/[：:]\s*$/, '');
  if ([...t].length < minLen) {
    const any = hookPool(ctx, false).filter((h) => !h.includes(kw) && !kw.includes(h));
    const h = any[seed % Math.max(1, any.length)];
    const conn = ar === 'K' ? '两周记录' : ['怎么用', '是什么', '实操指南', '上手笔记'][(seed >> 5) % 4];
    t = h ? `${kw}${conn}：${h}` : `${kw}${conn}：一文讲透`;
  }
  return t.replace(/\s+/g, ' ').trim();
}

const usedTitles = new Set();
const usedKws = new Set();
function uniqTitle(t) {
  let base = t, i = 2;
  while (usedTitles.has(base)) { base = `${t}（${i++}）`; }
  usedTitles.add(base);
  return base;
}
function uniqKw(kw, fallbackPool) {
  if (!usedKws.has(kw)) { usedKws.add(kw); return kw; }
  for (const f of fallbackPool) {
    const c = `${kw}${f}`;
    if (!usedKws.has(c)) { usedKws.add(c); return c; }
  }
  let i = 2, c = kw;
  while (usedKws.has(c)) c = `${kw}${i++}`;
  usedKws.add(c);
  return c;
}

let seq = 0;
function row(product, category, file, kw, kws, archetype, topicId, refs = {}) {
  seq += 1;
  // 先定稿唯一主关键词，再生成标题（保证标题一定含主关键词）；keywords 去重
  const finalKw = uniqKw(kw, ['实操', '指南', '教程', '详解', '方法']);
  const topic = TOPICS[product].find((t) => t.id === topicId) || null;
  const tut = _HARVEST[product]?.find((t) => t.id === topic?.tut) || null;
  const ctx = {
    topic, tut, kw: finalKw, P: PRODUCTS[product],
    ins: refs.install, v: refs.version, ind: refs.industry, tech: refs.tech, xh: refs.xhs,
    cp: comparisons[product]?.[refs.compareIdx] || null,
    sc: scenarios[product]?.find((s) => s.id === refs.scenario) || null,
  };
  const title = uniqTitle(buildTitle(archetype, finalKw, ctx, file));
  const dedupKws = [...new Set([finalKw, ...kws.filter((k) => k && k !== finalKw)])].slice(0, 5);
  return { n: seq, product, category, file, title, kw: finalKw, kws: dedupKws, archetype, topicId, ...refs };
}

export function buildPlan() {
  const plan = [];
  const variantsOf = (t) => Math.min(t.kws.length, 5);

  for (const [productKey, topics] of Object.entries(TOPICS)) {
    const folder = productKey; // PRODUCTS[productKey].folder 与 productKey 一致
    const P = PRODUCT_NAME[productKey];

    // ===== 00 关键词覆盖（pillar 释义文；匹配不到主题的走产品级支柱内容） =====
    for (const [kw, intent, blurb] of pillars[productKey]) {
      const topic = matchTopic(productKey, kw);
      plan.push(row(productKey, '00-关键词覆盖', `kw-${slug(kw)}.md`,
        kw, [kw, P, ...topicKwTail(productKey)], 'E', topic?.id || '', { blurb, intent }));
    }

    // ===== 01 下载安装 =====
    for (const ins of INSTALL[productKey]) {
      plan.push(row(productKey, '01-下载安装', `install-${ins.id}.md`,
        ins.kw, [ins.kw, P, '下载安装', ...ins.extraKw], 'J', ins.topic || 'install', { install: ins }));
    }

    // ===== 02 功能教程（主题 × 文型轮转） =====
    const archetypes = ['A', 'B', 'C', 'D'];
    for (const t of topics) {
      const n = variantsOf(t);
      for (let i = 0; i < n; i++) {
        const kw = t.kws[i];
        const ar = archetypes[i % archetypes.length];
        plan.push(row(productKey, '02-功能教程', `feature-${t.id}${i ? '-' + (i + 1) : ''}.md`,
          kw, [kw, P, ...t.kws.filter((k) => k !== kw).slice(0, 2)], ar, t.id, { variant: i }));
      }
    }

    // ===== 03 场景用例 =====
    const sceneArc = ['C', 'A', 'D'];
    for (const sc of scenarios[productKey]) {
      const ks = [sc.kw, ...sc.kws].filter(Boolean);
      ks.forEach((kw, i) => {
        const ar = sceneArc[i % sceneArc.length];
        const topicRef = matchTopic(productKey, sc.kw) || matchTopic(productKey, kw);
        plan.push(row(productKey, '03-场景用例', `scenario-${sc.id}${i ? '-' + (i + 1) : ''}.md`,
          kw, [kw, P, '场景', ...sc.kws.filter((x) => x !== kw).slice(0, 2)], ar, topicRef?.id || '', { scenario: sc.id, variant: i }));
      });
    }

    // ===== 04 行业方案 =====
    industries[productKey].forEach((ind, i) => {
      plan.push(row(productKey, '04-行业方案', `industry-${i + 1}.md`,
        `${ind}AI方案`, [`${ind}AI方案`, ind, P, productKey === 'chayuan-wps' ? '文档AI' : 'AI落地'], 'I', '', { industry: ind }));
    });

    // ===== 05 对比评测 =====
    comparisons[productKey].forEach((cp, i) => {
      plan.push(row(productKey, '05-对比评测', `compare-${i + 1}.md`,
        cp.kw, [cp.kw, P, '对比', '选型'], 'F', '', { compareIdx: i }));
    });

    // ===== 06 常见问题 =====
    faqClusters[productKey].forEach((fc, i) => {
      plan.push(row(productKey, '06-常见问题', `faq-${i + 1}.md`,
        fc.kw, [fc.kw, P, '常见问题', '解答'], 'G', '', { faqIdx: i }));
    });

    // ===== 07 技术解析 =====
    TECH[productKey].forEach((tk, i) => {
      plan.push(row(productKey, '07-技术解析', `tech-${i + 1}.md`,
        tk.kw, [tk.kw, P, '技术解析', '原理'], 'B', tk.topic || '', { tech: tk }));
    });

    // ===== 08 版本发布 =====
    VERSIONS[productKey].forEach((v, i) => {
      const kw = `${P} ${v.v}`;
      plan.push(row(productKey, '08-版本发布', `release-${i + 1}.md`,
        kw, [kw, v.v, P, '更新', '版本'], 'H', '', { version: v }));
    });

    // ===== 09 社区种草 =====
    XHS[productKey].forEach((xh, i) => {
      plan.push(row(productKey, '09-社区种草', `xhs-${i + 1}.md`,
        xh.kw, [xh.kw, P, ...xh.tags.slice(0, 2)], 'K', xh.topic || '', { xhs: xh }));
    });
  }

  // ===== 旧关键词矩阵回收：从旧规划表挑未覆盖的高价值词，补关键词覆盖文 =====
  for (const extra of loadLegacyKeywords()) {
    const { product, kw } = extra;
    if (usedKws.has(kw)) continue;
    const topic = matchTopic(product, kw);
    const P = PRODUCT_NAME[product];
    usedKws.add(kw);
    seq += 1;
    plan.push({
      n: seq, product, category: '00-关键词覆盖', file: `kw-${slug(kw)}.md`,
      title: uniqTitle(buildTitle('E', kw, { topic, tut: _HARVEST[product]?.find((t) => t.id === topic?.tut) || null, kw }, kw)), kw, kws: [kw, P, ...topicKwTail(product)], archetype: 'E',
      topicId: topic?.id || '', intent: '长尾词', blurb: '', legacy: true,
    });
  }
  return plan;
}

function slug(kw) {
  return kw.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
}
function topicKwTail(product) {
  return product === 'chayuan-wps' ? ['察元AI文档助手', 'WPS'] : product === 'chayuan-office' ? ['察元AI Office', '办公'] : product === 'website' ? ['能力广场', 'aidooo'] : ['察元AI OS', '察元OS'];
}

// 关键词 → 主题匹配（回收长尾词与 FAQ 用）
const MATCH_RULES = {
  'chayuan-os': [
    [/知识库|检索|向量|RAG|嵌入/, ['kb-create', 'kb-search', 'kb-upload']],
    [/群聊|多模型|并行|串行|共识|头脑风暴|灵宠|宠物/, ['pet-group', 'group-parallel', 'group-serial', 'group-control']],
    [/模型代理|网关|OpenAI兼容|接口/, ['model-proxy']],
    [/本地模型|本地部署|LLM|GGUF|离线大模型|权重/, ['local-models', 'offline-import', 'model-run']],
    [/Ollama/, ['model-proxy', 'local-models']],
    [/智能体|Claude|Codex|CLI/, ['agents-overview', 'agent-install', 'agent-config']],
    [/MCP/, ['mcp-manage']],
    [/记忆/, ['memory']],
    [/常驻任务|定时任务/, ['resident-task']],
    [/壁纸|主题|Dock|桌面|小组件|Spotlight/, ['desktop-env', 'wallpaper', 'spotlight']],
    [/语音|whisper|转写/, ['record']],
    [/文生图|画图|生图/, ['text2img', 'image-model']],
    [/麒麟|UOS|信创|国产|arm64|飞腾|鲲鹏|数据不出域|涉密/, ['desktop-env', 'local-models']],
    [/跨终端|互联|远程|共享桌面/, ['dds', 'shared-desktop']],
    [/密码|锁屏|恢复密钥/, ['password-recovery', 'lock-pass']],
    [/Docker|云桌面|工舱/, ['docker-desk']],
    [/商店|插件|技能/, ['app-store', 'plugin-skill']],
  ],
  'chayuan-office': [
    [/Word|docx|文档编辑/, ['docs-ribbon']],
    [/Excel|xlsx|表格|透视/, ['sheets-tools', 'sheets-charts']],
    [/PPT|pptx|演示|幻灯/, ['slides-anim', 'slides-play']],
    [/PDF|涂黑|OCR|扫描|转换/, ['pdf-edit', 'pdf-convert', 'ocr', 'pdf-read']],
    [/校对|修订|批注|审阅/, ['proofread', 'ai-revision', 'comments']],
    [/助手/, ['assistants']],
    [/模型|BYOK|Key|Ollama|本地/, ['byok', 'local-model']],
    [/知识库/, ['kb-link']],
    [/开源|免费|价格|授权|试用/, ['buy']],
    [/麒麟|信创|国产/, ['install']],
    [/CLI|命令行|自动化/, ['cli']],
    [/MCP/, ['mcp-server', 'mcp-client']],
    [/Markdown|双链/, ['markdown']],
    [/HTML|网页/, ['html-edit']],
    [/格式|兼容|保真|odt/, ['fidelity', 'new-open']],
    [/生成|写作|改写|润色/, ['ai-generate', 'ai-rewrite', 'ai-panel']],
    [/保密|脱敏|脱密/, ['security']],
  ],
  'chayuan-wps': [
    [/校对|错别字|错字|同音|形近|病句|语法|标点|审校|核对|三审三校|图书|书稿|编辑|审稿|论文/, ['proofread', 'text-analysis']],
    [/公文|红头/, ['security-check']],
    [/保密|涉密|敏感/, ['security-check']],
    [/脱敏|脱密/, ['declassify', 'declassify-restore']],
    [/合同|标书/, ['doc-generate']],
    [/AI痕迹|降AI|序号/, ['text-analysis']],
    [/WPS插件|加载项|WPS AI/, ['install', 'enable']],
    [/文档智能体|MCP/, ['mcp-tools', 'mcp-start']],
    [/编审|表单/, ['form-mode', 'form-audit']],
    [/模板/, ['template', 'doc-generate']],
    [/翻译/, ['translate']],
    [/表格/, ['sheet-assist', 'batch-text']],
    [/演示|PPT/, ['slide-assist']],
    [/助手/, ['assistant-run', 'assistant-diy']],
    [/知识库/, ['kb-use', 'kb-local']],
    [/生图|配图/, ['image-fallback', 'image-gen']],
    [/免费|价格|授权|额度/, ['buy']],
    [/安装|启用/, ['install', 'enable']],
  ],
  website: [
    [/MCP/, ['mcp-section']],
    [/技能包/, ['skillpacks']],
    [/技能/, ['skill-section']],
    [/提示词/, ['prompt-section']],
    [/模型|大模型|厂商/, ['model-center', 'iq-rank']],
    [/榜单|排行/, ['rank', 'iq-rank']],
    [/教程|学习/, ['tutorials-lib', 'assistant-guides']],
    [/下载|安装包/, ['download']],
    [/登录|收藏|账号/, ['account']],
    [/投稿|需求|反馈/, ['submit']],
    [/购买|订单|发票/, ['purchase']],
    [/资讯|活动/, ['news-activities']],
  ],
};
function matchTopic(product, kw) {
  const rules = MATCH_RULES[product] || [];
  const topics = TOPICS[product];
  for (const [re, ids] of rules) {
    if (re.test(kw)) {
      if (ids === null) return undefined;
      for (const id of ids) { const t = topics.find((x) => x.id === id); if (t) return t; }
    }
  }
  // 关键词与主题名直接沾边才认领，否则返回 null（支柱词走产品级内容，防张冠李戴）
  const byName = topics.find((t) => kw.includes(t.name) || t.name.includes(kw) || (t.kws || []).some((k) => kw.includes(k) || k.includes(kw)));
  return byName || null;
}

// ---------- 安装类文章（每产品） ----------
const INSTALL = {
  'chayuan-os': [
    { id: 'win', kw: 'Windows安装', topic: 'install', extraKw: ['Windows'], blurb: 'NSIS 安装器零依赖装机。' },
    { id: 'mac', kw: 'macOS安装', topic: 'install', extraKw: ['macOS', 'Apple Silicon'], blurb: 'dmg 拖装与首次启动。' },
    { id: 'linux-deb', kw: 'Linux deb安装', topic: 'install', extraKw: ['deb', 'Linux'], blurb: 'deb 安装与数据目录初始化。' },
    { id: 'appimage', kw: 'AppImage运行', topic: 'install', extraKw: ['AppImage', '免安装'], blurb: '免 root 便携运行与 FUSE 处理。' },
    { id: 'kylin', kw: '银河麒麟安装', topic: 'install', extraKw: ['银河麒麟', '信创'], blurb: '麒麟 V10 多架构选包要点。' },
    { id: 'uos', kw: '统信UOS安装', topic: 'install', extraKw: ['统信UOS', 'deb'], blurb: 'UOS 20 用 deb 的原因与步骤。' },
    { id: 'arm', kw: 'arm64安装包选择', topic: 'install', extraKw: ['飞腾', '鲲鹏', 'arm64'], blurb: '国产 CPU 架构对应关系。' },
    { id: 'docker', kw: 'Docker部署', topic: 'docker-desk', extraKw: ['Docker', '云桌面'], blurb: '工舱形态一条命令起服务。' },
    { id: 'full-pkg', kw: '全量离线包', topic: 'install', extraKw: ['离线安装包', '4.7GB'], blurb: '含五件套权重的完整离线包。' },
    { id: 'light-pkg', kw: '轻量包', topic: 'install', extraKw: ['轻量安装'], blurb: '约 1GB 起步、模型后补的路线。' },
    { id: 'usb', kw: 'U盘搬运安装', topic: 'install', extraKw: ['离线部署', '内网'], blurb: '隔离环境的标准搬运姿势。' },
    { id: 'offline5', kw: '离线部署五步法', topic: 'install', extraKw: ['内网部署', '隔离网络'], blurb: '政企内网的标准部署路径。' },
    { id: 'sysreq', kw: '配置要求', topic: 'install', extraKw: ['系统要求', '内存'], blurb: '内存架构系统版本一张表。' },
    { id: 'mem8', kw: '8GB内存跑AI', topic: 'model-run', extraKw: ['小内存', '内存预算'], blurb: '一次一模型与 45% 预算线。' },
    { id: 'lowend', kw: '低配电脑跑AI', topic: 'model-run', extraKw: ['低配', '老电脑'], blurb: '小模型与精简加载组合。' },
    { id: 'first-run', kw: '首次启动流程', topic: 'first-gate', extraKw: ['开机', '初始化'], blurb: '登录门、数据目录与首配。' },
    { id: 'datadir', kw: '数据目录与备份', topic: 'first-gate', extraKw: ['备份', '数据迁移'], blurb: '备份一个目录等于备份全部。' },
    { id: 'upgrade', kw: '覆盖升级', topic: 'update', extraKw: ['升级', '数据保留'], blurb: '升级不丢数据的机制。' },
    { id: 'intranet-up', kw: '内网升级', topic: 'update', extraKw: ['断网升级', '离线更新'], blurb: '隔离环境的版本管理。' },
    { id: 'multiuser-init', kw: '多用户初始化', topic: 'multi-user', extraKw: ['多用户', '账户'], blurb: '管理员建户与权限划分。' },
    { id: 'uninstall', kw: '卸载与清理', topic: 'install', extraKw: ['卸载', '清理'], blurb: '干净移除与数据处理。' },
    { id: 'pkg-verify', kw: '安装包校验', topic: 'install', extraKw: ['校验', 'sha256'], blurb: '逐文件校验的习惯。' },
    { id: 't-appimage', kw: 'AppImage打不开排查', topic: 'install', extraKw: ['libfuse2', '报错'], blurb: 'FUSE 缺失标准处理。' },
    { id: 't-slow', kw: '首启慢排查', topic: 'install', extraKw: ['启动慢'], blurb: '初始化 5 到 30 秒属正常。' },
    { id: 't-arch', kw: '架构不符排查', topic: 'install', extraKw: ['uname'], blurb: 'uname 确认架构再选包。' },
    { id: 't-port', kw: 'Docker端口冲突', topic: 'docker-desk', extraKw: ['端口', '52584'], blurb: '端口占用与映射调整。' },
    { id: 'mobile', kw: '手机访问', topic: 'shared-desktop', extraKw: ['手机镜像', '远程'], blurb: '手机浏览器连回桌面。' },
    { id: 'enterprise', kw: '企业批量装机', topic: 'install', extraKw: ['企业部署', '分发'], blurb: '批量安装与配置基线。' },
  ],
  'chayuan-office': [
    { id: 'win', kw: 'Office Windows安装', topic: 'install', extraKw: ['exe'], blurb: 'NSIS 安装器步骤。' },
    { id: 'mac', kw: 'Office macOS安装', topic: 'install', extraKw: ['dmg'], blurb: 'dmg 拖装。' },
    { id: 'linux', kw: 'Office Linux安装', topic: 'install', extraKw: ['deb', 'AppImage'], blurb: 'deb rpm AppImage 三形态。' },
    { id: 'kylin', kw: '麒麟装办公套件', topic: 'install', extraKw: ['麒麟', 'UOS', '信创'], blurb: '信创环境免 root 安装。' },
    { id: 'offline', kw: '内网离线安装', topic: 'install', extraKw: ['离线', '内网'], blurb: '配合本地模型全离线。' },
    { id: 'sysreq', kw: 'Office配置要求', topic: 'install', extraKw: ['配置'], blurb: '三平台要求汇总。' },
    { id: 'first', kw: 'Office首次配置', topic: 'byok', extraKw: ['首次', '模型'], blurb: '装完先配模型。' },
    { id: 'web', kw: '网页版部署', topic: 'dsh-web', extraKw: ['web', 'SaaS'], blurb: '自建网页版形态。' },
    { id: 'dsh', kw: 'OS内插件形态', topic: 'dsh-web', extraKw: ['插件', '察元OS'], blurb: 'OS 用户零安装使用。' },
    { id: 'update', kw: 'Office更新', topic: 'feedback-update', extraKw: ['更新', '版本'], blurb: '双通道更新机制。' },
    { id: 'uninstall', kw: 'Office卸载', topic: 'install', extraKw: ['卸载'], blurb: '干净移除。' },
    { id: 'src', kw: '源码构建', topic: 'install', extraKw: ['开源', '构建'], blurb: '开源仓库与构建入口。' },
  ],
  'chayuan-wps': [
    { id: 'win', kw: '文档助手Windows安装', topic: 'install', extraKw: ['exe', 'WPS插件'], blurb: 'exe 自解压安装。' },
    { id: 'mac', kw: '文档助手macOS安装', topic: 'install', extraKw: ['pkg'], blurb: '退出 WPS 再装与容器修复。' },
    { id: 'linux', kw: '文档助手Linux安装', topic: 'install', extraKw: ['deb', '麒麟'], blurb: 'deb 安装与 quickstartoffice。' },
    { id: 'onekey', kw: '一体化安装脚本', topic: 'install', extraKw: ['一键安装', '脚本'], blurb: '一条命令装齐加载项与服务。' },
    { id: 'online', kw: '企业在线部署', topic: 'install', extraKw: ['企业部署', 'HTTPS'], blurb: '静态服务器集中分发。' },
    { id: 'enable', kw: '加载项启用确认', topic: 'enable', extraKw: ['选项卡', '启用'], blurb: '装完怎么确认成功。' },
    { id: 'win7', kw: 'Win7安装', topic: 'install', extraKw: ['Win7', 'Node'], blurb: '老系统 Node 16 回落。' },
    { id: 'model', kw: '首次配模型', topic: 'model-setup', extraKw: ['Ollama', 'DeepSeek'], blurb: '五家通道与本地端口。' },
    { id: 'mcp-start', kw: 'MCP服务启动', topic: 'mcp-start', extraKw: ['62588', '自启'], blurb: '三种启动方式。' },
    { id: 't-tab', kw: '选项卡不显示排查', topic: 'enable', extraKw: ['排查', 'jsaddons'], blurb: '三步排查法。' },
    { id: 't-mac', kw: 'macOS假成功修复', topic: 'install', extraKw: ['容器', '修复脚本'], blurb: '权限问题标准修复。' },
    { id: 'update', kw: '文档助手升级', topic: 'install', extraKw: ['升级', '版本'], blurb: '加载项更新机制。' },
  ],
  website: [
    { id: 'guide', kw: '能力广场上手', topic: 'plaza', extraKw: ['aidooo', '导航'], blurb: '第一次逛广场的路线。' },
    { id: 'dl-os', kw: '察元OS下载', topic: 'download', extraKw: ['下载', '安装包'], blurb: '按平台架构拿包。' },
    { id: 'dl-office', kw: '察元AI Office下载', topic: 'download', extraKw: ['下载'], blurb: '三平台包直链。' },
    { id: 'dl-wps', kw: '文档助手下载', topic: 'download', extraKw: ['下载', 'WPS'], blurb: '加载项安装包。' },
    { id: 'dl-arch', kw: '安装包架构选择', topic: 'download', extraKw: ['arm64', 'x64'], blurb: '别下错包。' },
    { id: 'login', kw: '注册登录指引', topic: 'account', extraKw: ['微信', '账号'], blurb: '双通道登录。' },
    { id: 'mobile', kw: '手机版使用', topic: 'plaza', extraKw: ['移动端'], blurb: '底部 Tab 导航。' },
    { id: 'safe-dl', kw: '官方下载渠道', topic: 'download', extraKw: ['官方', '安全'], blurb: '仅官网与 Releases。' },
  ],
};

// ---------- 技术解析 ----------
const TECH = {
  'chayuan-os': [
    { kw: '模型代理协议互转', topic: 'model-proxy', angle: 'OpenAI chat、responses 与 Anthropic messages 三协议在一个回环端口互转的实现要点。' },
    { kw: '混合检索架构', topic: 'kb-search', angle: '向量、全文、重排三路融合与 RRF 的取舍。' },
    { kw: '权限门三级设计', topic: 'permission-gate', angle: 'T0 T1 T2 分级、120 秒 fail-closed 与审计日志的完整链路。' },
    { kw: 'MCP配置传播机制', topic: 'mcp-manage', angle: '一处配置如何同步 13 家智能体。' },
    { kw: '群聊引擎并发分档', topic: 'group-parallel', angle: '本地 4 路、云端 16 路的并发控制与 300 秒超时保护。' },
    { kw: '记忆投影机制', topic: 'memory', angle: '记忆库如何投影进 AGENTS.md 与 CLAUDE.md。' },
    { kw: 'DDS设备发现原理', topic: 'dds', angle: 'RTPS 多播发现与零共享默认值的安全设计。' },
    { kw: '离线激活加密方案', topic: 'model-reset', angle: 'HMAC 短码、Crockford base32 与机器指纹绑定的本地验签。' },
    { kw: '端口注册表', topic: 'model-proxy', angle: '52581 到 52584 的端口治理：一格一号与被占顺延。' },
    { kw: 'Docker无头架构', topic: 'docker-desk', angle: '桌面系统跑进容器：多用户隔离与回环暴露面。' },
    { kw: '灵宠状态机', topic: 'pet-interact', angle: '从待命到输出中：灵宠状态流转与记忆负载映射。' },
    { kw: '转录窗口设计', topic: 'group-serial', angle: '并行 30 条与串行 10 条的上下文预算差异。' },
    { kw: '系统技能镜像', topic: 'sys-skills', angle: 'SKILL.md 分发到六家智能体目录的机制。' },
    { kw: '模型自动卸载策略', topic: 'model-run', angle: '空闲 15 分钟卸载与钉住常驻的平衡。' },
  ],
  'chayuan-office': [
    { kw: '字节保真实现', topic: 'fidelity', angle: '未触碰块逐字节写回是怎么做到的。' },
    { kw: 'PDF内容流重写', topic: 'pdf-edit', angle: 'PDFium wasm 改内容流而非注释遮盖的差别。' },
    { kw: '表格Rust边车', topic: 'sheets-tools', angle: 'calamine 加 IronCalc 的导入导出链路。' },
    { kw: '修订OOXML结构', topic: 'ai-revision', angle: 'w:ins 与 w:del：AI 修订落成通用格式的细节。' },
    { kw: '知识库五级发现', topic: 'kb-link', angle: '从手动指定到端口梯的发现顺序。' },
    { kw: 'MCP工具面设计', topic: 'mcp-server', angle: '29 个 CLI 工具的分层与写确认。' },
    { kw: 'OCR判定策略', topic: 'ocr', angle: '有效文字不足 8 字符的扫描页判定与置信度过滤。' },
    { kw: 'ODF保守导入', topic: 'fidelity', angle: '宁可少保也不猜错的兼容哲学。' },
    { kw: '多协议适配层', topic: 'byok', angle: '94 家供应商 28 适配器 4 协议的归一化。' },
    { kw: '长文流式写作', topic: 'ai-rewrite', angle: '20 万字符上限与 0.3 秒草稿刷新的实现。' },
  ],
  'chayuan-wps': [
    { kw: 'MCP边车架构', topic: 'mcp-tools', angle: '62588 端口 sidecar 的启动、看门狗与免 Node 二进制。' },
    { kw: '写确认纪律实现', topic: 'mcp-tools', angle: 'confirmed 标记、审计日志与外部调用被拒的边界。' },
    { kw: '三级生图降级链', topic: 'image-fallback', angle: '不静默换花钱来源的降级铁律怎么落地。' },
    { kw: '脱密加密方案', topic: 'declassify', angle: 'AES-GCM-256 加 PBKDF2 的恢复载荷设计。' },
    { kw: '知识库端口梯', topic: 'kb-local', angle: '固定 52582 加并行端口梯的发现顺序。' },
    { kw: '分块并发校对', topic: 'proofread', angle: '6000 字块长与进度窗的任务模型。' },
    { kw: '模板质检自愈', topic: 'doc-generate', angle: '三轮机器审计加 AI 审查的自愈闭环。' },
    { kw: '审计日志链路', topic: 'mcp-tools', angle: 'audit.jsonl 记什么、怎么查。' },
  ],
  website: [
    { kw: '榜单算法实现', topic: 'rank', angle: 'star 快照、周期增量与降级透明化。' },
    { kw: '多源采集去重', topic: 'mcp-section', angle: '四层去重防重复入库的管道。' },
    { kw: 'token门控机制', topic: 'skillpacks', angle: '限次限机与吊销的授权链路。' },
    { kw: '教程库合规边界', topic: 'tutorials-lib', angle: '只存元数据不搬正文的避风港设计。' },
    { kw: 'FTS全文检索', topic: 'tutorials-lib', angle: '两万余条资源的检索体验。' },
    { kw: '下载清单同步', topic: 'download', angle: '管理后台生成 manifest 的机制。' },
  ],
};

// ---------- 版本发布 ----------
const VERSIONS = {
  'chayuan-os': [
    { v: '3.1.15', date: '2026-10', highlights: ['86 个 MCP 工具实测口径', '17 家外部 CLI 智能体管理', '宠物群聊并行串行共识三种协同', '跨终端互联 DDS 默认零共享'] },
    { v: '3.1.x 系列', date: '2026-09 至 2026-10', highlights: ['模型设置向导四步走', '知识库引用链路与健康检查', '常驻任务与预授权窗口', '银河麒麟与统信 UOS 真机适配'] },
    { v: '3.0 系列', date: '2026-09', highlights: ['桌面体验整改闭环', '应用商店对接能力广场', '离线购买授权全链路'] },
  ],
  'chayuan-office': [
    { v: '1.0.15', date: '2026-10-30', highlights: ['发版实测通过，六编辑器全链路验收', '领域助手 4576 个、领域包 229 个口径', '94 家供应商 BYOK', '22 种界面语言'] },
    { v: '1.0.x 系列', date: '2026-10', highlights: ['PDF 真文本编辑与涂黑', '扫描件 OCR 自动触发', 'CLI 17 子命令与 MCP 服务'] },
  ],
  'chayuan-wps': [
    { v: '6.1.2', date: '2026-10-28', highlights: ['附件解析链路修复', '安装器加固：macOS 容器假成功告警与修复脚本'] },
    { v: '6.1.1', date: '2026-10', highlights: ['设置面板模型清单', 'Windows arm64 安装包'] },
    { v: '6.1.0', date: '2026-10', highlights: ['模板编制五段式上线', '对话生成整套文档'] },
    { v: '6.0', date: '2026', highlights: ['三端加载项统一', '保密检查八大类', '本机 MCP 服务'] },
  ],
  website: [
    { v: '能力广场 2026-10', date: '2026-10', highlights: ['技能包商城 310+ 主题', '教程库 21291 条', '产品家族四卡改版'] },
    { v: '能力广场 2026-09', date: '2026-09', highlights: ['智能广场三栏导航', '模型智力榜与免费榜'] },
  ],
};

// ---------- 种草（小红书文案，纯文本无表情符号） ----------
const XHS = {
  'chayuan-os': [
    { kw: '断网也能用的AI电脑', topic: 'local-models', tags: ['效率工具', '国产软件'], angle: '全量包 4.7GB 装完即离线 AI 全家桶。' },
    { kw: '给AI开个群聊', topic: 'pet-group', tags: ['AI工具', '程序员日常'], angle: '多个大模型为一个命题吵架是种什么体验。' },
    { kw: '桌面养只AI宠物', topic: 'pet-create', tags: ['桌面宠物', '效率工具'], angle: '双击就能开始干活的桌面小伙伴。' },
    { kw: '本地知识库真香', topic: 'kb-search', tags: ['知识管理', '学生党'], angle: '资料拖进去，问答带脚注。' },
    { kw: '一台电脑管17个AI员工', topic: 'agents-overview', tags: ['程序员日常', '效率工具'], angle: 'Claude Code 和 Codex 们统一上岗。' },
    { kw: '内网AI自由', topic: 'offline-import', tags: ['国产软件', '打工人'], angle: 'U 盘搬模型进保密机房。' },
    { kw: '麒麟系统跑AI', topic: 'desktop-env', tags: ['信创', '国产系统'], angle: '飞腾鲲鹏都能跑的 AI 桌面。' },
    { kw: '定时让AI干活', topic: 'resident-task', tags: ['效率工具', '打工人'], angle: '早上来收报告的无人值守姿势。' },
    { kw: '手机连回公司电脑', topic: 'shared-desktop', tags: ['远程办公', '效率工具'], angle: '浏览器一开桌面就在。' },
    { kw: 'AI帮我记住一切', topic: 'memory', tags: ['效率工具', '知识管理'], angle: '换智能体不用重新自我介绍。' },
    { kw: '8GB老电脑跑大模型', topic: 'model-run', tags: ['数码科技', '学生党'], angle: '一次一个模型照样稳。' },
    { kw: '两台电脑互借能力', topic: 'dds', tags: ['效率工具', '程序员日常'], angle: '借隔壁机器的模型和知识库。' },
    { kw: '断网写材料全流程', topic: 'office-app', tags: ['办公效率', '公文写作'], angle: '从初稿到校对不出网。' },
    { kw: 'AI操作系统初体验', topic: 'desktop-env', tags: ['数码科技', '新品体验'], angle: '第一印象与三天使用记录。' },
    { kw: '语音开会记录神器', topic: 'record', tags: ['办公效率', '会议记录'], angle: '边说边出字还不联网。' },
    { kw: '桌面美化新姿势', topic: 'wallpaper', tags: ['桌面美化', '壁纸'], angle: '动态壁纸加小组件的工作台。' },
  ],
  'chayuan-office': [
    { kw: '开源办公套件安利', topic: 'install', tags: ['开源软件', '办公效率'], angle: '六编辑器一个应用。' },
    { kw: 'PDF直接改字', topic: 'pdf-edit', tags: ['办公效率', 'PDF'], angle: '真文本编辑不是贴白块。' },
    { kw: 'AI校对留批注', topic: 'proofread', tags: ['办公效率', '写作'], angle: '错哪了一句批注一句。' },
    { kw: '扫描件秒变可搜索', topic: 'ocr', tags: ['办公效率', '档案'], angle: '自动 OCR 无按钮。' },
    { kw: '4576个行业助手', topic: 'assistants', tags: ['AI工具', '办公效率'], angle: '总有一个是你的领域。' },
    { kw: '断网写方案', topic: 'local-model', tags: ['打工人', '办公效率'], angle: 'Ollama 接上就开工。' },
    { kw: '一句话出文档', topic: 'ai-generate', tags: ['AI工具', '写作'], angle: '回复即正文还能继续生成。' },
    { kw: '合同差异三分钟', topic: 'ai-revision', tags: ['法务', '办公效率'], angle: '对比加修订一目了然。' },
    { kw: '表格透视表自由', topic: 'sheets-tools', tags: ['Excel', '办公效率'], angle: '免费开源的表格能力。' },
    { kw: '论文神器组合', topic: 'markdown', tags: ['科研', '学生党'], angle: 'Zotero 加双链笔记。' },
    { kw: '涉密文档脱敏', topic: 'security', tags: ['职场', '保密'], angle: '占位符一键替换。' },
    { kw: 'PPT录旁白', topic: 'slides-play', tags: ['教师', 'PPT'], angle: '录课一条龙。' },
  ],
  'chayuan-wps': [
    { kw: 'WPS装上AI引擎', topic: 'install', tags: ['WPS', '效率工具'], angle: '不改习惯只加能力。' },
    { kw: '发文前自检三件套', topic: 'security-check', tags: ['公文写作', '体制内'], angle: '校对加保密双保险。' },
    { kw: '标书人救星', topic: 'doc-generate', tags: ['招投标', '打工人'], angle: '模板编制一键成文。' },
    { kw: '查AI痕迹', topic: 'text-analysis', tags: ['职场', '学生党'], angle: '七维度线索参考。' },
    { kw: '表格公式不会就问', topic: 'sheet-assist', tags: ['WPS', '表格'], angle: '66 个配方直达。' },
    { kw: '口播稿一键生成', topic: 'slide-assist', tags: ['PPT', '演讲'], angle: '汇报前不再熬夜。' },
    { kw: '脱敏后放心给AI', topic: 'declassify', tags: ['保密', '职场'], angle: '占位符可逆设计。' },
    { kw: '52语种翻译排版不乱', topic: 'translate', tags: ['翻译', '办公效率'], angle: '逐段替换保持格式。' },
    { kw: 'Claude Code直接改文档', topic: 'mcp-clients', tags: ['程序员', 'AI工具'], angle: 'MCP 接 WPS。' },
    { kw: '校对结果长这样', topic: 'proofread', tags: ['校对', '编辑'], angle: '批注格式实拍描述。' },
    { kw: '内网也能用的AI校对', topic: 'model-setup', tags: ['保密', '内网'], angle: 'Ollama 全离线。' },
    { kw: '材料收集表单化', topic: 'form-mode', tags: ['行政', '人事'], angle: '收表审计一条龙。' },
    { kw: '长书稿校对不超时', topic: 'proofread', tags: ['出版', '编辑'], angle: '分块并发实况。' },
    { kw: '免费额度够用吗', topic: 'buy', tags: ['白嫖', '效率工具'], angle: '每日额度实测记录。' },
  ],
  website: [
    { kw: '找MCP就来这里', topic: 'mcp-section', tags: ['MCP', '程序员'], angle: '11 源聚合导航。' },
    { kw: '榜单选型法', topic: 'rank', tags: ['开源', '程序员'], angle: '看增量不看存量。' },
    { kw: '白嫖模型清单', topic: 'iq-rank', tags: ['大模型', '白嫖'], angle: '免费榜的正确打开方式。' },
    { kw: 'AI学习资料一条入口', topic: 'tutorials-lib', tags: ['学习', '学生党'], angle: '21291 条资源导航。' },
    { kw: '技能包是啥', topic: 'skillpacks', tags: ['AI工具', '效率'], angle: '按工作流打包的技能商品。' },
    { kw: '下载别下错包', topic: 'download', tags: ['装机', '数码'], angle: '架构选择避坑。' },
    { kw: '4526篇助手教程', topic: 'assistant-guides', tags: ['办公', '教程'], angle: '228 领域全覆盖。' },
    { kw: '提需求真的有用', topic: 'submit', tags: ['需求墙', '体验'], angle: '需求墙机制。' },
    { kw: '智能广场三栏', topic: 'plaza', tags: ['导航', '效率'], angle: '装了就用查资料逛与买。' },
    { kw: '模型对比一页看', topic: 'model-center', tags: ['大模型', '选型'], angle: '目录加对比页。' },
  ],
};

// ---------- 旧关键词矩阵回收：解析旧规划表，挑出未被新计划覆盖、且能匹配到主题的高价值词 ----------
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
function splitCsv(line) {
  const cells = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
    else if (c === ',' && !inQ) { cells.push(cur); cur = ''; }
    else cur += c;
  }
  cells.push(cur);
  return cells;
}
function loadLegacyKeywords() {
  const cache = new URL('./facts/harvested/legacy-kws.json', import.meta.url).pathname;
  if (existsSync(cache)) { try { return JSON.parse(readFileSync(cache, 'utf8')); } catch { /* fallthrough */ } }
  const out = [];
  let text;
  try { text = readFileSync(new URL('../strategy/04-文章规划总表.csv', import.meta.url), 'utf8'); } catch { return out; }
  const prodMap = { 察元AI文档助手: 'chayuan-wps', '察元AI Office': 'chayuan-office', '察元AI OS': 'chayuan-os', '察元AI 能力广场': 'website' };
  for (const line of text.split(/\r?\n/).slice(1)) {
    const cells = splitCsv(line);
    if (cells.length < 6) continue;
    const product = prodMap[cells[1]?.replace(/^\uFEFF/, '').trim()];
    const kw = (cells[5] || '').trim();
    if (!product || !kw || kw.length > 14) continue;
    // 只回收旧「关键词覆盖」类别里搜索价值明确的词
    if (!(cells[2] || '').includes('关键词覆盖')) continue;
    out.push({ product, kw });
  }
  const seen = new Set();
  const deduped = out.filter((x) => (seen.has(x.kw) ? false : (seen.add(x.kw), true)));
  try { writeFileSync(cache, JSON.stringify(deduped, null, 0)); } catch { /* 缓存失败不影响本次生成 */ }
  return deduped;
}
