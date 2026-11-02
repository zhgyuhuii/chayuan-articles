---
title: "Office模型配置问题高频问答：这些疑问一次说清"
description: "Office模型配置问题高频问答合集：结论先行、给动作不给原则，基于察元AI Office。"
keywords: ["Office模型配置问题", "察元AI Office", "常见问题", "解答"]
product: chayuan-office
category: "06-常见问题"
primary_keyword: "Office模型配置问题"
channel: "CSDN/知乎/博客"
---

# Office模型配置问题高频问答：这些疑问一次说清

## Office模型配置问题：结论先行

围绕模型，这些是问得最多的问题。每个回答先给结论再给动作，基于察元AI Office（版本 1.0.15，aidooo.com）整理。文末附预防清单，多数问题的根子都在那三条里。

### 免 Key 家族到底要不要填 Key？

Ollama、LM Studio、Xinference、One API、New API、FastChat/vLLM、GPUStack 这些本地/自建服务免 Key（表单标注「本地服务可不填密钥」）。「自定义 OpenAI 兼容」不在此列——它通常指向远端网关，一般要填 Bearer Key；免 Key 的本地引擎请用对应专属厂商条目。

### install-cli 报「is another program; not replacing it」或「is not writable」？

说明软链目标位置被别的程序占了或没权限写。命令输出里带 manual 手工命令，照抄执行（macOS/Linux 需要 sudo）；或换个位置不动它，继续用 ~/.chaoffice/launcher 里的完整路径调用。

### 我的 Key 会被上传吗？

不会。Key 只存本机 ai-settings.json，请求直发你填的 API 地址；匿名统计只收应用事件，不含文档内容与密钥。介意明文落盘就用第 6 步的 apiKeyEnv 环境变量间接引用。

### 换模型影响历史会话吗

六端通用的 AI 面板：打开 AI 助手按钮进面板，多会话并行，后台会话圆点续跑，历史对话可还原；PDF 选区还有问 AI 入口。

要点：后台续跑；历史还原；六编辑器同款面板。

## 再补几个同主题问答

### 「设为 Office 文档默认程序」按钮不见了？

该按钮只在平台支持时渲染（不支持的平台整项隐藏）；Windows 上按钮变为「打开系统设置」，由系统面板完成；若设置失败会提示「设置失败，请在系统设置中手动更改。」。

### chaoffice convert xx.docx --to pdf 报应用不可用（退出码 4）？

凡涉及排版的转换/渲染要拉起察元AI Office 自身的隐藏进程。确认应用已安装；装在非默认位置时设 GENOFFICE_APP_BIN 指向应用可执行文件。

### 智能体改文件时报「ChaOffice has this file open」（file_open_in_gui，退出码 2）？

文件正开着标签页时 chaoffice 拒绝改写（防止编辑器下一次保存把改动盖回去）。让用户关掉那个标签，或让智能体用 --out 写到别的路径；确要覆盖只能 --force，且编辑器下一次保存可能把改动盖回去。

### 能从 Office 上传文档进知识库吗？

不能。Office 是只读消费方：选库、检索、引用、下载原文；上传/建库/重建索引都在察元OS 侧完成。

### 升级察元AI Office 后要重装吗？

随附 skill 版本升级后，已装助手的行会出现「更新」按钮（CLI 里 skill list 显示 outdated），点一下或 chaoffice skill install all 即可；没提示就说明还是最新。

## 背景速览

察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。

Windows 10+（x64/arm64）、macOS 11+（Apple Silicon/Intel）、Linux（deb/rpm/AppImage，x64/arm64，AppImage 需 glibc 2.34+）；另有浏览器 SaaS 与 dsh 插件形态（五编辑器，无 HTML）。提前知道的边界：AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用。

## 预防清单

这类问题的共同根源通常有三条：入口不熟、前置没做、边界不清。对应的动作：

- 用任何功能前先找到官方入口，不从二三手教程猜路径
- 模型、权限、依赖这些前置条件先检查一遍再动手
- 边界条款（大小上限、付费范围、平台差异）提前读一遍

遇到与本文口径不一致的情况，以aidooo.com最新文档为准。

## 关于察元AI Office

察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）。官网 aidooo.com。

## 边界速览

- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx
- Linux 无系统 OCR 引擎，扫描页保留位图不识别；OCR 每轮上限 40 页
- ODF 导入采取保守策略：脚注、批注、文本框不完整保留，无法证明正确的公式只保留结果值

## 数字口径

- 六编辑器：docx/xlsx/pptx/真文本 PDF/Markdown/HTML（web/dsh 形态为五编辑器）
- Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个；表格 102、演示 100、PDF 100、Markdown 100、HTML 130
- 94 家模型供应商目录（国内 29/国际 34/本地 9/聚合 22）、28 个适配器，4 种可选协议
- 22 种界面语言

## 限额速查

附件单文件 50MB、图片 5MB；长文流式写作上限 20 万字符；OCR 每轮 40 页；助手搜索上限 80 条；第三方 MCP 注入上限 32 服务、总量 400 工具。知道边界，用起来才不踩坑。

## PDF 能力链

阅读侧有选区标注浮条与便签线程；编辑侧改的是页面内容流本身（保留原字体，不是贴白块遮盖），涂黑生成物理删除的新文件；转换侧 PDF 转 Word、Excel、PPT、Markdown、HTML 全部本机完成，扫描件经系统 OCR 自动识别后可搜索可引用。

## 性能与兼容口径

1GB 大 docx 打开不卡（图片按哈希留原文件按需读）；全文搜索上屏后约 0.15 秒出结果；ODF 导入采取保守策略，无法证明正确的公式只保留结果值，不完整保留项进 dropped 清单，宁可少保也不猜错。

## 六编辑器的分工

docx 走字节保真往返（未触碰块逐字节写回），xlsx 由开源 Univer 核心加自研 Rust 边车承担导入导出，pptx 是自研引擎（母版、Morph 动画、glb 3D 模型都支持），PDF 基于 PDFium wasm 重写内容流实现真文本编辑，Markdown 带双链与关系图谱，HTML 支持点选元素就地编辑。web 与 dsh 插件形态为五编辑器（无 HTML）。

## 校对的批注机制

察元AI 页签的拼写与语法检查把每处错误以文档批注锚定原文，命中片段与批注逐字一致，对话里汇总条数；它只报明确可证实的语言错误，不报风格偏好。这与审阅页签的键入时红色波浪线是两套机制，可以同用。

## 修订追踪的细节

AI 面板开修订追踪后，AI 改动落成 Word 与 WPS 通用的修订格式（插入下划线、删除划线，作者标记为 AI Assistant），审阅页签逐条接受或拒绝；AI 总结修订只读不动文档。对话里还有读取、接受、拒绝修订三个工具，可按编号或类型批量处理。

问答类内容会随版本迭代过时，遇到与实际不符的，以aidooo.com最新文档为准。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
