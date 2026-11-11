// zhihu-plan.mjs —— 知乎线规划：500 篇 = 125 主题 × 4 文体（stance 立场问答 / pit 劝退坑 / deep 机制拆解 / decide 决策框架）
// 标题为知乎体（问题句/强观点句）；主关键词 = 产品短名+主题短词（与 CSDN 线关键词零重叠）
import topicsOS from './facts/topics-os.mjs';
import topicsOffice from './facts/topics-office.mjs';
import topicsWps from './facts/topics-wps.mjs';
import topicsWeb from './facts/topics-web.mjs';
import { TITLE_PATTERNS } from './facts/zhihu-voice.mjs';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

// ---------- 主题选择 ----------
const _cjk = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;

function pickTopics(all, n, stride = 2) {
  // 跨产品能力域均匀取主题：按 stride 抽样铺满
  const out = [];
  for (let i = 0; i < all.length && out.length < n; i += stride) out.push(all[i]);
  let j = 1;
  while (out.length < n && j < all.length) {
    if (!out.includes(all[j])) out.push(all[j]);
    j += stride;
  }
  return out.slice(0, n);
}

// games：从 62 篇手写功能文里挑 33 个内容最厚的（字节量排序取 stride）
function pickGamesThemes(n) {
  const dir = 'chayuan-games/02-功能教程';
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.startsWith('feature-') && f.endsWith('.md'));
  const sized = files.map((f) => ({ slug: f.replace(/^feature-/, '').replace(/\.md$/, ''), size: readFileSync(`${dir}/${f}`, 'utf8').length }));
  sized.sort((a, b) => b.size - a.size);
  const picked = [];
  const stride = 2;
  for (let i = 0; i < sized.length && picked.length < n; i += stride) picked.push(sized[i].slug);
  let j = 1;
  while (picked.length < n && j < sized.length) { if (!picked.includes(sized[j].slug)) picked.push(sized[j].slug); j += stride; }
  return picked.slice(0, n);
}
// slug → 中文短词（知乎主关键词用）
const GAME_SLUG_CN = {
  'doudizhu-human': '斗地主人机局', 'doudizhu-review': '斗地主复盘', 'doudizhu-rules': '斗地主规则判定',
  'fanqi-human': '翻棋人机局', 'fanqi-rules': '翻棋判定规则', 'fanqi-watch': '翻棋观战',
  'go-review': '围棋复盘', 'gomoku-watch': '五子棋观战', 'guandan-human': '掼蛋人机局',
  'guangdong-rules': '广东麻将规则', 'holdem-rules': '德州扑克规则', 'junqi-human': '军棋人机局',
  'junqi-rules': '军棋吃子判定', 'junqi-teaching': '军棋教学档', 'record-export': '棋谱导出',
  'review-marks': '复盘标注', 'xiangqi-human': '象棋人机局', 'ai-handover': 'AI接手人工接管',
  'batch-select': '批量选子', 'bilingual': '双语界面', 'board-fit': '棋盘自适应',
  'tournament-create': '锦标赛创建', 'tournament-schedule': '锦标赛赛程', 'deep-rules': '深度规则模式',
  'think-bubbles': '思维链气泡', 'trend-curve': '形势曲线', 'true-skill': 'TrueSkill天梯',
  'model-compare': '模型同场对比', 'anonymous-watch': '匿名观战', 'ai-commentary': 'AI解说',
  'opening-memory': '开局记忆', 'protocol-profile': '协议画像', 'heuristic-move': '启发式代走',
  'group-chat': '群聊对局', 'local-ollama': 'Ollama本地模型', 'token-cost': 'token用量',
    'settings': '设置面板',
  'first-run': '首次启动',
  'update-check': '检查更新',
  'data-dir': '数据目录',
  'uninstall': '卸载清理',
  'sysreq': '配置要求',
  'shortcuts': '快捷键',
  'theme': '主题外观',
  'lang': '语言切换',
  'window': '窗口管理',
  'fullscreen': '全屏模式',
  'autosave': '自动保存',
  'net-check': '网络检测',
  'provider-add': '厂商接入',
  'key-import': '密钥导入',
  'model-pick': '模型挑选',
  'move-timer': '出招计时',
  'retry-hand': '重试一手',
  'hand-replay': '单手回放',
  'batch-export': '批量导出',
  'stats-panel': '统计面板',
  'rating-history': '段位历史',
  'invite-friend': '邀友对局',
  'share-result': '战报分享',
  'bug-report': '问题反馈',
  'log-export': '日志导出',
  'kb-link': '知识库联动',
  'proxy-setup': '代理设置',
  'port-conflict': '端口冲突',
  'firewall': '防火墙放行',
  'low-spec': '低配优化',
  'battery': '耗电控制',
  'multi-window': '多开对局',
  'sound': '音效设置',
  'doudizhu-watch': 'doudizhuwatch',
  'game-over': 'gameover',
  'go-913': 'go913',
  'go-human': 'gohuman',
  'gomoku-human': 'gomokuhuman',
  'gomoku-review': 'gomokureview',
  'gomoku-rules': 'gomokurules',
  'guandan-double': 'guandandouble',
  'guandan-rules': 'guandanrules',
  'guangdong-human': 'guangdonghuman',
  'guangdong-review': 'guangdongreview',
  'holdem-human': 'holdemhuman',
  'holdem-review': 'holdemreview',
  'holdem-watch': 'holdemwatch',
  'human-game': 'humangame',
  'human-rank': 'humanrank',
  'junqi-setup': 'junqisetup',
  'ladder-challenge': 'ladderchallenge',
  'live-commentary': 'livecommentary',
  'lobby-hall': 'lobbyhall',
  'machine-watch': 'machinewatch',
  'post-commentary': 'postcommentary',
  'records-manage': 'recordsmanage',
  'replay-filter': 'replayfilter',
  'riichi-hidden': 'riichihidden',
  'riichi-human': 'riichihuman',
  'riichi-rules': 'riichirules',
  'room-cot': 'roomcot',
  'trueskill-ladder': 'trueskillladder',
  'xiangqi-review': 'xiangqireview',
  'xiangqi-rules': 'xiangqirules',
  'xiangqi-watch': 'xiangqiwatch',
  'xueliu-human': 'xueliuhuman',
  'xueliu-rules': 'xueliurules',
  'xueliu-watch': 'xueliuwatch',
    'doudizhu-watch': '斗地主观战',
  'game-over': '终局结算',
  'go-913': '围棋13路',
  'go-human': '围棋人机局',
  'gomoku-human': '五子棋人机局',
  'gomoku-review': '五子棋复盘',
  'gomoku-rules': '五子棋规则',
  'guandan-double': '掼蛋双上',
  'guandan-rules': '掼蛋规则',
  'guangdong-human': '广东麻将人机局',
  'guangdong-review': '广东麻将复盘',
  'holdem-human': '德州人机局',
  'holdem-review': '德州复盘',
  'holdem-watch': '德州观战',
  'human-game': '人机局',
  'human-rank': '人类天梯',
  'junqi-setup': '军棋布阵',
  'ladder-challenge': '天梯挑战',
  'live-commentary': '实时解说',
  'lobby-hall': '大厅玩法',
  'machine-watch': '机机观战',
  'post-commentary': '赛后解说',
  'records-manage': '棋谱管理',
  'replay-filter': '回放器筛选',
  'riichi-hidden': '日麻立直',
  'riichi-human': '日麻人机局',
  'riichi-rules': '日麻规则',
  'room-cot': '对局室思维链',
  'trueskill-ladder': 'TrueSkill天梯',
  'xiangqi-review': '象棋复盘',
  'xiangqi-rules': '象棋规则',
  'xiangqi-watch': '象棋观战',
  'xueliu-human': '血战人机局',
  'xueliu-rules': '血战规则',
  'xueliu-watch': '血战观战',
};
const gameShort = (slug) => GAME_SLUG_CN[slug] || slug;

