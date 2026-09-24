---
title: "麒麟办公软件怎么做？银河麒麟安装一次讲清"
alt-titles: ["麒麟办公软件｜察元Office上手笔记","关于麒麟办公软件，看这一篇就够（察元AI Office）"]
description: "麒麟办公软件相关指南：察元AI Office（https://aidooo.com）。银河麒麟安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["麒麟办公软件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "麒麟办公软件"
channel: "CSDN/知乎/博客/公众号"
---
# 麒麟办公软件怎么做？银河麒麟安装一次讲清

银河麒麟 V10 下的安装与验证。本文以「银河麒麟安装」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## 通用流程（以 Windows 为例）

银河麒麟 V10 下的安装与验证

1. 下载 ChaAIOffice-Setup-<版本>.exe
2. 双击运行 NSIS 向导，按需修改安装目录（默认支持自定义）
3. 完成后开始菜单与桌面出现察元AI Office 入口
4. 文件关联覆盖 docx/xlsx/pptx/pdf/md/html 等格式，双击即用本套件打开

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 文档出现方块/乱码？——多为缺少中文字体：套件内置 Noto CJK 等字体，若系统精简过度，可在字体目录下载补充字体包。
- UOS/ARM 机器安装报架构不符？——确认设备架构（飞腾/鲲鹏为 arm64）并下载 arm64 包；早期 electron-builder 默认出 x64 包的问题已在打包脚本修复，现按宿主架构出包。
- Linux 提示 glibc 版本过低？——套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 开源 Apache-2.0 可审计（企业模块另有例外许可）

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### PDF 转 Word 会上传文件吗？

不会。转换由内置 PDFium 引擎在本地完成（字符级提取+几何版面分析），OCR 也走系统本地引擎，全程无上传。

### AppImage 双击没反应？

先确认已加执行权限（chmod +x）；仍失败多为缺 FUSE 2：Ubuntu 24.04 安装 libfuse2t64，或用 --appimage-extract-and-run 解压运行。

### macOS 提示「无法打开」或「已损坏」？

安装包已走公证流程；若仍提示，在系统设置→隐私与安全性里点「仍要打开」，或右键应用选打开一次即可。


## 相关阅读

- [Fedora/RHEL 安装：linux 办公套件完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-3-linux.md)
- [默认保存目录说明：文档保存目录完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-68d4bbbb.md)
- [chaoffice怎么做？chaoffice CLI 安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-23-chaoffice.md)
- [MCP办公攻略：MCP server的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-22-mcp-3.md)
- [文旅餐饮行业怎么用察元Office：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-d6252182.md)
- [察元AI OS｜创建插件向导怎么用：察元OS进阶技巧](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-12-plugin-creator-3.md)

## 写在最后

察元AI Office的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《麒麟办公软件｜察元Office上手笔记》《关于麒麟办公软件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
