---
title: "本地大模型办公进阶理解：从会用到懂原理"
description: "本地大模型办公深度解析：「本地与自建」分组把 AI 接到本机或内网的推理服务上：Ollama、LM Studio、Xinference、One API、New AP……机制、设计取舍与边界一次讲清。"
keywords: ["本地大模型办公", "察元AI Office", "Ollama办公", "内网AI办公"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "本地大模型办公"
channel: "CSDN/知乎/博客"
---

# 本地大模型办公进阶理解：从会用到懂原理

写这篇的起因是群里有人问本地大模型办公，我发现自己也说不完整，索性把察元AI Office里的本地模型接入从头到尾走了一遍，把每一步的界面反馈都记下来。现在这份笔记可以直接当教程用。

## 概念先掰开

「本地与自建」分组把 AI 接到本机或内网的推理服务上：Ollama、LM Studio、Xinference、One API、New API、FastChat/vLLM、GPUStack 及自定义 OpenAI 兼容端点。本地服务族免 API Key——填个地址（本地服务连地址都预填好了）、拉取模型列表、勾选启用即可；请求全走 localhost/内网，断网也能用 AI。Ollama、LM Studio、Codex CLI 还支持设置页里一键安装（Ollama 可再一键启动服务）。

涉密文档不能出网，本地模型让 AI 校对、AI 改写在隔离环境照常工作。

入口、步骤、验证三段看清，这事就顺了。

## 原理与设计取舍

涉密文档不能出网，本地模型让 AI 校对、AI 改写在隔离环境照常工作。

能力面拆开看：一键启动 Ollama，免 Key 直连，八类本地端点。

从提问口径看，用户最关心的是Ollama 怎么接？要填 Key 吗？

## 具体怎么操作

按最短路径验证一遍：

第 1 步 · 打开「本地与自建」分组

1. 主页左下角账号行齿轮「设置」＞「模型设置」，左栏目录展开「本地与自建」组，共 9 家：Ollama、Codex（本地 CLI）、LM Studio、Xinference、One API、New API、FastChat / vLLM、GPUStack、自定义 OpenAI 兼容。其中 7 家本地服务族（Ollama、LM Studio、Xinference、One API、New API、FastChat / vLLM、GPUStack）带「无需 Key」「免费」徽标（One API/New API/GPUStack 无默认地址，需手填）；Codex（本地 CLI）复用本机 CLI 登录、标「免费」；「自定义 OpenAI 兼容」是万能兜底入口，通常指向需要密钥的远端网关，不标「无需 Key」。

第 2 步 · 一键安装/启动（本机没有服务时）

1. 点选 Ollama（或 LM Studio），右栏顶部出现本地服务状态卡（桌面形态专有，web 形态自动隐藏），四种状态：
    1. 「本地服务运行中」（绿点，附版本号如 · v0.x.x）——直接进第 3 步；
    2. 「已安装，服务未运行」——Ollama 会出现「启动服务」按钮（拉起 ollama serve 或打开 Ollama.app），成功提示「服务已启动」，20 秒未应答提示「启动超时：服务未在 20 秒内应答」；LM Studio 等没有启动项的厂商只提供「重新检测」（需回到其应用里自行启动服务）；
    3. 「未检测到本地安装」——点「一键安装」（提示「从官方源下载安装，耗时视网络而定」）：Ollama 在 macOS 走 Homebrew 或官方 Ollama.app 包、Windows 走官方 OllamaSetup.exe、Linux 走官方安装脚本；LM Studio 走 Homebrew Cask（需先装 Homebrew）/ winget；下载过程逐行透出进度（如「下载中 37%（xMB/yMB）」）；
    4. 安装失败时失败信息末尾附官方手动下载页（Ollama 为 https://ollama.com/download），手动装完点「重新检测」即可接管。
    5. 每次只允许一个安装/启动任务（重复触发提示「已有安装任务进行中，请稍候」）。
    6. Codex（本地 CLI）的一键安装走 npm install -g @openai/codex（需要 Node.js；默认 npm 源失败自动换国内镜像 npmmirror 重试一次），复用本机 Codex CLI 的登录态，模型列表来自其 CLI 目录。

第 3 步 · 拉取模型并启用

1. API 地址：本地服务已预填默认值——Ollama http://localhost:11434/v1、LM Studio http://localhost:1234/v1、Xinference http://localhost:9997/v1、FastChat/vLLM http://localhost:8000/v1（One API/New API/GPUStack/自定义端点为空，手填内网地址）。
2. API 密钥：本地服务族标注「本地服务可不填密钥」，留空即可；填内网网关时按网关要求填。
3. 点「获取模型列表」：本地服务族先探 Ollama 风格 /api/tags，失败自动回退 OpenAI 风格 /models——两种门面都认；成功提示「获取到 N 个模型」。
4. 勾选模型（按对话/视觉/向量等类型分组，组头可「全选/全不选」）＞ 点「保存并启用」。保存前同样做协议验证，失败提示「协议验证失败，未保存：<原因>」。
5. 启用后到「默认模型」区把对话默认模型指到本地模型（不设置时自动用第一个可用对话模型）。

## 它的局限也要说清楚

边界都在这：

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx

## 你可能会问

### 内网网关怎么接？

选 One API、New API、GPUStack（或「自定义 OpenAI 兼容」），API 地址填内网可达地址（如 http://192.168.x.x:3000/v1），按网关要求填 Key，拉取列表后勾选启用。客户端只在列表接口与对话请求两处访问该地址。

### 免 Key 家族到底要不要填 Key？

Ollama、LM Studio、Xinference、One API、New API、FastChat/vLLM、GPUStack 这些本地/自建服务免 Key（表单标注「本地服务可不填密钥」）。「自定义 OpenAI 兼容」不在此列——它通常指向远端网关，一般要填 Bearer Key；免 Key 的本地引擎请用对应专属厂商条目。

### 「获取模型列表」返回空或失败？

先确认服务真的在跑：Ollama 访问 http://127.0.0.1:11434/api/version；LM Studio 注意要在其应用里启动 Local Server（默认端口 1234），装了没开服务会显示「已安装，服务未运行」。服务正常仍失败时检查地址端口是否被改过，再重试拉取。

### 本地模型能用于生图/语音这些能力吗？

能挂上，按模型类型自动归类（对话/视觉/向量/生图/视频生成/语音合成/语音识别等，按模型 id 推断类型）；能力是否可用取决于模型本身——例如语音识别需要端点提供转写 API（OpenAI 兼容 /audio/transcriptions 或 Gemini inline），本地 Ollama 暂无此类端点时该能力不可选。

## 补充答疑

### 一键安装失败/下载不动？

安装走官方源（ollama.com、Homebrew、winget、npm），国内网络可能直连失败——失败信息里附了官方手动下载页，手动安装后点「重新检测」即可；Codex CLI 的 npm 安装失败会自动换 npmmirror 镜像重试一次。

## 更多操作细节

第 4 步 · 内网与离线要点（Air-gap）

1. 请求链路：Office ＞ 你填的 API 地址（localhost 或内网主机），不经任何中间服务器；模型列表同样从该地址实时拉取。
2. 断网验证过的能力边界：本地模型对话/改写/生成照常；云端厂商与需要公网的能力（网络搜索、云端生图等）不可用；文档编辑、PDF 本地转换、扫描 OCR 本就全本机，不受影响。
3. 配了语音识别默认模型（「生图、媒体与搜索」区 语音识别）时，首页对话可把音频转成文字：OpenAI 兼容端点走 /audio/transcriptions、Gemini 走 inline 音频；阿里百炼的 paraformer 系只接受公网音频 URL，本机音频请改配 qwen3-asr 系或本地 Whisper 形端点。

## 能力点备忘

- 八类本地端点
- 一键启动 Ollama
- 免 Key 直连

## 安装与运行答疑

### 必须配置 API Key 才能用 AI 吗？

现阶段是。内置账号登录当前版本未开放，AI 功能需要 BYOK 接入厂商或本机 Ollama 等端点；不配模型时传统办公功能完全可用。

### 老格式 doc 文件打不开？

明确不支持 doc 与 ppt 老格式，先转成 docx 或 pptx 再打开；odt 等 ODF 格式可导入但采取保守策略。

## 一个真实场景

机关单位文字岗的典型用法：Docs 写正文，察元AI 页签全文校对出批注，保密检查八大类风险扫描，修订追踪让 AI 改动落成通用修订，逐条接受。校对、保密、留痕一条链在离线环境完成。注意：涉密文档建议接本地模型，全文不出机器。

本地大模型办公的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

察元AI Office，开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器。官网 aidooo.com，数据截至 2026 年 10 月（版本 1.0.15）。
