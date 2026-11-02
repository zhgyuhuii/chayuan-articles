---
title: "拆开看文档MCP实操：原理、架构与实现细节"
description: "文档MCP实操深度解析：察元AI Office 可以把自己变成一台 MCP（Model Context Protocol）服务器，机制、设计取舍与边界一次讲清。"
keywords: ["文档MCP实操", "文档MCP", "察元AI Office", "MCP服务", "MCP接口"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "文档MCP实操"
channel: "CSDN/知乎/博客"
---

# 拆开看文档MCP实操：原理、架构与实现细节

文档MCP实操是什么、怎么用，一篇讲清楚。开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器。下面进入正题：先概念，再步骤，最后是边界与常见问题，基于察元AI Office整理。

## 先对齐一下概念

察元AI Office 可以把自己变成一台 MCP（Model Context Protocol）服务器，让任何支持 MCP 的 AI 客户端（Claude Code、Codex、Cursor、Claude Desktop 等）像调用工具一样创建、读取、结构化编辑和转换 Office 文件。两种形态：CLI 形态 chaoffice mcp（29 个工具，含大纲建 deck 的 deck 族）与应用内形态「本地 MCP 服务」（设置 集成，默认端口 52588，能直接操作你正打开的标签页）。

让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议。

按真实界面写，按钮文案原样引用。

## 背后是怎么运作的

让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议。

能力面拆开看：外部智能体可接入；CLI 29 工具，HTTP MCP 服务。

一个常被问到的问题：stdio 和「本地 MCP 服务」两种形态怎么选。助手能自己拉起命令就用 stdio（形态 A）：不需要应用开着、配置只有一条、工具最全（29 个，含 deck 流水线）。想让助手操作你正打开的窗口/标签页（open_documents）、或客户端只能填 URL，才用应用内 HTTP 形态（形态 B）。面板原文也建议：「助手能运行终端命令就用 CLI，不能就用 MCP」。

从提问口径看，用户最关心的是怎么让 Claude Code / Cursor 通过 MCP 操作 Office 文件？

## 操作步骤详解

按最短路径验证一遍：

形态 A（推荐）· CLI 形态 chaoffice mcp——由助手自己启动

claude mcp add --transport stdio chaoffice -- chaoffice mcp

json

{ "mcpServers": { "chaoffice": { "command": "chaoffice", "args": ["mcp"] } } }

（chaoffice 还没上 PATH 时，把 command 换成 ~/.chaoffice/launcher 里那个带引号的完整启动器路径。）

1. 客户端能运行终端命令时，在它的 MCP 配置里加一条 stdio 服务器。Claude Code 在终端运行一次：
2. Cursor、Claude Desktop 等：把这段 JSON 加进它的 MCP 配置（mcp.json 或设置里的「添加 MCP 服务器」）：
    1. 该形态与 CLI 能力完全相同，共 29 个工具：25 个核心工具（info、convert、create_docx、create_xlsx、create_pdf、create_pptx、docs_read、docs_apply、docs_check、sheet_read、sheet_apply、sheet_check、slides_read、slides_apply、slides_audit、slides_render、slides_check、slides_replace、render、guide、capabilities、search、image、media、open）+ 4 个 deck 流水线工具（deck_start 写样式表与大纲并校验 ＞ deck_page 逐页写规格并逐页校验 ＞ deck_build 构建 pptx ＞ deck_replace 修单页重建）。
    2. 不想装客户端配置、只想本机手动起一个 HTTP 服务时：终端运行 chaoffice mcp --http <端口>（端口填 0 则自动挑空闲端口；--host 缺省只绑 127.0.0.1，--token 给访问加 Bearer 鉴权——缺省读环境变量 GENOFFICE_MCP_TOKEN，都没设则不鉴权。注意：--token/--host 传空串会被直接拒绝（fail-closed），不会出现「以为上了锁实际全放行」）。HTTP 形态还带文件通道：PUT /files/<名> 上传文件、GET /files/<id>/<名> 下载产出、GET /health 健康检查；工具参数里的文件路径可换成 http(s) URL，产出以下载 URL 返回。

形态 B · 应用内「本地 MCP 服务」——设置 集成里打开

json

{ "mcpServers": { "chaoffice": { "url": "http://127.0.0.1:52588/mcp" } } }

（「本地 HTTP 服务」小节内的示例把条目命名为 chaoffice-editor——刻意与形态 A 的 stdio 条目 chaoffice 区分开，两条可共存于同一个配置文件；任选一个名字皆可。）

注：「本地 HTTP 服务」小节自身的介绍文案（面板原文全文）为「在 察元AIOffice 内运行，助手通过网址连接，可以看着它在 Word 编辑器里逐步生成。需要 察元AIOffice 保持打开；目前只支持 Word。」；同页「MCP」部分还有一条总提示：「skill 和 MCP 可以同时存在，助手会自己选用；两者做的事完全一样。」

1. 打开察元AI Office ＞ 设置 ＞ 集成，找到「MCP」部分的 B「本地 HTTP 服务」，其下是「本地 MCP 服务」块；
2. 打开「本地 MCP 服务」开关。开关旁的状态点变绿并显示「运行中」（未启动时显示「未运行」，出错显示具体错误）；
3. 「端口」输入框可改端口（1024–65535，失焦保存；非法值回退为上次确认值；改端口会自动重启服务）。默认端口 52588，服务只监听本机回环 127.0.0.1，界面文案也写明「仅限本机访问」；
4. 「连接信息」区给出三个可直接复制的网址：「Streamable HTTP（推荐）」http://127.0.0.1:52588/mcp、「SSE（旧客户端）」http://127.0.0.1:52588/sse、「健康检查」http://127.0.0.1:52588/health；
5. 「客户端配置示例」给出可直接粘贴的 JSON（带「复制」按钮）：
    1. 「后台生成」开关：允许客户端不打开界面、直接把文档生成到指定位置；关闭时生成过程在界面中可见（该开关改变暴露的工具集，修改后现有连接会重建）；
    2. 「日志」开关：记录 MCP 服务与工具调用到本地日志文件 mcp-log.txt；开启后下方出现日志面板，带「刷新」「打开」「清除」按钮，每 2 秒自动拉新；
    3. 「可用能力」区按当前构建列出能力家族行：文档 (Word)、演示 (PowerPoint)、表格 (Excel)、PDF。

应用内形态的工具面（与 CLI 形态不同）

1. 会话入口 create_session / save_session / get_app_info，Word 工具 read_document、insert_content、apply_ops、replace_blocks、read_docx、create_docx，Slides 工具 read_deck、apply_slide_ops、create_pptx，Sheets 工具 read_sheet、apply_sheet_ops、create_xlsx，PDF 只读工具 read_pdf，以及 open_in_chaoffice；
2. open_documents：直接操作用户当前打开的标签页——list 列出全部打开文档（id/类型/路径/标题/未保存状态），read 读含未保存修改的实时内容，save 存回其原文件，close 关闭（默认先保存，unsaved:"discard" 丢弃）。要编辑某个正打开的文档，把它的 id/路径作为 document 参数传给内容工具（insert_content/apply_ops/apply_sheet_ops/apply_slide_ops），界面会切到那个标签页让改动当场可见；PDF 标签页只能列出/关闭（阅读器无可编辑内容），读 PDF 用 read_pdf。

## 几个容易忽略的细节

功能归功能，这几个边界先摆清楚：

- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx
- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用

## 你可能会问

### claude mcp list 里 chaoffice 连不上？

stdio 形态先确认终端里 chaoffice --version 能跑通；跑不通按 O36 Q1 用 ~/.chaoffice/launcher 里的完整路径替换配置里的 command。应用内形态先看设置面板状态点：显示「未运行」就重新打开开关，显示红色错误按提示处理；再 curl http://127.0.0.1:52588/health 验证。

### 为什么我在 MCP 里找不到 chaoffice skill / install-cli 这类工具？

MCP 只暴露文档能力面（29 工具清单见第 3 步）；skill 安装、PATH 设置是本机管理动作，不在 MCP 工具面里，请在终端用 CLI。

### MCP 和 agent skill 同时装了会冲突吗？

不会。面板说明「skill 和 MCP 可以同时存在，助手会自己选用；两者做的事完全一样」。skill 安装见对应教程。

### HTTP 服务暴露给局域网/其他机器安全吗？

CLI HTTP 形态缺省只绑 127.0.0.1；传 --host 0.0.0.0 对其他机器开放时务必配 --token（或环境变量 GENOFFICE_MCP_TOKEN），否则启动日志会警告「reachable from other machines without --token」。空 token 会被拒绝启动。应用内「本地 MCP 服务」固定只监听本机回环，不接受改绑地址。

## 补充答疑

### stdio 和「本地 MCP 服务」两种形态怎么选？

助手能自己拉起命令就用 stdio（形态 A）：不需要应用开着、配置只有一条、工具最全（29 个，含 deck 流水线）。想让助手操作你正打开的窗口/标签页（open_documents）、或客户端只能填 URL，才用应用内 HTTP 形态（形态 B）。面板原文也建议：「助手能运行终端命令就用 CLI，不能就用 MCP」。

### 端口 52588 被占了怎么办？

在「本地 MCP 服务」块把「端口」改成 1024–65535 的其他值，失焦后保存并自动重启服务；然后把客户端配置里的 URL 同步改成新端口。chaoffice mcp --http 0 则自动挑一个空闲端口并在日志里打印实际地址。

这篇把MCP Server的链路拆完了。真机操作一遍比看十遍文章有用，现在就动手试第一步。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
