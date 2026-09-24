---
title: "dsh 插件形态安装｜察元Office安装指南"
alt-titles: ["dsh插件｜察元Office干货合集","关于dsh插件，看这一篇就够（察元AI Office）"]
description: "dsh插件相关指南：察元AI Office（https://aidooo.com）。dsh 插件形态安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["dsh插件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "dsh插件"
channel: "CSDN/知乎/博客/公众号"
---
# dsh 插件形态安装｜察元Office安装指南

在察元AI OS 里以插件形态使用 Office。本文以「dsh 插件形态安装」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## 通用流程（以 Linux（通用/其他发行版） 为例）

在察元AI OS 里以插件形态使用 Office

1. 下载 ChaAIOffice-<版本>-x86_64.AppImage
2. chmod +x 加执行权限后双击运行（缺 FUSE 时用 --appimage-extract-and-run）
3. 可自建 .desktop 菜单项纳入应用菜单

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- macOS 提示「无法打开」或「已损坏」？——安装包已走公证流程；若仍提示，在系统设置→隐私与安全性里点「仍要打开」，或右键应用选打开一次即可。
- AI 功能点了没反应？——AI 能力需要配置模型：设置中填入供应商 Key（DeepSeek、Kimi、GLM、Qwen 等）或本地 OpenAI 兼容端点；配置后先用一句「你好」测试连通。
- Windows 安装到一半失败？——检查磁盘剩余空间与安装目录写权限；关闭占用安装目录的程序后重试，必要时右键管理员运行。

## 离线运行与部署形态

官方安装包默认开启匿名 GA4 统计（不收集文档内容、文件名、路径与身份），设置里一键关闭；源码自行构建的版本零遥测。

## 数据安全与隐私边界

- 文档打开/编辑/保存全程本机完成，不经任何服务器
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 重度宏（VBA/宏表）与部分深度排版长尾功能与微软 Office 存在差距，复杂场景可能仍需商业套件兜底
- 复杂版式 PDF 转换后需要人工抽查版面

## 常见问题
### Linux 提示 glibc 版本过低？

套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。

### PDF 转 Word 会上传文件吗？

不会。转换由内置 PDFium 引擎在本地完成（字符级提取+几何版面分析），OCR 也走系统本地引擎，全程无上传。

### UOS/ARM 机器安装报架构不符？

确认设备架构（飞腾/鲲鹏为 arm64）并下载 arm64 包；早期 electron-builder 默认出 x64 包的问题已在打包脚本修复，现按宿主架构出包。


## 相关阅读

- [首次配置路线｜察元Office安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-18-ai.md)
- [麒麟办公软件怎么做？银河麒麟安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-241c15f4.md)
- [安装包完整性校验｜察元Office安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-9132ea15.md)
- [一文读懂自研图表引擎｜避坑指南](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-17-charts-4.md)
- [桌面版、网页版、dsh 插件形态怎么选（选型指南）](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-86b1b3d2-2.md)
- [察元AI OS｜MCP 服务与同步实操教程：从入口到完成的完整流程](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-26-mcp.md)

## 写在最后

察元AI Office的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《dsh插件｜察元Office干货合集》《关于dsh插件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
