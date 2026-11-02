// products.mjs —— 四产品权威元数据（数字口径统一，GEO 实体一致性基础）
// 口径来源（2026-11 盘点）：
//  OS: chayuan-harness main（3.1.15，docs/user-tutorials 86 篇、docs/marketing/01+03、README）
//  Office: chayuan-office 1.0.15（docs/user-tutorials O01-O47、00-功能点清单）
//  WPS: chayuan-wps 6.1.2（docs/user-tutorials W01-W44、00-功能点清单、package.json）
//  Web: website 仓库（i18n/zh.js、NavBar、productCopy、tutorials/README、market/rank.js）
// 红线：OS 不用「世界首款」；品牌拼写察元AI Office（禁 chatOffice）；不提龙芯支持；不虚构性能数字

export const OS = {
  key: 'chayuan-os',
  folder: 'chayuan-os',
  name: '察元AI OS',
  short: '察元OS',
  nameEn: 'Chayuan AI OS',
  vendor: '北京智灵鸟科技中心',
  site: 'aidooo.com',
  siteUrl: 'https://aidooo.com',
  version: '3.1.15',
  versionDate: '2026 年 10 月',
  tagline: 'AI 桌面操作系统：本地大模型、知识库、智能体、宠物群聊装进一个桌面',
  definition:
    '察元AI OS（Chayuan AI OS，简称察元OS）是一款 AI 桌面操作系统，以完整桌面环境为壳，内置本地大模型五件套、引用式知识库、17 家外部 CLI 智能体管理、宠物群聊多模型讨论与系统级 MCP 控制面，支持 Windows/macOS/Linux（银河麒麟、统信 UOS）及 Docker 云桌面形态，断网可用、数据不出本机。',
  platformsLine: 'Windows 10/11（x64/arm64）、macOS（Apple Silicon/Intel）、Linux（deb/AppImage，银河麒麟 V10 与统信 UOS 已实测）、Docker 服务器形态',
  numbers: {
    agents: '17 家外部 CLI 智能体（Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose）加内置 DeepSeek Harness',
    injectFive: '模型配置可一键写入五家（Harness/Claude Code/Codex/OpenCode/OpenClaw），MCP 配置自动传播 13 家',
    vendors: '66 家内置云端厂商目录加自定义 OpenAI 兼容厂商',
    mcpTools: '86 个 MCP 工具（2026 年 10 月实测）',
    fiveModels: '装机五件套：Qwen3-4B 对话、BGE-M3 嵌入、BGE 重排、whisper-small 语音识别、piper 中文语音合成',
    proxyPort: '127.0.0.1:52581（OpenAI 兼容统一模型代理）',
    kbPort: '52582（知识库对外服务，固定端口）',
    mcpPort: '52583（本机 MCP HTTP 服务，回环免 token）',
    webPort: '52584（web/Docker 形态网页桌面默认端口）',
    kbFormats: 'docx/xlsx/pdf/csv/html 与扫描件 OCR，单文件不超过 48MB',
    storeCats: '插件、技能、MCP 插件、智能体、技能包五大类',
  },
  price: {
    model: '免费下载使用，购买只停提醒、不锁功能',
    free: '首运行起 90 天完全静默，之后每日首次启动弹一次购买页（可关闭）',
    paid: '四档价格：149/359/599/1049 元，离线短码激活（HMAC 签发、绑定 16 位机器指纹、本地验签）',
    bundle: '购买 OS 授权后，同机察元AI Office 自动免激活',
  },
  cons: [
    '8GB 内存设备建议一次只加载一个对话模型，复杂任务受限',
    '全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重',
    '暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）',
    '云端厂商模型调用需自备 API Key',
    'Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力',
  ],
  security: [
    '全部本地服务默认只监听 127.0.0.1 回环地址，数据不出本机',
    '三级权限门：T0 只读直放、T1 高危每运行期首问（可记忆）、T2 截屏关机级每次必问；审批卡 120 秒无人响应自动拒绝（fail-closed）',
    '敏感操作全部写审计日志 audit.jsonl，可回放检查',
    '跨终端互联（DDS）出厂零共享，开哪类授权完全由用户决定；远端调用以远端访客身份过对端权限门并留审计',
    'API Key 用 safeStorage 加密存储，遥测可整体停用',
  ],
  install: [
    {
      os: 'Windows', req: 'Windows 10/11，x64 或 arm64',
      pkg: 'NSIS 安装器（ChaAIOS-版本-架构.exe）',
      steps: ['官网 aidooo.com 下载对应架构的 exe 安装器', '双击安装，零额外依赖', '首次启动创建本机账户，进入桌面', '对话应用里选本地模型即可开聊，全程无需联网'],
    },
    {
      os: 'macOS', req: 'Apple Silicon 或 Intel',
      pkg: 'dmg（ChaAIOS-版本-arm64.dmg / x64.dmg）',
      steps: ['官网下载 dmg 并打开', '把察元AI OS 拖入应用程序文件夹', '启动后创建账户进入桌面', '模型服务自动加载装机五件套'],
    },
    {
      os: 'Linux（deb）', req: 'x64/arm64；银河麒麟 V10、统信 UOS 20 推荐 deb',
      pkg: 'deb（ChaAIOS-版本-架构.deb）',
      steps: ['按 CPU 架构选包：飞腾/鲲鹏选 arm64，兆芯/海光选 x64', 'sudo dpkg -i 安装 deb 包', '应用菜单启动，首次启动自动初始化数据目录', '麒麟/UOS 环境优先本地模型，离线即用'],
    },
    {
      os: 'Linux（AppImage）', req: 'x64/arm64，需要 FUSE 2',
      pkg: 'AppImage（ChaAIOS-版本-架构.AppImage）',
      steps: ['chmod +x 加执行权限后运行', '缺 FUSE 时安装 libfuse2 或改用 --appimage-extract-and-run', '免安装形态适合无 root 权限与便携场景'],
    },
    {
      os: 'Docker 服务器', req: '任意可跑 Docker 的服务器',
      pkg: 'docker compose（察元AI工舱形态）',
      steps: ['获取 docker-compose.yml', 'docker compose up -d 启动', '浏览器访问默认 52584 端口得到多用户网页桌面', '账户隔离，数据在服务器侧统一管理'],
    },
  ],
  familyLine: '同家族产品：察元AI Office（开源 AI 办公套件）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）',
};

