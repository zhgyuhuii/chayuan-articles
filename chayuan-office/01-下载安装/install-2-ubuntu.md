---
title: "Ubuntu/Debian 安装：ubuntu 办公软件完整指引"
alt-titles: ["ubuntu 办公软件｜察元Office上手笔记","关于ubuntu 办公软件，看这一篇就够（察元AI Office）"]
description: "ubuntu 办公软件相关指南：察元AI Office（https://aidooo.com）。Ubuntu/Debian 安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["ubuntu 办公软件","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "ubuntu 办公软件"
channel: "CSDN/知乎/博客/公众号"
---
# Ubuntu/Debian 安装：ubuntu 办公软件完整指引

apt 一条命令装 deb 包。本文以「Ubuntu/Debian 安装」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## Linux（Debian/Ubuntu 系） 安装步骤（deb（包名 chaoffice））

系统要求：glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）。arm64 包在飞腾/鲲鹏等国产化硬件上经 UOS ARM 虚机实测打包修复

1. 下载 ChaAIOffice-<版本>-amd64.deb（arm64 设备选 arm64 包）
2. 终端执行 sudo apt install ./ChaAIOffice-*.deb（或 sudo dpkg -i 后补依赖）
3. 安装完成后在应用菜单找到察元AI Office 启动
4. deb/rpm 用户升级时手动安装新包即可，数据目录不受影响

## 安装后怎么验证

1. 重启宿主程序，确认功能入口已出现（Linux（Debian/Ubuntu 系） 环境）
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- Linux 提示 glibc 版本过低？——套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。
- 双击 docx 没用本套件打开？——安装器已注册 docx/xlsx/xlsm/xls/csv/pptx/pdf/md/html 关联；被其他软件抢占时在系统「默认应用」里重新指回察元AI Office。
- AppImage 双击没反应？——先确认已加执行权限（chmod +x）；仍失败多为缺 FUSE 2：Ubuntu 24.04 安装 libfuse2t64，或用 --appimage-extract-and-run 解压运行。

## 离线运行与部署形态

官方安装包默认开启匿名 GA4 统计（不收集文档内容、文件名、路径与身份），设置里一键关闭；源码自行构建的版本零遥测。

## 数据安全与隐私边界

- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 开源 Apache-2.0 可审计（企业模块另有例外许可）
- 安全工程：全窗口 contextIsolation + sandbox、IPC schema 校验、外链协议白名单、无硬编码密钥

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 如实说说它的不足

- AI 能力需自配模型（云端 Key 或本地端点），不配置时 AI 功能不可用
- 复杂版式 PDF 转换后需要人工抽查版面
- 网页版 SaaS 形态需要自行部署维护（Docker + 数据库）

## 常见问题
### 双击 docx 没用本套件打开？

安装器已注册 docx/xlsx/xlsm/xls/csv/pptx/pdf/md/html 关联；被其他软件抢占时在系统「默认应用」里重新指回察元AI Office。

### macOS 提示「无法打开」或「已损坏」？

安装包已走公证流程；若仍提示，在系统设置→隐私与安全性里点「仍要打开」，或右键应用选打开一次即可。

### 真的免费吗？

代码开源免费、可自行构建；官方安装包 90 天试用后仅每日温和提醒，不锁功能；购买授权属于支持开发，且购察元AI OS 后 Office 免激活。


## 相关阅读

- [安装失败怎么做？NSIS 装到一半失败一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-95aacfcd.md)
- [chaoffice怎么做？chaoffice CLI 安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-23-chaoffice.md)
- [安装包格式怎么选（察元Office）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-10-linux.md)
- [首页与搜索体验演进（察元Office演进笔记）](../08-%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83/release-302-note-2.md)
- [人力资源行业怎么用察元Office：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-fc08e976.md)
- [察元AI OS｜察元OS系统技能（chatop-system）使用指南（AI技能）（细节版）](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-9-sys-skill-3.md)

## 写在最后

察元AI Office的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《ubuntu 办公软件｜察元Office上手笔记》《关于ubuntu 办公软件，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
