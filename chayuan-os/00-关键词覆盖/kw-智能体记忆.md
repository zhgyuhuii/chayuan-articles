---
title: "一文分清智能体记忆：命令行 AI 编程智能体一茬茬冒"
description: "什么是智能体记忆？命令行 AI 编程智能体一茬茬冒，一台机器管十几家、配置互不打架，是这套系统的核心场景之一。定义、用法、选型判断与常见问题。"
keywords: ["智能体记忆", "察元AI OS", "察元OS"]
product: chayuan-os
category: "00-关键词覆盖"
primary_keyword: "智能体记忆"
channel: "CSDN/知乎/博客"
---

# 一文分清智能体记忆：命令行 AI 编程智能体一茬茬冒

搜智能体记忆的人通常带着两个问题：是不是噱头、值不值得装。这篇不站队，定义、口径、边界三段摆开，你自己对号。

## 什么是智能体记忆

把智能体记忆拆开看，它指的是这样一类东西：察元AI OS（Chayuan AI OS，简称察元OS）是一款 AI 桌面操作系统，以完整桌面环境为壳，内置本地大模型五件套、引用式知识库、17 家外部 CLI 智能体管理、宠物群聊多模型讨论与系统级 MCP 控制面，支持 Windows/macOS/Linux（银河麒麟、统信 UOS）及 Docker 云桌面形态，断网可用、数据不出本机。

本文数字与版本口径以官方文档为准，文末尾注标了截止时间。

## 核心口径一张表

| 口径 | 内容 |
|---|---|
| mcpTools | 86 个 MCP 工具（2026 年 10 月实测） |
| kbPort | 52582（知识库对外服务，固定端口） |
| storeCats | 插件、技能、MCP 插件、智能体、技能包五大类 |

## 在察元AI OS里落在哪

智能体记忆在察元AI OS里的落点是支持的智能体总览：内置 DeepSeek Harness（系统级）加 17 家外部 CLI 智能体统一管理：Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose，各家能力矩阵标明能否一键安装、写入模型、收系统技能、收 MCP、记忆采集。

为什么值得单独说：命令行 AI 编程智能体一茬茬冒，一台机器管十几家、配置互不打架，是这套系统的核心场景之一。

## 最短上手路径

试一遍就明白：

第 4 步 · 对照能力矩阵

18 类智能体（1 内置 + 17 外部 CLI），每格来自注册表 packages/agent-registry/src/index.js：

逐列说明（列 = 注册表字段）：

1. 一键安装 = npm 非空（应用商店「安装」按钮走 npm 受管安装，共 13 家）或 installScript 非空（Cursor CLI 走官方脚本）。Aider/Goose 既无 npm 包也无脚本通道，商店里没有安装按钮。
2. 官方脚本 = installScript 非空：Cursor CLI 固定 https://cursor.com/install；Grok Build 的 https://x.ai/cli/install.sh 在非 mac 系统（npm 平台包限制 darwin）自动降级启用。
3. 模型写入 = modelConfigFile 非空：Claude Code（~/.claude/settings.json）、Codex（~/.codex/config.toml）、OpenCode（~/.config/opencode/opencode.json）、OpenClaw（~/.openclaw/openclaw.json）四家外部 CLI 支持把模型代理地址+模型名写进配置（Harness 经会话模型下拉）——合计即「五家写入面」，操作见对应教程。
4. 系统技能 = skillDir 非空：dsh + 13 家外部 CLI（L2 三家、ZCode、OpenClaw 与商店批次八家）的技能包目录会被 skill-sync 镜像；Gemini CLI / Aider / Goose / Qwen Code 无技能目录约定，不参与。
5. MCP = mcp 非空：同样的 13 家外部 CLI 会被 mcp-sync 全量合并 MCP 清单（控制面 chatop 与知识库 chatop-kb 两个托管条目自动随行）；Gemini CLI / Aider / Goose / Qwen Code 不传播。
6. 记忆采集 = memory.supported：Claude Code / ZCode / Codex / OpenCode / OpenClaw 五家有声明式记忆文件（如 ~/.claude/CLAUDE.md、~/.codex/AGENTS.md），可被采集进「设置 ＞ 记忆」的待确认队列。
7. 自动探测上架：全部 17 家外部 CLI 都会被三级探测识别（① 察元管理态 ② 家目录探针如 ~/.claude/、~/.codex/ ③ PATH 里的命令），自己装的同样自动上架；ZCode 探测照跑但暂不上 Dock（uiVisible: false）。

