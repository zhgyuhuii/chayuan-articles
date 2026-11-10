---
title: "Office Windows安装安装：NSIS 安装器步骤"
description: "Office Windows安装指南：察元AI Office按平台架构的安装步骤、验证方法与排错。"
keywords: ["Office Windows安装", "察元AI Office", "下载安装", "exe"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "Office Windows安装"
channel: "CSDN/知乎/博客"
---

# Office Windows安装安装：NSIS 安装器步骤

很多人搜「察元AI Office 在哪里下载？哪些下载站是官方的」，搜到的多是概念解释，落不到操作。这篇以察元AI Office为准，把Office Windows安装从打开哪个应用讲到看到什么结果。

## 安装前确认

- 系统要求：Windows 10 及以上，x64/arm64
- 安装包：NSIS 安装器 exe
- 说明：NSIS 安装器步骤。

安装包从官网 aidooo.com 获取或 GitHub Releases，其他站点均非官方渠道。

## 实操全过程

1. 官网 aidooo.com 或 GitHub Releases 下载 exe
2. 双击安装
3. 启动后在设置里配置模型供应商（BYOK）或指向本机 Ollama
4. 开始页新建或打开文档

## 其他平台装法速览

Linux：官网下载对应包；deb 用 dpkg -i，AppImage 加执行权限直接运行；麒麟/UOS 走 AppImage 加 deb，免 root。

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | Windows 10 及以上，x64/arm64 | NSIS 安装器 exe |
| macOS | macOS 11 及以上，Apple Silicon/Intel | dmg 与 zip |
| Linux | deb/rpm/AppImage；AppImage 需 glibc 2.34+ | deb/rpm/AppImage（x64/arm64） |

## 装完后的第一件事

装完先验证六编辑器都能新建（docx/xlsx/pptx/PDF/Markdown/HTML），再配模型跑一次 AI 校对；格式与 AI 两条线都通再开始日常用。

## 如何确认操作生效

- 开始页能新建六种格式文档，设置里模型可配置
- 若没有生效，先完全退出宿主软件再重启一次

## 注意事项与真实边界

边界先摆在桌面上：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 接着回答几个常见问题

### 第三方下载站 mirror 的安装包能用吗？

不能保证。官方分发只有 aidooo.com 与本仓库 GitHub Releases 两处，其余站点均非官方分发，存在被篡改风险，请从官方渠道重新下载。

### 麒麟/UOS 上装哪个包？要联网吗？

选 .AppImage（免 root、离线友好，要求 glibc 2.34+）或 .deb。下载一次后可拷贝到内网机器直接安装/运行，应用本体不依赖联网。

### 90 天试用到期会锁功能吗？要注册账号吗？

不锁功能。到期后每日一次温和提醒（可关闭），不购买也完全不影响使用；购买走离线短序列号，内网无激活服务器也能激活。使用 AI 的云端能力需在设置中配置模型或登录账号，见产品内的对应手册产品内的对应手册。

## 更多操作细节

第 1 步 · 下载安装包

打开官网 aidooo.com 下载中心（或 GitHub Releases），按平台选择：

| 平台 | 安装包 | 说明 |
|---|---|---|
| macOS | `.dmg`（另有 `.zip`） | macOS 11+；打开 dmg 后把应用拖入「应用程序」 |
| Windows | `.exe`（NSIS 安装向导） | Windows 10+；可选择安装目录；安装时注册 docx/xlsx/pptx/pdf/md/html 文件关联 |
| Linux（Debian/Ubuntu） | `.deb` | `sudo apt install ./…` |
| Linux（Fedora/RHEL/openSUSE） | `.rpm` | 用 `dnf` / `zypper` 安装 |
| Linux（麒麟/UOS/通用） | `.AppImage`（另有 `.deb`/`.arm64`） | 免 root、离线友好，适合信创与内网环境 |

## 更多操作细节

第 2 步 · 安装并启动

1. macOS：挂载 dmg，把察元AI Office 图标拖入 Applications，首次从启动台/应用程序打开；
2. Windows：运行 .exe 安装向导，按提示选择目录完成安装，从开始菜单/桌面打开；
3. Linux：按上表命令安装，或对 .AppImage 加执行权限后直接运行（无需安装、无需 root）。

## 更多操作细节

第 3 步 · 首次启动：三页欢迎引导

启动后进入主页（标签条第一格是带产品 logo 的「察元AIOffice」首页标签）。首次启动会自动弹出一层欢迎引导，共三页，底部有圆点指示（悬停显示「第 {n} 页，共 3 页」），可点圆点直接跳页：

页面底部按钮：

键盘操作：Esc 等同「跳过」，Enter 或 ＞ 下一页，＜ 上一页。

无论按哪种方式结束（跳过、开始使用、Esc），完成标记都会保存，之后启动不再自动弹出；引导只在首页标签激活时显示，按 F1 打开的应用内手册不弹引导。

1. 第 1 页：标题「欢迎使用 察元AIOffice」，副标题「第一个开源的 AI 原生 Office 套件」，正文「创建文档、制作表格、生成演示、审阅 PDF。AI 深度融入每个环节。」；
2. 第 2 页：标题「这只是一个开始」，正文介绍产品处于 alpha 阶段、欢迎加入 GenTeam 群聊分享反馈；下方是二维码面板：「扫码关注 「智灵鸟科技」」「获取更新与教程，你的反馈会进入开发清单」；
3. 第 3 页：标题「人人免费」，正文「无授权费用，无广告，无水印。」；下方提示「如果你喜欢 察元AIOffice，欢迎到 GitHub 给我们一个 Star。」，按钮「去 GitHub 点 Star」会打开 GitHub 仓库。
4. 「下一步」翻到下一页；到最后一页时变为「开始使用」，点击结束引导；
5. 「上一步」（第 2 页起出现）回到上一页；
6. 「跳过」随时结束引导。

## 更多操作细节

验证

1. 启动应用后能看到标签条第一格为「察元AIOffice」首页标签，首次启动出现上述三页引导，三页标题依次为「欢迎使用 察元AIOffice」「这只是一个开始」「人人免费」。
2. 点「跳过」或「开始使用」后引导关闭；关闭应用重新打开，引导不再出现。

## 补充答疑

### 欢迎引导被我关掉了，想再看一遍怎么办？

引导只出现一次，界面不提供「重看引导」入口。想系统了解产品，按 F1 打开内置图文手册（18 主题，可搜索），见产品内的对应手册。

## 动手前再核对一遍

- 操作系统：Windows 10+、macOS 11+、Linux（含麒麟/UOS，AppImage 要求 glibc 2.34+）。
- 官方下载渠道只有两个：察元AI 官网 https://aidooo.com/ （产品页 · 下载中心），以及本仓库 GitHub Releases https://github.com/zhgyuhuii/ChayuanAIOffice/releases/latest 。除这两处外，任何站点的安装包均非官方分发。
- 试用与授权：官方安装包自带 90 天免费试用，到期后每日一次温和提醒、不锁功能；可用离线短序列号激活（绑定机器指纹，无需激活服务器，内网可用）；同机已购察元AI OS 自动联动免激活。详见产品内的对应手册。

## 这几条能力放一起看更清楚

- 三平台五形态安装包
- 免 root 可装
- 麒麟与 UOS 走 AppImage 加 deb

## 安全与数据边界

安全口径单独立一层：邮件页签批量套打（数据源合并成信函标签），九种图表加推荐图表、图表库、数据透视图与迷你图，真图表对象直接存进 xlsx；图表是活的（对象级）不是贴图，改数据图跟着变；加密只读文档仅支持查看。

## 平台与形态

平台与形态的账：Linux 无系统 OCR 引擎，扫描页保留位图不识别；Linux 无系统引擎不识别；扫码到 aidooo.com 购买页下单，doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx。

下载安装与首次启动这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI Office试第一步。

---

察元AI Office，开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器。官网 aidooo.com，数据截至 2026 年 10 月（版本 1.0.15）。
