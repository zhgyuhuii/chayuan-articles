---
title: "Office Linux安装装机指南：三平台五形态安装包"
description: "Office Linux安装指南：察元AI Office按平台架构的安装步骤、验证方法与排错。"
keywords: ["Office Linux安装", "察元AI Office", "下载安装", "deb", "AppImage"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "Office Linux安装"
channel: "CSDN/知乎/博客"
---

# Office Linux安装装机指南：三平台五形态安装包

Office Linux安装的麻烦不在功能本身，在于信息散。开源办公套件能离线装、信创环境能跑，是替换传统办公链路的第一步。这篇把它收拢成一条能照着走的路径。

## 安装前确认

- 系统要求：deb/rpm/AppImage；AppImage 需 glibc 2.34+
- 安装包：deb/rpm/AppImage（x64/arm64）
- 说明：deb rpm AppImage 三形态。

安装包从官网 aidooo.com 获取或 GitHub Releases，其他站点均非官方渠道。

## 一步步来

1. 官网下载对应包
2. deb 用 dpkg -i，AppImage 加执行权限直接运行
3. 麒麟/UOS 走 AppImage 加 deb，免 root
4. 配合本地模型端点可实现离线办公

## 其他平台装法速览

Windows：官网 aidooo.com 或 GitHub Releases 下载 exe；双击安装；启动后在设置里配置模型供应商（BYOK）或指向本机 Ollama。

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | Windows 10 及以上，x64/arm64 | NSIS 安装器 exe |
| macOS | macOS 11 及以上，Apple Silicon/Intel | dmg 与 zip |
| Linux | deb/rpm/AppImage；AppImage 需 glibc 2.34+ | deb/rpm/AppImage（x64/arm64） |

## 装完后的第一件事

开始页新建一个 docx，在设置模型里接上厂商 API 或本机 Ollama，再让首页 AI 生成一段测试文本——三步都通，环境就绪。

## 做完后的验证

- 开始页能新建六种格式文档，设置里模型可配置
- 若没有生效，先完全退出宿主软件再重启一次

## 注意事项与真实边界

用之前要认的账：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 常见问题

### 欢迎引导被我关掉了，想再看一遍怎么办？

引导只出现一次，界面不提供「重看引导」入口。想系统了解产品，按 F1 打开内置图文手册（18 主题，可搜索），见产品内的对应手册。

## 更多操作细节

第 2 步 · 安装并启动

1. macOS：挂载 dmg，把察元AI Office 图标拖入 Applications，首次从启动台/应用程序打开；
2. Windows：运行 .exe 安装向导，按提示选择目录完成安装，从开始菜单/桌面打开；
3. Linux：按上表命令安装，或对 .AppImage 加执行权限后直接运行（无需安装、无需 root）。

## 动手前再核对一遍

- 操作系统：Windows 10+、macOS 11+、Linux（含麒麟/UOS，AppImage 要求 glibc 2.34+）。
- 官方下载渠道只有两个：察元AI 官网 https://aidooo.com/ （产品页 · 下载中心），以及本仓库 GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice/releases/latest 。除这两处外，任何站点的安装包均非官方分发。
- 试用与授权：官方安装包自带 90 天免费试用，到期后每日一次温和提醒、不锁功能；可用离线短序列号激活（绑定机器指纹，无需激活服务器，内网可用）；同机已购察元AI OS 自动联动免激活。详见产品内的对应手册。

## 这几条能力放一起看更清楚

- 三平台五形态安装包
- 免 root 可装
- 麒麟与 UOS 走 AppImage 加 deb

## 放回产品盘面看

把Office Linux安装放回察元AI Office的整体盘面：API Key 存本机 ai-settings.json 不上传，支持环境变量引用，开始页签转换下拉五项：PDF 转 Word、Excel、PPT、Markdown、HTML；扫描页转 PPT 与 Excel 文字不可编辑；Linux 无系统 OCR 引擎，扫描页保留位图不识别。

## 安全与数据边界

安全口径单独立一层：全部本机完成（PDFium 字符级提取加纯几何版面分析）；证书加密 PDF 无法转换，搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；同机察元AI OS 已激活则 Office 免激活。

## 价格与授权

价格口径一并交代：API Key 存本机 ai-settings.json 不上传，支持环境变量引用，三平台五形态安装包；开始页签转换下拉五项：PDF 转 Word、Excel、PPT、Markdown、HTML，扫描页转 PPT 与 Excel 文字不可编辑。

## 几条硬数字

能落到数字上的几条：通用对话要自己写提示词，领域助手把行业knowhow固化成一键执行，壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具；API Key 存本机 ai-settings.json 不上传，支持环境变量引用；三平台五形态安装包。

## 离线与内网

离线内网这条线的口径：AI 挂了自动降 9 类本地正则兜底；本地转换意味着合同不出机器，这是与在线转换服务的本质区别，服务器部署全员浏览器可用，是团队化办公的形态，同机察元AI OS 已激活则 Office 免激活。

## 能力总账

把察元AI Office的能力总账摊开：Linux 无系统引擎不识别，知识库五级自动发现，注册表端口 52584，检索上下文预算默认 12000 字；扫描页转 PPT 与 Excel 文字不可编辑，十分区设置地图：通用、语言（22 种）、主题、模型、知识库、隐私等，通用区逐项可调。

## 多交代一层背景

安全口径单独立一层：全部本机完成（PDFium 字符级提取加纯几何版面分析）；证书加密 PDF 无法转换，搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档。

## 再往深一层看

能落到数字上的几条：通用对话要自己写提示词，领域助手把行业knowhow固化成一键执行；壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具；API Key 存本机 ai-settings.json 不上传，支持环境变量引用。

## 补充几条口径

离线内网这条线的口径：AI 挂了自动降 9 类本地正则兜底；本地转换意味着合同不出机器，这是与在线转换服务的本质区别；服务器部署全员浏览器可用，是团队化办公的形态。

## 顺带说清的几件事

把察元AI Office的能力总账摊开：Linux 无系统引擎不识别，知识库五级自动发现，注册表端口 52584，检索上下文预算默认 12000 字；扫描页转 PPT 与 Excel 文字不可编辑。

## 什么情况下还会用到

个人替换订阅制办公软件，政企内网批量装机。

## 大家都怎么问

- 察元AI Office 在哪里下载？哪些下载站是官方的？
- 麒麟/UOS 系统装哪个包？需要 root 吗？
- 第一次打开弹出的三页欢迎是什么，必须看完吗？

### Office Linux安装要联网吗

扫描页转 PPT 与 Excel 文字不可编辑；同机察元AI OS 已激活则 Office 免激活；覆盖 Windows/macOS/Linux（含麒麟/UOS）。以官网 aidooo.com 当前页面为准。

### Office Linux安装支持哪些格式

覆盖 Windows/macOS/Linux（含麒麟/UOS）；chaoffice 命令行 17 个子命令，Linux 无系统 OCR 引擎，扫描页保留位图不识别。以官网 aidooo.com 当前页面为准。

如果只记一件事：三平台五形态安装包。剩下的细节，照步骤节走就行。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
