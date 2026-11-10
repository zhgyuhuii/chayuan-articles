---
title: "拆开看命令行办公：开源 AI 办公套件"
description: "命令行办公的机制拆解：批量与脚本化场景图形界面无能为力，CLI 是自动化的口子。设计取舍与边界一次讲清，基于察元AI Office。"
keywords: ["命令行办公", "察元AI Office", "chaoffice", "文档自动化"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "命令行办公"
channel: "CSDN/知乎/博客"
---

# 拆开看命令行办公：开源 AI 办公套件

「chaoffice 命令怎么装？终端里找不到 chaoffice」——这个问题最近被问了好几次。答案不复杂：命令行办公在察元AI Office里是现成能力，这篇把入口、步骤、验证一次写全，按钮文案原样引用。

## 这个功能到底解决什么问题

命令行办公能做的事拆开就这几件：17 个子命令，可上 PATH，转换与创建全支持。对应的界面入口是CLI 命令行

入口、步骤、验证三段看清，这事就顺了。

## 一步步来

按最短路径验证一遍：

5. 看单个命令的用法：`chaoffice help <命令>` 或 `chaoffice <命令> --help`

1. 打印该命令的 usage、每个选项的说明。

7.（可选）三个环境变量与一条安全护栏

1. GENOFFICE_ALLOWED_ROOTS：设成 PATH 风格的目录列表后，chaoffice 只在这些目录内读写，越界报 outside_allowed_roots（退出码 2）；
2. GENOFFICE_USER_DATA：让 chaoffice 指向一个非默认的察元AI Office 用户数据目录（影响 open-documents 注册表与 AI 设置的读取）；
3. GENOFFICE_APP_BIN：应用没装在默认位置时，指向应用可执行文件；
4. 审计日志：每条执行过的命令都追加一行 JSON 到 ~/.chaoffice/cli-audit.jsonl（记录命令、参数、结果码、耗时、目录；密码/密钥类参数会打码为 *）。GENOFFICE_AUDIT_LOG=<路径> 改位置，设为 off 关闭。

## 边界先摆桌面上

边界先摆在桌面上：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 你可能会问

### 终端里 chaoffice 找不到，怎么办？

察元AI Office 每次启动都会把启动器目录写进 ~/.chaoffice/launcher。按第 2 步用引号运行那个路径；想一劳永逸就再跑一次 chaoffice install-cli（第 3 步）。刚装完还没启动过应用时该文件不存在——先启动一次察元AI Office。

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

### 智能体改文件时报「ChaOffice has this file open」（file_open_in_gui，退出码 2）？

文件正开着标签页时 chaoffice 拒绝改写（防止编辑器下一次保存把改动盖回去）。让用户关掉那个标签，或让智能体用 --out 写到别的路径；确要覆盖只能 --force，且编辑器下一次保存可能把改动盖回去。

## 更多操作细节

1. 确认 CLI 可用：终端运行 `chaoffice --version`

1. 看到版本号即就绪；版本行形如 chaoffice <版本>（源码里版本为构建时内联的 @chaoffice/cli 包版本）。

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

6. 记住三条通用契约（每个命令都一样）

1. --json：加在任意命令上，stdout 输出一个 JSON 对象。成功为 { "status": "ok", "command", "summary", "output_path"?, "warnings"?, "detail"? }（批量编辑部分失败时 status 为 "partial"）；失败为 { "status": "error", "command", "code", "error", "message", "suggestion"?, "detail"? }——error 是稳定错误名，程序据此分支，message 给人读，suggestion 告诉你下一步。
2. 退出码：0 成功；1 用法错误或 ops 被拒；2 文件不存在或输出文件已存在（含「文件正被编辑器打开」「越出允许目录」）；3 转换失败；4 应用不可用。
3. 稳定错误名（--json 的 error 字段）：unknown_command、unknown_option、missing_argument、invalid_argument、invalid_json、unsupported、unknown_op、op_rejected、target_not_found、out_of_range、sheet_not_found、file_not_found、resource_limit、output_exists、file_open_in_gui、file_not_open_in_gui、outside_allowed_roots、conversion_failed、app_unavailable、invalid_usage。未知选项一律拒绝（退出码 1），不会静默忽略。

## 更多操作细节

验证**

1. 终端运行 chaoffice --version：输出 chaoffice <版本号>；
2. chaoffice --help：能看到上表 17 个命令与「Exit codes: 0 ok, 1 usage, 2 file, 3 conversion failed, 4 app not available」一行；
3. chaoffice info <任意一个 .docx 路径>：打印该文件的块数/标题数摘要；
4. 上 PATH 后新开终端直接输入 chaoffice 不再报「command not found」；或 cat ~/.chaoffice/launcher 能得到一行目录。

## 补充答疑

### 如何限制智能体（chaoffice）能碰哪些目录？

启动智能体前设 GENOFFICE_ALLOWED_ROOTS，例如 GENOFFICE_ALLOWED_ROOTS=/Users/me/docs:/tmp。越界读写会被拒（outside_allowed_roots，退出码 2）。事后查它动过什么：看 ~/.chaoffice/cli-audit.jsonl。

## 动手前再核对一遍

- 已安装察元AI Office。
- 部分命令（凡涉及排版的：＞pdf 转换、render 逐页渲染、create --type pdf、open）会以隐藏模式拉起察元AI Office 自身进程，需要应用已安装；其余命令（info、docs/sheet/slides 读写等）不依赖界面进程。

## 顺手把能力清单放这

- 17 个子命令
- 转换与创建全支持
- 可上 PATH

## 放回产品盘面看

把命令行办公放回察元AI Office的整体盘面：chaoffice 命令行 17 个子命令，开源 AI 办公套件：六编辑器一体，AI 嵌进每个编辑器，AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用，开源办公套件能离线装、信创环境能跑，是替换传统办公链路的第一步。

## 平台与形态

平台与形态的账：chaoffice 命令行 17 个子命令，覆盖 Windows/macOS/Linux（含麒麟/UOS），开源 AI 办公套件：六编辑器一体，AI 嵌进每个编辑器，AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用。

CLI 命令行这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI Office试第一步。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
