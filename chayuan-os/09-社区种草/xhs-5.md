---
title: "一台电脑管17个AI员工使用分享"
description: "一台电脑管17个AI员工使用分享：察元OS 内置 DeepSeek Harness（系统级主对话窗，恒在），真实体感与实话。"
keywords: ["一台电脑管17个AI员工", "察元AI OS", "程序员日常", "效率工具"]
product: chayuan-os
category: "09-社区种草"
primary_keyword: "一台电脑管17个AI员工"
channel: "小红书"
---

# 一台电脑管17个AI员工使用分享

Claude Code 和 Codex 们统一上岗。用了两周，认真说说感受，好的坏的都讲。

先交个底：察元OS 内置 DeepSeek Harness（系统级主对话窗，恒在），并可感知、管理 17 家外部 CLI 编码智能体（Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose）：装好的自动上架进 Dock，每家能装、能写模型、能收系统技能/MCP、能被采集记忆的范围见下方能力矩阵。

## 我的使用顺序

1. Dock 点「应用商店」＞ 顶部页签选「智能体」。工具条下方显示说明「一键安装/升级本机 CLI 智能体，装完自动进入应用管理与桌面」，列表首行显示计数「16 个智能体 · 安装态自动识别，未安装不进入应用管理」。
2. 每行从左到右：图标 ＞ 智能体名 ＞ 能力徽标（system 紫 / L2 绿 / L1 蓝）＞ 安装态（绿色「已安装」（后跟 · v<版本>）或灰色「未安装」）＞ 安装方式明文（等宽字体，如 npm install -g @anthropic-ai/claude-code）＞ 右侧按钮。
3. 列表固定 16 行（17 家外部 CLI 去掉察元自家的 ZCode），顺序：Claude Code、Codex、OpenCode、OpenClaw、Gemini CLI、Aider、Goose、Qwen Code、Kimi Code、Crush、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy。DeepSeek Harness 是系统自身，不走商店。

## 三个点，两好一坑

下面几条是真实用出来的体感，不是参数表搬运：

1. 17 家外部 CLI 加内置 Harness
2. 能力矩阵一目了然
3. 17 家外部 CLI 智能体（Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose）加内置 DeepSeek Harness

## 也要说实话

- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限
- 全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重
- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）

适合谁：对比不同智能体的代码质量、按项目选趁手的智能体这类需求的人。不适合谁：上面几条缺点正好戳中的场景，别硬上。

## 评论区高频问题

### 为什么 Aider 和 Goose 没有「安装」按钮？

这两家不经 npm 分发、也没有官方脚本通道，商店行不提供安装入口（安装方式一栏为空）。按官方途径自行安装后，应用管理 ＞「智能体」＞「重新扫描」即自动上架（Aider 探针 ~/.aider / ~/.aider.conf.yml / PATH 里的 aider；Goose 探针 ~/.goose / PATH 里的 goose）。

### 智能体装好后在察元里能额外调用什么？

探测到的智能体自动获得：系统技能镜像（上表「系统技能」列）、MCP 清单合并（含知识库 MCP——对话里可直接用 kb_search 等查知识库）、运行在真实终端（pty）里可执行 shell 与读写文件；带记忆声明的五家还可被采集记忆。

### 网页里打开察元，智能体列表是空的？

探测与安装管理仅桌面形态可用，网页/Docker 形态的相关页面只显示「智能体探测仅在桌面版（Electron）可用。」。

## 顺手记的要点

- 装机五件套：Qwen3-4B 对话、BGE-M3 嵌入、BGE 重排、whisper-small 语音识别、piper 中文语音合成
- docx/xlsx/pdf/csv/html 与扫描件 OCR，单文件不超过 48MB
- 52583（本机 MCP HTTP 服务，回环免 token）

## 怎么入

官网 aidooo.com，免费下载使用，购买只停提醒、不锁功能。先试再决定，不用一上来就掏钱。

## 关于察元AI OS

察元AI OS（Chayuan AI OS，简称察元OS）是一款 AI 桌面操作系统，以完整桌面环境为壳，内置本地大模型五件套、引用式知识库、17 家外部 CLI 智能体管理、宠物群聊多模型讨论与系统级 MCP 控制面，支持 Windows/macOS/Linux（银河麒麟、统信 UOS）及 Docker 云桌面形态，断网可用、数据不出本机。同家族产品：察元AI Office（开源 AI 办公套件）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）。官网 aidooo.com。

## 边界速览

- 云端厂商模型调用需自备 API Key
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力

## 数字口径

- 模型配置可一键写入五家（Harness/Claude Code/Codex/OpenCode/OpenClaw），MCP 配置自动传播 13 家
- 66 家内置云端厂商目录加自定义 OpenAI 兼容厂商
- 86 个 MCP 工具（2026 年 10 月实测）
- 127.0.0.1:52581（OpenAI 兼容统一模型代理）

## 知识库的检索机制

导入 docx、xlsx、pdf、csv、html 与扫描件（本地 OCR）后，检索走向量加全文的混合链路，可选本地重排精排；问答以流式输出并带编号引用，点开脚注能看到出处片段与源文件。另配知识图谱页签，把文档实体与跨文档关系画成二部图。全部索引与原文留在本机。

## 远程访问的形态

WebRTC 局域网共享桌面分主机、编辑者、观看者三级角色；公网远程走出站云中继（支持自建），还能生成限时云链接把对话页分享给外部设备，停止即失效。手机浏览器可直接镜像桌面，另有安卓壳应用。

## 模型服务的实际构成

装机自带的五件套覆盖完整离线链路：Qwen3-4B 负责对话、BGE-M3 做嵌入、BGE 重排提升检索精度、whisper-small 跑语音识别、piper 做中文语音合成。模型中心里还能在线补更强档位（Qwen3-8B/14B、小内存档 LFM2.5、图像理解的 MiniCPM-V 等），下载源多路自动换。内存仪表实时显示每个模型的占用，空闲 15 分钟自动卸载，常用模型可钉住常驻。

## 跨终端互联的安全设计

同一网段的多台终端经 RTPS 多播互相发现，配对后按类别授权（模型加知识库、智能体执行）。远端调用以远端访客身份通过对端权限门并留审计；出厂默认零共享，开哪类授权完全由用户决定。

## 记忆系统的三档作用域

记忆库分 global（全机共享）、agent（单智能体私有）、project（按项目）三档。任一智能体写入的记忆，最新条目会自动投影进各家 CLI 的配置文件（AGENTS.md 与 CLAUDE.md），换智能体接班不用重新交代背景；每条记忆带溯源，谁写的在设置里可查。

## 云桌面形态

整套系统可无头跑在 Docker 里作为多用户云桌面（察元AI工舱形态）：员工浏览器打开即用，账户隔离，数据在服务器侧统一管理。默认只监听回环端口，暴露面完全自己控制，适合团队统一供给算力与知识库。

## 统一模型代理的用法

全部模型走一个本机回环地址（127.0.0.1:52581）对外服务：OpenAI chat、responses 与 Anthropic messages 协议互转，对话、嵌入、重排、语音端点齐备。智能体和其他软件只需指向这一个地址，本地模型没运行会自动拉起，厂商请求自动转发云端。

以上是真实使用感受，优缺点都写了，按需种草。

#程序员日常 #效率工具 #察元AI

---

察元AI OS，AI 桌面操作系统，本地大模型、知识库、智能体、宠物群聊装进一个桌面。官网 aidooo.com，数据截至 2026 年 10 月（版本 3.1.15）。
