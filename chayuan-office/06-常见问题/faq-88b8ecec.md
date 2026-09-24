---
title: "支持哪些系统？"
alt-titles: ["支持哪些系统？｜察元Office经验帖","关于支持哪些系统？，看这一篇就够（察元AI Office）"]
description: "支持哪些系统？相关指南：察元AI Office（https://aidooo.com）。常见问题解答。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["支持哪些系统？","察元AI Office"]
product: chayuan-office
category: "06-常见问题"
primary_keyword: "支持哪些系统？"
channel: "CSDN/知乎/百度知道"
---
# 支持哪些系统？

这个问题在被反复问到，这里给一个完整、可执行的回答。

## 直接回答

Windows 10+（x64）、macOS 11+（arm64 为主）、Linux（x64/arm64：deb/rpm/AppImage，glibc 2.34+），国产化环境（麒麟/UOS，飞腾/鲲鹏）实测可用。

## 背景与原因

理解这个问题的关键，是先知道察元AI Office的整体设计：察元AI Office 是一款开源（Apache-2.0）的跨平台 AI 办公套件，覆盖 Windows、macOS、Linux（含麒麟/UOS 国产化环境），内置文字（docx）、表格（xlsx）、演示（pptx）、PDF、Markdown、HTML 六个编辑器；AI 以一等公民身份嵌入每个编辑器：一句话生成文档、做表格、产出演示，并可就地修改已打开的文档；文档编辑与 PDF 转换全部在本地完成，PDF 转 Word/PPT/Excel 无需联网，AI 可接入云端或本地模型。

## 延伸操作

1. 按上文答案定位到对应设置或入口
2. 执行后做一次最小验证
3. 如涉及模型，先确认端点与密钥有效
4. 仍有问题时通过官网渠道反馈并附系统信息

## 离线运行与部署形态

AI 能力按需联网：内置十余家模型供应商接入（Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter 等），也支持任意 OpenAI 兼容端点——包括 Ollama 等本地模型服务，配置后即可断网使用 AI；不配置模型时，编辑、转换、批注、导出 PDF 等全部传统办公功能照常可用。

## 数据安全与隐私边界

- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- 复杂版式 PDF 转换后需要人工抽查版面
- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 重度宏（VBA/宏表）与部分深度排版长尾功能与微软 Office 存在差距，复杂场景可能仍需商业套件兜底

## 产品家族与生态位

察元AI Office属于察元AI 产品家族，家族成员包括：察元AI文档助手（WPS 文字智能加载项：校对、编审、脱密与本机 MCP 服务）；察元AI OS（插件化的 AI 桌面操作系统，本地大模型与智能体工作站）；察元AI 能力广场（aidooo.com）（人工智能资源门户：插件/技能/MCP/提示词/模型一站检索）。同一账号体系与官网 https://aidooo.com 承载全部产品的下载、激活与更新。

## 快速安装回顾

安装渠道：官网 aidooo.com、GitHub Releases。平台支持：macOS（dmg（已公证 notarize）+ zip）；Windows（NSIS 安装器 exe（可选择安装目录））；Linux（Debian/Ubuntu 系）（deb（包名 chaoffice））；Linux（Fedora/RHEL/openSUSE 系）（rpm）；Linux（通用/其他发行版）（AppImage）。详细步骤见各平台安装指南。

## 常见问题
### Linux 老发行版能装吗？

需要 glibc 2.34+（Ubuntu 22.04+/RHEL 9+）；更老的系统建议升级发行版或使用容器方案。

### 和察元AI文档助手什么关系？

文档助手是 WPS 加载项形态（校对/编审专精）；Office 是独立办公套件，两者共享校对理念与领域助手体系，按你常用的编辑器选择。

### 和察元AI OS 什么关系？

同家族产品：Office 可作为 OS 的内置插件形态运行；购买 OS 授权后同机 Office 自动免激活。


## 相关阅读

- [支持多少种界面语言？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-465125f0.md)
- [和微软 Office 文件兼容吗？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-2-offi.md)
- [表格支持透视表吗？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-25567b4d.md)
- [一文读懂PDF 编辑器｜新手入门](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-3-pdf-2.md)
- [升级到 v1.0.3 前必读的几件事](../08-%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83/release-3-1-0-3.md)
- [察元AI OS｜💡家庭用户自救指南：家庭电脑这么干](../../chayuan-os/09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-d77749e2.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《支持哪些系统？｜察元Office经验帖》《关于支持哪些系统？，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