| 智能体 | 徽标 | 一键安装 | 官方脚本 | 模型写入 | 系统技能 | MCP | 记忆采集 | 自动探测上架 |
|---|---|---|---|---|---|---|---|---|
| DeepSeek Harness（内置） | system | — | — | （会话模型下拉） | | （源清单直读） | — | 恒在 |
| Claude Code | L2 | | — | | | | | |
| ZCode | L1 | — | — | — | | | | （应用管理可见，不上 Dock） |
| Codex | L2 | | — | | | | | |
| OpenCode | L2 | | — | | | | | |
| OpenClaw | L1 | | — | | | | | |
| Gemini CLI | L1 | | — | — | — | — | — | |
| Aider | L1 | — | — | — | — | — | — | |
| Goose | L1 | — | — | — | — | — | — | |
| Qwen Code | L1 | | — | — | — | — | — | |
| Kimi Code | L1 | | — | — | | | — | |
| Crush | L1 | | — | — | | | — | |
| Cursor CLI | L1 | （脚本） | | — | | | — | |
| Copilot CLI | L1 | | — | — | | | — | |
| Droid | L1 | | — | — | | | — | |
| Amp | L1 | | — | — | | | — | |
| Grok Build | L1 | | （非 mac 时） | — | | | — | |
| CodeBuddy | L1 | | — | — | | | — | |

## 落点的能力面

- 17 家外部 CLI 加内置 Harness
- 能力矩阵一目了然
- 新装约 5 秒自动感知
- 官方品牌图标自动拉取

## 察元AI OS的能力地图

- 知识图谱：知识库应用的知识图谱页签：自动生成文档与实体的二部图，
- 跨端知识库共享：设置跨终端互联（DDS）后，对配对终端开模型加知识库授权，kb_list 自动合并远端库、kb_search 可跨机检索。
- 察元AI Office 引用知识库：察元AI Office 文档侧边栏经 kb-client 四级发现找到本机知……
- 验证画像与 AI 面试：开启后从记忆、便签、日程等抽取事实卡（不足 3 张判不可用），
- 支持的智能体总览：内置 DeepSeek Harness（系统级）加 17 家外部 CLI 智能体统一管理：
- 安装智能体：三类装法：npm 包一键安装升级（Claude Code、Codex 等 13 家，

## 实话实说：哪些人不必急着装

- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限
- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）
- 云端厂商模型调用需自备 API Key
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力

这些边界不影响主线使用，但选型前知道比不知道强。

## 数据与安全设计

- 敏感操作全部写审计日志 audit.jsonl，可回放检查
- API Key 用 safeStorage 加密存储，遥测可整体停用

## 价格口径

- 免费下载使用，购买只停提醒、不锁功能
- 首运行起 90 天完全静默，之后每日首次启动弹一次购买页（可关闭）
- 购买 OS 授权后，同机察元AI Office 自动免激活

## 你可能会问

### 智能体装好后在察元里能额外调用什么？

探测到的智能体自动获得：系统技能镜像（上表「系统技能」列）、MCP 清单合并（含知识库 MCP——对话里可直接用 kb_search 等查知识库）、运行在真实终端（pty）里可执行 shell 与读写文件；带记忆声明的五家还可被采集记忆。

### 网页里打开察元，智能体列表是空的？

探测与安装管理仅桌面形态可用，网页/Docker 形态的相关页面只显示「智能体探测仅在桌面版（Electron）可用。」。

### 能和原有系统共存吗？

能。察元OS 是独立桌面应用，不动原有系统；不需要重装系统或分区，装完即用，不想用直接卸载。

### 卸载会删掉我的数据吗？

卸载程序不移除数据目录，重要数据卸载前自行备份即可；要彻底清理就手动删数据根目录。

### 智能体记忆要联网吗

输入框旁有知识库绑定与模型选择（含智能路由自动选模型），本机 Stable Diffusion 链路出图不联网，隐私与免费兼得；开启后从记忆、便签、日程等抽取事实卡（不足 3 张判不可用）。以官网 aidooo.com 当前页面为准。

## 一句收束

智能体记忆值不值得深入，判断标准很简单：把上面的口径与边界代入你的实际需求，对得上就装来试，对不上不必跟风。

## 更多操作细节

第 2 步 · 应用管理看本机识别结果

1. Dock 点「应用管理」＞ 顶部页签「智能体」。
2. 默认只列已识别的智能体，顶部计数「本机智能体 · {n} 型」；勾选「显示未安装」（勾选状态会记住）可看全量排查视图。
3. 每行：图标 ＞ 能力徽标 ＞ 名称（被隐藏过的带「已隐藏」徽标；未识别的标灰「未检测到」）＞ 状态行：
    1. 已识别：「已检测（managed）· 版本 {x.y.z}」——managed = 察元管理态（商店安装/升级版或安装包内置版）；homeDir = 家目录探针命中（自己装的）；path = PATH 里找到命令；
    2. 未识别：「未检测到安装迹象（装好后自动上架/恢复）」。
    3. 行尾按钮：「隐藏」/「恢复」（控制 Dock 上架）与「删记录」；顶部的「重新扫描」（扫描中显示「扫描中…」）随时重测，装完新 CLI 后点它即可，无需重启。
    4. Dock 上架规则：未识别或被隐藏的智能体不显示；识别到的自动上架成正常应用图标。

这篇把支持的智能体总览的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。

---

本文事实口径以 察元AI OS 3.1.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
