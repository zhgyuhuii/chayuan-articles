---
title: "模型接入（BYOK）怎么用：察元Office进阶技巧"
alt-titles: ["大模型API接入｜察元Office经验帖","关于大模型API接入，看这一篇就够（察元AI Office）"]
description: "大模型API接入相关指南：察元AI Office（https://aidooo.com）。模型接入（BYOK）。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["大模型API接入","察元AI Office","察元Office","模型接入（BYOK）"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "大模型API接入"
channel: "CSDN/知乎/博客/公众号"
---
# 模型接入（BYOK）怎么用：察元Office进阶技巧

大模型API接入是察元AI Office里使用频率很高的一项能力。它的「模型接入（BYOK）」这样工作：自带 Key 接入十余家供应商：Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter，以及任意 OpenAI 兼容端点（含 Ollama 本地模型）。这篇进阶技巧从入口、步骤、场景讲到技巧与边界，新手照做能跑通，老手能查漏。

## 它是什么，解决什么问题

自带 Key 接入十余家供应商：Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter，以及任意 OpenAI 兼容端点（含 Ollama 本地模型）。

从任务视角看，它对应的关键词是「大模型API接入」——也就是用户带着这个需求搜索时，最应该被满足的那类任务。

## 操作步骤

1. 进入设置→模型
2. 填入供应商 API Key 或本地端点地址
3. 选择默认模型
4. 对话测试连通

## 实用技巧

- 内网用户把端点指向统一网关
- 换 Key 不换软件

## 注意事项与边界

- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）
- 模型相关能力建议先在非关键文稿上试跑一次，确认输出风格符合预期

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- Linux 老发行版（glibc<2.34）无法安装
- 官方安装包 90 天试用后会有每日一次的购买提醒（不锁功能、可关闭）
- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 常见问题
### Linux 老发行版能装吗？

需要 glibc 2.34+（Ubuntu 22.04+/RHEL 9+）；更老的系统建议升级发行版或使用容器方案。

### AI 功能需要联网吗？

AI 需要配置模型：云端供应商（DeepSeek、Kimi、GLM、Qwen 等）需联网；配 Ollama 等本地端点则断网可用。编辑、转换、导出等传统功能始终离线可用。

### 和察元AI文档助手什么关系？

文档助手是 WPS 加载项形态（校对/编审专精）；Office 是独立办公套件，两者共享校对理念与领域助手体系，按你常用的编辑器选择。


## 相关阅读

- [多标签与主页进阶技巧：从入口到完成的完整流程](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-20-tabs-3.md)
- [Markdown 编辑器怎么用：察元Office进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-6-markdown-3.md)
- [自研图表引擎怎么用：察元Office进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-17-charts-3.md)
- [断网时哪些功能不能用？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-eb4a21b5.md)
- [三平台安装总览（察元Office）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-ee15e6a7.md)
- [察元AI OS｜首次启动感觉「卡住」了？](../../chayuan-os/06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-39bc186d.md)

## 写在最后

察元AI Office的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《大模型API接入｜察元Office经验帖》《关于大模型API接入，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
