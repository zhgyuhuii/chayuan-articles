---
title: "察元Office架构课｜IPC schema 校验与沙箱隔离"
alt-titles: ["Electron安全｜察元Office经验帖","关于Electron安全，看这一篇就够（察元AI Office）"]
description: "Electron安全相关指南：察元AI Office（https://aidooo.com）。IPC schema 校验与沙箱隔离。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Electron安全","察元AI Office","技术解析"]
product: chayuan-office
category: "07-技术解析"
primary_keyword: "Electron安全"
channel: "CSDN/掘金/知乎"
---
# 察元Office架构课｜IPC schema 校验与沙箱隔离

这是「察元Office技术解析」系列的一篇。IPC schema 校验与沙箱隔离是理解这款产品设计哲学的关键切面——看完你会明白它为什么这样设计、这样设计换来了什么、代价是什么。

## 一句话结论

桌面壳的安全姿态：全窗口 contextIsolation + sandbox + nodeIntegration:false，进程间通信走 IPC schema 校验（消息结构不符即拒收），外链协议白名单，无硬编码密钥；幻灯片的 AI 布局脚本走受限 AST 解释器执行而非 eval。

## 为什么这样设计

这个设计的动机可以概括为三点：把风险控制在机制而不是纪律里（靠制度约束人的行为总会失效，靠架构约束才稳定）；把复杂度封装起来（用户不需要理解内部实现，只需要理解行为边界）；把可验证性留给用户（声明的能力都能在产品里实际验证）。软件工程里没有免费的设计——每一条这样的取舍都是在「体验、安全、性能、成本」之间做的显式权衡，约束变了，结论就可能反转。

## 对使用者意味着什么

- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 相关能力以官网 https://aidooo.com 最新版本为准

## 动手验证

1. 带着本文结论去产品里找到对应入口
2. 构造一个最小场景验证行为是否符合描述
3. 观察边界情况的表现（断网、权限、并发）
4. 把验证结论沉淀进团队内部文档

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 文档打开/编辑/保存全程本机完成，不经任何服务器

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### 在哪里下载？

官网 aidooo.com 产品页或 GitHub Releases（zhgyuhuii/ChayuanAIOffice），按平台选 dmg/exe/deb/rpm/AppImage。

### 和微软 Office 文件兼容吗？

直接使用 docx/xlsx/pptx 标准格式：Docs 引擎做字节保真往返（未改动段落逐字节保留），与 Word/WPS 用户交换无障碍；重度宏用户建议保留原套件处理复杂场景。

### 文件被其他程序抢关联了怎么办？

在系统「默认应用」设置里把 docx/xlsx/pptx/pdf 指回察元AI Office 即可。


## 相关阅读

- [察元Office架构课｜Rust sidecar：表格引擎为什么用 Rust](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-1-rust-2.md)
- [版本节奏与上游同步：察元Office的实操要点](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-205-2.md)
- [离线优先的架构取舍：察元Office的原理解析](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-200-2.md)
- [文旅餐饮行业怎么用察元Office：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-d6252182.md)
- [察元OfficeMarkdown 编辑器使用指南（Markdown编辑器）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-6-markdown-4.md)
- [察元AI OS｜Dock 与窗口管理新手入门：从入口到完成的完整流程](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-3-dock-2.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Electron安全｜察元Office经验帖》《关于Electron安全，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
