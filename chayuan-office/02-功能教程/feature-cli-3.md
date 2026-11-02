---
title: "文档自动化实战：一个真实场景的完整工作流"
description: "文档自动化场景实战：察元AI Office 自带命令行工具 chaoffice：17 个子命令覆盖文档的转换、创建、结构化读写、渲染、检索与定位，全部在本机引擎上无界面运行，供你在终端手工调用，也供 Claude Code、Codex、Cursor 等 AI 智能体直接驱动。从需求到交付的完整工作流。"
keywords: ["文档自动化", "察元AI Office", "chaoffice", "命令行办公"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "文档自动化"
channel: "CSDN/知乎/博客"
---

# 文档自动化实战：一个真实场景的完整工作流

文档自动化这件事，说简单也简单，说麻烦是真麻烦——麻烦不在功能本身，在于信息散落在各处，拼出一个完整流程要查好几篇资料。这篇文章把它一次讲全：是什么、入口在哪、具体步骤、边界在哪，全部基于察元AI Office的真实界面。

## 为什么值得了解

脚本批量生成报表，在用 Claude Code、Codex、Cursor 等编码智能体，希望它们能直接操作你的 Word/Excel/PPT/PDF 文件（配合 O39 安装 skill、O38 接 MCP），装完察元AI Office 后终端里输入 chaoffice 提示「命令未找到」，想知道怎么找到它、怎么上 PATH；CI 里批量转 PDF。

用户常搜的问法：chaoffice 命令怎么装？终端里找不到 chaoffice；chaoffice 一共有哪些命令？能做什么。

## 具体怎么操作

1. 确认 CLI 可用：终端运行 chaoffice --version

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

2. 命令找不到时：读启动器指针文件 ~/.chaoffice/launcher

1. 察元AI Office 每次启动都会把 CLI 启动器所在目录写入 ~/.chaoffice/launcher（Windows：%USERPROFILE%\.chaoffice\launcher，一行一个目录）。终端执行 cat ~/.chaoffice/launcher 得到目录后，用引号包住运行其中的启动器：bash 里 "<目录>/chaoffice"，PowerShell/cmd 里 "<目录>\chaoffice.cmd"；
2. 早期（改名前）安装可能只带 chaoffice / chaoffice.cmd 同名文件，用那个名字即可；
3. 指针文件缺失时的默认位置（macOS /Applications/ChaAI Office.app/Contents/Resources/cli，Windows %LOCALAPPDATA%\Programs\ChaAI Office\resources\cli，Linux /opt/ChaAI Office/resources/cli）。

3. 上 PATH：运行一次 chaoffice install-cli

1. 该命令把启动器软链到 /usr/local/bin 或 ~/.local/bin（Windows 写用户 PATH）。结果有三种：成功显示「now linked…」，已存在显示「already on the PATH」，目标位置被其他程序占用或不可写时报错并给出手工命令（如 sudo mkdir -p /usr/local/bin && sudo ln -sf "<启动器>" /usr/local/bin/chaoffice），照抄执行即可。

4. 查看全部命令：chaoffice --help（或 chaoffice help）

1. 打印 17 个子命令清单、全局选项和退出码表。17 个命令（按 --help 输出顺序）：

| 命令 | 干什么 |
|---|---|
| info | 打印文件元数据与结构摘要 |
| convert | 格式转换 |
| create | 从结构化内容新建 pptx/xlsx/docx/pdf |
| slides | 读取/编辑/审计/渲染 .pptx |
| sheet | 读取/编辑 .xlsx |
| docs | 读取/编辑/校验/比对 .docx |
| render | 文档逐页渲染成 PNG |
| guide | 打印各领域的 ops 参考手册（写 ops 前先读） |
| search | 联网搜索（走察元AI Office 里配置的搜索源） |
| image | AI 生图并存盘 |
| media | 让模型描述/解答图片、视频、音频 |
| open | 在察元AI Office 里打开文件（可定位到某页/某块） |
| selection | 读取用户在编辑器里当前选中的内容 |
| capabilities | 报告本机云能力（搜索/生图/媒体解析）是否已配置 |
| install-cli | 把 chaoffice 软链上 PATH |
| mcp | 以 MCP 服务器形态提供全部能力 |
| skill | 把随附的 agent skill 装进各家智能体 |

5. 看单个命令的用法：chaoffice help <命令> 或 chaoffice <命令> --help

1. 打印该命令的 usage、每个选项的说明。

6. 记住三条通用契约（每个命令都一样）

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

7.（可选）三个环境变量与一条安全护栏

1. GENOFFICE_ALLOWED_ROOTS：设成 PATH 风格的目录列表后，chaoffice 只在这些目录内读写，越界报 outside_allowed_roots（退出码 2）；
2. GENOFFICE_USER_DATA：让 chaoffice 指向一个非默认的察元AI Office 用户数据目录（影响 open-documents 注册表与 AI 设置的读取）；
3. GENOFFICE_APP_BIN：应用没装在默认位置时，指向应用可执行文件；
4. 审计日志：每条执行过的命令都追加一行 JSON 到 ~/.chaoffice/cli-audit.jsonl（记录命令、参数、结果码、耗时、目录；密码/密钥类参数会打码为 *）。GENOFFICE_AUDIT_LOG=<路径> 改位置，设为 off 关闭。

## 关键能力点

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 它的局限也要说清楚

功能归功能，这几个边界先摆清楚：

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx

## 接着回答几个常见问题

### 智能体改文件时报「ChaOffice has this file open」（file_open_in_gui，退出码 2）？

文件正开着标签页时 chaoffice 拒绝改写（防止编辑器下一次保存把改动盖回去）。让用户关掉那个标签，或让智能体用 --out 写到别的路径；确要覆盖只能 --force，且编辑器下一次保存可能把改动盖回去。

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

### 终端里 chaoffice 找不到，怎么办？

察元AI Office 每次启动都会把启动器目录写进 ~/.chaoffice/launcher。按第 2 步用引号运行那个路径；想一劳永逸就再跑一次 chaoffice install-cli（第 3 步）。刚装完还没启动过应用时该文件不存在——先启动一次察元AI Office。

## 补充答疑

### 如何限制智能体（chaoffice）能碰哪些目录？

启动智能体前设 GENOFFICE_ALLOWED_ROOTS，例如 GENOFFICE_ALLOWED_ROOTS=/Users/me/docs:/tmp。越界读写会被拒（outside_allowed_roots，退出码 2）。事后查它动过什么：看 ~/.chaoffice/cli-audit.jsonl。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

## 更多操作细节

4. 查看全部命令：chaoffice --help（或 chaoffice help）

1. 打印 17 个子命令清单、全局选项和退出码表。17 个命令（按 --help 输出顺序）：

| 命令 | 干什么 |
|---|---|
| info | 打印文件元数据与结构摘要 |
| convert | 格式转换 |
| create | 从结构化内容新建 pptx/xlsx/docx/pdf |
| slides | 读取/编辑/审计/渲染 .pptx |
| sheet | 读取/编辑 .xlsx |
| docs | 读取/编辑/校验/比对 .docx |
| render | 文档逐页渲染成 PNG |
| guide | 打印各领域的 ops 参考手册（写 ops 前先读） |
| search | 联网搜索（走察元AI Office 里配置的搜索源） |
| image | AI 生图并存盘 |
| media | 让模型描述/解答图片、视频、音频 |
| open | 在察元AI Office 里打开文件（可定位到某页/某块） |
| selection | 读取用户在编辑器里当前选中的内容 |
| capabilities | 报告本机云能力（搜索/生图/媒体解析）是否已配置 |
| install-cli | 把 chaoffice 软链上 PATH |
| mcp | 以 MCP 服务器形态提供全部能力 |
| skill | 把随附的 agent skill 装进各家智能体 |

5. 看单个命令的用法：chaoffice help <命令> 或 chaoffice <命令> --help

1. 打印该命令的 usage、每个选项的说明。

6. 记住三条通用契约（每个命令都一样）**

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

文档自动化的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