// website 主题 → 视图文件（深挖源）
const WEB_SRC = {
  plaza: 'Home.vue', 'mcp-section': 'MarketCategoryPage.vue', 'plugin-section': 'MarketItemPage.vue',
  'skill-section': 'SkillPage.vue', 'prompt-section': 'MarketCategoryPage.vue', 'agent-section': 'MarketItemPage.vue',
  'model-center': 'ModelHubPage.vue', rank: 'MarketRankPage.vue', 'iq-rank': 'IqRankPage.vue',
  'tutorials-lib': 'TutorialsPage.vue', 'assistant-guides': 'AssistantsPage.vue', skillpacks: 'SkillPacksPage.vue',
  download: 'Home.vue', account: 'About.vue', submit: 'MarketSubmitPage.vue', purchase: 'BuyPage.vue',
  'scenarios-page': 'ScenariosIndexPage.vue', 'news-activities': 'ActivitiesPage.vue',
};
const WEB_SHORT = {
  plaza: '智能广场', 'mcp-section': 'MCP资源', 'plugin-section': '插件市场', 'skill-section': '技能市场',
  'prompt-section': '提示词库', 'agent-section': '智能体应用', 'model-center': '模型目录', rank: '开源榜单',
  'iq-rank': '智力榜', 'tutorials-lib': '教程库', 'assistant-guides': '助手教程', skillpacks: '技能包商城',
  download: '安装包下载', account: '账号', submit: '投稿需求墙', purchase: '购买授权',
  'scenarios-page': '场景选型', 'news-activities': '资讯活动',
};
const WEB_SRC2 = { submit: 'DemandsPage.vue', 'iq-rank': 'FreeRankPage.vue', 'model-center': 'ModelComparePage.vue', purchase: 'ActivatePage.vue' };

