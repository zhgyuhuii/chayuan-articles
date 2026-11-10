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

关于办公CLI，最能过滤噪音的一个问题是：断网了它还能干什么。这篇从这个标准出发，把察元AI Office的能力面与边界一次说清。

## 什么是办公CLI

把办公CLI拆开看，它指的是这样一类东西：察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。

全部口径出自aidooo.com官方文档，版本对应关系见文末。

## 在察元AI Office里落在哪

办公CLI在察元AI Office里的落点是CLI 命令行：chaoffice 命令行 17 个子命令：信息、转换、创建、幻灯、表格、文档、渲染、向导、搜索、图像、媒体、打开、选区、能力、安装、MCP、技能；install-cli 上 PATH，指针文件指向当前安装。

为什么值得单独说：批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。

## 最短上手路径

试一遍就明白：

1. 确认 CLI 可用：终端运行 `chaoffice --version`

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

## 落点的能力面

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 察元AI Office的能力地图

- 批注与修订：审阅页签全解：批注增删、修订开关、显示标记四档、接受拒绝与上下条导航。
- AI 校对与文本分析：察元AI 页签常用助手组的拼写与语法检查：结果以批注锚定原文（命中片段逐字一致），
- 保密检查与文档脱密：安全保密组三件套：保密检查按八大类风险（密级标识、涉军涉装涉训、组织身份、人……
- CLI 命令行：chaoffice 命令行 17 个子命令：
- MCP Server：壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具，外部智能体可直接操作文档；CLI 形态 29 个工具（25 核心加 4 deck）。
- 连接察元OS 知识库：AI 面板与首页输入框下方书本图标选库（多选），每轮先并行检索（每库前 6 条），

## 价格口径

- Apache-2.0 开源，90 天静默免费试用，到期不锁功能

## 你可能会问

### 终端里 chaoffice 找不到，怎么办？

察元AI Office 每次启动都会把启动器目录写进 ~/.chaoffice/launcher。按第 2 步用引号运行那个路径；想一劳永逸就再跑一次 chaoffice install-cli（第 3 步）。刚装完还没启动过应用时该文件不存在——先启动一次察元AI Office。

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

### 办公CLI要联网吗

让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议；让编程智能体天生会用办公套件，写代码调文档 API 不用翻文档，打印别掉链子、断电别丢稿，这是办公软件的两条底线。以官网 aidooo.com 当前页面为准。

### 办公CLI支持哪些格式

格式兼容是办公软件的生死线，明确支持什么、不支持什么，比含糊其辞负责任；doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx，CLI 可脚本化。以官网 aidooo.com 当前页面为准。

## 一句收束

办公CLI值不值得深入，判断标准很简单：把上面的口径与边界代入你的实际需求，对得上就装来试，对不上不必跟风。

## 更多操作细节

2. 命令找不到时：读启动器指针文件 `~/.chaoffice/launcher`

1. 察元AI Office 每次启动都会把 CLI 启动器所在目录写入 ~/.chaoffice/launcher（Windows：%USERPROFILE%\.chaoffice\launcher，一行一个目录）。终端执行 cat ~/.chaoffice/launcher 得到目录后，用引号包住运行其中的启动器：bash 里 "<目录>/chaoffice"，PowerShell/cmd 里 "<目录>\chaoffice.cmd"；
2. 早期（改名前）安装可能只带 chaoffice / chaoffice.cmd 同名文件，用那个名字即可；
3. 指针文件缺失时的默认位置（macOS /Applications/ChaAI Office.app/Contents/Resources/cli，Windows %LOCALAPPDATA%\Programs\ChaAI Office\resources\cli，Linux /opt/ChaAI Office/resources/cli）。

## 更多操作细节

3. 上 PATH：运行一次 `chaoffice install-cli`

1. 该命令把启动器软链到 /usr/local/bin 或 ~/.local/bin（Windows 写用户 PATH）。结果有三种：成功显示「now linked…」，已存在显示「already on the PATH」，目标位置被其他程序占用或不可写时报错并给出手工命令（如 sudo mkdir -p /usr/local/bin && sudo ln -sf "<启动器>" /usr/local/bin/chaoffice），照抄执行即可。

## 更多操作细节

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

## 更多操作细节

5. 看单个命令的用法：`chaoffice help <命令>` 或 `chaoffice <命令> --help`

1. 打印该命令的 usage、每个选项的说明。

## 更多操作细节

6. 记住三条通用契约（每个命令都一样）

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

如果只记一件事：17 个子命令。剩下的细节，照步骤节走就行。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
