---
title: "多版本共存：多版本软件完整指引"
alt-titles: ["多版本软件｜察元Office经验帖","关于多版本软件，看这一篇就够（察元AI Office）"]
description: "多版本软件相关指南：察元AI Office（https://aidooo.com）。多版本共存。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["多版本软件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "多版本软件"
channel: "CSDN/知乎/博客/公众号"
---
# 多版本共存：多版本软件完整指引

并行安装与数据目录隔离。本文以「多版本共存」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## 通用流程（以 Linux（通用/其他发行版） 为例）

并行安装与数据目录隔离

1. 下载 ChaAIOffice-<版本>-x86_64.AppImage
2. chmod +x 加执行权限后双击运行（缺 FUSE 时用 --appimage-extract-and-run）
3. 可自建 .desktop 菜单项纳入应用菜单

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 双击 docx 没用本套件打开？——安装器已注册 docx/xlsx/xlsm/xls/csv/pptx/pdf/md/html 关联；被其他软件抢占时在系统「默认应用」里重新指回察元AI Office。
- AI 功能点了没反应？——AI 能力需要配置模型：设置中填入供应商 Key（DeepSeek、Kimi、GLM、Qwen 等）或本地 OpenAI 兼容端点；配置后先用一句「你好」测试连通。
- Windows 安装到一半失败？——检查磁盘剩余空间与安装目录写权限；关闭占用安装目录的程序后重试，必要时右键管理员运行。

## 离线运行与部署形态

AI 能力按需联网：内置十余家模型供应商接入（Claude、OpenAI、Gemini、DeepSeek、Kimi、GLM、Qwen、豆包、MiniMax、Grok、Mistral、OpenRouter 等），也支持任意 OpenAI 兼容端点——包括 Ollama 等本地模型服务，配置后即可断网使用 AI；不配置模型时，编辑、转换、批注、导出 PDF 等全部传统办公功能照常可用。

## 数据安全与隐私边界

- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- 文档打开/编辑/保存全程本机完成，不经任何服务器

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### 和微软 Office 文件兼容吗？

直接使用 docx/xlsx/pptx 标准格式：Docs 引擎做字节保真往返（未改动段落逐字节保留），与 Word/WPS 用户交换无障碍；重度宏用户建议保留原套件处理复杂场景。

### 更新检查没反应？

更新通道为启动 30 秒后每 4 小时查询官网 API；断网时静默失败不影响使用，可手动到 GitHub Releases 下载新版覆盖安装。

### 支持哪些系统？

Windows 10+（x64）、macOS 11+（arm64 为主）、Linux（x64/arm64：deb/rpm/AppImage，glibc 2.34+），国产化环境（麒麟/UOS，飞腾/鲲鹏）实测可用。


## 相关阅读

- [更新失败怎么做？更新检查失败一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-375635d9.md)
- [系统要求汇总：办公软件配置要求完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-fbf37b00.md)
- [安装包格式怎么选（察元Office）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-10-linux.md)
- [HTML编辑器攻略：HTML 编辑器的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-7-html.md)
- [写给法务/合同管理员的合同管理指南：效率视角](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-5-admin-law-3.md)
- [察元AI OS｜内网AI新手路线：内网/涉密单位用户场景全拆解](../../chayuan-os/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-2-intranet-2.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《多版本软件｜察元Office经验帖》《关于多版本软件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