// ---------- 标题与文案素材 ----------
const STANCE_HOOKS = ['把一切留在本机', '先讲边界再讲功能', '让模型只出招不判罚', '把配置收敛成一次点击', '坚持本地优先', '把出处钉在答案上', '敢把代价写在明面'];
const ANSWERS = [
  '值得用，但只对特定的人；先看它的边界再决定',
  '方向是对的，代价是真实的，两者都要认',
  '它解决的问题是真实的，别被宣传语气带偏',
  '这不是噱头，但也不是人人必需',
  '同价位里少见的认真做法，坑也有，能绕',
  '比多数替代品克制，比宣传页朴素',
];
const GOALS = {
  'chayuan-os': '把 AI 收进一台不联网也够用的桌面', 'chayuan-office': '在不换办公习惯的前提下用上 AI',
  'chayuan-wps': '在 WPS 里把校对与保密做成日常', website: '把散落的 AI 资源收进一个入口',
  'chayuan-games': '让模型在牌桌上真刀真枪地比',
};
const SCENES = {
  'chayuan-os': '配一台离线 AI 电脑', 'chayuan-office': '给日常文档加 AI', 'chayuan-wps': '给 WPS 加校对引擎',
  website: '找 AI 资源不迷路', 'chayuan-games': '围观大模型打牌',
};

