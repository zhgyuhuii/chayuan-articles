---
title: "Linux 提示 glibc 版本过低？"
alt-titles: ["Linux 提示 gli｜察元Office经验帖","关于Linux 提示 gli，看这一篇就够（察元AI Office）"]
description: "Linux 提示 g相关指南：察元AI Office（https://aidooo.com）。常见问题解答。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Linux 提示 gli","察元AI Office"]
product: chayuan-office
category: "06-常见问题"
primary_keyword: "Linux 提示 gli"
channel: "CSDN/知乎/百度知道"
---
# Linux 提示 glibc 版本过低？

这个问题在被反复问到，这里给一个完整、可执行的回答。

## 直接回答

套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。

## 背景与原因

理解这个问题的关键，是先知道察元AI Office的整体设计：察元AI Office 是一款开源（Apache-2.0）的跨平台 AI 办公套件，覆盖 Windows、macOS、Linux（含麒麟/UOS 国产化环境），内置文字（docx）、表格（xlsx）、演示（pptx）、PDF、Markdown、HTML 六个编辑器；AI 以一等公民身份嵌入每个编辑器：一句话生成文档、做表格、产出演示，并可就地修改已打开的文档；文档编辑与 PDF 转换全部在本地完成，PDF 转 Word/PPT/Excel 无需联网，AI 可接入云端或本地模型。

## 延伸操作

1. 按上文答案定位到对应设置或入口
2. 执行后做一次最小验证
3. 如涉及模型，先确认端点与密钥有效
4. 仍有问题时通过官网渠道反馈并附系统信息

## 离线运行与部署形态

官方安装包默认开启匿名 GA4 统计（不收集文档内容、文件名、路径与身份），设置里一键关闭；源码自行构建的版本零遥测。

## 数据安全与隐私边界

- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 官方安装包 90 天试用后会有每日一次的购买提醒（不锁功能、可关闭）
- 复杂版式 PDF 转换后需要人工抽查版面

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 快速安装回顾

安装渠道：官网 aidooo.com、GitHub Releases。平台支持：macOS（dmg（已公证 notarize）+ zip）；Windows（NSIS 安装器 exe（可选择安装目录））；Linux（Debian/Ubuntu 系）（deb（包名 chaoffice））；Linux（Fedora/RHEL/openSUSE 系）（rpm）；Linux（通用/其他发行版）（AppImage）。详细步骤见各平台安装指南。

## 常见问题
### 低配电脑能跑吗？

常规办公 4GB 内存可用；AI 本地推理建议 16GB 内存或独立显卡跑小模型，或直接配云端 API。

### 和察元AI文档助手什么关系？

文档助手是 WPS 加载项形态（校对/编审专精）；Office 是独立办公套件，两者共享校对理念与领域助手体系，按你常用的编辑器选择。

### 在哪里下载？

官网 aidooo.com 产品页或 GitHub Releases（zhgyuhuii/ChayuanAIOffice），按平台选 dmg/exe/deb/rpm/AppImage。


## 相关阅读

- [表格支持透视表吗？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-25567b4d.md)
- [察元OfficeFAQ：授权与费用 8 问](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-104-8.md)
- [支持哪些系统？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-88b8ecec.md)
- [写给重度 PDF 用户的PDF处理指南：清单式指南](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-8-pdf-worker-5.md)
- [接入云端模型 vs 本地模型（选型指南）](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-bc5e648e-2.md)
- [察元AI OS｜MCP服务器一文讲透：是什么、怎么用、边界在哪](../../chayuan-os/00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-17-mcp.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Linux 提示 gli｜察元Office经验帖》《关于Linux 提示 gli，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
