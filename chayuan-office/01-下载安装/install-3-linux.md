---
title: "Fedora/RHEL 安装：linux 办公套件完整指引"
alt-titles: ["linux 办公套件｜察元Office经验帖","关于linux 办公套件，看这一篇就够（察元AI Office）"]
description: "linux 办公套件相关指南：察元AI Office（https://aidooo.com）。Fedora/RHEL 安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["linux 办公套件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "linux 办公套件"
channel: "CSDN/知乎/博客/公众号"
---
# Fedora/RHEL 安装：linux 办公套件完整指引

dnf/zypper 安装 rpm 包。本文以「Fedora/RHEL 安装」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## Linux（Fedora/RHEL/openSUSE 系） 安装步骤（rpm）

系统要求：glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）。rpm 目标需系统有 rpm 打包工具链，安装本身无额外依赖

1. 下载 ChaAIOffice-<版本>-x86_64.rpm
2. 执行 sudo dnf install（或 zypper install）安装
3. 应用菜单启动，文件关联同 deb 版

## 安装后怎么验证

1. 重启宿主程序，确认功能入口已出现（Linux（Fedora/RHEL/openSUSE 系） 环境）
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 文档出现方块/乱码？——多为缺少中文字体：套件内置 Noto CJK 等字体，若系统精简过度，可在字体目录下载补充字体包。
- UOS/ARM 机器安装报架构不符？——确认设备架构（飞腾/鲲鹏为 arm64）并下载 arm64 包；早期 electron-builder 默认出 x64 包的问题已在打包脚本修复，现按宿主架构出包。
- 更新检查没反应？——更新通道为启动 30 秒后每 4 小时查询官网 API；断网时静默失败不影响使用，可手动到 GitHub Releases 下载新版覆盖安装。

## 离线运行与部署形态

官方安装包默认开启匿名 GA4 统计（不收集文档内容、文件名、路径与身份），设置里一键关闭；源码自行构建的版本零遥测。

## 数据安全与隐私边界

- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 文档打开/编辑/保存全程本机完成，不经任何服务器

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- Linux 老发行版（glibc<2.34）无法安装
- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）

## 常见问题
### PDF 转 Word 会上传文件吗？

不会。转换由内置 PDFium 引擎在本地完成（字符级提取+几何版面分析），OCR 也走系统本地引擎，全程无上传。

### Linux 提示 glibc 版本过低？

套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。

### UOS/ARM 机器安装报架构不符？

确认设备架构（飞腾/鲲鹏为 arm64）并下载 arm64 包；早期 electron-builder 默认出 x64 包的问题已在打包脚本修复，现按宿主架构出包。


## 相关阅读

- [字体缺失怎么做？字体缺失方块字一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-dcf7850a.md)
- [系统要求汇总：办公软件配置要求完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-fbf37b00.md)
- [双系统文件互访｜察元Office安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-85576037.md)
- [导出PDF攻略：导出 PDF的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-14-export-pdf-3.md)
- [财务表格新手路线：财务/数据岗场景全拆解](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-7-finance-2.md)
- [察元AI OS｜技能商店攻略：技能页签与技能商店的关键点拆解](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-10-skills-2.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《linux 办公套件｜察元Office经验帖》《关于linux 办公套件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
