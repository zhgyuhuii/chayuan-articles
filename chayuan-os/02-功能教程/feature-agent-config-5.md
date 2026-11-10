---
title: "模型接入：新装智能体接上本地模型"
description: "模型接入完整教程：自动路省心，手动路适合有特殊偏好的玩家，两条路都通向同一个代理。步骤含真实按钮文案与验证方法。"
keywords: ["模型接入", "察元AI OS", "智能体配置", "Codex配置"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "模型接入"
channel: "CSDN/知乎/博客"
---

# 模型接入：新装智能体接上本地模型

先说这篇能帮你干什么：读完能在察元AI OS里独立完成模型接入，路径是新装智能体接上本地模型。步骤里的每个「」按钮都是界面原文。

## 一句话说清定位

模型接入能做的事拆开就这几件：写入即生效可切换；各家配置文件面文档化；五家自动写入带备份。对应的界面入口是配置智能体

先把定位立住，再看步骤。

## 开工前检查这几样

- 模型代理在运行（固定 http://127.0.0.1:52581，一号一口写死）：设置 ＞ 模型 ＞ 「模型代理设置」页顶部状态点为绿色「代理运行中」。
- 代理里有可用模型：本地已装模型（引用串 local/<模型名>）或已加入代理的厂商路由（<厂商id>/<模型名>）。可 curl http://127.0.0.1:52581/v1/models 查看清单。
- 手动路线只要求目标智能体 CLI 已安装；文件直接改，不依赖桌面形态。
- 模型引用串以代理清单为准：本地模型形如 local/qwen3.5-4b-q4km，厂商模型形如 deepseek/deepseek-chat。

## 配置智能体：从入口到完成

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

## 收尾检查

验证（手动写入后逐家核对）

1. 代理在跑、模型在清单：curl http://127.0.0.1:52581/v1/models 返回里有你写的模型引用串。
2. Codex：codex debug models 只剩注入模型；cat ~/.codex/config.toml 根表有 model / model_provider（在所有表头之前）。
3. Claude Code：cat ~/.claude/settings.json 的 env 段有 ANTHROPIC_BASE_URL（无 /v1）与哨兵 ANTHROPIC_AUTH_TOKEN；/model 三档显示注入模型。
4. OpenCode：opencode models 列出注入模型；配置里顶层 model 带斜杠、provider.<id>.models 映射非空。
5. OpenClaw：openclaw models list 出现注入行与 default 标记。
6. 手动写完又想回到「托管」状态：直接跑一次 M9 的自动应用即可——它幂等重写自家托管块（Codex 的 # BEGIN chatop provider 块、OpenClaw 的 provider 段等），文件里你写在托管块之外的自定义内容会保留。

## 什么情况下用得上

手动微调某家的模型槽位；想让已装的 CLI 智能体（Claude Code / Codex / OpenCode / OpenClaw）用察元的本地模型或厂商模型；新装智能体接上本地模型；应用成功后在智能体里 /model 看不到模型，需要核对配置文件内容。

用户常搜的问法：智能体怎么配置模型？Codex 的 config.toml 要写什么；能不能手动把代理地址写进 Claude Code / OpenCode。

## 边界先摆桌面上

用之前要认的账：

- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）
- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限
- 云端厂商模型调用需自备 API Key
- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力

## 你可能会问

### 不想背这些键，有现成片段可抄吗？

设置 ＞ 模型 ＞ 模型代理设置 ＞ 被代理模型清单 ＞ 本地模型行「帮助」，接入指南里每家一段可复制片段，与自动「应用」写入内容同源（同一生成函数），照抄不会与托管写入漂移。

## 顺手把能力清单放这

- 五家自动写入带备份
- 各家配置文件面文档化
- 写入即生效可切换

## 放回产品盘面看

把模型接入放回察元AI OS的整体盘面：想换默认模型随时可以在设置里重跑向导，不用重装；本地模型解决有无问题，复杂任务还是需要云端旗舰模型；断网时云端模型不可用，可设自动回落本地，模型库按本机内存预算分层推荐（能跑/勉强/跑不动三档标记）。

## 安全与数据边界

安全口径单独立一层：常用模型可钉住常驻；一台 16GB 内存的机器跑两个 8B 模型必然卡死；显式的加载卸载加自动卸载策略是本地模型的生存之道；自动卸载会释放常驻模型，重度使用记得钉住。

## 平台与形态

平台与形态的账：很多人卡在第一步不是不会用 AI，是被各家智能体各配一遍模型劝退的；概念页解释模型代理机制，默认对话模型选择，重跑入口在设置＞模型＞设置向导。

## 价格与授权

价格口径一并交代：共享同一个模型代理；设置常驻任务新建：写指令、选模型或智能体（或直跑）、配工作区知识库与联网开关；购买 OS 授权后，同机察元AI Office 自动免激活，免费下载使用，购买只停提醒、不锁功能。

## 产品家族与搭配

察元AI OS不是单打独斗：单个模型有偏好也有盲区；让几个模型围绕同一命题各自作答或接力深化，模型直跑宠无角色卡也能入群；本地模型多宠同发会排队（本地档 4 路并发上限）。

配置智能体这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI OS试第一步。

---

察元AI OS（Chayuan AI OS）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 3.1.15），后续版本功能可能调整。