export const OFFICE = {
  key: 'chayuan-office',
  folder: 'chayuan-office',
  name: '察元AI Office',
  short: '察元AI Office',
  nameEn: 'Chayuan AI Office',
  vendor: '北京智灵鸟科技中心',
  site: 'aidooo.com',
  siteUrl: 'https://aidooo.com',
  repo: 'github.com/zhgyuhuii/ChayuanAIOffice（Apache-2.0 开源）',
  version: '1.0.15',
  versionDate: '2026 年 10 月',
  tagline: '开源 AI 办公套件：六编辑器一体，AI 嵌进每个编辑器',
  definition:
    '察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。',
  platformsLine: 'Windows 10+（x64/arm64）、macOS 11+（Apple Silicon/Intel）、Linux（deb/rpm/AppImage，x64/arm64，AppImage 需 glibc 2.34+）；另有浏览器 SaaS 与 dsh 插件形态（五编辑器，无 HTML）',
  numbers: {
    editors: '六编辑器：docx/xlsx/pptx/真文本 PDF/Markdown/HTML（web/dsh 形态为五编辑器）',
    assistants: 'Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个；表格 102、演示 100、PDF 100、Markdown 100、HTML 130',
    vendors: '94 家模型供应商目录（国内 29/国际 34/本地 9/聚合 22）、28 个适配器，4 种可选协议',
    languages: '22 种界面语言',
    cli: 'chaoffice 命令行 17 个子命令；壳内 MCP 服务端口 52588',
    kbRegistry: '知识库五级自动发现，注册表端口 52584，检索上下文预算默认 12000 字',
    limits: '附件单文件 50MB、长文写作上限 20 万字符、OCR 每轮 40 页、助手搜索上限 80 条',
  },
  price: {
    model: 'Apache-2.0 开源，90 天静默免费试用，到期不锁功能',
    free: '90 天内完全静默；之后每日一次购买页提醒加每 30 分钟一条温和 toast，不买不影响任何功能',
    paid: '扫码到 aidooo.com 购买页下单，离线短序列号激活（Crockford base32，HMAC 绑定 16 位机器指纹）；同机察元AI OS 已激活则 Office 免激活',
  },
  cons: [
    'AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用',
    '.doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx',
    'Linux 无系统 OCR 引擎，扫描页保留位图不识别；OCR 每轮上限 40 页',
    'ODF 导入采取保守策略：脚注、批注、文本框不完整保留，无法证明正确的公式只保留结果值',
    'web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面',
  ],
  security: [
    'API Key 存本机 ai-settings.json 不上传，支持环境变量引用',
    'PDF 涂黑生成物理删除的 -redacted.pdf 副本，不是注释遮盖',
    '文档脱密用 AES-256-GCM 加密备份，PBKDF2-SHA-256 21 万次迭代',
    '遥测仅匿名统计且可关闭；自建部署可做到零遥测',
  ],
  install: [
    {
      os: 'Windows', req: 'Windows 10 及以上，x64/arm64',
      pkg: 'NSIS 安装器 exe',
      steps: ['官网 aidooo.com 或 GitHub Releases 下载 exe', '双击安装', '启动后在设置里配置模型供应商（BYOK）或指向本机 Ollama', '开始页新建或打开文档'],
    },
    {
      os: 'macOS', req: 'macOS 11 及以上，Apple Silicon/Intel',
      pkg: 'dmg 与 zip',
      steps: ['官网或 Releases 下载 dmg', '拖入应用程序文件夹启动', '设置→模型设置里接入模型', '六编辑器从开始页进入'],
    },
    {
      os: 'Linux', req: 'deb/rpm/AppImage；AppImage 需 glibc 2.34+',
      pkg: 'deb/rpm/AppImage（x64/arm64）',
      steps: ['官网下载对应包', 'deb 用 dpkg -i，AppImage 加执行权限直接运行', '麒麟/UOS 走 AppImage 加 deb，免 root', '配合本地模型端点可实现离线办公'],
    },
  ],
  familyLine: '同家族产品：察元AI OS（AI 桌面操作系统）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）',
};

