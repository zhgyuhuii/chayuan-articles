---
title: "配置文件排查路径：家外部 CLI 智能体"
description: "配置文件排错指南：定位路径、高频故障与对策，自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。"
keywords: ["配置文件", "察元AI OS", "智能体配置", "Codex配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "配置文件"
channel: "CSDN/知乎/博客"
---

# 配置文件排查路径：家外部 CLI 智能体

配置文件的麻烦不在功能本身，在于信息散。自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。这篇把它收拢成一条能照着走的路径。

## 先定位问题在哪一层

按这个顺序排查配置文件通常最快：先确认前置条件（模型代理在运行（固定 http://127.0.0.1:52581，一号一口写死）：设置 ＞ 模型 ＞ 「模型代理设置」页顶部状态点为绿色「代理运行中」。），再核对操作路径，最后看边界限制。

## 正确的操作路径

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

## 如何确认操作生效

验证（手动写入后逐家核对）

1. 代理在跑、模型在清单：curl http://127.0.0.1:52581/v1/models 返回里有你写的模型引用串。
2. Codex：codex debug models 只剩注入模型；cat ~/.codex/config.toml 根表有 model / model_provider（在所有表头之前）。
3. Claude Code：cat ~/.claude/settings.json 的 env 段有 ANTHROPIC_BASE_URL（无 /v1）与哨兵 ANTHROPIC_AUTH_TOKEN；/model 三档显示注入模型。
4. OpenCode：opencode models 列出注入模型；配置里顶层 model 带斜杠、provider.<id>.models 映射非空。
5. OpenClaw：openclaw models list 出现注入行与 default 标记。
6. 手动写完又想回到「托管」状态：直接跑一次 M9 的自动应用即可——它幂等重写自家托管块（Codex 的 # BEGIN chatop provider 块、OpenClaw 的 provider 段等），文件里你写在托管块之外的自定义内容会保留。

## 进阶用法与边界

- 五家自动写入带备份
- 各家配置文件面文档化
- 写入即生效可切换

## 你可能会问

### 手动写的配置，被「应用」覆盖了？

自动应用是合并写入：只重写模型相关字段和自家的 # BEGIN chatop 托管块，块外的自定义内容保留。若你把自定义键写进了托管块内，块整体重写时会丢——挪到块外。

### 不想背这些键，有现成片段可抄吗？

设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单 ＞ 本地模型行「帮助」，接入指南里每家一段可复制片段，与自动「应用」写入内容同源（同一生成函数），照抄不会与托管写入漂移。

## 更多操作细节

Claude Code（`~/.claude/settings.json`）

写入 env 段（合并进现有 JSON，其他键保留）：

```json
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
```

要点与坑：

验证：启动 claude 后输 /model，三档应显示注入的模型。

1. ANTHROPIC_BASE_URL 不带 /v1；ANTHROPIC_AUTH_TOKEN 免 key 时必须落哨兵 chatop-local——有 BASE_URL 没 token 时，Claude Code 启动登录检查会直连 api.anthropic.com 得 403，会话直接死掉。
2. Claude Code 没有自定义模型目录：/model 面板固定 Opus / Sonnet / Haiku 三档 + custom 手输。注入靠三档分槽：sonnet = 默认模型、opus = 清单第二个、haiku = 清单第三个（只有一个模型时三档写同一个值）。/model 里切档 = 在注入模型间切换。
3. 手动多模型就按「清单按序分进三档」的规则写上面三个 ANTHROPIC_DEFAULT_*_MODEL 键。

## 更多操作细节

Harness（无手动配置文件）

DeepSeek Harness 不走用户可改的配置文件：自动应用会把代理地址 + 模型清单写进它的模型服务配置（provider 名显示 local (proxy)），之后在 Harness 会话窗的模型下拉里直接选用。手动路线无需操作，日常切换模型见对应教程（Harness 主对话窗与选模型）。

## 动手前再核对一遍

- 模型代理在运行（固定 http://127.0.0.1:52581，一号一口写死）：设置 ＞ 模型 ＞ 「模型代理设置」页顶部状态点为绿色「代理运行中」。
- 代理里有可用模型：本地已装模型（引用串 local/<模型名>）或已加入代理的厂商路由（<厂商id>/<模型名>）。可 curl http://127.0.0.1:52581/v1/models 查看清单。
- 手动路线只要求目标智能体 CLI 已安装；文件直接改，不依赖桌面形态。
- 模型引用串以代理清单为准：本地模型形如 local/qwen3.5-4b-q4km，厂商模型形如 deepseek/deepseek-chat。

## 这几条能力放一起看更清楚

- 五家自动写入带备份
- 各家配置文件面文档化
- 写入即生效可切换

## 放回产品盘面看

把配置文件放回察元AI OS的整体盘面：手动改五家配置文件既繁琐又容易错，一键写入加备份回退把这件事的出错概率压到零，各家配置文件面文档化；自动投影进配置文件，完全隔离的内网没法在线下载，U 盘搬运权重文件是最现实的路径，系统为此做了零拷贝导入。

## 安全与数据边界

安全口径单独立一层：本机 Stable Diffusion 链路出图不联网，隐私与免费兼得；一台设备多人用，数据隔离是底线，管理员统一管账号比各自为战安全；隐私敏感环境先关遥测再干活，处置设备前清数据；（本机 MCP HTTP 服务，回环免 token）。

配置智能体这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI OS试第一步。

---

本文事实口径以 察元AI OS 3.1.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
