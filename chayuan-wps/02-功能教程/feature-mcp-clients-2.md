---
title: "Codex接WPS深度解析：机制、设计与取舍"
description: "Codex接WPS深度解析：本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http:……机制、设计取舍与边界一次讲清。"
keywords: ["Codex接WPS", "察元AI文档助手", "Claude Code操作WPS", "Cursor MCP"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "Codex接WPS"
channel: "CSDN/知乎/博客"
---

# Codex接WPS深度解析：机制、设计与取舍

关于Codex接WPS，网上说法很多，有说简单的有说复杂的。实际用下来，察元AI文档助手的外部智能体接入 MCP路径是清晰的，只是有些细节不说不知道。这篇按真实操作走一遍，顺带把容易误解的点标出来。

## 是什么与为什么

本机 MCP 服务跑起来后，任何支持 Streamable HTTP MCP 的智能体客户端都可以用同一个 URL http://127.0.0.1:62588/mcp 接入，直接读写你本机的 WPS 文档——无需 Token、无需命令行参数、无需 stdio。本篇给出各家客户端的具体配置位置与接入后的验证方法。

让 Claude Code 直接操作你正开着的 WPS 文档，编程智能体与办公文档打通。

按真实界面写，按钮文案原样引用。

## 往深了说一层

让 Claude Code 直接操作你正开着的 WPS 文档，编程智能体与办公文档打通。

能力面拆开看：三家主流客户端配置，Inspector 验证，HTTP 直连免 Token。

从提问口径看，用户最关心的是怎么让 Claude Code 直接操作我的 WPS 文档？

## 完整操作步骤

按最短路径验证一遍：

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

## 别在这几处栽跟头

用之前要认的账：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 高频疑问

### claude mcp add 或客户端连接报错？

按顺序查：先 curl http://127.0.0.1:62588/healthz 确认服务在跑（没跑看 W37）；再确认 URL 以 /mcp 结尾、传输类型是 http（Streamable HTTP），不是 stdio/npx；本机回环地址不要写成 localhost 以外的 IP。

### 写操作怎么避免智能体乱改文档？

协议内置「预览＞确认」：document_replace/document_insert/document_apply_ops 不带 confirmed: true 时只返回预览不落盘；加批注、脱密等硬性要求 confirmed: true 才执行。可直接给智能体下规则：「先 dryRun/预览汇总给我，我确认后再写」。

### 智能体报 DOCUMENT_TOO_LARGE？

文档太长（约 8 万字符以上）不允许一次拉全文。让它改用 document_chunks 分块读，或用 document_meta 先看建议——这是设计行为，不是故障。

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

### 装完选项卡不出现？

按三步排查：确认 jsaddons 目录里有察元文件；完全退出 WPS（含后台进程）再重启；开发工具的加载项列表里确认察元已启用。

### macOS 装完还是旧版？

安装器无完全磁盘访问权限时容器写入会假成功，运行官方修复脚本 repair-mac-jsaddons-container.sh（支持 status、修复、rollback 三种模式）后重装。

## 一个真实场景

出版社编辑的典型用法：分块并发校对长书稿，术语一致性核对统一叫法，批注式结果逐条确认。编校效率与留痕规范兼得。注意：超长文档分轮处理，每轮按块长 6000 字并发。

## 顺带了解

对话中选模型：输入区模型下拉随会话切换模型：轻任务本地小模型、重任务云端旗舰，同一段对话里随时换。

为什么值得看：不同任务用不同档位的模型是最直接的成本优化。

## 还有这个能力

样式治理与空行清理：样式治理三件套与空行清理：全文档格式统一与垃圾空行一键清。

## 硬口径两三条

- 文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单
- 本机 MCP 服务 http://127.0.0.1:62588/mcp，源码定义 69 个工具、外部实见 53 个，仅监听回环

## 如实说不足

- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

## 边界速览

- macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本
- Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 数字口径

- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡
- 自动发现本机察元AI OS 知识库（固定端口 52582），回答带编号引用与文件来源
- 保密检查覆盖八大类风险：密级标识、涉军涉装涉训、组织身份、人员联络、时间地点部署、内部编号、经营商业敏感、军工政企高频线索
- 全文校对分块并发，块长默认 6000 字；超过 12000 字分档提示

## 额度与付费边界

免费每日额度（对话与助手独立额度池，次日重置）；文档脱密、脱密复原、保密检查、涉密关键词提取四项为付费专属、零免费额度；序列号本地验签激活、绑定设备指纹，离线可用。

Codex接WPS的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
