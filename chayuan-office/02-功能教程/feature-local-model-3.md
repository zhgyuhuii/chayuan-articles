---
title: "从需求到交付：内网AI办公"
description: "内网AI办公场景实战：涉密文档不能出网，本地模型让 AI 校对、AI 改写在隔离环境照常工作。从需求到交付的完整工作流。"
keywords: ["内网AI办公", "察元AI Office", "Ollama办公", "本地大模型办公"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "内网AI办公"
channel: "CSDN/知乎/博客"
---

# 从需求到交付：内网AI办公

内网AI办公的麻烦不在功能本身，在于信息散。涉密文档不能出网，本地模型让 AI 校对、AI 改写在隔离环境照常工作。这篇把它收拢成一条能照着走的路径。

## 为什么值得了解

内网/隔离网环境：只有一台内网推理网关（One API、New API、GPUStack、vLLM），没有公网出口；数据不出本机的合规场景：离线状态下继续用 AI（编辑、PDF 转换、OCR 等传统功能本就全本地）；本机装了 Ollama / LM Studio，想让 Office 的文档生成、改写全部走本地模型，无外网机房写材料。

## 操作步骤详解

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

第 4 步 · 内网与离线要点（Air-gap）

1. 请求链路：Office ＞ 你填的 API 地址（localhost 或内网主机），不经任何中间服务器；模型列表同样从该地址实时拉取。
2. 断网验证过的能力边界：本地模型对话/改写/生成照常；云端厂商与需要公网的能力（网络搜索、云端生图等）不可用；文档编辑、PDF 本地转换、扫描 OCR 本就全本机，不受影响。
3. 配了语音识别默认模型（「生图、媒体与搜索」区 语音识别）时，首页对话可把音频转成文字：OpenAI 兼容端点走 /audio/transcriptions、Gemini 走 inline 音频；阿里百炼的 paraformer 系只接受公网音频 URL，本机音频请改配 qwen3-asr 系或本地 Whisper 形端点。

## 关键能力点

- 八类本地端点
- 一键启动 Ollama
- 免 Key 直连

## 它的局限也要说清楚

用之前要认的账：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 常见问题

### 免 Key 家族到底要不要填 Key？

Ollama、LM Studio、Xinference、One API、New API、FastChat/vLLM、GPUStack 这些本地/自建服务免 Key（表单标注「本地服务可不填密钥」）。「自定义 OpenAI 兼容」不在此列——它通常指向远端网关，一般要填 Bearer Key；免 Key 的本地引擎请用对应专属厂商条目。

### 「获取模型列表」返回空或失败？

先确认服务真的在跑：Ollama 访问 http://127.0.0.1:11434/api/version；LM Studio 注意要在其应用里启动 Local Server（默认端口 1234），装了没开服务会显示「已安装，服务未运行」。服务正常仍失败时检查地址端口是否被改过，再重试拉取。

### 一键安装失败/下载不动？

安装走官方源（ollama.com、Homebrew、winget、npm），国内网络可能直连失败——失败信息里附了官方手动下载页，手动安装后点「重新检测」即可；Codex CLI 的 npm 安装失败会自动换 npmmirror 镜像重试一次。

## 更多操作细节

第 1 步 · 打开「本地与自建」分组

1. 主页左下角账号行齿轮「设置」＞「模型设置」，左栏目录展开「本地与自建」组，共 9 家：Ollama、Codex（本地 CLI）、LM Studio、Xinference、One API、New API、FastChat / vLLM、GPUStack、自定义 OpenAI 兼容。其中 7 家本地服务族（Ollama、LM Studio、Xinference、One API、New API、FastChat / vLLM、GPUStack）带「无需 Key」「免费」徽标（One API/New API/GPUStack 无默认地址，需手填）；Codex（本地 CLI）复用本机 CLI 登录、标「免费」；「自定义 OpenAI 兼容」是万能兜底入口，通常指向需要密钥的远端网关，不标「无需 Key」。

## 更多操作细节

验证

1. 浏览器或终端访问 http://127.0.0.1:11434/api/version（Ollama）应返回版本信息——与状态卡绿点「本地服务运行中」等价。
2. 设置里该厂商已出现在「已启用」组，展开能看到勾选的模型 id。
3. AI 面板模型选择器出现本地模型；发一句话，回复正常且断网后依然可用。
4. 「默认模型」区对话默认显示「厂商名 · 模型 id」或「当前自动使用：…」指向本地模型。

## 补充答疑

### 内网网关怎么接？

选 One API、New API、GPUStack（或「自定义 OpenAI 兼容」），API 地址填内网可达地址（如 http://192.168.x.x:3000/v1），按网关要求填 Key，拉取列表后勾选启用。客户端只在列表接口与对话请求两处访问该地址。

### 本地模型能用于生图/语音这些能力吗？

能挂上，按模型类型自动归类（对话/视觉/向量/生图/视频生成/语音合成/语音识别等，按模型 id 推断类型）；能力是否可用取决于模型本身——例如语音识别需要端点提供转写 API（OpenAI 兼容 /audio/transcriptions 或 Gemini inline），本地 Ollama 暂无此类端点时该能力不可选。

## 动手前再核对一遍

- 二选一：本机已有本地推理服务（没有可用设置页一键安装，见第 2 步）；或内网可达的自建网关地址。
- 本地服务里至少已拉好一个模型（如 ollama pull qwen3）——Office 只列服务端已有的模型，不代下模型权重。
- 离线使用的前提是模型已在本机/内网：断网后云端供应商不可用，本地供应商照常。

这篇把本地模型接入的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
