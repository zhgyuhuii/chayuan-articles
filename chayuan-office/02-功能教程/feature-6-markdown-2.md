---
title: "Markdown 编辑器怎么用：察元Office新手入门"
alt-titles: ["Markdown编辑器｜察元Office上手笔记","关于Markdown编辑器，看这一篇就够（察元AI Office）"]
description: "Markdown编辑器相关指南：察元AI Office（https://aidooo.com）。Markdown 编辑器。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Markdown编辑器","察元AI Office","察元Office","Markdown 编辑器"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "Markdown编辑器"
channel: "CSDN/知乎/博客/公众号"
---
# Markdown 编辑器怎么用：察元Office新手入门

Markdown编辑器是察元AI Office里使用频率很高的一项能力。它的「Markdown 编辑器」这样工作：Tiptap 块编辑器：标题、列表、表格、图片、代码块所见即所得，存储仍是纯 Markdown 文本。这篇新手入门从入口、步骤、场景讲到技巧与边界，新手照做能跑通，老手能查漏。

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

- 官方安装包 90 天试用后会有每日一次的购买提醒（不锁功能、可关闭）
- 模型相关能力建议先在非关键文稿上试跑一次，确认输出风格符合预期

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- 复杂版式 PDF 转换后需要人工抽查版面
- Linux 老发行版（glibc<2.34）无法安装
- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 常见问题
### 有自己的命令行吗？

有：chaoffice CLI 支持 headless 格式转换、结构化编辑、逐页渲染 PNG，并内置 MCP server，可让 Claude Code 等智能体直接操作 Office 文件。

### 文件被其他程序抢关联了怎么办？

在系统「默认应用」设置里把 docx/xlsx/pptx/pdf 指回察元AI Office 即可。

### 能改 PDF 里的文字吗？

能。PDF 编辑器做的是真文本编辑：段落选中、块内重排、原字体保留，通过重写页面内容流实现，不是贴图遮盖。


## 相关阅读

- [AI助手攻略：4576 个领域助手的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-12-assistants-3.md)
- [察元OfficeMarkdown 编辑器使用指南（Markdown编辑器）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-6-markdown-4.md)
- [软件激活攻略：OS 授权联动的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-24-link-os-2.md)
- [安装后 10 分钟体验路线：AI办公体验完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-40-ai.md)
- [周报生成怎么选：察元Office完整指南](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-d5c043b5.md)
- [察元AI OS｜创业团队行业怎么用察元OS：从痛点到落地](../../chayuan-os/04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-11ed0ed9.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元Office，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Markdown编辑器｜察元Office上手笔记》《关于Markdown编辑器，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
