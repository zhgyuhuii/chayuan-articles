---
title: "技术解析：IPC schema 校验与沙箱隔离"
alt-titles: ["Electron安全｜察元Office上手笔记","关于Electron安全，看这一篇就够（察元AI Office）"]
description: "Electron安全相关指南：察元AI Office（https://aidooo.com）。IPC schema 校验与沙箱隔离。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Electron安全","察元AI Office","技术解析"]
product: chayuan-office
category: "07-技术解析"
primary_keyword: "Electron安全"
channel: "CSDN/掘金/知乎"
---
# 技术解析：IPC schema 校验与沙箱隔离

这是「察元Office技术解析」系列的一篇。IPC schema 校验与沙箱隔离是理解这款产品设计哲学的关键切面——看完你会明白它为什么这样设计、这样设计换来了什么、代价是什么。

## 一句话结论

桌面壳的安全姿态：全窗口 contextIsolation + sandbox + nodeIntegration:false，进程间通信走 IPC schema 校验（消息结构不符即拒收），外链协议白名单，无硬编码密钥；幻灯片的 AI 布局脚本走受限 AST 解释器执行而非 eval。

## 为什么这样设计

这个设计的动机可以概括为三点：把风险控制在机制而不是纪律里（靠制度约束人的行为总会失效，靠架构约束才稳定）；把复杂度封装起来（用户不需要理解内部实现，只需要理解行为边界）；把可验证性留给用户（声明的能力都能在产品里实际验证）。软件工程里没有免费的设计——每一条这样的取舍都是在「体验、安全、性能、成本」之间做的显式权衡，约束变了，结论就可能反转。

## 对使用者意味着什么

- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 相关能力以官网 https://aidooo.com 最新版本为准

## 动手验证

1. 带着本文结论去产品里找到对应入口
2. 构造一个最小场景验证行为是否符合描述
3. 观察边界情况的表现（断网、权限、并发）
4. 把验证结论沉淀进团队内部文档

## 离线运行与部署形态

AI 能力按需联网：内置十余家模型供应商接入（Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter 等），也支持任意 OpenAI 兼容端点——包括 Ollama 等本地模型服务，配置后即可断网使用 AI；不配置模型时，编辑、转换、批注、导出 PDF 等全部传统办公功能照常可用。

## 数据安全与隐私边界

- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### 数据存在哪里？隐私如何？

文档保存在本机（默认「文稿/ChayuanAIOffice」）；官方包默认匿名统计且可一键关闭，不收集文档内容、文件名、路径与身份。

### AI 功能需要联网吗？

AI 需要配置模型：云端供应商（DeepSeek、Kimi、GLM、Qwen 等）需联网；配 Ollama 等本地端点则断网可用。编辑、转换、导出等传统功能始终离线可用。

### 真的免费吗？

代码开源免费、可自行构建；官方安装包 90 天试用后仅每日温和提醒，不锁功能；购买授权属于支持开发，且购察元AI OS 后 Office 免激活。


## 相关阅读

- [六段版本号的语义（原理解析）](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-c0417fd8.md)
- [开源 Apache-2.0 与企业模块例外：察元Office的原理解析](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-206-apache-2-0.md)
- [察元Office架构课｜PDFium wasm：真文本编辑的秘密](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-2-pdfium-2.md)
- [⭐Markdown 编辑器隐藏用法｜Markdown编辑器一次讲清](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-106-markdown.md)
- [MCP办公全解析：智能体操作 Office 文件。](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-34-mcp.md)
- [察元AI OS｜壁纸库与主题进阶技巧：从入口到完成的完整流程](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-2-wallpaper-3.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Electron安全｜察元Office上手笔记》《关于Electron安全，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
