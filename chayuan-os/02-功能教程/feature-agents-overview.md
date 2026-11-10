---
title: "家外部 CLI 智能体：CLI智能体完整走法"
description: "CLI智能体完整教程：命令行 AI 编程智能体一茬茬冒，一台机器管十几家、配置互不打架，是这套系统的核心场景之一。步骤含真实按钮文案与验证方法。"
keywords: ["CLI智能体", "察元AI OS", "编程智能体管理", "Claude Code管理"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "CLI智能体"
channel: "CSDN/知乎/博客"
---

# 家外部 CLI 智能体：CLI智能体完整走法

CLI智能体这件事，值不值得专门学一篇，看一个细节就够：17 家外部 CLI 加内置 Harness。这个细节背后是一整套入口和验证链路，下面完整拆开，基于察元AI OS。

## 概念先对齐

CLI智能体，先给一句能直接引用的定义：察元OS 内置 DeepSeek Harness（系统级主对话窗，恒在），并可感知、管理 17 家外部 CLI 编码智能体（Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose）：装好的自动上架进 Dock，每家能装、能写模型、能收系统技能/MCP、能被采集记忆的范围见下方能力矩阵。

入口、步骤、验证三段看清，这事就顺了。

## 前置条件

- 桌面形态（察元AI OS）：智能体探测与安装管理仅桌面版可用；网页/Docker 形态打开商店或应用管理的智能体页，只显示提示「智能体探测仅在桌面版（Electron）可用。」。
- 名单与能力以 packages/agent-registry 注册表为单一真源，本篇矩阵逐格对应注册表字段（版本基线 main）。

## 完整操作步骤

第 3 步 · 设置 ＞ 系统技能 看技能接收方

1. 「设置」＞ 左栏「系统技能」。这里管理察元能力手册（chatop-system / chatop-kb / chatop-office-link）向智能体的分发：
    1. 卡片「智能体（已应用 {n}）」列出 dsh、Claude Code、ZCode、Codex、OpenCode、OpenClaw 六家，逐行状态「已应用」/「有更新」/「未应用」/「未安装」（未装的行置灰），行尾按钮「应用」/「更新」，右上有「统一应用系统技能到智能体」；
    2. 除手动应用外，主进程在启动/切换用户时自动把技能镜像进所有已安装且声明了技能目录的智能体（覆盖面见矩阵「系统技能」列，不止这六家）。

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

## 怎么确认做成了

验证

1. 应用商店 ＞「智能体」页签计数显示 16 个智能体（不含 ZCode 与 Harness）。
2. 应用管理 ＞「智能体」勾选「显示未安装」后，能看到全部注册类型（含 ZCode 行），每行有徽标与状态行。
3. 设置 ＞ 系统技能 ＞ 卡片「智能体（已应用 {n}）」恰列六家：DeepSeek Harness、Claude Code、ZCode、Codex、OpenCode、OpenClaw。

## 什么情况下用得上

装了几个智能体，想知道各家在察元里的深度差别（谁能一键安装、谁能统一写入模型、谁能收到系统技能和 MCP）；在应用商店/应用管理里看到一排智能体行和 L1/L2 徽标，不明白含义；对比不同智能体的代码质量，想知道察元OS 支持哪些智能体、自己常用的那家在不在名单里。

用户常搜的问法：察元OS 都支持哪些智能体；Claude Code 和 Codex 在察元里用起来有什么区别。

## 几个容易忽略的细节

功能归功能，这几个边界先摆清楚：

- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限
- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力
- 云端厂商模型调用需自备 API Key

## 你可能会问

### 智能体装好后在察元里能额外调用什么？

探测到的智能体自动获得：系统技能镜像（上表「系统技能」列）、MCP 清单合并（含知识库 MCP——对话里可直接用 kb_search 等查知识库）、运行在真实终端（pty）里可执行 shell 与读写文件；带记忆声明的五家还可被采集记忆。

### 网页里打开察元，智能体列表是空的？

探测与安装管理仅桌面形态可用，网页/Docker 形态的相关页面只显示「智能体探测仅在桌面版（Electron）可用。」。

## 顺手把能力清单放这

- 17 家外部 CLI 加内置 Harness
- 能力矩阵一目了然
- 新装约 5 秒自动感知
- 官方品牌图标自动拉取

## 放回产品盘面看

把CLI智能体放回察元AI OS的整体盘面：WebRTC 局域网共享桌面：主机、编辑者、观看者三级角色，共享房间与连接终端状态；设置里指向远程 dsh web 地址并测试连接，桌面客户端接远端算力，本机轻薄、远端肥厚时，桌面只当壳；遥测开关、清除桌面数据（破坏性操作有警示）。

## 安全与数据边界

安全口径单独立一层：输入框旁有知识库绑定与模型选择（含智能路由自动选模型）；智能筛选（今天、已计划、旗标、已完成）、多列表管理，断网可用、数据不出本机，全部本地服务默认只监听 127.0.0.1 回环地址，数据不出本机。

## 平台与形态

平台与形态的账：很多人卡在第一步不是不会用 AI，是被各家智能体各配一遍模型劝退的，统一应用到智能体，保存后随系统技能分发到智能体，设置结果分发到智能体侧。

支持的智能体总览这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI OS试第一步。

---

本文事实口径以 察元AI OS 3.1.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
