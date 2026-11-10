---
title: "文档自动化实战：知识库五级自动发现"
description: "文档自动化场景实战：批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。从需求到交付的完整工作流。"
keywords: ["文档自动化", "察元AI Office", "chaoffice", "命令行办公"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "文档自动化"
channel: "CSDN/知乎/博客"
---

# 文档自动化实战：知识库五级自动发现

文档自动化这件事，值不值得专门学一篇，看一个细节就够：17 个子命令。这个细节背后是一整套入口和验证链路，下面完整拆开，基于察元AI Office。

## 为什么值得了解

CI 里批量转 PDF，想在终端或脚本里批量转换/生成/读取 Office 文件，不想打开界面，在用 Claude Code、Codex、Cursor 等编码智能体，希望它们能直接操作你的 Word/Excel/PPT/PDF 文件（配合 O39 安装 skill、O38 接 MCP），装完察元AI Office 后终端里输入 chaoffice 提示「命令未找到」，想知道怎么找到它、怎么上 PATH。

## 一步步来

1. 确认 CLI 可用：终端运行 `chaoffice --version`

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

4. 查看全部命令：`chaoffice --help`（或 `chaoffice help`）

1. 打印 17 个子命令清单、全局选项和退出码表。17 个命令（按 --help 输出顺序）：

| 命令 | 干什么 |
|---|---|
| `info` | 打印文件元数据与结构摘要 |
| `convert` | 格式转换 |
| `create` | 从结构化内容新建 pptx/xlsx/docx/pdf |
| `slides` | 读取/编辑/审计/渲染 .pptx |
| `sheet` | 读取/编辑 .xlsx |
| `docs` | 读取/编辑/校验/比对 .docx |
| `render` | 文档逐页渲染成 PNG |
| `guide` | 打印各领域的 ops 参考手册（写 ops 前先读） |
| `search` | 联网搜索（走察元AI Office 里配置的搜索源） |
| `image` | AI 生图并存盘 |
| `media` | 让模型描述/解答图片、视频、音频 |
| `open` | 在察元AI Office 里打开文件（可定位到某页/某块） |
| `selection` | 读取用户在编辑器里当前选中的内容 |
| `capabilities` | 报告本机云能力（搜索/生图/媒体解析）是否已配置 |
| `install-cli` | 把 chaoffice 软链上 PATH |
| `mcp` | 以 MCP 服务器形态提供全部能力 |
| `skill` | 把随附的 agent skill 装进各家智能体 |

7.（可选）三个环境变量与一条安全护栏

1. GENOFFICE_ALLOWED_ROOTS：设成 PATH 风格的目录列表后，chaoffice 只在这些目录内读写，越界报 outside_allowed_roots（退出码 2）；
2. GENOFFICE_USER_DATA：让 chaoffice 指向一个非默认的察元AI Office 用户数据目录（影响 open-documents 注册表与 AI 设置的读取）；
3. GENOFFICE_APP_BIN：应用没装在默认位置时，指向应用可执行文件；
4. 审计日志：每条执行过的命令都追加一行 JSON 到 ~/.chaoffice/cli-audit.jsonl（记录命令、参数、结果码、耗时、目录；密码/密钥类参数会打码为 *）。GENOFFICE_AUDIT_LOG=<路径> 改位置，设为 off 关闭。

## 关键能力点

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 注意事项与真实边界

功能归功能，这几个边界先摆清楚：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 常见问题

### 智能体改文件时报「ChaOffice has this file open」（file_open_in_gui，退出码 2）？

文件正开着标签页时 chaoffice 拒绝改写（防止编辑器下一次保存把改动盖回去）。让用户关掉那个标签，或让智能体用 --out 写到别的路径；确要覆盖只能 --force，且编辑器下一次保存可能把改动盖回去。

### 如何限制智能体（chaoffice）能碰哪些目录？

启动智能体前设 GENOFFICE_ALLOWED_ROOTS，例如 GENOFFICE_ALLOWED_ROOTS=/Users/me/docs:/tmp。越界读写会被拒（outside_allowed_roots，退出码 2）。事后查它动过什么：看 ~/.chaoffice/cli-audit.jsonl。

## 更多操作细节

5. 看单个命令的用法：`chaoffice help <命令>` 或 `chaoffice <命令> --help`

1. 打印该命令的 usage、每个选项的说明。

## 更多操作细节

验证**

1. 终端运行 chaoffice --version：输出 chaoffice <版本号>；
2. chaoffice --help：能看到上表 17 个命令与「Exit codes: 0 ok, 1 usage, 2 file, 3 conversion failed, 4 app not available」一行；
3. chaoffice info <任意一个 .docx 路径>：打印该文件的块数/标题数摘要；
4. 上 PATH 后新开终端直接输入 chaoffice 不再报「command not found」；或 cat ~/.chaoffice/launcher 能得到一行目录。

## 动手前再核对一遍

- 已安装察元AI Office。
- 部分命令（凡涉及排版的：＞pdf 转换、render 逐页渲染、create --type pdf、open）会以隐藏模式拉起察元AI Office 自身进程，需要应用已安装；其余命令（info、docs/sheet/slides 读写等）不依赖界面进程。

## 顺手把能力清单放这

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 放回产品盘面看

把文档自动化放回察元AI Office的整体盘面：外部智能体可直接操作文档；搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；自动注入 AI 面板；让编程智能体天生会用办公套件，写代码调文档 API 不用翻文档。

## 安全与数据边界

安全口径单独立一层：团队共享文档目录直连对象存储，保存即同步，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点；API Key 存本机 ai-settings.json 不上传，支持环境变量引用，十分区设置地图：通用、语言（22 种）、主题、模型、知识库、隐私等，通用区逐项可调。

## 平台与形态

平台与形态的账：壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具；外部智能体可直接操作文档，搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档，自动注入 AI 面板。

## 价格与授权

价格口径一并交代：审阅流是文档协作的核心动作，键盘流顺畅度决定采用率，对外发文前先扫一遍敏感信息，占位符方案让文档既能给外部 AI 处理又不泄密；AI 挂了自动降 9 类本地正则兜底；文档批量、批量操作、表单辅助三组：批量转换与处理，书签转内容控件的表单化。

## 产品家族与搭配

察元AI Office不是单打独斗：chaoffice 命令行 17 个子命令；让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议，批量与脚本化场景图形界面无能为力，CLI 是自动化的口子；文档脱密用 AES-256-GCM 加密备份，PBKDF2-SHA-256 21 万次迭代。

## 几条硬数字

能落到数字上的几条：按能力分设默认模型，AI 功能依赖已配置模型；内置账号登录当前版本未开放，现阶段须 BYOK 或本地模型；六端通用的 AI 面板：打开 AI 助手按钮进面板。

## 离线与内网

离线内网这条线的口径：团队共享文档目录直连对象存储，保存即同步；本地优先、离线可用，内网与离线全可用，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点。

## 能力总账

把察元AI Office的能力总账摊开：加密只读文档仅支持查看，扫描 PDF 变成可搜索可引用的活文档，是档案数字化的第一步，GB 级文档流畅，自动注入 AI 面板。

CLI 命令行这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI Office试第一步。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
