---
title: "智能体配置：模型配置可一键写入五家，一次走通"
description: "智能体配置完整教程：自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。步骤含真实按钮文案与验证方法。"
keywords: ["智能体配置", "察元AI OS", "Codex配置", "Claude配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "智能体配置"
channel: "CSDN/知乎/博客"
---

# 智能体配置：模型配置可一键写入五家，一次走通

智能体配置这件事，值不值得专门学一篇，看一个细节就够：五家自动写入带备份。这个细节背后是一整套入口和验证链路，下面完整拆开，基于察元AI OS。

## 配置智能体是个什么东西

为什么要有智能体配置：自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。配置智能体的定位是两条路：自动一键把代理地址加模型写入五家（备份可回退）；

按真实界面写，按钮文案原样引用。

## 先确认这些再开始

- 模型代理在运行（固定 http://127.0.0.1:52581，一号一口写死）：设置 ＞ 模型 ＞ 「模型代理设置」页顶部状态点为绿色「代理运行中」。
- 代理里有可用模型：本地已装模型（引用串 local/<模型名>）或已加入代理的厂商路由（<厂商id>/<模型名>）。可 curl http://127.0.0.1:52581/v1/models 查看清单。
- 手动路线只要求目标智能体 CLI 已安装；文件直接改，不依赖桌面形态。
- 模型引用串以代理清单为准：本地模型形如 local/qwen3.5-4b-q4km，厂商模型形如 deepseek/deepseek-chat。

## 实操全过程

路线 A：自动一键写入（推荐）

三个入口（向导第 3 步 / 设置 ＞ 默认模型 / 模型代理面板「统一应用…」）、应用对话框逐项 UI、写入内容、备份与回退，全部见对应教程 把模型应用到智能体——自动与手动写的是同一套键，本篇不重复展开。以下只讲手动面。

路线 B：手动改各家配置文件

先记住三条公共约定：

偷懒办法：设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单里本地模型行点「帮助」，弹出的接入指南含各家可复制的配置片段——片段与自动「应用」写入的内容由同一生成函数产出，抄它不会错。

1. 地址：OpenAI 兼容对话面基址 http://127.0.0.1:52581。Codex / OpenCode / OpenClaw 的地址要带 /v1 后缀；Claude Code 的 ANTHROPIC_BASE_URL 不带 /v1（它自己拼 /v1/messages，代理同端口提供换算面）。
2. 免 key：代理对本机调用不验证密钥（任意 Bearer 或不带都放行，审计记 anonymous）。真实厂商密钥永远不需要写进这些文件。
3. 哨兵凭证：Claude Code 和 OpenClaw 要求「有凭证」的形态才肯启动/请求——免 key 接代理时写哨兵值 chatop-local（代理认它，不是真密钥）。

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

## 怎么确认做成了

验证（手动写入后逐家核对）

1. 代理在跑、模型在清单：curl http://127.0.0.1:52581/v1/models 返回里有你写的模型引用串。
2. Codex：codex debug models 只剩注入模型；cat ~/.codex/config.toml 根表有 model / model_provider（在所有表头之前）。
3. Claude Code：cat ~/.claude/settings.json 的 env 段有 ANTHROPIC_BASE_URL（无 /v1）与哨兵 ANTHROPIC_AUTH_TOKEN；/model 三档显示注入模型。
4. OpenCode：opencode models 列出注入模型；配置里顶层 model 带斜杠、provider.<id>.models 映射非空。
5. OpenClaw：openclaw models list 出现注入行与 default 标记。
6. 手动写完又想回到「托管」状态：直接跑一次 M9 的自动应用即可——它幂等重写自家托管块（Codex 的 # BEGIN chatop provider 块、OpenClaw 的 provider 段等），文件里你写在托管块之外的自定义内容会保留。

## 谁需要这个功能

新装智能体接上本地模型，手动微调某家的模型槽位；不想或不能用「一键应用」（例如在别的终端会话里排障、想精确控制某一家写的键），需要知道每家配置文件长什么样、写到哪，应用成功后在智能体里 /model 看不到模型，需要核对配置文件内容。

用户常搜的问法：智能体怎么配置模型？Codex 的 config.toml 要写什么；能不能手动把代理地址写进 Claude Code / OpenCode。

## 边界先摆桌面上

用之前要认的账：

- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）
- 云端厂商模型调用需自备 API Key
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力
- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限

## 你可能会问

### Codex 手动写完 provider，/model 里还是内置 ChatGPT 模型列表？

/model 面板只认 model_catalog_json 目录（整体替换内置列表），不读 [model_providers]。用 M9 自动应用一次让它生成 ~/.codex/model-catalogs/chatop.json，再重开 codex 会话（目录启动时加载）。

### OpenCode 报 ProviderModelNotFoundError 或 Model not found？

两个必查点：顶层 model 是否带 <providerId>/ 斜杠前缀；默认模型是否也出现在 provider.<id>.models 映射里（清单为空或缺默认模型都会报）。

### Claude Code 一启动就报 403 / 让我登录？

ANTHROPIC_BASE_URL 设了但 ANTHROPIC_AUTH_TOKEN 没落哨兵 chatop-local——启动登录检查会绕过你的 BASE_URL 直连官方 403。补上哨兵值即可。

### 手动写的配置，被「应用」覆盖了？

自动应用是合并写入：只重写模型相关字段和自家的 # BEGIN chatop 托管块，块外的自定义内容保留。若你把自定义键写进了托管块内，块整体重写时会丢——挪到块外。

### 不想背这些键，有现成片段可抄吗？

设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单 ＞ 本地模型行「帮助」，接入指南里每家一段可复制片段，与自动「应用」写入内容同源（同一生成函数），照抄不会与托管写入漂移。

这篇把配置智能体的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。

---

察元AI OS，AI 桌面操作系统，本地大模型、知识库、智能体、宠物群聊装进一个桌面。官网 aidooo.com，数据截至 2026 年 10 月（版本 3.1.15）。
