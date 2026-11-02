---
title: "用SKILL.md实操解决实际问题：场景化用法全记录"
description: "SKILL.md实操场景实战：察元AI Office 自带一份 agent skill（教会 AI 编码智能体使用 chaoffice 命令行的说明书），从需求到交付的完整工作流。"
keywords: ["SKILL.md实操", "SKILL.md", "察元AI Office", "Agent技能", "技能安装"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "SKILL.md实操"
channel: "CSDN/知乎/博客"
---

# 用SKILL.md实操解决实际问题：场景化用法全记录

SKILL.md实操这件事，说简单也简单，说麻烦是真麻烦——麻烦不在功能本身，在于信息散落在各处，拼出一个完整流程要查好几篇资料。这篇文章把它一次讲全：是什么、入口在哪、具体步骤、边界在哪，全部基于察元AI Office的真实界面。

## 为什么值得了解

让 Claude Code 自动生成并操作文档；装了新的察元AI Office 版本，skill 有更新，想一键同步到所有在用的智能体；用的智能体不在 7 家之列，想手动把 skill 文件放进它的技能目录，在用 Claude Code / Codex / Cursor 等 AI 编码智能体，想让它们「开箱就会」操作 Office 文件（生成 PPT、转 PDF、改 Word），而不是你每次手写 chaoffice 命令。

用户常搜的问法：怎么把 chaoffice 技能装进 Claude Code / Codex / Cursor；skill 装到哪个目录？怎么卸载。

## 实操全过程

方式 A · 终端 CLI：chaoffice skill

1. 先看本机情况：chaoffice skill list。输出列出 7 家目标智能体（Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot、OpenCode、Windsurf），每行带：是否检测到（以其配置目录存在为准）、技能目录完全路径、安装状态与已装版本；detail 里还有随附 skill 的版本号与 SKILL.md 路径；
2. 安装：chaoffice skill install <agent|all> [--dir <路径>] [--force]
3. install all 只装检测到的智能体；一家都没检测到时报错，让你改用 --dir；
4. --dir <路径>：装进任意目录（目标就是 <路径>/chaoffice/SKILL.md），适合 7 家之外的助手；
5. 不加 --force 时的保护：目标智能体未检测到（拒绝并提示加 --force 才会新建目录）、已装的 skill 比随附的新（拒绝降级）、或被手工改过（拒绝覆盖，提示加 --force）、或目录被别的内容占用（报 occupied）。所有目标先全量检查再动手，一次拒绝不会留下装了一半的现场；
6. 示例：chaoffice skill install claude-code；chaoffice skill install all；
7. 看随附文件：chaoffice skill path 打印内置 SKILL.md 的完全路径与版本号；
8. 7 家目标与技能目录（CLI 与界面一致）：

| 智能体 | 技能目录 |
|---|---|
| Claude Code | $CLAUDE_CONFIG_DIR 或 ~/.claude/skills |
| Codex | $CODEX_HOME 或 ~/.codex/skills |
| Cursor | ~/.cursor/skills |
| Gemini CLI | ~/.gemini/skills |
| GitHub Copilot | ~/.copilot/skills |
| OpenCode | $XDG_CONFIG_HOME/opencode/skills 或 ~/.config/opencode/skills |
| Windsurf | ~/.codeium/windsurf/skills |

方式 B · 图形界面：设置 ＞ 集成

1. 打开察元AI Office ＞ 设置 ＞ 集成，顶部说明「在 AI 助手里使用 察元AIOffice」，第一部分即「把 skill 安装到你的助手」（右上角显示随附版本「skill <版本>」）；
2. 界面只列出本机检测到的助手，每行右侧按状态给按钮：
    1. 「skill 未安装」＞「安装」；
    2. 「已安装 <版本>，可更新到 <新版本>」或非本应用装的旧版 ＞「更新」；
    3. 「已安装 <版本>（已被修改）」＞「更新」（确认块会提示「会覆盖你对该文件的修改。」）；
    4. 「已安装 <版本>（比本应用附带的新）」＞「重新安装为 <版本>」；
    5. 「目录已被占用」＞「覆盖」（确认块提示「会替换该目录中现有的 SKILL.md。」）；
    6. 已装的三种正常态都有「卸载」；
    7. 点按钮后出现确认块「将写入：<SKILL.md 完全路径>」（卸载为「将删除：…」），点「确认」执行；成功显示「已安装。新开一个会话后生效。」；
    8. 「没有列出我的助手」折叠区提供三条通用路（装的都是同一份 skill，任选其一）：A「安装到其他目录…」（弹出「选择 skills 目录」选择器）、B「下载 skill（zip）」（保存 zip 后交给助手自装，完成后提示「已保存到 <路径>」）、C 用 skills 命令安装（终端运行 npx skills add zhgyuhuii/ChayuanAIOffice，需 Node.js）；
    9. 同页「试一试」区给出三句可直接复制的示例提问（「把 ~/Downloads/report.md 转成 Word 文档」「做一份 6 页的幻灯片，介绍我们第三季度的业绩」「把 budget.xlsx 转成 PDF，并在 察元AIOffice 里打开」）；
    10. 卸载只删本应用写入并记录在案的文件（按台账判定）；目录里若有其他文件会保留。

状态机（两种方式共用，skill list 的 status 字段即此）

1. 判定依据：front matter 的 name + metadata.version、文件 sha256 与台账（userData 的 app-settings.json 里 agentSkillInstalls 键，记录每次写入的版本/哈希/时间/渠道 app·zip·cli）。

| 状态 | 含义 |
|---|---|
| missing | 技能目录里没有 chaoffice/ |
| installed | 本应用写入、版本与字节和随附一致 |
| outdated | 本应用写入、版本比随附旧 |
| modified | 本应用写入、但文件被改过（与台账里的 sha256 不符） |
| foreign | front matter 认得是我们的 skill，但不是本应用写的（别的机器/npx/手工） |
| newer | 已装版本比随附还新（谁写的都算） |
| occupied | chaoffice/ 目录存在但不是我们的 skill |

## 关键能力点

- 7 家智能体投放
- 版本化技能包

## 注意事项与真实边界

功能归功能，这几个边界先摆清楚：

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx

## 接着回答几个常见问题

### 装完之后智能体还是不会用 chaoffice？

两件事：skill 要新开会话才生效（面板提示原文「已安装。新开一个会话后生效。」）；智能体还要能调到命令本身——在智能体环境里跑 chaoffice --version，跑不通就按 O36 第 2-3 步处理。

### skill install 报「the installed skill was edited by hand; not overwriting」？

说明你（或别的工具）改过已装的 SKILL.md。确认不再需要那些改动后加 --force 覆盖：chaoffice skill install <agent> --force；想保留就先备份该文件。

### 升级察元AI Office 后要重装吗？

随附 skill 版本升级后，已装助手的行会出现「更新」按钮（CLI 里 skill list 显示 outdated），点一下或 chaoffice skill install all 即可；没提示就说明还是最新。

## 补充答疑

### 我的智能体不在 7 家名单里怎么办？

用「没有列出我的助手」三条路之一：界面「安装到其他目录…」选它的 skills 目录，或 CLI chaoffice skill install --dir <它的技能目录>，或「下载 skill（zip）」后交给它自装。任何「能读取 SKILL.md 目录」的助手都可用。

### 界面里显示「已安装（非本应用安装）」，要处理吗？

foreign 状态：文件本身是这份 skill（front matter 可识别），只是不是这台机器的察元AI Office 写的（如另一台机器拷来、npx 装的）。版本比随附旧时界面会给「更新」按钮；不旧则无需处理。

### 报「a newer skill X is installed; not downgrading」？

机器上的版本比这份随附的还新（比如装过更新版的察元AI Office）。确认要降级才加 --force；否则什么都不用做，当前版本继续可用。

## 能力点备忘

- 7 家智能体投放
- 版本化技能包

## 安装与运行答疑

### Linux 上扫描件 OCR 没生效？

Linux 无系统 OCR 引擎，扫描页保留位图不识别；macOS 与 Windows 走系统引擎自动识别。

### 必须配置 API Key 才能用 AI 吗？

现阶段是。内置账号登录当前版本未开放，AI 功能需要 BYOK 接入厂商或本机 Ollama 等端点；不配模型时传统办公功能完全可用。

## 一个真实场景

研究生与科研人员的典型用法：PDF 阅读器选区标注加问 AI，Zotero 引文插入与书目生成，扫描件自动 OCR 变可搜索文本。读、引、记、写在一个应用里闭环。注意：Linux 端无系统 OCR 引擎，扫描页不识别。

## 顺带了解

连接察元OS 知识库：AI 面板与首页输入框下方书本图标选库（多选），每轮先并行检索（每库前 6 条），回答带编号引用角标，点开看来源与下载原文；上下文预算 8000 到 32000 字四档（默认 12000）；五级自动发现本机察元OS 知识库服务，检索失败不阻塞发送。

为什么值得看：写材料引用内部资料且带出处，写作与知识库一条链打通。

这篇把Agent Skill 安装器的链路拆完了。真机操作一遍比看十遍文章有用，现在就动手试第一步。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
