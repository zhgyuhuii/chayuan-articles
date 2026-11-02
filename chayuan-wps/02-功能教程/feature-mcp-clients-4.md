---
title: "智能体操作文档出问题怎么办：排查手册加进阶技巧"
description: "智能体操作文档排错指南：本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http:……故障定位路径与进阶用法。"
keywords: ["智能体操作文档", "察元AI文档助手", "Claude Code操作WPS", "Codex接WPS"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "智能体操作文档"
channel: "CSDN/知乎/博客"
---

# 智能体操作文档出问题怎么办：排查手册加进阶技巧

接手别人的察元AI文档助手环境时，我在智能体操作文档上卡了半小时——不是功能难，是没人告诉我完整的操作链。这篇就是当时想找而没找到的那篇文章。

## 先定位问题在哪一层

按这个顺序排查通常最快：先确认前置条件（本机 MCP 服务已启动：curl http://127.0.0.1:62588/healthz 返回 "ok": true（没起先看 W37）。），再核对操作路径，最后看边界限制。三层各有一些典型症状，对号入座能省很多时间。

## 高频故障与对策

### claude mcp add 或客户端连接报错？

按顺序查：先 curl http://127.0.0.1:62588/healthz 确认服务在跑（没跑看 W37）；再确认 URL 以 /mcp 结尾、传输类型是 http（Streamable HTTP），不是 stdio/npx；本机回环地址不要写成 localhost 以外的 IP。

## 正确的操作路径

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

## 如何确认操作生效

验证

由易到难，任选其一：

1. 健康检查：浏览器或 curl http://127.0.0.1:62588/healthz 返回含 "ok": true 的 JSON——服务活着。
2. 客户端侧列出工具：Claude Code 执行 claude mcp list 应列出 chayuan-wps-mcp；Codex 在会话内输入 /mcp 查看已连 server；Cursor 在设置 ＞ MCP 面板看该服务的状态与工具列表。
3. 让智能体自报状态：在智能体里让它调用 wps_status（不给参数），返回里 agent.agentOnline 为 true 表示 WPS 加载项在线，document.* 是当前活动文档信息。
4. 一句话冒烟：打开任意 WPS 文档，在智能体里说「用察元读一下当前文档的前三段，告诉我大致在讲什么」——读到了你屏幕上的内容即接入成功。
5. MCP Inspector（不依赖 IDE）：npx @modelcontextprotocol/inspector，传输选 Streamable HTTP，填上述 URL 点 Connect，能看到完整工具列表并手动调用。

## 进阶用法与边界

- 三家主流客户端配置
- HTTP 直连免 Token
- Inspector 验证

## 你可能会问

### 连上了，但调工具报 WPS_AGENT_OFFLINE？

sidecar 活着、WPS 加载项没连上：打开 WPS、确认加载项已启用，加载项会自动重试注册；也可在助手窗格健康灯处确认。

### 写操作怎么避免智能体乱改文档？

协议内置「预览＞确认」：document_replace/document_insert/document_apply_ops 不带 confirmed: true 时只返回预览不落盘；加批注、脱密等硬性要求 confirmed: true 才执行。可直接给智能体下规则：「先 dryRun/预览汇总给我，我确认后再写」。

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

### macOS 装完还是旧版？

安装器无完全磁盘访问权限时容器写入会假成功，运行官方修复脚本 repair-mac-jsaddons-container.sh（支持 status、修复、rollback 三种模式）后重装。

### Win7 或 Win8 能用吗？

加载项可装，但 MCP 预编译二进制跑不了，需要装 Node.js 16.x，由启动脚本自动回落到 node 运行。

## 一个真实场景

行政与人事的典型用法：表单模式把文档书签表单化，规则设置 8 类字段与 10 种审查方式，下发模板收集回传。从模板到回收到审计的填报闭环。注意：复杂跨项校验需要配置规则，首次配置有学习成本。

## 顺带了解

任务进度窗与确认写回：任务进度窗统一展示后台任务，确认写回按钮集中把关，支持一键撤销（有快照时）。

为什么值得看：批量任务跑完先看再落盘，写错了能撤回，胆子才能大起来。

## 还有这个能力

MCP 工具面总览：源码定义 69 个工具（外部实见 53 个）：主机健康 2、文档 13、格式 5、17 个域聚合工具（批注、修订、目录、书签、表格 12 动作、水印、导出等加表格 23 动作、演示……

## 硬口径两三条

- 本机 MCP 服务 http://127.0.0.1:62588/mcp，源码定义 69 个工具、外部实见 53 个，仅监听回环
- 自动发现本机察元AI OS 知识库（固定端口 52582），回答带编号引用与文件来源

## 如实说不足

- AI 痕迹检查给的是疑似线索，疑似不等于定论
- macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本
- Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

## 边界速览

- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型

## 数字口径

- 文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单
- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡
- 保密检查覆盖八大类风险：密级标识、涉军涉装涉训、组织身份、人员联络、时间地点部署、内部编号、经营商业敏感、军工政企高频线索
- 全文校对分块并发，块长默认 6000 字；超过 12000 字分档提示

整体用下来，外部智能体接入 MCP的流程是清楚的：入口集中、步骤有反馈、做完有验证。第一次照着走一遍，后面基本就是肌肉记忆了。卡住就回看常见问题那一节。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
