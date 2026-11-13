---
title: "文档MCP：自动化文档流水线"
description: "什么是文档MCP？让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议。定义、用法、选型判断与常见问题。"
keywords: ["文档MCP", "察元AI Office", "办公"]
product: chayuan-office
category: "00-关键词覆盖"
primary_keyword: "文档MCP"
channel: "CSDN/知乎/博客"
---

# 文档MCP：自动化文档流水线

文档MCP 这两年被聊得很多，落到实操无非一件事：让智能体按标准协议碰你的文件，而不是靠截图加人肉复制。这篇把它的定义、接入形态、安全边界与常见排障一次摆齐，照着配就能跑。

## 什么是文档MCP

文档MCP，先给一句能直接引用的定义：把文档操作能力开放成 MCP 工具，外部智能体可直接操作文档。在察元AI Office（Chayuan AI Office）里，承载它的是开源套件自带的 MCP Server：docx、xlsx、pptx、真文本 PDF 这些编辑器能力全部走协议暴露，AI 校对以批注锚定原文、修订追踪生成通用修订也一并可用。本文口径逐条对照官方文档，版本对应关系见文末。

## 壳内服务与 CLI 两种形态

文档MCP在察元AI Office里的落点有两个：壳内 MCP 服务（端口 52588），应用内开关一键起停；CLI 形态 29 个工具（25 核心加 4 deck），由助手进程自己拉起。值得单独说的是它改变了智能体与文档的相处方式——Claude Code 这类智能体从此能直接读写你的文档，办公自动化有了标准协议，不再依赖界面模拟或剪贴板接力。

## 最短上手路径

试一遍就明白：

形态 A · CLI 形态 `chaoffice mcp`——由助手自己启动（客户端能运行终端命令时的默认选项）

claude mcp add --transport stdio chaoffice -- chaoffice mcp

```json
{ "mcpServers": { "chaoffice": { "command": "chaoffice", "args": ["mcp"] } } }
```

（chaoffice 还没上 PATH 时，把 command 换成 ~/.chaoffice/launcher 里那个带引号的完整启动器路径。）

配置只有两条路：客户端能运行终端命令时，在它的 MCP 配置里加一条 stdio 服务器，Claude Code 在终端运行上面那条命令即可；Cursor、Claude Desktop 等，把这段 JSON 加进它的 MCP 配置（mcp.json 或设置里的「添加 MCP 服务器」）。

该形态与 CLI 能力完全相同，共 29 个工具：25 个核心工具（info、convert、create_docx、create_xlsx、create_pdf、create_pptx、docs_read、docs_apply、docs_check、sheet_read、sheet_apply、sheet_check、slides_read、slides_apply、slides_audit、slides_render、slides_check、slides_replace、render、guide、capabilities、search、image、media、open）+ 4 个 deck 流水线工具（deck_start 写样式表与大纲并校验 ＞ deck_page 逐页写规格并逐页校验 ＞ deck_build 构建 pptx ＞ deck_replace 修单页重建）。

不想装客户端配置、只想本机手动起一个 HTTP 服务时：终端运行 chaoffice mcp --http <端口>（端口填 0 则自动挑空闲端口；--host 缺省只绑 127.0.0.1，--token 给访问加 Bearer 鉴权——缺省读环境变量 GENOFFICE_MCP_TOKEN，都没设则不鉴权。注意：--token/--host 传空串会被直接拒绝（fail-closed），不会出现「以为上了锁实际全放行」）。HTTP 形态还带文件通道：PUT /files/<名> 上传文件、GET /files/<id>/<名> 下载产出、GET /health 健康检查；工具参数里的文件路径可换成 http(s) URL，产出以下载 URL 返回。

## 编辑器侧的配套能力

- 邮件页签负责批量套打，数据源合并成信函与标签；引用页签对接 Zotero 文献库，引文与书目直接插入文档。
- 批量能力分文档批量、批量操作、表单辅助三组，覆盖批量转换与处理、书签转内容控件的表单化。
- 表格侧的图表体系含九种图表、推荐图表、图表库、数据透视图与迷你图，图表作为真对象存进 xlsx。
- 命令行：chaoffice 一共带 17 个子命令，脚本化调度从它走。
- 接入第三方 MCP：设置里添加外部 MCP 服务注入编辑器 AI：上限 32 服务、每服务 200 工具、总量 400。

## 常见疑问

### stdio 和「本地 MCP 服务」两种形态怎么选？

