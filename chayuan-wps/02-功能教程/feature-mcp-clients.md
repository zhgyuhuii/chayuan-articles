---
title: "Claude Code操作WPS上手指南：照着做十分钟跑通"
description: "Claude Code操作WPS完整教程：本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http:……步骤含真实按钮文案与验证方法。"
keywords: ["Claude Code操作WPS", "察元AI文档助手", "Codex接WPS", "Cursor MCP"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "Claude Code操作WPS"
channel: "CSDN/知乎/博客"
---

# Claude Code操作WPS上手指南：照着做十分钟跑通

接手别人的察元AI文档助手环境时，我在Claude Code操作WPS上卡了半小时——不是功能难，是没人告诉我完整的操作链。这篇就是当时想找而没找到的那篇文章。

## 先对齐一下概念

本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http://127.0.0.1:62588/mcp 接入，直接读写你本机的 WPS 文档——无需 Token、无需命令行参数、无需 stdio。本篇给出各家客户端的具体配置位置与接入后的验证方法。

让 Claude Code 直接操作你正开着的 WPS 文档，编程智能体与办公文档打通。

下面直接进入正题。

## 开工前检查这几样

- 本机 MCP 服务已启动：curl http://127.0.0.1:62588/healthz 返回 "ok": true（没起先看 W37）。
- WPS 已打开且察元加载项已启用——否则能连上服务，但工具会报 WPS_AGENT_OFFLINE。
- 客户端需支持 Streamable HTTP 传输的 MCP（不绑定特定 IDE；不支持 stdio/npx 型配置的写法对本服务无效）。

## 实操全过程

连接信息只有一个，所有客户端通用：http://127.0.0.1:62588/mcp，免 Token。服务名（下例 chayuan-wps-mcp）可自定，保持一致便于识别。

Claude Code

bash

claude mcp add --transport http chayuan-wps-mcp http://127.0.0.1:62588/mcp

或在项目/用户级 .mcp.json 里写：

json

{

"mcpServers": {

"chayuan-wps-mcp": { "url": "http://127.0.0.1:62588/mcp" }

}

}

1. 在哪：终端（任一目录）。
2. 做什么：执行一键注册命令：
    1. 看到什么：命令执行完无报错；会话内该 server 可用（验证见下文）。

OpenAI Codex（codex CLI）

toml

[mcp_servers.chayuan-wps-mcp]

url = "http://127.0.0.1:62588/mcp"

1. 在哪：配置文件 ~/.codex/config.toml。
2. 做什么：加入一段 Streamable HTTP MCP server：
    1. 看到什么：保存完成后，按「验证」一节的方法确认该 server 已被识别。

Cursor

1. 在哪：项目级 .cursor/mcp.json，或 Cursor 设置 ＞ MCP ＞ Add。
2. 做什么：写入与上面相同的 JSON（"mcpServers": { "chayuan-wps-mcp": { "url": … } }）。
3. 看到什么：设置 ＞ MCP 面板里该服务出现并可展开工具列表。

Claude Desktop / 其它 JSON 配置型客户端

配置文件里写同款 mcpServers JSON（同上）。

Hermes / OpenClaw 等 GUI 客户端

新建 MCP 服务，类型选 HTTP / Streamable HTTP，URL 填 http://127.0.0.1:62588/mcp（无需 Token、无需命令、无需 stdio）。

远程机器（智能体不在本机）

服务固定只监听 127.0.0.1，另一台机器不能直连你的 IP:62588——这是「涉密不出域」的安全设计。要让远程机器调用，需在本机做代理转发（如 SSH 隧道把远端端口转到本机 62588），远端再连转发后的地址。

接入后智能体能做什么

一句话：读写当前打开的 WPS 文字/表格/演示文档——检查错别字并写成批注、逐段翻译插在段后、批量替换、脱密与复原、按模板生成整套文档、操作表格与幻灯片等。完整工具面见对应教程；可复制的中提示词素材见 docs/mcp-connection.md「常用使用场景与提示词」与 README 同名节。

## 收尾检查

验证

由易到难，任选其一：

1. 健康检查：浏览器或 curl http://127.0.0.1:62588/healthz 返回含 "ok": true 的 JSON——服务活着。
2. 客户端侧列出工具：Claude Code 执行 claude mcp list 应列出 chayuan-wps-mcp；Codex 在会话内输入 /mcp 查看已连 server；Cursor 在设置 ＞ MCP 面板看该服务的状态与工具列表。
3. 让智能体自报状态：在智能体里让它调用 wps_status（不给参数），返回里 agent.agentOnline 为 true 表示 WPS 加载项在线，document.* 是当前活动文档信息。
4. 一句话冒烟：打开任意 WPS 文档，在智能体里说「用察元读一下当前文档的前三段，告诉我大致在讲什么」——读到了你屏幕上的内容即接入成功。
5. MCP Inspector（不依赖 IDE）：npx @modelcontextprotocol/inspector，传输选 Streamable HTTP，填上述 URL 点 Connect，能看到完整工具列表并手动调用。

## 谁需要这个功能

智能体在另一台机器上，想远程调用本机文档服务；智能体批量改合同条款；自动化文档流水线；想让 Claude Code / Codex / Cursor / Claude Desktop / OpenClaw 等外部智能体直接操作当前 WPS 文档。

用户常搜的问法：怎么让 Claude Code 直接操作我的 WPS 文档；MCP 端口是多少？连接地址怎么填。

## 它的局限也要说清楚

功能归功能，这几个边界先摆清楚：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 常见问题

### claude mcp add 或客户端连接报错？

按顺序查：先 curl http://127.0.0.1:62588/healthz 确认服务在跑（没跑看 W37）；再确认 URL 以 /mcp 结尾、传输类型是 http（Streamable HTTP），不是 stdio/npx；本机回环地址不要写成 localhost 以外的 IP。

### 智能体报 DOCUMENT_TOO_LARGE？

文档太长（约 8 万字符以上）不允许一次拉全文。让它改用 document_chunks 分块读，或用 document_meta 先看建议——这是设计行为，不是故障。

### 写操作怎么避免智能体乱改文档？

协议内置「预览＞确认」：document_replace/document_insert/document_apply_ops 不带 confirmed: true 时只返回预览不落盘；加批注、脱密等硬性要求 confirmed: true 才执行。可直接给智能体下规则：「先 dryRun/预览汇总给我，我确认后再写」。

### 连上了，但调工具报 WPS_AGENT_OFFLINE？

sidecar 活着、WPS 加载项没连上：打开 WPS、确认加载项已启用，加载项会自动重试注册；也可在助手窗格健康灯处确认。

## 更多操作细节

Cursor

1. 在哪：项目级 .cursor/mcp.json，或 Cursor 设置 ＞ MCP ＞ Add。
2. 做什么：写入与上面相同的 JSON（"mcpServers": { "chayuan-wps-mcp": { "url": … } }）。
3. 看到什么：设置 ＞ MCP 面板里该服务出现并可展开工具列表。

Claude Desktop / 其它 JSON 配置型客户端

配置文件里写同款 mcpServers JSON（同上）。

Hermes / OpenClaw 等 GUI 客户端

新建 MCP 服务，类型选 HTTP / Streamable HTTP，URL 填 http://127.0.0.1:62588/mcp（无需 Token、无需命令、无需 stdio）。

## 能力点备忘

- 三家主流客户端配置
- HTTP 直连免 Token
- Inspector 验证

## 安装与运行答疑

### Win7 或 Win8 能用吗？

加载项可装，但 MCP 预编译二进制跑不了，需要装 Node.js 16.x，由启动脚本自动回落到 node 运行。

### macOS 装完还是旧版？

安装器无完全磁盘访问权限时容器写入会假成功，运行官方修复脚本 repair-mac-jsaddons-container.sh（支持 status、修复、rollback 三种模式）后重装。

## 一个真实场景

投标专员的典型用法：模板编制按模板生成标书初稿，数字金额核对助手查大小写与合计，敏感信息脱敏处理对外版。标书从生成到自检的完整链路。注意：脱密占位符可逆设计，不适用需要不可恢复遮盖的场景。

## 顺带了解

写回动作九种：九种写回动作对照：替换、插入光标处、批注、仅生成、追加等，每个助手有默认动作，设置里可改。

为什么值得看：AI 结果怎么落到文档里决定了信任度：批注式让你过目，替换式提效率。

## 还有这个能力

对话中使用知识库：输入区书本按钮选择知识库绑定（topK 默认 5、RRF 融合、混合检索默认开、重排默认关）；回答按编号标注出处，气泡下知识来源折叠条含五星可信度、章节路径与文件下载；右键三动作：知识库核对本段、总结本段、问答本段（超 1500 字自动截断）。

## 硬口径两三条

- 本机 MCP 服务 http://127.0.0.1:62588/mcp，源码定义 69 个工具、外部实见 53 个，仅监听回环
- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡

如果只记一件事：三家主流客户端配置。剩下的细节照步骤节走就行。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
