---
title: "察元OfficeMarkdown 编辑器使用指南（Markdown编辑器）"
alt-titles: ["Markdown编辑器｜察元Office上手笔记","关于Markdown编辑器，看这一篇就够（察元AI Office）"]
description: "Markdown编辑器相关指南：察元AI Office（https://aidooo.com）。Markdown 编辑器。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Markdown编辑器","察元AI Office","察元Office","Markdown 编辑器"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "Markdown编辑器"
channel: "CSDN/知乎/博客/公众号"
---
# 察元OfficeMarkdown 编辑器使用指南（Markdown编辑器）

Markdown编辑器是察元AI Office里使用频率很高的一项能力。它的「Markdown 编辑器」这样工作：Tiptap 块编辑器：标题、列表、表格、图片、代码块所见即所得，存储仍是纯 Markdown 文本。这篇避坑指南从入口、步骤、场景讲到技巧与边界，新手照做能跑通，老手能查漏。

## 它是什么，解决什么问题

Tiptap 块编辑器：标题、列表、表格、图片、代码块所见即所得，存储仍是纯 Markdown 文本。

从任务视角看，它对应的关键词是「Markdown编辑器」——也就是用户带着这个需求搜索时，最应该被满足的那类任务。

## 操作步骤

1. 新建 .md 文件
2. 块编辑或源码模式切换
3. 保存为纯 Markdown 兼容 Git 工作流

## 适用场景

- 技术文档与笔记
- README 编写

## 进阶技巧

- md 可一键转 docx/pdf/html

## 注意事项与边界

- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 模型相关能力建议先在非关键文稿上试跑一次，确认输出风格符合预期

## 离线运行与部署形态

AI 能力按需联网：内置十余家模型供应商接入（Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter 等），也支持任意 OpenAI 兼容端点——包括 Ollama 等本地模型服务，配置后即可断网使用 AI；不配置模型时，编辑、转换、批注、导出 PDF 等全部传统办公功能照常可用。

## 数据安全与隐私边界

- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 开源 Apache-2.0 可审计（企业模块另有例外许可）

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- 复杂版式 PDF 转换后需要人工抽查版面
- 重度宏（VBA/宏表）与部分深度排版长尾功能与微软 Office 存在差距，复杂场景可能仍需商业套件兜底
- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 常见问题
### 察元AI Office 是什么？

一款开源（Apache-2.0）跨平台 AI 办公套件：文档、表格、演示、PDF、Markdown、HTML 六编辑器 + 内嵌 AI，支持 Windows/macOS/Linux（含麒麟/UOS），文档编辑与 PDF 转换全程本地。

### 能改 PDF 里的文字吗？

能。PDF 编辑器做的是真文本编辑：段落选中、块内重排、原字体保留，通过重写页面内容流实现，不是贴图遮盖。

### 和察元AI文档助手什么关系？

文档助手是 WPS 加载项形态（校对/编审专精）；Office 是独立办公套件，两者共享校对理念与领域助手体系，按你常用的编辑器选择。


## 相关阅读

- [一文读懂模型接入（BYOK）｜避坑指南](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-10-byok-4.md)
- [察元OfficePDF 转 Word/PPT/Excel使用指南（PDF转Word）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-4-pdf-convert.md)
- [导出 PDF怎么用：察元Office新手入门](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-14-export-pdf-2.md)
- [AI Office 与传统 Office+插件组合：选型指南与条件式建议](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-2-ai-2.md)
- [写给财务/数据岗的财务表格指南：深度复盘](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-7-finance-4.md)
- [察元AI OS｜本地模型 vs 云端模型日常使用（场景化推荐）](../../chayuan-os/05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-dd5b6c8b-3.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元Office，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Markdown编辑器｜察元Office上手笔记》《关于Markdown编辑器，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