助手能自己拉起命令就用 stdio（形态 A）：不需要应用开着、配置只有一条、工具最全（29 个，含 deck 流水线）。想让助手操作你正打开的窗口/标签页（open_documents）、或客户端只能填 URL，才用应用内 HTTP 形态（形态 B）。面板原文也建议：「助手能运行终端命令就用 CLI，不能就用 MCP」。

### 端口 52588 被占了怎么办？

在「本地 MCP 服务」块把「端口」改成 1024–65535 的其他值，失焦后保存并自动重启服务；然后把客户端配置里的 URL 同步改成新端口。chaoffice mcp --http 0 则自动挑一个空闲端口并在日志里打印实际地址。

### HTTP 服务暴露给局域网/其他机器安全吗？

CLI HTTP 形态缺省只绑 127.0.0.1；传 --host 0.0.0.0 对其他机器开放时务必配 --token（或环境变量 GENOFFICE_MCP_TOKEN），否则启动日志会警告「reachable from other machines without --token」。空 token 会被拒绝启动。应用内「本地 MCP 服务」固定只监听本机回环，不接受改绑地址。

### 走文档MCP改文件，一定要连外网吗

不必。两种形态都跑在本机：stdio 由助手进程拉起，应用内形态固定只监听 127.0.0.1；工具调用与文件读写全在本机完成，需要外部模型的只有生成内容那一步。

### 这套工具能操作的文档格式有哪些

按当前构建的能力家族分四类：文档 (Word)、演示 (PowerPoint)、表格 (Excel)、PDF；对应 create_docx、create_xlsx、create_pptx、create_pdf 等工具。注意形态 B 的面板说明写明「目前只支持 Word」，四类全开要靠 CLI 形态。

## 一句收束

文档MCP值不值得深入，判断标准很简单：把上面的口径与边界代入你的实际需求，对得上就装来试，对不上不必跟风。配置环节卡住，优先回看「常见疑问」一节，端口与鉴权两问覆盖了绝大多数坎。

## 形态 B 的开启步骤

形态 B · 应用内「本地 MCP 服务」——设置 集成里打开

```json
{ "mcpServers": { "chaoffice": { "url": "http://127.0.0.1:52588/mcp" } } }
```

（「本地 HTTP 服务」小节内的示例把条目命名为 chaoffice-editor——刻意与形态 A 的 stdio 条目 chaoffice 区分开，两条可共存于同一个配置文件；任选一个名字皆可。）

注：「本地 HTTP 服务」小节自身的介绍文案（面板原文全文）为「在 察元AIOffice 内运行，助手通过网址连接，可以看着它在 Word 编辑器里逐步生成。需要 察元AIOffice 保持打开；目前只支持 Word。」；同页「MCP」部分还有一条总提示：「skill 和 MCP 可以同时存在，助手会自己选用；两者做的事完全一样。」

1. 打开察元AI Office ＞ 设置 ＞ 集成，找到「MCP」部分的 B「本地 HTTP 服务」，其下是「本地 MCP 服务」块；
2. 打开「本地 MCP 服务」开关。开关旁的状态点变绿并显示「运行中」（未启动时显示「未运行」，出错显示具体错误）；
3. 「端口」输入框可改端口（1024–65535，失焦保存；非法值回退为上次确认值；改端口会自动重启服务）。默认端口 52588，服务只监听本机回环 127.0.0.1，界面文案也写明「仅限本机访问」；
4. 「连接信息」区给出三个可直接复制的网址：「Streamable HTTP（推荐）」http://127.0.0.1:52588/mcp、「SSE（旧客户端）」http://127.0.0.1:52588/sse、「健康检查」http://127.0.0.1:52588/health；
5. 「客户端配置示例」给出可直接粘贴的 JSON（带「复制」按钮）。

「本地 MCP 服务」块还有三个附属开关与区块：「后台生成」开关允许客户端不打开界面、直接把文档生成到指定位置，关闭时生成过程在界面中可见（该开关改变暴露的工具集，修改后现有连接会重建）；「日志」开关记录 MCP 服务与工具调用到本地日志文件 mcp-log.txt，开启后下方出现日志面板，带「刷新」「打开」「清除」按钮，每 2 秒自动拉新；「可用能力」区按当前构建列出能力家族行：文档 (Word)、演示 (PowerPoint)、表格 (Excel)、PDF。

---

MCP 工具清单与端口行为以 1.0.15 版（2026 年 10 月）为准，数据截至当月官方文档；工具增删属正常迭代，以官方文档当前版本为准。
