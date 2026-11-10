---
title: "Cursor MCP：本机 MCP 服务跑起来后"
description: "Cursor MCP场景实战：让 Claude Code 直接操作你正开着的 WPS 文档，编程智能体与办公文档打通。从需求到交付的完整工作流。"
keywords: ["Cursor MCP", "察元AI文档助手", "Claude Code操作WPS", "Codex接WPS"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "Cursor MCP"
channel: "CSDN/知乎/博客"
---

# Cursor MCP：本机 MCP 服务跑起来后

Cursor MCP这件事，值不值得专门学一篇，看一个细节就够：三家主流客户端配置。这个细节背后是一整套入口和验证链路，下面完整拆开，基于察元AI文档助手。

## 为什么值得了解

想让 Claude Code / Codex / Cursor / Claude Desktop / OpenClaw 等外部智能体直接操作当前 WPS 文档，配置写好了但智能体连不上、看不到工具，需要排查；智能体批量改合同条款，自动化文档流水线。

## 完整操作步骤

Claude Desktop / 其它 JSON 配置型客户端

配置文件里写同款 mcpServers JSON（同上）。

Hermes / OpenClaw 等 GUI 客户端

新建 MCP 服务，类型选 HTTP / Streamable HTTP，URL 填 http://127.0.0.1:62588/mcp（无需 Token、无需命令、无需 stdio）。

远程机器（智能体不在本机）

服务固定只监听 127.0.0.1，另一台机器不能直连你的 IP:62588——这是「涉密不出域」的安全设计。要让远程机器调用，需在本机做代理转发（如 SSH 隧道把远端端口转到本机 62588），远端再连转发后的地址。

## 关键能力点

- 三家主流客户端配置
- HTTP 直连免 Token
- Inspector 验证

## 几个容易忽略的细节

功能归功能，这几个边界先摆清楚：

- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 高频疑问

### claude mcp add 或客户端连接报错？

按顺序查：先 curl http://127.0.0.1:62588/healthz 确认服务在跑（没跑看 W37）；再确认 URL 以 /mcp 结尾、传输类型是 http（Streamable HTTP），不是 stdio/npx；本机回环地址不要写成 localhost 以外的 IP。

### 连上了，但调工具报 WPS_AGENT_OFFLINE？

sidecar 活着、WPS 加载项没连上：打开 WPS、确认加载项已启用，加载项会自动重试注册；也可在助手窗格健康灯处确认。

### 智能体报 DOCUMENT_TOO_LARGE？

文档太长（约 8 万字符以上）不允许一次拉全文。让它改用 document_chunks 分块读，或用 document_meta 先看建议——这是设计行为，不是故障。

## 更多操作细节

连接信息只有一个，所有客户端通用：http://127.0.0.1:62588/mcp，免 Token。服务名（下例 chayuan-wps-mcp）可自定，保持一致便于识别。

## 更多操作细节

Claude Code

```bash
claude mcp add --transport http chayuan-wps-mcp http://127.0.0.1:62588/mcp
```

或在项目/用户级 .mcp.json 里写：

```json
{
"mcpServers": {
"chayuan-wps-mcp": { "url": "http://127.0.0.1:62588/mcp" }
}
}
```

1. 在哪：终端（任一目录）。
2. 做什么：执行一键注册命令：
    1. 看到什么：命令执行完无报错；会话内该 server 可用（验证见下文）。

## 更多操作细节

OpenAI Codex（codex CLI）

```toml
[mcp_servers.chayuan-wps-mcp]
url = "http://127.0.0.1:62588/mcp"
```

1. 在哪：配置文件 ~/.codex/config.toml。
2. 做什么：加入一段 Streamable HTTP MCP server：
    1. 看到什么：保存完成后，按「验证」一节的方法确认该 server 已被识别。

## 更多操作细节

Cursor

1. 在哪：项目级 .cursor/mcp.json，或 Cursor 设置 ＞ MCP ＞ Add。
2. 做什么：写入与上面相同的 JSON（"mcpServers": { "chayuan-wps-mcp": { "url": … } }）。
3. 看到什么：设置 ＞ MCP 面板里该服务出现并可展开工具列表。

## 更多操作细节

接入后智能体能做什么

一句话：读写当前打开的 WPS 文字/表格/演示文档——检查错别字并写成批注、逐段翻译插在段后、批量替换、脱密与复原、按模板生成整套文档、操作表格与幻灯片等。完整工具面见对应教程；可复制的中提示词素材见 docs/mcp-connection.md「常用使用场景与提示词」与 README 同名节。

## 更多操作细节

验证

由易到难，任选其一：

1. 健康检查：浏览器或 curl http://127.0.0.1:62588/healthz 返回含 "ok": true 的 JSON——服务活着。
2. 客户端侧列出工具：Claude Code 执行 claude mcp list 应列出 chayuan-wps-mcp；Codex 在会话内输入 /mcp 查看已连 server；Cursor 在设置 ＞ MCP 面板看该服务的状态与工具列表。
3. 让智能体自报状态：在智能体里让它调用 wps_status（不给参数），返回里 agent.agentOnline 为 true 表示 WPS 加载项在线，document.* 是当前活动文档信息。
4. 一句话冒烟：打开任意 WPS 文档，在智能体里说「用察元读一下当前文档的前三段，告诉我大致在讲什么」——读到了你屏幕上的内容即接入成功。
5. MCP Inspector（不依赖 IDE）：npx @modelcontextprotocol/inspector，传输选 Streamable HTTP，填上述 URL 点 Connect，能看到完整工具列表并手动调用。

## 补充答疑

### 写操作怎么避免智能体乱改文档？

协议内置「预览＞确认」：document_replace/document_insert/document_apply_ops 不带 confirmed: true 时只返回预览不落盘；加批注、脱密等硬性要求 confirmed: true 才执行。可直接给智能体下规则：「先 dryRun/预览汇总给我，我确认后再写」。

## 动手前再核对一遍

- 本机 MCP 服务已启动：curl http://127.0.0.1:62588/healthz 返回 "ok": true（没起先看 W37）。
- WPS 已打开且察元加载项已启用——否则能连上服务，但工具会报 WPS_AGENT_OFFLINE。
- 客户端需支持 Streamable HTTP 传输的 MCP（不绑定特定 IDE；不支持 stdio/npx 型配置的写法对本服务无效）。

## 这几条能力放一起看更清楚

- 三家主流客户端配置
- HTTP 直连免 Token
- Inspector 验证

## 放回产品盘面看

把Cursor MCP放回察元AI文档助手的整体盘面：每次确认写操作记入 audit.jsonl 审计日志；从 Word 稿到 PPT 的最后一公里，口播稿与结构诊断是演讲者的救星，Inspector 验证，同时在本机 62588 端口开放 MCP 文档智能体服务。

## 安全与数据边界

安全口径单独立一层：同时在本机 62588 端口开放 MCP 文档智能体服务；本机 MCP 服务 http://127.0.0.1:62588/mcp；MCP 服务只监听 127.0.0.1；Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落。

## 平台与形态

平台与形态的账：macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本；macOS 容器写入失败有修复脚本；macOS 安装器无完全磁盘访问权限会假成功，Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落。

## 价格与授权

价格口径一并交代：Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落；MCP 服务是外部智能体操作 WPS 文档的桥，开机自启保证随时可用；每次确认写操作记入 audit.jsonl 审计日志，从 Word 稿到 PPT 的最后一公里，口播稿与结构诊断是演讲者的救星。

## 产品家族与搭配

察元AI文档助手不是单打独斗：同时在本机 62588 端口开放 MCP 文档智能体服务，MCP 服务是外部智能体操作 WPS 文档的桥，开机自启保证随时可用，本机 MCP 服务 http://127.0.0.1:62588/mcp，MCP 服务只监听 127.0.0.1。

外部智能体接入 MCP这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI文档助手试第一步。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