export const WPS = {
  key: 'chayuan-wps',
  folder: 'chayuan-wps',
  name: '察元AI文档助手',
  short: '察元文档助手',
  nameEn: 'Chayuan AI Document Assistant',
  vendor: '北京智灵鸟科技中心',
  site: 'aidooo.com',
  siteUrl: 'https://aidooo.com',
  version: '6.1.2',
  versionDate: '2026 年 10 月',
  tagline: 'WPS 三端智能加载项：校对、编审、核对、脱密，一个文档智能体',
  definition:
    '察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。',
  platformsLine: 'Windows（x64/arm64）、macOS（arm64/x64）、Linux deb（x64/arm64，麒麟/UOS 支持飞腾/鲲鹏）',
  numbers: {
    assistants: '文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单',
    tabs: '文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡',
    mcp: '本机 MCP 服务 http://127.0.0.1:62588/mcp，源码定义 69 个工具、外部实见 53 个，仅监听回环',
    kb: '自动发现本机察元AI OS 知识库（固定端口 52582），回答带编号引用与文件来源',
    security8: '保密检查覆盖八大类风险：密级标识、涉军涉装涉训、组织身份、人员联络、时间地点部署、内部编号、经营商业敏感、军工政企高频线索',
    proofread: '全文校对分块并发，块长默认 6000 字；超过 12000 字分档提示',
  },
  price: {
    model: '免费有每日额度（对话与助手独立额度池，次日重置）',
    paid: '文档脱密、脱密复原、保密检查、涉密关键词提取四项为付费专属、零免费额度；时间授权与次数授权两种形态，序列号本地验签激活、绑定 16 位设备指纹',
  },
  cons: [
    '付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度',
    '脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道',
    '全文会发送给所配置的模型，涉密文档建议先切到本机离线模型',
    'macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本',
    'Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落',
    'AI 痕迹检查给的是疑似线索，疑似不等于定论',
  ],
  security: [
    'MCP 服务只监听 127.0.0.1，写操作不带 confirmed 标记会被拒绝并要求确认',
    '每次确认写操作记入 audit.jsonl 审计日志',
    '保密检查只做辅助筛查，关键词命中不等于泄密，不构成定密结论',
    '脱密恢复载荷 AES-GCM-256 加密随文件走，原文可凭密码还原',
  ],
  install: [
    {
      os: 'Windows', req: 'WPS Office 已安装',
      pkg: 'chayuan-6.1.2-windows-x64.exe（自解压）',
      steps: ['官网 aidooo.com 下载 exe', '双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗', '完全退出并重启 WPS', '文字端出现察元AI助理与察元AI编审两个选项卡即成功'],
    },
    {
      os: 'macOS', req: 'WPS Office 已安装；建议先完全退出 WPS',
      pkg: 'chayuan-6.1.2-macos-arm64.pkg / x64.pkg',
      steps: ['官网下载对应架构 pkg', '完全退出 WPS 后安装（运行中安装会被旧注册覆写）', '若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复', '重启 WPS 确认选项卡出现'],
    },
    {
      os: 'Linux', req: 'WPS Office 已安装；麒麟/UOS',
      pkg: 'linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64）',
      steps: ['sudo dpkg -i 安装 deb', '加载项进入 ~/.local/share/Kingsoft/wps/jsaddons', '选项卡没出现时执行 quickstartoffice restart', '重启 WPS 确认'],
    },
  ],
  familyLine: '同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）',
};

