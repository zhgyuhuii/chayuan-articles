---
title: "拆开看Codex配置：原理、架构与实现细节"
description: "Codex配置深度解析：给智能体接模型有两条路：自动——在设置里一键把模型代理地址 + 模型名写进五家（Harness / Claude Code / Codex ……机制、设计取舍与边界一次讲清。"
keywords: ["Codex配置", "察元AI OS", "智能体配置", "Claude配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "Codex配置"
channel: "CSDN/知乎/博客"
---

# 拆开看Codex配置：原理、架构与实现细节

先说结论：Codex配置在察元AI OS里是完整可用的，从配置智能体的入口进去，按下面步骤操作即可。这篇文章覆盖概念、步骤、验证和常见问题四部分，读完能独立完成整个流程。

## 是什么与为什么

给智能体接模型有两条路：自动——在设置里一键把模型代理地址 + 模型名写进五家；手动——直接编辑各家自己的配置文件直连模型代理（http://127.0.0.1:52581），写入后智能体内的 /model 面板能看到并切换这些模型。

自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。

下面直接进入正题。

## 往深了说一层

自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。

能力面拆开看：写入即生效可切换，各家配置文件面文档化；五家自动写入带备份。

从提问口径看，用户最关心的是智能体怎么配置模型？Codex 的 config.toml 要写什么？

## 具体怎么操作

按最短路径验证一遍：

路线 A：自动一键写入（推荐）

三个入口（向导第 3 步 / 设置 ＞ 默认模型 / 模型代理面板「统一应用…」）、应用对话框逐项 UI、写入内容、备份与回退，全部见对应教程 把模型应用到智能体——自动与手动写的是同一套键，本篇不重复展开。以下只讲手动面。

路线 B：手动改各家配置文件

先记住三条公共约定：

偷懒办法：设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单里本地模型行点「帮助」，弹出的接入指南含各家可复制的配置片段——片段与自动「应用」写入的内容由同一生成函数产出，抄它不会错。

1. 地址：OpenAI 兼容对话面基址 http://127.0.0.1:52581。Codex / OpenCode / OpenClaw 的地址要带 /v1 后缀；Claude Code 的 ANTHROPIC_BASE_URL 不带 /v1（它自己拼 /v1/messages，代理同端口提供换算面）。
2. 免 key：代理对本机调用不验证密钥（任意 Bearer 或不带都放行，审计记 anonymous）。真实厂商密钥永远不需要写进这些文件。
3. 哨兵凭证：Claude Code 和 OpenClaw 要求「有凭证」的形态才肯启动/请求——免 key 接代理时写哨兵值 chatop-local（代理认它，不是真密钥）。

Codex（~/.codex/config.toml）

写入形态（自动应用写的就是这个样子，可直接抄）：

toml

model = "local/qwen3.5-4b-q4km"

model_provider = "chatop-proxy"

[model_providers.chatop-proxy]

name = "chatop-proxy"

base_url = "http://127.0.0.1:52581/v1"

wire_api = "responses"

supports_websockets = false

stream_idle_timeout_ms = 600000

要点与坑（均为真机实锤）：

验证：终端执行 codex debug models——目录可载且只剩注入模型即通过；端到端试一发 codex exec --skip-git-repo-check "只回复两个字：成功"。

1. 根表键 model / model_provider / model_catalog_json 必须写在文件最顶部（第一个 [表] 头之前、所有 # BEGIN chatop … 托管块之外）。写进某张表内或托管块里会被解析进别人的表/被块重写吞掉，codex 恒回 openai 默认。
2. Codex ≥0.154 只认 [model_providers.<id>] 表；顶层 base_url / api_key 被静默忽略。wire_api 只能写 "responses"（"chat" 已被移除，载入即报错）。
3. 免 key 可省 experimental_bearer_token；代理不校验。
4. /model 可见性：codex 的模型选择器不读 [model_providers]，只认 model_catalog_json 指向的 JSON 目录，且该目录整体替换内置 ChatGPT 列表。目录条目有一整套必填字段（缺任一即拒载目录），手写极易翻车——推荐让自动应用生成（落在 ~/.codex/model-catalogs/chatop.json，config.toml 根表多出 model_catalog_json = "<该文件路径>"），手动场景直接复用这个已生成的文件。
5. 目录是启动时加载：改完配置必须重开 codex 会话，/model 才刷新。
6. 接厂商模型不要直连厂商地址：codex 的工具形态（namespace/custom）第三方 Responses 面一律 400，厂商模型必须经代理（模型名用 <厂商id>/<模型名> 命名空间；自动应用的厂商直连也会被强制改道代理）。

## 注意事项与真实边界

边界都在这：

- 全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重
- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限

## 接着回答几个常见问题

### Claude Code 一启动就报 403 / 让我登录？

ANTHROPIC_BASE_URL 设了但 ANTHROPIC_AUTH_TOKEN 没落哨兵 chatop-local——启动登录检查会绕过你的 BASE_URL 直连官方 403。补上哨兵值即可。

### Codex 手动写完 provider，/model 里还是内置 ChatGPT 模型列表？

/model 面板只认 model_catalog_json 目录（整体替换内置列表），不读 [model_providers]。用 M9 自动应用一次让它生成 ~/.codex/model-catalogs/chatop.json，再重开 codex 会话（目录启动时加载）。

### OpenCode 报 ProviderModelNotFoundError 或 Model not found？

两个必查点：顶层 model 是否带 <providerId>/ 斜杠前缀；默认模型是否也出现在 provider.<id>.models 映射里（清单为空或缺默认模型都会报）。

### 手动写的配置，被「应用」覆盖了？

自动应用是合并写入：只重写模型相关字段和自家的 # BEGIN chatop 托管块，块外的自定义内容保留。若你把自定义键写进了托管块内，块整体重写时会丢——挪到块外。

## 补充答疑

### 不想背这些键，有现成片段可抄吗？

设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单 ＞ 本地模型行「帮助」，接入指南里每家一段可复制片段，与自动「应用」写入内容同源（同一生成函数），照抄不会与托管写入漂移。

## 更多操作细节

Claude Code（~/.claude/settings.json）

写入 env 段（合并进现有 JSON，其他键保留）：

json

{

"env": {

"ANTHROPIC_BASE_URL": "http://127.0.0.1:52581",

"ANTHROPIC_AUTH_TOKEN": "chatop-local",

"ANTHROPIC_MODEL": "local/qwen3.5-4b-q4km",

"ANTHROPIC_DEFAULT_SONNET_MODEL": "local/qwen3.5-4b-q4km",

"ANTHROPIC_DEFAULT_OPUS_MODEL": "<注入清单里的第二个模型>",

"ANTHROPIC_DEFAULT_HAIKU_MODEL": "<注入清单里的第三个模型>",

"ANTHROPIC_SMALL_FAST_MODEL": "<注入清单里的第三个模型>"

}

}

要点与坑：

验证：启动 claude 后输 /model，三档应显示注入的模型。

1. ANTHROPIC_BASE_URL 不带 /v1；ANTHROPIC_AUTH_TOKEN 免 key 时必须落哨兵 chatop-local——有 BASE_URL 没 token 时，Claude Code 启动登录检查会直连 api.anthropic.com 得 403，会话直接死掉。
2. Claude Code 没有自定义模型目录：/model 面板固定 Opus / Sonnet / Haiku 三档 + custom 手输。注入靠三档分槽：sonnet = 默认模型、opus = 清单第二个、haiku = 清单第三个（只有一个模型时三档写同一个值）。/model 里切档 = 在注入模型间切换。
3. 手动多模型就按「清单按序分进三档」的规则写上面三个 ANTHROPIC_DEFAULT_*_MODEL 键。

OpenCode（~/.config/opencode/opencode.json）

写入形态（注意是 XDG 全局配置；旧路径 ~/.opencode/opencode.json 是数据目录，CLI 不读）：

json

{

"$schema": "https://opencode.ai/config.json",

"model": "chatop-proxy/local/qwen3.5-4b-q4km",

"provider": {

"chatop-proxy": {

"npm": "@ai-sdk/openai-compatible",

"name": "Chayuan local model service",

"options": { "baseURL": "http://127.0.0.1:52581/v1" },

"models": {

"local/qwen3.5-4b-q4km": { "name": "local/qwen3.5-4b-q4km" },

"deepseek/deepseek-chat": { "name": "deepseek/deepseek-chat" }

}

}

}

}

要点与坑：

验证：终端执行 opencode models——列出 chatop-proxy 下注入模型即通过；CLI 内模型切换面板可见可切。

1. 顶层 baseURL / apiKey 被忽略——地址（和密钥，免 key 时可省）必须放 provider.<id>.options。
2. 顶层 model 必须是 <providerId>/<模型名> 带斜杠；写裸模型名会被当成 provider 名，报 ProviderModelNotFoundError。
3. /model 可见性：provider.<id>.models 映射的键就是 CLI 内模型切换器显示的模型清单；不写 models 键 = 该 provider 下无模型可选，且默认模型必须在映射里（不在则会话报 Model not found）。
4. 历史残留排查：旧版本曾把 chatop-local provider 的 npm 包键写成 npmjs（非法 schema，模型能列、请求期不可用）——手改时如见到 npmjs 键改成 npm。
5. 本地模型冷加载：引擎被 15 分钟空闲自动卸载后第一个请求会挂住数分钟且无反馈，先 curl 代理预热再判断是不是配置问题。

OpenClaw（~/.openclaw/openclaw.json）

写入形态（自定义 provider 走 models.providers.<id>）：

json

{

"models": {

"providers": {

"chatop-proxy": {

"baseUrl": "http://127.0.0.1:52581/v1",

"apiKey": "chatop-local",

"api": "openai-completions",

"models": [

{

"id": "local/qwen3.5-4b-q4km",

"name": "local/qwen3.5-4b-q4km",

"reasoning": false,

"input": ["text"],

"cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },

"contextWindow": 131072,

"maxTokens": 8192

}

]

}

}

},

"agents": { "defaults": { "model": { "primary": "chatop-proxy/local/qwen3.5-4b-q4km" } } }

}

要点与坑：

验证：终端执行 openclaw models list——出现注入行且默认模型带 default 标记即通过；Control UI 设置 ＞ Models 与 TUI /model 均可见可切。

1. models.mode 缺省即 merge（与内置目录合并）——不要写 replace，除非有意替换全部。
2. 免 key 接代理时 apiKey 落哨兵 chatop-local（满足「有凭证」形态，代理对任意 Bearer 放行）。
3. 该文件是严格 JSON：不能加注释，写坏 JSON 会让自动应用直接报错拒写（不覆写你的文件），手改同样要保持合法。
4. OpenClaw 2026.9+ 已删除顶层 --model 旗标——别在启动参数里带模型，模型选择回归其自身 /model 面板，可见性只能靠这份配置文件。
5. 默认模型 = agents.defaults.model.primary，值形如 <providerId>/<模型名>；多模型往 models[] 数组里追加条目即可在面板切换。

Codex配置的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

本文事实口径以 察元AI OS 3.1.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
