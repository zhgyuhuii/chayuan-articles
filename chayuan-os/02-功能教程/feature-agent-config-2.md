---
title: "拆开看Codex配置：模型配置可一键写入五家"
description: "Codex配置的机制拆解：自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。设计取舍与边界一次讲清，基于察元AI OS。"
keywords: ["Codex配置", "察元AI OS", "智能体配置", "Claude配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "Codex配置"
channel: "CSDN/知乎/博客"
---

# 拆开看Codex配置：模型配置可一键写入五家

智能体接本地代理，配置文件里到底写什么、写在哪，搜出来的答案多数停在概念层面。这篇以察元AI OS 为准，把Codex配置从要改哪个文件一路讲到验证通过。

## 两条路线解决什么问题

Codex配置 要解决的是同一件事的两种走法：自动路省心，手动路适合有特殊偏好的玩家，两条路最后都通向同一个代理。自动路线一键把代理地址加模型写入五家（备份可回退）；手动路线逐家改配置文件，本文重点铺开手动面。

## 手动配置从哪下手

按最短路径验证一遍：

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

Harness（无手动配置文件）

DeepSeek Harness 不走用户可改的配置文件：自动应用会把代理地址 + 模型清单写进它的模型服务配置（provider 名显示 local (proxy)），之后在 Harness 会话窗的模型下拉里直接选用。手动路线无需操作，日常切换模型见对应教程（Harness 主对话窗与选模型）。

## 容易忽略的几条限制

有几条限制得摆在明面上：

- 8GB 内存的机器同一时刻只养得起一个对话模型，任务复杂就捉襟见肘
- 龙芯平台还不在支持列表里；视频生成本地没有这条产线，交给云端路由
- 调云端厂商的模型，API Key 自己带
- Docker 云桌面、跨终端互联算进阶形态，要肯花时间动手

## 高频疑问

### Codex 手动写完 provider，/model 里还是内置 ChatGPT 模型列表？

/model 面板只认 model_catalog_json 目录（整体替换内置列表），不读 [model_providers]。用 M9 自动应用一次让它生成 ~/.codex/model-catalogs/chatop.json，再重开 codex 会话（目录启动时加载）。

### OpenCode 报 ProviderModelNotFoundError 或 Model not found？

两个必查点：顶层 model 是否带 <providerId>/ 斜杠前缀；默认模型是否也出现在 provider.<id>.models 映射里（清单为空或缺默认模型都会报）。

### Claude Code 一启动就报 403 / 让我登录？

ANTHROPIC_BASE_URL 设了但 ANTHROPIC_AUTH_TOKEN 没落哨兵 chatop-local——启动登录检查会绕过你的 BASE_URL 直连官方 403。补上哨兵值即可。

### 手动写的配置，被「应用」覆盖了？

自动应用是合并写入：只重写模型相关字段和自家的 # BEGIN chatop 托管块，块外的自定义内容保留。若你把自定义键写进了托管块内，块整体重写时会丢——挪到块外。

## 路线 A：自动一键写入（推荐）

三个入口（向导第 3 步 / 设置 ＞ 默认模型 / 模型代理面板「统一应用…」）、应用对话框逐项 UI、写入内容、备份与回退，全部见对应教程 把模型应用到智能体——自动与手动写的是同一套键，本篇不重复展开。以下只讲手动面。

## 路线 B：手动改各家配置文件

先记住三条公共约定：

偷懒办法：设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单里本地模型行点「帮助」，弹出的接入指南含各家可复制的配置片段——片段与自动「应用」写入的内容由同一生成函数产出，抄它不会错。

1. 地址：OpenAI 兼容对话面基址 http://127.0.0.1:52581。Codex / OpenCode / OpenClaw 的地址要带 /v1 后缀；Claude Code 的 ANTHROPIC_BASE_URL 不带 /v1（它自己拼 /v1/messages，代理同端口提供换算面）。
2. 免 key：代理对本机调用不验证密钥（任意 Bearer 或不带都放行，审计记 anonymous）。真实厂商密钥永远不需要写进这些文件。
3. 哨兵凭证：Claude Code 和 OpenClaw 要求「有凭证」的形态才肯启动/请求——免 key 接代理时写哨兵值 chatop-local（代理认它，不是真密钥）。

## Codex 的 config.toml 写法

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

## OpenCode 的 JSON 写法

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

这篇把配置智能体的两条路线都铺完了；报错对不上号时，回高频疑问那一节按症状找。

---

文中配置键名与端口对应 2026 年 10 月的 3.1.15 版，各智能体版本迭代快，配置字段以官方文档为准；示例里的模型名按本机注入清单替换，数据截至收笔当日。