// ---------- 主规划 ----------
export function buildZhihuPlan(existingKws, existingTitles) {
  const plan = [];
  const usedKw = new Set(existingKws);
  const usedTitle = new Set(existingTitles);
  let seq = 0;

  const uniq = (kw, P) => {
    if (!usedKw.has(kw)) { usedKw.add(kw); return kw; }
    for (const alt of [`${kw}实录`, `${kw}细看`, `${kw}再看`, `${kw}三问`, `聊${kw}`]) {
      if (!usedKw.has(alt)) { usedKw.add(alt); return alt; }
    }
    let i = 2;
    while (usedKw.has(kw + i)) i++;
    usedKw.add(kw + i);
    return kw + i;
  };
  const uniqT = (t) => {
    if (!usedTitle.has(t)) { usedTitle.add(t); return t; }
    const alts = [t.replace(/？$/, '？说点实在的'), t + '（细节版）', t.replace('？', '，真实体验是？')];
    for (const a of alts) if (!usedTitle.has(a)) { usedTitle.add(a); return a; }
    let i = 2;
    while (usedTitle.has(`${t} ${i}`)) i++;
    const t2 = `${t} ${i}`;
    usedTitle.add(t2);
    return t2;
  };
  const styleOf = (vi) => ['stance', 'pit', 'deep', 'decide'][vi % 4];

  function push(product, themeShort0, srcId, P, topicRef, extra = {}) {
    let themeShort = themeShort0;
    const styles = ['stance', 'pit', 'deep', 'decide'];
    for (let vi = 0; vi < 4; vi++) {
      const style = styleOf(vi + (extra.styleShift || 0));
      seq += 1;
      // 剥主题名括号注释（防「宠物群聊（多模型）细看」类标题）
      themeShort = themeShort.replace(/（[^）]*）/g, '').trim() || themeShort;
      // 长主题名截短（英文词不截，防 TrueSkil 类断词）；剥主题名内嵌的品牌前缀（防「察元OS察元AI…」拼接）
      const hasLongEn = /[a-zA-Z]{5,}/.test(themeShort);
      let themeShortCut = !hasLongEn && [...themeShort].length > 8 ? [...themeShort].slice(0, 8).join('') : themeShort;
      themeShortCut = themeShortCut.replace(/^察元(竞技场|AI ?文档助手|文档助手|AI ?Office|Office|广场|OS)[\s]*/, '').trim() || themeShortCut;
      const kw = uniq(`${P.short || P.name}${themeShortCut}`, P);
      const hooks = { stance: STANCE_HOOKS[(seq + vi) % STANCE_HOOKS.length], pit: '', deep: STANCE_HOOKS[(seq * 3 + vi) % STANCE_HOOKS.length], decide: '' };
      let title = TITLE_PATTERNS[style][(seq + vi * 3) % TITLE_PATTERNS[style].length]
        .replaceAll('{kw}', kw)
        .replaceAll('{hook}', hooks[style])
        .replaceAll('{alt}', extra.alt || '同类工具');
      if ([...title].length > 30) {
        const shortPats = { stance: [`怎么看待{kw}？说点实在的`, `{kw}值得单独说一篇吗？`, `{kw}的真实体验如何？`], pit: [`{kw}有哪些坑？先说三条`, `用{kw}之前，先看这几条`, `{kw}的坑，一次说透`], deep: [`把{kw}拆开看，门道在哪`, `{kw}是怎么运作的？`, `{kw}深拆：全是笨功夫`], decide: [`{kw}值不值得上？三条维度`, `{kw}怎么选？给框架不给答案`, `{kw}适合谁？一条条对`] };
        title = shortPats[style][(seq + vi) % 3].replaceAll('{kw}', kw);
      }
      if ([...title].length > 30) title = `${kw}：说几句实话`;
      if ([...title].length > 30) title = kw;
      title = uniqT(title);
      const file = `z${String(seq).padStart(3, '0')}-${style}-${(extra.slug || themeShort).replace(/\s+/g, '')}.md`;
      plan.push({
        n: seq, product, category: 'zhihu', file,
        title, kw, kws: [...new Set([kw, P.name, ...((extra.kwTail || []).slice(0, 2))])].slice(0, 4),
        style, srcId, srcId2: extra.srcId2 || '', topicId: topicRef?.id || '',
        answer: ANSWERS[(seq + vi) % ANSWERS.length],
        goal: GOALS[product], scene: SCENES[product],
        loc: extra.loc || '文档里', core: extra.core || '数据不出本机',
        slug: extra.slug || '',
      });
    }
  }

  // OS：28 主题 ×4 = 112
  {
    const P = { name: '察元AI OS', short: '察元OS' };
    const ts = pickTopics(topicsOS, 28, 3);
    for (const t of ts) push('chayuan-os', t.name, t.tut, P, t, { slug: t.id, kwTail: ['察元OS', 'AI桌面'] });
  }
  // Office：24 ×4 = 96
  {
    const P = { name: '察元AI Office', short: '察元Office' };
    const ts = pickTopics(topicsOffice, 24, 2);
    for (const t of ts) push('chayuan-office', t.name, t.tut, P, t, { slug: t.id, kwTail: ['察元Office', '办公'] });
  }
  // WPS：24 ×4 = 96
  {
    const P = { name: '察元AI文档助手', short: '察元文档助手' };
    const ts = pickTopics(topicsWps, 24, 2);
    for (const t of ts) push('chayuan-wps', t.name, t.tut, P, t, { slug: t.id, kwTail: ['WPS', '文档助手'] });
  }
  // website：16 ×4 = 64
  {
    const P = { name: '察元AI 能力广场', short: '察元广场' };
    const ts = pickTopics(topicsWeb, 16, 1);
    for (const t of ts) push('website', WEB_SHORT[t.id] || t.name, WEB_SRC[t.id] || 'Home.vue', P, t, { slug: t.id, srcId2: WEB_SRC2[t.id] || '', kwTail: ['aidooo', '资源'], loc: '站内', alt: '导航站', core: '只做导航不做搬运' });
  }
  // games：33 ×4 = 132
  {
    const P = { name: '察元竞技场', short: '察元竞技场' };
    const slugs = pickGamesThemes(33);
    for (const slug of slugs) {
      const short = gameShort(slug);
      if (!GAME_SLUG_CN[slug]) continue;
      push('chayuan-games', short, slug, P, null, { slug, kwTail: ['竞技场', '大模型'], loc: '对局室', core: '胜负归代码裁判', alt: '聊天评测榜' });
    }
  }
  return plan;
}
