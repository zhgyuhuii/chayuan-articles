---
title: "arm64 办公软件怎么做？arm64 设备安装（飞腾/鲲鹏）一次讲清"
alt-titles: ["arm64 办公软件｜察元Office上手笔记","关于arm64 办公软件，看这一篇就够（察元AI Office）"]
description: "arm64 办公软件相关指南：察元AI Office（https://aidooo.com）。arm64 设备安装（飞腾/鲲鹏）。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["arm64 办公软件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "arm64 办公软件"
channel: "CSDN/知乎/博客/公众号"
---
# arm64 办公软件怎么做？arm64 设备安装（飞腾/鲲鹏）一次讲清

国产化硬件选 arm64 包的判断与安装。本文以「arm64 设备安装（飞腾/鲲鹏）」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## 通用流程（以 macOS 为例）

国产化硬件选 arm64 包的判断与安装

1. 从 GitHub Releases 下载 ChaAIOffice-<版本>-arm64.dmg
2. 双击打开 dmg，将察元AI Office 拖入「应用程序」文件夹
3. 首次启动如遇安全提示，系统已公证的情况下直接打开即可
4. 启动后在首页选择新建文档/表格/演示或直接对话生成

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 文档出现方块/乱码？——多为缺少中文字体：套件内置 Noto CJK 等字体，若系统精简过度，可在字体目录下载补充字体包。
- AI 功能点了没反应？——AI 能力需要配置模型：设置中填入供应商 Key（DeepSeek、Kimi、GLM、Qwen 等）或本地 OpenAI 兼容端点；配置后先用一句「你好」测试连通。
- 更新检查没反应？——更新通道为启动 30 秒后每 4 小时查询官网 API；断网时静默失败不影响使用，可手动到 GitHub Releases 下载新版覆盖安装。

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 开源 Apache-2.0 可审计（企业模块另有例外许可）

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### 和微软 Office 文件兼容吗？

直接使用 docx/xlsx/pptx 标准格式：Docs 引擎做字节保真往返（未改动段落逐字节保留），与 Word/WPS 用户交换无障碍；重度宏用户建议保留原套件处理复杂场景。

### PDF 转 Word 会上传文件吗？

不会。转换由内置 PDFium 引擎在本地完成（字符级提取+几何版面分析），OCR 也走系统本地引擎，全程无上传。

### 察元AI Office 是什么？

一款开源（Apache-2.0）跨平台 AI 办公套件：文档、表格、演示、PDF、Markdown、HTML 六编辑器 + 内嵌 AI，支持 Windows/macOS/Linux（含麒麟/UOS），文档编辑与 PDF 转换全程本地。


## 相关阅读

- [在线办公部署怎么做？Docker 网页版部署一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-0ebc8778.md)
- [首次配置路线｜察元Office安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-18-ai.md)
- [多版本共存：多版本软件完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-67e08a47.md)
- [🧩察元AI 功能区（校对与保密）隐藏用法｜AI校对一次讲清](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-111-ai.md)
- [写给大学生/研究生的学生办公软件指南：效率视角](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-4-student-3.md)
- [察元AI OS｜插件页签（三源）避坑指南：从入口到完成的完整流程](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-11-plugins-4.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《arm64 办公软件｜察元Office上手笔记》《关于arm64 办公软件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