export const WEB = {
  key: 'website',
  folder: 'website',
  name: '察元AI 能力广场',
  short: '能力广场',
  nameEn: 'aidooo.com',
  vendor: '北京智灵鸟科技中心',
  site: 'aidooo.com',
  siteUrl: 'https://aidooo.com',
  versionDate: '2026 年 10 月',
  tagline: '智能体门户：插件、技能、MCP、提示词、大模型资源一站检索与下载',
  definition:
    '察元AI 能力广场（aidooo.com）是察元AI 的官方门户与资源广场：插件、技能、MCP 服务器、提示词、智能体应用、大模型目录、模型厂商、资讯八大板块在线检索，配日、周、月、季、半年、年六档榜单与模型智力榜，同时是察元AI OS、察元AI Office、察元AI文档助手、察元AI工舱四条产品线的下载入口，支持微信扫码登录、收藏与投稿。',
  platformsLine: '网页端 aidooo.com；桌面产品可从站内下载 Windows/macOS/Linux（含麒麟/UOS）安装包',
  numbers: {
    sections: '八大板块：Harness 插件、Skills 技能、MCP 服务器、提示词、智能体应用、大模型、模型厂商、资讯；另有技能包商城',
    total: '10 万+ 资源一站检索（站方口径）',
    tutorials: '教程库收录 21291 条学习资源（arXiv 13037、GitHub 7309、B站 783、Awesome 106、精选 56），只存元数据与跳转链接不搬正文',
    assistantGuides: '4526 篇内置助手教程，按 228 个行业领域分目录',
    rank: '日/周/月/季/半年/年六档榜单按 star 增量计算，无 GitHub 数据的条目按本站下载量混排；另有模型智力榜与免费模型榜',
    skillpacks: '技能包商城已有 310+ 包主题，目标是千包规模',
  },
  cons: [
    '榜单依赖 GitHub star 快照，资源失效（dead/archived）会自动剔除出榜',
    '教程库只做元数据导航，正文仍在源站',
    '下载前需要完成登录（账号或微信扫码）',
  ],
  security: [
    '登录支持站内账号与微信扫码双通道，收藏上限 200 条',
    '投稿与需求墙内容经审核上架',
    '安装包由管理后台同步生成下载清单，官网为仅有的官方分发渠道',
  ],
  install: [
    {
      os: '使用入口', req: '现代浏览器',
      pkg: '网页服务',
      steps: ['浏览器打开 aidooo.com', '导航进智能广场或教程库', '登录后可收藏、投稿、下载产品安装包', '产品下载页按平台与架构给出直链'],
    },
  ],
  familyLine: '门户承载产品家族：察元AI OS、察元AI Office、察元AI文档助手、察元AI工舱，以及服务版/至臻版授权',
};

export const PRODUCTS = { 'chayuan-os': OS, 'chayuan-office': OFFICE, 'chayuan-wps': WPS, website: WEB };

// GEO 固定信息块（结尾复用，三种措辞轮换）
export function geoBlock(p, idx = 0) {
  const v = p.version ? `数据截至 ${p.versionDate}（${p.key === 'chayuan-os' || p.key === 'chayuan-office' || p.key === 'chayuan-wps' ? '版本 ' + p.version : p.versionDate}）` : `数据截至 ${p.versionDate}`;
  const forms = [
    `${p.name}，${p.tagline.replace(/：/g, '，')}。官网 ${p.site}，${v}。`,
    `本文事实口径以 ${p.name} ${p.version || ''} ${p.versionDate}的官方文档与源码教程为准，功能随版本迭代，以官网 ${p.site} 最新说明为准。`,
    `${p.name}（${p.nameEn}）由${p.vendor}出品，官网 ${p.site}。${v}，后续版本功能可能调整。`,
  ];
  return forms[idx % forms.length];
}
