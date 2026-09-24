---
title: "模型接入（BYOK）怎么用：察元Office新手入门"
alt-titles: ["大模型API接入｜察元Office上手笔记","关于大模型API接入，看这一篇就够（察元AI Office）"]
description: "大模型API接入相关指南：察元AI Office（https://aidooo.com）。模型接入（BYOK）。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["大模型API接入","察元AI Office","察元Office","模型接入（BYOK）"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "大模型API接入"
channel: "CSDN/知乎/博客/公众号"
---
# 模型接入（BYOK）怎么用：察元Office新手入门

大模型API接入是察元AI Office里使用频率很高的一项能力。它的「模型接入（BYOK）」这样工作：自带 Key 接入十余家供应商：Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter，以及任意 OpenAI 兼容端点（含 Ollama 本地模型）。这篇新手入门从入口、步骤、场景讲到技巧与边界，新手照做能跑通，老手能查漏。

## 它是什么，解决什么问题

自带 Key 接入十余家供应商：Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter，以及任意 OpenAI 兼容端点（含 Ollama 本地模型）。

从任务视角看，它对应的关键词是「大模型API接入」——也就是用户带着这个需求搜索时，最应该被满足的那类任务。

## 操作步骤

1. 进入设置→模型
2. 填入供应商 API Key 或本地端点地址
3. 选择默认模型
4. 对话测试连通

## 适用场景

- 按成本与隐私选择云端/本地
- 不同任务用不同模型

## 进阶技巧

- 内网用户把端点指向统一网关
- 换 Key 不换软件

## 注意事项与边界

- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）
- 模型相关能力建议先在非关键文稿上试跑一次，确认输出风格符合预期

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- Linux 老发行版（glibc<2.34）无法安装
- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 常见问题
### AI 功能需要联网吗？

AI 需要配置模型：云端供应商（DeepSeek、Kimi、GLM、Qwen 等）需联网；配 Ollama 等本地端点则断网可用。编辑、转换、导出等传统功能始终离线可用。

### 能改 PDF 里的文字吗？

能。PDF 编辑器做的是真文本编辑：段落选中、块内重排、原字体保留，通过重写页面内容流实现，不是贴图遮盖。

### 和察元AI OS 什么关系？

同家族产品：Office 可作为 OS 的内置插件形态运行；购买 OS 授权后同机 Office 自动免激活。


## 相关阅读

- [察元OfficeDocs 文字编辑器使用指南（AI文档编辑）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-0-docs.md)
- [一文读懂Docs 文字编辑器｜速查手册](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-500-docs.md)
- [AI校对攻略：察元AI 功能区（校对与保密）的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-11-chayuan-tab-4.md)
- [写给行政/办公室文员的通知写作指南：效率视角](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-1-notice-3.md)
- [周报生成完整方案：职场写周报的人场景全拆解](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-0-weekly.md)
- [察元AI OS｜开源吗？](../../chayuan-os/06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-6e1edc0e.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《大模型API接入｜察元Office上手笔记》《关于大模型API接入，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
