---
title: "版本号解读（察元Office）"
alt-titles: ["软件版本号｜察元Office上手笔记","关于软件版本号，看这一篇就够（察元AI Office）"]
description: "软件版本号相关指南：察元AI Office（https://aidooo.com）。版本号解读。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["软件版本号","察元AI Office","下载","安装"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "软件版本号"
channel: "CSDN/知乎/博客/公众号"
---
# 版本号解读（察元Office）

自有版本.上游版本 六段式含义。本文以「版本号解读」为主题，给出察元AI Office的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice。系统要求总览：macOS——macOS 11+；Apple Silicon（arm64）为主，x64 需构建开关开启；Windows——Windows 10+（x64；ARM64 支持需构建开关）；Linux（Debian/Ubuntu 系）——glibc 2.34+（Ubuntu 22.04+）；x64 与 arm64（UOS/Ubuntu ARM 实测）；Linux（Fedora/RHEL/openSUSE 系）——glibc 2.34+（Fedora 35+/RHEL 9+/Leap 15.6+）；Linux（通用/其他发行版）——glibc 2.34+、FUSE 2（Ubuntu 24.04 需装 libfuse2t64）。

## 通用流程（以 Windows 为例）

自有版本.上游版本 六段式含义

1. 下载 ChaAIOffice-Setup-<版本>.exe
2. 双击运行 NSIS 向导，按需修改安装目录（默认支持自定义）
3. 完成后开始菜单与桌面出现察元AI Office 入口
4. 文件关联覆盖 docx/xlsx/pptx/pdf/md/html 等格式，双击即用本套件打开

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 双击 docx 没用本套件打开？——安装器已注册 docx/xlsx/xlsm/xls/csv/pptx/pdf/md/html 关联；被其他软件抢占时在系统「默认应用」里重新指回察元AI Office。
- 更新检查没反应？——更新通道为启动 30 秒后每 4 小时查询官网 API；断网时静默失败不影响使用，可手动到 GitHub Releases 下载新版覆盖安装。
- Linux 提示 glibc 版本过低？——套件要求 glibc 2.34+（Ubuntu 22.04+/RHEL 9+/Leap 15.6+）；老系统建议升级发行版，或在容器内运行。

## 离线运行与部署形态

文档编辑与格式转换完全本地化：打开、编辑、保存不出机器；PDF 转 Word/PPT/Excel 由内置 PDFium 引擎做字符级提取与几何版面分析，全程离线、无云端参与，扫描件 OCR 也走系统本地引擎（macOS 用 Vision，Windows 用系统 OCR），适合对数据敏感的政企与个人用户。

## 数据安全与隐私边界

- 文档打开/编辑/保存全程本机完成，不经任何服务器
- AI 默认不启用：配了 Key 或本地端点才会把对话内容发往所配服务商
- PDF→Word/PPT/Excel 转换与 OCR 均为本地引擎，扫描件不上传
- 遥测仅匿名统计且可一键关闭，永不收集文档内容与身份信息

## 费用与授权的边界（如实说明）

开源 Apache-2.0 + 可选授权支持（桌面版 90 天免费试用后温和提醒）。免费部分：apps 编辑器本身免费开源、可自行构建；官方安装包提供 90 天免费试用期。付费部分：试用期满后每日一次购买提醒弹窗（可手动关闭）+ 主页每 30 分钟温和提醒；离线 HMAC 短序列号激活，绑定机器指纹本地验证，无需联网激活服务器

## 常见问题
### UOS/ARM 机器安装报架构不符？

确认设备架构（飞腾/鲲鹏为 arm64）并下载 arm64 包；早期 electron-builder 默认出 x64 包的问题已在打包脚本修复，现按宿主架构出包。

### AI 功能需要联网吗？

AI 需要配置模型：云端供应商（DeepSeek、Kimi、GLM、Qwen 等）需联网；配 Ollama 等本地端点则断网可用。编辑、转换、导出等传统功能始终离线可用。

### AI 生成的内容可靠吗？

AI 负责初稿与改写，Docs 的改动有版本快照与 diff 可回滚；涉及数据与事实的内容务必人工核实，终稿责任在人。


## 相关阅读

- [安装失败怎么做？NSIS 装到一半失败一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-95aacfcd.md)
- [首次配置路线｜察元Office安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-18-ai.md)
- [在线办公部署怎么做？Docker 网页版部署一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-0ebc8778.md)
- [写给汇报人的AI生成PPT指南：清单式指南](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-3-report-5.md)
- [浏览器 SaaS 形态进阶技巧：从入口到完成的完整流程](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-26-web-form-3.md)
- [察元AI OS｜便签/日历/提醒/联系人怎么用：察元OS避坑指南](../../chayuan-os/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-23-pim-4.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI Office迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《软件版本号｜察元Office上手笔记》《关于软件版本号，看这一篇就够（察元AI Office）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
