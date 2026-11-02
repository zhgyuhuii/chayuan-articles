---
title: "用Cursor MCP解决实际问题：场景化用法全记录"
description: "Cursor MCP场景实战：本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http:……从需求到交付的完整工作流。"
keywords: ["Cursor MCP", "察元AI文档助手", "Claude Code操作WPS", "Codex接WPS"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "Cursor MCP"
channel: "CSDN/知乎/博客"
---

# 用Cursor MCP解决实际问题：场景化用法全记录

Cursor MCP这件事，说简单也简单，说麻烦是真麻烦——麻烦不在功能本身，在于信息散落在各处，拼出一个完整流程要查好几篇资料。这篇文章把它一次讲全：是什么、入口在哪、具体步骤、边界在哪，全部基于察元AI文档助手的真实界面。

## 解决什么痛点

配置写好了但智能体连不上、看不到工具，需要排查；自动化文档流水线，想让 Claude Code / Codex / Cursor / Claude Desktop / OpenClaw 等外部智能体直接操作当前 WPS 文档，智能体批量改合同条款。

用户常搜的问法：怎么让 Claude Code 直接操作我的 WPS 文档；MCP 端口是多少？连接地址怎么填。

## 从打开到做完的每一步

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

## 关键能力点

- 三家主流客户端配置
- HTTP 直连免 Token
- Inspector 验证

## 这些坑和边界要知道

如实说明，它不是万能的：

- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道

## 接着回答几个常见问题

### 连上了，但调工具报 WPS_AGENT_OFFLINE？

sidecar 活着、WPS 加载项没连上：打开 WPS、确认加载项已启用，加载项会自动重试注册；也可在助手窗格健康灯处确认。

### 写操作怎么避免智能体乱改文档？

协议内置「预览＞确认」：document_replace/document_insert/document_apply_ops 不带 confirmed: true 时只返回预览不落盘；加批注、脱密等硬性要求 confirmed: true 才执行。可直接给智能体下规则：「先 dryRun/预览汇总给我，我确认后再写」。

### claude mcp add 或客户端连接报错？

按顺序查：先 curl http://127.0.0.1:62588/healthz 确认服务在跑（没跑看 W37）；再确认 URL 以 /mcp 结尾、传输类型是 http（Streamable HTTP），不是 stdio/npx；本机回环地址不要写成 localhost 以外的 IP。

## 补充答疑

### 智能体报 DOCUMENT_TOO_LARGE？

文档太长（约 8 万字符以上）不允许一次拉全文。让它改用 document_chunks 分块读，或用 document_meta 先看建议——这是设计行为，不是故障。

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

翻译从业者的典型用法：52 语种菜单选目标语言，逐段安全替换保持排版，术语口径统一助手兜专业词。排版不走样的整机翻译。注意：译文质量依赖所配模型档位，重要文件建议中高档模型。

## 顺带了解

助手导入导出分享：自定义助手可导出文件分享给同事导入，团队口径统一。

为什么值得看：好用的助手不该只有一个人受益。

## 还有这个能力

附件与文档感知：回形针上传附件自动抽取正文进入上下文；眼睛图标开关文档感知，AI 知道当前文档全貌。

## 硬口径两三条

- 本机 MCP 服务 http://127.0.0.1:62588/mcp，源码定义 69 个工具、外部实见 53 个，仅监听回环
- 自动发现本机察元AI OS 知识库（固定端口 52582），回答带编号引用与文件来源

## 如实说不足

- AI 痕迹检查给的是疑似线索，疑似不等于定论
- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

## 边界速览

- Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落

## MCP 写确认纪律

本机 62588 端口的文档智能体服务只监听回环；写操作不带确认标记会被拒绝并要求确认，每次确认写记入审计日志。外部智能体（Claude Code、Codex、Cursor 等）一行配置即可接入，代操作文档但不越权。

这篇把外部智能体接入 MCP的链路拆完了。真机操作一遍比看十遍文章有用，现在就动手试第一步。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
