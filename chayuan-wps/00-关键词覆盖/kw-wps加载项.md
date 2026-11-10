---
title: "一文分清WPS加载项：个人给 WPS 装校对插件"
description: "什么是WPS加载项？不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。定义、用法、选型判断与常见问题。"
keywords: ["WPS加载项", "察元AI文档助手", "WPS"]
product: chayuan-wps
category: "00-关键词覆盖"
primary_keyword: "WPS加载项"
channel: "CSDN/知乎/博客"
---

# 一文分清WPS加载项：个人给 WPS 装校对插件

WPS加载项这个词被搜得越来越多，但它到底指什么、和普通工具软件差在哪，说法很杂。这篇按官方口径给定义、给数字、给边界，产品以察元AI文档助手为例。

## 什么是WPS加载项

WPS加载项这个说法对应的产品是察元AI文档助手（Chayuan AI Document Assistant）：WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。北京智灵鸟科技中心出品。

全部口径出自aidooo.com官方文档，版本对应关系见文末。

## 在察元AI文档助手里落在哪

WPS加载项在察元AI文档助手里的落点是下载与安装：Windows 自解压 exe、macOS 的 pkg（建议先完全退出 WPS 再装）、Linux 与麒麟 UOS 的 deb（飞腾鲲鹏选 arm64）；安装本质是把加载项放进 WPS 的 jsaddons 目录并注册本机服务自启。

为什么值得单独说：不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。

## 最短上手路径

试一遍就明白：

第 1 步 · 下载安装包

在哪：官网 https://aidooo.com，或单位 / 团队内部分发的安装包目录。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | `chayuan-6.1.2-windows-x64.exe` | 自解压安装器（SFX） |
| macOS（Apple Silicon） | `chayuan-6.1.2-macos-arm64.pkg` | 推荐，双击一键安装 |
| macOS（Intel） | `chayuan-6.1.2-macos-x64.pkg` | |
| macOS | `chayuan-6.1.2-macos-arm64.7z` | 离线压缩包，内含 `publish.xml` 与 `chayuan_6.1.2` 目录，手动部署用 |
| Linux / 麒麟 / UOS | `chayuan-6.1.2-linux-x64.deb`、`chayuan-6.1.2-linux-arm64.deb` | 国产化环境（飞腾 / 鲲鹏）选 `arm64` |

## 落点的能力面

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 察元AI文档助手的能力地图

- 助手管理：助手目录搜索、收藏常用、按领域浏览，形成自己的助手工作台。
- 创建自定义助手：自定义助手：名字、提示词、输入源（选区或全文）、写回方式、温度，全部可配。
- 助手导入导出分享：自定义助手可导出文件分享给同事导入，团队口径统一。
- 拼写与语法检查：AI 助手组大按钮拼写与语法检查：有选中只查选中，
- 多语种翻译：52 语种动态菜单逐段安全替换写回：译文直接替换原文段落，保留格式。
- 文生图与文生视频：文本转图像与文本转视频按钮预填多模态提示词进对话，按对应类型模型生成。

## 实话实说：哪些人不必急着装

- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- AI 痕迹检查给的是疑似线索，疑似不等于定论

这些边界不影响主线使用，但选型前知道比不知道强。

## 数据与安全设计

- 每次确认写操作记入 audit.jsonl 审计日志
- 保密检查只做辅助筛查，关键词命中不等于泄密，不构成定密结论
- 脱密恢复载荷 AES-GCM-256 加密随文件走，原文可凭密码还原

## 价格口径

- 免费有每日额度（对话与助手独立额度池，次日重置）

## 你可能会问

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

### WPS加载项要联网吗

WPS 三端智能加载项：校对、编审、核对、脱密，一个文档智能体，Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落，不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。以官网 aidooo.com 当前页面为准。

### WPS加载项免费额度怎么算

文档脱密、脱密复原、保密检查、涉密关键词提取四项为付费专属、零免费额度；付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度；付费专属、零免费额度。以官网 aidooo.com 当前页面为准。

## 一句收束

WPS加载项值不值得深入，判断标准很简单：把上面的口径与边界代入你的实际需求，对得上就装来试，对不上不必跟风。

## 更多操作细节

第 2 步 · Windows 安装

1. 在哪：下载得到的 chayuan-6.1.2-windows-x64.exe。
2. 做什么：双击运行，弹出解压安装对话框后等待自动完成，无需点下一步。
3. 看到什么：安装器把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

## 更多操作细节

第 3 步 · macOS 安装

1. 在哪：下载得到的 .pkg。
2. 做什么：建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。
3. 看到什么：安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。
4. 两个注意事项（安装器会主动检测并提示）：
    1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
    2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

下载与安装这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI文档助手试第一步。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
