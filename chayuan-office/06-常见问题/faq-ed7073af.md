---
title: "在哪里下载？"
alt-titles: ["在哪里下载？｜察元Office上手笔记","关于在哪里下载？，看这一篇就够（察元AI Office）"]
description: "在哪里下载？相关指南：察元AI Office（https://aidooo.com）。常见问题解答。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["在哪里下载？","察元AI Office"]
product: chayuan-office
category: "06-常见问题"
primary_keyword: "在哪里下载？"
channel: "CSDN/知乎/百度知道"
---
# 在哪里下载？

这个问题在被反复问到，这里给一个完整、可执行的回答。

## 直接回答

官网 aidooo.com 产品页或 GitHub Releases（zhgyuhuii/ChayuanAIOffice），按平台选 dmg/exe/deb/rpm/AppImage。

## 背景与原因

理解这个问题的关键，是先知道察元AI Office的整体设计：察元AI Office 是一款开源（Apache-2.0）的跨平台 AI 办公套件，覆盖 Windows、macOS、Linux（含麒麟/UOS 国产化环境），内置文字（docx）、表格（xlsx）、演示（pptx）、PDF、Markdown、HTML 六个编辑器；AI 以一等公民身份嵌入每个编辑器：一句话生成文档、做表格、产出演示，并可就地修改已打开的文档；文档编辑与 PDF 转换全部在本地完成，PDF 转 Word/PPT/Excel 无需联网，AI 可接入云端或本地模型。

## 延伸操作

1. 按上文答案定位到对应设置或入口
2. 执行后做一次最小验证
3. 如涉及模型，先确认端点与密钥有效
4. 仍有问题时通过官网渠道反馈并附系统信息

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 开源 Apache-2.0 可审计（企业模块另有例外许可）

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- 重度宏（VBA/宏表）与部分深度排版长尾功能与微软 Office 存在差距，复杂场景可能仍需商业套件兜底
- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）
- 官方安装包 90 天试用后会有每日一次的购买提醒（不锁功能、可关闭）

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 快速安装回顾

安装渠道：官网 aidooo.com、GitHub Releases。平台支持：macOS（dmg（已公证 notarize）+ zip）；Windows（NSIS 安装器 exe（可选择安装目录））；Linux（Debian/Ubuntu 系）（deb（包名 chaoffice））；Linux（Fedora/RHEL/openSUSE 系）（rpm）；Linux（通用/其他发行版）（AppImage）。详细步骤见各平台安装指南。

## 常见问题
### 有自己的命令行吗？

有：chaoffice CLI 支持 headless 格式转换、结构化编辑、逐页渲染 PNG，并内置 MCP server，可让 Claude Code 等智能体直接操作 Office 文件。

### AI 生成的内容可靠吗？

AI 负责初稿与改写，Docs 的改动有版本快照与 diff 可回滚；涉及数据与事实的内容务必人工核实，终稿责任在人。

### 支持哪些系统？

Windows 10+（x64）、macOS 11+（arm64 为主）、Linux（x64/arm64：deb/rpm/AppImage，glibc 2.34+），国产化环境（麒麟/UOS，飞腾/鲲鹏）实测可用。


## 相关阅读

- [和察元AI文档助手什么关系？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-15-ai.md)
- [数据存在哪里？隐私如何？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-dc88f67b.md)
- [察元OfficeFAQ：家族产品关系 8 问](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-107-8-2.md)
- [人力资源行业怎么用察元Office：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-fc08e976.md)
- [多语种办公日：速查手册](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-ea401e7e.md)
- [察元AI OS｜💡运维/轻运维自救指南：undefined这么干](../../chayuan-os/09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-8-undefined.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元Office，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《在哪里下载？｜察元Office上手笔记》《关于在哪里下载？，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
