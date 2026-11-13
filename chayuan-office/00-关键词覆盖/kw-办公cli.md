---
title: "办公CLI入门指南：开源 AI 办公套件"
description: "什么是办公CLI？批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。定义、用法、选型判断与常见问题。"
keywords: ["办公CLI", "察元AI Office", "办公"]
product: chayuan-office
category: "00-关键词覆盖"
primary_keyword: "办公CLI"
channel: "CSDN/知乎/博客"
---

# 办公CLI入门指南：开源 AI 办公套件

办公CLI的判断标准很朴素：断网了、无人值守了，命令还能不能把活干完。这篇从这条标准出发，把能力面与边界一次摊开，产品背景是察元AI Office。

## 什么是办公CLI

先交代载体：察元AI Office（Chayuan AI Office），Apache-2.0 开源的 AI 办公套件，docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器同处一个应用；AI 校对用批注锚回原文，修订追踪给出通用修订；Docs 端的领域助手有 4576 个；模型接入支持 BYOK，94 家供应商目录之外，本机 Ollama 这类本地端点也能接；三平台 Windows/macOS/Linux（含麒麟/UOS）都支持，本地优先，离线可用。办公CLI指的就是它自带的命令行层。

以上信息来自官方文档，本篇核对的版本号在文末。

## CLI 落在哪里

落点是 chaoffice 命令行：共 17 个子命令——信息、转换、创建、幻灯、表格、文档、渲染、向导、搜索、图像、媒体、打开、选区、能力、安装、MCP、技能；install-cli 负责上 PATH，指针文件指向当前安装。

值得单说的原因：批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。

## 最短上手路径

先确认命令能跑起来：

1. 确认 CLI 可用：终端运行 `chaoffice --version`

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

## 落点的能力面

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 命令之外的能力面

- 批注与修订：审阅页签全解：批注增删、修订开关、显示标记四档、接受拒绝与上下条导航。
- AI 校对与文本分析：察元AI 页签常用助手组的拼写与语法检查：结果以批注锚定原文（命中片段逐字一致），
- 保密检查与文档脱密：安全保密组三件套：保密检查按八大类风险（密级标识、涉军涉装涉训、组织身份、人……
- CLI 命令行：chaoffice 命令行 17 个子命令：
- MCP Server：壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具，外部智能体可直接操作文档；CLI 形态 29 个工具（25 核心加 4 deck）。
- 连接察元OS 知识库：AI 面板与首页输入框下方书本图标选库（多选），每轮先并行检索（每库前 6 条），

## 命令行使用疑问

### 终端里 chaoffice 找不到，怎么办？

察元AI Office 每次启动都会把启动器目录写进 ~/.chaoffice/launcher。按第 2 步用引号运行那个路径；想一劳永逸就再跑一次 chaoffice install-cli（第 3 步）。刚装完还没启动过应用时该文件不存在——先启动一次察元AI Office。

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

### 办公CLI 的命令都离线可用吗？

不一定。文件类命令（转换、创建、编辑、渲染）在本机完成，涉及排版的转换还要拉起应用自身的隐藏进程；联网搜索走应用里配置的搜索源，生图与媒体解析这类云能力是否可用，由 capabilities 命令报告。

### 命令行能处理哪些文件类型？

convert 做格式转换，slides、sheet、docs 分别对应 pptx、xlsx、docx，render 把文档逐页渲染成 PNG，create 从结构化内容新建 pptx/xlsx/docx/pdf；doc 与 ppt 老格式明确不支持打开，先转成 docx/pptx 再进命令。

## 一句收束

办公CLI值不值得投入，看你的重复劳动有多少：每周固定格式的转换、批量处理、定时渲染这类活越多，命令行的回报越直接；偶尔改一份文档的人，图形界面足够。

## 读启动器指针文件

2. 命令找不到时：读启动器指针文件 `~/.chaoffice/launcher`

1. 察元AI Office 每次启动都会把 CLI 启动器所在目录写入 ~/.chaoffice/launcher（Windows：%USERPROFILE%\.chaoffice\launcher，一行一个目录）。终端执行 cat ~/.chaoffice/launcher 得到目录后，用引号包住运行其中的启动器：bash 里 "<目录>/chaoffice"，PowerShell/cmd 里 "<目录>\chaoffice.cmd"；
2. 早期（改名前）安装可能只带 chaoffice / chaoffice.cmd 同名文件，用那个名字即可；
3. 指针文件缺失时的默认位置（macOS /Applications/ChaAI Office.app/Contents/Resources/cli，Windows %LOCALAPPDATA%\Programs\ChaAI Office\resources\cli，Linux /opt/ChaAI Office/resources/cli）。

## 把命令挂上 PATH

3. 上 PATH：运行一次 `chaoffice install-cli`

1. 该命令把启动器软链到 /usr/local/bin 或 ~/.local/bin（Windows 写用户 PATH）。结果有三种：成功显示「now linked…」，已存在显示「already on the PATH」，目标位置被其他程序占用或不可写时报错并给出手工命令（如 sudo mkdir -p /usr/local/bin && sudo ln -sf "<启动器>" /usr/local/bin/chaoffice），照抄执行即可。

## 全部子命令一览

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

## 查单个命令的用法

5. 看单个命令的用法：`chaoffice help <命令>` 或 `chaoffice <命令> --help`

1. 打印该命令的 usage、每个选项的说明。

## 三条通用契约

6. 记住三条通用契约（每个命令都一样）

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

17 个子命令的名录记不记无所谓，--help 随时能打印；真正要记的是三条通用契约，它们对所有命令生效。

---

命令行为与退出码口径对应 1.0.15 版，数据截至 2026 年 10 月；子命令如有增减，以官方文档的最新说明为准。
