---
title: "Claude配置场景拆解：给智能体接模型有两条路"
description: "Claude配置场景实战：自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。从需求到交付的完整工作流。"
keywords: ["Claude配置", "察元AI OS", "智能体配置", "Codex配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "Claude配置"
channel: "CSDN/知乎/博客"
---

# Claude配置场景拆解：给智能体接模型有两条路

Claude配置这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按察元AI OS的真实界面顺序走一遍，先解决新装智能体接上本地模型。

## 解决什么痛点

不想或不能用「一键应用」（例如在别的终端会话里排障、想精确控制某一家写的键），需要知道每家配置文件长什么样、写到哪，想让已装的 CLI 智能体（Claude Code / Codex / OpenCode / OpenClaw）用察元的本地模型或厂商模型，新装智能体接上本地模型；手动微调某家的模型槽位。

## 完整操作步骤

OpenCode（`~/.config/opencode/opencode.json`）

写入形态（注意是 XDG 全局配置；旧路径 ~/.opencode/opencode.json 是数据目录，CLI 不读）：

```json
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
```

要点与坑：

验证：终端执行 opencode models——列出 chatop-proxy 下注入模型即通过；CLI 内模型切换面板可见可切。

1. 顶层 baseURL / apiKey 被忽略——地址（和密钥，免 key 时可省）必须放 provider.<id>.options。
2. 顶层 model 必须是 <providerId>/<模型名> 带斜杠；写裸模型名会被当成 provider 名，报 ProviderModelNotFoundError。
3. /model 可见性：provider.<id>.models 映射的键就是 CLI 内模型切换器显示的模型清单；不写 models 键 = 该 provider 下无模型可选，且默认模型必须在映射里（不在则会话报 Model not found）。
4. 历史残留排查：旧版本曾把 chatop-local provider 的 npm 包键写成 npmjs（非法 schema，模型能列、请求期不可用）——手改时如见到 npmjs 键改成 npm。
5. 本地模型冷加载：引擎被 15 分钟空闲自动卸载后第一个请求会挂住数分钟且无反馈，先 curl 代理预热再判断是不是配置问题。

OpenClaw（`~/.openclaw/openclaw.json`）

写入形态（自定义 provider 走 models.providers.<id>）：

```json
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
```

要点与坑：

验证：终端执行 openclaw models list——出现注入行且默认模型带 default 标记即通过；Control UI 设置 ＞ Models 与 TUI /model 均可见可切。

1. models.mode 缺省即 merge（与内置目录合并）——不要写 replace，除非有意替换全部。
2. 免 key 接代理时 apiKey 落哨兵 chatop-local（满足「有凭证」形态，代理对任意 Bearer 放行）。
3. 该文件是严格 JSON：不能加注释，写坏 JSON 会让自动应用直接报错拒写（不覆写你的文件），手改同样要保持合法。
4. OpenClaw 2026.9+ 已删除顶层 --model 旗标——别在启动参数里带模型，模型选择回归其自身 /model 面板，可见性只能靠这份配置文件。
5. 默认模型 = agents.defaults.model.primary，值形如 <providerId>/<模型名>；多模型往 models[] 数组里追加条目即可在面板切换。

Harness（无手动配置文件）

DeepSeek Harness 不走用户可改的配置文件：自动应用会把代理地址 + 模型清单写进它的模型服务配置（provider 名显示 local (proxy)），之后在 Harness 会话窗的模型下拉里直接选用。手动路线无需操作，日常切换模型见对应教程（Harness 主对话窗与选模型）。

## 关键能力点

- 五家自动写入带备份
- 各家配置文件面文档化
- 写入即生效可切换

## 几个容易忽略的细节

用之前要认的账：

- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限
- 云端厂商模型调用需自备 API Key
- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力

## 你可能会问

### Codex 手动写完 provider，/model 里还是内置 ChatGPT 模型列表？

/model 面板只认 model_catalog_json 目录（整体替换内置列表），不读 [model_providers]。用 M9 自动应用一次让它生成 ~/.codex/model-catalogs/chatop.json，再重开 codex 会话（目录启动时加载）。

### OpenCode 报 ProviderModelNotFoundError 或 Model not found？

两个必查点：顶层 model 是否带 <providerId>/ 斜杠前缀；默认模型是否也出现在 provider.<id>.models 映射里（清单为空或缺默认模型都会报）。

### Claude Code 一启动就报 403 / 让我登录？

ANTHROPIC_BASE_URL 设了但 ANTHROPIC_AUTH_TOKEN 没落哨兵 chatop-local——启动登录检查会绕过你的 BASE_URL 直连官方 403。补上哨兵值即可。

## 更多操作细节

路线 A：自动一键写入（推荐）

三个入口（向导第 3 步 / 设置 ＞ 默认模型 / 模型代理面板「统一应用…」）、应用对话框逐项 UI、写入内容、备份与回退，全部见对应教程 把模型应用到智能体——自动与手动写的是同一套键，本篇不重复展开。以下只讲手动面。

## 更多操作细节

路线 B：手动改各家配置文件

先记住三条公共约定：

偷懒办法：设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单里本地模型行点「帮助」，弹出的接入指南含各家可复制的配置片段——片段与自动「应用」写入的内容由同一生成函数产出，抄它不会错。

1. 地址：OpenAI 兼容对话面基址 http://127.0.0.1:52581。Codex / OpenCode / OpenClaw 的地址要带 /v1 后缀；Claude Code 的 ANTHROPIC_BASE_URL 不带 /v1（它自己拼 /v1/messages，代理同端口提供换算面）。
2. 免 key：代理对本机调用不验证密钥（任意 Bearer 或不带都放行，审计记 anonymous）。真实厂商密钥永远不需要写进这些文件。
3. 哨兵凭证：Claude Code 和 OpenClaw 要求「有凭证」的形态才肯启动/请求——免 key 接代理时写哨兵值 chatop-local（代理认它，不是真密钥）。

## 更多操作细节

Codex（`~/.codex/config.toml`）

写入形态（自动应用写的就是这个样子，可直接抄）：

```toml
model = "local/qwen3.5-4b-q4km"
model_provider = "chatop-proxy"
[model_providers.chatop-proxy]
name = "chatop-proxy"
base_url = "http://127.0.0.1:52581/v1"
wire_api = "responses"
supports_websockets = false
stream_idle_timeout_ms = 600000
```

要点与坑（均为真机实锤）：

验证：终端执行 codex debug models——目录可载且只剩注入模型即通过；端到端试一发 codex exec --skip-git-repo-check "只回复两个字：成功"。

1. 根表键 model / model_provider / model_catalog_json 必须写在文件最顶部（第一个 [表] 头之前、所有 # BEGIN chatop … 托管块之外）。写进某张表内或托管块里会被解析进别人的表/被块重写吞掉，codex 恒回 openai 默认。
2. Codex ≥0.154 只认 [model_providers.<id>] 表；顶层 base_url / api_key 被静默忽略。wire_api 只能写 "responses"（"chat" 已被移除，载入即报错）。
3. 免 key 可省 experimental_bearer_token；代理不校验。
4. /model 可见性：codex 的模型选择器不读 [model_providers]，只认 model_catalog_json 指向的 JSON 目录，且该目录整体替换内置 ChatGPT 列表。目录条目有一整套必填字段（缺任一即拒载目录），手写极易翻车——推荐让自动应用生成（落在 ~/.codex/model-catalogs/chatop.json，config.toml 根表多出 model_catalog_json = "<该文件路径>"），手动场景直接复用这个已生成的文件。
5. 目录是启动时加载：改完配置必须重开 codex 会话，/model 才刷新。
6. 接厂商模型不要直连厂商地址：codex 的工具形态（namespace/custom）第三方 Responses 面一律 400，厂商模型必须经代理（模型名用 <厂商id>/<模型名> 命名空间；自动应用的厂商直连也会被强制改道代理）。

如果只记一件事：五家自动写入带备份。剩下的细节，照步骤节走就行。

---

本文事实口径以 察元AI OS 3.1.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
