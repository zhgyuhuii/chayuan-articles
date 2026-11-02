---
title: "认识办公CLI：它解决什么问题、怎么选"
description: "什么是办公CLI？察元AI Office 自带命令行工具 chaoffice：17 个子命令覆盖文档的转换、创建、结构化读写、渲染、检索与定位，全部在本机引擎上无界面运行，供你在终端手工调用，也供 Claude Code、Codex、Cursor 等 AI 智能体直接驱动。含用法、选型判断与常见问题。"
keywords: ["办公CLI", "察元AI Office", "办公"]
product: chayuan-office
category: "00-关键词覆盖"
primary_keyword: "办公CLI"
channel: "CSDN/知乎/博客"
---

# 认识办公CLI：它解决什么问题、怎么选

聊办公CLI之前先划重点：它不是单一功能，而是一套带入口、步骤和验证的完整流程。察元AI Office在这件事上的设计思路是把入口收拢、把步骤做实、把边界说清，理解了这个，操作就顺了。

## 什么是办公CLI

察元AI Office 自带命令行工具 chaoffice：17 个子命令覆盖文档的转换、创建、结构化读写、渲染、检索与定位，全部在本机引擎上无界面运行，供你在终端手工调用，也供 Claude Code、Codex、Cursor 等 AI 智能体直接驱动。

放到察元AI Office的语境里：开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器，CLI 命令行是其中承上启下的一环。

## 先看看痛点对不对得上

批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。

典型使用场景：CI 里批量转 PDF，脚本批量生成报表。

## 在察元AI Office里怎么用

入口与核心步骤：

1. 确认 CLI 可用：终端运行 chaoffice --version

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

2. 命令找不到时：读启动器指针文件 ~/.chaoffice/launcher

1. 察元AI Office 每次启动都会把 CLI 启动器所在目录写入 ~/.chaoffice/launcher（Windows：%USERPROFILE%\.chaoffice\launcher，一行一个目录）。终端执行 cat ~/.chaoffice/launcher 得到目录后，用引号包住运行其中的启动器：bash 里 "<目录>/chaoffice"，PowerShell/cmd 里 "<目录>\chaoffice.cmd"；
2. 早期（改名前）安装可能只带 chaoffice / chaoffice.cmd 同名文件，用那个名字即可；
3. 指针文件缺失时的默认位置（macOS /Applications/ChaAI Office.app/Contents/Resources/cli，Windows %LOCALAPPDATA%\Programs\ChaAI Office\resources\cli，Linux /opt/ChaAI Office/resources/cli）。

3. 上 PATH：运行一次 chaoffice install-cli

1. 该命令把启动器软链到 /usr/local/bin 或 ~/.local/bin（Windows 写用户 PATH）。结果有三种：成功显示「now linked…」，已存在显示「already on the PATH」，目标位置被其他程序占用或不可写时报错并给出手工命令（如 sudo mkdir -p /usr/local/bin && sudo ln -sf "<启动器>" /usr/local/bin/chaoffice），照抄执行即可。

## 怎么判断适不适合你

适合你的情况：日常就是CI 里批量转 PDF，希望流程固定、结果可验证。

不必勉强的情况：需求不在这条线上的人。察元AI Office的思路是把边界写明白，条件式地推荐。

## 你可能会问

### 如何限制智能体（chaoffice）能碰哪些目录？

启动智能体前设 GENOFFICE_ALLOWED_ROOTS，例如 GENOFFICE_ALLOWED_ROOTS=/Users/me/docs:/tmp。越界读写会被拒（outside_allowed_roots，退出码 2）。事后查它动过什么：看 ~/.chaoffice/cli-audit.jsonl。

### 终端里 chaoffice 找不到，怎么办？

察元AI Office 每次启动都会把启动器目录写进 ~/.chaoffice/launcher。按第 2 步用引号运行那个路径；想一劳永逸就再跑一次 chaoffice install-cli（第 3 步）。刚装完还没启动过应用时该文件不存在——先启动一次察元AI Office。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

### 智能体改文件时报「ChaOffice has this file open」（file_open_in_gui，退出码 2）？

文件正开着标签页时 chaoffice 拒绝改写（防止编辑器下一次保存把改动盖回去）。让用户关掉那个标签，或让智能体用 --out 写到别的路径；确要覆盖只能 --force，且编辑器下一次保存可能把改动盖回去。

## 补充答疑

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

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

6. 记住三条通用契约（每个命令都一样）

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

## 能力点备忘

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 安装与运行答疑

### 必须配置 API Key 才能用 AI 吗？

现阶段是。内置账号登录当前版本未开放，AI 功能需要 BYOK 接入厂商或本机 Ollama 等端点；不配模型时传统办公功能完全可用。

### Linux 上扫描件 OCR 没生效？

Linux 无系统 OCR 引擎，扫描页保留位图不识别；macOS 与 Windows 走系统引擎自动识别。

## 一个真实场景

财务与数据岗的典型用法：Sheets 导入多源 xlsx（Rust 边车保真往返），数据透视表与切片器做汇总，公式追踪与监视窗口排查错误。免费开源套件覆盖财务日常表格工作。注意：ODF 格式导入采取保守策略，复杂公式只保结果值。

## 顺带了解

Sheets 图表：九种图表加推荐图表、图表库、数据透视图与迷你图，真图表对象直接存进 xlsx。

为什么值得看：图表是活的（对象级）不是贴图，改数据图跟着变。

## 还有这个能力

领域助手 4576：Docs 端 4576 个领域助手、229 个领域包（另有 24 个常用助手，全库约 4600 个），表格 102、演示 100、PDF 100、Markdown 100、HTML 130，搜索结果上限 80 条。

## 硬口径两三条

- 94 家模型供应商目录（国内 29/国际 34/本地 9/聚合 22）、28 个适配器，4 种可选协议
- Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个；表格 102、演示 100、PDF 100、Markdown 100、HTML 130

## 如实说不足

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面
- ODF 导入采取保守策略：脚注、批注、文本框不完整保留，无法证明正确的公式只保留结果值

## 定位与家族

察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）。

办公CLI这个概念说清楚了：是什么、在察元AI Office里怎么落地、怎么判断适不适合你。有更具体的问题，看上文问答那节。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
